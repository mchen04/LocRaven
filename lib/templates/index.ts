/**
 * AI-Native Templates for Cloudflare Pages Edge Runtime
 * 
 * Templates are exported as JavaScript strings to avoid filesystem access
 * in Cloudflare's V8 edge runtime environment.
 */

export const businessProfileTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>{{BUSINESS_NAME}} - {{BUSINESS_CATEGORY}} in {{BUSINESS_ADDRESS_CITY}}, {{BUSINESS_ADDRESS_STATE}}</title>
<meta name="description" content="{{META_DESCRIPTION}}">
<meta name="robots" content="index, follow">
<meta name="geo.region" content="US-{{BUSINESS_ADDRESS_STATE}}">
<meta name="geo.placename" content="{{BUSINESS_ADDRESS_CITY}}">
<link rel="canonical" href="{{CANONICAL_URL}}">

<!-- Open Graph for AI Understanding -->
<meta property="og:title" content="{{PAGE_TITLE}}">
<meta property="og:description" content="{{META_DESCRIPTION}}">
<meta property="og:type" content="website">
<meta property="og:url" content="{{CANONICAL_URL}}">
<meta property="og:site_name" content="LocRaven">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{PAGE_TITLE}}">
<meta name="twitter:description" content="{{META_DESCRIPTION}}">

<!-- Structured Data for AI Crawlers -->
<script type="application/ld+json">
{{STRUCTURED_DATA}}
</script>

<style>
:root {
  --primary: #6366f1;
  --primary-dark: #4f46e5;
  --gray-900: #1e293b;
  --gray-700: #475569;
  --gray-600: #64748b;
  --gray-500: #94a3b8;
  --gray-100: #f8fafc;
  --white: #ffffff;
  --shadow: 0 0.25rem 0.375rem -0.0625rem rgb(0 0 0 / 0.1);
  --gradient: linear-gradient(135deg, var(--primary) 0%, #8b5cf6 100%);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: var(--gray-700);
  background: var(--white);
  -webkit-font-smoothing: antialiased;
}

.hero {
  background: var(--gradient);
  color: var(--white);
  padding: 4rem 2rem;
  text-align: center;
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content { max-width: 50rem; }
.hero h1 { font-size: clamp(2rem, 5vw, 3rem); margin-bottom: 1rem; font-weight: 800; }
.hero-subtitle { font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9; max-width: 37.5rem; margin-left: auto; margin-right: auto; }

.container { max-width: 75rem; margin: 0 auto; padding: 0 2rem; }

.info-section { padding: 3rem 0; background: var(--white); }
.info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(17.5rem, 1fr)); gap: 2rem; margin-top: 2rem; }

.info-card {
  background: var(--gray-100);
  padding: 2rem;
  border-radius: 0.75rem;
  border: 0.0625rem solid #e2e8f0;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-0.125rem);
  box-shadow: var(--shadow);
}

.info-card h3 {
  color: var(--gray-900);
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.contact-section {
  background: var(--gray-100);
  padding: 3rem 0;
  text-align: center;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15.625rem, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  max-width: 50rem;
  margin-left: auto;
  margin-right: auto;
}

.contact-card {
  background: var(--white);
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: var(--shadow);
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  margin: 0.5rem;
  background: var(--primary);
  color: var(--white);
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn:hover {
  background: var(--primary-dark);
  transform: translateY(-0.0625rem);
}

.btn-secondary {
  background: transparent;
  color: var(--primary);
  border: 0.125rem solid var(--primary);
}

.btn-secondary:hover {
  background: var(--primary);
  color: var(--white);
}

footer {
  background: var(--gray-900);
  color: var(--gray-500);
  padding: 2rem;
  text-align: center;
}

@media (max-width: 48rem) {
  .hero { padding: 3rem 1rem; min-height: 40vh; }
  .info-grid { grid-template-columns: 1fr; gap: 1rem; }
  .contact-grid { grid-template-columns: 1fr; }
  .container { padding: 0 1rem; }
}
</style>
</head>
<body>
  <section class="hero">
    <div class="hero-content">
      <h1>{{BUSINESS_NAME}}</h1>
      <p class="hero-subtitle">{{AI_GENERATED_DIRECT_ANSWER}}</p>
      <div>
        <a href="tel:{{BUSINESS_PHONE}}" class="btn">Call {{BUSINESS_PHONE}}</a>
        {{#if BUSINESS_WEBSITE}}<a href="{{BUSINESS_WEBSITE}}" class="btn btn-secondary" target="_blank">Visit Website</a>{{/if}}
      </div>
    </div>
  </section>

  <section class="info-section">
    <div class="container">
      <h2 style="text-align: center; margin-bottom: 2rem; color: var(--gray-900);">{{AI_GENERATED_QUESTION}}</h2>
      
      <div class="info-grid">
        <div class="info-card">
          <h3>Contact Information</h3>
          <p><strong>Phone:</strong> {{BUSINESS_PHONE}}</p>
          {{#if BUSINESS_EMAIL}}<p><strong>Email:</strong> {{BUSINESS_EMAIL}}</p>{{/if}}
          <p><strong>Address:</strong> {{FULL_ADDRESS}}</p>
          {{#if BUSINESS_HOURS}}<p><strong>Hours:</strong> {{BUSINESS_HOURS}}</p>{{/if}}
        </div>

        <div class="info-card">
          <h3>About Our Services</h3>
          <p>{{BUSINESS_DESCRIPTION}}</p>
          {{#if BUSINESS_SPECIALTIES}}<p><strong>Specialties:</strong> {{BUSINESS_SPECIALTIES}}</p>{{/if}}
          {{#if BUSINESS_SERVICES}}<p><strong>Services:</strong> {{BUSINESS_SERVICES}}</p>{{/if}}
        </div>

        {{#if SERVICE_AREA}}
        <div class="info-card">
          <h3>Service Area</h3>
          <p>{{SERVICE_AREA}}</p>
          {{#if PARKING_INFO}}<p><strong>Parking:</strong> {{PARKING_INFO}}</p>{{/if}}
          {{#if AVAILABILITY_POLICY}}<p><strong>Availability:</strong> {{AVAILABILITY_POLICY}}</p>{{/if}}
        </div>
        {{/if}}

        {{#if FEATURED_ITEMS}}
        <div class="info-card">
          <h3>Featured Items</h3>
          <p>{{FEATURED_ITEMS}}</p>
        </div>
        {{/if}}

        {{#if ACCESSIBILITY_FEATURES}}
        <div class="info-card">
          <h3>Accessibility</h3>
          <p>{{ACCESSIBILITY_FEATURES}}</p>
          {{#if LANGUAGES_SPOKEN}}<p><strong>Languages:</strong> {{LANGUAGES_SPOKEN}}</p>{{/if}}
        </div>
        {{/if}}

        {{#if PAYMENT_METHODS}}
        <div class="info-card">
          <h3>Payment Options</h3>
          <p>{{PAYMENT_METHODS}}</p>
        </div>
        {{/if}}
      </div>
    </div>
  </section>

  <section class="contact-section">
    <div class="container">
      <h3>Contact {{BUSINESS_NAME}}</h3>
      <p style="margin-bottom: 2rem; font-size: 1.125rem;">Ready to experience our services? Get in touch today!</p>
      
      <div class="contact-grid">
        <div class="contact-card">
          <h4>Call Us</h4>
          <p><a href="tel:{{BUSINESS_PHONE}}" class="btn">{{BUSINESS_PHONE}}</a></p>
        </div>
        
        {{#if BUSINESS_WEBSITE}}
        <div class="contact-card">
          <h4>Visit Online</h4>
          <p><a href="{{BUSINESS_WEBSITE}}" class="btn btn-secondary" target="_blank">Website</a></p>
        </div>
        {{/if}}
        
        <div class="contact-card">
          <h4>Location</h4>
          <p>{{FULL_ADDRESS}}</p>
        </div>
      </div>
      
      {{SOCIAL_MEDIA_SECTION}}
    </div>
  </section>

  <footer>
    <div class="container">
      <p>&copy; 2025 LocRaven - Last Updated: {{LAST_UPDATED}}</p>
      <p>Professional business profile generated for AI discovery</p>
    </div>
  </footer>
</body>
</html>`;

export const businessUpdateTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>{{PAGE_TITLE}}</title>
<meta name="description" content="{{META_DESCRIPTION}}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="{{CANONICAL_URL}}">

<script type="application/ld+json">
{{STRUCTURED_DATA}}
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: system-ui, sans-serif; line-height: 1.6; color: #374151; background: #fff; }
.hero { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 4rem 2rem; text-align: center; min-height: 60vh; display: flex; align-items: center; justify-content: center; }
.hero-content { max-width: 50rem; }
.hero h1 { font-size: clamp(2rem, 5vw, 3rem); margin-bottom: 1rem; }
.hero p { font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9; }
.btn { display: inline-block; padding: 0.75rem 1.5rem; margin: 0.5rem; background: white; color: #6366f1; text-decoration: none; border-radius: 0.5rem; font-weight: 600; }
.content { max-width: 800px; margin: 2rem auto; padding: 0 2rem; }
.info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin: 2rem 0; }
.info-card { background: #f9fafb; padding: 1.5rem; border-radius: 0.5rem; }
.contact { background: #f3f4f6; padding: 2rem; text-align: center; }
footer { background: #1f2937; color: #9ca3af; padding: 2rem; text-align: center; }
</style>
</head>
<body>
  <section class="hero">
    <div class="hero-content">
      <h1>{{BUSINESS_NAME}}</h1>
      <p>{{AI_GENERATED_DIRECT_ANSWER}}</p>
      <div>
        <a href="tel:{{BUSINESS_PHONE}}" class="btn">Call {{BUSINESS_PHONE}}</a>
        <a href="{{BUSINESS_WEBSITE}}" class="btn" target="_blank">Visit Website</a>
      </div>
    </div>
  </section>
  
  <div class="content">
    <div class="info-grid">
      <div class="info-card">
        <h3>Latest Update</h3>
        <p>{{AI_GENERATED_DIRECT_ANSWER}}</p>
      </div>
      <div class="info-card">
        <h3>Contact Information</h3>
        <p><strong>Phone:</strong> {{BUSINESS_PHONE}}</p>
        <p><strong>Address:</strong> {{BUSINESS_ADDRESS_CITY}}, {{BUSINESS_ADDRESS_STATE}}</p>
        <p><strong>Category:</strong> {{BUSINESS_CATEGORY}}</p>
      </div>
      <div class="info-card">
        <h3>About {{BUSINESS_NAME}}</h3>
        <p>{{BUSINESS_DESCRIPTION}}</p>
        {{#if FEATURED_ITEMS}}<p><strong>Featured:</strong> {{FEATURED_ITEMS}}</p>{{/if}}
      </div>
    </div>
  </div>
  
  <div class="contact">
    <h3>Contact {{BUSINESS_NAME}}</h3>
    <p>Get the latest information and updates directly from {{BUSINESS_NAME}}.</p>
  </div>
  
  <footer>
    <p>&copy; 2025 LocRaven - Updated {{LAST_UPDATED}}</p>
  </footer>
</body>
</html>`;

export const cityCategoryTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>{{CATEGORY_DISPLAY_NAME}} in {{CITY_DISPLAY_NAME}}, {{STATE_DISPLAY_NAME}} | LocRaven</title>
<meta name="description" content="Find the best {{CATEGORY_DISPLAY_NAME}} in {{CITY_DISPLAY_NAME}}, {{STATE_DISPLAY_NAME}}. {{BUSINESS_COUNT}} local businesses with current information.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://locraven.com{{URL_PATH}}">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "{{CATEGORY_DISPLAY_NAME}} in {{CITY_DISPLAY_NAME}}, {{STATE_DISPLAY_NAME}}",
  "description": "Local {{CATEGORY_DISPLAY_NAME}} businesses in {{CITY_DISPLAY_NAME}}, {{STATE_DISPLAY_NAME}}",
  "numberOfItems": {{BUSINESS_COUNT}}
}
</script>

<style>
:root {
  --primary: #6366f1;
  --gray-900: #1e293b;
  --gray-700: #475569;
  --gray-100: #f8fafc;
  --white: #ffffff;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: system-ui, sans-serif;
  line-height: 1.6;
  color: var(--gray-700);
  background: var(--white);
}

.header {
  background: linear-gradient(135deg, var(--primary), #8b5cf6);
  color: white;
  padding: 3rem 2rem;
  text-align: center;
}

.header h1 { font-size: 2.5rem; margin-bottom: 1rem; }
.header p { font-size: 1.125rem; opacity: 0.9; }

.content { max-width: 1200px; margin: 2rem auto; padding: 0 2rem; }

.business-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18.75rem, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.business-card {
  background: var(--gray-100);
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 0.0625rem solid #e2e8f0;
}

.business-card h3 {
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.business-meta {
  color: var(--gray-600);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

footer {
  background: var(--gray-900);
  color: #9ca3af;
  padding: 2rem;
  text-align: center;
  margin-top: 3rem;
}
</style>
</head>
<body>
  <header class="header">
    <h1>{{CATEGORY_DISPLAY_NAME}} in {{CITY_DISPLAY_NAME}}</h1>
    <p>{{BUSINESS_COUNT}} local businesses • Updated {{FRESHNESS_INDICATOR}}</p>
  </header>

  <div class="content">
    <div class="business-grid">
      {{#each BUSINESSES}}
      <article class="business-card">
        <h3><a href="{{URL_PATH}}">{{BUSINESS_NAME}}</a></h3>
        <div class="business-meta">{{BUSINESS_CATEGORY}} • {{LAST_UPDATED_RELATIVE}}</div>
        <p>{{BUSINESS_DESCRIPTION_SHORT}}</p>
        <div style="margin-top: 1rem;">
          <a href="tel:{{BUSINESS_PHONE}}" class="btn">Call</a>
          <a href="{{URL_PATH}}" class="btn btn-secondary">Details</a>
        </div>
      </article>
      {{/each}}
    </div>
  </div>

  <footer>
    <p>&copy; 2025 LocRaven - Updated {{HUMAN_TIMESTAMP}}</p>
  </footer>
</body>
</html>`;

/**
 * Template type definition
 */
export type TemplateType = 'business-profile' | 'business-update' | 'city-category';

/**
 * Get template by name (Cloudflare edge runtime compatible)
 */
export function getTemplate(templateName: TemplateType): string {
  switch (templateName) {
    case 'business-profile':
      return businessProfileTemplate;
    case 'business-update':
      return businessUpdateTemplate;
    case 'city-category':
      return cityCategoryTemplate;
    default:
      throw new Error(`Unknown template: ${templateName}`);
  }
}

/**
 * Simple Handlebars-style template replacement
 * Compatible with Cloudflare edge runtime
 */
export function renderTemplate(template: string, variables: Record<string, any>): string {
  let rendered = template;
  
  // Replace simple variables {{VARIABLE}}
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    rendered = rendered.replace(placeholder, String(value || ''));
  }
  
  // Handle conditional blocks {{#if VARIABLE}}...{{/if}}
  rendered = rendered.replace(/\{\{#if\s+([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, variable, content) => {
    return variables[variable.trim()] ? content : '';
  });
  
  // Handle each blocks {{#each ARRAY}}...{{/each}} (basic implementation)
  rendered = rendered.replace(/\{\{#each\s+([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, variable, content) => {
    const arrayData = variables[variable.trim()];
    if (!Array.isArray(arrayData)) return '';
    
    return arrayData.map(item => {
      let itemContent = content;
      // Replace item properties
      for (const [key, value] of Object.entries(item)) {
        const itemPlaceholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        itemContent = itemContent.replace(itemPlaceholder, String(value || ''));
      }
      return itemContent;
    }).join('');
  });
  
  // Clean up any remaining unreplaced variables
  rendered = rendered.replace(/\{\{[^}]+\}\}/g, '');
  
  return rendered;
}