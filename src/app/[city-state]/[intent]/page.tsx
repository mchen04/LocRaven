import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';

interface IntentPageProps {
  params: Promise<{
    'city-state': string;
    intent: string;
  }>;
}

// Valid intent types
const VALID_INTENTS = ['open-now', 'deals', 'events', 'new-services'] as const;

// Generate metadata for SEO
export async function generateMetadata({ params }: IntentPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  
  // Validate intent
  if (!VALID_INTENTS.includes(resolvedParams.intent as any)) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }
  
  // Parse city and state from slug
  const [city, state] = resolvedParams['city-state'].split('-');
  const cityName = city?.charAt(0).toUpperCase() + city?.slice(1);
  const stateName = state?.toUpperCase();
  
  const intentNames = {
    'open-now': 'Open Now',
    'deals': 'Current Deals',
    'events': 'Upcoming Events',
    'new-services': 'New Services'
  };
  
  const intentName = intentNames[resolvedParams.intent as keyof typeof intentNames];
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

export default async function IntentPage({ params }: IntentPageProps) {
  const resolvedParams = await params;
  const supabase = await createSupabaseServerClient();
  
  // Validate intent
  if (!VALID_INTENTS.includes(resolvedParams.intent as any)) {
    notFound();
  }
  
  try {
    // First check if we have a pre-rendered intent page
    const { data: generatedPage } = await supabase
      .from('generated_pages')
      .select('html_content, title, published')
      .eq('file_path', `/${resolvedParams['city-state']}/${resolvedParams.intent}`)
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
    const { data: businesses, error } = await supabase
      .from('businesses')
      .select('name, url_slug, description, primary_category, address_street, address_city, address_state, hours')
      .eq('city_state_slug', resolvedParams['city-state'])
      .eq('is_onboarded', true);

    if (error) {
      console.error('Error loading businesses:', error);
      notFound();
    }

    // Parse city and state from slug
    const [city, state] = resolvedParams['city-state'].split('-');
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
    
    const config = intentConfig[resolvedParams.intent as keyof typeof intentConfig];

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
                href={`/${resolvedParams['city-state']}`}
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
                    href={`/${resolvedParams['city-state']}/${business.url_slug}`}
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
                {VALID_INTENTS.filter(intent => intent !== resolvedParams.intent).map((intent) => {
                  const otherConfig = intentConfig[intent];
                  return (
                    <Link 
                      key={intent}
                      href={`/${resolvedParams['city-state']}/${intent}`}
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