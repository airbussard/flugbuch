-- QUICK FIX: Allow users to create their profile during registration
-- Run this in Supabase SQL Editor to fix the registration issue

-- The main fix: Allow INSERT when auth.uid() matches the id being inserted
CREATE POLICY IF NOT EXISTS "Users can insert own profile on signup"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Verify the policy was created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'user_profiles' 
AND policyname = 'Users can insert own profile on signup';