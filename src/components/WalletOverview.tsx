import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpCircle, ArrowDownCircle, Wallet, TrendingUp } from 'lucide-react';

interface WalletData {
  totalDeposited: number;
  totalEarnings: number;
  totalWithdrawn: number;
  availableBalance: number;
}

interface WalletOverviewProps {
  walletData: WalletData;
}

const WalletOverview = ({ walletData }: WalletOverviewProps) => {
  const cards = [
    {
      title: 'Total Deposited',
      value: walletData.totalDeposited,
      icon: ArrowDownCircle,
      color: 'text-blue-500',
      bgColor: 'from-blue-500/10 to-blue-600/10',
      hoverColor: 'hover:from-blue-500/20 hover:to-blue-600/20',
      iconBg: 'bg-blue-500/20'
    },
    {
      title: 'Total Earnings',
      value: walletData.totalEarnings,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'from-green-500/10 to-emerald-600/10',
      hoverColor: 'hover:from-green-500/20 hover:to-emerald-600/20',
      iconBg: 'bg-green-500/20'
    },
    {
      title: 'Total Withdrawn',
      value: walletData.totalWithdrawn,
      icon: ArrowUpCircle,
      color: 'text-orange-500',
      bgColor: 'from-orange-500/10 to-amber-600/10',
      hoverColor: 'hover:from-orange-500/20 hover:to-amber-600/20',
      iconBg: 'bg-orange-500/20'
    },
    {
      title: 'Available Balance',
      value: walletData.availableBalance,
      icon: Wallet,
      color: 'text-purple-500',
      bgColor: 'from-purple-500/10 to-violet-600/10',
      hoverColor: 'hover:from-purple-500/20 hover:to-violet-600/20',
      iconBg: 'bg-purple-500/20'
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Wallet Overview</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Card 
              key={index} 
              className={`glass-card border-0 bg-gradient-to-br ${card.bgColor} ${card.hoverColor} transition-all duration-300 hover:scale-105`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {card.title}
                    </p>
                    <p className={`text-xl font-bold ${card.color}`}>
                      ₹{card.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`h-10 w-10 rounded-full ${card.iconBg} flex items-center justify-center ml-3`}>
                    <IconComponent className={`h-5 w-5 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default WalletOverview;