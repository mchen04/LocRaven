import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/utils/supabase/server';
import { processBusinessData } from '@/lib/services/business-profile';
import { getTemplate, renderTemplate } from '@/lib/templates';


interface GeographicPageProps {
  params: Promise<{
    country: string;
    state: string;
    city: string;
    business: string;
    slug?: string[];
  }>;
}

// Aggressive caching strategy for geographic business pages
export const revalidate = 604800; // 1 week with manual invalidation

/**
 * Generate metadata for SEO optimization
 */
export async function generateMetadata({ params }: GeographicPageProps): Promise<Metadata> {
  try {
    const { country, state, city, business, slug } = await params;
    
    // Construct file path for database lookup
    let filePath = `/${country}/${state}/${city}/${business}`;
    if (slug && slug.length > 0) {
      filePath += `/${slug.join('/')}`;
    }

    const supabase = await createClient();
    
    // Try to get generated page first
    const { data: page } = await supabase
      .from('generated_pages')
      .select('title, html_content, business_id')
      .eq('file_path', filePath)
      .single();

    if (page) {
      // Extract meta description from HTML content (basic extraction)
      const metaMatch = page.html_content.match(/<meta name="description" content="([^"]*)">/);
      const description = metaMatch ? metaMatch[1] : `${page.title} - Local business information`;
      
      return {
        title: page.title,
        description: description,
        alternates: {
          canonical: `https://locraven.com${filePath}`,
        },
        openGraph: {
          title: page.title,
          description: description,
          url: `https://locraven.com${filePath}`,
          type: 'website',
          siteName: 'LocRaven',
        },
      };
    }

    // Fallback metadata for geographic location
    const locationName = `${city.charAt(0).toUpperCase() + city.slice(1)}, ${state.toUpperCase()}`;
    const businessName = business.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    return {
      title: `${businessName} in ${locationName} | LocRaven`,
      description: `Find ${businessName} and other local businesses in ${locationName}. Current information and updates.`,
      alternates: {
        canonical: `https://locraven.com${filePath}`,
      },
    };
  } catch {
    // Error generating metadata - using fallback
    
    return {
      title: 'Local Business | LocRaven',
      description: 'Discover local businesses with current information and updates.',
    };
  }
}

/**
 * Get page content from database or generate from business data
 */
async function getPageContent(filePath: string, params: { 
  country: string; 
  state: string; 
  city: string; 
  business: string; 
  slug?: string[]; 
}): Promise<string | null> {
  const supabase = await createClient();
  
  try {
    // First, try to get pre-generated page content
    const { data: page, error: pageError } = await supabase
      .from('generated_pages')
      .select('html_content, title, business_id, page_type, expired')
      .eq('file_path', filePath)
      .single();

    if (!pageError && page && page.html_content && !page.expired) {
      return page.html_content;
    }

    // If no pre-generated content, try to generate from business data
    const businessSlug = params.business;
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('slug', businessSlug)
      .single();

    if (businessError || !business) {
      return null;
    }

    // Generate content using our template system
    const templateVariables = processBusinessData(business);
    
    // Determine template type based on URL structure
    let templateType: 'business-profile' | 'business-update' = 'business-profile';
    if (params.slug && params.slug.length > 0) {
      templateType = 'business-update';
    }

    const template = getTemplate(templateType);
    const html = renderTemplate(template, templateVariables);

    return html;
  } catch {
    // Error getting page content
    return null;
  }
}

/**
 * Geographic Business Page Component  
 */
export default async function GeographicPage({ params }: GeographicPageProps) {
  const resolvedParams = await params;
  const { country, state, city, business, slug } = resolvedParams;
  
  // Construct file path
  let filePath = `/${country}/${state}/${city}/${business}`;
  if (slug && slug.length > 0) {
    filePath += `/${slug.join('/')}`;
  }

  try {
    const pageContent = await getPageContent(filePath, resolvedParams);

    if (!pageContent) {
      notFound();
    }


    return (
      <div
        dangerouslySetInnerHTML={{ __html: pageContent }}
        suppressHydrationWarning={true}
      />
    );
  } catch (error) {
    // Error rendering geographic page
    
    // Fallback error page
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '37.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#ef4444' }}>
            Page Unavailable
          </h1>
          <p style={{ fontSize: '1.125rem', marginBottom: '2rem', color: '#6b7280' }}>
            We&apos;re having trouble loading this business page. The content may still be generating.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              href="/" 
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#6366f1',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600'
              }}
            >
              Go to Homepage
            </Link>
            <Link 
              href="/dashboard" 
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#e2e8f0',
                color: '#334155',
                textDecoration: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600'
              }}
            >
              View Dashboard
            </Link>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '2rem', textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', fontWeight: '600' }}>Debug Info</summary>
              <pre style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                File Path: {filePath}
                {error instanceof Error && `Error: ${error.message}`}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }
}