-- Add onboarding tracking fields to businesses table
ALTER TABLE businesses 
ADD COLUMN is_onboarded boolean DEFAULT false,
ADD COLUMN permanent_page_slug text UNIQUE,
ADD COLUMN permanent_page_generated boolean DEFAULT false,
ADD COLUMN onboarded_at timestamptz;

-- Create index for onboarding status queries
CREATE INDEX IF NOT EXISTS idx_businesses_onboarding_status ON businesses(is_onboarded);

-- Create index for permanent page slug lookups
CREATE INDEX IF NOT EXISTS idx_businesses_permanent_slug ON businesses(permanent_page_slug) WHERE permanent_page_slug IS NOT NULL;

-- Comment for documentation
COMMENT ON COLUMN businesses.is_onboarded IS 'Tracks whether user has completed onboarding flow';
COMMENT ON COLUMN businesses.permanent_page_slug IS 'URL slug for permanent business page (e.g., awesome-coffee-shop)';
COMMENT ON COLUMN businesses.permanent_page_generated IS 'Whether permanent business page HTML has been generated';
COMMENT ON COLUMN businesses.onboarded_at IS 'Timestamp when onboarding was completed';