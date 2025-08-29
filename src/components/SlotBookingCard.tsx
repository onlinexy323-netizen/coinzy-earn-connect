import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Rocket, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SlotBookingCardProps {
  isBooked: boolean;
  bookedAmount?: number;
  onBookSlot: (amount: number) => void;
}

const SlotBookingCard = ({ isBooked, bookedAmount, onBookSlot }: SlotBookingCardProps) => {
  const [amount, setAmount] = useState('');
  const { toast } = useToast();

  const handleBookSlot = () => {
    const numAmount = parseFloat(amount);
    if (numAmount < 100) {
      toast({
        title: "Minimum Amount Required",
        description: "Please enter at least ₹100 to book a slot.",
        variant: "destructive"
      });
      return;
    }
    onBookSlot(numAmount);
    setAmount('');
  };

  if (isBooked && bookedAmount) {
    return (
      <Card className="glass-card border-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              Slot Booked Successfully!
            </CardTitle>
            <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
              Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-background/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Investment Amount</span>
                <span className="font-semibold text-lg">₹{bookedAmount}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Expected Return (4.5%)</span>
                <span className="font-semibold text-green-500">+₹{(bookedAmount * 0.045).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Return</span>
                <span className="font-bold text-xl text-green-500">₹{(bookedAmount * 1.045).toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-2 h-4 w-4" />
              Your earnings will be credited tomorrow at 12 PM
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-0 bg-gradient-to-br from-blue-500/10 to-cyan-600/10">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Rocket className="mr-2 h-5 w-5 text-blue-500" />
          Book Your Ad Slot Now 🚀
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Investment Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
              <Input
                type="number"
                placeholder="Enter amount (min ₹100)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 h-12 text-lg"
                min="100"
              />
            </div>
          </div>

          {amount && parseFloat(amount) >= 100 && (
            <div className="bg-background/50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Investment:</span>
                <span>₹{amount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Expected Return (4.5%):</span>
                <span className="text-green-500">+₹{(parseFloat(amount) * 0.045).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total Return:</span>
                <span className="text-green-500">₹{(parseFloat(amount) * 1.045).toFixed(2)}</span>
              </div>
            </div>
          )}

          <Button 
            onClick={handleBookSlot}
            className="w-full h-12 bg-gradient-primary hover:scale-105 transition-all duration-300"
            disabled={!amount || parseFloat(amount) < 100}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Confirm Booking
          </Button>

          <div className="text-xs text-muted-foreground text-center">
            Available time: 6:00 PM - 10:00 PM • Guaranteed 4.5% daily return
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SlotBookingCard;