
import { useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Bookmark } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const TextArena = () => {
  const [bookmarkCategory, setBookmarkCategory] = useState('Text Models');
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const { user } = useAuth();

  const textModels = [
    { rank: 1, model: "gemini-2.5-pro-preview-05-06", organization: "Google", score: 1446, votes: "6,115", ciScore: "+8/-6", license: "Proprietary" },
    { rank: 1, model: "o3-2025-04-16", organization: "OpenAI", score: 1435, votes: "7,921", ciScore: "+6/-8", license: "Proprietary" },
    { rank: 2, model: "chatgpt-4o-latest-20250326", organization: "OpenAI", score: 1422, votes: "10,280", ciScore: "+6/-8", license: "Proprietary" },
    { rank: 3, model: "gpt-4.5-preview-2025-02-27", organization: "OpenAI", score: 1417, votes: "15,276", ciScore: "+5/-4", license: "Proprietary" },
    { rank: 3, model: "gemini-2.5-flash-preview-05-20", organization: "Google", score: 1415, votes: "3,892", ciScore: "+8/-11", license: "Proprietary" },
    { rank: 6, model: "gemini-2.5-flash-preview-04-17", organization: "Google", score: 1394, votes: "6,938", ciScore: "+8/-7", license: "Proprietary" },
    { rank: 6, model: "gpt-4.1-2025-04-14", organization: "OpenAI", score: 1392, votes: "6,094", ciScore: "+7/-6", license: "Proprietary" },
    { rank: 6, model: "grok-3-preview-02-24", organization: "xAI", score: 1388, votes: "14,840", ciScore: "+6/-4", license: "Proprietary" },
    { rank: 6, model: "deepseek-v3-0324", organization: "DeepSeek", score: 1382, votes: "9,741", ciScore: "+6/-5", license: "MIT" },
    { rank: 6, model: "o4-mini-2025-04-16", organization: "OpenAI", score: 1379, votes: "6,102", ciScore: "+8/-8", license: "Proprietary" },
  ];

  const addBookmark = async () => {
    if (!user || !selectedModel) return;

    try {
      // Create a temporary model entry in leaderboard_entries if needed
      const { data: existingModel, error: findError } = await supabase
        .from('leaderboard_entries')
        .select('id')
        .eq('ai_system', selectedModel.model)
        .eq('organization', selectedModel.organization)
        .single();

      let modelId = existingModel?.id;

      if (!existingModel) {
        const { data: newModel, error: createError } = await supabase
          .from('leaderboard_entries')
          .insert({
            ai_system: selectedModel.model,
            organization: selectedModel.organization,
            system_type: 'N/A',
            arc_agi_1: null,
            arc_agi_2: null,
            cost_per_task: null
          })
          .select('id')
          .single();

        if (createError) throw createError;
        modelId = newModel.id;
      }

      const { error } = await supabase.from('user_bookmarks').insert({
        user_id: user.id,
        model_id: modelId,
        category_name: bookmarkCategory
      });

      if (error) throw error;
      
      toast.success('Model bookmarked successfully!');
      setShowBookmarkDialog(false);
      setBookmarkCategory('Text Models');
    } catch (error: any) {
      toast.error('Failed to bookmark model: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Text VibeCoders Board</h1>
            <p className="text-muted-foreground mb-4">
              View rankings across various LLMs on their versatility, linguistic precision, and cultural context across text.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Last Updated: May 23, 2025</span>
              <span>Total Votes: 2,945,410</span>
              <span>Total Models: 243</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          <Badge variant="secondary" className="bg-primary text-primary-foreground">Overall</Badge>
          <Button variant="ghost" size="sm">Hard Prompts</Button>
          <Button variant="ghost" size="sm">Coding</Button>
          <Button variant="ghost" size="sm">Math</Button>
          <Button variant="ghost" size="sm">Creative Writing</Button>
          <Button variant="ghost" size="sm">Instruction Following</Button>
          <Button variant="ghost" size="sm">Longer Query</Button>
          <Button variant="ghost" size="sm">Multi-Turn</Button>
        </div>

        {/* Leaderboard Table */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle>Text Model Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left p-3">Rank (UB)</th>
                    <th className="text-left p-3">Model</th>
                    <th className="text-left p-3">Score</th>
                    <th className="text-left p-3">95% CI (±)</th>
                    <th className="text-left p-3">Votes</th>
                    <th className="text-left p-3">Organization</th>
                    <th className="text-left p-3">License</th>
                    {user && <th className="text-left p-3">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {textModels.map((model, index) => (
                    <tr key={index} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="p-3 font-bold text-primary">{model.rank}</td>
                      <td className="p-3 font-medium">{model.model}</td>
                      <td className="p-3 font-bold text-secondary">{model.score}</td>
                      <td className="p-3">{model.ciScore}</td>
                      <td className="p-3">{model.votes}</td>
                      <td className="p-3 text-muted-foreground">{model.organization}</td>
                      <td className="p-3">
                        <Badge variant={model.license === "MIT" ? "default" : "secondary"}>
                          {model.license}
                        </Badge>
                      </td>
                      {user && (
                        <td className="p-3">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => {
                              setSelectedModel(model);
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
            <div className="mt-4 text-center">
              <Button variant="outline">View all</Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Default Leaderboard Plots available below (not shown in this view)</p>
        </div>
      </main>

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

      <Footer />
    </div>
  );
};

export default TextArena;
