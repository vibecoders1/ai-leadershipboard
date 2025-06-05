
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Edit, Save, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { LeaderboardEntry } from '../types/leaderboard';

interface BulkEditEntriesProps {
  entries: LeaderboardEntry[];
  onUpdate: () => void;
}

export const BulkEditEntries = ({ entries, onUpdate }: BulkEditEntriesProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<LeaderboardEntry>>({});
  const [loading, setLoading] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(entries.map(entry => entry.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectEntry = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const handleEdit = (entry: LeaderboardEntry) => {
    setEditingId(entry.id);
    setEditForm(entry);
  };

  const handleSave = async () => {
    if (!editingId || !editForm) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('leaderboard_entries')
        .update({
          ai_system: editForm.ai_system,
          organization: editForm.organization,
          system_type: editForm.system_type,
          arc_agi_1: editForm.arc_agi_1,
          arc_agi_2: editForm.arc_agi_2,
          cost_per_task: editForm.cost_per_task,
          code_paper_link: editForm.code_paper_link,
        })
        .eq('id', editingId);

      if (error) throw error;

      toast.success('Entry updated successfully');
      setEditingId(null);
      setEditForm({});
      onUpdate();
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update entry');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} entries?`)) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('leaderboard_entries')
        .delete()
        .in('id', selectedIds);

      if (error) throw error;

      toast.success(`${selectedIds.length} entries deleted successfully`);
      setSelectedIds([]);
      onUpdate();
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast.error('Failed to delete entries');
    }
    setLoading(false);
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Manage Entries</CardTitle>
            <CardDescription>Select and edit leaderboard entries</CardDescription>
          </div>
          {selectedIds.length > 0 && (
            <Button
              onClick={handleBulkDelete}
              variant="destructive"
              size="sm"
              disabled={loading}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected ({selectedIds.length})
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              checked={selectedIds.length === entries.length && entries.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <Label htmlFor="select-all" className="text-sm font-medium">
              Select All ({entries.length} entries)
            </Label>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {entries.map((entry) => (
              <div key={entry.id} className="border border-border rounded-lg p-4">
                {editingId === entry.id ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>AI System</Label>
                      <Input
                        value={editForm.ai_system || ''}
                        onChange={(e) => setEditForm({...editForm, ai_system: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Organization</Label>
                      <Input
                        value={editForm.organization || ''}
                        onChange={(e) => setEditForm({...editForm, organization: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>System Type</Label>
                      <Input
                        value={editForm.system_type || ''}
                        onChange={(e) => setEditForm({...editForm, system_type: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>VIBE CODERS 1 (%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={editForm.arc_agi_1 || ''}
                        onChange={(e) => setEditForm({...editForm, arc_agi_1: parseFloat(e.target.value) || null})}
                      />
                    </div>
                    <div>
                      <Label>VIBE CODERS 2 (%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={editForm.arc_agi_2 || ''}
                        onChange={(e) => setEditForm({...editForm, arc_agi_2: parseFloat(e.target.value) || null})}
                      />
                    </div>
                    <div>
                      <Label>Cost per Task ($)</Label>
                      <Input
                        type="number"
                        step="0.001"
                        value={editForm.cost_per_task || ''}
                        onChange={(e) => setEditForm({...editForm, cost_per_task: parseFloat(e.target.value) || null})}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Code/Paper Link</Label>
                      <Input
                        value={editForm.code_paper_link || ''}
                        onChange={(e) => setEditForm({...editForm, code_paper_link: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2 flex gap-2">
                      <Button onClick={handleSave} disabled={loading} size="sm" className="gap-2">
                        <Save className="w-4 h-4" />
                        Save
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm" className="gap-2">
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Checkbox
                        checked={selectedIds.includes(entry.id)}
                        onCheckedChange={(checked) => handleSelectEntry(entry.id, checked as boolean)}
                      />
                      <div>
                        <div className="font-medium">{entry.ai_system}</div>
                        <div className="text-sm text-muted-foreground">{entry.organization}</div>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{entry.system_type}</Badge>
                          <Badge variant="secondary">VIBE CODERS 1: {entry.arc_agi_1?.toFixed(1) || 'N/A'}%</Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleEdit(entry)}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
