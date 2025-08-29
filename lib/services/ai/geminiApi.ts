import { supabase } from '../../utils';

export interface TemporalInfo {
  startTime?: string;      // "4:00 PM"
  endTime?: string;        // "6:00 PM"
  date?: string;           // "today", "tomorrow", "2024-01-15"
  duration?: number;       // hours until expiration
  expiresAt?: string;      // ISO timestamp
  timezone?: string;       // User's timezone (e.g., "America/Los_Angeles")
  dealTerms?: string;      // "20% off large pizzas, dine-in or takeout"
  howToRedeem?: string;    // "Mention this special when ordering"
  urgencyLevel?: 'high' | 'medium' | 'low';
  updateCategory?: 'special' | 'hours' | 'event' | 'new_service' | 'closure';
}

export interface SuggestedUrls {
  primary: string;         // Main URL suggestion
  alternatives: string[];  // Alternative URL patterns
  reasoning?: string;      // Why this URL was chosen
}

export interface PreviewData {
  title: string;
  description: string;
  highlights: string[];    // Key points for the page
  eventDescription?: string; // Enhanced description of the event/update
  estimatedViews?: number; // Estimated monthly views
  aiOptimizationScore?: number; // 0-100 score for AI discoverability
}

// Enhanced Business Profile Interfaces for AI Optimization
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

export interface BusinessAuthority {
  awards: Award[];
  certifications: Certification[];
}

export interface Specialty {
  name: string;
  description: string;
  yearsExperience?: number;
  certifications?: string[];
  keyFeatures?: string[];
}

export interface CompetitiveAdvantage {
  uniqueSellingPoints: string[];
  competitiveAdvantages: string[];
  specialties: Specialty[];
  pricePositioning: 'budget' | 'mid-range' | 'premium' | 'luxury';
  businessHighlights: string[];
}

export interface FAQData {
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


export interface AIOptimization {
  primaryKeywords: string[];
  semanticKeywords: string[];
  localSearchTerms: string[];
  targetQuestions: string[];
  optimizationScore?: number;
}

export interface WebsiteInfo {
  businessName: string;
  businessType: string;
  location: string;
  updateContent?: string;
  services?: string[];
  hours?: string;
  targetAudience?: string;
  uniqueSellingPoints?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  targetKeywords?: string[];
  theme?: {
    primaryColor?: string;
    style?: 'modern' | 'classic' | 'minimal' | 'bold';
  };
  // New scheduling and preview fields
  temporalInfo?: TemporalInfo;
  suggestedUrls?: SuggestedUrls;
  previewData?: PreviewData;
  
  // Enhanced AI optimization fields
  businessAuthority?: BusinessAuthority;
  competitiveAdvantage?: CompetitiveAdvantage;
  faqData?: FAQData[];
  customerTestimonials?: CustomerTestimonial[];
  aiOptimization?: AIOptimization;
  
  // Additional business context
  businessStory?: string;
  yearsInBusiness?: number;
  employeeCountRange?: '1' | '2-10' | '11-50' | '51-200' | '201-500' | '500+';
  languagesSpoken?: string[];
  serviceAreas?: string[];
  businessValues?: string[];
  customerSatisfactionScore?: number;
  responseTimeHours?: number;
  
  // Enhanced operational fields (from business profile)
  description?: string;
  parkingInfo?: string;
  serviceArea?: string;
  paymentMethods?: string[];
  accessibilityFeatures?: string[];
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
}


export interface ConversationContext {
  websiteInfo: Partial<WebsiteInfo>;
  conversationStage: 'greeting' | 'identify' | 'gather' | 'validate' | 'confirm' | 'preview' | 'complete';
  missingFields: string[];
  businessProfile?: any; // Current user's business profile for context
}

export interface ChatResponse {
  message: string;
  websiteInfo: Partial<WebsiteInfo>;
  readyToGenerate: boolean;
  needsConfirmation?: boolean; // New field for preview flow
  stage?: string;
  safetyBlock?: boolean;
  confidence?: number; // How confident the AI is in the extracted information (0-1)
  // Enhanced bidirectional fields
  completionPercentage?: number;
  smartSuggestions?: string[];
  editAcknowledged?: boolean;
  missingRequiredFields?: string[];
  aiOptimizationScore?: number;
}

// Clean AI API types and utilities (no legacy functions)

export function getMissingFields(websiteInfo: Partial<WebsiteInfo>): string[] {
  const required = ['businessName', 'businessType', 'location', 'updateContent'];
  const missing = [];
  
  for (const field of required) {
    const value = websiteInfo[field as keyof WebsiteInfo];
    if (!value || (Array.isArray(value) && value.length === 0)) {
      missing.push(field);
    }
  }
  
  return missing;
}



export function hasRequiredFields(websiteInfo: Partial<WebsiteInfo>): boolean {
  return !!(
    websiteInfo.businessName &&
    websiteInfo.businessType &&
    websiteInfo.location &&
    websiteInfo.updateContent
  );
}

export function determineConversationStage(websiteInfo: Partial<WebsiteInfo>): ConversationContext['conversationStage'] {
  if (!websiteInfo.businessName && !websiteInfo.updateContent) {
    return 'identify';
  }
  
  const missing = getMissingFields(websiteInfo);
  
  if (missing.length > 2) {
    return 'gather';
  } else if (missing.length > 0) {
    return 'validate';
  } else if (hasRequiredFields(websiteInfo)) {
    return 'confirm';
  } else {
    return 'gather';
  }
}


// Function to calculate AI discoverability score based on collected data
export function calculateAIDiscoverabilityScore(websiteInfo: Partial<WebsiteInfo>): number {
  let score = 0;
  
  // Authority Signals (30 points)
  const awards = websiteInfo.businessAuthority?.awards || [];
  const certifications = websiteInfo.businessAuthority?.certifications || [];
  const yearsInBusiness = websiteInfo.yearsInBusiness || 0;
  
  score += Math.min(awards.length * 5, 15); // Up to 15 points for awards
  score += Math.min(certifications.length * 3, 12); // Up to 12 points for certifications
  score += Math.min(yearsInBusiness > 10 ? 10 : yearsInBusiness / 2, 10); // Up to 10 points for experience
  
  // FAQ Optimization (25 points)
  const faqData = websiteInfo.faqData || [];
  score += Math.min(faqData.length * 3, 20); // Up to 20 points for FAQ quantity
  const qualityFAQs = faqData.filter(faq => faq.answer.length > 50).length;
  score += Math.min(qualityFAQs * 1, 5); // Up to 5 points for FAQ quality
  
  // Competitive Advantages (20 points)
  const uniqueSellingPoints = websiteInfo.competitiveAdvantage?.uniqueSellingPoints || [];
  const specialties = websiteInfo.competitiveAdvantage?.specialties || [];
  
  score += Math.min(uniqueSellingPoints.length * 3, 12); // Up to 12 points for USPs
  score += Math.min(specialties.length * 2, 8); // Up to 8 points for specialties
  
  // Customer Social Proof (15 points)
  const testimonials = websiteInfo.customerTestimonials || [];
  score += Math.min(testimonials.length * 2, 10); // Up to 10 points for testimonials
  const highRatedTestimonials = testimonials.filter(t => t.rating && t.rating >= 4).length;
  score += Math.min(highRatedTestimonials * 1, 5); // Up to 5 points for quality reviews
  
  // AI Optimization Keywords (10 points)
  const primaryKeywords = websiteInfo.aiOptimization?.primaryKeywords || [];
  const semanticKeywords = websiteInfo.aiOptimization?.semanticKeywords || [];
  
  score += primaryKeywords.length > 5 ? 5 : 0; // 5 points for sufficient primary keywords
  score += semanticKeywords.length > 10 ? 5 : 0; // 5 points for sufficient semantic keywords
  
  return Math.min(Math.round(score), 100);
}


// Generate AI-optimized URLs based on comprehensive business data
export function generateAIOptimizedUrls(websiteInfo: Partial<WebsiteInfo>): SuggestedUrls {
  const businessType = websiteInfo.businessType?.toLowerCase() || '';
  const updateContent = websiteInfo.updateContent?.toLowerCase() || '';
  const location = websiteInfo.location?.toLowerCase() || '';
  const specialties = websiteInfo.competitiveAdvantage?.specialties?.map(s => s.name.toLowerCase()) || [];
  const keywords = websiteInfo.aiOptimization?.primaryKeywords || [];
  
  // Extract key terms from update content
  const contentWords = updateContent.split(' ').filter(word => 
    word.length > 2 && 
    !['the', 'and', 'for', 'with', 'are', 'our', 'you', 'your', 'all', 'new', 'now'].includes(word)
  );
  
  // Extract location components
  const locationParts = location.split(',').map(part => part.trim().toLowerCase());
  const city = locationParts[0] || '';
  
  // Generate URL alternatives based on search intent patterns
  const urlAlternatives = [];
  
  // Pattern 1: Service + Location (most common search intent)
  if (contentWords[0] && city) {
    urlAlternatives.push(`${contentWords[0]}-${city.replace(/\s+/g, '-')}`);
  }
  
  // Pattern 2: Specialty + Service  
  if (specialties[0] && contentWords[0]) {
    urlAlternatives.push(`${specialties[0].replace(/\s+/g, '-')}-${contentWords[0]}`);
  }
  
  // Pattern 3: Service + Benefit/Feature
  if (contentWords[0] && contentWords[1]) {
    urlAlternatives.push(`${contentWords[0]}-${contentWords[1]}`);
  }
  
  // Pattern 4: Business Type + Location (for local SEO)
  if (businessType && city) {
    urlAlternatives.push(`${businessType.replace(/\s+/g, '-')}-${city.replace(/\s+/g, '-')}`);
  }
  
  // Fallback patterns if not enough content
  if (urlAlternatives.length < 4) {
    urlAlternatives.push(`${contentWords[0] || 'special'}-offer`);
    urlAlternatives.push(`${businessType.replace(/\s+/g, '-')}-service`);
    urlAlternatives.push(`local-${businessType.replace(/\s+/g, '-')}`);
    urlAlternatives.push(`${city.replace(/\s+/g, '-')}-${businessType.replace(/\s+/g, '-')}`);
  }
  
  // Clean and validate URLs
  const cleanUrls = urlAlternatives
    .map(url => url.replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, ''))
    .filter(url => url.length > 0 && url.length <= 50)
    .slice(0, 4);
  
  // Ensure we have exactly 4 unique URLs
  const uniqueUrls = [...new Set(cleanUrls)];
  while (uniqueUrls.length < 4) {
    uniqueUrls.push(`${contentWords[0] || 'offer'}-${Date.now().toString().slice(-3)}`);
  }
  
  return {
    primary: uniqueUrls[0],
    alternatives: uniqueUrls.slice(1, 4),
    reasoning: `Generated based on search intent patterns: service+location, specialty+service, local SEO optimization`
  };
}


// Function to optimize business description for AI search engines using complete business profile
export async function optimizeBusinessDescription(business: {
  name?: string;
  description?: string;
  category?: string;
  industry?: string;
  address_street?: string;
  address_city?: string;
  address_state?: string;
  zip_code?: string;
  country?: string;
  phone?: string;
  website?: string;
  email?: string;
  established_year?: number;
  founded?: string;
  hours?: string;
  services?: any[];
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
}): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke('optimize-business-description', {
      body: {
        business
      }
    });

    if (error) {
      return null;
    }

    if (!data || !data.message) {
      return null;
    }

    // The new edge function returns the description directly in data.message
    return data.message;
  } catch (error) {
    return null;
  }
}