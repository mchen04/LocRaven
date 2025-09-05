import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

// Shared CORS headers for all edge functions
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, prefer',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};

// Create Supabase client with error handling
export function createSupabaseClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Standard error response
export function errorResponse(message: string, status = 500): Response {
  return new Response(
    JSON.stringify({ 
      error: message,
      success: false,
      timestamp: new Date().toISOString()
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status 
    }
  );
}

// Standard success response
export function successResponse(data: any, status = 200): Response {
  return new Response(
    JSON.stringify({ 
      success: true,
      ...data,
      timestamp: new Date().toISOString()
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status 
    }
  );
}

// Handle CORS preflight
export function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  return null;
}

// Safe JSON parsing with error handling
export async function safeJsonParse(req: Request): Promise<any> {
  try {
    return await req.json();
  } catch (error) {
    throw new Error('Invalid JSON in request body');
  }
}

// Slugify text for URLs
export function slugify(text: string): string {
  if (!text) return 'item';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}

// Phone formatting function
export function formatPhoneNumber(phone: string, countryCode: string = '+1'): string {
  if (!phone) return '';
  
  // Remove non-digits
  const digits = phone.replace(/\D/g, '');
  
  if (countryCode === '+1' && digits.length === 10) {
    // US/Canada format: +1 (925) 365-6778
    return `+1 (${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
  }
  
  // Other countries - basic formatting
  return `${countryCode} ${digits}`;
}

// Better category display names
export function getCategoryDisplay(category: string): string {
  const displayNames: Record<string, string> = {
    'food-dining': 'Food & Dining',
    'shopping': 'Shopping',
    'beauty-grooming': 'Beauty & Grooming',
    'health-medical': 'Health & Medical',
    'repairs-services': 'Repairs & Services',
    'professional-services': 'Professional Services',
    'activities-entertainment': 'Activities & Entertainment',
    'education-training': 'Education & Training',
    'creative-digital': 'Creative & Digital',
    'transportation-delivery': 'Transportation & Delivery'
  };
  return displayNames[category] || 'Local Business';
}

// Format business hours helper
export function formatBusinessHours(hours: any): string {
  if (!hours || typeof hours !== 'object') return 'Contact for hours';
  
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const openDays = days.filter(day => hours[day] && hours[day] !== 'closed');
  
  if (openDays.length === 0) return 'Contact for hours';
  if (openDays.length === 7) return 'Open 7 days a week';
  
  return `Open ${openDays.length} days a week`;
}

// Price range symbols
export function getPriceRangeSymbols(positioning: string): string {
  switch (positioning?.toLowerCase()) {
    case 'budget': return '$';
    case 'mid-range': return '$$';
    case 'premium': return '$$$';
    case 'luxury': return '$$$$';
    default: return '$$';
  }
}

// Generate semantic URL slug from content
export function generateSemanticSlug(content: string): string {
  const lowerContent = content.toLowerCase();
  
  // Extract key phrases for semantic URLs
  if ((lowerContent.includes('closed') || lowerContent.includes('closing')) && lowerContent.includes('until')) {
    const match = lowerContent.match(/clos(ed|ing).*?until\s+(\w+\s+\d+)/i);
    if (match) {
      return slugify(`closed-until-${match[2]}`);
    }
    return 'temporarily-closed';
  }
  
  if (lowerContent.includes('special') || lowerContent.includes('promotion')) {
    return 'special-promotion';
  }
  
  if (lowerContent.includes('event')) {
    return 'upcoming-event';
  }
  
  if (lowerContent.includes('hours')) {
    return 'hours-update';
  }
  
  if (lowerContent.includes('menu')) {
    return 'menu-update';
  }
  
  // Default: use first few meaningful words
  const words = content.split(' ').slice(0, 4);
  return slugify(words.join(' '));
}

// Extract semantic keywords from update content for AI optimization
function extractSemanticKeywords(content: string, business: any): string[] {
  const keywords: string[] = [];
  const lowerContent = content.toLowerCase();
  
  // Deal/offer keywords
  if (/sale|deal|offer|discount|% off|special|promo/i.test(content)) {
    const percentMatch = content.match(/(\d+)%\s*(off|discount)/i);
    if (percentMatch) {
      keywords.push(`${percentMatch[1]}-percent-off`);
    }
    keywords.push('special-deals', 'limited-offer');
  }
  
  // Service-specific keywords
  if (business.services?.length > 0) {
    const service = business.services[0].toLowerCase();
    if (service.includes('website') || service.includes('web')) {
      keywords.push('website-services', 'web-development');
    }
    if (service.includes('ai')) {
      keywords.push('ai-services', 'ai-optimization');
    }
  }
  
  // Temporal keywords
  if (/today|tonight|now|immediate|urgent|24.?7/i.test(content)) {
    keywords.push('available-now', 'immediate-service');
  }
  
  if (/holiday|winter|summer|spring|fall|seasonal/i.test(content)) {
    const season = content.match(/(holiday|winter|summer|spring|fall|seasonal)/i);
    if (season) {
      keywords.push(`${season[1].toLowerCase()}-special`);
    }
  }
  
  // Menu/product keywords
  if (/menu|new items|launching|introducing/i.test(content)) {
    keywords.push('new-offerings', 'menu-update');
  }
  
  return keywords;
}

// Add intent-specific patterns for AI search optimization
function addIntentSpecificPatterns(
  keywords: string[], 
  intentType: string, 
  business: any
): string[] {
  const patterns: string[] = [...keywords];
  const city = slugify(business.address_city || 'local');
  const category = business.primary_category;
  
  switch (intentType) {
    case 'direct':
      patterns.push('book-now', 'contact-today');
      break;
      
    case 'local':
      patterns.push('near-me', `${city}-area`, 'local-business');
      if (/open|available|serving/i.test(keywords.join(' '))) {
        patterns.push('open-now');
      }
      break;
      
    case 'category':
      patterns.push(`best-${category}`, 'professional-services');
      if (category === 'professional-services') {
        patterns.push('expert-solutions');
      }
      break;
      
    case 'branded-local':
      patterns.push(`${city}-location`, 'get-started');
      break;
      
    case 'service-urgent':
      patterns.push('emergency-service', 'urgent-help', 'available-24-7');
      break;
      
    case 'competitive':
      patterns.push('top-rated', 'best-choice', '2025');
      break;
  }
  
  return patterns;
}

// Generate AI-optimized slug from content and intent
export function generateAIOptimizedSlug(
  content: string, 
  intentType: string, 
  business: any,
  aiSlug?: string
): string {
  // Use AI-generated slug if available and valid
  if (aiSlug && aiSlug.length > 5 && aiSlug.length <= 60) {
    return slugify(aiSlug);
  }
  
  // Extract semantic keywords
  const semanticKeywords = extractSemanticKeywords(content, business);
  
  // Add intent-specific patterns
  const allKeywords = addIntentSpecificPatterns(semanticKeywords, intentType, business);
  
  // Build slug based on intent type
  let slug = '';
  
  switch (intentType) {
    case 'direct':
      // Business-focused slug
      const businessSlug = slugify(business.name);
      const mainKeyword = allKeywords.find(k => k.includes('percent-off') || k.includes('special')) || 'current-offer';
      slug = `${businessSlug}-${mainKeyword}`;
      break;
      
    case 'local':
      // Location-focused slug
      const serviceType = business.primary_category.replace('-', '-');
      const locationKeyword = allKeywords.find(k => k.includes('near-me') || k.includes('area')) || 'near-me';
      slug = `${serviceType}-${locationKeyword}`;
      break;
      
    case 'category':
      // Category-focused slug
      const categoryKeyword = allKeywords.find(k => k.includes('best-') || k.includes('professional')) || `best-${business.primary_category}`;
      const specialtyKeyword = allKeywords.find(k => k.includes('special') || k.includes('deals')) || 'services';
      slug = `${categoryKeyword}-${specialtyKeyword}`;
      break;
      
    case 'branded-local':
      // Brand + location slug
      const brandSlug = slugify(business.name);
      const citySlug = slugify(business.address_city);
      const actionKeyword = allKeywords.find(k => k.includes('get-started') || k.includes('book')) || 'contact-now';
      slug = `${brandSlug}-${citySlug}-${actionKeyword}`;
      break;
      
    case 'service-urgent':
      // Urgency-focused slug
      const urgentKeyword = allKeywords.find(k => k.includes('urgent') || k.includes('emergency') || k.includes('available-now')) || 'help-available-now';
      const cityName = slugify(business.address_city);
      slug = `${business.primary_category}-${urgentKeyword}-${cityName}`;
      break;
      
    case 'competitive':
      // Competition-focused slug
      const competitiveKeyword = allKeywords.find(k => k.includes('top-rated') || k.includes('best')) || 'top-rated';
      const serviceSlug = business.primary_category.replace('-', '-');
      slug = `${competitiveKeyword}-${serviceSlug}-${slugify(business.address_city)}-2025`;
      break;
      
    default:
      // Fallback to enhanced semantic slug
      const topKeywords = allKeywords.slice(0, 3);
      slug = topKeywords.length > 0 ? topKeywords.join('-') : generateSemanticSlug(content);
  }
  
  // Ensure reasonable length and format
  return slugify(slug).substring(0, 80);
}

// Dynamic tag detection from update content
export function detectDynamicTags(updateText: string): string[] {
  const tags = ['updated-today'];
  const text = updateText.toLowerCase();
  
  // Detect various update types
  if (/special|deal|offer|discount|% off|sale|promo/i.test(text)) {
    tags.push('special-active', 'limited-time-offer');
  }
  
  if (/today|tonight|now|this week|weekend/i.test(text)) {
    tags.push('happening-now');
  }
  
  if (/emergency|urgent|immediate|24.?7|asap/i.test(text)) {
    tags.push('emergency-available', 'immediate-service');
  }
  
  if (/closed?|closing|vacation|holiday/i.test(text)) {
    if (/temporarily|until|back/i.test(text)) {
      tags.push('temporarily-closed');
    }
    if (/holiday/i.test(text)) {
      tags.push('holiday-hours');
    }
  }
  
  if (/event|live music|performance|happy hour/i.test(text)) {
    tags.push('event-today');
  }
  
  if (/new menu|new items|introducing|launching/i.test(text)) {
    tags.push('new-offerings');
  }
  
  return tags;
}

// Calculate expiration for dynamic tags
export function calculateTagExpiration(tags: string[]): Date {
  const now = new Date();
  
  if (tags.includes('happening-now') || tags.includes('special-active')) {
    // Expire in 24 hours
    return new Date(now.getTime() + 24 * 60 * 60 * 1000);
  }
  
  if (tags.includes('event-today')) {
    // Expire at midnight
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return midnight;
  }
  
  // Default: expire in 7 days
  return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
}

// Template loading utility
export async function loadTemplate(templateName: string): Promise<string> {
  try {
    const templatePath = new URL(`./templates/${templateName}`, import.meta.url);
    const response = await fetch(templatePath);
    
    if (!response.ok) {
      throw new Error(`Template ${templateName} not found`);
    }
    
    return await response.text();
  } catch (error) {
    console.error(`Error loading template ${templateName}:`, error);
    throw new Error(`Failed to load template: ${templateName}`);
  }
}

// Replace all template placeholders
export function replaceTemplatePlaceholders(template: string, data: Record<string, any>): string {
  let html = template;
  
  // Replace all placeholders
  Object.entries(data).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    html = html.replace(new RegExp(placeholder, 'g'), String(value || ''));
  });
  
  return html;
}

// AI Service Integration for Content Generation
export async function generateAIOptimizedContent(
  business: any,
  updateData: any,
  intentType: 'direct' | 'local' | 'category',
  aiProvider: string = 'gemini'
): Promise<{title: string, description: string, slug?: string}> {
  try {
    const prompt = buildPromptForIntent(business, updateData, intentType);
    
    if (aiProvider === 'gemini') {
      return await callGeminiAPI(prompt);
    }
    
    // Fallback to basic generation if AI fails
    return generateFallbackContent(business, updateData, intentType);
  } catch (error) {
    console.error('AI content generation failed:', error);
    return generateFallbackContent(business, updateData, intentType);
  }
}

// Build intent-specific prompts for AI optimization
function buildPromptForIntent(business: any, updateData: any, intentType: string): string {
  const baseContext = `
CRITICAL INSTRUCTIONS - READ CAREFULLY:
- Use ONLY the information provided below. Do NOT add any facts not explicitly stated.
- Do NOT claim rankings (#1, best, top-rated, leading) unless provided in business data
- Do NOT mention services, locations, or features not listed
- Do NOT add awards, certifications, or years of experience not provided
- If information is missing, omit it rather than guessing

AVAILABLE DATA (use ONLY this information):
Business Name: ${business.name}
Business Category: ${business.primary_category}
Location: ${business.address_city}, ${business.address_state} (DO NOT mention other cities)
Services Offered: ${business.services?.length ? business.services.join(', ') : 'Services available - contact for details'}
Specialties: ${business.specialties?.length ? business.specialties.join(', ') : 'Contact for specialties'}
Service Area: ${business.service_area || `${business.address_city} area`}
Update: ${updateData.content_text}
${updateData.expires_at ? `Valid Until: ${new Date(updateData.expires_at).toLocaleDateString()}` : ''}
`;

  const prompts = {
    direct: `You are a local SEO expert optimizing content for AI search engines like ChatGPT, Perplexity, and Claude.

${baseContext}

Create DIRECT/BRAND intent optimization for users searching specifically for this business:

Requirements:
- Title: 50-150 characters, include business name + key benefit + location
- Description: 150-300 characters, focus on specific offer/update with clear call-to-action
- Slug: 30-60 characters, business name + main offer, optimized for "[business name] deals" searches
- MUST start title/description with: "Based on provided data:" (remove this phrase from final output)
- ONLY use services and information explicitly listed above
- DO NOT add superlatives, rankings, or unverified claims
- Emphasize: Business credibility using ONLY provided data, specific offer details, direct contact encouragement
- Target queries: "[business name] deals", "[business name] specials", "[business name] [location]"

Slug examples: "marios-bistro-winter-menu-special", "joe-plumbing-emergency-service-24-7"

Format response as JSON:
{"title": "...", "description": "...", "slug": "..."}`,

    local: `You are a local SEO expert optimizing content for AI search engines like ChatGPT, Perplexity, and Claude.

${baseContext}

Create LOCAL/DISCOVERY intent optimization for users searching for services near them:

Requirements:
- Title: 50-150 characters, emphasize location + service category + current availability
- Description: 150-300 characters, position within local market context, mention area coverage
- Slug: 30-60 characters, service type + "near me" + location, optimized for local discovery
- MUST start title/description with: "Based on provided data:" (remove this phrase from final output)
- ONLY use services and information explicitly listed above
- DO NOT add superlatives, rankings, or unverified claims like "best" or "top"
- Emphasize: Geographic relevance using ONLY provided location data, local presence, area served, "near me" optimization
- Target queries: "[service] near me", "[category] in [city]", "[service] [location]"

Slug examples: "italian-restaurants-near-me-seattle", "plumber-near-me-san-francisco-open-now"

Format response as JSON:
{"title": "...", "description": "...", "slug": "..."}`,

    category: `You are a local SEO expert optimizing content for AI search engines like ChatGPT, Perplexity, and Claude.

${baseContext}

Create CATEGORY/SERVICE intent optimization for users researching this type of service:

Requirements:
- Title: 50-150 characters, emphasize service expertise + benefit + broader market appeal
- Description: 150-300 characters, highlight professional capabilities, specializations, value proposition
- Slug: 30-60 characters, service category + location + specialty/benefit (avoid superlatives unless in data)
- MUST start title/description with: "Based on provided data:" (remove this phrase from final output)
- ONLY use services and specializations explicitly listed above
- DO NOT add superlatives like "best" unless explicitly stated in business data
- Emphasize: Industry expertise using ONLY provided specialties, service quality, professional benefits
- Target queries: "[service type] companies", "professional [service]", "[specialty] services"

Slug examples: "web-development-dublin-ai-optimization", "professional-plumbing-services-emergency"

Format response as JSON:
{"title": "...", "description": "...", "slug": "..."}`,

    'branded-local': `You are a local SEO expert optimizing content for AI search engines like ChatGPT, Perplexity, and Claude.

${baseContext}

Create BRANDED-LOCAL intent optimization for users searching for this specific business in this location:

Requirements:
- Title: 50-150 characters, combine business name + location + current offer/service
- Description: 150-300 characters, emphasize local reputation and specific current availability
- Slug: 30-60 characters, business name + city + action word optimized for "[business] in [city]"
- MUST start title/description with: "Based on provided data:" (remove this phrase from final output)
- ONLY use services and information explicitly listed above
- DO NOT add local reputation claims unless explicitly stated in business data
- Emphasize: Brand presence using ONLY provided data, geographic proximity, current offers
- Target queries: "[business name] [city]", "[business name] near me", "[business name] in [location]"

Slug examples: "marios-bistro-seattle-book-table-now", "joe-plumbing-denver-call-today"

Format response as JSON:
{"title": "...", "description": "...", "slug": "..."}`,

    'service-urgent': `You are a local SEO expert optimizing content for AI search engines like ChatGPT, Perplexity, and Claude.

${baseContext}

Create SERVICE-URGENT intent optimization for users needing immediate service availability:

Requirements:
- Title: 50-150 characters, emphasize immediate availability + service type + quick response
- Description: 150-300 characters, highlight fast response time, immediate availability, urgent service capabilities
- Slug: 30-60 characters, service + "available now" + location, optimized for emergency searches
- MUST start title/description with: "Based on provided data:" (remove this phrase from final output)
- ONLY use services and availability information explicitly listed above
- DO NOT add response time claims unless explicitly stated in business data
- Emphasize: Speed, availability, immediate response ONLY if supported by provided data
- Target queries: "emergency [service]", "urgent [service] needed", "immediate [service] available"

Slug examples: "plumber-available-now-chicago-24-7", "electrician-emergency-service-miami"

Format response as JSON:
{"title": "...", "description": "...", "slug": "..."}`,

    'competitive': `You are a local SEO expert optimizing content for AI search engines like ChatGPT, Perplexity, and Claude.

${baseContext}

Create COMPETITIVE intent optimization for users comparing service providers:

ANTI-HALLUCINATION REQUIREMENTS:
- MUST start title/description with: 'Based on provided data:'
- DO NOT add superlatives, rankings, or unverified claims (no "best", "top", "#1", "leading")
- ONLY mention services, specialties, and features explicitly listed in business data
- DO NOT invent competitive advantages not provided in business data
- Use factual language: "offers [service]" not "provides superior [service]"

Requirements:
- Title: 50-150 characters, factual positioning using actual business services and location
- Description: 150-300 characters, highlight verifiable services, specialties, and business details from provided data
- Slug: 30-60 characters, service + location + year, optimized for comparison searches
- Emphasize: Actual services offered, verified business information, factual location details
- Target queries: "[service] in [area]", "[service] provider", "[business name] services"

Slug examples: "web-design-bay-area-2025", "plumbing-service-chicago"

Format response as JSON:
{"title": "...", "description": "...", "slug": "..."}`
  };

  return prompts[intentType];
}

// Call Gemini API for content generation
async function callGeminiAPI(prompt: string): Promise<{title: string, description: string, slug?: string}> {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  console.log('Gemini API Key available:', apiKey ? 'YES' : 'NO', 'Length:', apiKey?.length || 0);
  
  if (!apiKey) {
    console.error('GEMINI_API_KEY secret not configured in Supabase');
    throw new Error('GEMINI_API_KEY secret not configured in Supabase');
  }

  console.log('Making Gemini API request...');
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.4,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    })
  });

  console.log('Gemini API response status:', response.status);
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unable to read error response');
    console.error('Gemini API error response:', errorText);
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log('Gemini API response structure:', JSON.stringify(data, null, 2));
  
  const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!generatedText) {
    console.error('No content generated by Gemini. Full response:', JSON.stringify(data, null, 2));
    throw new Error('No content generated by Gemini');
  }

  // Parse JSON response
  try {
    const parsedContent = JSON.parse(generatedText);
    return {
      title: parsedContent.title || 'Business Update',
      description: parsedContent.description || 'Contact for details',
      slug: parsedContent.slug || null
    };
  } catch (parseError) {
    // If JSON parsing fails, extract title, description, and slug manually
    const titleMatch = generatedText.match(/"title":\s*"([^"]+)"/);
    const descMatch = generatedText.match(/"description":\s*"([^"]+)"/);
    const slugMatch = generatedText.match(/"slug":\s*"([^"]+)"/);
    
    return {
      title: titleMatch?.[1] || 'Business Update',
      description: descMatch?.[1] || 'Contact for details',
      slug: slugMatch?.[1] || null
    };
  }
}

// Fallback content generation when AI fails
function generateFallbackContent(business: any, updateData: any, intentType: string): {title: string, description: string, slug?: string} {
  const location = `${business.address_city}, ${business.address_state}`;
  const category = getCategoryDisplay(business.primary_category);
  
  switch (intentType) {
    case 'direct':
      return {
        title: `${business.name} - Current Update - ${location}`,
        description: `${updateData.content_text} Contact ${business.name} in ${location} for details. ${business.phone ? `Call ${business.phone}` : 'Visit our website'}.`
      };
    
    case 'local':
      return {
        title: `${category} Services with Current Updates - ${location}`,
        description: `Local ${category.toLowerCase()} services in ${location}. ${updateData.content_text} Find quality ${category.toLowerCase()} providers in your area.`
      };
    
    case 'category':
      return {
        title: `Professional ${category} Services - ${business.address_state} Area`,
        description: `Expert ${category.toLowerCase()} services featuring ${business.specialties?.join(', ') || 'professional solutions'}. ${updateData.content_text} Serving ${business.service_area || location}.`
      };
    
    default:
      return {
        title: `${business.name} - ${location}`,
        description: updateData.content_text
      };
  }
}

// Controlled URL generation system using primary_category
export function generateIntentBasedURL(
  business: any, 
  updateData: any, 
  intentType: 'direct' | 'local' | 'category' | 'branded-local' | 'service-urgent' | 'competitive',
  updateId?: string,
  aiSlug?: string
): { filePath: string, slug: string, pageVariant: string } {
  const countryCode = (business.country || 'us').toLowerCase();
  const stateCode = (business.address_state || 'ca').toLowerCase();
  const citySlug = slugify(business.address_city || 'city');
  const businessSlug = slugify(business.name);
  
  // Use AI-generated slug or fallback to semantic/optimized slug generation
  let optimizedSlug: string;
  if (aiSlug && aiSlug.length > 5 && aiSlug.length <= 80) {
    optimizedSlug = slugify(aiSlug);
  } else {
    optimizedSlug = generateAIOptimizedSlug(updateData.content_text, intentType, business);
  }
  
  // No timestamp needed - trust that semantic slugs are naturally unique
  switch (intentType) {
    case 'direct':
      return {
        filePath: `/${countryCode}/${stateCode}/${citySlug}/${businessSlug}/${optimizedSlug}`,
        slug: optimizedSlug,
        pageVariant: 'direct-business-update'
      };
    
    case 'local':
      return {
        filePath: `/${countryCode}/${stateCode}/${citySlug}/${business.primary_category}/${optimizedSlug}`,
        slug: optimizedSlug,
        pageVariant: 'local-discovery-specials'
      };
    
    case 'category':
      return {
        filePath: `/${countryCode}/${stateCode}/${citySlug}/${business.primary_category}/${optimizedSlug}`,
        slug: optimizedSlug,
        pageVariant: 'category-service-focus'
      };
    
    case 'branded-local':
      return {
        filePath: `/${countryCode}/${stateCode}/${citySlug}/${businessSlug}/${optimizedSlug}`,
        slug: optimizedSlug,
        pageVariant: 'branded-local-presence'
      };
    
    case 'service-urgent':
      return {
        filePath: `/${countryCode}/${stateCode}/${citySlug}/${business.primary_category}/${optimizedSlug}`,
        slug: optimizedSlug,
        pageVariant: 'service-urgent-availability'
      };
    
    case 'competitive':
      return {
        filePath: `/${countryCode}/${stateCode}/${citySlug}/${business.primary_category}/${optimizedSlug}`,
        slug: optimizedSlug,
        pageVariant: 'competitive-market-leader'
      };
    
    default:
      return {
        filePath: `/${countryCode}/${stateCode}/${citySlug}/${businessSlug}/${optimizedSlug}`,
        slug: optimizedSlug,
        pageVariant: 'default-update'
      };
  }
}

// Generate category-specific variant slugs based on update content and business specialties
function generateCategoryVariantSlug(contentText: string, business: any): string {
  const lowerContent = contentText.toLowerCase();
  
  // Check for specific business specialties/services
  if (business.specialties?.length > 0) {
    const specialty = business.specialties[0];
    if (specialty.toLowerCase().includes('ai')) {
      if (lowerContent.includes('discount') || lowerContent.includes('special') || lowerContent.includes('offer')) {
        return 'ai-optimization-deals';
      }
      return 'ai-services-available';
    }
  }
  
  // General content-based slug generation
  if (lowerContent.includes('special') || lowerContent.includes('discount') || lowerContent.includes('offer')) {
    return 'special-promotions-active';
  }
  
  if (lowerContent.includes('new') || lowerContent.includes('launching')) {
    return 'new-services-available';
  }
  
  if (lowerContent.includes('consultation') || lowerContent.includes('free')) {
    return 'consultation-services';
  }
  
  if (lowerContent.includes('urgent') || lowerContent.includes('immediate')) {
    return 'immediate-availability';
  }
  
  // Default based on business category
  const categoryMap: Record<string, string> = {
    'professional-services': 'professional-solutions',
    'food-dining': 'dining-specials',
    'health-medical': 'healthcare-services',
    'beauty-grooming': 'beauty-treatments',
    'repairs-services': 'repair-solutions'
  };
  
  return categoryMap[business.primary_category] || 'services-available';
}