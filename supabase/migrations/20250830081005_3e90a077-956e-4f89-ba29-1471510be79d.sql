-- Update the handle_custom_signup function to work with Supabase auth
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
    auth_user_id uuid;
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
    
    -- Create Supabase auth user
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        generated_email,
        crypt(p_password, gen_salt('bf')),
        now(),
        '{"provider": "email", "providers": ["email"]}',
        jsonb_build_object('full_name', p_full_name, 'unique_user_id', new_user_id),
        now(),
        now(),
        '',
        '',
        '',
        ''
    ) RETURNING id INTO auth_user_id;
    
    -- Insert profile with the auth user ID
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
        auth_user_id,
        p_full_name,
        p_phone_number,
        generated_email,
        new_user_id,
        crypt(p_password, gen_salt('bf')),
        p_referral_code,
        p_full_name
    ) RETURNING id INTO new_profile_id;
    
    -- Return success with user details
    result := json_build_object(
        'success', true,
        'user_id', new_user_id,
        'profile_id', new_profile_id,
        'email', generated_email,
        'auth_user_id', auth_user_id,
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

-- Update the handle_custom_login function to work with emails
CREATE OR REPLACE FUNCTION public.handle_custom_login(p_identifier text, p_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    user_record record;
    user_email text;
    result json;
BEGIN
    -- First, find the email associated with the unique_user_id
    SELECT email INTO user_email
    FROM public.profiles
    WHERE unique_user_id = p_identifier;
    
    IF user_email IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Invalid User ID'
        );
    END IF;
    
    -- Return the email and user info for frontend to use with Supabase auth
    SELECT p.*, p.email INTO user_record
    FROM public.profiles p
    WHERE p.unique_user_id = p_identifier;
    
    IF FOUND THEN
        result := json_build_object(
            'success', true,
            'email', user_record.email,
            'user_id', user_record.unique_user_id,
            'profile_id', user_record.id,
            'full_name', user_record.full_name,
            'phone_number', user_record.phone_number,
            'social_accounts', user_record.social_accounts
        );
    ELSE
        result := json_build_object(
            'success', false,
            'message', 'Invalid User ID'
        );
    END IF;
    
    RETURN result;
END;
$function$;