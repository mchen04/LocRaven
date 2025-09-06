import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';

interface NewBusinessPageProps {
  params: Promise<{
    'city-state': string;
    business: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: NewBusinessPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const supabase = await createSupabaseServerClient();
  
  // Find business by new slug fields
  const { data: business } = await supabase
    .from('businesses')
    .select('name, description, address_city, address_state, primary_category')
    .eq('city_state_slug', resolvedParams['city-state'])
    .eq('url_slug', resolvedParams.business)
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

export default async function NewBusinessPage({ params }: NewBusinessPageProps) {
  const resolvedParams = await params;
  const supabase = await createSupabaseServerClient();
  
  // Construct the expected file path
  const expectedPath = `/${resolvedParams['city-state']}/${resolvedParams.business}`;
  
  try {
    // First get the business data
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('city_state_slug', resolvedParams['city-state'])
      .eq('url_slug', resolvedParams.business)
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