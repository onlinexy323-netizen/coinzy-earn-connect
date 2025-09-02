import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, IndianRupee, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InvestmentSlotFormProps {
  category: {
    id: string;
    name: string;
    returnRate: number;
    isActive: boolean;
  };
  onBookSlot: (categoryId: string, amount: number) => void;
}

const InvestmentSlotForm: React.FC<InvestmentSlotFormProps> = ({ category, onBookSlot }) => {
  const [amount, setAmount] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const quickAmounts = [500, 1000, 2000, 5000];
  
  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  const handleBookSlot = () => {
    const numAmount = parseFloat(amount);
    
    if (!amount || numAmount < 500) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter at least ₹500 to book a slot."
      });
      return;
    }

    if (numAmount > 50000) {
      toast({
        variant: "destructive", 
        title: "Amount Too High",
        description: "Maximum investment limit is ₹50,000 per slot."
      });
      return;
    }

    onBookSlot(category.id, numAmount);
    setIsOpen(false);
    setAmount('');
  };

  const estimatedReturn = amount ? parseFloat(amount) * (category.returnRate / 100) : 0;
  const totalReturn = amount ? parseFloat(amount) + estimatedReturn : 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={!category.isActive}
          variant={category.isActive ? "premium" : "outline"}
          size="sm"
          className="relative overflow-hidden group/btn"
        >
          {category.isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500" />
          )}
          <Zap className="w-3 h-3 mr-1" />
          {category.isActive ? "Book Slot" : "Inactive"}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary p-1.5">
              <TrendingUp className="w-full h-full text-white" />
            </div>
            <span>Invest in {category.name}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Category Info */}
          <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
            <div>
              <div className="font-medium">{category.name} Category</div>
              <div className="text-sm text-muted-foreground">Daily return rate</div>
            </div>
            <div className="text-2xl font-bold text-primary">+{category.returnRate}%</div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Investment Amount
            </Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                placeholder="Minimum ₹500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 h-12 text-lg"
                min="500"
                max="50000"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Min: ₹500 • Max: ₹50,000
            </p>
          </div>

          {/* Quick Amount Buttons */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quick Select</Label>
            <div className="grid grid-cols-2 gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAmount(quickAmount)}
                  className={`h-10 ${amount === quickAmount.toString() ? 'border-primary bg-primary/5' : ''}`}
                >
                  ₹{quickAmount.toLocaleString()}
                </Button>
              ))}
            </div>
          </div>

          {/* Investment Preview */}
          {amount && parseFloat(amount) >= 500 && (
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Investment:</span>
                    <span className="font-medium">₹{parseFloat(amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Daily Return ({category.returnRate}%):</span>
                    <span className="font-medium text-green-600">+₹{estimatedReturn.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>Total Tomorrow:</span>
                    <span className="text-green-600">₹{totalReturn.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Time Info */}
          <div className="flex items-center space-x-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <Clock className="w-4 h-4 text-amber-600" />
            <div className="text-sm text-amber-800">
              Returns credited daily at 12:00 PM
            </div>
          </div>

          {/* Risk Warning */}
          <div className="flex items-start space-x-2 p-3 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
            <div className="text-xs text-red-800">
              <div className="font-medium">Investment Risk:</div>
              <div>Returns are not guaranteed. Invest responsibly.</div>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            onClick={handleBookSlot}
            className="w-full h-12 gradient-primary glow-primary"
            disabled={!amount || parseFloat(amount) < 500 || parseFloat(amount) > 50000}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Confirm Investment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentSlotForm;