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
    const { amount } = await req.json();
    
    if (!amount || amount < 100) {
      throw new Error("Invalid amount. Minimum ₹100 required.");
    }

    // Get Razorpay key from environment
    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    
    console.log("Environment check:", {
      keyIdExists: !!razorpayKeyId,
      keySecretExists: !!razorpayKeySecret,
      keyIdLength: razorpayKeyId?.length,
      keySecretLength: razorpayKeySecret?.length
    });
    
    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error("Missing credentials:", {
        keyId: razorpayKeyId ? "present" : "missing",
        keySecret: razorpayKeySecret ? "present" : "missing"
      });
      throw new Error("Razorpay credentials not configured");
    }

    // Create Razorpay order
    const orderData = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `order_${Date.now()}`,
    };

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Razorpay API error: ${error}`);
    }

    const order = await response.json();

    // Verify user is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      throw new Error("User not authenticated");
    }

    // Create transaction record
    const { data: transaction, error: transactionError } = await supabaseClient
      .from('wallet_transactions')
      .insert({
        user_id: user.id,
        transaction_type: 'deposit',
        amount: amount,
        status: 'pending',
        razorpay_order_id: order.id
      })
      .select()
      .single();

    if (transactionError) {
      throw new Error(`Database error: ${transactionError.message}`);
    }

    return new Response(
      JSON.stringify({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: razorpayKeyId,
        transaction_id: transaction.id
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to create order",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});