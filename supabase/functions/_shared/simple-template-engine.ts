/**
 * Simplified Template Engine for LocRaven Pages
 * No circular imports, self-contained
 */

export interface PageData {
  business: any;
  update: any;
  seo: { title: string; description: string };
  intent: {
    type: string;
    filePath: string;
    slug: string;
    pageVariant: string;
  };
}

export function createPageData(
  business: any,
  update: any,
  seo: { title: string; description: string },
  intent: any
): PageData {
  return { business, update, seo, intent };
}

export function estimateRenderedSize(data: PageData): number {
  // Estimate final HTML size in KB
  const baseSize = 2; // Base HTML structure
  const contentSize = data.update.content_text.length / 1024;
  const businessDataSize = JSON.stringify(data.business).length / 1024;
  return Math.ceil(baseSize + contentSize + businessDataSize);
}

export function compressPageData(data: PageData): object {
  // Store compressed data with shortened keys - including ALL fields for AI optimization
  return {
    b: { // business
      n: data.business.name,
      c: data.business.address_city,
      s: data.business.address_state,
      st: data.business.address_street,
      z: data.business.zip_code,
      country: data.business.country || 'US',
      p: data.business.phone,
      pcc: data.business.phone_country_code,
      e: data.business.email,
      w: data.business.website,
      d: data.business.description,
      cat: data.business.primary_category,
      srv: data.business.services,
      sp: data.business.specialties,
      h: data.business.hours,
      sh: data.business.structured_hours,
      pr: data.business.price_positioning,
      pm: data.business.payment_methods,
      sa: data.business.service_area,
      sad: data.business.service_area_details,
      aw: data.business.awards,
      cert: data.business.certifications,
      lat: data.business.latitude,
      lng: data.business.longitude,
      lang: data.business.languages_spoken,
      acc: data.business.accessibility_features,
      park: data.business.parking_info,
      epark: data.business.enhanced_parking_info,
      rev: data.business.review_summary,
      stat: data.business.status_override,
      faqs: data.business.business_faqs,
      feat: data.business.featured_items,
      social: data.business.social_media,
      est: data.business.established_year
    },
    u: { // update
      t: data.update.content_text,
      ca: data.update.created_at,
      ea: data.update.expires_at,
      sh: data.update.special_hours_today,
      dt: data.update.deal_terms,
      cat: data.update.update_category,
      faqs: data.update.update_faqs
    },
    seo: data.seo,
    i: data.intent,
    f: data.faqs || []
  };
}