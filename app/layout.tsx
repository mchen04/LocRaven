import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { AuthProvider } from '@/components/providers/auth-provider';
import { BusinessProvider } from '@/components/providers/business-provider';
import { NotificationProvider } from '@/components/providers/notification-provider';
import { Toaster } from '@/components/ui/sonner';
import '@/lib/styles/globals.css';

// Optimize Google Fonts for Cloudflare edge caching
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'LocRaven - AI-Discoverable Business Updates',
    template: '%s | LocRaven'
  },
  description: 'World\'s first AI-native local business discovery platform. Get your business cited by ChatGPT in 60 seconds.',
  keywords: ['AI search', 'local business', 'ChatGPT', 'Perplexity', 'Claude', 'SEO', 'AI optimization'],
  authors: [{ name: 'LocRaven Team' }],
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
  openGraph: {
    title: 'LocRaven - AI-Discoverable Business Updates',
    description: 'Get your local business cited by ChatGPT and AI assistants in 60 seconds.',
    url: 'https://locraven.com',
    siteName: 'LocRaven',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LocRaven - AI-Discoverable Business Updates',
    description: 'Get your local business cited by ChatGPT and AI assistants in 60 seconds.',
    creator: '@locraven',
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://locraven.com',
  }
};

// Viewport configuration for responsive design
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#6366f1' },
    { media: '(prefers-color-scheme: dark)', color: '#212121' }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${jetbrainsMono.variable}`}>
      <body 
        data-theme="dark" 
        className={`${inter.className} antialiased min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <BusinessProvider>
            <NotificationProvider>
              {children}
              <Toaster />
            </NotificationProvider>
          </BusinessProvider>
        </AuthProvider>
      </body>
    </html>
  );
}