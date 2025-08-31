import { getTemplate, renderTemplate as edgeRenderTemplate, TemplateType } from '../templates';

/**
 * Template Variables Interface
 * Defines all possible template variables for business profiles
 */
export interface TemplateVariables {
  // Basic Business Info
  BUSINESS_NAME: string;
  BUSINESS_CATEGORY: string;
  BUSINESS_DESCRIPTION: string;
  BUSINESS_PHONE: string;
  BUSINESS_WEBSITE: string;
  BUSINESS_EMAIL: string;
  
  // Location
  BUSINESS_ADDRESS_STREET: string;
  BUSINESS_ADDRESS_CITY: string;
  BUSINESS_ADDRESS_STATE: string;
  BUSINESS_ZIP_CODE: string;
  BUSINESS_COUNTRY: string;
  FULL_ADDRESS: string;
  
  // Business Details
  BUSINESS_HOURS: string;
  BUSINESS_ESTABLISHED_YEAR: string;
  YEARS_SINCE_FOUNDED: string;
  BUSINESS_SPECIALTIES: string;
  BUSINESS_SERVICES: string;
  BUSINESS_FEATURES: string;
  
  // AI-Optimized Fields
  SERVICE_AREA: string;
  FEATURED_ITEMS: string;
  AVAILABILITY_POLICY: string;
  PARKING_INFO: string;
  ACCESSIBILITY_FEATURES: string;
  PAYMENT_METHODS: string;
  LANGUAGES_SPOKEN: string;
  
  // Social Media
  INSTAGRAM_URL: string;
  FACEBOOK_URL: string;
  TWITTER_URL: string;
  LINKEDIN_URL: string;
  SOCIAL_MEDIA_SECTION: string;
  
  // SEO & Meta
  PAGE_TITLE: string;
  META_DESCRIPTION: string;
  CANONICAL_URL: string;
  URL_PATH: string;
  
  // AI-Optimized Content
  AI_GENERATED_QUESTION: string;
  AI_GENERATED_DIRECT_ANSWER: string;
  STRUCTURED_DATA: string;
  
  // FAQ Section (849% more AI citations)
  FAQ_SECTION: string;
  FAQ_SCHEMA: string;
  HOURS_ANSWER: string;
  CONTACT_ANSWER: string;
  SERVICES_ANSWER: string;
  LOCATION_ANSWER: string;
  CURRENT_STATUS: string;
  FEATURE_HIGHLIGHTS: string;
  
  // Timestamps
  TIMESTAMP: string;
  LAST_UPDATED: string;
  
  // Additional computed fields
  [key: string]: string;
}

/**
 * Load template (Cloudflare edge runtime compatible)
 */
export function loadTemplate(templateName: string): string {
  try {
    return getTemplate(templateName as TemplateType);
  } catch (error) {
    throw new Error(`Failed to load template: ${templateName}. ${error}`);
  }
}

/**
 * Replace template variables with actual values (Cloudflare edge runtime compatible)
 */
export function renderTemplate(template: string, variables: Partial<TemplateVariables>): string {
  // Use the edge-compatible template renderer
  return edgeRenderTemplate(template, variables as Record<string, any>);
}

/**
 * Render business profile template with data
 */
export function renderBusinessProfile(variables: Partial<TemplateVariables>): string {
  const template = loadTemplate('business-profile');
  return renderTemplate(template, variables);
}

/**
 * Render business update template with data
 */
export function renderBusinessUpdate(variables: Partial<TemplateVariables>): string {
  const template = loadTemplate('business-update');
  return renderTemplate(template, variables);
}

/**
 * Render city category template with data
 */
export function renderCityCategory(variables: Partial<TemplateVariables>): string {
  const template = loadTemplate('city-category');
  return renderTemplate(template, variables);
}

/**
 * Validate template variables (development helper)
 */
export function validateTemplateVariables(
  template: string, 
  variables: Partial<TemplateVariables>
): string[] {
  const missingVariables: string[] = [];
  const templateVariables = template.match(/\{\{([^}]+)\}\}/g) || [];
  
  for (const placeholder of templateVariables) {
    const variableName = placeholder.replace(/[{}]/g, '');
    if (!variables[variableName] && variables[variableName] !== '') {
      missingVariables.push(variableName);
    }
  }
  
  return missingVariables;
}

/**
 * Clear template cache (no-op for bundled templates)
 */
export function clearTemplateCache(): void {
  // Templates are now bundled as modules, no cache to clear
}

/**
 * Error types for template operations
 */
export class TemplateError extends Error {
  constructor(message: string, public templateName?: string, public missingVariables?: string[]) {
    super(message);
    this.name = 'TemplateError';
  }
}

/**
 * Validate that all required template variables are present
 */
export function validateRequiredVariables(
  templateName: string,
  variables: Partial<TemplateVariables>
): void {
  const requiredFields: string[] = [
    'BUSINESS_NAME',
    'BUSINESS_CATEGORY', 
    'BUSINESS_ADDRESS_CITY',
    'BUSINESS_ADDRESS_STATE',
    'PAGE_TITLE',
    'META_DESCRIPTION'
  ];
  
  const missingFields = requiredFields.filter(field => !variables[field]);
  
  if (missingFields.length > 0) {
    throw new TemplateError(
      `Missing required template variables: ${missingFields.join(', ')}`,
      templateName,
      missingFields
    );
  }
}

/**
 * Safe template rendering with validation
 */
export function safeRenderTemplate(
  templateName: string,
  variables: Partial<TemplateVariables>
): string {
  try {
    // Validate required variables
    validateRequiredVariables(templateName, variables);
    
    // Load and render template
    const template = loadTemplate(templateName);
    const rendered = renderTemplate(template, variables);
    
    // Validate that critical placeholders were replaced
    const remainingPlaceholders = rendered.match(/\{\{(BUSINESS_NAME|PAGE_TITLE|META_DESCRIPTION)\}\}/g);
    if (remainingPlaceholders) {
      throw new TemplateError(
        `Critical placeholders not replaced: ${remainingPlaceholders.join(', ')}`,
        templateName
      );
    }
    
    return rendered;
  } catch (error) {
    if (error instanceof TemplateError) {
      throw error;
    }
    
    throw new TemplateError(
      `Failed to render template ${templateName}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      templateName
    );
  }
}

/**
 * Safe business profile rendering
 */
export function safeRenderBusinessProfile(variables: Partial<TemplateVariables>): string {
  return safeRenderTemplate('business-profile', variables);
}