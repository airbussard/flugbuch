-- Add language column to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS language VARCHAR(2) DEFAULT 'en';

-- Add check constraint to ensure valid language codes
ALTER TABLE user_profiles
ADD CONSTRAINT valid_language_code 
CHECK (language IN ('en', 'de', 'fr', 'es'));

-- Comment on the column
COMMENT ON COLUMN user_profiles.language IS 'User preferred language for the interface (en, de, fr, es)';