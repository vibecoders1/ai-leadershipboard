import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Lock, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
}

const ProfileSettings = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profileForm, setProfileForm] = useState({
    username: '',
    display_name: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }
      setUser(user);
      await loadProfile();
    };
    checkAuth();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (profile) {
        setProfile(profile);
        setProfileForm({
          username: profile.username || '',
          display_name: profile.display_name || ''
        });
      }
    } catch (error: any) {
      toast.error('Failed to load profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!user) return;
    
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: profileForm.username,
          display_name: profileForm.display_name
        });

      if (error) throw error;
      
      toast.success('Profile updated successfully!');
      loadProfile();
    } catch (error: any) {
      toast.error('Failed to update profile: ' + error.message);
    } finally {
      setUpdating(false);
    }
  };

  const updatePassword = async () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.new_password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.new_password
      });

      if (error) throw error;
      
      toast.success('Password updated successfully!');
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error: any) {
      toast.error('Failed to update password: ' + error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      
      // For now, we'll just use a placeholder URL since storage isn't set up
      // In a real implementation, you'd upload to Supabase Storage
      toast.info('Avatar upload functionality coming soon!');
    } catch (error: any) {
      toast.error('Failed to upload avatar: ' + error.message);
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
      <div className="container mx-auto p-6 pt-20 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your public profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="text-lg">
                      {(profile?.display_name || user?.email)?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" className="relative overflow-hidden">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Avatar
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </Button>
                    <p className="text-sm text-muted-foreground mt-1">
                      Recommended: Square image, at least 256x256px
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={profileForm.username}
                      onChange={(e) => setProfileForm({...profileForm, username: e.target.value})}
                      placeholder="Enter your username"
                    />
                  </div>

                  <div>
                    <Label htmlFor="display_name">Display Name</Label>
                    <Input
                      id="display_name"
                      value={profileForm.display_name}
                      onChange={(e) => setProfileForm({...profileForm, display_name: e.target.value})}
                      placeholder="Enter your display name"
                    />
                  </div>

                  <Button onClick={updateProfile} disabled={updating}>
                    {updating ? 'Updating...' : 'Update Profile'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="current_password">Current Password</Label>
                  <Input
                    id="current_password"
                    type="password"
                    value={passwordForm.current_password}
                    onChange={(e) => setPasswordForm({...passwordForm, current_password: e.target.value})}
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <Label htmlFor="new_password">New Password</Label>
                  <Input
                    id="new_password"
                    type="password"
                    value={passwordForm.new_password}
                    onChange={(e) => setPasswordForm({...passwordForm, new_password: e.target.value})}
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <Label htmlFor="confirm_password">Confirm New Password</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    value={passwordForm.confirm_password}
                    onChange={(e) => setPasswordForm({...passwordForm, confirm_password: e.target.value})}
                    placeholder="Confirm new password"
                  />
                </div>

                <Button 
                  onClick={updatePassword} 
                  disabled={updating || !passwordForm.new_password}
                >
                  {updating ? 'Updating...' : 'Update Password'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileSettings;