import { z } from 'zod';

import { Constants } from '@/libs/supabase/types';

// Form validation schema
export const businessProfileSchema = z.object({
  name: z.string().min(1, 'Business name is required').max(255, 'Business name is too long'),
  description: z.string().optional(),
  website: z.string().url('Invalid URL format').optional().or(z.literal('')),
  phone: z.string().regex(/^[0-9]{10,15}$/, 'Phone must be 10-15 digits').optional().or(z.literal('')),
  phone_country_code: z.string().optional(),
  address_street: z.string().optional(),
  address_city: z.string().optional(),
  address_state: z.string().optional(),
  zip_code: z.string().optional(),
  country: z.string().optional(),
  primary_category: z.enum(Constants.public.Enums.primary_category as any).optional(),
  established_year: z.number().int().min(1800).max(new Date().getFullYear()).optional().or(z.literal(0)),
  hours: z.string().optional(),
  parking_info: z.string().optional(),
  price_positioning: z.enum(['budget', 'moderate', 'premium', 'luxury'] as const).optional(),
  static_tags: z.array(z.enum(Constants.public.Enums.static_tag as any)).max(5, 'Maximum 5 tags allowed').optional(),
  specialties: z.array(z.string()).optional(),
  services: z.array(z.string()).optional(),
  payment_methods: z.array(z.string()).optional(),
  languages_spoken: z.array(z.string()).optional(),
  accessibility_features: z.array(z.string()).optional(),
  service_area: z.string().optional(),
  social_media: z.object({
    facebook: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
    linkedin: z.string().url().optional().or(z.literal('')),
    youtube: z.string().url().optional().or(z.literal('')),
  }).optional(),
  business_faqs: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).optional(),
});

export type BusinessProfileFormData = z.infer<typeof businessProfileSchema>;

// Category options for the form dropdown
export const categoryOptions = [
  { value: 'food-dining', label: 'Food & Dining' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'beauty-grooming', label: 'Beauty & Grooming' },
  { value: 'health-medical', label: 'Health & Medical' },
  { value: 'repairs-services', label: 'Repairs & Services' },
  { value: 'professional-services', label: 'Professional Services' },
  { value: 'activities-entertainment', label: 'Activities & Entertainment' },
  { value: 'education-training', label: 'Education & Training' },
  { value: 'creative-digital', label: 'Creative & Digital' },
  { value: 'transportation-delivery', label: 'Transportation & Delivery' },
] as const;

// Price positioning options
export const pricePositioningOptions = [
  { value: 'budget', label: 'Budget-Friendly' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'premium', label: 'Premium' },
  { value: 'luxury', label: 'Luxury' },
] as const;

// Common payment methods
export const paymentMethodOptions = [
  'Cash', 'Credit Card', 'Debit Card', 'Digital Payments', 'PayPal', 
  'Apple Pay', 'Google Pay', 'Venmo', 'Checks', 'Financing', 'Crypto'
];

// Common languages
export const languageOptions = [
  'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 
  'Korean', 'Portuguese', 'Italian', 'Russian', 'Arabic', 'Hindi'
];

// Common accessibility features
export const accessibilityOptions = [
  'wheelchair-accessible', 'braille-menus', 'hearing-loop', 'service-animals', 
  'large-print', 'sign-language', 'elevator-access', 'ramp-access'
];

// Country options (common ones)
export const countryOptions = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'MX', label: 'Mexico' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
] as const;

// Phone country codes
export const phoneCountryCodes = [
  { value: '+1', label: '+1 (US/CA)' },
  { value: '+44', label: '+44 (UK)' },
  { value: '+61', label: '+61 (AU)' },
  { value: '+49', label: '+49 (DE)' },
  { value: '+33', label: '+33 (FR)' },
] as const;