import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://locraven.com'
  const currentDate = new Date()
  const lastModified = currentDate.toISOString()

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: lastModified,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: lastModified,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: lastModified,
      changeFrequency: 'never',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: lastModified,
      changeFrequency: 'never',
      priority: 0.8,
    },
  ]

  // Note: Dynamic business pages would be added here when available
  // For now, we're focusing on the static marketing and app pages
  // Dynamic routes like /business/[slug] would be fetched from the database

  return staticRoutes
}