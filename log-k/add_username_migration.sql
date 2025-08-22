-- Add username column to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS username VARCHAR(30) UNIQUE;

-- Create index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_username 
ON user_profiles(LOWER(username)) 
WHERE username IS NOT NULL;

-- Create a function to validate username format
CREATE OR REPLACE FUNCTION validate_username(input_username TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if username matches pattern: 3-30 chars, alphanumeric + underscore only
  IF input_username ~ '^[a-zA-Z0-9_]{3,30}$' THEN
    -- Check against reserved words
    IF LOWER(input_username) IN ('admin', 'system', 'anonymous', 'deleted', 'null', 'undefined', 'user', 'users', 'profile', 'profiles', 'api', 'test', 'root', 'moderator', 'mod', 'bot') THEN
      RETURN FALSE;
    END IF;
    RETURN TRUE;
  END IF;
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Add constraint to ensure username is valid when set
ALTER TABLE user_profiles 
ADD CONSTRAINT check_username_format 
CHECK (username IS NULL OR validate_username(username));

-- Create function to check username availability
CREATE OR REPLACE FUNCTION check_username_available(input_username TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if username is valid format first
  IF NOT validate_username(input_username) THEN
    RETURN FALSE;
  END IF;
  
  -- Check if username already exists (case-insensitive)
  RETURN NOT EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE LOWER(username) = LOWER(input_username)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add RLS policies for username field
-- Policy: Users can read all usernames (for uniqueness checking)
CREATE POLICY "Users can read usernames"
  ON user_profiles
  FOR SELECT
  USING (true);

-- Policy: Users can only update their own username
CREATE POLICY "Users can update own username"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    -- Only allow setting username if it was NULL before (one-time set)
    (username IS NULL OR username = (SELECT username FROM user_profiles WHERE id = auth.uid()))
  );

-- Update existing users with suggested usernames (optional, can be skipped)
-- This generates suggestions based on email prefix, but doesn't set them
DO $$
DECLARE
  user_record RECORD;
  suggested_username TEXT;
  counter INT;
BEGIN
  FOR user_record IN 
    SELECT id, email, first_name, last_name 
    FROM user_profiles 
    WHERE username IS NULL
  LOOP
    -- Try email prefix first
    suggested_username := LOWER(SPLIT_PART(user_record.email, '@', 1));
    -- Remove any non-alphanumeric characters except underscore
    suggested_username := REGEXP_REPLACE(suggested_username, '[^a-z0-9_]', '', 'g');
    
    -- If too short, try first_last combination
    IF LENGTH(suggested_username) < 3 THEN
      suggested_username := LOWER(
        COALESCE(user_record.first_name, '') || 
        COALESCE(user_record.last_name, '')
      );
      suggested_username := REGEXP_REPLACE(suggested_username, '[^a-z0-9_]', '', 'g');
    END IF;
    
    -- Ensure minimum length
    IF LENGTH(suggested_username) < 3 THEN
      suggested_username := 'pilot_' || SUBSTRING(user_record.id::TEXT, 1, 8);
    END IF;
    
    -- Truncate if too long
    IF LENGTH(suggested_username) > 30 THEN
      suggested_username := SUBSTRING(suggested_username, 1, 30);
    END IF;
    
    -- Add number suffix if username already exists
    counter := 1;
    WHILE EXISTS (SELECT 1 FROM user_profiles WHERE LOWER(username) = LOWER(suggested_username)) LOOP
      IF LENGTH(suggested_username || counter::TEXT) <= 30 THEN
        suggested_username := suggested_username || counter::TEXT;
      ELSE
        -- If adding number makes it too long, truncate and add number
        suggested_username := SUBSTRING(suggested_username, 1, 28) || counter::TEXT;
      END IF;
      counter := counter + 1;
      
      -- Safety check to prevent infinite loop
      IF counter > 999 THEN
        suggested_username := 'pilot_' || SUBSTRING(user_record.id::TEXT, 1, 8);
        EXIT;
      END IF;
    END LOOP;
    
    -- Note: We're NOT actually setting the username here, just generating suggestions
    -- Users will need to choose their own username
    -- You could store these suggestions in a separate table if needed
  END LOOP;
END $$;

-- Add comment explaining the username field
COMMENT ON COLUMN user_profiles.username IS 'Unique username for the user, displayed in public areas like PIREPs. Can only be set once.';