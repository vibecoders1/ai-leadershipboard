import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Mail, MailCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserBookmarks } from '../components/UserBookmarks';

interface ModelSelection {
  id: string;
  ai_system: string;
  organization: string;
  system_type: string;
  arc_agi_1: number | null;
  arc_agi_2: number | null;
  cost_per_task: number | null;
  is_default: boolean;
}

interface ModelCategory {
  id: string;
  name: string;
  description: string;
}

interface NewsletterSubscription {
  id: string;
  category_id: string;
  email: string;
  is_active: boolean;
  model_categories: ModelCategory;
}

const UserDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [userModels, setUserModels] = useState<ModelSelection[]>([]);
  const [categories, setCategories] = useState<ModelCategory[]>([]);
  const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModel, setShowAddModel] = useState(false);
  const [newModel, setNewModel] = useState({
    ai_system: '',
    organization: '',
    system_type: '',
    arc_agi_1: '',
    arc_agi_2: '',
    cost_per_task: ''
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }
      setUser(user);
      await loadUserData();
    };
    checkAuth();
  }, []);

  const loadUserData = async () => {
    try {
      // Load user models
      const { data: models, error: modelsError } = await supabase
        .from('user_model_selections')
        .select('*')
        .order('created_at', { ascending: false });

      if (modelsError) throw modelsError;
      setUserModels(models || []);

      // Load categories
      const { data: cats, error: catsError } = await supabase
        .from('model_categories')
        .select('*')
        .order('name');

      if (catsError) throw catsError;
      setCategories(cats || []);

      // Load subscriptions
      const { data: subs, error: subsError } = await supabase
        .from('newsletter_subscriptions')
        .select('*, model_categories(*)')
        .eq('is_active', true);

      if (subsError) throw subsError;
      setSubscriptions(subs || []);
    } catch (error: any) {
      toast.error('Failed to load data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addModel = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase.from('user_model_selections').insert({
        user_id: user.id,
        ai_system: newModel.ai_system,
        organization: newModel.organization,
        system_type: newModel.system_type,
        arc_agi_1: newModel.arc_agi_1 ? parseFloat(newModel.arc_agi_1) : null,
        arc_agi_2: newModel.arc_agi_2 ? parseFloat(newModel.arc_agi_2) : null,
        cost_per_task: newModel.cost_per_task ? parseFloat(newModel.cost_per_task) : null
      });

      if (error) throw error;
      
      toast.success('Model added successfully!');
      setShowAddModel(false);
      setNewModel({ ai_system: '', organization: '', system_type: '', arc_agi_1: '', arc_agi_2: '', cost_per_task: '' });
      loadUserData();
    } catch (error: any) {
      toast.error('Failed to add model: ' + error.message);
    }
  };

  const deleteModel = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_model_selections')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Model deleted successfully!');
      loadUserData();
    } catch (error: any) {
      toast.error('Failed to delete model: ' + error.message);
    }
  };

  const toggleSubscription = async (categoryId: string) => {
    try {
      const existingSub = subscriptions.find(sub => sub.category_id === categoryId);
      
      if (existingSub) {
        const { error } = await supabase
          .from('newsletter_subscriptions')
          .delete()
          .eq('id', existingSub.id);

        if (error) throw error;
        toast.success('Unsubscribed successfully!');
      } else {
        const { error } = await supabase.from('newsletter_subscriptions').insert({
          user_id: user?.id || '',
          category_id: categoryId,
          email: user?.email || ''
        });

        if (error) throw error;
        toast.success('Subscribed successfully!');
      }
      
      loadUserData();
    } catch (error: any) {
      toast.error('Failed to update subscription: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-6 pt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-muted-foreground">Manage your AI models and subscriptions</p>
        </div>

        <Tabs defaultValue="models" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="models">My Models</TabsTrigger>
            <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
            <TabsTrigger value="categories">Browse Categories</TabsTrigger>
            <TabsTrigger value="newsletters">Newsletters</TabsTrigger>
          </TabsList>

          <TabsContent value="models" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Your AI Models</h2>
              <Dialog open={showAddModel} onOpenChange={setShowAddModel}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Model
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Model</DialogTitle>
                    <DialogDescription>Add a new AI model to your collection</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="ai_system">AI System</Label>
                      <Input
                        id="ai_system"
                        value={newModel.ai_system}
                        onChange={(e) => setNewModel({...newModel, ai_system: e.target.value})}
                        placeholder="e.g., GPT-4"
                      />
                    </div>
                    <div>
                      <Label htmlFor="organization">Organization</Label>
                      <Input
                        id="organization"
                        value={newModel.organization}
                        onChange={(e) => setNewModel({...newModel, organization: e.target.value})}
                        placeholder="e.g., OpenAI"
                      />
                    </div>
                    <div>
                      <Label htmlFor="system_type">System Type</Label>
                      <Select value={newModel.system_type} onValueChange={(value) => setNewModel({...newModel, system_type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Base LLM">Base LLM</SelectItem>
                          <SelectItem value="CoT">Chain of Thought</SelectItem>
                          <SelectItem value="RL">Reinforcement Learning</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="arc_agi_1">ARC AGI 1</Label>
                        <Input
                          id="arc_agi_1"
                          type="number"
                          step="0.1"
                          value={newModel.arc_agi_1}
                          onChange={(e) => setNewModel({...newModel, arc_agi_1: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="arc_agi_2">ARC AGI 2</Label>
                        <Input
                          id="arc_agi_2"
                          type="number"
                          step="0.1"
                          value={newModel.arc_agi_2}
                          onChange={(e) => setNewModel({...newModel, arc_agi_2: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cost_per_task">Cost per Task</Label>
                        <Input
                          id="cost_per_task"
                          type="number"
                          step="0.001"
                          value={newModel.cost_per_task}
                          onChange={(e) => setNewModel({...newModel, cost_per_task: e.target.value})}
                        />
                      </div>
                    </div>
                    <Button onClick={addModel} className="w-full">Add Model</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userModels.map((model) => (
                <Card key={model.id} className="relative">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{model.ai_system}</CardTitle>
                        <CardDescription>{model.organization}</CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteModel(model.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Badge variant="outline">{model.system_type}</Badge>
                      {model.is_default && <Badge variant="default">Default</Badge>}
                      {model.arc_agi_1 && (
                        <div className="text-sm">ARC AGI 1: {model.arc_agi_1}</div>
                      )}
                      {model.arc_agi_2 && (
                        <div className="text-sm">ARC AGI 2: {model.arc_agi_2}</div>
                      )}
                      {model.cost_per_task && (
                        <div className="text-sm">Cost: ${model.cost_per_task}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bookmarks" className="space-y-6">
            <UserBookmarks />
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <h2 className="text-2xl font-semibold">Model Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => toggleSubscription(category.id)}
                    >
                      {subscriptions.some(sub => sub.category_id === category.id) ? (
                        <>
                          <MailCheck className="w-4 h-4 mr-2" />
                          Subscribed
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Subscribe to Updates
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="newsletters" className="space-y-6">
            <h2 className="text-2xl font-semibold">Newsletter Subscriptions</h2>
            {subscriptions.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No active subscriptions</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subscriptions.map((subscription) => (
                  <Card key={subscription.id}>
                    <CardHeader>
                      <CardTitle>{subscription.model_categories.name}</CardTitle>
                      <CardDescription>{subscription.email}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        onClick={() => toggleSubscription(subscription.category_id)}
                        className="w-full"
                      >
                        Unsubscribe
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;