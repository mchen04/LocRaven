-- Migration: Remove analytics and metrics tables for MVP
-- Created: 2025-09-06
-- Description: Drops all analytics/metrics tables to simplify to MVP essentials

-- Drop SEO analytics tables
DROP TABLE IF EXISTS seo_analysis_history CASCADE;
DROP TABLE IF EXISTS seo_competitor_analysis CASCADE;
DROP TABLE IF EXISTS seo_performance_metrics CASCADE;
DROP TABLE IF EXISTS seo_recommendations CASCADE;

-- Drop page regeneration analytics tables
DROP TABLE IF EXISTS regeneration_metrics CASCADE;
DROP TABLE IF EXISTS regeneration_queue CASCADE;

-- Drop cache invalidation queue (can rebuild later if needed)
DROP TABLE IF EXISTS cache_invalidation_queue CASCADE;

-- Add comment for tracking
COMMENT ON DATABASE postgres IS 'LocRaven MVP database - streamlined to core business functionality only. Analytics tables removed 2025-09-06.';