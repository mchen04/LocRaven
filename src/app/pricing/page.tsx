import type { Metadata } from 'next';

import { PricingSection } from '@/features/pricing/components/pricing-section';

// Required for Cloudflare Pages deployment
export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Pricing - LocRaven AI Business Discovery Platform',
  description: 'Affordable AI-powered local business discovery plans. Get found by ChatGPT, Claude, and Perplexity. Starting free with pay-per-use options for growing businesses.',
  keywords: [
    'LocRaven pricing', 'AI business discovery pricing', 'local business AI cost', 
    'ChatGPT business discovery price', 'AI optimization pricing', 'local SEO pricing',
    'business discovery platform cost', 'AI citation pricing'
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Pricing - LocRaven AI Business Discovery Platform',
    description: 'Affordable AI-powered local business discovery plans. Get found by ChatGPT, Claude, and Perplexity. Starting free with pay-per-use options.',
    url: 'https://locraven.com/pricing',
    type: 'website',
    siteName: 'LocRaven',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'LocRaven Pricing - AI Business Discovery Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing - LocRaven AI Business Discovery Platform',
    description: 'Affordable AI-powered local business discovery plans. Get found by ChatGPT, Claude, and Perplexity.',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: 'https://locraven.com/pricing',
  },
};

export default async function PricingPage() {
  return <PricingSection isPricingPage />;
}
