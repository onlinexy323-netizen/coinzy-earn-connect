-- Create database functions for wallet and referral operations
-- Function to update wallet balance
CREATE OR REPLACE FUNCTION update_wallet_balance(user_id UUID, amount_to_add NUMERIC)
RETURNS VOID AS $$
BEGIN
  -- Insert or update wallet balance
  INSERT INTO public.wallet_balance (user_id, balance, created_at, updated_at)
  VALUES (user_id, amount_to_add, now(), now())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    balance = public.wallet_balance.balance + amount_to_add,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add referral bonus
CREATE OR REPLACE FUNCTION add_referral_bonus(referrer_id UUID, amount NUMERIC)
RETURNS VOID AS $$
DECLARE
  bonus_amount NUMERIC := 50; -- Fixed bonus of ₹50
  commission_amount NUMERIC := amount * 0.02; -- 2% commission
BEGIN
  -- Add fixed referral bonus to referrer's wallet
  PERFORM update_wallet_balance(referrer_id, bonus_amount);
  
  -- Add commission to referrer's wallet  
  PERFORM update_wallet_balance(referrer_id, commission_amount);
  
  -- Update referrer's earnings and count
  UPDATE public.profiles 
  SET 
    referral_earnings = COALESCE(referral_earnings, 0) + bonus_amount + commission_amount,
    total_referrals = COALESCE(total_referrals, 0) + 1,
    updated_at = now()
  WHERE user_id = referrer_id;
  
  -- Create transaction record for referral bonus
  INSERT INTO public.wallet_transactions (user_id, transaction_type, amount, status, created_at)
  VALUES 
    (referrer_id, 'referral_bonus', bonus_amount, 'completed', now()),
    (referrer_id, 'referral_commission', commission_amount, 'completed', now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to initialize new user data
CREATE OR REPLACE FUNCTION initialize_user_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Initialize wallet balance for new user
  INSERT INTO public.wallet_balance (user_id, balance, created_at, updated_at)
  VALUES (NEW.user_id, 0, now(), now())
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to initialize user data when profile is created
DROP TRIGGER IF EXISTS initialize_user_data_trigger ON public.profiles;
CREATE TRIGGER initialize_user_data_trigger
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_data();

-- Fix referral code lookup (search by referral_code, not id)
CREATE OR REPLACE FUNCTION get_referrer_by_code(ref_code TEXT)
RETURNS UUID AS $$
DECLARE
  referrer_user_id UUID;
BEGIN
  SELECT user_id INTO referrer_user_id
  FROM public.profiles
  WHERE referral_code = ref_code;
  
  RETURN referrer_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;