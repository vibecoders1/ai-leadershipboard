import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Key, Copy, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface ApiKey {
  id: string;
  client_name: string;
  client_id: string;
  client_secret: string;
  bearer_token: string;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export const AdminApiKeys = () => {
  const [open, setOpen] = useState(false);
  const [showSecrets, setShowSecrets] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    clientName: '',
    neverExpires: true,
    expiresAt: undefined as Date | undefined,
  });

  const queryClient = useQueryClient();

  const { data: apiKeys = [], isLoading } = useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ApiKey[];
    },
  });

  const createApiKeyMutation = useMutation({
    mutationFn: async (data: { clientName: string; expiresAt?: Date }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Generate client ID and secret
      const clientId = `client_${Date.now()}`;
      const clientSecret = btoa(Math.random().toString()).substring(0, 32);
      
      // Generate bearer token using the database function
      const { data: tokenResult, error: tokenError } = await supabase
        .rpc('generate_bearer_token');
      
      if (tokenError) throw tokenError;

      const { error } = await supabase
        .from('api_keys')
        .insert({
          admin_id: user.id,
          client_name: data.clientName,
          client_id: clientId,
          client_secret: clientSecret,
          bearer_token: tokenResult,
          expires_at: data.expiresAt?.toISOString(),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast.success('API key created successfully');
      setOpen(false);
      setFormData({ clientName: '', neverExpires: true, expiresAt: undefined });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create API key');
    },
  });

  const toggleApiKeyMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast.success('API key updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update API key');
    },
  });

  const deleteApiKeyMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast.success('API key deleted');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete API key');
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const toggleSecretVisibility = (keyId: string) => {
    setShowSecrets(prev => 
      prev.includes(keyId) 
        ? prev.filter(id => id !== keyId)
        : [...prev, keyId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createApiKeyMutation.mutate({
      clientName: formData.clientName,
      expiresAt: formData.neverExpires ? undefined : formData.expiresAt,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">API Keys Management</h2>
          <p className="text-muted-foreground">Create and manage API keys for system access</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                Generate a new API key for accessing the leaderboard management endpoints.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="e.g., My Application"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="neverExpires"
                  checked={formData.neverExpires}
                  onCheckedChange={(checked) => setFormData({ ...formData, neverExpires: checked })}
                />
                <Label htmlFor="neverExpires">Never expires</Label>
              </div>

              {!formData.neverExpires && (
                <div className="space-y-2">
                  <Label>Expiration Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.expiresAt ? format(formData.expiresAt, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.expiresAt}
                        onSelect={(date) => setFormData({ ...formData, expiresAt: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={createApiKeyMutation.isPending} className="flex-1">
                  {createApiKeyMutation.isPending ? 'Creating...' : 'Create Key'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            API Keys
          </CardTitle>
          <CardDescription>
            Manage API keys for accessing leaderboard management endpoints
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-8">
              <Key className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No API keys</h3>
              <p className="text-muted-foreground">Create your first API key to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Client ID</TableHead>
                  <TableHead>Bearer Token</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{key.client_name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {key.client_id}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(key.client_id)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded max-w-xs truncate">
                          {showSecrets.includes(key.id) ? key.bearer_token : '••••••••••••••••'}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSecretVisibility(key.id)}
                        >
                          {showSecrets.includes(key.id) ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(key.bearer_token)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={key.is_active ? 'default' : 'secondary'}>
                          {key.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Switch
                          checked={key.is_active}
                          onCheckedChange={(checked) => 
                            toggleApiKeyMutation.mutate({ id: key.id, isActive: checked })
                          }
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      {key.expires_at ? format(new Date(key.expires_at), 'PPP') : 'Never'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteApiKeyMutation.mutate(key.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};