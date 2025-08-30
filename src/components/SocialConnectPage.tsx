import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { 
  Instagram, 
  Facebook, 
  Youtube, 
  Twitter, 
  Users, 
  CheckCircle2,
  ArrowRight 
} from "lucide-react";

interface SocialPlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  placeholder: string;
  description: string;
}

interface UserData {
  user_id: string;
  profile_id: string;
  full_name: string;
  phone_number: string;
  email?: string;
  social_accounts?: any;
}

interface ConnectedAccount {
  platform: string;
  username: string;
  profile_name: string;
  followers: number;
  profile_picture?: string;
}

const SocialConnectPage = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [profileInput, setProfileInput] = useState("");
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const platforms: SocialPlatform[] = [
    {
      id: "instagram",
      name: "Instagram",
      icon: <Instagram className="h-6 w-6" />,
      color: "from-purple-500 to-pink-500",
      placeholder: "@username or instagram.com/username",
      description: "Connect your Instagram account to start earning from your posts"
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: <Facebook className="h-6 w-6" />,
      color: "from-blue-600 to-blue-700",
      placeholder: "facebook.com/username or @username",
      description: "Link your Facebook profile to monetize your content"
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: <Youtube className="h-6 w-6" />,
      color: "from-red-600 to-red-700",
      placeholder: "youtube.com/channel/... or @channelname",
      description: "Connect your YouTube channel for video monetization"
    },
    {
      id: "twitter",
      name: "X (Twitter)",
      icon: <Twitter className="h-6 w-6" />,
      color: "from-gray-800 to-black",
      placeholder: "@username or x.com/username",
      description: "Link your X profile to earn from your tweets"
    }
  ];

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('socialslot_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserData(user);
      
      // Load existing connected accounts
      if (user.social_accounts) {
        setConnectedAccounts(Object.values(user.social_accounts) || []);
      }
    } else {
      // Redirect to auth if not logged in
      navigate('/auth');
    }
  }, [navigate]);

  // Mock function to fetch profile data (in production, use real APIs)
  const fetchProfileData = async (platform: string, profileUrl: string): Promise<ConnectedAccount> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Extract username from URL or handle
    let username = profileUrl.replace(/^@/, '');
    if (profileUrl.includes('/')) {
      username = profileUrl.split('/').pop() || username;
    }
    
    // Mock profile data
    const mockData: ConnectedAccount = {
      platform,
      username,
      profile_name: `${username.charAt(0).toUpperCase()}${username.slice(1)} Creator`,
      followers: Math.floor(Math.random() * 100000) + 1000,
      profile_picture: `https://ui-avatars.com/api/?name=${username}&background=random`
    };
    
    return mockData;
  };

  const handleConnect = async (platformId: string) => {
    if (!profileInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter your profile URL or username",
        variant: "destructive",
      });
      return;
    }

    try {
      setConnecting(true);
      
      // Fetch profile data
      const profileData = await fetchProfileData(platformId, profileInput);
      
      // Update user's social accounts in database
      const updatedSocialAccounts = {
        ...userData?.social_accounts,
        [platformId]: profileData
      };
      
      const { error } = await supabase
        .from('profiles')
        .update({ social_accounts: updatedSocialAccounts })
        .eq('id', userData?.profile_id);
        
      if (error) throw error;
      
      // Update local state
      const newConnectedAccounts = [...connectedAccounts, profileData];
      setConnectedAccounts(newConnectedAccounts);
      
      // Update localStorage
      if (userData) {
        const updatedUserData = {
          ...userData,
          social_accounts: updatedSocialAccounts
        };
        localStorage.setItem('socialslot_user', JSON.stringify(updatedUserData));
        setUserData(updatedUserData);
      }
      
      setSelectedPlatform(null);
      setProfileInput("");
      
      toast({
        title: "Connected Successfully!",
        description: `Your ${platforms.find(p => p.id === platformId)?.name} account has been connected`,
      });
      
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect your account",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Connect Your Social Media
          </h1>
          <p className="text-muted-foreground text-lg">
            Link your social accounts to start earning from your content
          </p>
        </div>

        {/* Connected Accounts Summary */}
        {connectedAccounts.length > 0 && (
          <Card className="mb-8 glass-card">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CheckCircle2 className="h-5 w-5 text-success mr-2" />
                Connected Accounts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {connectedAccounts.map((account, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {platforms.find(p => p.id === account.platform)?.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{account.profile_name}</p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {account.followers.toLocaleString()} followers
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Platform Selection */}
        {!selectedPlatform ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {platforms.map((platform) => {
              const isConnected = connectedAccounts.some(acc => acc.platform === platform.id);
              
              return (
                <Card 
                  key={platform.id} 
                  className={`glass-card transition-all cursor-pointer hover:scale-105 ${
                    isConnected ? 'opacity-50' : 'hover:shadow-premium'
                  }`}
                  onClick={() => !isConnected && setSelectedPlatform(platform.id)}
                >
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${platform.color} flex items-center justify-center text-white mb-4`}>
                      {platform.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {platform.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {platform.description}
                    </p>
                    {isConnected ? (
                      <div className="flex items-center text-success text-sm">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Connected
                      </div>
                    ) : (
                      <Button variant="outline" className="w-full">
                        Connect Account
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Connection Form */
          <Card className="max-w-md mx-auto glass-card">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                {(() => {
                  const platform = platforms.find(p => p.id === selectedPlatform);
                  return (
                    <>
                      <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${platform?.color} flex items-center justify-center text-white mx-auto mb-4`}>
                        {platform?.icon}
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">
                        Connect {platform?.name}
                      </h2>
                      <p className="text-muted-foreground mt-2">
                        Enter your profile URL or username
                      </p>
                    </>
                  );
                })()}
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="profileInput">Profile URL or Username</Label>
                  <Input
                    id="profileInput"
                    type="text"
                    value={profileInput}
                    onChange={(e) => setProfileInput(e.target.value)}
                    placeholder={platforms.find(p => p.id === selectedPlatform)?.placeholder}
                    disabled={connecting}
                  />
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedPlatform(null);
                      setProfileInput("");
                    }}
                    disabled={connecting}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleConnect(selectedPlatform)}
                    disabled={connecting}
                    variant="premium"
                    className="flex-1"
                  >
                    {connecting ? "Connecting..." : "Connect"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Continue Button */}
        {connectedAccounts.length > 0 && (
          <div className="text-center mt-8">
            <Button 
              onClick={goToDashboard}
              variant="hero"
              size="lg"
              className="px-8"
            >
              Continue to Dashboard
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        )}

        {/* Skip Option */}
        <div className="text-center mt-6">
          <Button 
            variant="link" 
            onClick={goToDashboard}
            className="text-muted-foreground hover:text-foreground"
          >
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SocialConnectPage;