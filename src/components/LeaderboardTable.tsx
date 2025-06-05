
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LeaderboardEntry } from '../types/leaderboard';
import { Search, ArrowUpDown, ExternalLink, Bookmark } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
}

export const LeaderboardTable = ({ data }: LeaderboardTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof LeaderboardEntry>('arc_agi_1');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [bookmarkCategory, setBookmarkCategory] = useState('General');
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  const { user } = useAuth();

  const handleSort = (field: keyof LeaderboardEntry) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(entry =>
      entry.ai_system.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.organization.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      const aStr = String(aValue || '').toLowerCase();
      const bStr = String(bValue || '').toLowerCase();
      return sortDirection === 'asc' 
        ? aStr.localeCompare(bStr) 
        : bStr.localeCompare(aStr);
    });

    return filtered;
  }, [data, searchTerm, sortField, sortDirection]);

  const addBookmark = async () => {
    if (!user || !selectedModelId) return;

    try {
      const { error } = await supabase.from('user_bookmarks').insert({
        user_id: user.id,
        model_id: selectedModelId,
        category_name: bookmarkCategory
      });

      if (error) throw error;
      
      toast.success('Model bookmarked successfully!');
      setShowBookmarkDialog(false);
      setBookmarkCategory('General');
    } catch (error: any) {
      toast.error('Failed to bookmark model: ' + error.message);
    }
  };

  const getSystemTypeBadge = (systemType: string) => {
    const colors = {
      'CoT': 'bg-green-500/20 text-green-400 border-green-500/50',
      'CoT + Synthesis': 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      'Base LLM': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      'Custom': 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      'N/A': 'bg-gray-500/20 text-gray-400 border-gray-500/50',
    };
    return colors[systemType as keyof typeof colors] || 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  };

  return (
    <div className="space-y-4 p-6 animate-fade-in-up">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search models or organizations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-background/50 border-border"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-3">Rank</th>
              <th className="text-left p-3">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('ai_system')}
                  className="hover:text-primary"
                >
                  AI System <ArrowUpDown className="w-4 h-4 ml-1" />
                </Button>
              </th>
              <th className="text-left p-3">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('organization')}
                  className="hover:text-primary"
                >
                  Organization <ArrowUpDown className="w-4 h-4 ml-1" />
                </Button>
              </th>
              <th className="text-left p-3">System Type</th>
              <th className="text-left p-3">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('arc_agi_1')}
                  className="hover:text-primary"
                >
                  VIBE CODERS 1 % <ArrowUpDown className="w-4 h-4 ml-1" />
                </Button>
              </th>
              <th className="text-left p-3">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('arc_agi_2')}
                  className="hover:text-primary"
                >
                  VIBE CODERS 2 % <ArrowUpDown className="w-4 h-4 ml-1" />
                </Button>
              </th>
              <th className="text-left p-3">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('cost_per_task')}
                  className="hover:text-primary"
                >
                  Cost/Task <ArrowUpDown className="w-4 h-4 ml-1" />
                </Button>
              </th>
              <th className="text-left p-3">Links</th>
              {user && <th className="text-left p-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.map((entry, index) => (
              <tr
                key={entry.id}
                className="border-b border-border/50 hover:bg-muted/20 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <td className="p-3 font-bold text-primary">#{index + 1}</td>
                <td className="p-3 font-medium">{entry.ai_system}</td>
                <td className="p-3 text-muted-foreground">{entry.organization}</td>
                <td className="p-3">
                  <Badge className={getSystemTypeBadge(entry.system_type)}>
                    {entry.system_type}
                  </Badge>
                </td>
                <td className="p-3 font-bold text-secondary">{entry.arc_agi_1?.toFixed(1) || 'N/A'}%</td>
                <td className="p-3">{entry.arc_agi_2?.toFixed(1) || 'N/A'}%</td>
                <td className="p-3">${entry.cost_per_task?.toFixed(2) || 'N/A'}</td>
                <td className="p-3">
                  {entry.code_paper_link && entry.code_paper_link !== '—' && (
                    <Button size="sm" variant="ghost" asChild>
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </td>
                {user && (
                  <td className="p-3">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => {
                        setSelectedModelId(entry.id);
                        setShowBookmarkDialog(true);
                      }}
                    >
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedData.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No results found for "{searchTerm}"
        </div>
      )}

      <Dialog open={showBookmarkDialog} onOpenChange={setShowBookmarkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bookmark Model</DialogTitle>
            <DialogDescription>Add this model to your bookmarks with a category</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={bookmarkCategory}
                onChange={(e) => setBookmarkCategory(e.target.value)}
                placeholder="Enter category name"
              />
            </div>
            <Button onClick={addBookmark} className="w-full">Add Bookmark</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
