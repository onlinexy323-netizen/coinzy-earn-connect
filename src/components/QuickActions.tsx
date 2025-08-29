import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, ArrowUpDown, Zap, TrendingUp } from 'lucide-react';

interface QuickActionsProps {
  onBookSlot: () => void;
  onWithdraw: () => void;
  isSlotActive: boolean;
}

const QuickActions = ({ onBookSlot, onWithdraw, isSlotActive }: QuickActionsProps) => {
  return (
    <Card className="glass-card border-0 mb-8 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Primary CTA - Book Slot */}
          <div className="flex-1">
            <Button 
              onClick={onBookSlot}
              className="w-full h-14 text-lg font-semibold bg-gradient-primary hover:scale-105 transition-all duration-300 shadow-premium hover:shadow-premium-hover"
              disabled={!isSlotActive}
            >
              <Calendar className="mr-2 h-5 w-5" />
              {isSlotActive ? "Book Today's Slot (6PM–10PM)" : "Slot Booking Closed"}
              <Zap className="ml-2 h-5 w-5" />
            </Button>
            {isSlotActive && (
              <p className="text-center text-sm text-muted-foreground mt-2">
                Prime time slot with guaranteed 4.5% returns
              </p>
            )}
          </div>

          {/* Secondary CTA - Withdraw */}
          <div className="flex-1">
            <Button 
              onClick={onWithdraw}
              variant="outline"
              className="w-full h-14 text-lg font-semibold border-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50 hover:scale-105 transition-all duration-300"
            >
              <ArrowUpDown className="mr-2 h-5 w-5" />
              Withdraw Earnings
              <TrendingUp className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Instant withdrawal to your bank account
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;