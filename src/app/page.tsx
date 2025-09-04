import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { Container } from '@/components/container';
import { DiscoveryImpactSection } from '@/components/discovery-impact-section';
import { Button } from '@/components/ui/button';
import { PricingSection } from '@/features/pricing/components/pricing-section';

export const metadata: Metadata = {
  metadataBase: new URL('https://locraven.com'),
  title: 'LocRaven - AI-Powered Local Business Discovery Platform',
  description: 'Generate AI-optimized pages for local businesses in 60 seconds. Get discovered by ChatGPT, Claude, and Perplexity. The world\'s first AI-native local business discovery platform.',
  keywords: [
    'local business discovery', 'AI business pages', 'local SEO', 'business optimization', 
    'AI-powered marketing', 'local search', 'ChatGPT business', 'Claude business discovery',
    'Perplexity business', 'AI citations', 'local business AI', 'business discovery platform'
  ],
  authors: [{ name: 'LocRaven Team', url: 'https://locraven.com' }],
  creator: 'LocRaven',
  publisher: 'LocRaven',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  category: 'business',
  classification: 'business software',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://locraven.com',
    siteName: 'LocRaven',
    title: 'LocRaven - AI-Powered Local Business Discovery Platform',
    description: 'Generate AI-optimized pages for local businesses in 60 seconds. Get discovered by ChatGPT, Claude, and Perplexity. The world\'s first AI-native local business discovery platform.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'LocRaven - AI-Powered Local Business Discovery Platform',
        type: 'image/png',
      },
      {
        url: '/hero-shape.png',
        width: 867,
        height: 790,
        alt: 'LocRaven AI-optimized business pages',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@LocRaven',
    creator: '@LocRaven',
    title: 'LocRaven - AI-Powered Local Business Discovery Platform',
    description: 'Generate AI-optimized pages for local businesses in 60 seconds. Get discovered by ChatGPT, Claude, and Perplexity.',
    images: {
      url: '/logo.png',
      alt: 'LocRaven - AI-Powered Local Business Discovery Platform',
    },
  },
  alternates: {
    canonical: 'https://locraven.com',
    types: {
      'application/rss+xml': [
        { url: '/rss.xml', title: 'LocRaven Blog RSS Feed' },
      ],
    },
  },
  other: {
    'application-name': 'LocRaven',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'LocRaven',
    'theme-color': '#000000',
    'color-scheme': 'dark',
    // Geographic meta tags for local business discovery
    'geo.region': 'US',
    'geo.placename': 'United States',
    'geo.position': '40.7128;-74.0060',
    'ICBM': '40.7128, -74.0060',
    // Local business targeting
    'coverage': 'Worldwide',
    'distribution': 'Global',
    'target-country': 'US',
    'language': 'en',
    'locality': 'United States',
  },
};

export default async function HomePage() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "LocRaven",
    "alternateName": "LocRaven - AI-Powered Local Business Discovery Platform",
    "description": "World's first AI-native local business discovery platform. Generate AI-optimized pages for local businesses in 60 seconds. Get discovered by ChatGPT, Claude, and Perplexity.",
    "url": "https://locraven.com",
    "logo": "https://locraven.com/logo.png",
    "image": "https://locraven.com/hero-shape.png",
    "telephone": "+1-555-LOCRAVEN",
    "email": "hello@locraven.com",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US",
      "addressRegion": "United States"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "serviceArea": {
      "@type": "Country", 
      "name": "United States"
    },
    "category": ["Business Software", "Marketing Technology", "Local SEO", "AI Business Tools"],
    "priceRange": "Free - $99/month",
    "paymentAccepted": ["Credit Card", "Stripe"],
    "currenciesAccepted": "USD",
    "openingHours": "Mo-Fr 09:00-17:00",
    "availableLanguage": ["English"],
    "serviceType": "AI-Powered Business Discovery",
    "slogan": "Get discovered by AI in 60 seconds",
    "foundingDate": "2024",
    "numberOfEmployees": "1-10",
    "knowsAbout": [
      "Local Business Discovery",
      "AI Marketing",
      "Search Engine Optimization",
      "ChatGPT Business Optimization", 
      "Claude AI Business Discovery",
      "Perplexity Business Citations",
      "Local SEO",
      "Business Schema Markup"
    ],
    "mainEntityOfPage": "https://locraven.com",
    "sameAs": [
      "https://twitter.com/LocRaven",
      "https://facebook.com/LocRaven", 
      "https://instagram.com/LocRaven"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "LocRaven AI Business Discovery Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AI Business Page Generation",
            "description": "Generate 6 different AI-optimized pages for local business discovery"
          },
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "AI Citation Optimization",
            "description": "Get discovered by ChatGPT, Claude, Perplexity and other AI platforms"
          },
          "price": "29",
          "priceCurrency": "USD", 
          "availability": "https://schema.org/InStock"
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <div className='flex flex-col gap-8 lg:gap-32'>
        <HeroSection />
        <DiscoveryImpactSection />
        <PricingSection />
      </div>
    </>
  );
}

function HeroSection() {
  return (
    <section className='relative overflow-hidden lg:overflow-visible'>
      <Container className='relative rounded-lg bg-black py-20 lg:py-[140px]'>
        <div className='relative z-10 flex flex-col gap-5 lg:max-w-xl lg:pl-8'>
          <div className='w-fit rounded-full bg-gradient-to-r from-[#616571] via-[#7782A9] to-[#826674] px-4 py-1 '>
            <span className='font-alt text-sm font-semibold text-black mix-blend-soft-light'>
              Generate pages with AI
            </span>
          </div>
          <h1>AI-optimized pages for local businesses.</h1>
          <Button asChild variant='sexy'>
            <Link href='/signup'>Get started for free</Link>
          </Button>
        </div>
      </Container>
      <Image
        src='/hero-shape.png'
        width={867}
        height={790}
        alt='LocRaven AI-optimized business pages visualization'
        className='absolute right-0 top-0 rounded-tr-lg'
        priority
        quality={75}
        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw'
      />
    </section>
  );
}

