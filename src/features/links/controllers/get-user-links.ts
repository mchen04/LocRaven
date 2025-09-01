import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';
import { Database } from '@/libs/supabase/types';

type GeneratedPage = Database['public']['Tables']['generated_pages']['Row'];

export interface UserLink {
  id: string;
  title: string;
  slug: string | null;
  url: string;
  status: 'active' | 'expired';
  createdAt: string;
  expiresAt: string | null;
  expired: boolean | null;
  published: boolean | null;
  pageType: string | null;
  updateId: string;
}

export async function getUserLinks(): Promise<UserLink[] | null> {
  try {
    const supabase = await createSupabaseServerClient();

    // First get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user?.email) {
      console.error('Auth error:', authError);
      return null;
    }

    // Get business associated with this user's email
    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .eq('email', user.email)
      .single();

    if (!business) {
      // No business profile means no links
      return [];
    }

    // Get generated pages for this business
    const { data: pages, error } = await supabase
      .from('generated_pages')
      .select('*')
      .eq('business_id', business.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching generated pages:', error);
      return null;
    }

    if (!pages) {
      return [];
    }

    // Transform database data to UserLink format
    const links: UserLink[] = pages.map((page: GeneratedPage) => {
      const now = new Date();
      const expiresAt = page.expires_at ? new Date(page.expires_at) : null;
      const isExpired = page.expired || (expiresAt && expiresAt < now) || false;
      
      // Generate URL from slug (assuming your site structure)
      const url = page.slug ? `https://yoursite.com/${page.slug}` : `https://yoursite.com/page/${page.id}`;

      return {
        id: page.id,
        title: page.title,
        slug: page.slug,
        url,
        status: isExpired ? 'expired' : 'active',
        createdAt: page.created_at || new Date().toISOString(),
        expiresAt: page.expires_at,
        expired: page.expired,
        published: page.published,
        pageType: page.page_type,
        updateId: page.update_id,
      };
    });

    return links;
  } catch (error) {
    console.error('Error fetching user links:', error);
    return null;
  }
}