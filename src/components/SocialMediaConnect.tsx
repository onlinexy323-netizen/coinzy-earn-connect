import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Instagram, Facebook, Youtube, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SocialMediaConnectProps {
  onConnect: (platform: string) => void;
}

const SocialMediaConnect = ({ onConnect }: SocialMediaConnectProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
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
    setSelectedPlatform(platformId);
    setConnecting(true);

    // Simulate connection process
    setTimeout(() => {
      setConnecting(false);
      onConnect(platformId);
      toast({
        title: "Connection Successful!",
        description: `Your ${platforms.find(p => p.id === platformId)?.name} account is now connected.`,
      });
    }, 2000);
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
            const isConnecting = connecting && isSelected;
            
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
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
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
    </div>
  );
};

export default SocialMediaConnect;