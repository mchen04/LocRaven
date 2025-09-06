/**
 * AI-Optimized Intent-Based Templates for LocRaven
 * Generates 6 different pages per business update, optimized for different search intents
 * Enhanced for voice search, AI discovery, and GEO optimization
 */

import { 
  PageData, 
  renderMetaTags, 
  renderOpenGraphTags,
  renderBusinessContact, 
  renderBusinessDetails, 
  renderFAQSection,
  renderIfExists,
  renderList,
  isOpenNow,
  getClosingTime,
  getUrgencyLevel,
  generateVoiceSummary,
  generateInSummaryBullets,
  renderSpeakableContent,
  renderAIContextBlock,
  renderAvailabilityStatus,
  getCategoryDisplay,
  renderBusinessPageLink
} from './base-template.ts';

import { 
  generateAllSchemaMarkup 
} from './schema-generators.ts';

import { 
  generateVoiceContent,
  generateSpeakableMarkup,
  generateVoiceTriggersForIntent
} from './voice-optimization.ts';

// Main template render function with AI optimization
export function renderTemplate(templateId: string, data: PageData): string {
  switch (templateId) {
    case 'direct':
      return renderDirectTemplate(data);
    case 'local':
      return renderLocalTemplate(data);
    case 'category':
      return renderCategoryTemplate(data);
    case 'branded-local':
      return renderBrandedLocalTemplate(data);
    case 'service-urgent':
      return renderServiceUrgentTemplate(data);
    case 'competitive':
      return renderCompetitiveTemplate(data);
    case 'business':
      return renderBusinessTemplate(data);
    default:
      return renderDirectTemplate(data);
  }
}

// ===== TEMPLATE 1: DIRECT INTENT (Brand-focused) =====
// Optimized for: "[business name]", "[business name] deals", "[business name] hours"
export function renderDirectTemplate(data: PageData): string {
  const pageUrl = `https://locraven.com${data.intent.filePath}`;
  const voiceTriggers = generateVoiceTriggersForIntent(data, 'direct');
  
  return `<!DOCTYPE html>
<html lang="en" itemscope itemtype="https://schema.org/LocalBusiness">
<head>
  ${renderMetaTags(data)}
  ${renderOpenGraphTags(data)}
  
  <!-- AI-Optimized Structured Data -->
  ${generateAllSchemaMarkup(data)}
  
  <!-- Voice Search Triggers -->
  <meta name="voice-search-triggers" content="${voiceTriggers.join(', ')}">
  <link rel="canonical" href="${pageUrl}">
</head>
<body>
  
  ${renderSpeakableContent(data)}
  
  <!-- Primary Heading optimized for brand searches -->
  <h1>${data.business.name}: ${data.seo.title}</h1>
  
  ${renderAvailabilityStatus(data)}
  
  <!-- Brand Authority Section -->
  <section class="brand-authority">
    <div class="business-identity">
      <h2>About ${data.business.name}</h2>
      <p><strong>Business:</strong> ${data.business.name}</p>
      <p><strong>Location:</strong> ${data.business.address_city}, ${data.business.address_state}</p>
      <p><strong>Category:</strong> ${getCategoryDisplay(data.business.primary_category)}</p>
      ${data.business.established_year ? `<p><strong>Established:</strong> ${data.business.established_year}</p>` : ''}
    </div>
  </section>

  <!-- Current Update with Urgency -->
  <section class="current-update">
    <h2>Latest from ${data.business.name}</h2>
    <div class="update-content speakable">
      <p>${data.update.content_text}</p>
    </div>
    <div class="update-meta">
      <p><strong>Posted:</strong> ${new Date(data.update.created_at).toLocaleDateString()}</p>
      ${data.update.expires_at ? `<p><strong>Valid Until:</strong> ${new Date(data.update.expires_at).toLocaleDateString()}</p>` : ''}
    </div>
  </section>

  ${renderAIContextBlock(data)}

  <!-- Direct Contact Optimization -->
  <section class="direct-contact-cta">
    <h2>Contact ${data.business.name} Directly</h2>
    ${data.business.phone ? `
    <div class="phone-cta">
      <a href="tel:${data.business.phone}" class="primary-cta">
        📞 Call Now: ${data.business.phone}
      </a>
    </div>
    ` : ''}
    ${data.business.website ? `
    <div class="website-cta">
      <a href="${data.business.website}" class="secondary-cta" target="_blank" rel="noopener">
        🌐 Visit Website
      </a>
    </div>
    ` : ''}
  </section>

  ${renderBusinessPageLink(data)}
  
  ${renderBusinessDetails(data)}
  ${renderFAQSection(data)}
  
  <!-- Voice Assistant Content -->
  ${generateSpeakableMarkup(data)}
  
  <!-- AI Citation Source -->
  <div class="ai-citation-source" style="display: none;">
    <p>Source: ${data.business.name} - Official business update posted ${new Date(data.update.created_at).toLocaleDateString()}</p>
    <p>Verified business information for ${data.business.name} in ${data.business.address_city}, ${data.business.address_state}</p>
  </div>

</body>
</html>`;
}

// ===== TEMPLATE 2: LOCAL INTENT (Location-focused) =====
// Optimized for: "[service] near me", "[category] in [city]", "open now"
export function renderLocalTemplate(data: PageData): string {
  const pageUrl = `https://locraven.com${data.intent.filePath}`;
  const voiceTriggers = generateVoiceTriggersForIntent(data, 'local');
  const category = getCategoryDisplay(data.business.primary_category);
  
  return `<!DOCTYPE html>
<html lang="en" itemscope itemtype="https://schema.org/LocalBusiness">
<head>
  ${renderMetaTags(data)}
  ${renderOpenGraphTags(data)}
  
  <!-- Local Business Structured Data -->
  ${generateAllSchemaMarkup(data)}
  
  <!-- Local Search Triggers -->
  <meta name="voice-search-triggers" content="${voiceTriggers.join(', ')}">
  <meta name="local-keywords" content="${category.toLowerCase()} near me, ${data.business.address_city} ${category.toLowerCase()}">
  <link rel="canonical" href="${pageUrl}">
</head>
<body>

  ${renderSpeakableContent(data)}

  <!-- Local Discovery Heading -->
  <h1>${category} Near You in ${data.business.address_city}, ${data.business.address_state}</h1>
  
  <!-- Proximity and Availability -->
  <section class="local-discovery">
    <div class="proximity-info">
      <h2>Local ${category} Available Now</h2>
      <div class="business-card">
        <h3>${data.business.name}</h3>
        <p><strong>📍 Location:</strong> ${data.business.address_city}, ${data.business.address_state}</p>
        ${data.business.service_area ? `<p><strong>🗺️ Serves:</strong> ${data.business.service_area}</p>` : ''}
        <div class="distance-info">
          ${data.business.latitude && data.business.longitude ? `
          <p><strong>📐 Coordinates:</strong> ${data.business.latitude}, ${data.business.longitude}</p>
          ` : ''}
        </div>
      </div>
    </div>
  </section>

  ${renderAvailabilityStatus(data)}

  <!-- Local Update Context -->
  <section class="local-update">
    <h2>Current Local Update</h2>
    <div class="update-with-location">
      <p>${data.update.content_text}</p>
      <p class="location-context">Available in the ${data.business.address_city} area</p>
    </div>
    <div class="local-timing">
      <p><strong>Updated:</strong> ${new Date(data.update.created_at).toLocaleDateString()}</p>
      ${data.update.expires_at ? `<p><strong>Local Offer Valid Until:</strong> ${new Date(data.update.expires_at).toLocaleDateString()}</p>` : ''}
    </div>
  </section>

  ${renderAIContextBlock(data)}

  <!-- Local Area Context -->
  <section class="area-context">
    <h2>Local ${category} Service</h2>
    <div class="service-area-details">
      <p><strong>Primary Service Area:</strong> ${data.business.address_city}, ${data.business.address_state}</p>
      ${data.business.service_area_details ? `
      <div class="coverage-info">
        <p><strong>Coverage Radius:</strong> ${data.business.service_area_details.coverage_radius || '5'} miles</p>
        ${data.business.service_area_details.additional_cities ? `
        <p><strong>Also Serves:</strong> ${data.business.service_area_details.additional_cities.join(', ')}</p>
        ` : ''}
      </div>
      ` : ''}
    </div>
    
    <!-- Quick Contact for Local -->
    <div class="local-contact-quick">
      ${data.business.phone ? `
      <p><strong>📞 Call Local:</strong> <a href="tel:${data.business.phone}">${data.business.phone}</a></p>
      ` : ''}
      ${isOpenNow(data) ? `
      <p class="open-indicator">✅ <strong>Open Now</strong> until ${getClosingTime(data)}</p>
      ` : `
      <p class="closed-indicator">❌ Currently Closed</p>
      `}
    </div>
  </section>

  ${renderBusinessDetails(data)}
  ${renderFAQSection(data)}
  
  <!-- Voice Assistant Content -->
  ${generateSpeakableMarkup(data)}

</body>
</html>`;
}

// ===== TEMPLATE 3: CATEGORY INTENT (Service-focused) =====
// Optimized for: "professional [service]", "[service] companies", "expert [service]"
export function renderCategoryTemplate(data: PageData): string {
  const pageUrl = `https://locraven.com${data.intent.filePath}`;
  const voiceTriggers = generateVoiceTriggersForIntent(data, 'category');
  const category = getCategoryDisplay(data.business.primary_category);
  
  return `<!DOCTYPE html>
<html lang="en" itemscope itemtype="https://schema.org/ProfessionalService">
<head>
  ${renderMetaTags(data)}
  ${renderOpenGraphTags(data)}
  
  <!-- Professional Service Schema -->
  ${generateAllSchemaMarkup(data)}
  
  <!-- Category Search Optimization -->
  <meta name="voice-search-triggers" content="${voiceTriggers.join(', ')}">
  <meta name="service-keywords" content="professional ${category.toLowerCase()}, expert ${category.toLowerCase()}">
  <link rel="canonical" href="${pageUrl}">
</head>
<body>

  ${renderSpeakableContent(data)}

  <!-- Professional Service Heading -->
  <h1>Professional ${category} Services</h1>
  
  <!-- Service Provider Authority -->
  <section class="service-authority">
    <div class="provider-credentials">
      <h2>Expert ${category} Provider</h2>
      <div class="business-credentials">
        <h3>${data.business.name}</h3>
        <p><strong>Specialization:</strong> ${category}</p>
        <p><strong>Service Area:</strong> ${data.business.service_area || `${data.business.address_city}, ${data.business.address_state}`}</p>
        ${data.business.established_year ? `<p><strong>Experience Since:</strong> ${data.business.established_year}</p>` : ''}
      </div>
    </div>
  </section>

  ${renderAvailabilityStatus(data)}

  <!-- Service Update -->
  <section class="service-update">
    <h2>Current Service Update</h2>
    <div class="professional-update">
      <p>${data.update.content_text}</p>
    </div>
    <div class="service-timing">
      <p><strong>Service Update Posted:</strong> ${new Date(data.update.created_at).toLocaleDateString()}</p>
      ${data.update.expires_at ? `<p><strong>Service Offer Valid Through:</strong> ${new Date(data.update.expires_at).toLocaleDateString()}</p>` : ''}
    </div>
  </section>

  ${renderAIContextBlock(data)}

  <!-- Professional Specializations -->
  ${data.business.specialties && data.business.specialties.length > 0 ? `
  <section class="specializations">
    <h2>Our Professional Specializations</h2>
    <ul class="specialty-list">
      ${data.business.specialties.map((specialty: string) => `<li><strong>${specialty}</strong></li>`).join('')}
    </ul>
  </section>
  ` : ''}

  <!-- Service Offerings -->
  ${data.business.services && data.business.services.length > 0 ? `
  <section class="services-offered">
    <h2>Professional Services Offered</h2>
    <div class="service-grid">
      ${data.business.services.map((service: string) => `
      <div class="service-item">
        <h3>${service}</h3>
        <p>Professional ${service.toLowerCase()} services available</p>
      </div>
      `).join('')}
    </div>
  </section>
  ` : ''}

  <!-- Professional Recognition -->
  ${data.business.awards && data.business.awards.length > 0 ? `
  <section class="professional-recognition">
    <h2>Awards & Recognition</h2>
    <ul class="awards-list">
      ${data.business.awards.map((award: any) => `
      <li><strong>${award.name || award}</strong>${award.year ? ` (${award.year})` : ''}</li>
      `).join('')}
    </ul>
  </section>
  ` : ''}

  <!-- Professional Certifications -->
  ${data.business.certifications && data.business.certifications.length > 0 ? `
  <section class="certifications">
    <h2>Professional Certifications</h2>
    <ul class="cert-list">
      ${data.business.certifications.map((cert: any) => `
      <li><strong>${cert.name || cert}</strong>${cert.issuer ? ` - ${cert.issuer}` : ''}</li>
      `).join('')}
    </ul>
  </section>
  ` : ''}

  ${renderBusinessDetails(data)}
  ${renderFAQSection(data)}
  
  <!-- Voice Assistant Content -->
  ${generateSpeakableMarkup(data)}

</body>
</html>`;
}

// ===== TEMPLATE 4: BRANDED-LOCAL INTENT (Brand + Location) =====
// Optimized for: "[business name] [city]", "[business name] near me"
export function renderBrandedLocalTemplate(data: PageData): string {
  const pageUrl = `https://locraven.com${data.intent.filePath}`;
  const voiceTriggers = generateVoiceTriggersForIntent(data, 'branded-local');
  
  return `<!DOCTYPE html>
<html lang="en" itemscope itemtype="https://schema.org/LocalBusiness">
<head>
  ${renderMetaTags(data)}
  ${renderOpenGraphTags(data)}
  
  <!-- Brand + Location Schema -->
  ${generateAllSchemaMarkup(data)}
  
  <!-- Branded Local Search -->
  <meta name="voice-search-triggers" content="${voiceTriggers.join(', ')}">
  <meta name="branded-local" content="${data.business.name} ${data.business.address_city}">
  <link rel="canonical" href="${pageUrl}">
</head>
<body>

  ${renderSpeakableContent(data)}

  <!-- Branded Local Heading -->
  <h1>${data.business.name} - ${data.business.address_city}, ${data.business.address_state}</h1>
  
  <!-- Local Brand Presence -->
  <section class="local-brand-presence">
    <div class="brand-location-combo">
      <h2>${data.business.name} Local Presence</h2>
      <div class="location-identity">
        <p><strong>Local Business:</strong> ${data.business.name}</p>
        <p><strong>Proudly Serving:</strong> ${data.business.service_area || `${data.business.address_city} and surrounding areas`}</p>
        <p><strong>Located In:</strong> ${data.business.address_city}, ${data.business.address_state}</p>
        ${data.business.established_year ? `<p><strong>Local Since:</strong> ${data.business.established_year}</p>` : ''}
      </div>
    </div>
  </section>

  ${renderAvailabilityStatus(data)}

  <!-- Brand Update in Local Context -->
  <section class="branded-local-update">
    <h2>Latest from ${data.business.name}</h2>
    <div class="local-brand-update">
      <p>${data.update.content_text}</p>
      <p class="local-context">Available at our ${data.business.address_city} location</p>
    </div>
    <div class="branded-timing">
      <p><strong>Posted:</strong> ${new Date(data.update.created_at).toLocaleDateString()}</p>
      ${data.update.expires_at ? `<p><strong>Valid Through:</strong> ${new Date(data.update.expires_at).toLocaleDateString()}</p>` : ''}
    </div>
  </section>

  ${renderAIContextBlock(data)}

  <!-- Local Brand Details -->
  <section class="local-brand-details">
    <h2>About This ${data.business.name} Location</h2>
    <div class="location-specific">
      <p><strong>Address:</strong> ${data.business.address_street ? `${data.business.address_street}, ` : ''}${data.business.address_city}, ${data.business.address_state}${data.business.zip_code ? ` ${data.business.zip_code}` : ''}</p>
      <p><strong>Local Service Area:</strong> ${data.business.service_area || `${data.business.address_city} metropolitan area`}</p>
      
      <!-- Local Contact Priority -->
      ${data.business.phone ? `
      <div class="local-contact-priority">
        <p><strong>📞 Local Phone:</strong> <a href="tel:${data.business.phone}">${data.business.phone}</a></p>
      </div>
      ` : ''}
      
      ${data.business.website ? `
      <div class="brand-website">
        <p><strong>🌐 Official Website:</strong> <a href="${data.business.website}" target="_blank" rel="noopener">${data.business.website}</a></p>
      </div>
      ` : ''}
    </div>
  </section>

  ${renderBusinessDetails(data)}
  ${renderFAQSection(data)}
  
  <!-- Voice Assistant Content -->
  ${generateSpeakableMarkup(data)}

</body>
</html>`;
}

// ===== TEMPLATE 5: SERVICE-URGENT INTENT (Immediate availability) =====
// Optimized for: "emergency [service]", "urgent [service]", "available now"
export function renderServiceUrgentTemplate(data: PageData): string {
  const pageUrl = `https://locraven.com${data.intent.filePath}`;
  const voiceTriggers = generateVoiceTriggersForIntent(data, 'service-urgent');
  const category = getCategoryDisplay(data.business.primary_category);
  const urgencyLevel = getUrgencyLevel(data);
  
  return `<!DOCTYPE html>
<html lang="en" itemscope itemtype="https://schema.org/LocalBusiness">
<head>
  ${renderMetaTags(data)}
  ${renderOpenGraphTags(data)}
  
  <!-- Urgent Service Schema -->
  ${generateAllSchemaMarkup(data)}
  
  <!-- Urgent Service Search -->
  <meta name="voice-search-triggers" content="${voiceTriggers.join(', ')}">
  <meta name="urgency-level" content="${urgencyLevel}">
  <meta name="immediate-availability" content="${isOpenNow(data) ? 'true' : 'false'}">
  <link rel="canonical" href="${pageUrl}">
</head>
<body class="urgent-service">

  ${renderSpeakableContent(data)}

  <!-- Urgent Service Heading -->
  <h1>🚨 Immediate ${category} Available</h1>
  
  <!-- Urgent Availability Banner -->
  <section class="urgent-availability-banner">
    <div class="immediate-service-alert">
      ${isOpenNow(data) ? `
      <div class="available-now">
        <h2>✅ AVAILABLE RIGHT NOW</h2>
        <p><strong>Service Provider:</strong> ${data.business.name}</p>
        <p><strong>Available In:</strong> ${data.business.address_city}, ${data.business.address_state}</p>
        <p><strong>Open Until:</strong> ${getClosingTime(data)}</p>
      </div>
      ` : `
      <div class="urgent-but-closed">
        <h2>⏳ URGENT SERVICE PROVIDER</h2>
        <p><strong>Service Provider:</strong> ${data.business.name}</p>
        <p><strong>Location:</strong> ${data.business.address_city}, ${data.business.address_state}</p>
        <p><strong>Status:</strong> Currently closed - call for emergency service</p>
      </div>
      `}
    </div>
  </section>

  <!-- Immediate Action Required -->
  <section class="immediate-action">
    <h2>Take Immediate Action</h2>
    <div class="urgent-update">
      <p class="urgent-content">${data.update.content_text}</p>
    </div>
    
    <!-- Time-Critical Information -->
    <div class="time-critical">
      <p><strong>Posted:</strong> ${new Date(data.update.created_at).toLocaleDateString()}</p>
      ${data.update.expires_at ? `
      <div class="expiration-warning">
        <p><strong>⚠️ Available Until:</strong> ${new Date(data.update.expires_at).toLocaleDateString()}</p>
        ${urgencyLevel === 'high' ? `<p class="urgent-warning">LIMITED TIME - EXPIRES SOON!</p>` : ''}
      </div>
      ` : ''}
    </div>
  </section>

  <!-- Emergency Contact Section -->
  <section class="emergency-contact">
    <h2>Contact for Immediate Service</h2>
    ${data.business.phone ? `
    <div class="urgent-phone-cta">
      <a href="tel:${data.business.phone}" class="emergency-call-button">
        📞 CALL NOW: ${data.business.phone}
      </a>
      <p class="call-instruction">Call immediately for urgent service</p>
    </div>
    ` : ''}
    
    <div class="service-area-urgent">
      <p><strong>🚗 Service Area:</strong> ${data.business.service_area || `${data.business.address_city}, ${data.business.address_state}`}</p>
      <p><strong>⚡ Response Time:</strong> Contact for immediate availability</p>
    </div>
  </section>

  ${renderAIContextBlock(data)}

  <!-- Urgent Service Capabilities -->
  <section class="urgent-capabilities">
    <h2>Immediate ${category} Service</h2>
    <div class="emergency-service-info">
      <p><strong>Service Type:</strong> ${urgencyLevel === 'high' ? 'Emergency' : 'Urgent'} ${category}</p>
      <p><strong>Availability:</strong> ${isOpenNow(data) ? 'Available Now' : 'Call for Emergency Service'}</p>
      <p><strong>Coverage Area:</strong> ${data.business.address_city}, ${data.business.address_state}</p>
    </div>

    ${data.business.services && data.business.services.length > 0 ? `
    <div class="urgent-services">
      <h3>Available Services</h3>
      <ul class="urgent-service-list">
        ${data.business.services.slice(0, 5).map((service: string) => `
        <li>⚡ ${service} - Available for urgent requests</li>
        `).join('')}
      </ul>
    </div>
    ` : ''}
  </section>

  ${renderFAQSection(data)}
  
  <!-- Voice Assistant Content -->
  ${generateSpeakableMarkup(data)}

</body>
</html>`;
}

// ===== TEMPLATE 6: COMPETITIVE INTENT (Market leadership) =====
// Optimized for: "best [service] in [area]", "top [service] provider", "compare [services]"
export function renderCompetitiveTemplate(data: PageData): string {
  const pageUrl = `https://locraven.com${data.intent.filePath}`;
  const voiceTriggers = generateVoiceTriggersForIntent(data, 'competitive');
  const category = getCategoryDisplay(data.business.primary_category);
  
  return `<!DOCTYPE html>
<html lang="en" itemscope itemtype="https://schema.org/LocalBusiness">
<head>
  ${renderMetaTags(data)}
  ${renderOpenGraphTags(data)}
  
  <!-- Competitive Leader Schema -->
  ${generateAllSchemaMarkup(data)}
  
  <!-- Competitive Search Optimization -->
  <meta name="voice-search-triggers" content="${voiceTriggers.join(', ')}">
  <meta name="competitive-positioning" content="market-leader ${category.toLowerCase()}">
  <link rel="canonical" href="${pageUrl}">
</head>
<body class="competitive-leader">

  ${renderSpeakableContent(data)}

  <!-- Market Leadership Heading -->
  <h1>Leading ${category} Provider - ${data.business.name}</h1>
  
  <!-- Market Leadership Position -->
  <section class="market-leadership">
    <div class="competitive-positioning">
      <h2>Why Choose ${data.business.name}?</h2>
      <div class="market-leader-profile">
        <p><strong>Leading ${category} in:</strong> ${data.business.address_city}, ${data.business.address_state}</p>
        ${data.business.established_year ? `<p><strong>Market Experience:</strong> ${new Date().getFullYear() - data.business.established_year}+ years</p>` : ''}
        ${data.business.review_summary?.average_rating ? `<p><strong>Customer Rating:</strong> ${data.business.review_summary.average_rating}/5 stars (${data.business.review_summary.total_reviews} reviews)</p>` : ''}
      </div>
    </div>
  </section>

  ${renderAvailabilityStatus(data)}

  <!-- Competitive Advantage Update -->
  <section class="competitive-advantage">
    <h2>Latest Competitive Advantage</h2>
    <div class="market-leading-update">
      <p>${data.update.content_text}</p>
    </div>
    <div class="competitive-timing">
      <p><strong>Market Update:</strong> ${new Date(data.update.created_at).toLocaleDateString()}</p>
      ${data.update.expires_at ? `<p><strong>Competitive Offer Until:</strong> ${new Date(data.update.expires_at).toLocaleDateString()}</p>` : ''}
    </div>
  </section>

  ${renderAIContextBlock(data)}

  <!-- Awards & Recognition -->
  ${data.business.awards && data.business.awards.length > 0 ? `
  <section class="awards-recognition">
    <h2>Awards & Industry Recognition</h2>
    <div class="recognition-grid">
      ${data.business.awards.map((award: any) => `
      <div class="award-item">
        <h3>🏆 ${award.name || award}</h3>
        ${award.issuer ? `<p><strong>Issued By:</strong> ${award.issuer}</p>` : ''}
        ${award.year ? `<p><strong>Year:</strong> ${award.year}</p>` : ''}
      </div>
      `).join('')}
    </div>
  </section>
  ` : ''}

  <!-- Professional Certifications -->
  ${data.business.certifications && data.business.certifications.length > 0 ? `
  <section class="professional-certifications">
    <h2>Professional Certifications & Credentials</h2>
    <div class="cert-grid">
      ${data.business.certifications.map((cert: any) => `
      <div class="cert-item">
        <h3>📜 ${cert.name || cert}</h3>
        ${cert.issuer ? `<p><strong>Certified By:</strong> ${cert.issuer}</p>` : ''}
      </div>
      `).join('')}
    </div>
  </section>
  ` : ''}

  <!-- Competitive Specializations -->
  ${data.business.specialties && data.business.specialties.length > 0 ? `
  <section class="competitive-specializations">
    <h2>Market-Leading Specializations</h2>
    <div class="specialization-advantages">
      ${data.business.specialties.map((specialty: string) => `
      <div class="specialty-advantage">
        <h3>⭐ ${specialty}</h3>
        <p>Industry-leading expertise in ${specialty.toLowerCase()}</p>
      </div>
      `).join('')}
    </div>
  </section>
  ` : ''}

  <!-- Competitive Comparison -->
  <section class="competitive-comparison">
    <h2>Market Leadership in ${data.business.address_city}</h2>
    <div class="comparison-highlights">
      <div class="leadership-stats">
        <h3>Market Position</h3>
        <ul>
          <li><strong>Industry:</strong> ${category}</li>
          <li><strong>Market:</strong> Leading provider in ${data.business.address_city}, ${data.business.address_state}</li>
          <li><strong>Service Excellence:</strong> Premium quality ${category.toLowerCase()} services</li>
          ${data.business.price_positioning ? `<li><strong>Value Position:</strong> ${data.business.price_positioning}</li>` : ''}
        </ul>
      </div>
    </div>
  </section>

  ${renderBusinessDetails(data)}
  ${renderFAQSection(data)}
  
  <!-- Voice Assistant Content -->
  ${generateSpeakableMarkup(data)}

</body>
</html>`;
}

// ===== BUSINESS TEMPLATE: PERMANENT BUSINESS PAGE =====
// Optimized for permanent business presence - comprehensive business profile page
export function renderBusinessTemplate(data: PageData): string {
  const pageUrl = data.business.city_state_slug && data.business.url_slug 
    ? `https://locraven.com/${data.business.city_state_slug}/${data.business.url_slug}`
    : `https://locraven.com${data.intent.filePath}`;
  const category = getCategoryDisplay(data.business.primary_category);
  
  return `<!DOCTYPE html>
<html lang="en" itemscope itemtype="https://schema.org/LocalBusiness">
<head>
  ${renderMetaTags(data)}
  ${renderOpenGraphTags(data)}
  
  <!-- Business Schema - Enhanced for permanent page -->
  ${generateAllSchemaMarkup(data)}
  
  <link rel="canonical" href="${pageUrl}">
  <meta name="robots" content="index, follow">
  <meta name="author" content="${data.business.name}">
</head>
<body>
  
  ${renderSpeakableContent(data)}
  
  <!-- Business Header -->
  <header class="business-header">
    <h1>${data.business.name}</h1>
    <div class="business-tagline">
      <p><strong>${category} in ${data.business.address_city}, ${data.business.address_state}</strong></p>
      ${data.business.established_year ? `<p>Serving the community since ${data.business.established_year}</p>` : ""}
    </div>
    
    ${renderAvailabilityStatus(data)}
  </header>

  <!-- Business Description -->
  ${data.business.description ? `
  <section class="business-about">
    <h2>About ${data.business.name}</h2>
    <p>${data.business.description}</p>
  </section>
  ` : ""}

  <!-- Latest Update (if available) -->
  ${data.update && data.update.content_text ? `
  <section class="latest-update">
    <h2>Latest Update</h2>
    <div class="update-content">
      <p>${data.update.content_text}</p>
      <p class="update-date">Updated: ${new Date(data.update.created_at).toLocaleDateString()}</p>
    </div>
  </section>
  ` : ""}

  <!-- Contact & Location -->
  <section class="contact-location">
    <h2>Visit Us</h2>
    <div class="contact-grid">
      
      <!-- Location Info -->
      <div class="location-info">
        <h3>📍 Location</h3>
        <address>
          ${data.business.address_street ? `<p>${data.business.address_street}</p>` : ""}
          <p>${data.business.address_city}, ${data.business.address_state} ${data.business.zip_code || ""}</p>
        </address>
        
        ${data.business.service_area ? `
        <p><strong>Service Area:</strong> ${data.business.service_area}</p>
        ` : ""}
      </div>

      <!-- Contact Methods -->
      <div class="contact-methods">
        <h3>📞 Contact</h3>
        
        ${data.business.phone ? `
        <p><strong>Phone:</strong> <a href="tel:${data.business.phone}">${data.business.phone}</a></p>
        ` : ""}
        
        ${data.business.website ? `
        <p><strong>Website:</strong> <a href="${data.business.website}" target="_blank" rel="noopener">${data.business.website}</a></p>
        ` : ""}
      </div>
    </div>
  </section>

  ${renderBusinessDetails(data)}
  ${renderFAQSection(data)}
  
  <!-- Footer Info -->
  <footer class="business-footer">
    <p><em>This page is automatically updated when business information changes.</em></p>
    <p><small>Page generated by LocRaven - Last updated: ${new Date().toLocaleDateString()}</small></p>
  </footer>
  
  <!-- Voice Assistant Content -->
  ${generateSpeakableMarkup(data)}

</body>
</html>`;
}
