
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Header } from '../components/Header';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Check for specific legacy admin credentials
        if (email === 'vibecoder@admin.com' && password === '0pt1p!3x@123') {
          localStorage.setItem('adminAuth', 'true');
          toast.success('Login successful!');
          navigate('/admin/dashboard');
          return;
        }
        throw error;
      }

      if (data.user) {
        localStorage.setItem('adminAuth', 'true');
        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast.error(error.message || 'Google login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-md">
          <Card className="bg-card/50 backdrop-blur-sm border-border cyber-gradient">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <Shield className="w-12 h-12 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">VIBING ACCESS</CardTitle>
              <CardDescription>Enter your credentials to access the admin dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background/50 border-border"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-background/50 border-border pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/80 text-primary-foreground"
                  disabled={loading}
                >
                  {loading ? 'Authenticating...' : 'Login'}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <div className="text-center">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
