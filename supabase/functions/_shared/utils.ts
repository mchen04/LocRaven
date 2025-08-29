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