import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';

interface CityHubPageProps {
  params: Promise<{
    'city-state': string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CityHubPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  
  // Parse city and state from slug
  const [city, state] = resolvedParams['city-state'].split('-');
  const cityName = city?.charAt(0).toUpperCase() + city?.slice(1);
  const stateName = state?.toUpperCase();
  
  const title = `${cityName}, ${stateName} Business Directory - LocRaven`;
  const description = `Discover local businesses in ${cityName}, ${stateName}. AI-optimized directory with current deals, hours, and services.`;

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

export default async function CityHubPage({ params }: CityHubPageProps) {
  const resolvedParams = await params;
  const supabase = await createSupabaseServerClient();
  
  try {
    // First check if we have a pre-rendered city hub page
    const { data: generatedPage } = await supabase
      .from('generated_pages')
      .select('html_content, title, published')
      .eq('file_path', `/${resolvedParams['city-state']}` as any)
      .eq('page_category', 'city-hub' as any)
      .eq('published', true as any)
      .single();

    // If we have pre-rendered HTML, serve it directly
    if ((generatedPage as any)?.html_content) {
      return (
        <div 
          className="min-h-screen"
          dangerouslySetInnerHTML={{ __html: (generatedPage as any).html_content }}
        />
      );
    }
    
    // Fallback: Generate basic city page
    const { data: businesses, error } = await supabase
      .from('businesses')
      .select('name, url_slug, description, primary_category, address_street, address_city, address_state')
      .eq('city_state_slug', resolvedParams['city-state'] as any)
      .eq('is_onboarded', true as any);

    if (error) {
      console.error('Error loading businesses:', error);
      notFound();
    }

    // Parse city and state from slug
    const [city, state] = resolvedParams['city-state'].split('-');
    const cityName = city?.charAt(0).toUpperCase() + city?.slice(1);
    const stateName = state?.toUpperCase();

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold mb-6">{cityName}, {stateName} Business Directory</h1>
            
            {/* Quick Navigation */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Link 
                href={`/${resolvedParams['city-state']}/open-now`}
                className="bg-green-100 hover:bg-green-200 p-4 rounded-lg text-center transition-colors"
              >
                <div className="text-green-600 font-semibold">🟢 Open Now</div>
                <div className="text-sm text-gray-600">Currently open</div>
              </Link>
              <Link 
                href={`/${resolvedParams['city-state']}/deals`}
                className="bg-red-100 hover:bg-red-200 p-4 rounded-lg text-center transition-colors"
              >
                <div className="text-red-600 font-semibold">🔥 Deals</div>
                <div className="text-sm text-gray-600">Special offers</div>
              </Link>
              <Link 
                href={`/${resolvedParams['city-state']}/events`}
                className="bg-blue-100 hover:bg-blue-200 p-4 rounded-lg text-center transition-colors"
              >
                <div className="text-blue-600 font-semibold">📅 Events</div>
                <div className="text-sm text-gray-600">Upcoming events</div>
              </Link>
              <Link 
                href={`/${resolvedParams['city-state']}/new-services`}
                className="bg-purple-100 hover:bg-purple-200 p-4 rounded-lg text-center transition-colors"
              >
                <div className="text-purple-600 font-semibold">✨ New</div>
                <div className="text-sm text-gray-600">Latest services</div>
              </Link>
            </div>

            {/* Business Listings */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4">All Businesses</h2>
              
              {businesses && businesses.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(businesses as any)?.map((business: any) => (
                    <Link
                      key={business.url_slug}
                      href={`/${resolvedParams['city-state']}/${business.url_slug}`}
                      className="block bg-gray-50 hover:bg-gray-100 p-6 rounded-lg border transition-colors"
                    >
                      <h3 className="font-semibold text-lg mb-2">{business.name}</h3>
                      {business.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {business.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-600 font-medium">
                          {business.primary_category}
                        </span>
                        <span className="text-gray-500">
                          {business.address_city}, {business.address_state}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No businesses found in this area.</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Be the first to add your business to {cityName}, {stateName}!
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-8 pt-6 border-t text-center">
              <p className="text-sm text-gray-500">
                Discover local businesses powered by LocRaven AI
              </p>
            </div>
          </div>
        </div>
      </div>
    );

  } catch (error) {
    console.error('Error loading city hub page:', error);
    notFound();
  }
}