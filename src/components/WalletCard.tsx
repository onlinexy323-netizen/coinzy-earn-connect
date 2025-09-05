import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Plus, ArrowUpRight, Wallet } from 'lucide-react';

interface WalletCardProps {
  balance: number;
  referralEarnings: number;
  totalInvested: number;
  showBalance: boolean;
  onToggleBalance: () => void;
  onAddMoney: () => void;
  onWithdraw: () => void;
}

const WalletCard: React.FC<WalletCardProps> = ({
  balance,
  referralEarnings,
  totalInvested,
  showBalance,
  onToggleBalance,
  onAddMoney,
  onWithdraw
}) => {
  return (
    <Card className="investment-card border-0 text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-white" />
            <span className="text-lg font-semibold">My Wallet</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleBalance}
            className="text-white hover:bg-white/20 p-2"
          >
            {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
        </div>

        <div className="mb-6">
          <div className="text-4xl font-bold mb-2">
            {showBalance ? `₹${balance.toLocaleString()}` : '₹****'}
          </div>
          <div className="text-white/80">Available Balance</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-xl font-bold text-accent">₹{referralEarnings.toLocaleString()}</div>
            <div className="text-white/80 text-sm">Referral Earnings</div>
          </div>
          <div>
            <div className="text-xl font-bold">₹{totalInvested.toLocaleString()}</div>
            <div className="text-white/80 text-sm">Total Invested</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={onAddMoney}
            className="bg-white/20 hover:bg-white/30 text-white border-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Money
          </Button>
          <Button
            onClick={onWithdraw}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Withdraw
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletCard;