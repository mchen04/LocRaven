/**
 * AI-Optimized Base Template System for LocRaven Pages
 * Enhanced for voice search, AI discovery, and GEO optimization
 */

export interface PageData {
  business: {
    name: string;
    address_city: string;
    address_state: string;
    address_street?: string;
    zip_code?: string;
    country?: string;
    phone?: string;
    phone_country_code?: string;
    email?: string;
    website?: string;
    description?: string;
    services?: string[];
    specialties?: string[];
    hours?: string;
    structured_hours?: any;
    price_positioning?: string;
    payment_methods?: string[];
    primary_category: string;
    service_area?: string;
    service_area_details?: any;
    awards?: any[];
    certifications?: any[];
    latitude?: number;
    longitude?: number;
    languages_spoken?: string[];
    accessibility_features?: string[];
    parking_info?: string;
    enhanced_parking_info?: any;
    review_summary?: any;
    status_override?: string;
    business_faqs?: any[];
    featured_items?: any[];
    social_media?: any;
    established_year?: number;
  };
  update: {
    content_text: string;
    created_at: string;
    expires_at?: string;
    special_hours_today?: any;
    deal_terms?: string;
    update_category?: string;
    update_faqs?: any[];
  };
  seo: {
    title: string;
    description: string;
  };
  intent: {
    type: 'direct' | 'local' | 'category' | 'branded-local' | 'service-urgent' | 'competitive';
    filePath: string;
    slug: string;
    pageVariant: string;
  };
  faqs?: Array<{
    question: string;
    answer: string;
    category: string;
    voiceSearchTriggers: string[];
  }>;
}

// Template rendering will be handled by intent-templates.ts
export function renderTemplate(templateId: string, data: PageData): string {
  // This will be implemented in intent-templates.ts to avoid circular imports
  throw new Error('Use renderTemplate from intent-templates.ts');
}

// ===== AI OPTIMIZATION HELPERS =====

// Real-time status calculations
export function isOpenNow(data: PageData): boolean {
  if (data.business.status_override === 'temporarily_closed' || 
      data.business.status_override === 'closed_emergency') {
    return false;
  }
  
  // Use structured_hours if available, fallback to basic hours parsing
  if (data.business.structured_hours) {
    const now = new Date();
    const dayName = now.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase(); // mon, tue, wed, etc.
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const todayHours = data.business.structured_hours[dayName];
    if (todayHours && todayHours.open && todayHours.close) {
      const [openHour, openMin] = todayHours.open.split(':').map(Number);
      const [closeHour, closeMin] = todayHours.close.split(':').map(Number);
      const openTime = openHour * 60 + openMin;
      const closeTime = closeHour * 60 + closeMin;
      return currentTime >= openTime && currentTime <= closeTime;
    }
  }
  
  // Fallback: assume open during business hours if no specific info
  return true;
}

export function getClosingTime(data: PageData): string {
  if (data.business.structured_hours) {
    const now = new Date();
    const dayName = now.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
    const todayHours = data.business.structured_hours[dayName];
    if (todayHours && todayHours.close) {
      return todayHours.close;
    }
  }
  return '10:00 PM'; // Default fallback
}

export function getUrgencyLevel(data: PageData): 'high' | 'medium' | 'low' {
  if (data.update.expires_at) {
    const expiresAt = new Date(data.update.expires_at);
    const now = new Date();
    const hoursUntilExpiration = (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilExpiration <= 6) return 'high';
    if (hoursUntilExpiration <= 24) return 'medium';
  }
  return 'low';
}

// Voice search optimization
export function generateVoiceSummary(data: PageData, maxWords: number = 40): string {
  const words = [
    data.business.name,
    isOpenNow(data) ? 'is open now' : 'is currently closed',
    'in',
    data.business.address_city,
    data.business.address_state
  ];
  
  if (data.update.content_text.length < 100) {
    words.push('-', data.update.content_text);
  }
  
  if (data.business.phone) {
    words.push('Call', data.business.phone);
  }
  
  const summary = words.join(' ');
  const wordCount = summary.split(' ').length;
  
  if (wordCount > maxWords) {
    return summary.split(' ').slice(0, maxWords).join(' ') + '...';
  }
  
  return summary;
}

// Distance and proximity helpers
export function formatDistance(meters: number): string {
  const miles = meters * 0.000621371;
  if (miles < 0.1) return 'Less than 0.1 miles';
  if (miles < 1) return `${miles.toFixed(1)} miles`;
  return `${Math.round(miles)} miles`;
}

export function getWalkingTime(meters: number): string {
  const minutes = Math.ceil(meters / 80); // Average walking speed
  if (minutes === 1) return '1 minute walk';
  return `${minutes} minute walk`;
}

// AI-friendly content structuring
export function generateInSummaryBullets(data: PageData): string[] {
  const bullets = [];
  
  bullets.push(`What: ${data.update.content_text.substring(0, 100)}`);
  bullets.push(`Who: ${data.business.name}`);
  bullets.push(`Where: ${data.business.address_city}, ${data.business.address_state}`);
  
  if (data.business.phone) {
    bullets.push(`Contact: ${data.business.phone}`);
  }
  
  if (data.update.expires_at) {
    const expireDate = new Date(data.update.expires_at).toLocaleDateString();
    bullets.push(`Valid Until: ${expireDate}`);
  }
  
  const urgency = getUrgencyLevel(data);
  if (urgency === 'high') {
    bullets.push('⚠️ Limited Time Offer');
  }
  
  return bullets;
}

// Helper functions for conditional rendering
export function renderIf(condition: boolean, content: string): string {
  return condition ? content : '';
}

export function renderIfExists(value: any, content: string): string {
  return value ? content : '';
}

export function renderList(items: string[] | undefined, wrapper: (items: string[]) => string): string {
  return items && items.length > 0 ? wrapper(items) : '';
}

// Common template sections
export function renderMetaTags(data: PageData): string {
  const coordinates = data.business.latitude && data.business.longitude 
    ? `<meta name="geo.position" content="${data.business.latitude};${data.business.longitude}">
<meta name="ICBM" content="${data.business.latitude}, ${data.business.longitude}">`
    : '';

  return `<meta charset="UTF-8">
<title>${data.seo.title}</title>
<meta name="description" content="${data.seo.description}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<meta name="googlebot" content="index, follow, max-video-preview:-1, max-snippet:-1">
<meta name="bingbot" content="index, follow">
<meta name="geo.region" content="US-${data.business.address_state}">
<meta name="geo.placename" content="${data.business.address_city}">
${coordinates}
<meta name="article:published_time" content="${data.update.created_at}">
<meta name="page-intent" content="${data.intent.type}">
<meta name="ai-content-type" content="local-business-update">
<meta name="voice-search-optimized" content="true">
<meta name="search-optimization" content="ai-powered-${data.intent.type}">
<meta name="content-variant" content="${data.intent.type}-optimized">
<meta name="local-business-category" content="${data.business.primary_category}">
${data.business.languages_spoken?.length ? `<meta name="languages-spoken" content="${data.business.languages_spoken.join(', ')}">` : ''}
${isOpenNow(data) ? '<meta name="business-status" content="open-now">' : '<meta name="business-status" content="closed">'}`;
}

export function renderOpenGraphTags(data: PageData): string {
  const pageUrl = `https://locraven.com/business/${data.intent.slug}`;
  const businessImage = `https://locraven.com/api/og-image?business=${encodeURIComponent(data.business.name)}&location=${encodeURIComponent(data.business.address_city)}`;
  
  return `<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:title" content="${data.seo.title}">
<meta property="og:description" content="${data.seo.description}">
<meta property="og:url" content="${pageUrl}">
<meta property="og:image" content="${businessImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${data.business.name} - ${data.business.address_city}, ${data.business.address_state}">
<meta property="og:site_name" content="LocRaven">
<meta property="og:locale" content="en_US">
<meta property="business:contact_data:locality" content="${data.business.address_city}">
<meta property="business:contact_data:region" content="${data.business.address_state}">
<meta property="business:contact_data:country_name" content="${data.business.country || 'United States'}">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${data.seo.title}">
<meta name="twitter:description" content="${data.seo.description}">
<meta name="twitter:image" content="${businessImage}">
<meta name="twitter:site" content="@LocRaven">

<!-- Canonical URL -->
<link rel="canonical" href="${pageUrl}">`;
}

export function renderBusinessContact(data: PageData): string {
  return `<h2>Business Contact</h2>
${renderIfExists(data.business.phone, `<p>Phone: ${data.business.phone}</p>`)}
${renderIfExists(data.business.address_street, `<p>Address: ${data.business.address_street} ${data.business.address_city}, ${data.business.address_state} ${data.business.zip_code || ''}</p>`)}
${renderIfExists(data.business.email, `<p>Email: ${data.business.email}</p>`)}
${renderIfExists(data.business.website, `<p>Website: ${data.business.website}</p>`)}`;
}

export function renderBusinessDetails(data: PageData): string {
  return `<h2>Business Details</h2>
${renderIfExists(data.business.description, `<p>Description: ${data.business.description}</p>`)}
${renderList(data.business.services, (services) => `<p>Services: ${services.join(', ')}</p>`)}
${renderList(data.business.specialties, (specialties) => `<p>Specialties: ${specialties.join(', ')}</p>`)}
${renderIfExists(data.business.hours, `<p>Hours: ${data.business.hours}</p>`)}
${renderIfExists(data.business.price_positioning, `<p>Price Range: ${data.business.price_positioning}</p>`)}`;
}

export function renderFAQSection(data: PageData): string {
  // Combine business FAQs and update FAQs
  const allFaqs = [
    ...(data.business.business_faqs || []),
    ...(data.update.update_faqs || []),
    ...(data.faqs || [])
  ].filter(Boolean);

  if (allFaqs.length === 0) return '';

  const faqHTML = allFaqs.map(faq => `
    <div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
      <h3 itemprop="name">${faq.question}</h3>
      <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
        <p itemprop="text">${faq.answer}</p>
      </div>
      ${faq.voiceSearchTriggers ? `<meta name="voice-triggers" content="${faq.voiceSearchTriggers.join(', ')}">` : ''}
    </div>
  `).join('');

  return `
    <section class="ai-optimized-faq" itemscope itemtype="https://schema.org/FAQPage">
      <h2>Frequently Asked Questions</h2>
      <div class="voice-summary" aria-label="Quick FAQ Summary">
        <p>Common questions about ${data.business.name} in ${data.business.address_city}. ${allFaqs.length} frequently asked questions answered.</p>
      </div>
      ${faqHTML}
    </section>
  `;
}

// ===== ADDITIONAL AI OPTIMIZATION HELPERS =====

// Generate speakable content blocks
export function renderSpeakableContent(data: PageData): string {
  const voiceSummary = generateVoiceSummary(data);
  const urgencyLevel = getUrgencyLevel(data);
  const openStatus = isOpenNow(data) ? 'open now' : 'currently closed';

  return `
    <!-- Voice Assistant Optimized Content -->
    <div class="voice-summary speakable" id="voice-summary" aria-label="Voice Assistant Summary">
      <p>${voiceSummary}</p>
    </div>
    
    <div class="quick-answer speakable" id="quick-answer">
      <p>${data.business.name} is ${openStatus} in ${data.business.address_city}, ${data.business.address_state}. ${data.update.content_text.substring(0, 80)}...</p>
    </div>

    ${urgencyLevel === 'high' ? `
    <div class="urgent-info speakable" id="urgent-info">
      <p>Time sensitive: This offer expires soon. ${data.business.phone ? `Call ${data.business.phone} now.` : 'Contact immediately.'}</p>
    </div>
    ` : ''}
  `;
}

// Generate AI context block for LLM parsing
export function renderAIContextBlock(data: PageData): string {
  const bullets = generateInSummaryBullets(data);
  const keywords = [
    data.business.name,
    data.business.address_city,
    data.business.primary_category,
    ...(data.business.services || []),
    ...(data.business.specialties || [])
  ].filter(Boolean).slice(0, 10);

  return `
    <section class="ai-context" aria-label="Structured Information">
      <h2>In Summary</h2>
      <ul class="summary-bullets">
        ${bullets.map(bullet => `<li>${bullet}</li>`).join('')}
      </ul>
      
      <div class="structured-data-preview">
        <h3>Key Information</h3>
        <dl>
          <dt>Business Type:</dt>
          <dd>${getCategoryDisplay(data.business.primary_category)}</dd>
          
          <dt>Location:</dt>
          <dd>${data.business.address_city}, ${data.business.address_state}</dd>
          
          ${data.business.phone ? `
          <dt>Contact:</dt>
          <dd>${data.business.phone}</dd>
          ` : ''}
          
          <dt>Current Status:</dt>
          <dd>${isOpenNow(data) ? `Open until ${getClosingTime(data)}` : 'Closed'}</dd>
          
          ${data.update.expires_at ? `
          <dt>Offer Valid Until:</dt>
          <dd>${new Date(data.update.expires_at).toLocaleDateString()}</dd>
          ` : ''}
        </dl>
      </div>
      
      <div class="keywords" data-ai-keywords="${keywords.join(', ')}"></div>
    </section>
  `;
}

// Generate real-time availability section
export function renderAvailabilityStatus(data: PageData): string {
  const isOpen = isOpenNow(data);
  const urgency = getUrgencyLevel(data);
  const statusClass = isOpen ? 'open' : 'closed';
  const urgencyClass = `urgency-${urgency}`;

  let statusText = '';
  let actionText = '';

  if (data.business.status_override) {
    switch (data.business.status_override) {
      case 'closed_emergency':
        statusText = '🚨 TEMPORARILY CLOSED - Emergency';
        actionText = 'Please check back later or call for updates';
        break;
      case 'closed_holiday':
        statusText = '🎉 CLOSED - Holiday Hours';
        actionText = 'Enjoying holiday time with family';
        break;
      case 'temporarily_closed':
        statusText = '⏳ TEMPORARILY CLOSED';
        actionText = 'We\'ll be back soon';
        break;
      default:
        statusText = isOpen ? `✅ OPEN NOW until ${getClosingTime(data)}` : '❌ CLOSED';
        actionText = isOpen ? 'Visit or call now' : 'Opens tomorrow';
    }
  } else {
    statusText = isOpen ? `✅ OPEN NOW until ${getClosingTime(data)}` : '❌ CLOSED';
    actionText = isOpen ? 'Visit or call now' : 'Opens tomorrow';
  }

  return `
    <div class="availability-status ${statusClass} ${urgencyClass}">
      <div class="status-indicator">
        <span class="status-text">${statusText}</span>
        <span class="action-text">${actionText}</span>
      </div>
      
      ${data.business.phone ? `
      <div class="contact-now">
        <a href="tel:${data.business.phone}" class="phone-cta">
          📞 ${data.business.phone}
        </a>
      </div>
      ` : ''}
      
      ${urgency === 'high' && data.update.expires_at ? `
      <div class="urgency-timer" data-expires="${data.update.expires_at}">
        ⏰ Offer expires: <span id="countdown-timer">${new Date(data.update.expires_at).toLocaleString()}</span>
      </div>
      ` : ''}
    </div>
  `;
}

// Helper function for category display (used in multiple places)
export function getCategoryDisplay(category: string): string {
  const categoryMap: Record<string, string> = {
    'food-dining': 'Restaurant & Dining',
    'shopping': 'Retail & Shopping',
    'beauty-grooming': 'Beauty & Grooming',
    'health-medical': 'Healthcare & Medical',
    'repairs-services': 'Repair Services',
    'professional-services': 'Professional Services',
    'activities-entertainment': 'Entertainment & Activities',
    'education-training': 'Education & Training',
    'creative-digital': 'Creative & Digital Services',
    'transportation-delivery': 'Transportation & Delivery'
  };
  return categoryMap[category] || category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
}