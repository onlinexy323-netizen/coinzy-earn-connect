-- Update the login function to only accept unique_user_id (no phone number)
CREATE OR REPLACE FUNCTION public.handle_custom_login(p_identifier text, p_password_hash text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
    user_record record;
    result json;
BEGIN
    -- Find user only by unique_user_id (remove phone number option)
    SELECT * INTO user_record
    FROM public.profiles
    WHERE unique_user_id = p_identifier
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
            'message', 'Invalid User ID or password'
        );
    END IF;
    
    RETURN result;
END;
$function$