// Environment-aware configuration following 12-factor app principles
// Uses explicit environment detection (Next.js standalone hardcodes NODE_ENV)

// Simplified environment detection - runtime domain-based
const isDevelopment = typeof window !== 'undefined' ? 
  window.location.hostname === 'localhost' : 
  process.env.NODE_ENV === 'development';
  
const isProduction = !isDevelopment;

// Environment-specific configuration for Next.js
const environmentConfig = {
  development: {
    // Next.js development server
    landingUrl: process.env.NEXT_PUBLIC_LANDING_URL || 'http://localhost:3000',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', 
    supabaseUrl: 'https://hmztritmqsscxnjhrvqi.supabase.co',
    enableDebug: process.env.NEXT_PUBLIC_ENABLE_DEBUG !== 'false',
    enableDevTools: process.env.NEXT_PUBLIC_ENABLE_DEV_TOOLS !== 'false',
    showPerformanceMetrics: process.env.NEXT_PUBLIC_SHOW_PERFORMANCE_METRICS === 'true',
    requestTimeout: parseInt(process.env.NEXT_PUBLIC_REQUEST_TIMEOUT || '30000'),
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  },
  production: {
    // Production static site - NEVER use localhost fallbacks in production
    landingUrl: process.env.NEXT_PUBLIC_LANDING_URL || 'https://locraven.com',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://locraven.com',
    supabaseUrl: 'https://hmztritmqsscxnjhrvqi.supabase.co',
    enableDebug: false,
    enableDevTools: false,
    showPerformanceMetrics: false,
    requestTimeout: parseInt(process.env.NEXT_PUBLIC_REQUEST_TIMEOUT || '15000'),
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== 'false',
  }
};

// Get current environment config based on runtime detection
const currentEnvConfig = isDevelopment ? environmentConfig.development : environmentConfig.production;

// DEBUG: Log simplified environment detection
console.log('🔍 Runtime Environment Detection:', {
  isDevelopment,
  isProduction,
  windowHostname: typeof window !== 'undefined' ? window.location.hostname : 'server-side',
  selectedConfig: isDevelopment ? 'development' : 'production'
});

export const config = {
  // Environment information
  env: {
    isDevelopment,
    isProduction,
    ...currentEnvConfig
  },
  
  // Application metadata
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'LocRaven',
    tagline: process.env.NEXT_PUBLIC_APP_TAGLINE || 'AI-Discoverable Business Updates in 60 Seconds',
    supportEmail: 'support@locraven.com',
    version: '0.1.0'
  },
  
  features: {
    previewMode: true,
    maxPagesPerUpdate: 5,
    pageExpirationDays: 7,
    allowGoogleAuth: true,
    allowEmailAuth: true
  },
  
  // Frontend routes (client-side routing with React Router)
  pages: {
    home: '/',              // Landing page: locraven.com
    login: '/login',        // Login page: locraven.com/login  
    chat: '/chat',          // Chat dashboard: locraven.com/chat
    dashboard: '/dashboard' // Business dashboard: locraven.com/dashboard
  },
  
  // New AI-optimized primary categories
  primaryCategories: [
    { value: 'food-dining', label: 'Food & Dining' },
    { value: 'shopping', label: 'Shopping & Retail' },
    { value: 'beauty-grooming', label: 'Beauty & Grooming' },
    { value: 'health-medical', label: 'Health & Medical' },
    { value: 'repairs-services', label: 'Repairs & Services' },
    { value: 'professional-services', label: 'Professional Services' },
    { value: 'activities-entertainment', label: 'Activities & Entertainment' },
    { value: 'education-training', label: 'Education & Training' },
    { value: 'creative-digital', label: 'Creative & Digital' },
    { value: 'transportation-delivery', label: 'Transportation & Delivery' }
  ],
  
  // Static tags for permanent business features
  staticTags: [
    // Service delivery
    { value: 'online-only', label: 'Online Only' },
    { value: 'physical-location', label: 'Physical Location' },
    { value: 'hybrid', label: 'Hybrid Service' },
    { value: 'mobile-service', label: 'Mobile Service' },
    { value: 'delivery-available', label: 'Delivery Available' },
    { value: 'pickup-available', label: 'Pickup Available' },
    { value: 'ships-nationwide', label: 'Ships Nationwide' },
    
    // Availability
    { value: '24-hours', label: '24 Hours' },
    { value: 'emergency-service', label: 'Emergency Service' },
    { value: 'same-day', label: 'Same Day Service' },
    { value: 'by-appointment', label: 'By Appointment' },
    { value: 'walk-ins', label: 'Walk-ins Welcome' },
    { value: 'online-booking', label: 'Online Booking' },
    { value: 'instant-service', label: 'Instant Service' },
    
    // Business model
    { value: 'subscription', label: 'Subscription Based' },
    { value: 'one-time', label: 'One-time Service' },
    { value: 'hourly', label: 'Hourly Billing' },
    { value: 'project-based', label: 'Project Based' },
    { value: 'free-consultation', label: 'Free Consultation' },
    { value: 'free-trial', label: 'Free Trial' },
    { value: 'freemium', label: 'Freemium' },
    
    // Characteristics
    { value: 'locally-owned', label: 'Locally Owned' },
    { value: 'franchise', label: 'Franchise' },
    { value: 'certified', label: 'Certified' },
    { value: 'licensed', label: 'Licensed' },
    { value: 'women-owned', label: 'Women Owned' },
    { value: 'veteran-owned', label: 'Veteran Owned' },
    { value: 'minority-owned', label: 'Minority Owned' },
    
    // Accessibility
    { value: 'wheelchair-accessible', label: 'Wheelchair Accessible' },
    { value: 'remote-available', label: 'Remote Available' },
    { value: 'multilingual', label: 'Multilingual' },
    { value: 'beginner-friendly', label: 'Beginner Friendly' },
    { value: 'kid-friendly', label: 'Kid Friendly' },
    { value: 'pet-friendly', label: 'Pet Friendly' }
  ],

  // Payment methods for businesses
  paymentMethods: [
    { value: 'cash', label: 'Cash' },
    { value: 'credit-cards', label: 'Credit/Debit Cards' },
    { value: 'digital-payments', label: 'Digital Payments (Apple Pay, Google Pay)' },
    { value: 'checks', label: 'Checks' },
    { value: 'financing', label: 'Financing Available' },
    { value: 'crypto', label: 'Cryptocurrency' }
  ],

  // Enhanced accessibility features
  accessibilityFeatures: [
    { value: 'wheelchair-accessible', label: 'Wheelchair Accessible' },
    { value: 'braille-menus', label: 'Braille Menus Available' },
    { value: 'hearing-loop', label: 'Hearing Loop System' },
    { value: 'service-animals', label: 'Service Animals Welcome' },
    { value: 'large-print', label: 'Large Print Available' },
    { value: 'sign-language', label: 'Sign Language Support' }
  ],

  // Common languages for multilingual businesses
  languages: [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian',
    'Mandarin Chinese', 'Cantonese', 'Japanese', 'Korean', 'Arabic', 'Hindi',
    'Vietnamese', 'Thai', 'Dutch', 'Swedish', 'Polish', 'Greek', 'Hebrew'
  ],

  // Availability policy options
  availabilityPolicies: [
    { value: 'contact-for-availability', label: 'Contact for availability' },
    { value: 'same-day-available', label: 'Same day available' },
    { value: 'by-appointment-only', label: 'By appointment only' },
    { value: 'walk-ins-welcome', label: 'Walk-ins welcome' },
    { value: 'advance-booking-required', label: 'Advance booking required' },
    { value: 'custom', label: 'Other (specify below)' }
  ],

  // Parking types for structured parking info
  parkingTypes: [
    { value: 'free', label: 'Free Parking' },
    { value: 'paid', label: 'Paid Parking' },
    { value: 'street', label: 'Street Parking' },
    { value: 'valet', label: 'Valet Parking' }
  ],
  
  // Country codes for phone numbers
  countryCodes: [
    { value: '+1', label: '+1 (United States)' },
    { value: '+44', label: '+44 (United Kingdom)' },
    { value: '+33', label: '+33 (France)' },
    { value: '+49', label: '+49 (Germany)' },
    { value: '+81', label: '+81 (Japan)' },
    { value: '+86', label: '+86 (China)' },
    { value: '+91', label: '+91 (India)' },
    { value: '+61', label: '+61 (Australia)' },
    { value: '+1-CA', label: '+1 (Canada)' },
    { value: '+52', label: '+52 (Mexico)' }
  ],

  
  states: [
    { code: 'AL', name: 'Alabama' },
    { code: 'AK', name: 'Alaska' },
    { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' },
    { code: 'CA', name: 'California' },
    { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' },
    { code: 'DE', name: 'Delaware' },
    { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' },
    { code: 'HI', name: 'Hawaii' },
    { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' },
    { code: 'IN', name: 'Indiana' },
    { code: 'IA', name: 'Iowa' },
    { code: 'KS', name: 'Kansas' },
    { code: 'KY', name: 'Kentucky' },
    { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' },
    { code: 'MD', name: 'Maryland' },
    { code: 'MA', name: 'Massachusetts' },
    { code: 'MI', name: 'Michigan' },
    { code: 'MN', name: 'Minnesota' },
    { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' },
    { code: 'MT', name: 'Montana' },
    { code: 'NE', name: 'Nebraska' },
    { code: 'NV', name: 'Nevada' },
    { code: 'NH', name: 'New Hampshire' },
    { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' },
    { code: 'NY', name: 'New York' },
    { code: 'NC', name: 'North Carolina' },
    { code: 'ND', name: 'North Dakota' },
    { code: 'OH', name: 'Ohio' },
    { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' },
    { code: 'PA', name: 'Pennsylvania' },
    { code: 'RI', name: 'Rhode Island' },
    { code: 'SC', name: 'South Carolina' },
    { code: 'SD', name: 'South Dakota' },
    { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' },
    { code: 'UT', name: 'Utah' },
    { code: 'VT', name: 'Vermont' },
    { code: 'VA', name: 'Virginia' },
    { code: 'WA', name: 'Washington' },
    { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' },
    { code: 'WY', name: 'Wyoming' }
  ]
};

// Comprehensive environment validation
export const validateEnvironment = () => {
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    const errorMessage = `Missing required environment variables: ${missingVars.join(', ')}`;
    console.error(errorMessage);
    
    if (config.env.isProduction) {
      throw new Error(errorMessage);
    } else {
      console.warn('⚠️ Development mode: continuing with missing variables, but this may cause runtime errors.');
    }
  }

  // Validate URL formats
  const urlValidationErrors: string[] = [];
  
  try {
    new URL(config.env.appUrl);
  } catch {
    urlValidationErrors.push(`Invalid VITE_APP_URL format: ${config.env.appUrl}`);
  }
  
  try {
    new URL(config.env.supabaseUrl);
  } catch {
    urlValidationErrors.push(`Invalid VITE_SUPABASE_URL format: ${config.env.supabaseUrl}`);
  }

  if (urlValidationErrors.length > 0) {
    const errorMessage = `URL validation failed: ${urlValidationErrors.join(', ')}`;
    console.error(errorMessage);
    
    if (config.env.isProduction) {
      throw new Error(errorMessage);
    }
  }

  // Security check: ensure debug features are disabled in production
  if (config.env.isProduction && (config.env.enableDebug || config.env.enableDevTools)) {
    console.error('🚨 SECURITY WARNING: Debug features are enabled in production!');
    if (config.env.isProduction) {
      throw new Error('Debug features must be disabled in production for security.');
    }
  }

  // Log configuration in development (but not sensitive URLs in production)
  if (config.env.isDevelopment && config.env.enableDebug) {
    console.log('🔧 Environment Configuration:', {
      isDevelopment: config.env.isDevelopment,
      isProduction: config.env.isProduction,
      appUrl: config.env.appUrl,
      supabaseUrl: config.env.supabaseUrl,
      enableDebug: config.env.enableDebug,
      enableAnalytics: config.env.enableAnalytics
    });
  }
  
};

// URL construction cache for performance optimization
const urlCache = new Map<string, string>();

// Get Supabase URL for backend API calls  
export const getSupabaseUrl = () => {
  if (!config.env.supabaseUrl) {
    throw new Error('Supabase URL not configured. Check VITE_SUPABASE_URL.');
  }
  return config.env.supabaseUrl;
};

// Get landing page URL (static HTML)
export const getLandingUrl = (path: string = '') => {
  const cacheKey = `landing:${path}`;
  
  if (urlCache.has(cacheKey)) {
    return urlCache.get(cacheKey)!;
  }
  
  if (!config.env.landingUrl) {
    throw new Error('Landing URL not configured. Check VITE_LANDING_URL.');
  }
  
  try {
    const baseUrl = config.env.landingUrl.replace(/\/$/, '');
    const cleanPath = path.replace(/^\//, '');
    const fullUrl = cleanPath ? `${baseUrl}/${cleanPath}` : baseUrl;
    
    new URL(fullUrl);
    urlCache.set(cacheKey, fullUrl);
    return fullUrl;
  } catch (error) {
    console.error('Invalid landing URL construction:', { baseUrl: config.env.landingUrl, path });
    throw new Error(`Failed to construct landing URL: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const getAppUrl = (path: string = '') => {
  // Runtime domain detection (industry standard 2024)
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    const cleanPath = path.replace(/^\//, '');
    const fullUrl = cleanPath ? `${origin}/${cleanPath}` : origin;
    
    console.log('🔍 Runtime Domain Detection:', {
      origin,
      path,
      fullUrl,
      hostname: window.location.hostname,
      isProduction: window.location.hostname === 'locraven.com'
    });
    
    return fullUrl;
  }
  
  // Server-side fallback (SSR)
  const fallbackUrl = config.env.appUrl || 'https://locraven.com';
  const cleanPath = path.replace(/^\//, '');
  const fullUrl = cleanPath ? `${fallbackUrl}/${cleanPath}` : fallbackUrl;
  
  console.log('🔍 Server-side URL Fallback:', {
    fallbackUrl,
    path,
    fullUrl,
    environment: process.env.NODE_ENV || 'unknown'
  });
  
  return fullUrl;
};

// Utility function to clear URL cache (useful for testing)
export const clearUrlCache = () => {
  urlCache.clear();
};

// Utility function to debug URL cache contents (development only)
export const debugUrlCache = () => {
  if (config.env.isDevelopment) {
    console.log('debugUrlCache: Current cache contents:', Array.from(urlCache.entries()));
  }
};

// Disabled automatic validation since using hardcoded Supabase configuration
// Environment validation can be called manually if needed
// if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
//   validateEnvironment();
// }