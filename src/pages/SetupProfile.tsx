
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Header } from '../components/Header';
import { supabase } from '@/integrations/supabase/client';

const SetupProfile = () => {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        navigate('/admin');
        return;
      }
      setUser(user);
      setDisplayName(user.user_metadata?.full_name || user.user_metadata?.name || '');
    };
    
    checkUser();
  }, [navigate]);

  const handleSetupProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update user metadata and password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
        data: {
          username: username,
          display_name: displayName
        }
      });

      if (updateError) {
        throw updateError;
      }

      // Insert/update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: username,
          display_name: displayName,
          avatar_url: user.user_metadata?.avatar_url
        });

      if (profileError) {
        throw profileError;
      }

      localStorage.setItem('adminAuth', 'true');
      toast.success('Profile setup complete!');
      navigate('/admin/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to setup profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-md">
          <Card className="bg-card/50 backdrop-blur-sm border-border cyber-gradient">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <User className="w-12 h-12 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
              <CardDescription>Please set up your username and password to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSetupProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-background/50 border-border"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Your display name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-background/50 border-border"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Choose a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background/50 border-border"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/80 text-primary-foreground"
                  disabled={loading}
                >
                  {loading ? 'Setting up...' : 'Complete Setup'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SetupProfile;
