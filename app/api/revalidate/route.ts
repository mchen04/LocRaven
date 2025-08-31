import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '../../../lib/utils/supabase/server';


/**
 * API Route for manual cache invalidation - Geographic Route Optimized
 * Handles cache invalidation for geographic business profile URLs
 */
export async function POST(request: NextRequest) {
  try {
    const { businessId, slug, type, filePath } = await request.json();

    // Verify authentication for security
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - must be authenticated to revalidate cache' }, 
        { status: 401 }
      );
    }

    const revalidationPaths: string[] = [];

    if (type === 'business-update' && businessId) {
      // Get business data to construct geographic URLs
      const { data: business } = await supabase
        .from('businesses')
        .select('slug, address_state, address_city, country, primary_category')
        .eq('id', businessId)
        .single();

      if (business) {
        // Construct geographic business profile URL
        const country = (business.country || 'us').toLowerCase();
        const state = (business.address_state || 'ca').toLowerCase();  
        const city = (business.address_city || 'city').toLowerCase().replace(/\s+/g, '-');
        const businessSlug = business.slug;
        
        const businessProfilePath = `/${country}/${state}/${city}/${businessSlug}`;
        revalidatePath(businessProfilePath);
        revalidationPaths.push(businessProfilePath);

        // Also invalidate category listing if it exists
        const categoryPath = `/${country}/${state}/${city}`;
        revalidatePath(categoryPath);
        revalidationPaths.push(categoryPath);

        // If specific update URL provided, invalidate that too
        if (slug) {
          const updatePath = `${businessProfilePath}/${slug}`;
          revalidatePath(updatePath);
          revalidationPaths.push(updatePath);
        }

        // Get all generated pages for this business and invalidate them
        const { data: generatedPages } = await supabase
          .from('generated_pages')
          .select('file_path')
          .eq('business_id', businessId);

        if (generatedPages) {
          for (const page of generatedPages) {
            revalidatePath(page.file_path);
            revalidationPaths.push(page.file_path);
          }
        }
      }

    } else if (filePath) {
      // Direct file path invalidation
      revalidatePath(filePath);
      revalidationPaths.push(filePath);

    } else {
      return NextResponse.json(
        { error: 'Missing required parameters: businessId with type, or filePath' }, 
        { status: 400 }
      );
    }


    return NextResponse.json({ 
      success: true, 
      message: `Cache revalidated for ${revalidationPaths.length} geographic path(s)`,
      revalidatedPaths: revalidationPaths,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Geographic route cache revalidation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to revalidate cache', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for geographic route cache status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const filePath = searchParams.get('filePath');

    if (!businessId && !filePath) {
      return NextResponse.json({ error: 'businessId or filePath parameter required' }, { status: 400 });
    }

    const supabase = await createClient();

    if (businessId) {
      // Get business and its generated pages
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .select('name, slug, address_city, address_state, country, updated_at')
        .eq('id', businessId)
        .single();

      if (businessError || !business) {
        return NextResponse.json({ error: 'Business not found' }, { status: 404 });
      }

      const { data: pages } = await supabase
        .from('generated_pages')
        .select('file_path, title, page_type, updated_at, expired')
        .eq('business_id', businessId);

      const country = (business.country || 'us').toLowerCase();
      const state = (business.address_state || 'ca').toLowerCase();
      const city = (business.address_city || 'city').toLowerCase().replace(/\s+/g, '-');

      return NextResponse.json({
        business: {
          name: business.name,
          slug: business.slug,
          lastUpdated: business.updated_at,
          geographicUrl: `/${country}/${state}/${city}/${business.slug}`
        },
        generatedPages: pages || [],
        cacheStrategy: {
          revalidate: 604800,
          cacheControl: 'public, max-age=604800, stale-while-revalidate=2592000',
          invalidationMethod: 'manual-geographic'
        }
      });
    }

    if (filePath) {
      // Get specific page info
      const { data: page } = await supabase
        .from('generated_pages')
        .select('*')
        .eq('file_path', filePath)
        .single();

      return NextResponse.json({
        page: page || null,
        cacheStrategy: {
          revalidate: 604800,
          geographicOptimized: true
        }
      });
    }

    // Fallback response if no valid parameters
    return NextResponse.json({ error: 'No valid parameters provided' }, { status: 400 });

  } catch {
    return NextResponse.json(
      { error: 'Failed to get cache status' }, 
      { status: 500 }
    );
  }
}