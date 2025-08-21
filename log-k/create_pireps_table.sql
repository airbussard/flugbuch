-- Create PIREPs (Pilot Reports) table
CREATE TABLE IF NOT EXISTS pireps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icao TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  flight_date DATE,
  aircraft_type TEXT,
  report_type TEXT CHECK (report_type IN ('general', 'weather', 'runway', 'approach', 'service')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_approved BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ
);

-- Create indexes for performance
CREATE INDEX idx_pireps_icao ON pireps(icao) WHERE deleted = false AND is_approved = true;
CREATE INDEX idx_pireps_user_id ON pireps(user_id) WHERE deleted = false;
CREATE INDEX idx_pireps_approval_status ON pireps(is_approved, created_at) WHERE deleted = false;

-- Enable RLS
ALTER TABLE pireps ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read approved PIREPs
CREATE POLICY "Public can read approved PIREPs"
  ON pireps
  FOR SELECT
  USING (is_approved = true AND deleted = false);

-- Policy: Authenticated users can read their own PIREPs (approved or not)
CREATE POLICY "Users can read own PIREPs"
  ON pireps
  FOR SELECT
  USING (auth.uid() = user_id AND deleted = false);

-- Policy: Authenticated users can create PIREPs
CREATE POLICY "Authenticated users can create PIREPs"
  ON pireps
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own unapproved PIREPs
CREATE POLICY "Users can update own unapproved PIREPs"
  ON pireps
  FOR UPDATE
  USING (auth.uid() = user_id AND is_approved = false AND deleted = false)
  WITH CHECK (auth.uid() = user_id AND is_approved = false);

-- Policy: Users can soft delete their own PIREPs
CREATE POLICY "Users can soft delete own PIREPs"
  ON pireps
  FOR UPDATE
  USING (auth.uid() = user_id AND deleted = false)
  WITH CHECK (
    auth.uid() = user_id 
    AND deleted = true 
    AND deleted_at = now()
  );

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() 
    AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy: Admins can read all PIREPs
CREATE POLICY "Admins can read all PIREPs"
  ON pireps
  FOR SELECT
  USING (is_admin());

-- Policy: Admins can update PIREPs (for approval)
CREATE POLICY "Admins can approve PIREPs"
  ON pireps
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Policy: Admins can delete PIREPs
CREATE POLICY "Admins can delete PIREPs"
  ON pireps
  FOR DELETE
  USING (is_admin());

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_pireps_updated_at 
  BEFORE UPDATE ON pireps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to prevent spam (max 5 PIREPs per user per day)
CREATE OR REPLACE FUNCTION check_pirep_spam_limit()
RETURNS TRIGGER AS $$
DECLARE
  pirep_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO pirep_count
  FROM pireps
  WHERE user_id = NEW.user_id
    AND created_at >= CURRENT_DATE
    AND deleted = false;
  
  IF pirep_count >= 5 THEN
    RAISE EXCEPTION 'Daily PIREP limit exceeded. Maximum 5 PIREPs per day allowed.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for spam prevention
CREATE TRIGGER check_pirep_spam
  BEFORE INSERT ON pireps
  FOR EACH ROW
  EXECUTE FUNCTION check_pirep_spam_limit();