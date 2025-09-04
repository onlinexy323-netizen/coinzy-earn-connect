import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, transaction_id } = await req.json();

    // Verify signature using Web Crypto API
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!razorpayKeySecret) {
      throw new Error("Razorpay secret not configured");
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    
    // Create HMAC SHA256 signature
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(razorpayKeySecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const signature = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(body)
    );
    
    const expectedSignature = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (expectedSignature !== razorpay_signature) {
      throw new Error("Invalid payment signature");
    }

    // Create Supabase client with service role for database operations
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Update transaction status
    const { data: transaction, error: updateError } = await supabaseService
      .from('wallet_transactions')
      .update({
        status: 'completed',
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature,
        updated_at: new Date().toISOString()
      })
      .eq('id', transaction_id)
      .eq('razorpay_order_id', razorpay_order_id)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to update transaction: ${updateError.message}`);
    }

    // Update wallet balance
    const { error: balanceError } = await supabaseService.rpc('update_wallet_balance', {
      user_id: transaction.user_id,
      amount_to_add: transaction.amount
    });

    if (balanceError) {
      console.error('Balance update error:', balanceError);
      // Don't throw here as payment is already successful
    }

    // Check and process referral bonus if applicable
    const { data: profile } = await supabaseService
      .from('profiles')
      .select('referred_by')
      .eq('user_id', transaction.user_id)
      .single();

    if (profile?.referred_by) {
      // Give referral bonus to referrer
      await supabaseService.rpc('add_referral_bonus', {
        referrer_id: profile.referred_by,
        amount: transaction.amount
      });
    }

    return new Response(
      JSON.stringify({ success: true, transaction }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Payment verification error:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message || "Payment verification failed",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});