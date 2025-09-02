import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, Calendar, Activity, ArrowUp, ArrowDown } from 'lucide-react';

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
  const [animatedData, setAnimatedData] = useState(data);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setAnimatedData(data);
      setIsAnimating(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [data, activeView]);

  const viewConfig = {
    balance: {
      dataKey: 'balance',
      color: '#8b5cf6',
      name: 'Wallet Balance',
      gradient: 'from-purple-500/20 to-violet-600/20',
      icon: TrendingUp
    },
    deposits: {
      dataKey: 'deposits',
      color: '#3b82f6',
      name: 'Deposits',
      gradient: 'from-blue-500/20 to-blue-600/20',
      icon: ArrowDown
    },
    earnings: {
      dataKey: 'earnings',
      color: '#10b981',
      name: 'Earnings',
      gradient: 'from-green-500/20 to-emerald-600/20',
      icon: TrendingUp
    },
    withdrawals: {
      dataKey: 'withdrawals',
      color: '#f59e0b',
      name: 'Withdrawals',
      gradient: 'from-orange-500/20 to-amber-600/20',
      icon: ArrowUp
    }
  };

  const currentConfig = viewConfig[activeView];
  const IconComponent = currentConfig.icon;
  
  // Calculate current value and change
  const currentValue = animatedData[animatedData.length - 1]?.[currentConfig.dataKey] || 0;
  const previousValue = animatedData[animatedData.length - 2]?.[currentConfig.dataKey] || 0;
  const changeAmount = currentValue - previousValue;
  const changePercent = previousValue > 0 ? ((changeAmount / previousValue) * 100) : 0;
  const isPositive = changeAmount >= 0;

  return (
    <Card className="glass-card border-0 mb-8 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-xl font-semibold flex items-center">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary p-1.5 mr-2 ${isAnimating ? 'animate-pulse' : ''}`}>
              <IconComponent className="w-full h-full text-white" />
            </div>
            <div>
              <div>Growth Analytics</div>
              <div className="text-sm font-normal text-muted-foreground">
                {currentConfig.name}: ₹{currentValue.toLocaleString()}
                <span className={`ml-2 inline-flex items-center text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                  {changePercent.toFixed(1)}%
                </span>
              </div>
            </div>
          </CardTitle>
          
          <div className="flex flex-wrap gap-2">
            {Object.entries(viewConfig).map(([key, config]) => {
              const IconComp = config.icon;
              return (
                <Button
                  key={key}
                  variant={activeView === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveView(key as any)}
                  className={`transition-all duration-300 ${
                    activeView === key 
                      ? 'bg-gradient-primary shadow-glow-primary' 
                      : 'hover:bg-muted hover:scale-105'
                  }`}
                >
                  <IconComp className="w-3 h-3 mr-1" />
                  {config.name}
                </Button>
              );
            })}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className={`h-80 w-full transition-opacity duration-300 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={animatedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id={`gradient-${activeView}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentConfig.color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={currentConfig.color} stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="hsl(var(--muted-foreground))" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ opacity: 0.3 }}
                axisLine={{ opacity: 0.3 }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ opacity: 0.3 }}
                axisLine={{ opacity: 0.3 }}
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  backdropFilter: 'blur(10px)'
                }}
                formatter={(value: number) => [
                  `₹${value.toLocaleString()}`, 
                  currentConfig.name
                ]}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                cursor={{ stroke: currentConfig.color, strokeOpacity: 0.3 }}
              />
              {/* Average line */}
              <ReferenceLine 
                y={animatedData.reduce((acc, item) => acc + item[currentConfig.dataKey], 0) / animatedData.length}
                stroke={currentConfig.color}
                strokeDasharray="5 5"
                strokeOpacity={0.4}
                label={{ value: "Average", position: "top" }}
              />
              <Line
                type="monotone"
                dataKey={currentConfig.dataKey}
                stroke={currentConfig.color}
                strokeWidth={3}
                dot={{ 
                  fill: currentConfig.color, 
                  strokeWidth: 2, 
                  r: 4,
                  className: 'animate-pulse'
                }}
                activeDot={{ 
                  r: 8, 
                  fill: currentConfig.color,
                  stroke: 'hsl(var(--background))',
                  strokeWidth: 2,
                  className: 'animate-ping'
                }}
                fill={`url(#gradient-${activeView})`}
                connectNulls={false}
                animationDuration={800}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            Live trading data
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <Activity className="w-4 h-4 mr-1" />
              <span className="font-medium">
                {isPositive ? '+' : ''}₹{Math.abs(changeAmount).toLocaleString()}
              </span>
            </div>
            <div className="text-muted-foreground">
              Last update: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GrowthChart;