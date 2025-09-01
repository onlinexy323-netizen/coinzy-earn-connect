import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useRazorpayPayment } from './RazorpayPayment';
import { useToast } from '@/hooks/use-toast';

interface WalletOverviewCardProps {
  balance: number;
  onDeposit: () => void;
  onWithdraw: () => void;
}

const WalletOverviewCard: React.FC<WalletOverviewCardProps> = ({ 
  balance, 
  onDeposit, 
  onWithdraw 
}) => {
  const { toast } = useToast();
  const { initializePayment } = useRazorpayPayment();

  const handleDeposit = () => {
    initializePayment(1000, () => {
      onDeposit();
      // Refresh the page to update balance
      window.location.reload();
    }, (error) => {
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: "There was an issue with your payment. Please try again."
      });
    });
  };

  const handleWithdraw = () => {
    toast({
      title: "Withdrawal Initiated",
      description: "Your withdrawal request has been submitted and will be processed within 2 hours."
    });
    onWithdraw();
  };
  return (
    <Card className="gradient-card border-border/50 shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary p-1.5 shadow-glow-primary">
            <Wallet className="w-full h-full text-white" />
          </div>
          <span>Wallet Balance</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-foreground mb-1">
            ₹{balance.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">Available Balance</div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleDeposit}
            variant="hero"
            size="sm"
            className="group"
          >
            <ArrowDownLeft className="w-4 h-4 mr-1 group-hover:animate-pulse" />
            Deposit
          </Button>
          
          <Button
            onClick={() => {
              // Withdrawal feature coming soon
              toast({
                title: "Coming Soon",
                description: "Withdrawal feature will be available soon. For now, use your balance for slot bookings."
              });
            }}
            variant="outline"
            size="sm"
            className="group cursor-not-allowed opacity-50"
            disabled
          >
            <ArrowUpRight className="w-4 h-4 mr-1" />
            Withdraw
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletOverviewCard;