import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { 
  createSupabaseClient, 
  errorResponse, 
  successResponse, 
  handleCors, 
  safeJsonParse,
  slugify,
  formatPhoneNumber,
  getCategoryDisplay,
  formatBusinessHours,
  getPriceRangeSymbols,
  generateSemanticSlug,
  detectDynamicTags,
  calculateTagExpiration,
  loadTemplate,
  replaceTemplatePlaceholders
} from '../_shared/utils.ts'

// AI FAQ optimization imports
interface AIOptimizedFAQ {
  question: string;
  answer: string;
  category: string;
  priority: number;
  voiceSearchTriggers: string[];
  aiSearchRelevance: string;
  characterCount: number;
}

// Template-based page generator using the professional template
serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { updateId, businessId, contentText, temporalInfo, specialHours, faqData } = await safeJsonParse(req);
    const supabase = createSupabaseClient();

    const startTime = Date.now()
    await supabase
      .from('updates')
      .update({ 
        status: 'processing',
        special_hours_today: specialHours || null,
        deal_terms: temporalInfo?.dealTerms || null,
        expiration_date_time: temporalInfo?.expiresAt || null,
        update_category: temporalInfo?.updateCategory || 'general'
      })
      .eq('id', updateId)

    // Get business details
    const { data: business } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single()

    if (!business) {
      throw new Error('Business not found')
    }

    // Generate AI-native business update HTML (no template needed)
    const updateSlug = generateSemanticSlug(contentText)
    const businessSlug = slugify(business.name)
    const countryCode = (business.country || 'us').toLowerCase()
    const stateCode = (business.address_state || 'ca').toLowerCase()
    const citySlug = slugify(business.address_city || 'city')
    
    // Create clean URL without timestamp
    const filePath = `/${countryCode}/${stateCode}/${citySlug}/${businessSlug}/${updateSlug}`
    
    // Generate enhanced page title for AI optimization
    const pageTitle = `${business.name} - ${contentText.substring(0, 30)} - ${business.address_city}, ${business.address_state}`;
    
    // Generate pure AI-native HTML with FAQ optimization
    const processedHtml = generateAINativeBusinessUpdateHtml(business, { 
      content_text: contentText,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }, filePath)
    
    // Store the page in database
    const { data: page, error: insertError } = await supabase
      .from('generated_pages')
      .insert({
        update_id: updateId,
        business_id: businessId,
        file_path: filePath,
        title: pageTitle,
        html_content: processedHtml,
        content_intent: 'update',
        slug: updateSlug,
        page_type: 'update',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      })
      .select()
      .single()
    
    if (insertError) {
      console.error('Error inserting page:', insertError)
      throw new Error(`Failed to create page: ${insertError.message}`)
    }

    const processingTime = Date.now() - startTime

    await supabase
      .from('updates')
      .update({ 
        status: 'completed',
        processing_time_ms: processingTime
      })
      .eq('id', updateId)

    return successResponse({
      url: filePath,
      title: pageTitle,
      processingTime
    })
  } catch (error) {
    console.error('Error processing update with template:', error)
    
    const supabase = createSupabaseClient()
    
    const { updateId } = await req.json().catch(() => ({}))
    if (updateId) {
      await supabase
        .from('updates')
        .update({ 
          status: 'failed',
          error_message: error.message
        })
        .eq('id', updateId)
    }
    
    return errorResponse(error.message)
  }
})

// AI-Native Business Update HTML Generator  
function generateAINativeBusinessUpdateHtml(business: any, updateData: any, filePath: string): string {
  const now = new Date()
  
  // Generate comprehensive JSON-LD with FAQ schema for AI understanding
  const faqs = generateBusinessFAQs(business, updateData);
  
  const jsonLD = {
    "@context": "https://schema.org",
    "@type": getSchemaType(business.primary_category),
    "name": business.name,
    "description": business.description,
    "address": {
      "@type": "PostalAddress", 
      "streetAddress": business.address_street,
      "addressLocality": business.address_city,
      "addressRegion": business.address_state,
      "postalCode": business.zip_code,
      "addressCountry": business.country || "US"
    },
    "telephone": business.phone,
    "email": business.email,
    "url": business.website,
    "offers": {
      "@type": "Offer",
      "description": updateData.content_text,
      "validFrom": updateData.created_at,
      "validThrough": updateData.expires_at
    },
    "dateModified": now.toISOString(),
    
    // Enhanced AI search fields
    "openingHours": business.hours ? [business.hours] : undefined,
    "paymentAccepted": business.payment_methods || ["Cash", "Credit Card"],
    "areaServed": business.service_area || `${business.address_city}, ${business.address_state}`,
    
    // FAQ Schema for 849% more AI citations
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer", 
        "text": faq.answer
      },
      "keywords": faq.voiceSearchTriggers.join(', ')
    }))
  }

  // Clean undefined values
  Object.keys(jsonLD).forEach(key => {
    if (jsonLD[key] === undefined || jsonLD[key] === null) {
      delete jsonLD[key]
    }
  })

  // Pure AI-native HTML - no styling, maximum information
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${business.name} Update - ${business.address_city}, ${business.address_state}</title>
<meta name="description" content="${updateData.content_text}">
<meta name="robots" content="index, follow">
<meta name="geo.region" content="US-${business.address_state}">
<meta name="geo.placename" content="${business.address_city}">
<meta name="article:published_time" content="${updateData.created_at}">
<script type="application/ld+json">
${JSON.stringify(jsonLD, null, 2)}
</script>
</head>
<body>
<h1>${business.name} - Current Update</h1>
<p>Business: ${business.name}</p>
<p>Location: ${business.address_city}, ${business.address_state}</p>
<p>Category: ${getCategoryDisplay(business.primary_category)}</p>

<h2>Current Update</h2>
<p>${updateData.content_text}</p>
<p>Published: ${new Date(updateData.created_at).toLocaleDateString()}</p>
${updateData.expires_at ? `<p>Valid Until: ${new Date(updateData.expires_at).toLocaleDateString()}</p>` : ''}

<h2>Business Contact</h2>
<p>Phone: ${business.phone || 'Contact for details'}</p>
<p>Address: ${business.address_street || ''} ${business.address_city}, ${business.address_state} ${business.zip_code || ''}</p>
<p>Email: ${business.email || 'Not provided'}</p>
<p>Website: ${business.website || 'Not provided'}</p>

<h2>Business Details</h2>
<p>Description: ${business.description || 'Local business'}</p>
<p>Services: ${business.services ? business.services.join(', ') : 'Contact for services'}</p>
<p>Specialties: ${business.specialties ? business.specialties.join(', ') : 'Contact for specialties'}</p>
<p>Hours: ${business.hours || 'Contact for hours'}</p>
<p>Price Range: ${business.price_positioning || 'Contact for pricing'}</p>

${generateAIOptimizedFAQSection(business, updateData)}

<h2>Update Information</h2>
<p>Update Type: Business update</p>
<p>Content Type: Real-time business information</p>
<p>Geographic Scope: ${business.address_city}, ${business.address_state}</p>
</body>
</html>`
}

// Schema type mapping
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
  }
  
  return typeMap[category] || 'LocalBusiness'
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
  }
  
  return categoryMap[category] || category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

// AI-Optimized FAQ Section Generator (849% more AI citations)
function generateAIOptimizedFAQSection(business: any, updateData: any): string {
  const faqs = generateBusinessFAQs(business, updateData);
  
  if (faqs.length === 0) return '';

  // Generate FAQ HTML with Schema.org markup for AI optimization
  const faqHTML = faqs.map(faq => `
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

// Generate comprehensive business FAQs optimized for voice search and AI citations
function generateBusinessFAQs(business: any, updateData: any): AIOptimizedFAQ[] {
  const faqs: AIOptimizedFAQ[] = [];
  const businessType = detectBusinessType(business.primary_category);

  // Critical Voice Search Questions (Priority 1)
  
  // "Are you open now?" - #1 voice search query
  faqs.push({
    question: `Are you open now?`,
    answer: generateHoursAnswer(business),
    category: 'hours',
    priority: 1,
    voiceSearchTriggers: ['are you open', 'open now', 'current hours'],
    aiSearchRelevance: 'high',
    characterCount: 0
  });

  // "Where are you located?" - #2 voice search query  
  faqs.push({
    question: `Where is ${business.name} located?`,
    answer: generateLocationAnswer(business),
    category: 'location',
    priority: 1,
    voiceSearchTriggers: ['where are you', 'location', 'address'],
    aiSearchRelevance: 'high',
    characterCount: 0
  });

  // "How can I contact you?" - #3 voice search query
  faqs.push({
    question: `How can I contact ${business.name}?`,
    answer: generateContactAnswer(business),
    category: 'contact',
    priority: 1,
    voiceSearchTriggers: ['phone number', 'contact', 'call you'],
    aiSearchRelevance: 'high',
    characterCount: 0
  });

  // Business-type specific critical questions
  if (businessType === 'restaurant') {
    faqs.push({
      question: `Do you deliver?`,
      answer: business.service_area ? 
        `Yes, ${business.name} delivers to ${business.service_area}. Call ${business.phone} to place an order.` :
        `Contact ${business.name} at ${business.phone} for delivery availability and area coverage.`,
      category: 'services',
      priority: 1,
      voiceSearchTriggers: ['do you deliver', 'delivery available', 'takeout'],
      aiSearchRelevance: 'high',
      characterCount: 0
    });
  }

  if (businessType === 'medical') {
    faqs.push({
      question: `Are you accepting new patients?`,
      answer: business.availability_policy?.type === 'accepting-new-patients' ?
        `Yes, ${business.name} is currently accepting new patients. Call ${business.phone} to schedule.` :
        `Contact ${business.name} at ${business.phone} to check current patient availability.`,
      category: 'availability', 
      priority: 1,
      voiceSearchTriggers: ['new patients', 'accepting patients', 'appointments'],
      aiSearchRelevance: 'high',
      characterCount: 0
    });
  }

  // Services FAQ (if services available)
  if (business.services && business.services.length > 0) {
    faqs.push({
      question: `What services does ${business.name} offer?`,
      answer: `${business.name} offers ${business.services.join(', ')}. Contact us at ${business.phone} for more details.`,
      category: 'services',
      priority: 2,
      voiceSearchTriggers: ['what services', 'services offered'],
      aiSearchRelevance: 'high',
      characterCount: 0
    });
  }

  // Payment methods FAQ (critical for retail/restaurants)
  if (business.payment_methods && business.payment_methods.length > 0) {
    faqs.push({
      question: `What payment methods do you accept?`,
      answer: `${business.name} accepts ${business.payment_methods.join(', ')}. Contact us if you have payment questions.`,
      category: 'policies',
      priority: 2, 
      voiceSearchTriggers: ['payment methods', 'credit card', 'cash'],
      aiSearchRelevance: 'medium',
      characterCount: 0
    });
  }

  // Update-specific FAQ
  if (updateData.content_text) {
    faqs.push({
      question: `What's your current special?`,
      answer: `${updateData.content_text}. ${updateData.expires_at ? `Valid until ${new Date(updateData.expires_at).toLocaleDateString()}.` : ''} Call ${business.phone} for details.`,
      category: 'availability',
      priority: 1,
      voiceSearchTriggers: ['current special', 'deals today', 'what specials'],
      aiSearchRelevance: 'high',
      characterCount: 0
    });
  }

  // Calculate character counts and optimize for AI (50-65 words optimal)
  faqs.forEach(faq => {
    faq.characterCount = faq.answer.length;
  });

  // Use existing business_faqs if available
  if (business.business_faqs && Array.isArray(business.business_faqs) && business.business_faqs.length > 0) {
    faqs.push(...business.business_faqs.map((existingFaq: any) => ({
      question: existingFaq.question,
      answer: existingFaq.answer,
      category: existingFaq.category || 'services',
      priority: existingFaq.priority || 2,
      voiceSearchTriggers: existingFaq.searchTerms || [],
      aiSearchRelevance: 'medium',
      characterCount: existingFaq.answer.length
    })));
  }

  return faqs.slice(0, 8); // Limit to 8 FAQs for optimal AI parsing
}

// Generate conversational answers for AI optimization
function generateHoursAnswer(business: any): string {
  if (!business.hours) {
    return `Contact ${business.name} at ${business.phone || 'our listed number'} for current hours and availability.`;
  }
  
  return `${business.name} is open ${business.hours}. Call ${business.phone || 'us'} to confirm current hours and availability.`;
}

function generateLocationAnswer(business: any): string {
  const address = [business.address_street, business.address_city, business.address_state, business.zip_code]
    .filter(Boolean).join(', ');
  
  let answer = `${business.name} is located at ${address || `${business.address_city}, ${business.address_state}`}.`;
  
  if (business.parking_info) {
    answer += ` ${business.parking_info}`;
  } else {
    answer += ` Contact us for parking information.`;
  }
  
  return answer;
}

function generateContactAnswer(business: any): string {
  const methods = [];
  if (business.phone) methods.push(`call ${business.phone}`);
  if (business.email) methods.push(`email ${business.email}`);
  if (business.website) methods.push(`visit ${business.website}`);
  
  return `You can ${methods.join(', ')} to reach ${business.name}. We're located in ${business.address_city}, ${business.address_state}.`;
}

function detectBusinessType(category: string): string {
  if (!category) return 'general';
  if (category.includes('food') || category.includes('dining')) return 'restaurant';
  if (category.includes('health') || category.includes('medical')) return 'medical';
  if (category.includes('shopping')) return 'retail';
  if (category.includes('professional')) return 'professional';
  return 'general';
}

