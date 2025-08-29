import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';

interface ChartData {
  date: string;
  deposits: number;
  earnings: number;
  withdrawals: number;
  balance: number;
}

interface GrowthChartProps {
  data: ChartData[];
}

const GrowthChart = ({ data }: GrowthChartProps) => {
  const [activeView, setActiveView] = useState<'balance' | 'deposits' | 'earnings' | 'withdrawals'>('balance');

  const viewConfig = {
    balance: {
      dataKey: 'balance',
      color: '#8b5cf6',
      name: 'Wallet Balance',
      gradient: 'from-purple-500/20 to-violet-600/20'
    },
    deposits: {
      dataKey: 'deposits',
      color: '#3b82f6',
      name: 'Deposits',
      gradient: 'from-blue-500/20 to-blue-600/20'
    },
    earnings: {
      dataKey: 'earnings',
      color: '#10b981',
      name: 'Earnings',
      gradient: 'from-green-500/20 to-emerald-600/20'
    },
    withdrawals: {
      dataKey: 'withdrawals',
      color: '#f59e0b',
      name: 'Withdrawals',
      gradient: 'from-orange-500/20 to-amber-600/20'
    }
  };

  const currentConfig = viewConfig[activeView];

  return (
    <Card className="glass-card border-0 mb-8">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-xl font-semibold flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-primary" />
            Growth Analytics
          </CardTitle>
          
          <div className="flex flex-wrap gap-2">
            {Object.entries(viewConfig).map(([key, config]) => (
              <Button
                key={key}
                variant={activeView === key ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView(key as any)}
                className={`transition-all duration-200 ${
                  activeView === key 
                    ? 'bg-gradient-primary' 
                    : 'hover:bg-muted'
                }`}
              >
                {config.name}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickLine={{ opacity: 0.5 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={{ opacity: 0.5 }}
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, currentConfig.name]}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Line
                type="monotone"
                dataKey={currentConfig.dataKey}
                stroke={currentConfig.color}
                strokeWidth={3}
                dot={{ fill: currentConfig.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: currentConfig.color }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 flex items-center justify-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          Last 30 days performance
        </div>
      </CardContent>
    </Card>
  );
};

export default GrowthChart;