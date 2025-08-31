import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';

interface DynamicPageProps {
  params: {
    slug: string[];
  };
}

// Cache for 1 hour in production, no cache in development
export const revalidate = process.env.NODE_ENV === 'production' ? 3600 : 0;

// Create a server-side Supabase client for data fetching
const supabase = createClient(
  'https://hmztritmqsscxnjhrvqi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtenRyaXRtcXNzY3huamhydnFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjIxNTgsImV4cCI6MjA3MDI5ODE1OH0.SbDaNbMQEhpeENWk_GEJwNXwUWEbh1HpdR0tH-hebLg'
);

// Cache the database query using Next.js caching
const getCachedPublishedPage = unstable_cache(
  async (filePath: string) => {
    try {
      console.log(`Cache miss - fetching page from database: ${filePath}`);
      
      // Query Supabase for published page
      const { data: page, error } = await supabase
        .from('generated_pages')
        .select('*')
        .eq('file_path', filePath)
        .eq('published', true)
        .single();

      if (error) {
        console.error('Error fetching page:', error);
        return null;
      }

      // Check if page is expired
      if (page.expires_at && new Date() > new Date(page.expires_at)) {
        console.log(`Page ${filePath} is expired`);
        return null;
      }

      console.log(`Successfully fetched page: ${page.title}`);
      return page;
    } catch (error) {
      console.error('Error in getCachedPublishedPage:', error);
      return null;
    }
  },
  ['published-page'], // cache key prefix
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ['published-pages'] // Tag for cache invalidation
  }
);

async function getPublishedPage(slug: string[]) {
  const filePath = `/${slug.join('/')}`;
  return getCachedPublishedPage(filePath);
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const page = await getPublishedPage(params.slug);

  if (!page) {
    notFound();
  }

  // Return the HTML content as JSX
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: page.html_content }}
      className="dynamic-page"
    />
  );
}

// Generate static params for known published pages (optional optimization)
export async function generateStaticParams() {
  try {
    const { data: pages, error } = await supabase
      .from('generated_pages')
      .select('file_path')
      .eq('published', true)
      .limit(1000); // Limit to prevent excessive build times

    if (error || !pages) {
      return [];
    }

    return pages.map(page => ({
      slug: page.file_path.substring(1).split('/') // Remove leading slash and split
    }));
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
}

// Metadata for SEO
export async function generateMetadata({ params }: DynamicPageProps) {
  const page = await getPublishedPage(params.slug);

  if (!page) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.'
    };
  }

  // Extract title and description from HTML content
  const titleMatch = page.html_content.match(/<title>(.*?)<\/title>/i);
  const descriptionMatch = page.html_content.match(/<meta name="description" content="(.*?)"/i);

  return {
    title: titleMatch?.[1] || page.title || 'LocRaven Page',
    description: descriptionMatch?.[1] || page.title || 'Local business information',
    openGraph: {
      title: titleMatch?.[1] || page.title,
      description: descriptionMatch?.[1] || page.title,
      url: `https://locraven.com${page.file_path}`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: titleMatch?.[1] || page.title,
      description: descriptionMatch?.[1] || page.title,
    },
  };
}