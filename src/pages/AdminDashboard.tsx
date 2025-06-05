import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Trash2, Download, FileText, Home, Plus, Database } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LeaderboardEntry } from '../types/leaderboard';
import { AdminPagination } from '../components/AdminPagination';
import { BulkEditEntries } from '../components/BulkEditEntries';

const AdminDashboard = () => {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [recentEntries, setRecentEntries] = useState<LeaderboardEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [showSampleData, setShowSampleData] = useState(false);
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const entriesPerPage = 10;

  // Manual form state
  const [formData, setFormData] = useState({
    ai_system: '',
    organization: '',
    system_type: '',
    arc_agi_1: '',
    arc_agi_2: '',
    cost_per_task: '',
    code_paper_link: ''
  });

  const fetchData = async () => {
    try {
      const { data: allData, error } = await supabase
        .from('leaderboard_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setData(allData || []);
      setTotalEntries(allData?.length || 0);
    } catch (error) {
      console.error('Fetch data error:', error);
    }
  };

  const fetchRecentEntries = async (page: number) => {
    setLoading(true);
    try {
      const offset = (page - 1) * entriesPerPage;
      const { data: entries, error, count } = await supabase
        .from('leaderboard_entries')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + entriesPerPage - 1);

      if (error) throw error;

      setRecentEntries(entries || []);
      setTotalPages(Math.ceil((count || 0) / entriesPerPage));
    } catch (error) {
      console.error('Fetch recent entries error:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    fetchRecentEntries(1);
  }, []);

  useEffect(() => {
    fetchRecentEntries(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const refreshData = async () => {
    await fetchData();
    await fetchRecentEntries(currentPage);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    try {
      const text = await file.text();
      let newData;

      if (file.name.endsWith('.json')) {
        const jsonData = JSON.parse(text);
        
        if (jsonData.rows && jsonData.headers) {
          newData = jsonData.rows.map((row: any[]) => ({
            ai_system: row[0],
            organization: row[1],
            system_type: row[2],
            arc_agi_1: parseFloat(row[3]?.replace('%', '')) || null,
            arc_agi_2: parseFloat(row[4]?.replace('%', '')) || null,
            cost_per_task: parseFloat(row[5]?.replace('$', '')) || 0,
            code_paper_link: row[6] === '—' ? null : row[6],
          }));
        } else {
          newData = jsonData;
        }
      } else if (file.name.endsWith('.csv')) {
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        newData = lines.slice(1).filter(line => line.trim()).map((line) => {
          const values = line.split(',').map(v => v.trim());
          return {
            ai_system: values[0] || '',
            organization: values[1] || '',
            system_type: values[2] || 'Unknown',
            arc_agi_1: parseFloat(values[3]?.replace('%', '')) || null,
            arc_agi_2: parseFloat(values[4]?.replace('%', '')) || null,
            cost_per_task: parseFloat(values[5]?.replace('$', '')) || 0,
            code_paper_link: values[6] === '—' ? null : values[6],
          };
        });
      }

      if (newData && newData.length > 0) {
        const { error } = await supabase
          .from('leaderboard_entries')
          .insert(newData);

        if (error) {
          throw error;
        }

        await refreshData();
        toast.success(`Successfully uploaded ${newData.length} entries`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file. Please check the format.');
    }
    
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('leaderboard_entries')
        .insert([{
          ai_system: formData.ai_system,
          organization: formData.organization,
          system_type: formData.system_type,
          arc_agi_1: parseFloat(formData.arc_agi_1) || null,
          arc_agi_2: parseFloat(formData.arc_agi_2) || null,
          cost_per_task: parseFloat(formData.cost_per_task) || 0,
          code_paper_link: formData.code_paper_link || null,
        }]);

      if (error) throw error;

      await refreshData();
      toast.success('Entry added successfully');
      setFormData({
        ai_system: '',
        organization: '',
        system_type: '',
        arc_agi_1: '',
        arc_agi_2: '',
        cost_per_task: '',
        code_paper_link: ''
      });
      setShowManualForm(false);
    } catch (error) {
      console.error('Manual entry error:', error);
      toast.error('Failed to add entry');
    }
  };

  const handleClearData = async () => {
    if (confirm('Are you sure you want to delete all data? This action cannot be undone.')) {
      try {
        const { error } = await supabase
          .from('leaderboard_entries')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000');
        
        if (error) throw error;
        
        await refreshData();
        toast.success('All data cleared successfully');
      } catch (error) {
        console.error('Clear data error:', error);
        toast.error('Failed to clear data');
      }
    }
  };

  const handleExportData = () => {
    if (!data) return;
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leaderboard-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin');
    toast.success('Logged out successfully');
  };

  const avgScore = data && data.length > 0 
    ? (data.reduce((sum, item) => sum + (item.arc_agi_1 || 0), 0) / data.length).toFixed(1)
    : 0;

  const uniqueOrgs = data ? new Set(data.map(item => item.organization)).size : 0;

  const sampleData = {
    json: `{
  "headers": [
    "AI System",
    "Organization", 
    "System Type",
    "ARC-AGI-1",
    "ARC-AGI-2",
    "Cost/Task",
    "Code / Paper"
  ],
  "rows": [
    ["GPT-4o", "OpenAI", "Base LLM", "4.5%", "0.0%", "$0.080", "link"],
    ["Claude 3.5", "Anthropic", "CoT", "28.6%", "0.7%", "$0.510", "link"]
  ]
}`,
    csv: `AI System,Organization,System Type,ARC-AGI-1,ARC-AGI-2,Cost/Task,Code / Paper
GPT-4o,OpenAI,Base LLM,4.5%,0.0%,$0.080,link
Claude 3.5,Anthropic,CoT,28.6%,0.7%,$0.510,link`
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ADMIN DASHBOARD
            </h1>
            <p className="text-muted-foreground mt-2">Manage VIBE CODERS Leaderboard Data</p>
          </div>
          <div className="flex gap-2">
            <Link to="/">
              <Button variant="outline" className="gap-2">
                <Home className="w-4 h-4" />
                Home
              </Button>
            </Link>
            <Button onClick={handleLogout} variant="outline" className="gap-2">
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Models</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalEntries}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg VIBE CODERS 1 Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{avgScore}%</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Organizations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{uniqueOrgs}</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <Button onClick={() => setShowManualForm(!showManualForm)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Manual Entry
          </Button>
          <Button onClick={() => setShowSampleData(!showSampleData)} variant="outline" className="gap-2">
            <Database className="w-4 h-4" />
            View Sample Data Format
          </Button>
          <Button onClick={() => setShowBulkEdit(!showBulkEdit)} variant="outline" className="gap-2">
            Bulk Edit Entries
          </Button>
        </div>

        {/* Sample Data Format */}
        {showSampleData && (
          <Card className="bg-card/50 backdrop-blur-sm border-border mb-8">
            <CardHeader>
              <CardTitle>Sample Data Formats</CardTitle>
              <CardDescription>Use these formats when uploading data files</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">JSON Format:</h4>
                <Textarea value={sampleData.json} readOnly className="h-32 font-mono text-sm" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">CSV Format:</h4>
                <Textarea value={sampleData.csv} readOnly className="h-20 font-mono text-sm" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Manual Entry Form */}
        {showManualForm && (
          <Card className="bg-card/50 backdrop-blur-sm border-border mb-8">
            <CardHeader>
              <CardTitle>Add Manual Entry</CardTitle>
              <CardDescription>Manually add a new leaderboard entry</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleManualSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ai_system">AI System</Label>
                  <Input
                    id="ai_system"
                    value={formData.ai_system}
                    onChange={(e) => setFormData({...formData, ai_system: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => setFormData({...formData, organization: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="system_type">System Type</Label>
                  <Input
                    id="system_type"
                    value={formData.system_type}
                    onChange={(e) => setFormData({...formData, system_type: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="arc_agi_1">VIBE CODERS 1 (%)</Label>
                  <Input
                    id="arc_agi_1"
                    type="number"
                    step="0.1"
                    value={formData.arc_agi_1}
                    onChange={(e) => setFormData({...formData, arc_agi_1: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="arc_agi_2">VIBE CODERS 2 (%)</Label>
                  <Input
                    id="arc_agi_2"
                    type="number"
                    step="0.1"
                    value={formData.arc_agi_2}
                    onChange={(e) => setFormData({...formData, arc_agi_2: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="cost_per_task">Cost per Task ($)</Label>
                  <Input
                    id="cost_per_task"
                    type="number"
                    step="0.001"
                    value={formData.cost_per_task}
                    onChange={(e) => setFormData({...formData, cost_per_task: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="code_paper_link">Code/Paper Link</Label>
                  <Input
                    id="code_paper_link"
                    value={formData.code_paper_link}
                    onChange={(e) => setFormData({...formData, code_paper_link: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2 flex gap-2">
                  <Button type="submit">Add Entry</Button>
                  <Button type="button" variant="outline" onClick={() => setShowManualForm(false)}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Bulk Edit */}
        {showBulkEdit && (
          <div className="mb-8">
            <BulkEditEntries entries={recentEntries} onUpdate={refreshData} />
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Upload Data */}
          <Card className="bg-card/50 backdrop-blur-sm border-border cyber-gradient">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Upload Data
              </CardTitle>
              <CardDescription>Upload JSON or CSV files to update the leaderboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full"
                variant="outline"
              >
                {uploading ? 'Uploading...' : 'Choose File'}
              </Button>
              <div className="text-sm text-muted-foreground">
                Supported formats: JSON, CSV
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-secondary" />
                Data Management
              </CardTitle>
              <CardDescription>Export or clear all leaderboard data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleExportData}
                className="w-full"
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data (JSON)
              </Button>
              <Button
                onClick={handleClearData}
                className="w-full"
                variant="destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Entries with Pagination */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle>Recent Entries ({totalEntries} total)</CardTitle>
            <CardDescription>Latest entries in the leaderboard with pagination</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-2">AI System</th>
                        <th className="text-left p-2">Organization</th>
                        <th className="text-left p-2">Type</th>
                        <th className="text-left p-2">VIBE CODERS 1</th>
                        <th className="text-left p-2">VIBE CODERS 2</th>
                        <th className="text-left p-2">Cost/Task</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentEntries.map((entry) => (
                        <tr key={entry.id} className="border-b border-border/50">
                          <td className="p-2 font-medium">{entry.ai_system}</td>
                          <td className="p-2 text-muted-foreground">{entry.organization}</td>
                          <td className="p-2">
                            <Badge variant="outline" className="text-xs">
                              {entry.system_type}
                            </Badge>
                          </td>
                          <td className="p-2 font-bold text-primary">{entry.arc_agi_1?.toFixed(1) || 'N/A'}%</td>
                          <td className="p-2">{entry.arc_agi_2?.toFixed(1) || 'N/A'}%</td>
                          <td className="p-2">${entry.cost_per_task?.toFixed(3) || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <AdminPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
