-- Fix RLS policy for user_profiles to allow INSERT on registration
-- Date: 2024-08-25
-- Issue: New users cannot create their profile due to missing INSERT policy

-- Enable RLS on user_profiles if not already enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing INSERT policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Users can insert own profile on signup" ON user_profiles;
DROP POLICY IF EXISTS "Users can create own profile" ON user_profiles;

-- Create INSERT policy that allows users to create their own profile
-- The key insight: auth.uid() must match the id being inserted
CREATE POLICY "Users can insert own profile on signup"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Also ensure SELECT policy exists for users to read their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Ensure UPDATE policy exists (from previous migrations)
-- This allows users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Optional: Allow users to read all profiles for features like username checking
-- This might already exist from username migration
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON user_profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON user_profiles
  FOR SELECT
  USING (true);

-- Comment for documentation
COMMENT ON POLICY "Users can insert own profile on signup" ON user_profiles IS 
  'Allows authenticated users to create their profile during registration. The id must match their auth.uid()';

COMMENT ON POLICY "Users can view own profile" ON user_profiles IS 
  'Allows users to view their own profile data';

COMMENT ON POLICY "Users can update own profile" ON user_profiles IS 
  'Allows users to update their own profile data';

COMMENT ON POLICY "Public profiles are viewable by everyone" ON user_profiles IS 
  'Allows reading of all profiles for features like username uniqueness checking';