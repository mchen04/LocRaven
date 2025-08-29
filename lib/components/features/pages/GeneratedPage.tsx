'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../utils';

const GeneratedPage: React.FC = () => {
  const params = useParams();
  const { country, state, city, business, slug } = params as { 
    country: string; 
    state: string; 
    city: string; 
    business: string; 
    slug?: string | string[]; 
  };
  const [pageContent, setPageContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadPage = async () => {
      try {
        setLoading(true);
        
        // Construct the file path from URL parameters
        let filePath = `/${country}/${state}/${city}/${business}`;
        if (slug) {
          // Handle slug array from Next.js catch-all routes
          const slugPath = Array.isArray(slug) ? slug.join('/') : slug;
          filePath += `/${slugPath}`;
        }
        
        // Try to find the generated page in database
        const { data: page, error: pageError } = await supabase
          .from('generated_pages')
          .select('*')
          .eq('file_path', filePath)
          .single();

        if (pageError) {
          console.error('Error loading page:', pageError);
          setError('Page not found or still being generated');
          return;
        }

        if (page && page.html_content) {
          setPageContent(page.html_content);
        } else {
          setError('Page content not available');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load page');
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [country, state, city, business, slug]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div>
          <div style={{ 
            width: '2.5rem', 
            height: '2.5rem', 
            border: '0.25rem solid #f3f3f3',
            borderTop: '0.25rem solid #6366f1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Loading business page...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '25rem', padding: '2rem' }}>
          <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Page Not Found</h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>{error}</p>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            This page might still be generating. Please try again in a moment.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Secure rendering using iframe with sandbox restrictions
  // This prevents XSS attacks while still allowing HTML content display
  const htmlBlob = new Blob([pageContent], { type: 'text/html' });
  const htmlUrl = URL.createObjectURL(htmlBlob);
  
  return (
    <iframe
      src={htmlUrl}
      style={{
        width: '100%',
        minHeight: '100vh',
        border: 'none',
        backgroundColor: 'white'
      }}
      sandbox="allow-same-origin allow-scripts"
      title="Generated Business Page"
      onLoad={() => {
        // Clean up object URL after loading
        setTimeout(() => URL.revokeObjectURL(htmlUrl), 1000);
      }}
    />
  );
};

export default GeneratedPage;