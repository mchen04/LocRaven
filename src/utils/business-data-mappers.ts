/**
 * Data mappers for converting between server and client business data formats
 * Ensures type safety and consistent data transformation across the application
 */

import type { UsageStats } from '@/features/account/controllers/get-usage-stats';
import type { BusinessProfile as FeatureBusinessProfile } from '@/features/business/types/business-types';
import type { BusinessProfile, BusinessUsage } from '@/types/business-updates';

/**
 * Maps UsageStats (server format with camelCase) to BusinessUsage (client format with snake_case)
 * Used to convert server-side usage data for client components
 */
export function mapUsageStatsToBusinessUsage(
  usageStats: UsageStats,
  businessId: string
): BusinessUsage {
  return {
    business_id: businessId,
    updates_used: usageStats.updatesUsed,
    updates_limit: usageStats.updatesLimit || 0, // Convert null to 0 for unlimited
    usage_period_start: usageStats.periodStart,
    usage_period_end: usageStats.periodEnd,
  };
}

/**
 * Maps BusinessProfile from features to BusinessProfile for business-updates
 * Ensures compatibility between different business profile interfaces
 * Converts null values to undefined for proper type compatibility
 */
export function mapBusinessProfileForUpdates(
  featureProfile: FeatureBusinessProfile
): BusinessProfile {
  return {
    id: featureProfile.id,
    name: featureProfile.name || undefined,
    email: featureProfile.email || undefined,
    slug: featureProfile.url_slug || undefined,
    address_street: featureProfile.address_street || undefined,
    address_city: featureProfile.address_city || undefined,
    address_state: featureProfile.address_state || undefined,
    zip_code: featureProfile.zip_code || undefined,
    phone: featureProfile.phone || undefined,
    website: featureProfile.website || undefined,
  };
}

/**
 * Type guard to check if usage stats are available and valid
 */
export function isValidUsageStats(usageStats: UsageStats | null): usageStats is UsageStats {
  return usageStats !== null && typeof usageStats.updatesUsed === 'number';
}

/**
 * Type guard to check if business profile is available and valid
 */
export function isValidBusinessProfile(
  profile: FeatureBusinessProfile | null
): profile is FeatureBusinessProfile {
  return profile !== null && typeof profile.id === 'string';
}