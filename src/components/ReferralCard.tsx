import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Copy, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReferralCardProps {
  referralCode: string;
  referralEarnings: number;
  totalReferrals: number;
}

const ReferralCard: React.FC<ReferralCardProps> = ({ 
  referralCode, 
  referralEarnings, 
  totalReferrals 
}) => {
  const { toast } = useToast();

  const handleCopyReferralCode = async () => {
    const referralLink = `https://coinzy-seven.vercel.app/?ref=${referralCode}`;
    
    try {
      await navigator.clipboard.writeText(referralLink);
      toast({
        title: "Referral Link Copied! 🎉",
        description: "Share this link to earn ₹50 for each successful referral."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Could not copy referral link to clipboard."
      });
    }
  };

  return (
    <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-primary/5 shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-primary p-1.5 shadow-glow-accent">
            <Gift className="w-full h-full text-white" />
          </div>
          <span>Refer & Earn</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-accent">
              ₹{referralEarnings.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Referral Earnings</div>
          </div>
          
          <div>
            <div className="text-2xl font-bold text-primary">
              {totalReferrals}
            </div>
            <div className="text-xs text-muted-foreground">Friends Joined</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Your referral code:</div>
          <div className="flex items-center space-x-2">
            <div className="flex-1 px-3 py-2 bg-muted/30 rounded-lg font-mono text-sm text-center border border-border/50">
              {referralCode}
            </div>
            <Button
              onClick={handleCopyReferralCode}
              size="sm"
              variant="outline"
              className="group hover:border-accent hover:text-accent"
            >
              <Copy className="w-4 h-4 group-hover:animate-pulse" />
            </Button>
          </div>
        </div>
        
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Referral Bonus</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Earn ₹50 for each friend who joins + 2% of their earnings forever!
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralCard;