-- Fix referral system by generating proper referral codes for existing users
-- and setting up proper referral handling

-- First, let's create a function to generate unique referral codes
CREATE OR REPLACE FUNCTION generate_referral_code(user_full_name TEXT, user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    base_code TEXT;
    final_code TEXT;
    counter INTEGER := 0;
BEGIN
    -- Create base code from name (first 3 chars) + last 4 chars of UUID
    IF user_full_name IS NOT NULL AND LENGTH(user_full_name) > 0 THEN
        base_code := UPPER(LEFT(REGEXP_REPLACE(user_full_name, '[^A-Za-z0-9]', '', 'g'), 3)) || RIGHT(REPLACE(user_id::TEXT, '-', ''), 4);
    ELSE
        -- Fallback to just using UUID parts
        base_code := 'USR' || RIGHT(REPLACE(user_id::TEXT, '-', ''), 4);
    END IF;
    
    final_code := base_code;
    
    -- Check if code exists and make it unique
    WHILE EXISTS (SELECT 1 FROM profiles WHERE referral_code = final_code) LOOP
        counter := counter + 1;
        final_code := base_code || counter::TEXT;
    END LOOP;
    
    RETURN final_code;
END;
$$;

-- Update existing users to have referral codes
UPDATE profiles 
SET referral_code = generate_referral_code(COALESCE(full_name, display_name), user_id)
WHERE referral_code IS NULL OR referral_code = '';

-- Create a trigger function to auto-generate referral codes for new users
CREATE OR REPLACE FUNCTION auto_generate_referral_code()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Only generate if referral_code is null or empty
    IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
        NEW.referral_code := generate_referral_code(COALESCE(NEW.full_name, NEW.display_name), NEW.user_id);
    END IF;
    RETURN NEW;
END;
$$;

-- Create trigger to auto-generate referral codes
DROP TRIGGER IF EXISTS trigger_auto_generate_referral_code ON profiles;
CREATE TRIGGER trigger_auto_generate_referral_code
    BEFORE INSERT OR UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_referral_code();

-- Fix the handle_referral_signup trigger function to work with referral codes instead of UUIDs
CREATE OR REPLACE FUNCTION handle_referral_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    referrer_user_id UUID;
BEGIN
    -- Check if user was referred
    IF NEW.referral_code IS NOT NULL AND NEW.referral_code != '' THEN
        -- Find referrer by their referral code (not user ID)
        SELECT user_id INTO referrer_user_id
        FROM public.profiles
        WHERE referral_code = NEW.referral_code
        LIMIT 1;
        
        -- If referrer found, update referral data
        IF referrer_user_id IS NOT NULL THEN
            NEW.referred_by = referrer_user_id;
            
            -- Update referrer's stats
            UPDATE public.profiles 
            SET 
                referral_earnings = COALESCE(referral_earnings, 0) + 50,
                total_referrals = COALESCE(total_referrals, 0) + 1,
                updated_at = now()
            WHERE user_id = referrer_user_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger for referral signup processing if it doesn't exist
DROP TRIGGER IF EXISTS trigger_handle_referral_signup ON profiles;
CREATE TRIGGER trigger_handle_referral_signup
    BEFORE INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION handle_referral_signup();