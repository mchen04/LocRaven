import path from 'path';

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
  
  // Experimental features for better performance and smaller bundles
  experimental: {
    scrollRestoration: true,
    // Optimize package imports for tree-shaking
    optimizePackageImports: [
      'lucide-react',
      'react-icons',
      '@radix-ui/react-icons',
      'clsx',
      'tailwind-merge'
    ],
  },
  
  // Server external packages (moved from experimental) - Keep empty for dynamic imports
  serverExternalPackages: [
    // Removed stripe to allow dynamic imports to work properly
  ],
  
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
    // ⚡ CLOUDFLARE WORKERS BUNDLE SIZE OPTIMIZATIONS ⚡
    
    // Advanced tree-shaking for Cloudflare Workers
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      providedExports: true,
      sideEffects: false,
      // Aggressive dead code elimination
      minimize: true,
      // Split chunks for better caching and smaller bundles
      splitChunks: isServer ? false : {
        chunks: 'all',
        minSize: 20000,
        maxSize: 100000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            maxSize: 100000,
          },
          supabase: {
            test: /[\\/]node_modules[\\/]@supabase[\\/]/,
            name: 'supabase',
            chunks: 'all',
            maxSize: 50000,
          },
          stripe: {
            test: /[\\/]node_modules[\\/]stripe[\\/]/,
            name: 'stripe', 
            chunks: 'all',
            maxSize: 50000,
          }
        }
      }
    };

    // Resolve optimizations for smaller bundles  
    config.resolve.alias = {
      ...config.resolve.alias,
      // No special alias needed - use default Stripe resolution
    };

    // Optimize bundle size by handling large string serialization
    if (!isServer) {
      config.cache = {
        type: 'memory',
        maxGenerations: 2,
      };
    }
    
    // Module federation optimizations for CF Workers
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.CF_WORKERS': JSON.stringify(true),
      })
    );
    
    console.log('✅ Cloudflare Workers bundle optimizations enabled');
    
    return config;
  },
});

export default nextConfig;