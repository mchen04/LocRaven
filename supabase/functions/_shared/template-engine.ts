import { PageData } from './templates/base-template.ts';
import { renderTemplate } from './templates/intent-templates.ts';

/**
 * Template Engine for LocRaven Pages
 * Converts page data to HTML using intent-specific templates
 */

export { PageData, renderTemplate };

export function createPageData(
  business: any,
  update: any,
  seo: { title: string; description: string },
  intent: {
    type: 'direct' | 'local' | 'category' | 'branded-local' | 'service-urgent' | 'competitive';
    filePath: string;
    slug: string;
    pageVariant: string;
  },
  faqs?: any[]
): PageData {
  return {
    business: {
      name: business.name,
      address_city: business.address_city,
      address_state: business.address_state,
      address_street: business.address_street,
      zip_code: business.zip_code,
      country: business.country,
      phone: business.phone,
      email: business.email,
      website: business.website,
      description: business.description,
      services: business.services,
      specialties: business.specialties,
      hours: business.hours,
      price_positioning: business.price_positioning,
      payment_methods: business.payment_methods,
      primary_category: business.primary_category,
      service_area: business.service_area,
      awards: business.awards,
      certifications: business.certifications,
    },
    update: {
      content_text: update.content_text,
      created_at: update.created_at,
      expires_at: update.expires_at,
    },
    seo,
    intent,
    faqs: faqs?.map(faq => ({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      voiceSearchTriggers: faq.voiceSearchTriggers || []
    }))
  };
}

export function estimateRenderedSize(data: PageData): number {
  // Estimate final HTML size in KB
  const baseSize = 2; // Base HTML structure
  const contentSize = data.update.content_text.length / 1024;
  const businessDataSize = JSON.stringify(data.business).length / 1024;
  const faqSize = (data.faqs?.length || 0) * 0.5; // ~0.5KB per FAQ
  
  return Math.ceil(baseSize + contentSize + businessDataSize + faqSize);
}

export function compressPageData(data: PageData): object {
  // Store only essential data, omit undefined/null values
  const compressed = {
    b: { // business (shortened keys to save space)
      n: data.business.name,
      c: data.business.address_city,
      s: data.business.address_state,
      p: data.business.phone,
      e: data.business.email,
      w: data.business.website,
      d: data.business.description,
      cat: data.business.primary_category,
      // Only include if exists
      ...(data.business.address_street && { st: data.business.address_street }),
      ...(data.business.zip_code && { z: data.business.zip_code }),
      ...(data.business.services && { srv: data.business.services }),
      ...(data.business.specialties && { sp: data.business.specialties }),
      ...(data.business.hours && { h: data.business.hours }),
      ...(data.business.price_positioning && { pr: data.business.price_positioning }),
      ...(data.business.service_area && { sa: data.business.service_area }),
      ...(data.business.awards && { aw: data.business.awards }),
      ...(data.business.certifications && { cert: data.business.certifications }),
    },
    u: { // update
      t: data.update.content_text,
      ca: data.update.created_at,
      ...(data.update.expires_at && { ea: data.update.expires_at }),
    },
    seo: data.seo,
    i: data.intent, // intent
    ...(data.faqs && { f: data.faqs }) // faqs
  };

  return compressed;
}