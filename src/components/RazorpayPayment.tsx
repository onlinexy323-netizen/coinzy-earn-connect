import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RAZORPAY_KEY_ID = 'rzp_live_ptwrhgUXJ6fYgm';

export const useRazorpayPayment = () => {
  const { toast } = useToast();

  const initializePayment = async (amount: number, onSuccess?: () => void, onError?: (error: any) => void) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create transaction record
      const { data: transaction, error: transactionError } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: user.id,
          transaction_type: 'deposit',
          amount: amount,
          status: 'pending'
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: amount * 100, // Razorpay expects amount in paise
        currency: 'INR',
        name: 'Coinzy',
        description: 'Wallet Deposit',
        image: '/favicon.ico',
        order_id: transaction.id,
        handler: async (response: any) => {
          try {
            // Update transaction with payment details
            await supabase
              .from('wallet_transactions')
              .update({
                status: 'completed',
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
              .eq('id', transaction.id);

            toast({
              title: "Payment Successful! 🎉",
              description: `₹${amount} has been added to your wallet.`
            });

            onSuccess?.();
          } catch (error) {
            console.error('Error updating transaction:', error);
            onError?.(error);
          }
        },
        prefill: {
          name: user.user_metadata?.full_name || 'User',
          email: user.email,
        },
        theme: {
          color: '#3b82f6'
        },
        modal: {
          ondismiss: () => {
            // Mark transaction as cancelled if user closes modal
            supabase
              .from('wallet_transactions')
              .update({ status: 'cancelled' })
              .eq('id', transaction.id);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', async (response: any) => {
        await supabase
          .from('wallet_transactions')
          .update({ status: 'failed' })
          .eq('id', transaction.id);
        
        toast({
          variant: "destructive",
          title: "Payment Failed",
          description: "There was an issue processing your payment. Please try again."
        });
        
        onError?.(response.error);
      });

      rzp.open();
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: "Unable to initialize payment. Please try again."
      });
      onError?.(error);
    }
  };

  return { initializePayment };
};