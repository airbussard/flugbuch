-- Migration: Add 'stripe' to subscription_source enum
-- Date: 2024-08-24
-- Purpose: Allow Stripe as a subscription source alongside trial, ios, and web

-- First, check current enum values (for documentation)
-- SELECT unnest(enum_range(NULL::subscription_source));

-- Add 'stripe' to the subscription_source enum type
-- Note: This is safe and won't affect existing data
ALTER TYPE subscription_source ADD VALUE IF NOT EXISTS 'stripe';

-- Verify the change
-- SELECT unnest(enum_range(NULL::subscription_source));

-- Expected values after migration:
-- - trial (free trial)
-- - ios (App Store subscription)
-- - web (web-based login/access)  
-- - stripe (Stripe payment subscription)