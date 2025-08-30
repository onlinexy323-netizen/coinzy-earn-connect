-- Drop the existing function first
DROP FUNCTION IF EXISTS public.handle_custom_signup(text,text,text,text,text);

-- Create the updated function with proper Supabase auth integration
CREATE OR REPLACE FUNCTION public.handle_custom_signup(
    p_full_name text, 
    p_phone_number text, 
    p_password text, 
    p_email text DEFAULT NULL::text, 
    p_referral_code text DEFAULT NULL::text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    new_user_id text;
    generated_email text;
    new_profile_id uuid;
    result json;
BEGIN
    -- Generate unique user ID
    new_user_id := generate_unique_user_id();
    
    -- Generate email if not provided (format: unique_id@coinzy.app)
    IF p_email IS NULL OR p_email = '' THEN
        generated_email := lower(new_user_id) || '@coinzy.app';
    ELSE
        generated_email := p_email;
    END IF;
    
    -- Insert profile record (we'll use Supabase auth from frontend)
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
        gen_random_uuid(), -- Temporary, will be updated after auth user creation
        p_full_name,
        p_phone_number,
        generated_email,
        new_user_id,
        p_password, -- Store plain password for frontend to use with Supabase auth
        p_referral_code,
        p_full_name
    ) RETURNING id INTO new_profile_id;
    
    -- Return success with user details
    result := json_build_object(
        'success', true,
        'user_id', new_user_id,
        'profile_id', new_profile_id,
        'email', generated_email,
        'password', p_password,
        'message', 'Account created successfully'
    );
    
    RETURN result;
EXCEPTION
    WHEN unique_violation THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Phone number or email already exists'
        );
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'message', 'An error occurred during signup: ' || SQLERRM
        );
END;
$function$;