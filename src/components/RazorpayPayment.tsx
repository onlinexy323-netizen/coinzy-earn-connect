import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const useRazorpayPayment = () => {
  const { toast } = useToast();

  const initializePayment = async (amount: number, onSuccess?: () => void, onError?: (error: any) => void) => {
    try {
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user) {
        throw new Error('User not authenticated. Please log in again.');
      }

      // Create Razorpay order via edge function
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount }
      });

      if (orderError) {
        throw new Error(orderError.message || 'Failed to create payment order');
      }

      if (!orderData.order_id) {
        throw new Error('Invalid order response from server');
      }

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
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Coinzy',
        description: 'Wallet Deposit',
        image: '/favicon.ico',
        order_id: orderData.order_id,
        handler: async (response: any) => {
          try {
            // Verify payment via edge function
            const { data: verificationResult, error: verificationError } = await supabase.functions.invoke('verify-razorpay-payment', {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                transaction_id: orderData.transaction_id
              }
            });

            if (verificationError) {
              throw new Error(verificationError.message || 'Payment verification failed');
            }

            toast({
              title: "Payment Successful! 🎉",
              description: `₹${amount} has been added to your wallet.`
            });

            onSuccess?.();
          } catch (error) {
            console.error('Error verifying payment:', error);
            toast({
              variant: "destructive",
              title: "Payment Verification Failed",
              description: "Payment completed but verification failed. Contact support."
            });
            onError?.(error);
          }
        },
        prefill: {
          name: session.user.user_metadata?.full_name || 'User',
          email: session.user.email,
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
              .eq('id', orderData.transaction_id);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', async (response: any) => {
        await supabase
          .from('wallet_transactions')
          .update({ status: 'failed' })
          .eq('id', orderData.transaction_id);
        
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