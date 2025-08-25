-- Create a function to check auth.uid() for debugging
CREATE OR REPLACE FUNCTION get_auth_uid()
RETURNS TABLE(uid uuid)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT auth.uid() as uid;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_auth_uid() TO authenticated;
GRANT EXECUTE ON FUNCTION get_auth_uid() TO anon;