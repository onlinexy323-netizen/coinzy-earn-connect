import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDownLeft, IndianRupee, CreditCard, Wallet } from 'lucide-react';
import { useRazorpayPayment } from './RazorpayPayment';
import { useToast } from '@/hooks/use-toast';

interface DepositFormProps {
  onDeposit: () => void;
}

const DepositForm: React.FC<DepositFormProps> = ({ onDeposit }) => {
  const [amount, setAmount] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { initializePayment } = useRazorpayPayment();
  const { toast } = useToast();

  const quickAmounts = [500, 1000, 2000, 5000, 10000];
  
  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  const handleDeposit = () => {
    const numAmount = parseFloat(amount);
    
    if (!amount || numAmount < 100) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter at least ₹100 to deposit."
      });
      return;
    }

    if (numAmount > 100000) {
      toast({
        variant: "destructive", 
        title: "Amount Too High",
        description: "Maximum deposit limit is ₹1,00,000 per transaction."
      });
      return;
    }

    initializePayment(numAmount, () => {
      onDeposit();
      setIsOpen(false);
      setAmount('');
      // Refresh the page to update balance
      window.location.reload();
    }, (error) => {
      console.error('Payment error:', error);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="hero"
          size="sm"
          className="group"
        >
          <ArrowDownLeft className="w-4 h-4 mr-1 group-hover:animate-pulse" />
          Deposit
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary p-1.5">
              <Wallet className="w-full h-full text-white" />
            </div>
            <span>Add Money to Wallet</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Enter Amount
            </Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                placeholder="Minimum ₹100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 h-12 text-lg"
                min="100"
                max="100000"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Min: ₹100 • Max: ₹1,00,000
            </p>
          </div>

          {/* Quick Amount Buttons */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quick Select</Label>
            <div className="grid grid-cols-3 gap-2">
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

          {/* Payment Preview */}
          {amount && parseFloat(amount) >= 100 && (
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Deposit Amount:</span>
                    <span className="font-medium">₹{parseFloat(amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Processing Fee:</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>Total Amount:</span>
                    <span>₹{parseFloat(amount).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Method Info */}
          <div className="flex items-center space-x-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
            <CreditCard className="w-5 h-5 text-primary" />
            <div className="flex-1 text-sm">
              <div className="font-medium text-primary">Secure Payment</div>
              <div className="text-muted-foreground">Powered by Razorpay • UPI, Cards, NetBanking</div>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            onClick={handleDeposit}
            className="w-full h-12 gradient-primary glow-primary"
            disabled={!amount || parseFloat(amount) < 100 || parseFloat(amount) > 100000}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Proceed to Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DepositForm;