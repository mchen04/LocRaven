// TypeScript types for business updates and AI page generation

export interface BusinessUpdate {
  id: string;
  business_id: string;
  content_text: string;
  status: 'draft' | 'processing' | 'ready-for-preview' | 'published' | 'failed';
  created_at: string;
  expires_at?: string;
  special_hours_today?: string;
  deal_terms?: string;
  expiration_date_time?: string;
  update_category?: string;
  processing_time_ms?: number;
  error_message?: string;
}

export interface GeneratedPage {
  id: string;
  update_id: string;
  business_id: string;
  file_path: string;
  title: string;
  template_id: string;
  page_data: any; // Compressed page data
  rendered_size_kb: number;
  content_intent: string;
  slug: string;
  page_type: string;
  intent_type: 'direct' | 'local' | 'category' | 'branded-local' | 'service-urgent' | 'competitive';
  page_variant: string;
  generation_batch_id: string;
  expires_at: string;
  published: boolean;
  published_at?: string;
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
  name: string;
  description?: string;
  address_street?: string;
  address_city?: string;
  address_state?: string;
  zip_code?: string;
  phone?: string;
  email?: string;
  website?: string;
  primary_category?: string;
  ai_provider?: string;
  hours?: string;
  services?: string[];
  specialties?: string[];
  payment_methods?: string[];
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
  updateCategory?: string;
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