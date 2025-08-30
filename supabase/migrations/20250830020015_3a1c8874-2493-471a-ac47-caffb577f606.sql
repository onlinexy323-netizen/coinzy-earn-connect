-- Add custom auth fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number text UNIQUE,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS unique_user_id text UNIQUE,
ADD COLUMN IF NOT EXISTS referral_code text,
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS password_hash text;

-- Create sequence for unique user IDs starting from 1001
CREATE SEQUENCE IF NOT EXISTS user_id_sequence START 1001;

-- Function to generate unique user ID
CREATE OR REPLACE FUNCTION generate_unique_user_id()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    next_id INTEGER;
    unique_id TEXT;
BEGIN
    next_id := nextval('user_id_sequence');
    unique_id := 'SS' || next_id;
    RETURN unique_id;
END;
$$;

-- Create function to handle custom signup (fixed parameter order)
CREATE OR REPLACE FUNCTION public.handle_custom_signup(
    p_full_name text,
    p_phone_number text,
    p_password_hash text,
    p_email text DEFAULT NULL,
    p_referral_code text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_user_id text;
    new_profile_id uuid;
    result json;
BEGIN
    -- Generate unique user ID
    new_user_id := generate_unique_user_id();
    
    -- Insert new profile
    INSERT INTO public.profiles (
        user_id,
        full_name,
        phone_number,
        email,
        unique_user_id,
        password_hash,
        referral_code,
        display_name
    ) VALUES (
        gen_random_uuid(),
        p_full_name,
        p_phone_number,
        p_email,
        new_user_id,
        p_password_hash,
        p_referral_code,
        p_full_name
    ) RETURNING id, unique_user_id INTO new_profile_id, new_user_id;
    
    -- Return success with user details
    result := json_build_object(
        'success', true,
        'user_id', new_user_id,
        'profile_id', new_profile_id,
        'message', 'Account created successfully'
    );
    
    RETURN result;
EXCEPTION
    WHEN unique_violation THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Phone number already exists'
        );
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'message', 'An error occurred during signup'
        );
END;
$$;

-- Create function to handle custom login
CREATE OR REPLACE FUNCTION public.handle_custom_login(
    p_identifier text, -- phone number or unique_user_id
    p_password_hash text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_record record;
    result json;
BEGIN
    -- Try to find user by phone number or unique_user_id
    SELECT * INTO user_record
    FROM public.profiles
    WHERE (phone_number = p_identifier OR unique_user_id = p_identifier)
    AND password_hash = p_password_hash;
    
    IF FOUND THEN
        result := json_build_object(
            'success', true,
            'user_id', user_record.unique_user_id,
            'profile_id', user_record.id,
            'full_name', user_record.full_name,
            'phone_number', user_record.phone_number,
            'email', user_record.email,
            'social_accounts', user_record.social_accounts
        );
    ELSE
        result := json_build_object(
            'success', false,
            'message', 'Invalid credentials'
        );
    END IF;
    
    RETURN result;
END;
$$;