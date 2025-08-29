import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, prefer',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

// Edge Function for generating business profile pages
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { businessId, updateId } = await req.json()

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const startTime = Date.now()

    // Get business details
    const { data: business } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single()

    if (!business) {
      throw new Error('Business not found')
    }

    // Generate business profile content using AI
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured')
    }

    // Generate AI content for business profile
    let aiContent
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' + geminiApiKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate professional business profile content for ${business.name}, a ${business.primary_category} business in ${business.address_city}, ${business.address_state}.

Business Details:
- Name: ${business.name}
- Category: ${business.primary_category}
- Location: ${business.address_city}, ${business.address_state}
- Description: ${business.description || business.business_story || 'Local business'}

Generate a JSON response with these fields:
{
  "question": "Compelling business question (15-20 words)",
  "directAnswer": "Professional answer about the business (50-80 words)", 
  "primaryService": "Main service title (3-5 words)",
  "serviceDescription": "Service description (30-50 words)",
  "approachTitle": "Business approach title (3-5 words)",
  "approachDescription": "Work approach description (30-50 words)",
  "valuePropTitle": "Value proposition title (3-5 words)",
  "valuePropDescription": "Business value description (30-50 words)",
  "faqItems": [
    {"question": "Business-relevant question", "answer": "Professional answer"},
    {"question": "Another relevant question", "answer": "Professional answer"},
    {"question": "Third relevant question", "answer": "Professional answer"},
    {"question": "Fourth relevant question", "answer": "Professional answer"}
  ],
  "ctaDescription": "Call-to-action description (20-30 words)"
}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      })

      const geminiResult = await response.json()
      const generatedText = geminiResult.candidates?.[0]?.content?.parts?.[0]?.text

      if (generatedText) {
        const cleanedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        aiContent = JSON.parse(cleanedText)
      } else {
        throw new Error('No content generated')
      }
    } catch (aiError) {
      console.warn('AI generation failed, using fallback content')
      aiContent = {
        question: `Looking for a trusted ${business.primary_category} in ${business.address_city}?`,
        directAnswer: `${business.name} is a professional ${business.primary_category} serving ${business.address_city}, ${business.address_state} with quality services and customer satisfaction.`,
        primaryService: 'Professional Service',
        serviceDescription: `Expert ${business.primary_category} services tailored to your needs.`,
        approachTitle: 'Quality Focus',
        approachDescription: 'We prioritize quality and customer satisfaction in everything we do.',
        valuePropTitle: 'Trusted Choice',
        valuePropDescription: `Reliable ${business.primary_category} services you can count on.`,
        faqItems: [
          {question: `What services does ${business.name} offer?`, answer: `We provide professional ${business.primary_category} services in ${business.address_city}.`},
          {question: 'How can I contact you?', answer: `You can reach us at ${business.phone || 'our listed contact information'}.`},
          {question: 'Where are you located?', answer: `We're located in ${business.address_city}, ${business.address_state}.`},
          {question: 'What are your hours?', answer: 'Please contact us for current hours and availability.'}
        ],
        ctaDescription: `Contact ${business.name} today for professional ${business.primary_category} services.`
      }
    }

    // Generate AI-native business profile HTML (no template needed)
    const businessSlug = slugify(business.name)
    const countryCode = (business.country || 'us').toLowerCase()
    const stateCode = (business.address_state || 'ca').toLowerCase()
    const citySlug = slugify(business.address_city || 'city')
    
    // Business profile URL (no update slug)
    const filePath = `/${countryCode}/${stateCode}/${citySlug}/${businessSlug}`
    
    // Generate comprehensive AI-native HTML with citation optimization
    const processedHtml = generateAINativeBusinessProfileHtml(business, aiContent, filePath)
    
    // Store or update the business profile page in database
    let page, pageError
    
    // Check if business profile page already exists
    const { data: existingPage } = await supabase
      .from('generated_pages')
      .select('id')
      .eq('business_id', businessId)
      .eq('page_type', 'business')
      .maybeSingle()
    
    if (existingPage) {
      // Update existing business profile
      const { data, error } = await supabase
        .from('generated_pages')
        .update({
          update_id: updateId,
          file_path: filePath,
          title: templateData.PAGE_TITLE,
          html_content: processedHtml,
          content_intent: 'profile',
          slug: businessSlug,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingPage.id)
        .select()
        .single()
      
      page = data
      pageError = error
    } else {
      // Create new business profile page
      const { data, error } = await supabase
        .from('generated_pages')
        .insert({
          update_id: updateId,
          business_id: businessId,
          file_path: filePath,
          title: templateData.PAGE_TITLE,
          html_content: processedHtml,
          content_intent: 'profile',
          slug: businessSlug,
          page_type: 'business',
          expires_at: null // Business profiles never expire
        })
        .select()
        .single()
      
      page = data
      pageError = error
    }
    
    if (pageError) {
      console.error('Error creating/updating business profile:', pageError)
      throw new Error(`Failed to create business profile: ${pageError.message}`)
    }

    const processingTime = Date.now() - startTime

    // Update the update record status if provided
    if (updateId) {
      await supabase
        .from('updates')
        .update({ 
          status: 'completed',
          processing_time_ms: processingTime
        })
        .eq('id', updateId)
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        url: filePath,
        title: templateData.PAGE_TITLE,
        processingTime
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('Error generating business profile:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

// AI-Native Business Profile HTML Generator
function generateAINativeBusinessProfileHtml(business: any, aiContent: any, filePath: string): string {
  const now = new Date()
  
  // Generate comprehensive JSON-LD for AI understanding
  const jsonLD = {
    "@context": "https://schema.org",
    "@type": getSchemaType(business.primary_category),
    "name": business.name,
    "description": business.description || aiContent.directAnswer,
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
    "priceRange": getPriceRangeSymbols(business.price_positioning),
    "openingHours": business.hours,
    "servedCuisine": business.primary_category === 'food-dining' ? business.specialties : undefined,
    "makesOffer": business.services ? business.services.map((service: string) => ({
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": service
      }
    })) : undefined,
    "foundingDate": business.established_year ? `${business.established_year}-01-01` : undefined,
    "award": business.awards ? business.awards.map((award: any) => award.name || award) : undefined,
    "hasCredential": business.certifications ? business.certifications.map((cert: any) => ({
      "@type": "EducationalOccupationalCredential",
      "name": cert.name || cert
    })) : undefined,
    "dateModified": now.toISOString()
  }

  // Clean undefined values
  Object.keys(jsonLD).forEach(key => {
    if (jsonLD[key] === undefined || jsonLD[key] === null || 
        (Array.isArray(jsonLD[key]) && jsonLD[key].length === 0)) {
      delete jsonLD[key]
    }
  })

  // Generate FAQ schema if available
  const faqSchema = aiContent.faqItems && aiContent.faqItems.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage", 
    "mainEntity": aiContent.faqItems.map((faq: any) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null

  // Generate comprehensive FAQs for maximum AI citations
  const businessFAQs = generateBusinessProfileFAQs(business, aiContent)
  const faqHTML = generateFAQHTML(businessFAQs)
  const authorityHeadline = generateAuthorityHeadline(business)
  
  // Pure AI-native HTML optimized for maximum citations
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${business.name} - ${getCategoryDisplay(business.primary_category)} in ${business.address_city}, ${business.address_state}</title>
<meta name="description" content="${authorityHeadline}. ${business.description || aiContent.directAnswer}">
<meta name="robots" content="index, follow">
<meta name="geo.region" content="US-${business.address_state}">
<meta name="geo.placename" content="${business.address_city}">
<meta name="article:published_time" content="${now.toISOString()}">
<script type="application/ld+json">
${JSON.stringify(jsonLD, null, 2)}
</script>
${faqSchema ? `<script type="application/ld+json">${JSON.stringify(faqSchema, null, 2)}</script>` : ''}
</head>
<body>
<h1>${business.name}</h1>
<p>${authorityHeadline}</p>
<p>Category: ${getCategoryDisplay(business.primary_category)}</p>
<p>Location: ${business.address_city}, ${business.address_state}</p>

<!-- Authority Signals First (Critical for AI Trust) -->
<h2>Why Choose ${business.name}</h2>
${business.established_year ? `<p>Serving ${business.address_city} since ${business.established_year} (${new Date().getFullYear() - business.established_year} years experience)</p>` : ''}
${business.awards && business.awards.length > 0 ? `<p>Awards: ${business.awards.map((a: any) => `${a.name || a} ${a.year ? `(${a.year})` : ''}`).join(', ')}</p>` : ''}
${business.certifications && business.certifications.length > 0 ? `<p>Certifications: ${business.certifications.map((c: any) => c.name || c).join(', ')}</p>` : ''}
${business.static_tags && business.static_tags.includes('locally-owned') ? `<p>Locally owned and operated</p>` : ''}

<h2>Description</h2>
<p>${business.description || aiContent.directAnswer}</p>

<h2>Contact Information</h2>
<p>Phone: <a href="tel:${business.phone}">${business.phone}</a></p>
<p>Email: ${business.email || 'Contact by phone'}</p>
<p>Address: ${business.address_street || ''} ${business.address_city}, ${business.address_state} ${business.zip_code || ''}</p>
<p>Website: ${business.website ? `<a href="${business.website}" rel="noopener">${business.website}</a>` : 'Contact for website'}</p>

<h2>Services & Pricing</h2>
${business.services && business.services.length > 0 ? `<ul>${business.services.map((s: string) => `<li>${s}</li>`).join('')}</ul>` : '<p>Contact for service information</p>'}
<p>Price Range: ${business.price_positioning || 'Contact for pricing'} (${getPriceRangeSymbols(business.price_positioning)})</p>
${business.payment_methods ? `<p>Payment Methods: ${business.payment_methods.join(', ')}</p>` : ''}

${business.specialties && business.specialties.length > 0 ? `<h2>Specialties</h2><ul>${business.specialties.map((s: string) => `<li>${s}</li>`).join('')}</ul>` : ''}

<h2>Hours & Availability</h2>
<p>Hours: ${business.hours || 'Contact for hours'}</p>
<p>Availability: ${business.availability_policy ? business.availability_policy.replace('-', ' ') : 'Contact for availability'}</p>

${business.parking_info ? `<h2>Parking</h2><p>${business.parking_info}</p>` : ''}

${business.accessibility_features && business.accessibility_features.length > 0 ? `<h2>Accessibility</h2><ul>${business.accessibility_features.map(f => `<li>${f}</li>`).join('')}</ul>` : ''}

<h2>Frequently Asked Questions</h2>
${faqHTML}

<h2>Complete Business Information</h2>
<p>Business Type: ${getCategoryDisplay(business.primary_category)}</p>
${business.established_year ? `<p>Established: ${business.established_year} (${new Date().getFullYear() - business.established_year} years in business)</p>` : ''}
<p>Service Area: ${business.address_city}, ${business.address_state}</p>
${business.languages_spoken ? `<p>Languages: ${business.languages_spoken.join(', ')}</p>` : ''}
<p>Last Updated: ${now.toLocaleDateString()}</p>
</body>
</html>`

// Helper functions for FAQ generation
function generateBusinessProfileFAQs(business: any, aiContent: any) {
  const faqs = []
  
  faqs.push({
    question: \`What are \${business.name}'s hours?\`,
    answer: business.hours || \`Contact \${business.name} at \${business.phone} for current hours.\`,
    category: 'hours',
    priority: 1
  })
  
  faqs.push({
    question: \`How can I contact \${business.name}?\`,
    answer: \`Call \${business.phone}\${business.email ? \`, email \${business.email}\` : ''}\${business.website ? \`, or visit \${business.website}\` : ''}.\`,
    category: 'contact',
    priority: 1
  })
  
  if (business.services && business.services.length > 0) {
    faqs.push({
      question: \`What services does \${business.name} offer?\`,
      answer: \`\${business.name} offers \${business.services.join(', ')}.\`,
      category: 'services',
      priority: 2
    })
  }
  
  if (business.primary_category === 'food-dining' && business.specialties && business.specialties.length > 0) {
    faqs.push({
      question: \`What are \${business.name}'s specialties?\`,
      answer: \`\${business.name} specializes in \${business.specialties.join(', ')}.\`,
      category: 'specialties',
      priority: 2
    })
  }
  
  return faqs
}

function generateFAQHTML(faqs: any[]) {
  return faqs.map(faq => \`<h3>\${faq.question}</h3><p>\${faq.answer}</p>\`).join('')
}

function generateAuthorityHeadline(business: any) {
  const elements = []
  
  if (business.awards && business.awards.length > 0) {
    elements.push('Award-winning')
  }
  
  if (business.established_year) {
    const years = new Date().getFullYear() - business.established_year
    if (years >= 5) {
      elements.push(\`\${years}+ years experience\`)
    }
  }
  
  const category = getCategoryDisplay(business.primary_category)
  
  if (elements.length > 0) {
    return \`\${elements.join(', ')} \${category.toLowerCase()}\`
  }
  
  return \`Professional \${category.toLowerCase()}\`
}
}

// Schema type mapping for different business categories
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

// Helper functions for AI-native generation
function slugify(text: string): string {
  if (!text) return 'business'
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50)
}

function getPriceRangeSymbols(pricePositioning: string): string {
  const priceMap: Record<string, string> = {
    'budget': '$',
    'mid-range': '$$',
    'premium': '$$$',
    'luxury': '$$$$'
  }
  
  return priceMap[pricePositioning?.toLowerCase()] || '$$'
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