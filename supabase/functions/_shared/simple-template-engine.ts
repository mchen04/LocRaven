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
  // Store compressed data with shortened keys
  return {
    b: { // business
      n: data.business.name,
      c: data.business.address_city,
      s: data.business.address_state,
      p: data.business.phone,
      e: data.business.email,
      w: data.business.website,
      d: data.business.description,
      cat: data.business.primary_category,
      srv: data.business.services,
      sp: data.business.specialties,
      h: data.business.hours,
      pr: data.business.price_positioning,
    },
    u: { // update
      t: data.update.content_text,
      ca: data.update.created_at,
      ea: data.update.expires_at,
    },
    seo: data.seo,
    i: data.intent
  };
}