
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Header } from '../components/Header';
import { supabase } from '@/integrations/supabase/client';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      setEmailSent(true);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email');
    } finally {
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
                <Mail className="w-12 h-12 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">
                {emailSent ? 'Check Your Email' : 'Reset Password'}
              </CardTitle>
              <CardDescription>
                {emailSent 
                  ? 'We\'ve sent a password reset link to your email address'
                  : 'Enter your email address and we\'ll send you a reset link'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!emailSent ? (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-background/50 border-border"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/80 text-primary-foreground"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    If an account with that email exists, you'll receive a password reset link shortly.
                  </p>
                  <Button 
                    onClick={() => {
                      setEmailSent(false);
                      setEmail('');
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Send Another Email
                  </Button>
                </div>
              )}

              <div className="text-center">
                <Link 
                  to="/admin" 
                  className="inline-flex items-center text-sm text-primary hover:underline"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
