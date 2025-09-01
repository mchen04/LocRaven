import { Tables, TablesInsert, TablesUpdate } from '@/libs/supabase/types';

// Database types
export type BusinessProfile = Tables<'businesses'>;
export type BusinessProfileInsert = TablesInsert<'businesses'>;
export type BusinessProfileUpdate = TablesUpdate<'businesses'>;

// UI component props
export interface BusinessProfileTabProps {
  initialData?: BusinessProfile | null;
}

// API response types
export interface BusinessProfileResponse {
  success: boolean;
  data?: BusinessProfile;
  error?: string;
}

// Form state interface
export interface BusinessFormState {
  businessName: string;
  businessDescription: string;
  website: string;
  phoneNumber: string;
  phoneCountryCode: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  category: string;
  establishedYear: string;
  hours: string;
  parkingInfo: string;
  pricePositioning: string;
  serviceArea: string;
  specialties: string[];
  services: string[];
  paymentMethods: string[];
  languagesSpoken: string[];
  accessibilityFeatures: string[];
  staticTags: string[];
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  businessFaqs: Array<{ question: string; answer: string }>;
  isSaving: boolean;
  errors: Record<string, string>;
}

// Transform functions between database and form
export function businessToFormState(business: BusinessProfile | null): Partial<BusinessFormState> {
  if (!business) {
    return {
      businessName: '',
      businessDescription: '',
      website: '',
      phoneNumber: '',
      phoneCountryCode: '+1',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
      category: '',
      establishedYear: '',
      hours: '',
      parkingInfo: '',
      pricePositioning: '',
      serviceArea: '',
      specialties: [],
      services: [],
      paymentMethods: ['Cash', 'Credit Card'],
      languagesSpoken: ['English'],
      accessibilityFeatures: [],
      staticTags: [],
      socialMedia: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: '',
      },
      businessFaqs: [],
    };
  }

  return {
    businessName: business.name || '',
    businessDescription: business.description || '',
    website: business.website || '',
    phoneNumber: business.phone || '',
    phoneCountryCode: business.phone_country_code || '+1',
    address: business.address_street || '',
    city: business.address_city || '',
    state: business.address_state || '',
    zipCode: business.zip_code || '',
    country: business.country || 'US',
    category: business.primary_category || '',
    establishedYear: business.established_year?.toString() || '',
    hours: business.hours || '',
    parkingInfo: business.parking_info || '',
    pricePositioning: business.price_positioning || '',
    serviceArea: business.service_area || '',
    specialties: (business.specialties as string[]) || [],
    services: (business.services as string[]) || [],
    paymentMethods: business.payment_methods || ['Cash', 'Credit Card'],
    languagesSpoken: business.languages_spoken || ['English'],
    accessibilityFeatures: business.accessibility_features || [],
    staticTags: business.static_tags || [],
    socialMedia: (business.social_media as any) || {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: '',
    },
    businessFaqs: (business.business_faqs as Array<{ question: string; answer: string }>) || [],
  };
}

export function formStateToBusinessData(formState: BusinessFormState) {
  return {
    name: formState.businessName,
    description: formState.businessDescription || null,
    website: formState.website || null,
    phone: formState.phoneNumber || null,
    phone_country_code: formState.phoneCountryCode || null,
    address_street: formState.address || null,
    address_city: formState.city || null,
    address_state: formState.state || null,
    zip_code: formState.zipCode || null,
    country: formState.country || null,
    primary_category: formState.category || null,
    established_year: formState.establishedYear ? parseInt(formState.establishedYear) : null,
    hours: formState.hours || null,
    parking_info: formState.parkingInfo || null,
    price_positioning: formState.pricePositioning || null,
    service_area: formState.serviceArea || null,
    specialties: formState.specialties.length > 0 ? formState.specialties : null,
    services: formState.services.length > 0 ? formState.services : null,
    payment_methods: formState.paymentMethods.length > 0 ? formState.paymentMethods : null,
    languages_spoken: formState.languagesSpoken.length > 0 ? formState.languagesSpoken : null,
    accessibility_features: formState.accessibilityFeatures.length > 0 ? formState.accessibilityFeatures : null,
    static_tags: formState.staticTags.length > 0 ? formState.staticTags as any : null,
    social_media: (formState.socialMedia.facebook || formState.socialMedia.twitter || 
                   formState.socialMedia.instagram || formState.socialMedia.linkedin || 
                   formState.socialMedia.youtube) ? formState.socialMedia : null,
    business_faqs: formState.businessFaqs.length > 0 ? formState.businessFaqs : null,
  };
}