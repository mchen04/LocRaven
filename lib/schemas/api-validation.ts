import { z } from 'zod';

// Auth validation schemas
export const signInSchema = z.object({
  provider: z.enum(['google']),
  redirectTo: z.string().url().optional(),
});

export const sessionSchema = z.object({
  sessionId: z.string().optional(),
});

// Business validation schemas
export const businessUpdateSchema = z.object({
  name: z.string().min(1, 'Business name is required').max(100),
  description: z.string().max(500).optional(),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number').optional(),
  email: z.string().email('Invalid email address').optional(),
  website: z.string().url('Invalid website URL').optional(),
  address: z.object({
    street: z.string().max(200).optional(),
    city: z.string().max(100).optional(),
    state: z.string().max(50).optional(),
    zip: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code').optional(),
    country: z.string().max(50).optional(),
  }).optional(),
  hours: z.object({
    monday: z.string().optional(),
    tuesday: z.string().optional(),
    wednesday: z.string().optional(),
    thursday: z.string().optional(),
    friday: z.string().optional(),
    saturday: z.string().optional(),
    sunday: z.string().optional(),
  }).optional(),
  categories: z.array(z.string()).max(5, 'Maximum 5 categories allowed').optional(),
});

export const businessDeleteSchema = z.object({
  businessId: z.string().uuid('Invalid business ID'),
  confirmText: z.literal('DELETE'),
});

// Content validation schemas
export const contentUpdateSchema = z.object({
  content: z.string().min(10, 'Content must be at least 10 characters').max(2000, 'Content too long'),
  businessId: z.string().uuid('Invalid business ID'),
  expiresAt: z.string().optional(),
  isPublic: z.boolean().default(true),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed').optional(),
});

// Stripe validation schemas
export const checkoutSessionSchema = z.object({
  priceId: z.string().min(1, 'Price ID is required'),
  customerId: z.string().optional(),
  successUrl: z.string().url('Invalid success URL'),
  cancelUrl: z.string().url('Invalid cancel URL'),
});

export const webhookEventSchema = z.object({
  type: z.string(),
  data: z.object({
    object: z.record(z.string(), z.any()),
  }),
  id: z.string(),
  created: z.number(),
});

// Revalidation schemas
export const revalidateSchema = z.object({
  path: z.string().min(1, 'Path is required'),
  secret: z.string().min(1, 'Secret is required'),
});

// Chat/AI schemas
export const chatMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(1000, 'Message too long'),
  sessionId: z.string().optional(),
  context: z.record(z.string(), z.any()).optional(),
});

// Generic response schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  errors: z.array(z.string()).optional(),
});

// Pagination schemas
export const paginationSchema = z.object({
  page: z.coerce.number().min(1, 'Page must be at least 1').default(1),
  limit: z.coerce.number().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100').default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Search schemas
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(200),
  filters: z.object({
    category: z.string().optional(),
    location: z.string().optional(),
    dateRange: z.object({
      start: z.string().optional(),
      end: z.string().optional(),
    }).optional(),
  }).optional(),
});

// Utility function for API validation
export function validateApiInput<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: string[];
} {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return {
      success: false,
      errors: ['Invalid input format']
    };
  }
}

// Types derived from schemas
export type SignInRequest = z.infer<typeof signInSchema>;
export type BusinessUpdate = z.infer<typeof businessUpdateSchema>;
export type BusinessDelete = z.infer<typeof businessDeleteSchema>;
export type ContentUpdate = z.infer<typeof contentUpdateSchema>;
export type CheckoutSession = z.infer<typeof checkoutSessionSchema>;
export type RevalidateRequest = z.infer<typeof revalidateSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ApiResponse<T = any> = z.infer<typeof apiResponseSchema> & { data?: T };
export type PaginationParams = z.infer<typeof paginationSchema>;
export type SearchRequest = z.infer<typeof searchSchema>;