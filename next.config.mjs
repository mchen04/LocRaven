import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Bundle analyzer setup
const withBundleAnalyzer = process.env.ANALYZE === 'true' 
  ? await import('@next/bundle-analyzer').then(mod => mod.default({ enabled: true }))
  : (config) => config;

/** @type {import('next').NextConfig} */
const nextConfig = withBundleAnalyzer({
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
  output: 'standalone',
  trailingSlash: false,
  images: {
    // Use Cloudflare image optimization for OpenNext deployment
    loader: "custom",
    loaderFile: "./image-loader.ts",
    // Allowed image domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'locraven.com',
      }
    ],
  },
  // Performance and SEO optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection', 
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.google.com *.googleapis.com",
              "style-src 'self' 'unsafe-inline' *.googleapis.com",
              "img-src 'self' blob: data: *.googleapis.com *.gstatic.com",
              "font-src 'self' *.googleapis.com *.gstatic.com",
              "connect-src 'self' *.supabase.co *.stripe.com",
              "frame-src 'self' *.stripe.com"
            ].join('; ')
          }
        ],
      },
    ];
  },
  
  // Experimental features for better performance
  experimental: {
    scrollRestoration: true,
  },
  
  // Turbopack configuration (Next.js 15.5)
  turbopack: {
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },
  
  // Enable typed routes for compile-time route safety
  typedRoutes: true,
  
  // Ensure environment variables are available during build for client-side inlining
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  
  // Add build-time validation and explicit environment variable definition
  webpack: (config, { isServer, webpack }) => {
    // Optimize bundle size by handling large string serialization
    if (!isServer) {
      config.cache = {
        type: 'memory',
        maxGenerations: 2,
      };
    }
    // Define environment variables explicitly for both client and server builds (Cloudflare Pages compatibility)
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify('https://hmztritmqsscxnjhrvqi.supabase.co'),
        'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtenRyaXRtcXNzY3huamhydnFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjIxNTgsImV4cCI6MjA3MDI5ODE1OH0.SbDaNbMQEhpeENWk_GEJwNXwUWEbh1HpdR0tH-hebLg'),
        'process.env.NEXT_PUBLIC_APP_URL': JSON.stringify('https://locraven.com'),
        'process.env.NEXT_PUBLIC_LANDING_URL': JSON.stringify('https://locraven.com'),
      })
    );

    // Add server-side secrets for build-time analysis (Cloudflare runtime will override)
    if (isServer) {
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.SUPABASE_SERVICE_ROLE_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtenRyaXRtcXNzY3huamhydnFpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDcyMjE1OCwiZXhwIjoyMDcwMjk4MTU4fQ.placeholder-for-build-time-analysis'),
          'process.env.STRIPE_SECRET_KEY': JSON.stringify('sk_placeholder_for_build_time_analysis'),
        })
      );
    }
    
    console.log('✅ Environment variables explicitly defined in client and server bundles');
    
    return config;
  },
});

export default nextConfig;

// Initialize OpenNext for local development
if (process.env.NODE_ENV === 'development') {
  initOpenNextCloudflareForDev();
}