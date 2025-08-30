import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Eye, EyeOff, Copy, CheckCircle, AlertTriangle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Session, User } from "@supabase/supabase-js";

interface UserCredentials {
  uniqueId: string;
  password: string;
  phoneNumber: string;
}

interface SignupResponse {
  success: boolean;
  user_id?: string;
  profile_id?: string;
  email?: string;
  password?: string;
  message: string;
}

interface LoginResponse {
  success: boolean;
  user_id?: string;
  profile_id?: string;
  full_name?: string;
  phone_number?: string;
  email?: string;
  social_accounts?: any;
  message?: string;
}

const CustomAuth = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [showSignupFailure, setShowSignupFailure] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [userCredentials, setUserCredentials] = useState<UserCredentials | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  
  // Form fields
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [loginIdentifier, setLoginIdentifier] = useState("");
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Set up auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("🔐 Auth state changed:", event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Redirect authenticated users
  useEffect(() => {
    if (session && user) {
      console.log("✅ User authenticated, redirecting to dashboard...");
      navigate('/dashboard');
    }
  }, [session, user, navigate]);

  // Auto-fill referral code from URL parameters
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setReferralCode(refCode);
      setIsSignUp(true); // Ensure we're on signup page
      toast({
        title: "Referral Code Applied! 🎉",
        description: `Using referral code: ${refCode}`,
      });
    }
  }, [searchParams, toast]);

  // Simple hash function for passwords (in production, use proper bcrypt)
  const hashPassword = (password: string) => {
    return btoa(password); // Base64 encoding (not secure for production)
  };

  const signUp = async () => {
    if (!fullName || !phoneNumber || !password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      console.log("🔄 Starting signup process...");
      console.log("📝 Form data:", { fullName, phoneNumber, email, referralCode });
      
      // First, call our RPC to generate user details
      console.log("📡 Calling handle_custom_signup RPC...");
      const { data: rpcData, error: rpcError } = await supabase.rpc('handle_custom_signup', {
        p_full_name: fullName,
        p_phone_number: phoneNumber,
        p_password: password,
        p_email: email || null,
        p_referral_code: referralCode || null
      });

      console.log("📨 RPC Response:", { rpcData, rpcError });

      if (rpcError) {
        console.error("❌ RPC Error:", rpcError);
        throw rpcError;
      }

      const response = rpcData as unknown as SignupResponse;
      console.log("📋 Parsed response:", response);
      
      if (response.success && response.email && response.password) {
        console.log("✅ RPC successful! Now creating Supabase auth user...");
        
        // Now create the actual Supabase auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: response.email,
          password: response.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: fullName,
              unique_user_id: response.user_id
            }
          }
        });

        console.log("🔐 Auth Response:", { authData, authError });

        if (authError) {
          console.error("❌ Auth Error:", authError);
          throw authError;
        }

        if (authData.user) {
          console.log("🎉 Auth user created successfully!");
          
          // Update the profile with the actual auth user ID
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ user_id: authData.user.id })
            .eq('id', response.profile_id);

          if (updateError) {
            console.error("⚠️ Warning: Failed to update profile user_id:", updateError);
          }

          setUserCredentials({
            uniqueId: response.user_id || "",
            password: password,
            phoneNumber: phoneNumber
          });
          setShowCredentials(true);
          
          toast({
            title: "Success!",
            description: "Account created! Please check your email to confirm.",
          });
        }
      } else {
        console.error("❌ Signup failed:", response.message);
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error("💥 Signup error:", error);
      setSignupError(error.message || "An unknown error occurred");
      setShowSignupFailure(true);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    if (!loginIdentifier || !password) {
      toast({
        title: "Error",
        description: "Please enter your User ID and password",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      console.log("🔄 Starting login process...");
      console.log("📝 Login identifier:", loginIdentifier);
      
      // First, get the email associated with the unique ID
      const { data: loginData, error: loginError } = await supabase.rpc('handle_custom_login', {
        p_identifier: loginIdentifier,
        p_password_hash: password // The function still expects p_password_hash parameter
      });

      console.log("📨 Login RPC Response:", { loginData, loginError });

      if (loginError) {
        console.error("❌ Login RPC Error:", loginError);
        throw loginError;
      }

      const response = loginData as unknown as LoginResponse;
      
      if (response.success && response.email) {
        console.log("✅ Got email from RPC, now signing in with Supabase auth...");
        
        // Now sign in with Supabase auth using the email and password
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: response.email,
          password: password,
        });

        console.log("🔐 Supabase Auth Response:", { authData, authError });

        if (authError) {
          console.error("❌ Supabase Auth Error:", authError);
          throw authError;
        }

        if (authData.user) {
          console.log("🎉 Login successful!");
          
          toast({
            title: "Login Successful!",
            description: `Welcome back, ${response.full_name}`,
          });
          
          // The useEffect will handle redirecting to dashboard
        }
      } else {
        console.error("❌ Login failed:", response.message);
        throw new Error(response.message || "Login failed");
      }
    } catch (error: any) {
      console.error("💥 Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      signUp();
    } else {
      signIn();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const goToLogin = () => {
    setShowCredentials(false);
    setIsSignUp(false);
    // Clear signup form
    setFullName("");
    setPhoneNumber("");
    setEmail("");
    setPassword("");
    setReferralCode("");
  };

  // Show credentials screen after successful signup
  if (showCredentials && userCredentials) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
        <Card className="w-full max-w-md glass-card border-primary/20">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground">Account Created!</h2>
              <p className="text-muted-foreground mt-2">
                Please save these credentials securely
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <Label className="text-sm font-medium text-muted-foreground">Your Unique ID</Label>
                <div className="flex items-center justify-between mt-1">
                  <code className="text-lg font-mono font-bold text-primary">
                    {userCredentials.uniqueId}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(userCredentials.uniqueId)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <Label className="text-sm font-medium text-muted-foreground">Your Password</Label>
                <div className="flex items-center justify-between mt-1">
                  <code className="text-lg font-mono font-bold text-foreground">
                    {userCredentials.password}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(userCredentials.password)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <Label className="text-sm font-medium text-muted-foreground">Phone Number</Label>
                <div className="flex items-center justify-between mt-1">
                  <code className="text-lg font-mono font-bold text-foreground">
                    {userCredentials.phoneNumber}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(userCredentials.phoneNumber)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-warning/10 border border-warning/20 p-4 rounded-lg mb-6">
              <p className="text-sm text-warning-foreground">
                📸 <strong>Important:</strong> Take a screenshot and save these credentials safely. 
                You can login with your Unique ID and password.
              </p>
            </div>

            <Button 
              onClick={goToLogin}
              className="w-full"
              variant="premium"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-3 sm:p-4">
      <Card className="w-full max-w-md glass-card border-primary/20">
        <CardContent className="p-4 sm:p-8">
          <div className="flex items-center mb-4 sm:mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="p-1.5 sm:p-2 mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {isSignUp ? "Create Account" : "Login"}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {isSignUp ? "Join SocialSlot platform" : "Welcome back to SocialSlot"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {isSignUp ? (
              <>
                <div className="space-y-1">
                  <Label htmlFor="fullName" className="text-sm font-medium">Full Name *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="h-10 text-base"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your phone number"
                    className="h-10 text-base"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email" className="text-sm font-medium">Email ID (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="h-10 text-base"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password" className="text-sm font-medium">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      className="h-10 text-base pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="referralCode" className="text-sm font-medium">Referral Code (Optional)</Label>
                  <Input
                    id="referralCode"
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="Enter referral code if you have one"
                    className="h-10 text-base"
                    disabled={!!searchParams.get('ref')} // Disable if code came from URL
                  />
                  {searchParams.get('ref') && (
                    <p className="text-xs text-success">✓ Referral code applied from invitation link</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <Label htmlFor="loginIdentifier" className="text-sm font-medium">User ID</Label>
                  <Input
                    id="loginIdentifier"
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="Enter your unique ID (e.g., SS1001)"
                    className="h-10 text-base"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="loginPassword" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="loginPassword"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="h-10 text-base pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full h-10 sm:h-11 text-base font-medium"
              variant="premium"
              disabled={loading}
            >
              {loading ? "Please wait..." : isSignUp ? "Create Account" : "Login"}
            </Button>
          </form>

          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </p>
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:text-primary-light p-0 h-auto text-sm"
            >
              {isSignUp ? "Login here" : "Create account"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Signup Failure Dialog */}
      <Dialog open={showSignupFailure} onOpenChange={setShowSignupFailure}>
        <DialogContent className="max-w-sm sm:max-w-md mx-4">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
              <DialogTitle className="text-base sm:text-lg">Signup Failed</DialogTitle>
            </div>
            <DialogDescription className="text-left text-sm sm:text-base mt-2">
              {signupError}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button 
              onClick={() => setShowSignupFailure(false)}
              variant="premium"
              className="h-9 sm:h-10 text-sm sm:text-base"
            >
              Try Again
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomAuth;