-- Create a trigger function to automatically create user_profiles when a user signs up
-- This bypasses RLS issues by running with SECURITY DEFINER

-- First, create the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert a new profile for the user
  INSERT INTO public.user_profiles (
    id,
    email,
    first_name,
    last_name,
    compliance_mode,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    'EASA', -- Default compliance mode
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    -- Only update if the fields are empty (preserve existing data)
    email = COALESCE(user_profiles.email, NEW.email),
    first_name = CASE 
      WHEN user_profiles.first_name IS NULL OR user_profiles.first_name = '' 
      THEN COALESCE(NEW.raw_user_meta_data->>'first_name', '')
      ELSE user_profiles.first_name
    END,
    last_name = CASE 
      WHEN user_profiles.last_name IS NULL OR user_profiles.last_name = '' 
      THEN COALESCE(NEW.raw_user_meta_data->>'last_name', '')
      ELSE user_profiles.last_name
    END,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, service_role;

-- Add a comment for documentation
COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates a user profile when a new user signs up. Runs with SECURITY DEFINER to bypass RLS.';
COMMENT ON TRIGGER on_auth_user_created ON auth.users IS 'Trigger that creates user_profiles entries for new auth.users';

-- Also create a function to manually create/update a user profile if needed
CREATE OR REPLACE FUNCTION public.ensure_user_profile()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_id uuid;
  user_email text;
  user_metadata jsonb;
BEGIN
  -- Get the current user's ID
  user_id := auth.uid();
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Get user metadata from auth.users
  SELECT email, raw_user_meta_data
  INTO user_email, user_metadata
  FROM auth.users
  WHERE id = user_id;
  
  -- Create or update the profile
  INSERT INTO public.user_profiles (
    id,
    email,
    first_name,
    last_name,
    compliance_mode,
    created_at,
    updated_at
  )
  VALUES (
    user_id,
    user_email,
    COALESCE(user_metadata->>'first_name', ''),
    COALESCE(user_metadata->>'last_name', ''),
    'EASA',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = COALESCE(user_profiles.email, EXCLUDED.email),
    first_name = CASE 
      WHEN user_profiles.first_name IS NULL OR user_profiles.first_name = '' 
      THEN EXCLUDED.first_name
      ELSE user_profiles.first_name
    END,
    last_name = CASE 
      WHEN user_profiles.last_name IS NULL OR user_profiles.last_name = '' 
      THEN EXCLUDED.last_name
      ELSE user_profiles.last_name
    END,
    updated_at = NOW();
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.ensure_user_profile() TO authenticated;

-- Add comment
COMMENT ON FUNCTION public.ensure_user_profile() IS 'Ensures the current user has a profile. Can be called after sign in if profile is missing.';