import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Lock, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Header } from '../components/Header';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Settings = () => {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, display_name')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        
        if (data) {
          setUsername(data.username || '');
          setDisplayName(data.display_name || '');
        }
      } catch (error: any) {
        toast.error('Failed to load profile: ' + error.message);
      }
    };

    loadProfile();
  }, [user, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: username,
          display_name: displayName,
          avatar_url: user.user_metadata?.avatar_url
        });

      if (error) throw error;

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          username: username,
          display_name: displayName
        }
      });

      if (updateError) throw updateError;

      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error('Failed to update profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      toast.success('Password updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error('Failed to update password: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-6 pt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <CardTitle>Profile Information</CardTitle>
                </div>
                <CardDescription>Update your profile details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email || ''}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-sm text-muted-foreground">Email cannot be changed</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
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
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Profile'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Lock className="w-5 h-5" />
                  <CardTitle>Change Password</CardTitle>
                </div>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Change Password'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <CardTitle>Notification Preferences</CardTitle>
                </div>
                <CardDescription>Manage your notification settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Notification preferences are managed through the newsletter subscriptions in your dashboard.
                  </p>
                  <Button variant="outline" onClick={() => navigate('/dashboard')}>
                    Go to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;