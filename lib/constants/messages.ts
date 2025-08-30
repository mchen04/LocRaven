/**
 * Centralized message constants for the application
 * All user-facing strings should be defined here for consistency and maintainability
 */

export const messages = {
  // Success Messages
  success: {
    businessProfileSaved: 'Business profile saved successfully!',
    pagesGenerated: 'Successfully generated AI-optimized pages!',
    pageDeleted: 'Page deleted successfully',
    updatePublished: 'Business update published successfully',
    profileCompleted: 'Profile setup completed!',
    subscriptionActivated: 'Subscription activated successfully',
    linkExpired: 'Link expired successfully',
    settingsSaved: 'Settings saved successfully',
    passwordUpdated: 'Password updated successfully',
    emailVerified: 'Email verified successfully',
    dataImported: 'Data imported successfully',
    cacheCleared: 'Cache cleared successfully',
  } as const,

  // Error Messages
  error: {
    // Generic Errors
    generic: 'Something went wrong. Please try again.',
    networkError: 'Network error. Please check your connection.',
    serverError: 'Server error. Please try again later.',
    unauthorized: 'You are not authorized to perform this action.',
    forbidden: 'Access denied.',
    notFound: 'Resource not found.',
    timeout: 'Request timed out. Please try again.',
    rateLimited: 'Too many requests. Please try again later.',
    
    // Authentication Errors
    authRequired: 'Please sign in to continue.',
    authFailed: 'Authentication failed. Please try again.',
    sessionExpired: 'Your session has expired. Please sign in again.',
    invalidCredentials: 'Invalid credentials provided.',
    accountLocked: 'Account temporarily locked. Try again later.',
    
    // Business Profile Errors
    profileSaveError: 'Error saving business profile. Please try again.',
    profileLoadError: 'Error loading business profile.',
    businessNotFound: 'Business profile not found.',
    duplicateBusiness: 'Business already exists with this name.',
    
    // Page Generation Errors
    pageGenerationError: 'Error generating pages. Please try again.',
    pageDeleteError: 'Error deleting page',
    pageNotFound: 'Page not found.',
    pageLimitReached: 'You have reached the maximum number of pages.',
    
    // Subscription Errors
    subscriptionRequired: 'Subscription required to access this feature.',
    subscriptionExpired: 'Your subscription has expired.',
    paymentFailed: 'Payment failed. Please update your payment method.',
    planNotFound: 'Subscription plan not found.',
    
    // File Upload Errors
    fileUploadError: 'Error uploading file. Please try again.',
    fileSizeError: 'File size too large. Maximum size is 10MB.',
    fileTypeError: 'Invalid file type. Please upload an image.',
    
    // Cache Errors
    cacheError: 'Cache invalidation failed (non-critical)',
  } as const,

  // Validation Messages
  validation: {
    // Required Fields
    required: 'This field is required',
    businessNameRequired: 'Business name is required',
    cityRequired: 'City is required',
    stateRequired: 'State is required',
    emailRequired: 'Email address is required',
    passwordRequired: 'Password is required',
    
    // Format Validation
    emailInvalid: 'Please enter a valid email address',
    phoneInvalid: 'Please enter a valid phone number (10-15 digits)',
    websiteInvalid: 'Website must start with http:// or https://',
    urlInvalid: 'Please enter a valid URL',
    
    // Length Validation
    minLength: (min: number) => `Must be at least ${min} characters`,
    maxLength: (max: number) => `Must be no more than ${max} characters`,
    exactLength: (length: number) => `Must be exactly ${length} characters`,
    
    // Range Validation
    minValue: (min: number) => `Must be at least ${min}`,
    maxValue: (max: number) => `Must be no more than ${max}`,
    establishedYearInvalid: 'Established year must be between 1000 and current year',
    
    // Business-specific Validation
    maxTagsReached: 'Maximum 5 business features allowed',
    duplicateTag: 'This feature is already selected',
    
    // File Validation
    fileRequired: 'Please select a file',
    imageSizeInvalid: 'Image must be smaller than 5MB',
    imageTypeInvalid: 'Please upload a valid image file (JPG, PNG, GIF)',
  } as const,

  // Loading Messages
  loading: {
    default: 'Loading...',
    saving: 'Saving...',
    generating: 'Generating...',
    publishing: 'Publishing...',
    processing: 'Processing...',
    uploading: 'Uploading...',
    deleting: 'Deleting...',
    updating: 'Updating...',
    fetching: 'Fetching...',
    authenticating: 'Signing in...',
    signOut: 'Signing out...',
  } as const,

  // Confirmation Messages
  confirmation: {
    deletePage: 'Are you sure you want to delete this page? This action cannot be undone.',
    deleteProfile: 'Are you sure you want to delete your business profile?',
    clearCache: 'Are you sure you want to clear the cache?',
    cancelSubscription: 'Are you sure you want to cancel your subscription?',
    signOut: 'Are you sure you want to sign out?',
    discardChanges: 'You have unsaved changes. Are you sure you want to discard them?',
  } as const,

  // Placeholder Text
  placeholders: {
    businessName: 'Enter business name',
    email: 'business@example.com',
    website: 'locraven.com',
    phone: '1234567890',
    address: '123 Main St',
    city: 'Enter city',
    zipCode: '12345',
    description: 'Describe your business, services, and what makes you unique...',
    hours: 'Mon-Fri 9am-5pm, Sat 10am-3pm',
    specialty: 'Enter a specialty (e.g., organic ingredients)',
    service: 'Enter a service (e.g., custom cakes)',
    featuredItem: 'Enter a featured item (e.g., signature pizza)',
    award: 'Enter an award (e.g., Best Local Business 2024)',
    certification: 'Enter a certification (e.g., Certified Organic)',
    additionalCities: 'Oakland, Berkeley, San Jose',
    parkingNotes: 'Additional parking details...',
    customAvailability: 'Describe your availability policy...',
    searchQuery: 'Search...',
    socialUsername: 'username',
    socialPage: 'page',
    socialCompany: 'company',
  } as const,

  // Empty State Messages
  emptyState: {
    noPages: 'No pages found',
    noResults: 'No results found',
    noBusinesses: 'No businesses found',
    noTransactions: 'No transactions found',
    noNotifications: 'No notifications',
    noMessages: 'No messages',
    noFiles: 'No files uploaded',
  } as const,

  // Status Messages
  status: {
    draft: 'Draft',
    published: 'Published',
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    completed: 'Completed',
    expired: 'Expired',
    cancelled: 'Cancelled',
    processing: 'Processing',
    ready: 'Ready',
    online: 'Online',
    offline: 'Offline',
  } as const,

  // Navigation Messages
  navigation: {
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    continue: 'Continue',
    finish: 'Finish',
    cancel: 'Cancel',
    close: 'Close',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    download: 'Download',
    upload: 'Upload',
    refresh: 'Refresh',
    retry: 'Retry',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    signUp: 'Sign Up',
  } as const,

  // Feature Messages
  features: {
    aiOptimized: 'AI-Optimized',
    realTimeUpdates: 'Real-time Updates',
    searchOptimized: 'Search Optimized',
    mobileFriendly: 'Mobile Friendly',
    fastLoading: 'Fast Loading',
    secureConnection: 'Secure Connection',
  } as const,
} as const;

// Type for message keys (useful for TypeScript autocomplete)
export type MessageKey = keyof typeof messages;
export type SuccessMessageKey = keyof typeof messages.success;
export type ErrorMessageKey = keyof typeof messages.error;
export type ValidationMessageKey = keyof typeof messages.validation;

// Helper function to get a message by key path
export const getMessage = (key: string): string => {
  const keys = key.split('.');
  let value: any = messages;
  
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      console.warn(`Message key "${key}" not found`);
      return key;
    }
  }
  
  return typeof value === 'string' ? value : key;
};

// Helper function to get validation message with dynamic content
export const getValidationMessage = (
  key: keyof typeof messages.validation,
  ...args: any[]
): string => {
  const message = messages.validation[key];
  
  if (typeof message === 'function') {
    return (message as Function)(...args);
  }
  
  return message as string;
};