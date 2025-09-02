import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Star, 
  Globe, 
  Info, 
  MessageSquare, 
  LogOut,
  FileText,
  Calendar,
  Share2,
  Copy
} from 'lucide-react';
import { useAuthData } from '@/hooks/useAuthData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const UserProfile: React.FC = () => {
  const { userData, user, getUserDisplayName, getUserEmail, getUserAvatar } = useAuthData();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [copying, setCopying] = useState(false);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out."
      });
      navigate('/');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again."
      });
    }
  };

  const handleCopyReferral = async () => {
    const referralLink = `https://coinzy-seven.vercel.app/?ref=${user?.id}`;
    setCopying(true);
    
    try {
      await navigator.clipboard.writeText(referralLink);
      toast({
        title: "Referral Link Copied! 🎉",
        description: "Share this link to earn referral bonuses."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Could not copy referral link."
      });
    } finally {
      setTimeout(() => setCopying(false), 1000);
    }
  };

  const menuItems = [
    { icon: User, label: "Your Profile", onClick: () => {} },
    { icon: Star, label: "Your Ratings", onClick: () => {} },
    { icon: Globe, label: "Choose Language", onClick: () => {} },
    { icon: Info, label: "About", onClick: () => {} },
    { icon: MessageSquare, label: "Feedback", onClick: () => {} },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
        <h1 className="text-2xl font-bold mb-4">Your Account</h1>
        
        {/* User Info */}
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16 border-2 border-white/20">
            <AvatarImage src={getUserAvatar()} alt={getUserDisplayName()} />
            <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
              {getUserDisplayName().charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{getUserDisplayName()}</h2>
            <p className="text-white/80">{getUserEmail()}</p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary-foreground p-0 h-auto font-normal hover:bg-transparent"
              onClick={() => {}}
            >
              View Activity
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="font-medium">Collection</p>
          </Card>
          
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="font-medium">My Orders</p>
          </Card>
        </div>

        {/* Referral Section */}
        <Card className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Share2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Refer & Earn</h3>
                <p className="text-sm text-muted-foreground">Share and earn rewards</p>
              </div>
            </div>
            <Button 
              size="sm" 
              onClick={handleCopyReferral}
              disabled={copying}
              className="min-w-[80px]"
            >
              {copying ? (
                <span className="text-xs">Copied!</span>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Menu Items */}
        <Card>
          <CardContent className="p-0">
            {menuItems.map((item, index) => (
              <div key={index}>
                <div 
                  className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={item.onClick}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/30"></div>
                </div>
                {index < menuItems.length - 1 && <Separator />}
              </div>
            ))}
            
            <Separator />
            
            {/* Sign Out */}
            <div 
              className="flex items-center justify-between p-4 hover:bg-destructive/10 cursor-pointer transition-colors"
              onClick={handleSignOut}
            >
              <div className="flex items-center space-x-3">
                <LogOut className="w-5 h-5 text-destructive" />
                <span className="font-medium text-destructive">Sign Out</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;