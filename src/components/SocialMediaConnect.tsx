import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Instagram, Facebook, Youtube, Check, Loader2, User, Sparkles, ArrowRight } from 'lucide-react';

interface SocialMediaConnectProps {
  onConnect: (platform: string) => void;
}

const SocialMediaConnect: React.FC<SocialMediaConnectProps> = ({ onConnect }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [connecting, setConnecting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [accountHandle, setAccountHandle] = useState('');
  const [currentPlatform, setCurrentPlatform] = useState('');
  const { toast } = useToast();

  const platforms = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'from-pink-500 to-purple-600',
      description: 'Connect your Instagram account to start running profitable ads',
      followers: '10K+ followers recommended'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'from-blue-500 to-blue-700',
      description: 'Connect your Facebook page for premium ad campaigns',
      followers: '5K+ followers recommended'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Youtube,
      color: 'from-red-500 to-red-700',
      description: 'Connect your YouTube channel for video ad monetization',
      followers: '1K+ subscribers recommended'
    }
  ];

  const handleConnect = async (platformId: string) => {
    setCurrentPlatform(platformId);
    setShowDialog(true);
  };

  const handleAccountSubmit = async () => {
    if (!accountHandle.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid Handle",
        description: "Please enter a valid account handle."
      });
      return;
    }

    setConnecting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Mock fetch social media details (in real app, you'd call an API)
      const mockUserData = {
        instagram: { name: 'Sarah Wilson', followers: 15200, verified: true },
        facebook: { name: 'Michael Chen', followers: 8500, verified: false },
        youtube: { name: 'Alex Rivera', followers: 22100, verified: true }
      };

      const userData = mockUserData[currentPlatform as keyof typeof mockUserData] || 
                     { name: accountHandle, followers: Math.floor(Math.random() * 10000), verified: false };

      // Save to database
      const { error } = await supabase
        .from('social_media_accounts')
        .insert({
          user_id: user.id,
          platform: currentPlatform,
          account_handle: accountHandle,
          display_name: userData.name,
          follower_count: userData.followers,
          is_verified: userData.verified
        });

      if (error) throw error;

      setConnecting(false);
      setShowDialog(false);
      setAccountHandle('');
      onConnect(currentPlatform);
      
      toast({
        title: "Connected Successfully! 🎉",
        description: `Your ${platforms.find(p => p.id === currentPlatform)?.name} account has been connected.`
      });
    } catch (error) {
      console.error('Error connecting account:', error);
      setConnecting(false);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "There was an error connecting your account. Please try again."
      });
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-6">
      {/* Cosmic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 gradient-orbital rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 gradient-orbital rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 gradient-orbital rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-primary mr-3 animate-pulse" />
            <h1 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">
              Connect Your Social Media
            </h1>
            <Sparkles className="w-8 h-8 text-primary ml-3 animate-pulse" />
          </div>
          <p className="text-xl text-muted-foreground">
            Choose a platform to start monetizing with international ad agencies
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {platforms.map((platform) => {
            const IconComponent = platform.icon;
            const isSelected = selectedPlatform === platform.id;
            const isConnecting = connecting && currentPlatform === platform.id;
            
            return (
              <Card 
                key={platform.id}
                className={`relative overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-premium ${
                  isSelected ? 'ring-2 ring-primary shadow-premium' : 'shadow-card hover:shadow-card-hover'
                }`}
                onClick={() => !connecting && handleConnect(platform.id)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-5`}></div>
                
                <CardHeader className="text-center relative">
                  <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-br ${platform.color} flex items-center justify-center mb-4 ${
                    isConnecting ? 'animate-pulse' : ''
                  }`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    {platform.name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="text-center space-y-4 relative">
                  <p className="text-muted-foreground">
                    {platform.description}
                  </p>
                  
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-sm font-medium text-primary">
                      {platform.followers}
                    </p>
                  </div>
                  
                  <Button 
                    className={`w-full ${isConnecting ? 'animate-pulse' : ''}`}
                    disabled={connecting}
                    variant={isSelected && !isConnecting ? "default" : "outline"}
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        Connect {platform.name}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
                
                {isConnecting && (
                  <div className="absolute inset-0 bg-background/20 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-sm text-muted-foreground">Verifying account...</p>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Don't worry, we only need read access to verify your account eligibility
          </p>
        </div>
      </div>

      {/* Account Handle Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Connect {platforms.find(p => p.id === currentPlatform)?.name} Account
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="handle">Account Handle/Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="handle"
                  placeholder={`@username or ${currentPlatform}.com/username`}
                  value={accountHandle}
                  onChange={(e) => setAccountHandle(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAccountSubmit}
                disabled={connecting}
                className="flex-1"
              >
                {connecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SocialMediaConnect;