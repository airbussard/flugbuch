-- Add is_admin field to user_profiles if it doesn't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Set admin status for specific user (change the email as needed)
UPDATE user_profiles 
SET is_admin = true 
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'daflyer@krmail.de'
  LIMIT 1
);