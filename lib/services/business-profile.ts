import { Business, AvailabilityPolicy } from '../../types';
import { TemplateVariables } from './templates';

/**
 * Transform business data into template-ready variables
 */
export function processBusinessData(business: Business): TemplateVariables {
  const currentYear = new Date().getFullYear();
  const establishedYear = business.established_year || currentYear;
  const yearsSinceEstablished = Math.max(0, currentYear - establishedYear);
  
  // Generate SEO-optimized content
  const pageTitle = generatePageTitle(business);
  const metaDescription = generateMetaDescription(business);
  const aiQuestion = generateAIQuestion(business);
  const aiAnswer = generateAIAnswer(business);
  
  // Process social media
  const socialMediaSection = generateSocialMediaSection(business);
  
  // Process location
  const fullAddress = generateFullAddress(business);
  
  // Format arrays as comma-separated strings
  const specialties = Array.isArray(business.specialties) ? business.specialties.join(', ') : business.specialties || '';
  const services = Array.isArray(business.services) ? business.services.join(', ') : business.services || '';
  const staticTags = Array.isArray(business.static_tags) ? business.static_tags.join(', ') : business.static_tags || '';
  const featuredItems = Array.isArray(business.featured_items) ? business.featured_items.join(', ') : business.featured_items || '';
  
  // Enhanced fields processing
  const accessibilityFeatures = Array.isArray(business.accessibility_features) ? business.accessibility_features.join(', ') : business.accessibility_features || '';
  const paymentMethods = Array.isArray(business.payment_methods) ? business.payment_methods.join(', ') : business.payment_methods || '';
  const languagesSpoken = Array.isArray(business.languages_spoken) ? business.languages_spoken.join(', ') : business.languages_spoken || '';
  
  // Process enhanced parking info
  const parkingInfo = business.enhanced_parking_info ? 
    formatEnhancedParkingInfo(business.enhanced_parking_info) : 
    business.parking_info || '';
  
  // Process service area details
  const serviceArea = business.service_area_details ? 
    formatServiceAreaDetails(business.service_area_details) : 
    business.service_area || '';
  
  // Generate structured data
  const structuredData = generateStructuredData(business);
  
  // Generate timestamps
  const timestamp = new Date().toISOString();
  const lastUpdated = business.updated_at ? new Date(business.updated_at).toISOString() : timestamp;
  
  return {
    // Basic Business Info
    BUSINESS_NAME: business.name || '',
    BUSINESS_CATEGORY: business.primary_category || '',
    BUSINESS_DESCRIPTION: business.description || '',
    BUSINESS_PHONE: formatPhoneNumber(business.phone, business.phone_country_code),
    BUSINESS_WEBSITE: business.website || '',
    BUSINESS_EMAIL: business.email || '',
    
    // Location
    BUSINESS_ADDRESS_STREET: business.address_street || '',
    BUSINESS_ADDRESS_CITY: business.address_city || '',
    BUSINESS_ADDRESS_STATE: business.address_state || '',
    BUSINESS_ZIP_CODE: business.zip_code || '',
    BUSINESS_COUNTRY: business.country || 'US',
    FULL_ADDRESS: fullAddress,
    
    // Business Details
    BUSINESS_HOURS: business.hours || 'Contact for hours',
    BUSINESS_ESTABLISHED_YEAR: establishedYear.toString(),
    YEARS_SINCE_FOUNDED: yearsSinceEstablished.toString(),
    BUSINESS_SPECIALTIES: specialties,
    BUSINESS_SERVICES: services,
    BUSINESS_FEATURES: staticTags,
    
    // AI-Optimized Fields (Enhanced)
    SERVICE_AREA: serviceArea,
    FEATURED_ITEMS: featuredItems,
    AVAILABILITY_POLICY: formatAvailabilityPolicy(business.availability_policy),
    PARKING_INFO: parkingInfo,
    ACCESSIBILITY_FEATURES: accessibilityFeatures,
    PAYMENT_METHODS: paymentMethods,
    LANGUAGES_SPOKEN: languagesSpoken,
    
    // Social Media
    INSTAGRAM_URL: business.social_media?.instagram || '',
    FACEBOOK_URL: business.social_media?.facebook || '',
    TWITTER_URL: business.social_media?.twitter || '',
    LINKEDIN_URL: business.social_media?.linkedin || '',
    SOCIAL_MEDIA_SECTION: socialMediaSection,
    
    // SEO & Meta
    PAGE_TITLE: pageTitle,
    META_DESCRIPTION: metaDescription,
    CANONICAL_URL: `https://locraven.com/business/${business.slug}`,
    URL_PATH: `/business/${business.slug}`,
    
    // AI-Optimized Content
    AI_GENERATED_QUESTION: aiQuestion,
    AI_GENERATED_DIRECT_ANSWER: aiAnswer,
    STRUCTURED_DATA: structuredData,
    
    // Timestamps
    TIMESTAMP: timestamp,
    LAST_UPDATED: lastUpdated,
    
    // FAQ Section (new template variables)
    FAQ_SECTION: '',
    FAQ_SCHEMA: '',
    HOURS_ANSWER: business.hours ? `${business.name} is open ${business.hours}. Call ${business.phone || 'us'} to confirm current hours.` : 'Contact for hours',
    CONTACT_ANSWER: business.phone ? `Call ${business.phone} or email ${business.email || 'us'} to reach ${business.name}.` : 'Contact for details',
    SERVICES_ANSWER: services || 'Contact for services',
    LOCATION_ANSWER: fullAddress || 'Local business',
    CURRENT_STATUS: 'Contact for current status',
    FEATURE_HIGHLIGHTS: staticTags
  };
}

/**
 * Generate SEO-optimized page title
 */
function generatePageTitle(business: Business): string {
  const name = business.name || 'Local Business';
  const category = business.primary_category || 'Business';
  const city = business.address_city || '';
  const state = business.address_state || '';
  
  if (city && state) {
    return `${name} | ${category} in ${city}, ${state}`;
  } else if (city) {
    return `${name} | ${category} in ${city}`;
  } else {
    return `${name} | ${category}`;
  }
}

/**
 * Generate SEO-optimized meta description
 */
function generateMetaDescription(business: Business): string {
  const name = business.name || 'Local business';
  const category = business.primary_category || 'business';
  const city = business.address_city || '';
  const description = business.description || '';
  
  let metaDesc = `${name} is a ${category.toLowerCase()}`;
  
  if (city) {
    metaDesc += ` in ${city}`;
  }
  
  if (description) {
    // Take first 100 characters of description
    const shortDesc = description.substring(0, 100).trim();
    metaDesc += `. ${shortDesc}`;
  }
  
  // Ensure meta description is under 160 characters
  if (metaDesc.length > 157) {
    metaDesc = metaDesc.substring(0, 157) + '...';
  }
  
  return metaDesc;
}

/**
 * Generate AI-optimized discovery question
 */
function generateAIQuestion(business: Business): string {
  const category = business.primary_category || 'business';
  const city = business.address_city || '';
  const state = business.address_state || '';
  
  if (city && state) {
    return `What's the best ${category.toLowerCase()} in ${city}, ${state}?`;
  } else if (city) {
    return `Where can I find a good ${category.toLowerCase()} in ${city}?`;
  } else {
    return `Looking for a reliable ${category.toLowerCase()}?`;
  }
}

/**
 * Generate AI-optimized direct answer
 */
function generateAIAnswer(business: Business): string {
  const name = business.name || 'This business';
  const category = business.primary_category || 'business';
  const city = business.address_city || '';
  const specialties = Array.isArray(business.specialties) ? business.specialties.slice(0, 2) : [];
  
  let answer = `${name} is a highly-rated ${category.toLowerCase()}`;
  
  if (city) {
    answer += ` located in ${city}`;
  }
  
  if (specialties.length > 0) {
    answer += ` specializing in ${specialties.join(' and ')}`;
  }
  
  answer += '.';
  
  return answer;
}

/**
 * Generate social media section HTML
 */
function generateSocialMediaSection(business: Business): string {
  const social = business.social_media || {};
  const socialLinks = [];
  
  if (social.instagram) {
    socialLinks.push(`<a href="${social.instagram}" target="_blank" rel="noopener">Instagram</a>`);
  }
  if (social.facebook) {
    socialLinks.push(`<a href="${social.facebook}" target="_blank" rel="noopener">Facebook</a>`);
  }
  if (social.twitter) {
    socialLinks.push(`<a href="${social.twitter}" target="_blank" rel="noopener">Twitter</a>`);
  }
  if (social.linkedin) {
    socialLinks.push(`<a href="${social.linkedin}" target="_blank" rel="noopener">LinkedIn</a>`);
  }
  
  if (socialLinks.length === 0) {
    return '';
  }
  
  return `<div class="social-links">${socialLinks.join(' | ')}</div>`;
}

/**
 * Generate full formatted address
 */
function generateFullAddress(business: Business): string {
  const parts = [
    business.address_street,
    business.address_city,
    business.address_state,
    business.zip_code
  ].filter(Boolean);
  
  return parts.join(', ');
}

/**
 * Format phone number for display
 */
function formatPhoneNumber(phone?: string, countryCode?: string): string {
  if (!phone) return '';
  
  // Simple US phone number formatting
  if (countryCode === '+1' && phone.length === 10) {
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
  }
  
  return `${countryCode || ''}${phone}`;
}

/**
 * Format availability policy for display
 */
function formatAvailabilityPolicy(policy?: AvailabilityPolicy | string): string {
  if (!policy) return 'Contact for availability';
  
  // Handle new structured type
  if (typeof policy === 'object' && policy.type) {
    const baseText = policy.type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return policy.custom_text ? `${baseText}: ${policy.custom_text}` : baseText;
  }
  
  // Handle string type conversion
  if (typeof policy === 'string') {
    return policy.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  
  return 'Contact for availability';
}

/**
 * Format enhanced parking info for display
 */
function formatEnhancedParkingInfo(parkingInfo: any): string {
  if (!parkingInfo || typeof parkingInfo !== 'object') return '';
  
  const types = Array.isArray(parkingInfo.types) ? parkingInfo.types : [];
  const notes = parkingInfo.notes || '';
  
  if (types.length === 0 && !notes) return '';
  
  const typeLabels = types.map((type: string) => {
    switch (type) {
      case 'free': return 'Free parking';
      case 'paid': return 'Paid parking';
      case 'street': return 'Street parking';
      case 'valet': return 'Valet parking';
      default: return type;
    }
  });
  
  const result = typeLabels.join(', ');
  return notes ? `${result}. ${notes}` : result;
}

/**
 * Format service area details for display
 */
function formatServiceAreaDetails(serviceArea: any): string {
  if (!serviceArea || typeof serviceArea !== 'object') return '';
  
  const primaryCity = serviceArea.primary_city || '';
  const radius = serviceArea.coverage_radius;
  const additionalCities = Array.isArray(serviceArea.additional_cities) ? serviceArea.additional_cities : [];
  
  let result = primaryCity;
  
  if (radius) {
    result += ` and ${radius} mile radius`;
  }
  
  if (additionalCities.length > 0) {
    result += `, including ${additionalCities.join(', ')}`;
  }
  
  return result || 'Local area';
}

/**
 * Generate JSON-LD structured data for AI crawlers
 */
function generateStructuredData(business: Business): string {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": business.name,
    "description": business.description,
    "url": business.website,
    "telephone": business.phone,
    "email": business.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": business.address_street,
      "addressLocality": business.address_city,
      "addressRegion": business.address_state,
      "postalCode": business.zip_code,
      "addressCountry": business.country || "US"
    },
    "openingHours": business.hours,
    "foundingDate": business.established_year?.toString(),
    "sameAs": Object.values(business.social_media || {}).filter(Boolean)
  };
  
  // Remove undefined values
  const cleanData = JSON.parse(JSON.stringify(structuredData, (key, value) => 
    value === undefined ? undefined : value
  ));
  
  return JSON.stringify(cleanData, null, 2);
}