import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import SocialMediaConnect from './SocialMediaConnect';
import CongratulationEffect from './CongratulationEffect';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [showSocialConnect, setShowSocialConnect] = useState(false);
  const [showCongratulation, setShowCongratulation] = useState(false);
  const [connectedPlatform, setConnectedPlatform] = useState<string>('');
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && !showSocialConnect && !showCongratulation) {
          setShowSocialConnect(true);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
        if (session?.user && !showSocialConnect && !showCongratulation) {
          checkSocialConnection(session.user.id);
        }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkSocialConnection = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('social_media_accounts')
        .select('id')
        .eq('user_id', userId)
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        // User has connected accounts, redirect to dashboard
        navigate('/dashboard');
      } else {
        // No connected accounts, show social connect
        setShowSocialConnect(true);
      }
    } catch (error) {
      console.error('Error checking social connection:', error);
      setShowSocialConnect(true);
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: displayName
        }
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl
      }
    });
    
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Google Sign In Error',
        description: error.message
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isSignUp) {
        result = await signUp(email, password, displayName);
      } else {
        result = await signIn(email, password);
      }

      if (result.error) {
        toast({
          variant: 'destructive',
          title: isSignUp ? 'Sign Up Error' : 'Sign In Error',
          description: result.error.message
        });
      } else {
        if (isSignUp) {
          toast({
            title: 'Account Created!',
            description: 'Please check your email to verify your account.'
          });
        } else {
          toast({
            title: 'Welcome back!',
            description: 'You have been signed in successfully.'
          });
        }
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialMediaConnect = (platform: string) => {
    setConnectedPlatform(platform);
    setShowSocialConnect(false);
    setShowCongratulation(true);
    
    // Redirect to dashboard after congratulation
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };

  // Show congratulation screen
  if (showCongratulation) {
    return <CongratulationEffect platform={connectedPlatform} />;
  }

  // Show social media connection after successful auth
  if (showSocialConnect && user) {
    return <SocialMediaConnect onConnect={handleSocialMediaConnect} />;
  }

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-6">
      {/* Cosmic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 gradient-orbital rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 gradient-orbital rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 gradient-orbital rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to Home */}
        <Link to="/" className="flex items-center text-foreground/80 hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card className="glassmorphism shadow-premium">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center glow-primary">
                <span className="text-primary-foreground font-bold text-lg">C</span>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-foreground">Coinzy</CardTitle>
                <p className="text-muted-foreground text-sm">Gateway to Digital Earnings</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Google Sign In */}
            <Button 
              onClick={signInWithGoogle}
              variant="outline" 
              className="w-full glassmorphism border-primary/20 hover:bg-primary/10"
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <div className="flex items-center space-x-4">
              <Separator className="flex-1 bg-border/50" />
              <span className="text-muted-foreground text-sm">or</span>
              <Separator className="flex-1 bg-border/50" />
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-foreground">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="Enter your full name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="pl-10 glassmorphism border-border/50 focus:border-primary"
                      required={isSignUp}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 glassmorphism border-border/50 focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 glassmorphism border-border/50 focus:border-primary"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 
                      <EyeOff className="w-4 h-4 text-muted-foreground" /> : 
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    }
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full gradient-primary glow-primary hover:opacity-90" 
                disabled={loading}
              >
                {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
              </Button>
            </form>

            {/* Toggle between Sign In/Sign Up */}
            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </p>
              <Button
                type="button"
                variant="link"
                className="text-primary hover:text-primary-light p-0 h-auto"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;