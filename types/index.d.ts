/**
 * TypeScript type definitions for LocRaven
 */

// Enhanced Business Profile Types for AI Optimization
export interface Award {
  name: string;
  issuer: string;
  year: number;
  description?: string;
  category?: string;
  level?: 'local' | 'regional' | 'national' | 'international';
}

export interface Certification {
  name: string;
  issuer: string;
  validFrom: string;
  validUntil?: string;
  certificationId?: string;
  verificationUrl?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
  searchTerms?: string[];
  priority?: number;
}

export interface CustomerTestimonial {
  customerName: string;
  customerLocation?: string;
  testimonialText: string;
  rating?: number;
  date?: string;
  serviceCategory?: string;
  verified?: boolean;
}

// Enhanced Form Data Types for 100% Template Coverage
export interface ParkingInfo {
  types: string[];
  notes?: string;
}

export interface ServiceAreaDetails {
  primary_city: string;
  coverage_radius?: number;
  additional_cities?: string[];
  delivery_zones?: string[];
}

export interface AvailabilityPolicy {
  type: string;
  custom_text?: string;
}

// Optimized Business Types - 17 Core Fields for AI Discoverability
export interface Business {
  // Core Identity (4 fields)
  id: string;
  name: string;
  email?: string;
  slug?: string;
  
  // Location Data (5 fields)
  address_street?: string;
  address_city?: string;
  address_state?: string;
  zip_code?: string;
  country?: string;
  
  // Contact Information (3 fields)
  phone?: string;
  phone_country_code?: string;
  website?: string;
  
  // Business Information (2 fields)
  primary_category?: PrimaryCategory | string;
  description?: string;
  
  // Business Features (1 field)
  static_tags?: StaticTag[] | string[];
  
  // Enhanced AI Fields (2 new fields)
  specialties?: string[] | any[];
  services?: string[] | any[];
  
  // Basic Operations (2 fields)
  hours?: string;
  price_positioning?: 'budget' | 'mid-range' | 'premium' | 'luxury';
  
  // Authority Signals (2 fields)
  awards?: Award[];
  certifications?: Certification[];
  
  // Social Media (1 field)
  social_media?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };

  // Enhanced Form Fields for 100% Template Coverage
  payment_methods?: string[];
  accessibility_features?: string[];
  languages_spoken?: string[];
  enhanced_parking_info?: ParkingInfo;
  service_area_details?: ServiceAreaDetails;
  availability_policy?: AvailabilityPolicy;
  
  // AI-Optimized Fields (new)
  service_area?: string;
  featured_items?: string[];
  parking_info?: string;
  
  // System Fields (3 fields)
  established_year?: number;
  created_at?: string;
  updated_at?: string;
}

// New AI-optimized primary categories
export type PrimaryCategory = 
  | 'food-dining'
  | 'shopping'
  | 'beauty-grooming'
  | 'health-medical'
  | 'repairs-services'
  | 'professional-services'
  | 'activities-entertainment'
  | 'education-training'
  | 'creative-digital'
  | 'transportation-delivery';

// Static tags for permanent business features
export type StaticTag = 
  // Service delivery
  | 'online-only' | 'physical-location' | 'hybrid' | 'mobile-service'
  | 'delivery-available' | 'pickup-available' | 'ships-nationwide'
  // Availability
  | '24-hours' | 'emergency-service' | 'same-day' | 'by-appointment'
  | 'walk-ins' | 'online-booking' | 'instant-service'
  // Business model
  | 'subscription' | 'one-time' | 'hourly' | 'project-based'
  | 'free-consultation' | 'free-trial' | 'freemium'
  // Characteristics
  | 'locally-owned' | 'franchise' | 'certified' | 'licensed'
  | 'women-owned' | 'veteran-owned' | 'minority-owned'
  // Accessibility
  | 'wheelchair-accessible' | 'remote-available' | 'multilingual'
  | 'beginner-friendly' | 'kid-friendly' | 'pet-friendly';


// Update Types
export interface Update {
  id: string;
  business_id: string;
  content_text: string;
  status: UpdateStatus;
  ai_provider?: string;
  error_message?: string;
  processing_time_ms?: number;
  created_at?: string;
}

export type UpdateStatus = 'pending' | 'processing' | 'completed' | 'failed';

// Generated Page Types
export interface GeneratedPage {
  id: string;
  update_id: string;
  business_id: string;
  file_path: string;
  title: string;
  html_content: string;
  content_intent?: PageIntent | string;
  slug?: string;
  page_type?: PageType;
  
  // New dynamic tag fields
  dynamic_tags?: string[];
  tags_expire_at?: string;
  
  created_at?: string;
  updated_at?: string;
  expires_at?: string;
  url?: string;
  expired?: boolean;
  expired_at?: string;
  
  // Additional fields for UI usage
  business_name?: string;
  active?: boolean;
}

export type PageIntent = 'location' | 'service' | 'timing';
export type PageType = 'business' | 'update' | 'category' | 'location';

// User Types
export interface User {
  id: string;
  email: string;
  created_at?: string;
  [key: string]: any;
}


