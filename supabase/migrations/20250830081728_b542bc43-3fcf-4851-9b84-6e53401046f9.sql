-- Update the handle_custom_signup function to only prepare data, not insert profile yet
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
    result json;
BEGIN
    -- Check if phone number already exists
    IF EXISTS (SELECT 1 FROM public.profiles WHERE phone_number = p_phone_number) THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Phone number already exists'
        );
    END IF;
    
    -- Generate unique user ID
    new_user_id := generate_unique_user_id();
    
    -- Generate email if not provided (format: unique_id@coinzy.app)
    IF p_email IS NULL OR p_email = '' THEN
        generated_email := lower(new_user_id) || '@coinzy.app';
    ELSE
        -- Check if email already exists
        IF EXISTS (SELECT 1 FROM public.profiles WHERE email = p_email) THEN
            RETURN json_build_object(
                'success', false,
                'message', 'Email already exists'
            );
        END IF;
        generated_email := p_email;
    END IF;
    
    -- Return success with user details (profile will be created from frontend after auth user creation)
    result := json_build_object(
        'success', true,
        'user_id', new_user_id,
        'email', generated_email,
        'password', p_password,
        'full_name', p_full_name,
        'phone_number', p_phone_number,
        'referral_code', p_referral_code,
        'message', 'Ready to create account'
    );
    
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'message', 'An error occurred during signup preparation: ' || SQLERRM
        );
END;
$function$;

-- Create a function to create the profile after auth user is created
CREATE OR REPLACE FUNCTION public.create_user_profile(
    p_auth_user_id uuid,
    p_unique_user_id text,
    p_full_name text,
    p_phone_number text,
    p_email text,
    p_referral_code text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    new_profile_id uuid;
    result json;
BEGIN
    -- Insert profile record with the actual auth user ID
    INSERT INTO public.profiles (
        user_id,
        full_name,
        phone_number,
        email,
        unique_user_id,
        referral_code,
        display_name
    ) VALUES (
        p_auth_user_id,
        p_full_name,
        p_phone_number,
        p_email,
        p_unique_user_id,
        p_referral_code,
        p_full_name
    ) RETURNING id INTO new_profile_id;
    
    -- Return success with profile details
    result := json_build_object(
        'success', true,
        'profile_id', new_profile_id,
        'user_id', p_unique_user_id,
        'message', 'Profile created successfully'
    );
    
    RETURN result;
EXCEPTION
    WHEN unique_violation THEN
        RETURN json_build_object(
            'success', false,
            'message', 'Profile already exists for this user'
        );
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'message', 'An error occurred during profile creation: ' || SQLERRM
        );
END;
$function$;