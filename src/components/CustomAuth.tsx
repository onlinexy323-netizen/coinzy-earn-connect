import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Eye, EyeOff, Copy, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserCredentials {
  uniqueId: string;
  password: string;
  phoneNumber: string;
}

interface SignupResponse {
  success: boolean;
  user_id?: string;
  profile_id?: string;
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
  const [userCredentials, setUserCredentials] = useState<UserCredentials | null>(null);
  
  // Form fields
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [loginIdentifier, setLoginIdentifier] = useState("");
  
  const { toast } = useToast();
  const navigate = useNavigate();

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
      
      const hashedPassword = hashPassword(password);
      
      const { data, error } = await supabase.rpc('handle_custom_signup', {
        p_full_name: fullName,
        p_phone_number: phoneNumber,
        p_password_hash: hashedPassword,
        p_email: email || null,
        p_referral_code: referralCode || null
      });

      if (error) throw error;

      const response = data as unknown as SignupResponse;
      if (response.success) {
        setUserCredentials({
          uniqueId: response.user_id || "",
          password: password,
          phoneNumber: phoneNumber
        });
        setShowCredentials(true);
        
        toast({
          title: "Success!",
          description: response.message,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    if (!loginIdentifier || !password) {
      toast({
        title: "Error",
        description: "Please enter your phone number/User ID and password",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const hashedPassword = hashPassword(password);
      
      const { data, error } = await supabase.rpc('handle_custom_login', {
        p_identifier: loginIdentifier,
        p_password_hash: hashedPassword
      });

      if (error) throw error;

      const response = data as unknown as LoginResponse;
      if (response.success) {
        // Store user session in localStorage
        localStorage.setItem('socialslot_user', JSON.stringify(response));
        
        toast({
          title: "Login Successful!",
          description: `Welcome back, ${response.full_name}`,
        });
        
        navigate('/social-connect');
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error: any) {
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
                You can login with either your Unique ID or Phone Number.
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <Card className="w-full max-w-md glass-card border-primary/20">
        <CardContent className="p-8">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="p-2 mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {isSignUp ? "Create Account" : "Login"}
              </h2>
              <p className="text-muted-foreground">
                {isSignUp ? "Join SocialSlot platform" : "Welcome back to SocialSlot"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp ? (
              <>
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email ID (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="referralCode">Referral Code (Optional)</Label>
                  <Input
                    id="referralCode"
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="Enter referral code if you have one"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="loginIdentifier">Phone Number or User ID</Label>
                  <Input
                    id="loginIdentifier"
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="Enter phone number or unique ID (e.g., SS1001)"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="loginPassword">Password</Label>
                  <div className="relative">
                    <Input
                      id="loginPassword"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
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
              className="w-full"
              variant="premium"
              disabled={loading}
            >
              {loading ? "Please wait..." : isSignUp ? "Create Account" : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </p>
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:text-primary-light"
            >
              {isSignUp ? "Login here" : "Create account"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomAuth;