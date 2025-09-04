import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://locraven.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/dashboard/',
          '/account/',
          '/manage-subscription/',
          '/auth/',
          '*.json$',
          '/private/',
          '/admin/',
        ],
      },
      // Special rules for search engines
      {
        userAgent: ['Googlebot', 'Bingbot', 'Slurp'],
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/dashboard/',
          '/account/',
          '/manage-subscription/',
          '/auth/',
          '*.json$',
          '/private/',
          '/admin/',
        ],
        crawlDelay: 1,
      },
      // Rules for AI crawlers
      {
        userAgent: ['ChatGPT-User', 'GPTBot', 'Claude-Web', 'PerplexityBot'],
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/dashboard/',
          '/account/',
          '/manage-subscription/',
          '/auth/',
          '*.json$',
          '/private/',
          '/admin/',
        ],
        crawlDelay: 2,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}