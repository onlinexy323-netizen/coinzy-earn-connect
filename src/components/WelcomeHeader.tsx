import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DollarSign, Clock, Wallet } from 'lucide-react';

interface WelcomeHeaderProps {
  user: {
    name: string;
    avatar?: string;
  };
  stats: {
    todayEarning: number;
    activeSlots: number;
    walletBalance: number;
  };
}

const WelcomeHeader = ({ user, stats }: WelcomeHeaderProps) => {
  return (
    <div className="mb-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12 ring-2 ring-primary/20">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-gradient-primary text-white font-semibold">
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {user.name}
            </h1>
            <p className="text-muted-foreground">Social Media Creator</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Today's Earning */}
        <Card className="glass-card border-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 hover:from-green-500/20 hover:to-emerald-600/20 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Today's Earning</p>
                <p className="text-2xl font-bold text-green-500">₹{stats.todayEarning}</p>
                <p className="text-xs text-muted-foreground mt-1">Updated at 12 PM</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Slots */}
        <Card className="glass-card border-0 bg-gradient-to-br from-blue-500/10 to-cyan-600/10 hover:from-blue-500/20 hover:to-cyan-600/20 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Active Slots</p>
                <p className="text-2xl font-bold text-blue-500">{stats.activeSlots} Booked</p>
                <p className="text-xs text-muted-foreground mt-1">Running campaigns</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Balance */}
        <Card className="glass-card border-0 bg-gradient-to-br from-purple-500/10 to-violet-600/10 hover:from-purple-500/20 hover:to-violet-600/20 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Wallet Balance</p>
                <p className="text-2xl font-bold text-purple-500">₹{stats.walletBalance}</p>
                <p className="text-xs text-muted-foreground mt-1">Available</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WelcomeHeader;