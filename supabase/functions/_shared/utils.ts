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
): Promise<{title: string, description: string}> {
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
Business: ${business.name}
Category: ${business.primary_category}
Location: ${business.address_city}, ${business.address_state}
Services: ${business.services?.join(', ') || 'General business services'}
Specialties: ${business.specialties?.join(', ') || 'Contact for details'}
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
- Emphasize: Business credibility, specific offer details, direct contact encouragement
- Target queries: "[business name] deals", "[business name] specials", "[business name] [location]"

Format response as JSON:
{"title": "...", "description": "..."}`,

    local: `You are a local SEO expert optimizing content for AI search engines like ChatGPT, Perplexity, and Claude.

${baseContext}

Create LOCAL/DISCOVERY intent optimization for users searching for services near them:

Requirements:
- Title: 50-150 characters, emphasize location + service category + current availability
- Description: 150-300 characters, position within local market context, mention area coverage
- Emphasize: Geographic relevance, local presence, area served, "near me" optimization
- Target queries: "[service] near me", "[category] in [city]", "best [service] [location]"

Format response as JSON:
{"title": "...", "description": "..."}`,

    category: `You are a local SEO expert optimizing content for AI search engines like ChatGPT, Perplexity, and Claude.

${baseContext}

Create CATEGORY/SERVICE intent optimization for users researching this type of service:

Requirements:
- Title: 50-150 characters, emphasize service expertise + benefit + broader market appeal
- Description: 150-300 characters, highlight professional capabilities, specializations, value proposition
- Emphasize: Industry expertise, service quality, unique specializations, professional benefits
- Target queries: "[service type] companies", "professional [service]", "[specialty] experts"

Format response as JSON:
{"title": "...", "description": "..."}`,

    'branded-local': `You are a local SEO expert optimizing content for AI search engines like ChatGPT, Perplexity, and Claude.

${baseContext}

Create BRANDED-LOCAL intent optimization for users searching for this specific business in this location:

Requirements:
- Title: 50-150 characters, combine business name + location + current offer/service
- Description: 150-300 characters, emphasize local reputation and specific current availability
- Emphasize: Brand recognition in local market, geographic proximity, current offers
- Target queries: "[business name] [city]", "[business name] near me", "[business name] in [location]"

Format response as JSON:
{"title": "...", "description": "..."}`,

    'service-urgent': `You are a local SEO expert optimizing content for AI search engines like ChatGPT, Perplexity, and Claude.

${baseContext}

Create SERVICE-URGENT intent optimization for users needing immediate service availability:

Requirements:
- Title: 50-150 characters, emphasize immediate availability + service type + quick response
- Description: 150-300 characters, highlight fast response time, immediate availability, urgent service capabilities
- Emphasize: Speed, availability, immediate response, emergency/urgent service capability
- Target queries: "emergency [service]", "urgent [service] needed", "immediate [service] available"

Format response as JSON:
{"title": "...", "description": "..."}`,

    'competitive': `You are a local SEO expert optimizing content for AI search engines like ChatGPT, Perplexity, and Claude.

${baseContext}

Create COMPETITIVE intent optimization for users comparing service providers:

Requirements:
- Title: 50-150 characters, position as top choice + competitive advantages + market leadership
- Description: 150-300 characters, highlight unique value propositions, competitive advantages, market differentiation
- Emphasize: Quality leadership, competitive pricing, superior service, market-leading expertise
- Target queries: "best [service] in [area]", "top [service] provider", "[service] reviews and ratings"

Format response as JSON:
{"title": "...", "description": "..."}`
  };

  return prompts[intentType];
}

// Call Gemini API for content generation
async function callGeminiAPI(prompt: string): Promise<{title: string, description: string}> {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY secret not configured in Supabase');
  }

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
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!generatedText) {
    throw new Error('No content generated by Gemini');
  }

  // Parse JSON response
  try {
    const parsedContent = JSON.parse(generatedText);
    return {
      title: parsedContent.title || 'Business Update',
      description: parsedContent.description || 'Contact for details'
    };
  } catch (parseError) {
    // If JSON parsing fails, extract title and description manually
    const titleMatch = generatedText.match(/"title":\s*"([^"]+)"/);
    const descMatch = generatedText.match(/"description":\s*"([^"]+)"/);
    
    return {
      title: titleMatch?.[1] || 'Business Update',
      description: descMatch?.[1] || 'Contact for details'
    };
  }
}

// Fallback content generation when AI fails
function generateFallbackContent(business: any, updateData: any, intentType: string): {title: string, description: string} {
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
  updateId?: string
): { filePath: string, slug: string, pageVariant: string } {
  const countryCode = (business.country || 'us').toLowerCase();
  const stateCode = (business.address_state || 'ca').toLowerCase();
  const citySlug = slugify(business.address_city || 'city');
  const businessSlug = slugify(business.name);
  const updateSlug = generateSemanticSlug(updateData.content_text);
  
  // Add unique identifier to prevent slug collisions
  const uniqueId = updateId ? updateId.substring(0, 8) : Date.now().toString().substring(-6);
  
  switch (intentType) {
    case 'direct':
      return {
        filePath: `/${countryCode}/${stateCode}/${citySlug}/${businessSlug}/${updateSlug}-${uniqueId}`,
        slug: `${businessSlug}-${updateSlug}-${uniqueId}`,
        pageVariant: 'direct-business-update'
      };
    
    case 'local':
      const localSlug = `current-specials-${updateSlug}-${uniqueId}`;
      return {
        filePath: `/${countryCode}/${stateCode}/${citySlug}/${business.primary_category}/${localSlug}`,
        slug: `${business.primary_category}-${citySlug}-${localSlug}`,
        pageVariant: 'local-discovery-specials'
      };
    
    case 'category':
      const categorySlug = generateCategoryVariantSlug(updateData.content_text, business);
      return {
        filePath: `/${countryCode}/${stateCode}/${citySlug}/${business.primary_category}/${categorySlug}-${uniqueId}`,
        slug: `${business.primary_category}-${citySlug}-${categorySlug}-${uniqueId}`,
        pageVariant: 'category-service-focus'
      };
    
    case 'branded-local':
      const brandedLocalSlug = `${businessSlug}-${citySlug}-${updateSlug}`;
      return {
        filePath: `/${countryCode}/${stateCode}/${citySlug}/${businessSlug}/local-${updateSlug}-${uniqueId}`,
        slug: `${brandedLocalSlug}-local-${uniqueId}`,
        pageVariant: 'branded-local-presence'
      };
    
    case 'service-urgent':
      const urgentSlug = `urgent-${updateSlug}-available`;
      return {
        filePath: `/${countryCode}/${stateCode}/${citySlug}/${business.primary_category}/urgent-${updateSlug}-${uniqueId}`,
        slug: `${business.primary_category}-urgent-${citySlug}-${uniqueId}`,
        pageVariant: 'service-urgent-availability'
      };
    
    case 'competitive':
      const competitiveSlug = `top-${business.primary_category}-${updateSlug}`;
      return {
        filePath: `/${countryCode}/${stateCode}/${citySlug}/${business.primary_category}/top-${updateSlug}-${uniqueId}`,
        slug: `top-${business.primary_category}-${citySlug}-${uniqueId}`,
        pageVariant: 'competitive-market-leader'
      };
    
    default:
      return {
        filePath: `/${countryCode}/${stateCode}/${citySlug}/${businessSlug}/${updateSlug}-${uniqueId}`,
        slug: `${businessSlug}-${updateSlug}-${uniqueId}`,
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