/**
 * Schema.org Structured Data Generators
 * Complete LocalBusiness, FAQ, Speakable, and specialized schema markup
 */

import { PageData, getCategoryDisplay } from './base-template.ts';

// Generate complete LocalBusiness JSON-LD with all available schema fields
export function generateLocalBusinessSchema(data: PageData): string {
  const businessType = getSchemaBusinessType(data.business.primary_category);
  
  const schema = {
    "@context": "https://schema.org",
    "@type": businessType,
    "@id": `https://locraven.com/business/${data.intent.slug}#business`,
    "name": data.business.name,
    "description": data.business.description || `${getCategoryDisplay(data.business.primary_category)} in ${data.business.address_city}, ${data.business.address_state}`,
    "url": data.business.website,
    "telephone": data.business.phone,
    "email": data.business.email,
    
    // Address with all available components
    "address": {
      "@type": "PostalAddress",
      "streetAddress": data.business.address_street,
      "addressLocality": data.business.address_city,
      "addressRegion": data.business.address_state,
      "postalCode": data.business.zip_code,
      "addressCountry": data.business.country || "US"
    },
    
    // GEO coordinates for precise location
    ...(data.business.latitude && data.business.longitude && {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": data.business.latitude,
        "longitude": data.business.longitude
      }
    }),
    
    // Service area coverage
    ...(data.business.service_area_details && {
      "areaServed": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": data.business.latitude || 0,
          "longitude": data.business.longitude || 0
        },
        "geoRadius": data.business.service_area_details.coverage_radius ? 
          `${data.business.service_area_details.coverage_radius * 1609.34}` : "8046.72" // Default 5 miles in meters
      }
    }),
    
    // Business hours with structured format
    ...(data.business.structured_hours && {
      "openingHoursSpecification": generateOpeningHours(data.business.structured_hours)
    }),
    
    // Payment methods
    "paymentAccepted": data.business.payment_methods || ["Cash", "Credit Card"],
    
    // Languages spoken
    ...(data.business.languages_spoken && {
      "availableLanguage": data.business.languages_spoken
    }),
    
    // Accessibility features
    ...(data.business.accessibility_features && {
      "accessibilityFeature": data.business.accessibility_features
    }),
    
    // Price range
    ...(data.business.price_positioning && {
      "priceRange": data.business.price_positioning
    }),
    
    // Founding date
    ...(data.business.established_year && {
      "foundingDate": data.business.established_year.toString()
    }),
    
    // Awards and recognitions
    ...(data.business.awards && data.business.awards.length > 0 && {
      "award": data.business.awards.map(award => award.name || award).slice(0, 5)
    }),
    
    // Services/specialties
    ...(data.business.services && data.business.services.length > 0 && {
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Services",
        "itemListElement": data.business.services.map((service, index) => ({
          "@type": "OfferCatalog",
          "name": service,
          "position": index + 1
        }))
      }
    }),
    
    // Current update as an offer
    "makesOffer": {
      "@type": "Offer",
      "name": data.seo.title,
      "description": data.update.content_text,
      "validFrom": data.update.created_at,
      ...(data.update.expires_at && {
        "validThrough": data.update.expires_at
      }),
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": businessType,
        "name": data.business.name
      }
    },
    
    // Social media profiles
    ...(data.business.social_media && Object.keys(data.business.social_media).length > 0 && {
      "sameAs": Object.values(data.business.social_media).filter(Boolean)
    }),
    
    // Review summary if available
    ...(data.business.review_summary && data.business.review_summary.average_rating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": data.business.review_summary.average_rating,
        "reviewCount": data.business.review_summary.total_reviews,
        "bestRating": "5",
        "worstRating": "1"
      }
    }),
    
    // Date modified
    "dateModified": new Date().toISOString(),
    
    // Speakable sections for voice search
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".voice-summary", ".quick-answer", ".urgent-info", ".ai-context h2"]
    }
  };
  
  // Clean undefined values
  return JSON.stringify(cleanSchema(schema), null, 2);
}

// Generate FAQ Page schema from business and update FAQs
export function generateFAQSchema(data: PageData): string {
  const allFaqs = [
    ...(data.business.business_faqs || []),
    ...(data.update.update_faqs || []),
    ...(data.faqs || [])
  ].filter(faq => faq && faq.question && faq.answer);

  if (allFaqs.length === 0) return '';

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `https://locraven.com/business/${data.intent.slug}#faq`,
    "mainEntity": allFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      },
      ...(faq.voiceSearchTriggers && {
        "keywords": faq.voiceSearchTriggers.join(', ')
      })
    }))
  };

  return JSON.stringify(schema, null, 2);
}

// Generate breadcrumb navigation schema
export function generateBreadcrumbSchema(data: PageData): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://locraven.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": data.business.address_state,
        "item": `https://locraven.com/state/${data.business.address_state?.toLowerCase()}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": data.business.address_city,
        "item": `https://locraven.com/city/${data.business.address_city?.toLowerCase().replace(/\s+/g, '-')}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": getCategoryDisplay(data.business.primary_category),
        "item": `https://locraven.com/category/${data.business.primary_category}`
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": data.business.name,
        "item": `https://locraven.com/business/${data.intent.slug}`
      }
    ]
  };

  return JSON.stringify(schema, null, 2);
}

// Generate WebPage schema with intent-specific properties
export function generateWebPageSchema(data: PageData): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `https://locraven.com${data.intent.filePath}`,
    "name": data.seo.title,
    "description": data.seo.description,
    "url": `https://locraven.com${data.intent.filePath}`,
    "datePublished": data.update.created_at,
    "dateModified": new Date().toISOString(),
    "inLanguage": "en-US",
    "isPartOf": {
      "@type": "WebSite",
      "@id": "https://locraven.com#website",
      "name": "LocRaven",
      "url": "https://locraven.com"
    },
    "about": {
      "@id": `https://locraven.com/business/${data.intent.slug}#business`
    },
    "mainEntity": {
      "@id": `https://locraven.com/business/${data.intent.slug}#business`
    },
    "significantLink": [
      `https://locraven.com/business/${data.intent.slug}`,
      ...(data.business.website ? [data.business.website] : []),
      ...(data.business.social_media ? Object.values(data.business.social_media).filter(Boolean) : [])
    ].slice(0, 5),
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".voice-summary", ".quick-answer"]
    }
  };

  return JSON.stringify(cleanSchema(schema), null, 2);
}

// Generate all schema tags for HTML head
export function generateAllSchemaMarkup(data: PageData): string {
  const schemas = [
    generateLocalBusinessSchema(data),
    generateFAQSchema(data),
    generateBreadcrumbSchema(data),
    generateWebPageSchema(data)
  ].filter(Boolean);

  return schemas.map(schema => `<script type="application/ld+json">\n${schema}\n</script>`).join('\n');
}

// Helper functions
function getSchemaBusinessType(primaryCategory: string): string {
  const typeMap: Record<string, string> = {
    'food-dining': 'Restaurant',
    'shopping': 'Store',
    'beauty-grooming': 'BeautySalon', 
    'health-medical': 'MedicalBusiness',
    'repairs-services': 'AutoRepair', // Could be more specific based on actual service
    'professional-services': 'ProfessionalService',
    'activities-entertainment': 'EntertainmentBusiness',
    'education-training': 'EducationalOrganization',
    'creative-digital': 'LocalBusiness',
    'transportation-delivery': 'MovingCompany'
  };
  return typeMap[primaryCategory] || 'LocalBusiness';
}

function generateOpeningHours(structuredHours: any): any[] {
  const dayMap: Record<string, string> = {
    'mon': 'Monday',
    'tue': 'Tuesday', 
    'wed': 'Wednesday',
    'thu': 'Thursday',
    'fri': 'Friday',
    'sat': 'Saturday',
    'sun': 'Sunday'
  };

  return Object.entries(structuredHours)
    .filter(([day, hours]: [string, any]) => hours && hours.open && hours.close)
    .map(([day, hours]: [string, any]) => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": dayMap[day.toLowerCase()] || day,
      "opens": hours.open,
      "closes": hours.close
    }));
}

function cleanSchema(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(cleanSchema).filter(item => 
      item !== null && item !== undefined && item !== ""
    );
  }
  
  if (obj !== null && typeof obj === 'object') {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const cleanedValue = cleanSchema(value);
      if (cleanedValue !== null && cleanedValue !== undefined && cleanedValue !== "") {
        // Don't include empty objects or arrays
        if (typeof cleanedValue === 'object') {
          if (Array.isArray(cleanedValue) && cleanedValue.length > 0) {
            cleaned[key] = cleanedValue;
          } else if (!Array.isArray(cleanedValue) && Object.keys(cleanedValue).length > 0) {
            cleaned[key] = cleanedValue;
          }
        } else {
          cleaned[key] = cleanedValue;
        }
      }
    }
    return cleaned;
  }
  
  return obj;
}