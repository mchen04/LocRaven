// TypeScript types for business updates and AI page generation

export interface BusinessUpdate {
  id: string;
  business_id: string;
  content_text: string;
  status: 'draft' | 'processing' | 'ready-for-preview' | 'published' | 'failed';
  created_at: string;
  expires_at?: string;
  special_hours_today?: any; // jsonb
  deal_terms?: string;
  expiration_date_time?: string;
  update_category?: 'general' | 'special' | 'hours' | 'event' | 'new_service' | 'closure';
  update_faqs?: any[]; // jsonb array
  processing_time_ms?: number;
  error_message?: string;
  ai_provider?: string;
}

export interface GeneratedPage {
  id: string;
  update_id: string;
  business_id: string;
  file_path: string;
  title: string;
  template_id?: string;
  page_data?: any; // jsonb - compressed page data
  rendered_size_kb?: number;
  content_intent?: string;
  slug?: string;
  page_type?: 'business' | 'update' | 'category' | 'location';
  intent_type?: 'direct' | 'local' | 'category' | 'branded-local' | 'service-urgent' | 'competitive';
  page_variant?: string;
  generation_batch_id?: string;
  expires_at?: string;
  expired_at?: string;
  expired?: boolean;
  dynamic_tags?: string[];
  tags_expire_at?: string;
  published?: boolean;
  published_at?: string;
  html_content?: string;
  ai_citation_score?: number;
  last_status_calculation?: string;
  created_at: string;
  updated_at: string;
  // Client-side only
  previewUrl?: string;
  estimated_html_size_kb?: number;
}

export interface ProcessUpdateRequest {
  updateId: string;
  businessId: string;
  contentText: string;
  temporalInfo?: {
    dealTerms?: string;
    expiresAt?: string;
    updateCategory?: string;
  };
  specialHours?: string;
  faqData?: any;
}

export interface ProcessUpdateResponse {
  pages: GeneratedPage[];
  batch_id: string;
  total_pages: number;
  processingTime: number;
  previewMode: boolean;
  message: string;
}

export interface PublishPagesRequest {
  pageIds: string[];
  batchId?: string;
}

export interface PublishPagesResponse {
  publishedPages: {
    id: string;
    url: string;
    published_at: string;
  }[];
  message: string;
}

export interface BusinessProfile {
  id: string;
  name?: string;
  email?: string;
  slug?: string;
  address_street?: string;
  address_city?: string;
  address_state?: string;
  zip_code?: string;
  phone?: string;
  website?: string;
  primary_category?: 'food-dining' | 'shopping' | 'beauty-grooming' | 'health-medical' | 'repairs-services' | 'professional-services' | 'activities-entertainment' | 'education-training' | 'creative-digital' | 'transportation-delivery';
  description?: string;
  static_tags?: string[];
  hours?: string;
  price_positioning?: string;
  established_year?: number;
  country?: string;
  phone_country_code?: string;
  specialties?: any; // jsonb
  services?: any; // jsonb
  awards?: any; // jsonb
  certifications?: any; // jsonb
  social_media?: any; // jsonb
  latitude?: number;
  longitude?: number;
  parking_info?: string;
  accessibility_features?: string[];
  payment_methods?: string[];
  languages_spoken?: string[];
  structured_hours?: any; // jsonb
  service_area?: string;
  review_summary?: any; // jsonb
  status_override?: 'closed_emergency' | 'closed_holiday' | 'closed_maintenance' | 'temporarily_closed' | 'normal_operations';
  business_faqs?: any[]; // jsonb
  featured_items?: any[]; // jsonb
  enhanced_parking_info?: any; // jsonb
  service_area_details?: any; // jsonb
  availability_policy?: any; // jsonb
  created_at?: string;
  updated_at?: string;
}

export interface BusinessUsage {
  business_id: string;
  updates_used: number;
  updates_limit: number;
  usage_period_start: string;
  usage_period_end: string;
}

// Form state types
export interface UpdateFormData {
  contentText: string;
  startDate: string;
  expireDate: string;
  specialHours?: string;
  updateCategory?: 'general' | 'special' | 'hours' | 'event' | 'new_service' | 'closure';
  dealTerms?: string;
}

export interface UpdateFormErrors {
  contentText?: string;
  startDate?: string;
  expireDate?: string;
  specialHours?: string;
  updateCategory?: string;
  dealTerms?: string;
  general?: string;
}

// API response wrapper
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}