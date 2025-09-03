/**
 * Base template system for LocRaven pages
 * Supports conditional rendering based on available data
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
    email?: string;
    website?: string;
    description?: string;
    services?: string[];
    specialties?: string[];
    hours?: string;
    price_positioning?: string;
    payment_methods?: string[];
    primary_category: string;
    service_area?: string;
    awards?: any[];
    certifications?: any[];
  };
  update: {
    content_text: string;
    created_at: string;
    expires_at?: string;
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
  return `<meta charset="UTF-8">
<title>${data.seo.title}</title>
<meta name="description" content="${data.seo.description}">
<meta name="robots" content="index, follow">
<meta name="geo.region" content="US-${data.business.address_state}">
<meta name="geo.placename" content="${data.business.address_city}">
<meta name="article:published_time" content="${data.update.created_at}">
<meta name="page-intent" content="${data.intent.type}">
<meta name="search-optimization" content="ai-powered-${data.intent.type}">
<meta name="content-variant" content="${data.intent.type}-optimized">`;
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
  if (!data.faqs || data.faqs.length === 0) return '';

  const faqHTML = data.faqs.map(faq => `
    <div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
      <h3 itemprop="name">${faq.question}</h3>
      <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
        <p itemprop="text">${faq.answer}</p>
      </div>
    </div>
  `).join('');

  return `
    <section class="ai-optimized-faq" itemscope itemtype="https://schema.org/FAQPage">
      <h2>Frequently Asked Questions</h2>
      ${faqHTML}
    </section>
  `;
}