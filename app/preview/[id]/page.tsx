import { notFound } from 'next/navigation';
import { supabase } from '../../../lib/utils/supabase/client';

interface PreviewPageProps {
  params: {
    id: string;
  };
}

// No caching for preview pages
export const revalidate = 0;

async function getPreviewPage(pageId: string) {
  try {
    // Query Supabase for any page (published or unpublished) by ID
    const { data: page, error } = await supabase
      .from('generated_pages')
      .select('*')
      .eq('id', pageId)
      .single();

    if (error) {
      console.error('Error fetching preview page:', error);
      return null;
    }

    return page;
  } catch (error) {
    console.error('Error in getPreviewPage:', error);
    return null;
  }
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const page = await getPreviewPage(params.id);

  if (!page) {
    notFound();
  }

  // Return the HTML content with a preview banner
  return (
    <div className="preview-page">
      {/* Preview Banner */}
      <div 
        style={{
          backgroundColor: '#f59e0b',
          color: 'white',
          padding: '12px',
          textAlign: 'center',
          fontWeight: 'bold',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}
      >
        🔍 PREVIEW MODE - This page is not yet published
        {page.published ? ' (Published)' : ' (Draft)'}
        {page.expires_at && ` - Expires: ${new Date(page.expires_at).toLocaleDateString()}`}
      </div>
      
      {/* Page Content */}
      <div 
        dangerouslySetInnerHTML={{ __html: page.html_content }}
        className="preview-content"
      />
    </div>
  );
}

// Metadata for preview pages
export async function generateMetadata({ params }: PreviewPageProps) {
  const page = await getPreviewPage(params.id);

  if (!page) {
    return {
      title: 'Preview Not Found',
      description: 'The requested preview page could not be found.'
    };
  }

  // Extract title from HTML content
  const titleMatch = page.html_content.match(/<title>(.*?)<\/title>/i);

  return {
    title: `Preview: ${titleMatch?.[1] || page.title || 'LocRaven Page'}`,
    description: `Preview of ${page.title || 'LocRaven page'}`,
    robots: {
      index: false,
      follow: false,
    },
  };
}