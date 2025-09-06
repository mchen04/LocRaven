-- Migration: Clean up legacy URL system columns and indexes
-- Created: 2025-09-06
-- Description: Removes all legacy URL-related columns, indexes, and backup tables

-- Drop constraints first (safer order)
ALTER TABLE businesses DROP CONSTRAINT IF EXISTS businesses_permanent_page_slug_key;
ALTER TABLE businesses DROP CONSTRAINT IF EXISTS businesses_optimized_slug_key;

-- Drop indexes related to legacy columns
DROP INDEX IF EXISTS idx_businesses_permanent_slug;
DROP INDEX IF EXISTS idx_businesses_migration_status;

-- Drop legacy columns from businesses table
ALTER TABLE businesses 
  DROP COLUMN IF EXISTS permanent_page_slug,
  DROP COLUMN IF EXISTS permanent_page_path,
  DROP COLUMN IF EXISTS permanent_page_generated,
  DROP COLUMN IF EXISTS slug,
  DROP COLUMN IF EXISTS slug_version,
  DROP COLUMN IF EXISTS slug_migration_status;

-- Drop backup tables created during migration
DROP TABLE IF EXISTS businesses_backup;
DROP TABLE IF EXISTS updates_backup; 
DROP TABLE IF EXISTS generated_pages_backup;
DROP TABLE IF EXISTS legacy_generated_pages_backup;

-- Add comment for migration tracking
COMMENT ON TABLE businesses IS 'Business profiles with streamlined city-state/url-slug URL structure. Legacy URL columns removed 2025-09-06.';