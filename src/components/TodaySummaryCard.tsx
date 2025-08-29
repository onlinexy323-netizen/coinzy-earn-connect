import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface BookedSlot {
  id: string;
  category: string;
  amount: number;
  returnRate: number;
  expectedReturn: number;
  status: 'active' | 'completed' | 'pending';
}

interface TodaySummaryCardProps {
  bookedSlots: BookedSlot[];
}

const TodaySummaryCard: React.FC<TodaySummaryCardProps> = ({ bookedSlots }) => {
  if (bookedSlots.length === 0) return null;

  const totalInvested = bookedSlots.reduce((sum, slot) => sum + slot.amount, 0);
  const totalExpectedReturn = bookedSlots.reduce((sum, slot) => sum + slot.expectedReturn, 0);

  return (
    <Card className="border-success/30 bg-gradient-to-br from-success/5 to-primary/5 shadow-card">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center shadow-glow-secondary">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-success">Today's Bookings Confirmed</h3>
            <p className="text-sm text-muted-foreground">Returns will be credited at 12 PM tomorrow</p>
          </div>
        </div>

        <div className="space-y-3">
          {bookedSlots.map((slot) => (
            <div key={slot.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/30">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-foreground">{slot.category}</div>
                  <div className="text-sm text-muted-foreground">₹{slot.amount.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-semibold text-success">+₹{slot.expectedReturn}</div>
                <div className="text-xs text-muted-foreground">{slot.returnRate}% return</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Total Invested Today</div>
              <div className="text-lg font-bold text-foreground">₹{totalInvested.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Expected Returns</div>
              <div className="text-lg font-bold text-success">₹{totalExpectedReturn.toLocaleString()}</div>
            </div>
          </div>
          
          <div className="mt-3 flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Returns credited automatically at 12 PM tomorrow</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaySummaryCard;