-- Migration: Cleanup trial status for users with active subscriptions
-- Date: 2024-08-24
-- Purpose: Set trial_status to 'inactive' for users who have real subscriptions
--          This prevents duplicate entries in admin view

-- First, update all trial statuses to inactive where users have active subscriptions
UPDATE user_trial_status 
SET 
    trial_status = 'inactive',
    updated_at = NOW()
WHERE user_id IN (
    SELECT DISTINCT user_id 
    FROM user_subscriptions 
    WHERE subscription_source IN ('stripe', 'ios', 'web')
    AND subscription_tier NOT IN ('none', 'trial')
    AND valid_until > NOW()
)
AND trial_status = 'active_trial';

-- Log how many records were updated
DO $$
DECLARE
    affected_rows INTEGER;
BEGIN
    GET DIAGNOSTICS affected_rows = ROW_COUNT;
    RAISE NOTICE 'Updated % trial records to inactive status', affected_rows;
END $$;

-- Create a trigger to automatically set trial to inactive when a real subscription is created
CREATE OR REPLACE FUNCTION auto_deactivate_trial_on_subscription()
RETURNS TRIGGER AS $$
BEGIN
    -- When a new subscription is inserted or updated to an active state
    IF (NEW.subscription_source IN ('stripe', 'ios', 'web') 
        AND NEW.subscription_tier NOT IN ('none', 'trial')
        AND NEW.valid_until > NOW()) THEN
        
        -- Set the trial status to inactive for this user
        UPDATE user_trial_status 
        SET 
            trial_status = 'inactive',
            updated_at = NOW()
        WHERE user_id = NEW.user_id
        AND trial_status = 'active_trial';
        
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS deactivate_trial_on_subscription ON user_subscriptions;

CREATE TRIGGER deactivate_trial_on_subscription
    AFTER INSERT OR UPDATE ON user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION auto_deactivate_trial_on_subscription();

-- Add comment for documentation
COMMENT ON FUNCTION auto_deactivate_trial_on_subscription() IS 
'Automatically sets trial_status to inactive when a user gets a real subscription (stripe, ios, web)';

-- Verify the cleanup
SELECT 
    COUNT(*) as total_inactive_trials,
    COUNT(CASE WHEN us.user_id IS NOT NULL THEN 1 END) as trials_with_active_subscription
FROM user_trial_status uts
LEFT JOIN user_subscriptions us ON uts.user_id = us.user_id 
    AND us.subscription_source IN ('stripe', 'ios', 'web')
    AND us.subscription_tier NOT IN ('none', 'trial')
    AND us.valid_until > NOW()
WHERE uts.trial_status = 'inactive';