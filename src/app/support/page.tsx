import { Metadata } from 'next';

import { MarketingLayout, PageSection } from '@/components/marketing-layout';

export const metadata: Metadata = {
  title: 'Support - LocRaven',
  description: 'Get help with LocRaven - comprehensive guides, FAQs, and support resources for AI-powered local business discovery.',
  keywords: 'LocRaven support, help, FAQ, business updates, AI optimization',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Support - LocRaven',
    description: 'Get help with LocRaven - comprehensive guides, FAQs, and support resources for AI-powered local business discovery.',
    type: 'website',
    url: 'https://locraven.com/support',
    siteName: 'LocRaven',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'LocRaven Support Center',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Support - LocRaven',
    description: 'Get help with LocRaven - comprehensive guides, FAQs, and support resources for AI-powered local business discovery.',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: 'https://locraven.com/support',
  },
};

export default function SupportPage() {
  return (
    <MarketingLayout
      title="Support Center"
      description="Get the help you need to maximize your local business discovery with LocRaven."
    >
      {/* Quick Help Section */}
      <div className="mb-12 grid md:grid-cols-3 gap-6">
        <a 
          href="#getting-started" 
          className="bg-blue-900/20 border border-blue-700 p-6 rounded-lg hover:bg-blue-900/30 transition-colors group"
        >
          <div className="text-2xl mb-3">🚀</div>
          <h3 className="font-semibold text-white mb-2 group-hover:text-blue-200">Getting Started</h3>
          <p className="text-neutral-300 text-sm">
            New to LocRaven? Start here for a quick setup guide.
          </p>
        </a>
        
        <a 
          href="#faq" 
          className="bg-green-900/20 border border-green-700 p-6 rounded-lg hover:bg-green-900/30 transition-colors group"
        >
          <div className="text-2xl mb-3">❓</div>
          <h3 className="font-semibold text-white mb-2 group-hover:text-green-200">Common Questions</h3>
          <p className="text-neutral-300 text-sm">
            Quick answers to the most frequently asked questions.
          </p>
        </a>
        
        <a 
          href="#contact" 
          className="bg-purple-900/20 border border-purple-700 p-6 rounded-lg hover:bg-purple-900/30 transition-colors group"
        >
          <div className="text-2xl mb-3">💬</div>
          <h3 className="font-semibold text-white mb-2 group-hover:text-purple-200">Contact Support</h3>
          <p className="text-neutral-300 text-sm">
            Need personal assistance? We&apos;re here to help.
          </p>
        </a>
      </div>

      <PageSection title="🚀 Getting Started Guide" id="getting-started">
        <div className="space-y-6">
          <div className="bg-zinc-900 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-white">Step 1: Create Your Account</h3>
            <ol className="list-decimal ml-6 space-y-2 text-neutral-200">
              <li>Visit our <a href="/pricing" className="text-blue-400 hover:text-blue-300">pricing page</a> and choose your plan</li>
              <li>Click &quot;Get Started&quot; and enter your business email</li>
              <li>Verify your email address and set a secure password</li>
              <li>Complete your business profile with accurate information</li>
            </ol>
          </div>

          <div className="bg-zinc-900 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-white">Step 2: Create Your First Business Update</h3>
            <ol className="list-decimal ml-6 space-y-2 text-neutral-200">
              <li>Go to your dashboard and click &quot;Create Update&quot;</li>
              <li>Write your business update in plain English (e.g., &quot;We&apos;re offering 20% off all services this week&quot;)</li>
              <li>Set your start and end dates</li>
              <li>Choose your update category (general, promotion, event, etc.)</li>
              <li>Click &quot;Generate AI Pages&quot; and wait about 30-60 seconds</li>
            </ol>
          </div>

          <div className="bg-zinc-900 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-white">Step 3: Review and Publish</h3>
            <ol className="list-decimal ml-6 space-y-2 text-neutral-200">
              <li>Review the 6 AI-generated pages optimized for different search intents</li>
              <li>Preview any page to see how it will look</li>
              <li>Click &quot;Publish All&quot; to make your pages live and discoverable</li>
              <li>Share the links or let AI search engines find them naturally</li>
            </ol>
          </div>

          <div className="bg-blue-900/20 border border-blue-700 p-4 rounded-lg">
            <p className="text-blue-200">
              <strong>Pro Tip:</strong> Your pages become discoverable by AI search engines 
              immediately after publishing. It typically takes 24-48 hours for maximum visibility.
            </p>
          </div>
        </div>
      </PageSection>

      <PageSection title="📖 Knowledge Base" id="knowledge-base">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Business Updates</h3>
            <ul className="space-y-2 text-neutral-300">
              <li>• <a href="#update-types" className="hover:text-white">Types of updates that work best</a></li>
              <li>• <a href="#update-timing" className="hover:text-white">When to create updates</a></li>
              <li>• <a href="#update-optimization" className="hover:text-white">Writing updates for AI discovery</a></li>
              <li>• <a href="#update-categories" className="hover:text-white">Choosing the right category</a></li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6">AI Page Generation</h3>
            <ul className="space-y-2 text-neutral-300">
              <li>• <a href="#how-ai-works" className="hover:text-white">How our AI optimization works</a></li>
              <li>• <a href="#page-types" className="hover:text-white">Understanding the 6 page types</a></li>
              <li>• <a href="#customization" className="hover:text-white">Customizing generated content</a></li>
              <li>• <a href="#seo-benefits" className="hover:text-white">SEO and discovery benefits</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Account & Billing</h3>
            <ul className="space-y-2 text-neutral-300">
              <li>• <a href="#billing-info" className="hover:text-white">Understanding your bill</a></li>
              <li>• <a href="#usage-limits" className="hover:text-white">Usage limits and upgrades</a></li>
              <li>• <a href="#payment-methods" className="hover:text-white">Payment methods and security</a></li>
              <li>• <a href="#cancel-subscription" className="hover:text-white">Canceling your subscription</a></li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6">Technical</h3>
            <ul className="space-y-2 text-neutral-300">
              <li>• <a href="#browser-support" className="hover:text-white">Supported browsers</a></li>
              <li>• <a href="#data-export" className="hover:text-white">Exporting your data</a></li>
              <li>• <a href="#integrations" className="hover:text-white">Third-party integrations</a></li>
              <li>• <a href="#api-access" className="hover:text-white">API access (coming soon)</a></li>
            </ul>
          </div>
        </div>
      </PageSection>

      <PageSection title="❓ Frequently Asked Questions" id="faq">
        <div className="space-y-6">
          {/* General Questions */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">General Questions</h3>
            <div className="space-y-4">
              <details className="bg-zinc-900 p-4 rounded-lg">
                <summary className="font-medium text-white cursor-pointer hover:text-blue-200">
                  How does LocRaven make my business more discoverable?
                </summary>
                <div className="mt-3 text-neutral-300">
                  <p>
                    LocRaven creates 6 different AI-optimized pages from each business update, 
                    each targeting different search intents (direct, local, category, etc.). 
                    These pages are structured to be highly discoverable by AI search engines 
                    like ChatGPT, Claude, Perplexity, and voice assistants.
                  </p>
                </div>
              </details>

              <details className="bg-zinc-900 p-4 rounded-lg">
                <summary className="font-medium text-white cursor-pointer hover:text-blue-200">
                  How long does it take to see results?
                </summary>
                <div className="mt-3 text-neutral-300">
                  <p>
                    Your pages are live and discoverable immediately after publishing. AI search 
                    engines typically index new content within 24-48 hours for maximum visibility. 
                    Unlike traditional SEO which can take months, LocRaven provides immediate results.
                  </p>
                </div>
              </details>

              <details className="bg-zinc-900 p-4 rounded-lg">
                <summary className="font-medium text-white cursor-pointer hover:text-blue-200">
                  What types of businesses work best with LocRaven?
                </summary>
                <div className="mt-3 text-neutral-300">
                  <p>
                    LocRaven works for any local business that serves customers in their area - 
                    restaurants, retail stores, professional services, healthcare providers, 
                    home services, automotive, beauty salons, and more. If customers search 
                    for your type of business, LocRaven can help you get found.
                  </p>
                </div>
              </details>
            </div>
          </div>

          {/* Billing & Account Questions */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Billing & Account</h3>
            <div className="space-y-4">
              <details className="bg-zinc-900 p-4 rounded-lg">
                <summary className="font-medium text-white cursor-pointer hover:text-blue-200">
                  What&apos;s included in my subscription?
                </summary>
                <div className="mt-3 text-neutral-300">
                  <p>
                    Your subscription includes monthly business updates (10 for Starter, 50 for Pro, 
                    unlimited for Enterprise), AI page generation, publishing, hosting, customer support, 
                    and all new features at no extra cost. Each update generates 6 optimized pages.
                  </p>
                </div>
              </details>

              <details className="bg-zinc-900 p-4 rounded-lg">
                <summary className="font-medium text-white cursor-pointer hover:text-blue-200">
                  Can I cancel anytime?
                </summary>
                <div className="mt-3 text-neutral-300">
                  <p>
                    Yes, absolutely. You can cancel your subscription at any time from your account 
                    dashboard. There are no cancellation fees or long-term contracts. Your account 
                    remains active until the end of your current billing period.
                  </p>
                </div>
              </details>

              <details className="bg-zinc-900 p-4 rounded-lg">
                <summary className="font-medium text-white cursor-pointer hover:text-blue-200">
                  Do you offer refunds?
                </summary>
                <div className="mt-3 text-neutral-300">
                  <p>
                    We offer a 30-day money-back guarantee for new subscriptions. If you&apos;re not 
                    satisfied within your first month, contact support for a full refund. 
                    Refunds for subsequent months are evaluated on a case-by-case basis.
                  </p>
                </div>
              </details>
            </div>
          </div>

          {/* Technical Questions */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Technical Questions</h3>
            <div className="space-y-4">
              <details className="bg-zinc-900 p-4 rounded-lg">
                <summary className="font-medium text-white cursor-pointer hover:text-blue-200">
                  Can I edit the AI-generated pages?
                </summary>
                <div className="mt-3 text-neutral-300">
                  <p>
                    Currently, pages are automatically optimized by our AI for maximum discoverability. 
                    Manual editing capabilities are coming in a future update. If you need specific 
                    changes, our AI learns from your feedback to improve future generations.
                  </p>
                </div>
              </details>

              <details className="bg-zinc-900 p-4 rounded-lg">
                <summary className="font-medium text-white cursor-pointer hover:text-blue-200">
                  Is my business data secure?
                </summary>
                <div className="mt-3 text-neutral-300">
                  <p>
                    Yes, we use enterprise-grade security including SSL encryption, secure data centers, 
                    regular security audits, and GDPR/CCPA compliance. Your data is never sold to third 
                    parties and you maintain full ownership of your business information.
                  </p>
                </div>
              </details>

              <details className="bg-zinc-900 p-4 rounded-lg">
                <summary className="font-medium text-white cursor-pointer hover:text-blue-200">
                  What happens to my pages if I cancel?
                </summary>
                <div className="mt-3 text-neutral-300">
                  <p>
                    Your published pages remain live for 30 days after cancellation, giving you time 
                    to transition to another solution if needed. After 30 days, pages are archived. 
                    You can export your data anytime from your account dashboard.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection title="💬 Contact Support" id="contact">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Get Personal Help</h3>
            <p className="text-neutral-300 mb-6">
              Our support team consists of real people who understand local businesses. 
              We&apos;re here to help you succeed with LocRaven.
            </p>

            <div className="space-y-4">
              <div className="bg-zinc-900 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2">📧 Email Support</h4>
                <p className="text-neutral-300 mb-2">
                  <a href="mailto:support@locraven.com" className="text-blue-400 hover:text-blue-300">
                    support@locraven.com
                  </a>
                </p>
                <p className="text-sm text-neutral-400">Response time: 24-48 hours</p>
              </div>

              <div className="bg-zinc-900 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2">⚡ Priority Support</h4>
                <p className="text-neutral-300 mb-2">Pro and Enterprise customers</p>
                <p className="text-sm text-neutral-400">Response time: 12-24 hours</p>
              </div>

              <div className="bg-zinc-900 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2">📞 Phone Support</h4>
                <p className="text-neutral-300 mb-2">Available for Enterprise customers</p>
                <p className="text-sm text-neutral-400">Scheduled appointments available</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Support Request</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="support-email" className="block text-sm font-medium text-neutral-300 mb-2">
                  Email Address
                </label>
                <input
                  id="support-email"
                  type="email"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="support-subject" className="block text-sm font-medium text-neutral-300 mb-2">
                  Subject
                </label>
                <select id="support-subject" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none">
                  <option>General Question</option>
                  <option>Technical Issue</option>
                  <option>Billing Question</option>
                  <option>Feature Request</option>
                  <option>Bug Report</option>
                  <option>Account Issue</option>
                </select>
              </div>

              <div>
                <label htmlFor="support-message" className="block text-sm font-medium text-neutral-300 mb-2">
                  Message
                </label>
                <textarea
                  id="support-message"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none h-32"
                  placeholder="Please describe your question or issue in detail..."
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Send Message
              </button>
            </form>

            <div className="mt-6 text-sm text-neutral-400">
              <p>
                <strong>Before contacting support:</strong> Please check our FAQ above 
                for quick answers to common questions.
              </p>
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection title="🚀 Additional Resources" id="resources">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 p-6 rounded-lg">
            <h3 className="font-semibold text-white mb-3">📚 Best Practices Guide</h3>
            <p className="text-neutral-300 mb-4">
              Learn how to write effective business updates that maximize your AI discovery.
            </p>
            <a href="#best-practices" className="text-blue-400 hover:text-blue-300">
              Read Guide →
            </a>
          </div>

          <div className="bg-zinc-900 p-6 rounded-lg">
            <h3 className="font-semibold text-white mb-3">📊 Analytics Dashboard</h3>
            <p className="text-neutral-300 mb-4">
              Track your page performance and discovery metrics in real-time.
            </p>
            <a href="/dashboard" className="text-blue-400 hover:text-blue-300">
              View Dashboard →
            </a>
          </div>

          <div className="bg-zinc-900 p-6 rounded-lg">
            <h3 className="font-semibold text-white mb-3">🎥 Video Tutorials</h3>
            <p className="text-neutral-300 mb-4">
              Step-by-step video guides for getting the most out of LocRaven.
            </p>
            <a href="#tutorials" className="text-blue-400 hover:text-blue-300">
              Watch Videos →
            </a>
          </div>
        </div>
      </PageSection>

      {/* System Status */}
      <div className="mt-12 bg-green-900/20 border border-green-700 p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <h3 className="font-semibold text-white">System Status: All Systems Operational</h3>
        </div>
        <p className="text-neutral-300">
          All LocRaven services are running normally. Last updated: January 2, 2025 at 2:30 PM PST
        </p>
      </div>
    </MarketingLayout>
  );
}