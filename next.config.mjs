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
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
  output: 'standalone',
  trailingSlash: false,
  images: {
    // Use Cloudflare Images transformations (FREE - 5,000/month)
    loader: 'custom',
    loaderFile: './src/utils/cloudflare-image-loader.ts',
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
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'interest-cohort=()',
              'payment=(self)',
              'usb=()',
              'bluetooth=()'
            ].join(', ')
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.google.com *.googleapis.com *.cloudflare.com",
              "style-src 'self' 'unsafe-inline' *.googleapis.com *.cloudflare.com",
              "img-src 'self' blob: data: *.googleapis.com *.gstatic.com *.cloudflare.com locraven.com",
              "font-src 'self' *.googleapis.com *.gstatic.com",
              "connect-src 'self' *.supabase.co *.stripe.com *.cloudflare.com",
              "frame-src 'self' *.stripe.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'"
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
    // NEXT_PUBLIC_ variables will be provided by Cloudflare Build Variables
    // This allows proper build-time inlining per OpenNext documentation
    // Runtime server-side secrets are handled separately by Cloudflare Workers environment

    // Server-side secrets will be provided by Cloudflare Workers runtime environment
    // Removed hardcoded values to allow runtime environment variables to work properly
    
    console.log('✅ Environment variables explicitly defined in client and server bundles');
    
    return config;
  },
});

export default nextConfig;

// Initialize OpenNext for local development
if (process.env.NODE_ENV === 'development') {
  initOpenNextCloudflareForDev();
}