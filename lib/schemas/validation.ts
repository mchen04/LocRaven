import { z } from 'zod'

/**
 * Input validation schemas for API routes
 * Using Zod for runtime type checking and validation
 */

// Business ID validation schema
export const businessIdSchema = z.object({
  businessId: z.string().uuid('Invalid business ID format')
})

// Business creation/update schema
export const businessSchema = z.object({
  name: z.string().min(1, 'Business name is required').max(100, 'Business name too long'),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().regex(/^[0-9]{10,15}$/, 'Invalid phone number format').optional(),
  address_street: z.string().max(200, 'Address too long').optional(),
  address_city: z.string().min(1, 'City is required').max(100, 'City name too long'),
  address_state: z.string().length(2, 'State must be 2 characters'),
  zip_code: z.string().regex(/^[0-9]{5,10}$/, 'Invalid zip code format').optional(),
  website: z.string().url('Invalid website URL').optional(),
  primary_category: z.enum([
    'food-dining', 'shopping', 'beauty-grooming', 'health-medical',
    'repairs-services', 'professional-services', 'activities-entertainment',
    'education-training', 'creative-digital', 'transportation-delivery'
  ], { message: 'Invalid business category' }),
  description: z.string().max(1000, 'Description too long').optional(),
  hours: z.string().max(200, 'Hours description too long').optional(),
  price_positioning: z.enum(['budget', 'mid-range', 'premium', 'luxury']).optional()
})

// Update content validation schema
export const updateSchema = z.object({
  content_text: z.string().min(10, 'Update text must be at least 10 characters').max(2000, 'Update text too long'),
  special_hours_today: z.object({
    specialHoursToday: z.string().optional(),
    normalHoursResume: z.string().optional()
  }).optional(),
  deal_terms: z.string().max(500, 'Deal terms too long').optional(),
  expiration_date_time: z.string().datetime('Invalid expiration date format').optional(),
  update_category: z.enum(['general', 'special', 'hours', 'event', 'new_service', 'closure']).optional()
})

// Geographic route validation
export const geographicRouteSchema = z.object({
  country: z.string().length(2, 'Country code must be 2 characters').toLowerCase(),
  state: z.string().min(2, 'State is required').max(50, 'State name too long'),
  city: z.string().min(1, 'City is required').max(100, 'City name too long'),
  business: z.string().min(1, 'Business identifier required').max(100, 'Business identifier too long'),
  slug: z.array(z.string().max(100, 'Slug segment too long')).optional()
})

// Cache revalidation schema
export const revalidationSchema = z.object({
  businessId: z.string().uuid('Invalid business ID format').optional(),
  slug: z.string().max(100, 'Slug too long').optional(),
  type: z.enum(['business-update', 'business-profile', 'category-page']).optional(),
  filePath: z.string().max(500, 'File path too long').optional()
}).refine(
  (data) => data.businessId || data.filePath,
  { message: 'Either businessId or filePath must be provided' }
)

// Rate limiting configuration
export const rateLimitConfigs = {
  // General API routes - moderate limiting
  api: {
    threshold: 60,        // 60 requests per minute
    period: 60,
    blocking_period: 60
  },
  
  // Geographic pages - higher limit for public access
  geographic: {
    threshold: 300,       // 300 requests per minute (5 per second)
    period: 60,
    blocking_period: 30
  },
  
  // Admin operations - strict limiting  
  admin: {
    threshold: 20,        // 20 requests per minute
    period: 60,
    blocking_period: 120
  },
  
  // Heavy operations (geocoding, AI generation)
  heavy: {
    threshold: 10,        // 10 requests per minute
    period: 60,
    blocking_period: 300  // 5 minute block
  }
}

/**
 * Helper function to create validation response
 */
export function createValidationErrorResponse(errors: z.ZodError) {
  return Response.json({
    error: 'Validation failed',
    message: 'Invalid input parameters',
    details: errors
  }, { status: 400 })
}