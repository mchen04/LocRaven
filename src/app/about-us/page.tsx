import { Metadata } from 'next';
import Link from 'next/link';

import { MarketingLayout, PageSection } from '@/components/marketing-layout';

export const metadata: Metadata = {
  title: 'About Us - LocRaven',
  description: 'Learn about LocRaven\'s mission to make every local business AI-discoverable and level the playing field against big chains.',
  keywords: 'LocRaven, local business, AI discovery, business optimization, local SEO, company mission',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'About Us - LocRaven',
    description: 'Learn about LocRaven\'s mission to make every local business AI-discoverable and level the playing field against big chains.',
    type: 'website',
    url: 'https://locraven.com/about-us',
    siteName: 'LocRaven',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'About LocRaven - AI-Powered Local Business Discovery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us - LocRaven',
    description: 'Learn about LocRaven\'s mission to make every local business AI-discoverable and level the playing field against big chains.',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: 'https://locraven.com/about-us',
  },
};

export default function AboutUsPage() {
  return (
    <MarketingLayout
      title="About LocRaven"
      description="We're on a mission to make every local business AI-discoverable in 60 seconds."
    >
      <PageSection title="Our Mission" id="mission">
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-700/50 p-8 rounded-lg mb-6">
          <p className="text-xl text-white font-medium mb-4">
            &quot;Every local business deserves to be found when customers need them most.&quot;
          </p>
          <p className="text-lg text-neutral-300">
            We believe local businesses are the heart of every community. Our mission is to level 
            the playing field, giving small businesses the same AI-powered discovery advantages 
            that big chains have always enjoyed.
          </p>
        </div>
        <p>
          In a world where 73% of searches now happen through AI chatbots and voice assistants, 
          local businesses were being left behind. That&apos;s why we created LocRaven - to ensure 
          that when someone asks &quot;What&apos;s the best restaurant near me?&quot; or &quot;Who can fix my car today?&quot;, 
          your business has an equal chance to be recommended.
        </p>
      </PageSection>

      <PageSection title="The Problem We're Solving" id="problem">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-red-900/10 border border-red-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-red-300 mb-4">Before LocRaven</h3>
            <ul className="space-y-3 text-neutral-200">
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-1">✗</span>
                Local businesses invisible to AI search
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-1">✗</span>
                Only big chains get AI recommendations
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-1">✗</span>
                Complex, expensive marketing tools
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-1">✗</span>
                Weeks to create optimized content
              </li>
            </ul>
          </div>
          
          <div className="bg-green-900/10 border border-green-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-green-300 mb-4">With LocRaven</h3>
            <ul className="space-y-3 text-neutral-200">
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                AI-optimized presence in 60 seconds
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                849% more AI citations and mentions
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                Affordable for any business size
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                Instant updates and publishing
              </li>
            </ul>
          </div>
        </div>

        <p>
          We&apos;ve seen too many incredible local businesses struggle to compete online, not because 
          they lack quality or service, but because they lacked the AI optimization that customers 
          now expect. LocRaven changes that equation.
        </p>
      </PageSection>

      <PageSection title="Our Solution" id="solution">
        <p className="text-lg mb-6">
          LocRaven is the world&apos;s first AI-native local business discovery platform. We make it 
          possible for any local business to become highly discoverable across AI search engines, 
          chatbots, and voice assistants in just 60 seconds.
        </p>

        <h3 className="text-xl font-semibold mb-4 text-white">How It Works</h3>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-900 p-6 rounded-lg">
            <div className="text-2xl mb-4">⚡</div>
            <h4 className="font-semibold mb-2 text-white">1. Quick Update</h4>
            <p className="text-neutral-300">
              Share your business update in plain English. No technical knowledge needed.
            </p>
          </div>
          
          <div className="bg-zinc-900 p-6 rounded-lg">
            <div className="text-2xl mb-4">🤖</div>
            <h4 className="font-semibold mb-2 text-white">2. AI Optimization</h4>
            <p className="text-neutral-300">
              Our AI generates 6 different pages optimized for different search intents and discovery patterns.
            </p>
          </div>
          
          <div className="bg-zinc-900 p-6 rounded-lg">
            <div className="text-2xl mb-4">🌐</div>
            <h4 className="font-semibold mb-2 text-white">3. Instant Discovery</h4>
            <p className="text-neutral-300">
              Your business becomes findable across ChatGPT, Claude, Perplexity, and other AI platforms.
            </p>
          </div>
        </div>

        <div className="bg-blue-900/20 border border-blue-700 p-6 rounded-lg">
          <h4 className="font-semibold mb-3 text-blue-200">The LocRaven Advantage</h4>
          <p className="text-neutral-200">
            Unlike traditional SEO that can take months to show results, LocRaven&apos;s AI-native 
            approach makes your business discoverable immediately. We don&apos;t just optimize for 
            Google - we optimize for the future of search.
          </p>
        </div>
      </PageSection>

      <PageSection title="By the Numbers" id="numbers">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">849%</div>
            <div className="text-neutral-400">More AI Citations</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">60s</div>
            <div className="text-neutral-400">Setup Time</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">6</div>
            <div className="text-neutral-400">Optimized Pages</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">24/7</div>
            <div className="text-neutral-400">AI Discovery</div>
          </div>
        </div>

        <p className="text-center text-neutral-300">
          These aren&apos;t just numbers - they represent real local businesses getting found by 
          customers who need their services.
        </p>
      </PageSection>

      <PageSection title="Our Values" id="values">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">🏪 Local Business First</h3>
            <p className="text-neutral-200 mb-6">
              Every decision we make is viewed through the lens of &quot;How does this help local 
              businesses succeed?&quot; We&apos;re not just a platform - we&apos;re advocates for the 
              entrepreneurs who make our communities unique.
            </p>

            <h3 className="text-xl font-semibold mb-4 text-white">🤖 AI Democratization</h3>
            <p className="text-neutral-200 mb-6">
              Advanced AI shouldn&apos;t be exclusive to big corporations. We believe every business, 
              regardless of size or budget, deserves access to the same powerful tools that 
              drive customer discovery.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">🔒 Privacy & Transparency</h3>
            <p className="text-neutral-200 mb-6">
              Your business data is yours. We&apos;re transparent about how we use information, 
              comply with all privacy regulations, and never sell your data to third parties.
            </p>

            <h3 className="text-xl font-semibold mb-4 text-white">⚡ Simplicity & Speed</h3>
            <p className="text-neutral-200">
              Running a business is hard enough. Our tools are designed to be so simple that 
              you can create AI-optimized content during your coffee break and get back to 
              what you do best.
            </p>
          </div>
        </div>
      </PageSection>

      <PageSection title="Technology Partners" id="partners">
        <p className="mb-6">
          We partner with industry leaders to ensure reliability, security, and performance:
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-zinc-900 p-6 rounded-lg">
            <h4 className="font-semibold mb-3 text-white">Infrastructure & Security</h4>
            <ul className="space-y-2 text-neutral-300">
              <li>• <strong>Supabase:</strong> Secure, scalable database and authentication</li>
              <li>• <strong>Cloudflare:</strong> Global content delivery and DDoS protection</li>
              <li>• <strong>Stripe:</strong> Secure payment processing</li>
            </ul>
          </div>
          
          <div className="bg-zinc-900 p-6 rounded-lg">
            <h4 className="font-semibold mb-3 text-white">AI & Intelligence</h4>
            <ul className="space-y-2 text-neutral-300">
              <li>• <strong>Google Gemini:</strong> Advanced language model for content generation</li>
              <li>• <strong>OpenAI Integration:</strong> Future compatibility for ChatGPT optimization</li>
              <li>• <strong>Custom Algorithms:</strong> Proprietary local business optimization</li>
            </ul>
          </div>
        </div>

        <div className="bg-zinc-800 p-6 rounded-lg">
          <p className="text-neutral-200">
            <strong>Enterprise-Grade Reliability:</strong> Our infrastructure is designed for 99.9% 
            uptime with automatic scaling, real-time monitoring, and disaster recovery protocols.
          </p>
        </div>
      </PageSection>

      <PageSection title="Our Commitment to You" id="commitment">
        <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-700/50 p-8 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-white">The LocRaven Promise</h3>
          <ul className="space-y-3 text-neutral-200">
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✓</span>
              <span><strong>No Long-Term Contracts:</strong> Cancel anytime, no questions asked</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✓</span>
              <span><strong>Transparent Pricing:</strong> No hidden fees or surprise charges</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✓</span>
              <span><strong>Real Support:</strong> Human support from people who understand local business</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✓</span>
              <span><strong>Continuous Innovation:</strong> Regular updates and new features at no extra cost</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✓</span>
              <span><strong>Data Ownership:</strong> Your business data belongs to you, always</span>
            </li>
          </ul>
        </div>
      </PageSection>

      <PageSection title="Join the AI Discovery Revolution" id="join">
        <p className="text-lg mb-6">
          The future of local business discovery is already here. While your competitors struggle 
          with outdated marketing methods, you can be the business that customers find first when 
          they need what you offer.
        </p>

        <div className="text-center">
          <div className="inline-flex gap-4">
            <Link 
              href="/pricing" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Get Started Today
            </Link>
            <Link 
              href="/support" 
              className="bg-transparent border border-zinc-600 hover:border-zinc-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Learn More
            </Link>
          </div>
          
          <p className="text-neutral-400 mt-4">
            Join thousands of local businesses already using LocRaven to get discovered by AI.
          </p>
        </div>
      </PageSection>

      <div className="mt-12 border-t border-zinc-800 pt-8">
        <div className="bg-zinc-900 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-white">
            Have Questions About LocRaven?
          </h3>
          <p className="text-neutral-300 mb-4">
            We&apos;d love to hear from you. Whether you&apos;re curious about how our AI works, 
            want to discuss partnership opportunities, or just want to share your local 
            business success story.
          </p>
          <div className="flex flex-wrap gap-4">
            <a 
              href="mailto:hello@locraven.com" 
              className="text-blue-400 hover:text-blue-300"
            >
              hello@locraven.com
            </a>
            <span className="text-neutral-600">•</span>
            <a 
              href="/support" 
              className="text-blue-400 hover:text-blue-300"
            >
              Get Support
            </a>
            <span className="text-neutral-600">•</span>
            <a 
              href="/pricing" 
              className="text-blue-400 hover:text-blue-300"
            >
              View Pricing
            </a>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}