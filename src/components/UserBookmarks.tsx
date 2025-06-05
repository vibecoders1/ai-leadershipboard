import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Star, Bookmark, Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Bookmark {
  id: string;
  model_id: string;
  category_name: string;
  created_at: string;
  leaderboard_entries: {
    ai_system: string;
    organization: string;
    system_type: string;
    arc_agi_1: number;
    arc_agi_2: number;
  };
}

export const UserBookmarks = () => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const queryClient = useQueryClient();

  const { data: bookmarks = [], isLoading } = useQuery({
    queryKey: ['user-bookmarks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_bookmarks')
        .select(`
          *,
          leaderboard_entries (
            ai_system,
            organization,
            system_type,
            arc_agi_1,
            arc_agi_2
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Bookmark[];
    },
  });

  const removeBookmarkMutation = useMutation({
    mutationFn: async (bookmarkId: string) => {
      const { error } = await supabase
        .from('user_bookmarks')
        .delete()
        .eq('id', bookmarkId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-bookmarks'] });
      toast.success('Bookmark removed');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove bookmark');
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ bookmarkId, categoryName }: { bookmarkId: string; categoryName: string }) => {
      const { error } = await supabase
        .from('user_bookmarks')
        .update({ category_name: categoryName })
        .eq('id', bookmarkId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-bookmarks'] });
      toast.success('Category updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update category');
    },
  });

  const categories = [...new Set(bookmarks.map(b => b.category_name))];
  const filteredBookmarks = selectedCategory === 'all' 
    ? bookmarks 
    : bookmarks.filter(b => b.category_name === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Bookmarks</h2>
          <p className="text-muted-foreground">Organize and manage your favorite AI models</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredBookmarks.length === 0 ? (
        <Card className="text-center p-8">
          <Bookmark className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No bookmarks yet</h3>
          <p className="text-muted-foreground">
            Start bookmarking your favorite AI models from the leaderboard
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookmarks.map((bookmark) => (
            <Card key={bookmark.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{bookmark.leaderboard_entries.ai_system}</CardTitle>
                    <CardDescription>{bookmark.leaderboard_entries.organization}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBookmarkMutation.mutate(bookmark.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <Badge variant="secondary">{bookmark.leaderboard_entries.system_type}</Badge>
                  <Badge variant="outline">{bookmark.category_name}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">ARC-AGI 1:</span>
                    <div className="text-primary font-bold">
                      {bookmark.leaderboard_entries.arc_agi_1?.toFixed(1) || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">ARC-AGI 2:</span>
                    <div className="text-primary font-bold">
                      {bookmark.leaderboard_entries.arc_agi_2?.toFixed(1) || 'N/A'}
                    </div>
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="w-4 h-4 mr-2" />
                      Change Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Category</DialogTitle>
                      <DialogDescription>
                        Update the category for {bookmark.leaderboard_entries.ai_system}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Enter new category name"
                      />
                      <Button
                        onClick={() => {
                          if (newCategoryName.trim()) {
                            updateCategoryMutation.mutate({
                              bookmarkId: bookmark.id,
                              categoryName: newCategoryName.trim()
                            });
                            setNewCategoryName('');
                          }
                        }}
                        className="w-full"
                      >
                        Update Category
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};