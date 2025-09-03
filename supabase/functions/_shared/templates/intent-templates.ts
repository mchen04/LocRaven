import { 
  PageData, 
  renderMetaTags, 
  renderOpenGraphTags,
  renderBusinessContact, 
  renderBusinessDetails, 
  renderFAQSection,
  renderIfExists,
  renderList,
  renderTemplate
} from './base-template.ts';

// Main template render function
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
    default:
      return renderDirectTemplate(data);
  }
}

// Generate JSON-LD structured data
function generateJsonLD(data: PageData): string {
  const jsonLD = {
    "@context": "https://schema.org",
    "@type": getSchemaType(data.business.primary_category),
    "name": data.business.name,
    "description": data.business.description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": data.business.address_street,
      "addressLocality": data.business.address_city,
      "addressRegion": data.business.address_state,
      "postalCode": data.business.zip_code,
      "addressCountry": data.business.country || "US"
    },
    "telephone": data.business.phone,
    "email": data.business.email,
    "url": data.business.website,
    "offers": {
      "@type": "Offer",
      "description": data.update.content_text,
      "validFrom": data.update.created_at,
      "validThrough": data.update.expires_at
    },
    "dateModified": new Date().toISOString(),
    "openingHours": data.business.hours ? [data.business.hours] : undefined,
    "paymentAccepted": data.business.payment_methods || ["Cash", "Credit Card"],
    "areaServed": data.business.service_area || `${data.business.address_city}, ${data.business.address_state}`,
    "mainEntity": data.faqs?.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      },
      "keywords": faq.voiceSearchTriggers.join(', ')
    }))
  };

  // Clean undefined values
  Object.keys(jsonLD).forEach(key => {
    if (jsonLD[key] === undefined || jsonLD[key] === null) {
      delete jsonLD[key];
    }
  });

  return JSON.stringify(jsonLD, null, 2);
}

function getSchemaType(category: string): string {
  const typeMap: Record<string, string> = {
    'food-dining': 'Restaurant',
    'shopping': 'Store',
    'beauty-grooming': 'BeautySalon',
    'health-medical': 'MedicalBusiness',
    'repairs-services': 'LocalBusiness',
    'professional-services': 'ProfessionalService',
    'activities-entertainment': 'EntertainmentBusiness',
    'education-training': 'EducationalOrganization',
    'creative-digital': 'LocalBusiness',
    'transportation-delivery': 'LocalBusiness'
  };
  return typeMap[category] || 'LocalBusiness';
}

function getCategoryDisplay(category: string): string {
  const categoryMap: Record<string, string> = {
    'food-dining': 'Restaurant',
    'shopping': 'Retail',
    'beauty-grooming': 'Beauty & Grooming',
    'health-medical': 'Healthcare',
    'repairs-services': 'Repair Services',
    'professional-services': 'Professional Services',
    'activities-entertainment': 'Entertainment',
    'education-training': 'Education',
    'creative-digital': 'Creative Services',
    'transportation-delivery': 'Transportation'
  };
  return categoryMap[category] || category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Template 1: Direct Intent (Brand-focused)
export function renderDirectTemplate(data: PageData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
${renderMetaTags(data)}
${renderOpenGraphTags(data)}
<script type="application/ld+json">
${generateJsonLD(data)}
</script>
</head>
<body>
<h1>${data.business.name} - Current Update</h1>
<p>Business: ${data.business.name}</p>
<p>Location: ${data.business.address_city}, ${data.business.address_state}</p>
<p>Category: ${getCategoryDisplay(data.business.primary_category)}</p>

<h2>Current Update</h2>
<p>${data.update.content_text}</p>
<p>Published: ${new Date(data.update.created_at).toLocaleDateString()}</p>
${renderIfExists(data.update.expires_at, `<p>Valid Until: ${new Date(data.update.expires_at).toLocaleDateString()}</p>`)}

${renderBusinessContact(data)}
${renderBusinessDetails(data)}
${renderFAQSection(data)}

<h2>Update Information</h2>
<p>Update Type: Business update</p>
<p>Content Type: Real-time business information</p>
<p>Geographic Scope: ${data.business.address_city}, ${data.business.address_state}</p>
</body>
</html>`;
}

// Template 2: Local Intent (Location-focused)
export function renderLocalTemplate(data: PageData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
${renderMetaTags(data)}
${renderOpenGraphTags(data)}
<script type="application/ld+json">
${generateJsonLD(data)}
</script>
</head>
<body>
<h1>${getCategoryDisplay(data.business.primary_category)} in ${data.business.address_city}, ${data.business.address_state}</h1>
<p>Local Business: ${data.business.name}</p>
<p>Serving: ${data.business.service_area || `${data.business.address_city} area`}</p>

<h2>Current Local Update</h2>
<p>${data.update.content_text}</p>
<p>Updated: ${new Date(data.update.created_at).toLocaleDateString()}</p>
${renderIfExists(data.update.expires_at, `<p>Valid Until: ${new Date(data.update.expires_at).toLocaleDateString()}</p>`)}

${renderBusinessContact(data)}
${renderBusinessDetails(data)}
${renderFAQSection(data)}

<h2>Local Service Information</h2>
<p>Service Type: ${getCategoryDisplay(data.business.primary_category)}</p>
<p>Service Area: ${data.business.service_area || `${data.business.address_city}, ${data.business.address_state}`}</p>
<p>Local Business in: ${data.business.address_city}, ${data.business.address_state}</p>
</body>
</html>`;
}

// Template 3: Category Intent (Service-focused)
export function renderCategoryTemplate(data: PageData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
${renderMetaTags(data)}
${renderOpenGraphTags(data)}
<script type="application/ld+json">
${generateJsonLD(data)}
</script>
</head>
<body>
<h1>Professional ${getCategoryDisplay(data.business.primary_category)} Services</h1>
<p>Expert Provider: ${data.business.name}</p>
<p>Service Area: ${data.business.service_area || `${data.business.address_city}, ${data.business.address_state}`}</p>

<h2>Service Update</h2>
<p>${data.update.content_text}</p>
<p>Updated: ${new Date(data.update.created_at).toLocaleDateString()}</p>
${renderIfExists(data.update.expires_at, `<p>Offer Valid Until: ${new Date(data.update.expires_at).toLocaleDateString()}</p>`)}

${renderList(data.business.specialties, (specialties) => `
<h2>Our Specializations</h2>
<ul>${specialties.map(s => `<li>${s}</li>`).join('')}</ul>
`)}

${renderList(data.business.services, (services) => `
<h2>Services Offered</h2>
<ul>${services.map(s => `<li>${s}</li>`).join('')}</ul>
`)}

${renderList(data.business.awards, (awards) => `
<h2>Recognition & Awards</h2>
<ul>${awards.map(a => `<li>${a.name} (${a.year})</li>`).join('')}</ul>
`)}

${renderBusinessContact(data)}
${renderFAQSection(data)}

<h2>Service Information</h2>
<p>Service Category: ${getCategoryDisplay(data.business.primary_category)}</p>
<p>Professional Service Provider</p>
<p>Service Region: ${data.business.address_state}</p>
</body>
</html>`;
}

// Template 4: Branded-Local Intent (Brand + Location)
export function renderBrandedLocalTemplate(data: PageData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
${renderMetaTags(data)}
${renderOpenGraphTags(data)}
<script type="application/ld+json">
${generateJsonLD(data)}
</script>
</head>
<body>
<h1>${data.business.name} - ${data.business.address_city}, ${data.business.address_state}</h1>
<p>Local ${getCategoryDisplay(data.business.primary_category)} Business</p>
<p>Proudly Serving: ${data.business.service_area || `${data.business.address_city} and surrounding areas`}</p>

<h2>Latest from ${data.business.name}</h2>
<p>${data.update.content_text}</p>
<p>Posted: ${new Date(data.update.created_at).toLocaleDateString()}</p>
${renderIfExists(data.update.expires_at, `<p>Valid Through: ${new Date(data.update.expires_at).toLocaleDateString()}</p>`)}

${renderBusinessContact(data)}
${renderBusinessDetails(data)}
${renderFAQSection(data)}

<h2>About ${data.business.name}</h2>
<p>Local ${getCategoryDisplay(data.business.primary_category)} in ${data.business.address_city}</p>
<p>Established Local Presence</p>
</body>
</html>`;
}

// Template 5: Service-Urgent Intent (Immediate availability)
export function renderServiceUrgentTemplate(data: PageData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
${renderMetaTags(data)}
${renderOpenGraphTags(data)}
<script type="application/ld+json">
${generateJsonLD(data)}
</script>
</head>
<body>
<h1>Immediate ${getCategoryDisplay(data.business.primary_category)} Available</h1>
<p>Service Provider: ${data.business.name}</p>
<p>Available in: ${data.business.address_city}, ${data.business.address_state}</p>

<h2>Urgent Service Update</h2>
<p>${data.update.content_text}</p>
<p>Posted: ${new Date(data.update.created_at).toLocaleDateString()}</p>
${renderIfExists(data.update.expires_at, `<p>Available Until: ${new Date(data.update.expires_at).toLocaleDateString()}</p>`)}

<h2>Contact for Immediate Service</h2>
${renderIfExists(data.business.phone, `<p><strong>Call Now: ${data.business.phone}</strong></p>`)}
${renderIfExists(data.business.email, `<p>Email: ${data.business.email}</p>`)}
<p>Service Area: ${data.business.service_area || `${data.business.address_city}, ${data.business.address_state}`}</p>

${renderBusinessDetails(data)}
${renderFAQSection(data)}

<h2>Immediate Availability</h2>
<p>Service Type: Emergency/Urgent ${getCategoryDisplay(data.business.primary_category)}</p>
<p>Response Area: ${data.business.address_city}, ${data.business.address_state}</p>
</body>
</html>`;
}

// Template 5: Service-Urgent Intent (Immediate availability)
export function renderServiceUrgentTemplate(data: PageData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
${renderMetaTags(data)}
${renderOpenGraphTags(data)}
<script type="application/ld+json">
${generateJsonLD(data)}
</script>
</head>
<body>
<h1>Immediate ${getCategoryDisplay(data.business.primary_category)} Available</h1>
<p>Service Provider: ${data.business.name}</p>
<p>Available in: ${data.business.address_city}, ${data.business.address_state}</p>

<h2>Urgent Service Update</h2>
<p>${data.update.content_text}</p>
<p>Posted: ${new Date(data.update.created_at).toLocaleDateString()}</p>
${renderIfExists(data.update.expires_at, `<p>Available Until: ${new Date(data.update.expires_at).toLocaleDateString()}</p>`)}

<h2>Contact for Immediate Service</h2>
${renderIfExists(data.business.phone, `<p><strong>Call Now: ${data.business.phone}</strong></p>`)}
${renderIfExists(data.business.email, `<p>Email: ${data.business.email}</p>`)}
<p>Service Area: ${data.business.service_area || `${data.business.address_city}, ${data.business.address_state}`}</p>

${renderBusinessDetails(data)}
${renderFAQSection(data)}

<h2>Immediate Availability</h2>
<p>Service Type: Emergency/Urgent ${getCategoryDisplay(data.business.primary_category)}</p>
<p>Response Area: ${data.business.address_city}, ${data.business.address_state}</p>
</body>
</html>`;
}

// Template 6: Competitive Intent (Market leadership)
export function renderCompetitiveTemplate(data: PageData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
${renderMetaTags(data)}
${renderOpenGraphTags(data)}
<script type="application/ld+json">
${generateJsonLD(data)}
</script>
</head>
<body>
<h1>Top ${getCategoryDisplay(data.business.primary_category)} Provider - ${data.business.name}</h1>
<p>Leading ${getCategoryDisplay(data.business.primary_category)} in ${data.business.address_city}, ${data.business.address_state}</p>
<p>Service Excellence Since ${data.business.established_year || 'Establishment'}</p>

<h2>Latest Competitive Advantage</h2>
<p>${data.update.content_text}</p>
<p>Updated: ${new Date(data.update.created_at).toLocaleDateString()}</p>
${renderIfExists(data.update.expires_at, `<p>Offer Valid Until: ${new Date(data.update.expires_at).toLocaleDateString()}</p>`)}

${renderList(data.business.awards, (awards) => `
<h2>Awards & Recognition</h2>
<ul>${awards.map(a => `<li><strong>${a.name}</strong> - ${a.issuer} (${a.year})</li>`).join('')}</ul>
`)}

${renderList(data.business.certifications, (certs) => `
<h2>Professional Certifications</h2>
<ul>${certs.map(c => `<li>${c.name} - ${c.issuer}</li>`).join('')}</ul>
`)}

${renderList(data.business.specialties, (specialties) => `
<h2>Expert Specializations</h2>
<ul>${specialties.map(s => `<li>${s}</li>`).join('')}</ul>
`)}

${renderBusinessContact(data)}
${renderBusinessDetails(data)}
${renderFAQSection(data)}

<h2>Market Leadership</h2>
<p>Industry: ${getCategoryDisplay(data.business.primary_category)}</p>
<p>Market Position: Leading Provider</p>
<p>Service Excellence in: ${data.business.address_city}, ${data.business.address_state}</p>
</body>
</html>`;
}