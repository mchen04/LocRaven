import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';

interface SlugPageProps {
  params: Promise<{
    'city-state': string;
    slug: string;
  }>;
}

// Valid intent types
const VALID_INTENTS = ['open-now', 'deals', 'events', 'new-services'] as const;

// Business type for listings
interface BusinessListing {
  name: string;
  url_slug: string;
  description?: string;
  primary_category: string;
  address_street?: string;
  address_city: string;
  address_state: string;
  hours?: string;
}

// Check if slug is an intent
const isIntent = (slug: string): slug is typeof VALID_INTENTS[number] => {
  return VALID_INTENTS.includes(slug as any);
};

// Generate metadata for SEO
export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const supabase = await createSupabaseServerClient();
  
  // Parse city and state from slug
  const [city, state] = resolvedParams['city-state'].split('-');
  const cityName = city?.charAt(0).toUpperCase() + city?.slice(1);
  const stateName = state?.toUpperCase();
  
  // Check if it's an intent page
  if (isIntent(resolvedParams.slug)) {
    const intentNames = {
      'open-now': 'Open Now',
      'deals': 'Current Deals',
      'events': 'Upcoming Events',
      'new-services': 'New Services'
    };
    
    const intentName = intentNames[resolvedParams.slug];
    const title = `${intentName} in ${cityName}, ${stateName} - LocRaven`;
    const description = `Find businesses with ${intentName.toLowerCase()} in ${cityName}, ${stateName}. Updated in real-time.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        siteName: 'LocRaven',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  }
  
  // Business page metadata
  const { data: business } = await supabase
    .from('businesses')
    .select('name, description, address_city, address_state, primary_category')
    .eq('city_state_slug', resolvedParams['city-state'])
    .eq('url_slug', resolvedParams.slug)
    .single();

  if (!business) {
    return {
      title: 'Business Not Found',
      description: 'The requested business page could not be found.',
    };
  }

  const title = `${business.name} - ${business.address_city}, ${business.address_state}`;
  const description = business.description || 
    `Visit ${business.name} in ${business.address_city}, ${business.address_state}. ${business.primary_category} services and more.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'LocRaven',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function SlugPage({ params }: SlugPageProps) {
  const resolvedParams = await params;
  const supabase = await createSupabaseServerClient();
  
  // Check if this is an intent page
  if (isIntent(resolvedParams.slug)) {
    return renderIntentPage({
      'city-state': resolvedParams['city-state'],
      slug: resolvedParams.slug
    }, supabase);
  }
  
  // Otherwise, treat as business page
  return renderBusinessPage(resolvedParams, supabase);
}

// Intent page rendering
async function renderIntentPage(
  params: { 'city-state': string; slug: typeof VALID_INTENTS[number] },
  supabase: any
) {
  try {
    // First check if we have a pre-rendered intent page
    const { data: generatedPage } = await supabase
      .from('generated_pages')
      .select('html_content, title, published')
      .eq('file_path', `/${params['city-state']}/${params.slug}`)
      .eq('page_category', 'intent')
      .eq('published', true)
      .single();

    // If we have pre-rendered HTML, serve it directly
    if (generatedPage?.html_content) {
      return (
        <div 
          className="min-h-screen"
          dangerouslySetInnerHTML={{ __html: generatedPage.html_content }}
        />
      );
    }
    
    // Fallback: Generate basic intent page
    const { data: businesses, error }: { data: BusinessListing[] | null; error: any } = await supabase
      .from('businesses')
      .select('name, url_slug, description, primary_category, address_street, address_city, address_state, hours')
      .eq('city_state_slug', params['city-state'])
      .eq('is_onboarded', true);

    if (error) {
      console.error('Error loading businesses:', error);
      notFound();
    }

    // Parse city and state from slug
    const [city, state] = params['city-state'].split('-');
    const cityName = city?.charAt(0).toUpperCase() + city?.slice(1);
    const stateName = state?.toUpperCase();
    
    const intentConfig = {
      'open-now': {
        title: 'Open Now',
        emoji: '🟢',
        description: 'Businesses currently open for service',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800'
      },
      'deals': {
        title: 'Current Deals',
        emoji: '🔥',
        description: 'Special offers and promotions available now',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800'
      },
      'events': {
        title: 'Upcoming Events',
        emoji: '📅',
        description: 'Events, workshops, and special occasions',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800'
      },
      'new-services': {
        title: 'New Services',
        emoji: '✨',
        description: 'Recently added services and offerings',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        textColor: 'text-purple-800'
      }
    };
    
    const config = intentConfig[params.slug];

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Header */}
            <div className={`${config.bgColor} ${config.borderColor} border-l-4 p-6 mb-8 rounded-r-lg`}>
              <h1 className={`text-3xl font-bold ${config.textColor} mb-2`}>
                {config.emoji} {config.title} in {cityName}, {stateName}
              </h1>
              <p className={`${config.textColor} opacity-80`}>
                {config.description}
              </p>
            </div>
            
            {/* Back to City Hub */}
            <div className="mb-6">
              <Link 
                href={`/${params['city-state']}`}
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-2"
              >
                ← Back to {cityName}, {stateName} Directory
              </Link>
            </div>
            
            {/* Business Listings */}
            {businesses && businesses.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businesses.map((business) => (
                  <Link
                    key={business.url_slug}
                    href={`/${params['city-state']}/${business.url_slug}`}
                    className="block bg-gray-50 hover:bg-gray-100 p-6 rounded-lg border transition-colors"
                  >
                    <h3 className="font-semibold text-lg mb-2">{business.name}</h3>
                    {business.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {business.description}
                      </p>
                    )}
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600 font-medium">
                          {business.primary_category}
                        </span>
                      </div>
                      <div className="text-gray-500">
                        {business.address_city}, {business.address_state}
                      </div>
                      {business.hours && (
                        <div className="text-gray-500 text-xs">
                          {business.hours}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">{config.emoji}</div>
                <p className="text-gray-500 text-lg mb-2">
                  No businesses found for {config.title.toLowerCase()} in this area.
                </p>
                <p className="text-gray-400 text-sm">
                  Check back soon for updates!
                </p>
              </div>
            )}
            
            {/* Other Intent Links */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-4">Explore More</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {VALID_INTENTS.filter(intent => intent !== params.slug).map((intent) => {
                  const otherConfig = intentConfig[intent];
                  return (
                    <Link 
                      key={intent}
                      href={`/${params['city-state']}/${intent}`}
                      className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition-colors"
                    >
                      <div className="text-2xl mb-2">{otherConfig.emoji}</div>
                      <div className="font-medium text-sm">{otherConfig.title}</div>
                    </Link>
                  );
                })}
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t text-center">
              <p className="text-sm text-gray-500">
                Real-time business information powered by LocRaven AI
              </p>
            </div>
          </div>
        </div>
      </div>
    );

  } catch (error) {
    console.error('Error loading intent page:', error);
    notFound();
  }
}

// Business page rendering
async function renderBusinessPage(
  params: { 'city-state': string; slug: string },
  supabase: any
) {
  // Construct the expected file path
  const expectedPath = `/${params['city-state']}/${params.slug}`;
  
  try {
    // First get the business data
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('city_state_slug', params['city-state'])
      .eq('url_slug', params.slug)
      .single();

    if (businessError || !business) {
      console.error('Business not found:', businessError);
      notFound();
    }

    // Get the pre-rendered page content
    const { data: generatedPage, error: pageError } = await supabase
      .from('generated_pages')
      .select('html_content, title, published')
      .eq('business_id', business.id)
      .eq('file_path', expectedPath)
      .eq('page_category', 'business')
      .eq('published', true)
      .single();

    // If we have pre-rendered HTML, serve it directly
    if (generatedPage?.html_content && !pageError) {
      return (
        <div 
          className="min-h-screen"
          dangerouslySetInnerHTML={{ __html: generatedPage.html_content }}
        />
      );
    }
    
    // Fallback: Generate basic page if HTML not found
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold mb-4">{business.name}</h1>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">About</h2>
                {business.description ? (
                  <p className="text-gray-700 mb-4">{business.description}</p>
                ) : (
                  <p className="text-gray-500 mb-4">No description available.</p>
                )}
                
                <div className="space-y-2">
                  <p><strong>Category:</strong> {business.primary_category}</p>
                  {business.established_year && (
                    <p><strong>Established:</strong> {business.established_year}</p>
                  )}
                </div>
              </div>
            
              <div>
                <h2 className="text-xl font-semibold mb-3">Contact & Location</h2>
                <div className="space-y-2">
                  <p><strong>📍 Address:</strong></p>
                  <address className="not-italic text-gray-700 ml-4">
                    {business.address_street && <div>{business.address_street}</div>}
                    <div>{business.address_city}, {business.address_state} {business.zip_code}</div>
                  </address>
                  
                  {business.phone && (
                    <p><strong>📞 Phone:</strong> <a href={`tel:${business.phone}`} className="text-blue-600 hover:underline">{business.phone}</a></p>
                  )}
                  
                  {business.website && (
                    <p><strong>🌐 Website:</strong> <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{business.website}</a></p>
                  )}
                </div>
              </div>
            </div>
            
            {business.hours && (
              <div className="mt-6 pt-6 border-t">
                <h2 className="text-xl font-semibold mb-3">Hours</h2>
                <p className="text-gray-700">{business.hours}</p>
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t text-center">
              <p className="text-sm text-gray-500">
                This page is automatically updated when business information changes.
              </p>
            </div>
          </div>
        </div>
      </div>
    );

  } catch (error) {
    console.error('Error loading business page:', error);
    notFound();
  }
}