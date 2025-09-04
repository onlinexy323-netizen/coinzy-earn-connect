-- Add referral functionality to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS referral_earnings DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_referrals INTEGER DEFAULT 0;

-- Create function to handle referral bonuses
CREATE OR REPLACE FUNCTION handle_referral_signup()
RETURNS TRIGGER AS $$
DECLARE
    referrer_id UUID;
BEGIN
    -- Check if user was referred
    IF NEW.referral_code IS NOT NULL AND NEW.referral_code != '' THEN
        -- Find referrer by their user ID (referral code)
        SELECT id INTO referrer_id
        FROM public.profiles
        WHERE id::text = NEW.referral_code
        LIMIT 1;
        
        -- If referrer found, update referral data
        IF referrer_id IS NOT NULL THEN
            NEW.referred_by = referrer_id;
            
            -- Update referrer's stats
            UPDATE public.profiles 
            SET 
                referral_earnings = COALESCE(referral_earnings, 0) + 50,
                total_referrals = COALESCE(total_referrals, 0) + 1
            WHERE id = referrer_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for referral handling
DROP TRIGGER IF EXISTS on_referral_signup ON public.profiles;
CREATE TRIGGER on_referral_signup
    BEFORE INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION handle_referral_signup();

-- Add wallet functionality
CREATE TABLE IF NOT EXISTS public.wallet_balance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    balance DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for wallet_balance
ALTER TABLE public.wallet_balance ENABLE ROW LEVEL SECURITY;

-- Wallet policies
CREATE POLICY "Users can view their own wallet balance" 
ON public.wallet_balance 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet balance" 
ON public.wallet_balance 
FOR ALL 
USING (auth.uid() = user_id);

-- Create function to initialize wallet on profile creation
CREATE OR REPLACE FUNCTION initialize_user_wallet()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.wallet_balance (user_id, balance)
    VALUES (NEW.user_id, 0);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for wallet initialization
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
CREATE TRIGGER on_profile_created
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION initialize_user_wallet();