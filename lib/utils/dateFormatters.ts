/**
 * Unified date formatting utilities
 * Consolidates date formatting logic from across the application
 */

export interface DateFormatOptions {
  includeTime?: boolean;
  includeYear?: boolean;
  format?: 'short' | 'long' | 'relative';
}

/**
 * Format creation date - used in ActiveLinksView and ExpiredLinksView
 */
export const formatCreatedDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Format expired date with fallback logic - used in ExpiredLinksView
 */
export const formatExpiredDate = (
  expiredAt: string | null | undefined, 
  expiresAt?: string
): string => {
  // Fallback logic for missing expired_at fields
  let dateToFormat: string;
  
  if (expiredAt) {
    dateToFormat = expiredAt;
  } else if (expiresAt) {
    // Use expires_at as fallback if expired_at is missing
    dateToFormat = expiresAt;
  } else {
    // Last resort: use current time
    dateToFormat = new Date().toISOString();
  }
  
  return new Date(dateToFormat).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

/**
 * Format date and time for forms - used in EnhancedUpdateForm
 */
export const formatDateTime = (dateTimeString: string): string => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Get minimum datetime for input fields (30 minutes from now)
 */
export const getMinDateTime = (): string => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 30); // At least 30 minutes from now
  return now.toISOString().slice(0, 16);
};

/**
 * Calculate expiry date based on hours from now
 */
export const getExpiryDate = (hours: number): Date => {
  const now = new Date();
  return new Date(now.getTime() + hours * 60 * 60 * 1000);
};

/**
 * Get expiry date based on common time periods
 */
export const getExpiryDateByPeriod = (period: '24h' | '7d' | '30d' | 'custom', customDate?: string): Date => {
  const now = new Date();
  switch (period) {
    case '24h':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    case '7d':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    case '30d':
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    case 'custom':
      return customDate ? new Date(customDate) : new Date(now.getTime() + 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
  }
};

/**
 * Generic date formatter with flexible options
 */
export const formatDate = (
  date: string | Date, 
  options: DateFormatOptions = {}
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const { includeTime = false, includeYear = true, format = 'short' } = options;

  if (format === 'relative') {
    return formatRelativeDate(dateObj);
  }

  const formatOptions: Intl.DateTimeFormatOptions = {
    month: format === 'long' ? 'long' : 'short',
    day: 'numeric',
  };

  if (includeYear) {
    formatOptions.year = 'numeric';
  }

  if (includeTime) {
    formatOptions.hour = 'numeric';
    formatOptions.minute = '2-digit';
    formatOptions.hour12 = true;
  }

  return dateObj.toLocaleDateString('en-US', formatOptions);
};

/**
 * Format relative dates (e.g., "2 hours ago", "in 3 days")
 */
export const formatRelativeDate = (date: Date): string => {
  const now = new Date();
  const diffInMs = date.getTime() - now.getTime();
  const diffInSeconds = Math.abs(Math.floor(diffInMs / 1000));
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  const isInFuture = diffInMs > 0;
  const prefix = isInFuture ? 'in ' : '';
  const suffix = isInFuture ? '' : ' ago';

  if (diffInDays > 0) {
    return `${prefix}${diffInDays} day${diffInDays === 1 ? '' : 's'}${suffix}`;
  } else if (diffInHours > 0) {
    return `${prefix}${diffInHours} hour${diffInHours === 1 ? '' : 's'}${suffix}`;
  } else if (diffInMinutes > 0) {
    return `${prefix}${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'}${suffix}`;
  } else {
    return 'just now';
  }
};

/**
 * Validate if a date is in the future
 */
export const isInFuture = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.getTime() > new Date().getTime();
};

/**
 * Validate if a date is in the past
 */
export const isInPast = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.getTime() < new Date().getTime();
};