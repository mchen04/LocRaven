/**
 * Basic expiration utility functions
 * Note: Edge function calls removed to fix authentication issues
 */

export interface ExpirationStatus {
  upcomingExpiredPages: Array<{
    id: string;
    file_path: string;
    title: string;
    expires_at: string;
    business_id: string;
  }>;
  count: number;
}

export interface ExpirationResult {
  success: boolean;
  message: string;
  expiredCount?: number;
  expiredPages?: Array<{
    id: string;
    filePath: string;
    title: string;
  }>;
}

/**
 * Expire a specific page immediately - DISABLED
 * Note: Service disabled due to authentication complexity, returns error message
 */
export async function expirePage(pageId: string): Promise<ExpirationResult> {
  return {
    success: false,
    message: 'Expiration service temporarily disabled'
  };
}

/**
 * Reactivate an expired page with a new expiration date - DISABLED
 * Note: Service disabled due to authentication complexity, returns error message
 */
export async function reactivatePage(pageId: string, newExpiryDate: Date): Promise<ExpirationResult> {
  return {
    success: false,
    message: 'Reactivation service temporarily disabled'
  };
}

/**
 * Extend the expiration time of a page - DISABLED
 * Note: Service disabled due to authentication complexity, returns error message
 */
export async function extendPageExpiration(pageId: string, hours: number = 24): Promise<ExpirationResult> {
  return {
    success: false,
    message: 'Extension service temporarily disabled'
  };
}

/**
 * Check for pages expiring within the next hour - DISABLED
 * Note: Service disabled due to authentication complexity, returns empty result
 */
export async function checkUpcomingExpirations(): Promise<ExpirationStatus> {
  return {
    upcomingExpiredPages: [],
    count: 0
  };
}

/**
 * Format expiration time for display
 */
export function formatExpirationTime(expiresAt: string): string {
  const expires = new Date(expiresAt);
  const now = new Date();
  const diff = expires.getTime() - now.getTime();
  
  if (diff < 0) {
    return 'Expired';
  }
  
  const hours = Math.round(diff / (1000 * 60 * 60));
  const days = Math.round(diff / (1000 * 60 * 60 * 24));
  
  if (hours < 1) {
    const minutes = Math.round(diff / (1000 * 60));
    return `Expires in ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  if (hours < 24) {
    return `Expires in ${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  
  if (days < 7) {
    return `Expires in ${days} day${days !== 1 ? 's' : ''}`;
  }
  
  return expires.toLocaleDateString();
}

/**
 * Check if a page is actually expired based on expiration time (client-side check)
 */
export function isPageExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return false; // No expiration date means permanent
  
  const expires = new Date(expiresAt);
  const now = new Date();
  
  return now >= expires;
}

/**
 * Check if a page is expiring soon (within 2 hours)
 */
export function isExpiringSoon(expiresAt: string): boolean {
  const expires = new Date(expiresAt);
  const now = new Date();
  const diff = expires.getTime() - now.getTime();
  const twoHours = 2 * 60 * 60 * 1000;
  
  return diff > 0 && diff < twoHours;
}