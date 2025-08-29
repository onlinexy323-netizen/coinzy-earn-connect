import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

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
            onClick={onDeposit}
            variant="hero"
            size="sm"
            className="group"
          >
            <ArrowDownLeft className="w-4 h-4 mr-1 group-hover:animate-pulse" />
            Deposit
          </Button>
          
          <Button
            onClick={onWithdraw}
            variant="outline"
            size="sm"
            className="group hover:border-success hover:text-success"
          >
            <ArrowUpRight className="w-4 h-4 mr-1 group-hover:animate-pulse" />
            Withdraw
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletOverviewCard;