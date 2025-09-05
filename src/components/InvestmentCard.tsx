import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, BarChart3 } from 'lucide-react';

interface InvestmentCardProps {
  title: string;
  category: string;
  dailyRoi: number;
  performance24h: number;
  minInvestment: number;
  maxInvestment: number;
  isLive?: boolean;
  onBook: () => void;
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({
  title,
  category,
  dailyRoi,
  performance24h,
  minInvestment,
  maxInvestment,
  isLive = true,
  onBook
}) => {
  return (
    <Card className="investment-card border-0 text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="text-white/80 text-sm">{category}</p>
            </div>
          </div>
          {isLive && (
            <Badge variant="secondary" className="bg-accent text-accent-foreground font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
              Live
            </Badge>
          )}
        </div>

        <div className="mb-6">
          <div className="text-sm text-white/80 mb-2">24h Performance</div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-1 ${performance24h >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              <TrendingUp className="w-4 h-4" />
              <span className="font-bold">+{performance24h}%</span>
            </div>
          </div>
          
          {/* Mock chart area */}
          <div className="mt-4 h-16 bg-white/10 rounded-lg flex items-end justify-center p-2">
            <div className="flex items-end space-x-1">
              {[40, 60, 45, 80, 65, 90, 75, 85].map((height, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-t from-green-400 to-blue-400 rounded-sm"
                  style={{ width: '8px', height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="w-4 h-4 text-green-300 mr-1" />
            </div>
            <div className="text-2xl font-bold text-green-300">{dailyRoi}%</div>
            <div className="text-white/80 text-xs">Daily ROI</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Target className="w-4 h-4 text-white/80 mr-1" />
            </div>
            <div className="text-sm font-medium text-white">₹{minInvestment} - ₹{maxInvestment}</div>
            <div className="text-white/80 text-xs">Investment Range</div>
          </div>
        </div>

        <Button 
          onClick={onBook}
          className="w-full bg-white/20 hover:bg-white/30 text-white border-0 font-medium"
          size="lg"
        >
          <div className="flex items-center space-x-2">
            <span>Book Investment Slot</span>
          </div>
        </Button>
      </CardContent>
    </Card>
  );
};

export default InvestmentCard;