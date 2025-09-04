import { PropsWithChildren } from 'react';
import type { Metadata, Viewport } from 'next';
import { Montserrat, Montserrat_Alternates } from 'next/font/google';
import Link from 'next/link';
import { IoLogoFacebook, IoLogoInstagram, IoLogoTwitter } from 'react-icons/io5';

import { Analytics } from '@/components/analytics';
import { Logo } from '@/components/logo';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/utils/cn';

import { Navigation } from './navigation';

import '@/styles/globals.css';

// Removed force-dynamic for better SEO and performance
// Pages that need dynamic rendering should set this individually
// export const dynamic = 'force-dynamic';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
});

const montserratAlternates = Montserrat_Alternates({
  variable: '--font-montserrat-alternates',
  weight: ['500', '600', '700'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://locraven.com'),
  title: 'LocRaven - AI-Powered Local Business Discovery',
  description: 'World\'s first AI-native local business discovery platform. Generate AI-optimized pages for local businesses in 60 seconds.',
  keywords: 'local business, AI discovery, local SEO, business optimization, AI-powered marketing, local search',
  authors: [{ name: 'LocRaven' }],
  creator: 'LocRaven',
  publisher: 'LocRaven',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://locraven.com',
    title: 'LocRaven - AI-Powered Local Business Discovery',
    description: 'World\'s first AI-native local business discovery platform. Generate AI-optimized pages for local businesses in 60 seconds.',
    siteName: 'LocRaven',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'LocRaven - AI-Powered Local Business Discovery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LocRaven - AI-Powered Local Business Discovery',
    description: 'World\'s first AI-native local business discovery platform. Generate AI-optimized pages for local businesses in 60 seconds.',
    creator: '@LocRaven',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: 'https://locraven.com',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  colorScheme: 'dark light',
  viewportFit: 'cover',
};

export default function RootLayout({ children }: PropsWithChildren) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "LocRaven",
    "alternateName": "LocRaven - AI-Powered Local Business Discovery",
    "description": "World's first AI-native local business discovery platform. Generate AI-optimized pages for local businesses in 60 seconds.",
    "url": "https://locraven.com",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Any",
    "creator": {
      "@type": "Organization",
      "name": "LocRaven",
      "url": "https://locraven.com",
      "logo": "https://locraven.com/logo.png",
      "sameAs": [
        "https://twitter.com/LocRaven",
        "https://facebook.com/LocRaven",
        "https://instagram.com/LocRaven"
      ]
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "description": "AI-powered local business discovery and optimization platform"
    },
    "featureList": [
      "AI-generated business pages",
      "Local SEO optimization",
      "Schema markup generation",
      "Multi-intent page creation",
      "Real-time business updates"
    ],
    "audience": {
      "@type": "Audience",
      "audienceType": "Local businesses"
    }
  };

  return (
    <html lang='en'>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className={cn('font-sans antialiased', montserrat.variable, montserratAlternates.variable)}>
        <div className='m-auto flex h-full max-w-[1440px] flex-col px-4'>
          <AppBar />
          <main className='relative flex-1'>
            <div className='relative h-full'>{children}</div>
          </main>
          <Footer />
        </div>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}

async function AppBar() {
  return (
    <header className='flex items-center justify-between py-8'>
      <Logo />
      <Navigation />
    </header>
  );
}

function Footer() {
  return (
    <footer className='mt-8 flex flex-col gap-8 text-neutral-400 lg:mt-32'>
      <div className='flex flex-col justify-between gap-8 lg:flex-row'>
        <div>
          <Logo />
        </div>
        <div className='grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-4 lg:gap-16'>
          <div className='flex flex-col gap-2 lg:gap-6'>
            <div className='font-semibold text-neutral-100'>Product</div>
            <nav className='flex flex-col gap-2 lg:gap-6'>
              <Link href='/pricing'>Pricing</Link>
            </nav>
          </div>
          <div className='flex flex-col gap-2 lg:gap-6'>
            <div className='font-semibold text-neutral-100'>Company</div>
            <nav className='flex flex-col gap-2 lg:gap-6'>
              <Link href='/about-us'>About Us</Link>
              <Link href='/privacy'>Privacy</Link>
              <Link href='/terms'>Terms</Link>
            </nav>
          </div>
          <div className='flex flex-col gap-2 lg:gap-6'>
            <div className='font-semibold text-neutral-100'>Support</div>
            <nav className='flex flex-col gap-2 lg:gap-6'>
              <Link href='/support'>Get Support</Link>
            </nav>
          </div>
          <div className='flex flex-col gap-2 lg:gap-6'>
            <div className='font-semibold text-neutral-100'>Follow us</div>
            <nav className='flex flex-col gap-2 lg:gap-6'>
              <Link href='https://twitter.com/LocRaven' target='_blank' rel='noopener noreferrer'>
                <span className='flex items-center gap-2 hover:text-blue-400 transition-colors'>
                  <IoLogoTwitter size={22} /> <span>Twitter</span>
                </span>
              </Link>
              <Link href='https://facebook.com/LocRaven' target='_blank' rel='noopener noreferrer'>
                <span className='flex items-center gap-2 hover:text-blue-400 transition-colors'>
                  <IoLogoFacebook size={22} /> <span>Facebook</span>
                </span>
              </Link>
              <Link href='https://instagram.com/LocRaven' target='_blank' rel='noopener noreferrer'>
                <span className='flex items-center gap-2 hover:text-blue-400 transition-colors'>
                  <IoLogoInstagram size={22} /> <span>Instagram</span>
                </span>
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className='border-t border-zinc-800 py-6 text-center'>
        <span className='text-neutral4 text-xs'>
          Copyright {new Date().getFullYear()} © LocRaven
        </span>
      </div>
    </footer>
  );
}
