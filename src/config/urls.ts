// Central configuration for URLs and environments
// This ensures consistent URL handling across the application

export const config = {
  // R2 Bucket configuration for preview/staging pages
  r2: {
    bucketUrl: process.env.NEXT_PUBLIC_R2_BUCKET_URL || 'https://pub-31a9302263d148d4b7988d574b3c2488.r2.dev',
    
    /**
     * Generate preview URL for a page file path
     * @param filePath - The file path from the generated_pages table
     * @returns Full preview URL
     */
    getPreviewUrl: (filePath: string): string => {
      if (!filePath) {
        console.warn('Preview URL requested with empty file path');
        return '';
      }
      const baseUrl = process.env.NEXT_PUBLIC_R2_BUCKET_URL || 'https://pub-31a9302263d148d4b7988d574b3c2488.r2.dev';
      return `${baseUrl}${filePath}/index.html`;
    }
  },

  // Live site configuration for published pages
  site: {
    baseUrl: process.env.NEXT_PUBLIC_APP_URL || (
      process.env.NODE_ENV === 'production' 
        ? 'https://locraven.com' 
        : 'http://localhost:3000'
    ),
    
    /**
     * Generate live URL for a published page file path
     * @param filePath - The file path from the generated_pages table
     * @returns Full live site URL
     */
    getLiveUrl: (filePath: string): string => {
      if (!filePath) {
        console.warn('Live URL requested with empty file path');
        return '';
      }
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (
        process.env.NODE_ENV === 'production' 
          ? 'https://locraven.com' 
          : 'http://localhost:3000'
      );
      return `${baseUrl}${filePath}`;
    }
  },

  // API configuration
  api: {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  },

  // Environment helpers
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production'
};

// Validation to ensure required environment variables are set
if (!config.api.supabaseUrl || !config.api.supabaseAnonKey) {
  throw new Error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export default config;