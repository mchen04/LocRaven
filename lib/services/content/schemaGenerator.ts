import type { 
  WebsiteInfo, 
  FAQData, 
  CustomerTestimonial,
  Award,
  Specialty
} from '../ai/geminiApi';

// Map new primary categories to Schema.org types
const businessTypeMapping: Record<string, string> = {
  // New primary category system (matches database enum)
  'food-dining': 'Restaurant',
  'shopping': 'Store',
  'beauty-grooming': 'BeautySalon',
  'health-medical': 'MedicalClinic',
  'repairs-services': 'RepairShop',
  'professional-services': 'ProfessionalService',
  'activities-entertainment': 'EntertainmentBusiness',
  'education-training': 'EducationalOrganization',
  'creative-digital': 'ProfessionalService',
  'transportation-delivery': 'LocalBusiness',
  
  // Specific subcategory mappings for common types
  'cafe': 'CafeOrCoffeeShop',
  'bar': 'BarOrPub', 
  'spa': 'DaySpa',
  'boutique': 'ClothingStore',
  'dental': 'DentistOffice',
  'fitness': 'GymOrFitnessCenter',
  'gym': 'GymOrFitnessCenter',
  'automotive': 'AutoRepair',
  'legal': 'LegalService',
  'accounting': 'AccountingService',
  'consulting': 'ProfessionalService',
  'real estate': 'RealEstateAgent',
  'home services': 'HomeAndConstructionBusiness',
  'plumbing': 'PlumbingService',
  'electrical': 'ElectricalService',
  'landscaping': 'LandscapingBusiness',
  'cleaning': 'CleaningService',
  'tutoring': 'EducationalOrganization',
  'venue': 'EventVenue',
  'hotel': 'LodgingBusiness'
};

// Map price positioning to Schema.org price range
const priceRangeMapping: Record<string, string> = {
  'budget': '$',
  'mid-range': '$$', 
  'premium': '$$$',
  'luxury': '$$$$'
};

// Generate comprehensive JSON-LD schema for AI optimization
export function generateComprehensiveSchema(
  websiteInfo: WebsiteInfo,
  businessProfile?: any
): object {
  const schemaType = businessTypeMapping[websiteInfo.businessType] || 'LocalBusiness';
  
  // Parse location for address components
  const locationParts = websiteInfo.location.split(',').map(part => part.trim());
  const city = locationParts[0] || '';
  const state = locationParts[1] || '';
  
  // Base schema structure
  const schema: any = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "name": websiteInfo.businessName,
    "description": websiteInfo.previewData?.description || websiteInfo.updateContent,
    
    // Location and contact information
    "address": {
      "@type": "PostalAddress",
      "streetAddress": businessProfile?.address_street || websiteInfo.contactInfo?.address,
      "addressLocality": city,
      "addressRegion": state,
      "postalCode": businessProfile?.zip_code,
      "addressCountry": businessProfile?.country || "US"
    },
    
    "telephone": businessProfile?.phone || websiteInfo.contactInfo?.phone,
    "url": businessProfile?.website || websiteInfo.contactInfo?.email,
    
    // Business details
    "foundingDate": businessProfile?.established_year?.toString(),
    "numberOfEmployees": websiteInfo.employeeCountRange,
    "priceRange": websiteInfo.competitiveAdvantage?.pricePositioning ? 
      priceRangeMapping[websiteInfo.competitiveAdvantage.pricePositioning] : undefined
  };

  // Add geo coordinates if available (CRITICAL for local AI search)
  if (businessProfile?.latitude && businessProfile?.longitude) {
    schema.geo = {
      "@type": "GeoCoordinates",
      "latitude": parseFloat(businessProfile.latitude),
      "longitude": parseFloat(businessProfile.longitude)
    };
  }

  // Add aggregate rating if available (HIGH impact for AI trust)
  if (businessProfile?.review_summary && typeof businessProfile.review_summary === 'object') {
    const reviews = businessProfile.review_summary;
    if (reviews.averageRating && reviews.totalReviews) {
      schema.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": reviews.averageRating,
        "reviewCount": reviews.totalReviews,
        "bestRating": 5,
        "worstRating": 1
      };
    }
  }

  // Add social media links for authority (sameAs)
  if (businessProfile?.social_media && typeof businessProfile.social_media === 'object') {
    const socialLinks = Object.values(businessProfile.social_media)
      .filter(url => typeof url === 'string' && url.length > 0);
    if (socialLinks.length > 0) {
      schema.sameAs = socialLinks;
    }
  }

  // Add payment methods in structured format
  if (businessProfile?.payment_methods && Array.isArray(businessProfile.payment_methods)) {
    schema.paymentAccepted = businessProfile.payment_methods;
  }

  // Add accessibility features
  if (businessProfile?.accessibility_features && Array.isArray(businessProfile.accessibility_features)) {
    schema.accessibilityFeature = businessProfile.accessibility_features;
  }

  // Add structured opening hours if available (better than text for AI)
  if (businessProfile?.structured_hours && typeof businessProfile.structured_hours === 'object') {
    schema.openingHoursSpecification = businessProfile.structured_hours;
  } else if (businessProfile?.base_hours) {
    schema.openingHoursSpecification = generateOpeningHours(businessProfile.base_hours);
  }

  // Enhanced awards and certifications (authority signals for AI)
  const awardsList = websiteInfo.businessAuthority?.awards || businessProfile?.awards || [];
  const certificationsList = businessProfile?.certifications || [];
  
  if (awardsList.length > 0 || certificationsList.length > 0) {
    schema.award = [
      ...awardsList.map((award: Award) => ({
        "@type": "Award",
        "name": award.name,
        "awarder": award.issuer,
        "dateAwarded": award.year?.toString(),
        "category": award.category || "Business Excellence"
      })),
      ...certificationsList.map((cert: any) => ({
        "@type": "Award", 
        "name": cert.name,
        "awarder": cert.issuer,
        "dateAwarded": cert.validFrom,
        "category": "Professional Certification"
      }))
    ];
  }

  // Add specialties and services
  if (websiteInfo.competitiveAdvantage?.specialties?.length) {
    schema.hasOfferCatalog = {
      ...schema.hasOfferCatalog,
      "@type": "OfferCatalog",
      "name": "Services and Specialties", 
      "itemListElement": [
        ...(schema.hasOfferCatalog?.itemListElement || []),
        ...websiteInfo.competitiveAdvantage.specialties.map((specialty: Specialty, index: number) => ({
          "@type": "Offer",
          "position": index + 1,
          "name": specialty.name,
          "description": specialty.description,
          "category": websiteInfo.businessType
        }))
      ]
    };
  }

  // Add FAQ structured data (critical for AI search)
  if (websiteInfo.faqData?.length) {
    schema.mainEntity = websiteInfo.faqData.map((faq: FAQData) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }));
  }

  // Add customer reviews and testimonials
  if (websiteInfo.customerTestimonials?.length) {
    schema.review = websiteInfo.customerTestimonials.map((testimonial: CustomerTestimonial) => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": testimonial.customerName
      },
      "reviewBody": testimonial.testimonialText,
      "reviewRating": testimonial.rating ? {
        "@type": "Rating",
        "ratingValue": testimonial.rating,
        "bestRating": 5
      } : undefined,
      "datePublished": testimonial.date
    }));

    // Calculate aggregate rating
    const ratingsWithValues = websiteInfo.customerTestimonials.filter(t => t.rating);
    if (ratingsWithValues.length > 0) {
      const averageRating = ratingsWithValues.reduce((sum, t) => sum + (t.rating || 0), 0) / ratingsWithValues.length;
      schema.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": Math.round(averageRating * 10) / 10,
        "reviewCount": ratingsWithValues.length,
        "bestRating": 5
      };
    }
  }

  // Add service area geographic precision (important for local AI queries)
  if (businessProfile?.service_area_details && typeof businessProfile.service_area_details === 'object') {
    const serviceArea = businessProfile.service_area_details;
    schema.areaServed = {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates", 
        "latitude": businessProfile.latitude,
        "longitude": businessProfile.longitude
      },
      "geoRadius": serviceArea.coverage_radius ? `${serviceArea.coverage_radius} mi` : "25 mi"
    };
    
    // Also add additional cities served
    if (serviceArea.additional_cities && Array.isArray(serviceArea.additional_cities)) {
      schema.serviceArea = serviceArea.additional_cities.concat([serviceArea.primary_city]).filter(Boolean);
    }
  } else if (businessProfile?.service_area) {
    schema.areaServed = businessProfile.service_area;
  }

  // Add current offer/update
  if (websiteInfo.updateContent && websiteInfo.temporalInfo?.expiresAt) {
    schema.hasOfferCatalog = {
      ...schema.hasOfferCatalog,
      "@type": "OfferCatalog",
      "name": "Current Offers",
      "itemListElement": [
        ...(schema.hasOfferCatalog?.itemListElement || []),
        {
          "@type": "Offer",
          "name": websiteInfo.previewData?.title || websiteInfo.updateContent,
          "description": websiteInfo.updateContent,
          "validThrough": websiteInfo.temporalInfo.expiresAt,
          "availability": "https://schema.org/InStock"
        }
      ]
    };
  }

  // Add business keywords for semantic understanding
  if (websiteInfo.aiOptimization?.primaryKeywords?.length) {
    schema.keywords = [
      ...websiteInfo.aiOptimization.primaryKeywords,
      ...(websiteInfo.aiOptimization.semanticKeywords || [])
    ].join(', ');
  }

  // Add business story and additional context
  if (websiteInfo.businessStory) {
    schema.description = `${schema.description}. ${websiteInfo.businessStory}`;
  }

  // Add languages spoken for international businesses
  if (websiteInfo.languagesSpoken?.length) {
    schema.knowsLanguage = websiteInfo.languagesSpoken.map(lang => ({
      "@type": "Language",
      "name": lang
    }));
  }

  // Add service areas
  if (websiteInfo.serviceAreas?.length) {
    schema.areaServed = websiteInfo.serviceAreas.map(area => ({
      "@type": "City",
      "name": area
    }));
  }

  return schema;
}

// Generate opening hours schema from base_hours JSONB
function generateOpeningHours(baseHours: any): any[] {
  if (!baseHours || typeof baseHours !== 'object') return [];
  
  const dayMapping: Record<string, string> = {
    'monday': 'Monday',
    'tuesday': 'Tuesday', 
    'wednesday': 'Wednesday',
    'thursday': 'Thursday',
    'friday': 'Friday',
    'saturday': 'Saturday',
    'sunday': 'Sunday'
  };

  return Object.entries(baseHours).map(([day, hours]) => {
    if (!hours || hours === 'closed') return null;
    
    const [open, close] = (hours as string).split('-').map(time => time.trim());
    
    return {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": dayMapping[day.toLowerCase()],
      "opens": open,
      "closes": close
    };
  }).filter(Boolean);
}

// Generate FAQ+JSON-LD specifically optimized for AI search engines
export function generateFAQSchema(faqData: FAQData[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      },
      "keywords": faq.searchTerms?.join(', ')
    }))
  };
}

// Generate Organization schema with enhanced authority signals
export function generateOrganizationSchema(websiteInfo: WebsiteInfo, businessProfile?: any): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": websiteInfo.businessName,
    "description": websiteInfo.previewData?.description || websiteInfo.updateContent,
    "foundingDate": businessProfile?.established_year?.toString(),
    "numberOfEmployees": websiteInfo.employeeCountRange,
    
    // Awards and achievements
    "awards": websiteInfo.businessAuthority?.awards?.map((award: Award) => award.name),
    
    // Contact information
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": businessProfile?.phone || websiteInfo.contactInfo?.phone,
      "contactType": "customer service",
      "availableLanguage": websiteInfo.languagesSpoken
    },
    
    // Social media profiles
    "sameAs": businessProfile?.social_media ? Object.values(businessProfile.social_media).filter(Boolean) : [],
    
    // Service areas
    "areaServed": websiteInfo.serviceAreas?.map(area => ({
      "@type": "City", 
      "name": area
    })),
    
    // Keywords for AI understanding
    "keywords": [
      ...(websiteInfo.aiOptimization?.primaryKeywords || []),
      ...(websiteInfo.aiOptimization?.semanticKeywords || [])
    ].join(', ')
  };
}

// Generate Product/Service schema for specific offerings
export function generateServiceSchema(websiteInfo: WebsiteInfo): object[] {
  if (!websiteInfo.competitiveAdvantage?.specialties?.length) return [];
  
  return websiteInfo.competitiveAdvantage.specialties.map((specialty: Specialty) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": specialty.name,
    "description": specialty.description,
    "provider": {
      "@type": "Organization", 
      "name": websiteInfo.businessName
    },
    "category": websiteInfo.businessType,
    "areaServed": websiteInfo.serviceAreas?.map(area => ({
      "@type": "City",
      "name": area  
    }))
  }));
}

// Main function to generate all required schemas for a page
export function generateAllSchemas(websiteInfo: WebsiteInfo, businessProfile?: any): {
  mainSchema: object;
  faqSchema?: object;
  organizationSchema: object;
  serviceSchemas: object[];
} {
  return {
    mainSchema: generateComprehensiveSchema(websiteInfo, businessProfile),
    faqSchema: websiteInfo.faqData?.length ? generateFAQSchema(websiteInfo.faqData) : undefined,
    organizationSchema: generateOrganizationSchema(websiteInfo, businessProfile),
    serviceSchemas: generateServiceSchema(websiteInfo)
  };
}

// Generate meta tags optimized for AI crawlers
export function generateAIOptimizedMetaTags(websiteInfo: WebsiteInfo): {
  title: string;
  description: string;
  keywords: string;
  ogTags: Record<string, string>;
} {
  const title = websiteInfo.previewData?.title || 
    `${websiteInfo.businessName} - ${websiteInfo.updateContent}`;
  
  const description = websiteInfo.previewData?.description || websiteInfo.updateContent || '';
  
  const keywords = [
    ...(websiteInfo.aiOptimization?.primaryKeywords || []),
    ...(websiteInfo.aiOptimization?.localSearchTerms || []),
    websiteInfo.businessType,
    websiteInfo.location
  ].join(', ');

  const ogTags = {
    'og:title': title,
    'og:description': description,
    'og:type': 'website',
    'og:site_name': websiteInfo.businessName,
    'og:locale': 'en_US'
  };

  return { title, description, keywords, ogTags };
}

// Generate structured data specifically for AI crawlers (server-side rendered)
export function generateAICrawlerOptimizedHTML(websiteInfo: WebsiteInfo, businessProfile?: any): string {
  const schemas = generateAllSchemas(websiteInfo, businessProfile);
  const metaTags = generateAIOptimizedMetaTags(websiteInfo);
  
  // Combine all schemas into script tags
  const schemaScripts = [
    schemas.mainSchema,
    schemas.faqSchema,
    schemas.organizationSchema,
    ...schemas.serviceSchemas
  ].filter(Boolean).map(schema => 
    `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`
  ).join('\n');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Essential Meta Tags for AI Crawlers -->
  <title>${metaTags.title}</title>
  <meta name="description" content="${metaTags.description}">
  <meta name="keywords" content="${metaTags.keywords}">
  
  <!-- Open Graph Tags -->
  ${Object.entries(metaTags.ogTags).map(([key, value]) => 
    `<meta property="${key}" content="${value}">`
  ).join('\n  ')}
  
  <!-- JSON-LD Structured Data for AI Understanding -->
  ${schemaScripts}
</head>
<body>
  <!-- AI-Optimized Content Structure -->
  <main>
    <article>
      <header>
        <h1>${websiteInfo.businessName} - ${websiteInfo.updateContent}</h1>
        ${websiteInfo.yearsInBusiness ? `<p class="experience-badge">${websiteInfo.yearsInBusiness} years serving ${websiteInfo.location}</p>` : ''}
      </header>

      <!-- Direct Answer Section (AI Crawler Priority) -->
      <section class="direct-answer">
        <h2>Quick Summary</h2>
        <p><strong>${websiteInfo.previewData?.description || websiteInfo.updateContent}</strong></p>
        ${websiteInfo.previewData?.highlights ? `
        <ul>
          ${websiteInfo.previewData.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
        </ul>` : ''}
      </section>

      ${websiteInfo.faqData?.length ? `
      <!-- FAQ Section (Critical for AI Discovery) -->
      <section class="faq-section">
        <h2>Frequently Asked Questions</h2>
        ${websiteInfo.faqData.map(faq => `
        <div class="faq-item">
          <h3>${faq.question}</h3>
          <p>${faq.answer}</p>
        </div>`).join('')}
      </section>` : ''}

      ${websiteInfo.businessAuthority?.awards?.length || websiteInfo.businessAuthority?.certifications?.length ? `
      <!-- Authority Signals Section -->
      <section class="authority-section">
        <h2>Awards & Credentials</h2>
        ${websiteInfo.businessAuthority.awards?.length ? `
        <div class="awards">
          <h3>Awards:</h3>
          <ul>
            ${websiteInfo.businessAuthority.awards.map(award => `<li>${award.name} - ${award.issuer} (${award.year})</li>`).join('')}
          </ul>
        </div>` : ''}
        
        ${websiteInfo.businessAuthority.certifications?.length ? `
        <div class="certifications">
          <h3>Certifications:</h3>
          <ul>
            ${websiteInfo.businessAuthority.certifications.map(cert => `<li>${cert.name} - ${cert.issuer}</li>`).join('')}
          </ul>
        </div>` : ''}
      </section>` : ''}

      ${websiteInfo.competitiveAdvantage?.uniqueSellingPoints?.length ? `
      <!-- Competitive Advantages Section -->
      <section class="competitive-section">
        <h2>Why Choose ${websiteInfo.businessName}?</h2>
        <ul>
          ${websiteInfo.competitiveAdvantage.uniqueSellingPoints.map(usp => `<li>${usp}</li>`).join('')}
        </ul>
      </section>` : ''}

      <!-- Business Information -->
      <section class="business-info">
        <h2>About ${websiteInfo.businessName}</h2>
        ${websiteInfo.businessStory ? `<p>${websiteInfo.businessStory}</p>` : ''}
        
        <!-- Contact Information -->
        <div class="contact-info">
          <h3>Contact Information</h3>
          <p><strong>Address:</strong> ${businessProfile?.address_street ? `${businessProfile.address_street}, ` : ''}${websiteInfo.location}</p>
          ${businessProfile?.phone ? `<p><strong>Phone:</strong> <a href="tel:${businessProfile.phone}">${businessProfile.phone}</a></p>` : ''}
          ${businessProfile?.website ? `<p><strong>Website:</strong> <a href="${businessProfile.website}">${businessProfile.website}</a></p>` : ''}
          ${businessProfile?.hours ? `<p><strong>Hours:</strong> ${businessProfile.hours}</p>` : ''}
        </div>
      </section>

      ${websiteInfo.customerTestimonials?.length ? `
      <!-- Customer Reviews Section -->
      <section class="reviews-section">
        <h2>Customer Reviews</h2>
        ${websiteInfo.customerTestimonials.map(testimonial => `
        <blockquote>
          <p>"${testimonial.testimonialText}"</p>
          <cite>- ${testimonial.customerName}${testimonial.customerLocation ? `, ${testimonial.customerLocation}` : ''}</cite>
          ${testimonial.rating ? `<p>Rating: ${testimonial.rating}/5 stars</p>` : ''}
        </blockquote>`).join('')}
      </section>` : ''}

      <!-- Call to Action -->
      <section class="cta-section">
        <h2>Get Started Today</h2>
        <p>Contact ${websiteInfo.businessName} for ${websiteInfo.updateContent?.toLowerCase()}</p>
        <div class="contact-methods">
          ${businessProfile?.phone ? `<p><strong>Call:</strong> <a href="tel:${businessProfile.phone}">${businessProfile.phone}</a></p>` : ''}
          ${businessProfile?.address_street ? `<p><strong>Visit:</strong> ${businessProfile.address_street}, ${websiteInfo.location}</p>` : ''}
          ${businessProfile?.website ? `<p><strong>Online:</strong> <a href="${businessProfile.website}">${businessProfile.website}</a></p>` : ''}
        </div>
      </section>
    </article>
  </main>
</body>
</html>`;
}