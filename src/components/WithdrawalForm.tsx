import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface WithdrawalFormProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
}

const WithdrawalForm: React.FC<WithdrawalFormProps> = ({ isOpen, onClose, currentBalance }) => {
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const withdrawalAmount = parseFloat(amount);
    
    // Validation
    if (!amount || withdrawalAmount < 500) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Minimum withdrawal amount is ₹500."
      });
      return;
    }
    
    if (withdrawalAmount > currentBalance) {
      toast({
        variant: "destructive",
        title: "Insufficient Balance",
        description: "You don't have enough balance for this withdrawal."
      });
      return;
    }
    
    if (!upiId || !upiId.includes('@')) {
      toast({
        variant: "destructive",
        title: "Invalid UPI ID",
        description: "Please enter a valid UPI ID (example: user@paytm)."
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Withdrawal Request Submitted! 🎉",
        description: "Your withdrawal is being processed and will take 2-4 hours to complete."
      });
      
      // Reset form
      setAmount('');
      setUpiId('');
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Withdrawal Failed",
        description: "There was an error processing your withdrawal. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <span>Withdraw Funds</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Balance */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-2xl font-bold text-primary">₹{currentBalance.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Withdrawal Amount *</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount (min ₹500)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="500"
              max={currentBalance}
            />
            <p className="text-xs text-muted-foreground">
              Minimum withdrawal: ₹500 | Maximum: ₹{currentBalance.toLocaleString()}
            </p>
          </div>
          
          {/* UPI ID Input */}
          <div className="space-y-2">
            <Label htmlFor="upiId">UPI ID *</Label>
            <Input
              id="upiId"
              type="text"
              placeholder="yourname@paytm"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Enter your UPI ID (e.g., username@paytm, username@googlepay)
            </p>
          </div>
          
          {/* Processing Info */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Processing Time:</strong> Withdrawals typically take 2-4 hours to process. 
              You'll receive a confirmation once the amount is transferred to your UPI account.
            </AlertDescription>
          </Alert>
          
          {/* Buttons */}
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting || !amount || !upiId}
            >
              {isSubmitting ? "Processing..." : "Withdraw"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalForm;