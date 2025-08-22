-- Function to create trial subscription for new users
CREATE OR REPLACE FUNCTION create_trial_for_new_user()
RETURNS TRIGGER AS $$
DECLARE
  trial_duration_days INTEGER := 28; -- 4 weeks
  trial_end_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Calculate trial end date
  trial_end_date := NOW() + INTERVAL '28 days';
  
  -- Check if user already has any subscription
  IF NOT EXISTS (
    SELECT 1 FROM user_subscriptions 
    WHERE user_id = NEW.id
  ) THEN
    -- Create trial subscription
    INSERT INTO user_subscriptions (
      user_id,
      subscription_tier,
      subscription_source,
      activated_at,
      valid_until,
      notes
    ) VALUES (
      NEW.id,
      'trial',
      'trial',
      NOW(),
      trial_end_date,
      'Auto-created 4-week trial on signup'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS create_trial_subscription ON auth.users;

-- Create trigger for new user signups
CREATE TRIGGER create_trial_subscription
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_trial_for_new_user();

-- Create index for faster subscription lookups
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id_valid 
ON user_subscriptions(user_id, valid_until DESC);

-- Create index for subscription source tracking
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_source 
ON user_subscriptions(subscription_source);

-- Add RLS policies for user_subscriptions if not exists
DO $$ 
BEGIN
  -- Users can view their own subscriptions
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_subscriptions' 
    AND policyname = 'Users can view own subscriptions'
  ) THEN
    CREATE POLICY "Users can view own subscriptions"
    ON user_subscriptions FOR SELECT
    USING (auth.uid() = user_id);
  END IF;

  -- Only system can insert subscriptions (via functions/triggers)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_subscriptions' 
    AND policyname = 'System can insert subscriptions'
  ) THEN
    CREATE POLICY "System can insert subscriptions"
    ON user_subscriptions FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Only system can update subscriptions
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_subscriptions' 
    AND policyname = 'System can update subscriptions'
  ) THEN
    CREATE POLICY "System can update subscriptions"
    ON user_subscriptions FOR UPDATE
    USING (auth.uid() = user_id);
  END IF;

  -- Users cannot delete subscriptions directly
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_subscriptions' 
    AND policyname = 'No direct subscription deletion'
  ) THEN
    CREATE POLICY "No direct subscription deletion"
    ON user_subscriptions FOR DELETE
    USING (false);
  END IF;
END $$;

-- Enable RLS on user_subscriptions
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;