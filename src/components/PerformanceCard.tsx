import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Calendar, Target } from 'lucide-react';

interface PerformanceCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend?: number;
  isPositive?: boolean;
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  isPositive = true
}) => {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardContent className="p-4 text-center">
        <div className="flex justify-center mb-2">
          {icon}
        </div>
        <div className="text-2xl font-bold text-foreground mb-1">
          {typeof value === 'number' ? `₹${value.toLocaleString()}` : value}
        </div>
        <div className="text-muted-foreground text-sm">{subtitle}</div>
        {trend !== undefined && (
          <div className={`flex items-center justify-center mt-2 text-sm ${
            isPositive ? 'text-green-500' : 'text-red-500'
          }`}>
            <TrendingUp className={`w-3 h-3 mr-1 ${!isPositive ? 'rotate-180' : ''}`} />
            <span>{isPositive ? '+' : '-'}{Math.abs(trend)}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceCard;