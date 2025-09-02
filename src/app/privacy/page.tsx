import { Metadata } from 'next';

import { MarketingLayout, PageSection } from '@/components/marketing-layout';

export const metadata: Metadata = {
  title: 'Privacy Policy - LocRaven',
  description: 'Learn how LocRaven protects your privacy and handles your personal information in compliance with GDPR and CCPA.',
};

const tableOfContents = [
  { id: 'overview', title: '1. Overview', level: 1 },
  { id: 'information-collected', title: '2. Information We Collect', level: 1 },
  { id: 'how-we-use', title: '3. How We Use Your Information', level: 1 },
  { id: 'information-sharing', title: '4. Information Sharing and Disclosure', level: 1 },
  { id: 'data-retention', title: '5. Data Retention', level: 1 },
  { id: 'your-rights', title: '6. Your Privacy Rights', level: 1 },
  { id: 'cookies', title: '7. Cookies and Tracking Technologies', level: 1 },
  { id: 'data-security', title: '8. Data Security', level: 1 },
  { id: 'international-transfers', title: '9. International Data Transfers', level: 1 },
  { id: 'children-privacy', title: '10. Children\'s Privacy', level: 1 },
  { id: 'california-privacy', title: '11. California Privacy Rights (CCPA/CPRA)', level: 1 },
  { id: 'gdpr-rights', title: '12. European Privacy Rights (GDPR)', level: 1 },
  { id: 'policy-changes', title: '13. Changes to This Policy', level: 1 },
  { id: 'contact', title: '14. Contact Information', level: 1 },
];

export default function PrivacyPage() {
  const lastUpdated = "January 2, 2025";

  return (
    <MarketingLayout
      title="Privacy Policy"
      description="This policy explains how we collect, use, and protect your personal information when you use LocRaven."
      lastUpdated={lastUpdated}
      showTableOfContents={true}
      tableOfContents={tableOfContents}
    >
      <PageSection title="1. Overview" id="overview">
        <p>
          LocRaven, Inc. (&quot;LocRaven,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy and is committed to 
          protecting your personal information. This Privacy Policy explains how we collect, use, 
          disclose, and safeguard your information when you use our AI-powered local business 
          discovery platform.
        </p>
        <p>
          This policy applies to all users of our Service, including visitors to our website, 
          registered users, and business customers. By using our Service, you agree to the practices 
          described in this Privacy Policy.
        </p>
        <div className="bg-blue-900/20 border border-blue-700 p-4 rounded-lg">
          <p className="font-semibold text-blue-200">
            We comply with applicable privacy laws including GDPR, CCPA/CPRA, and other data 
            protection regulations.
          </p>
        </div>
      </PageSection>

      <PageSection title="2. Information We Collect" id="information-collected">
        <h3 className="text-lg font-semibold mb-4">Personal Information You Provide</h3>
        <p>We collect information you directly provide to us, including:</p>
        <ul className="list-disc ml-6 space-y-2 mb-6">
          <li><strong>Account Information:</strong> Name, email address, password, phone number</li>
          <li><strong>Business Information:</strong> Business name, address, description, services, hours, contact details</li>
          <li><strong>Payment Information:</strong> Billing address, payment method details (processed by Stripe)</li>
          <li><strong>Communications:</strong> Messages, support requests, feedback</li>
          <li><strong>User Content:</strong> Business updates, announcements, uploaded images or documents</li>
        </ul>

        <h3 className="text-lg font-semibold mb-4">Information Collected Automatically</h3>
        <p>When you use our Service, we automatically collect:</p>
        <ul className="list-disc ml-6 space-y-2 mb-6">
          <li><strong>Usage Data:</strong> Pages viewed, features used, time spent, click patterns</li>
          <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
          <li><strong>Location Data:</strong> General location based on IP address (not precise location)</li>
          <li><strong>Log Data:</strong> Server logs, error reports, performance data</li>
        </ul>

        <h3 className="text-lg font-semibold mb-4">Information from Third Parties</h3>
        <p>We may receive information from:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Payment processors (Stripe) for transaction processing</li>
          <li>AI service providers (Google Gemini) for content generation</li>
          <li>Authentication providers for account verification</li>
        </ul>
      </PageSection>

      <PageSection title="3. How We Use Your Information" id="how-we-use">
        <p>We use your personal information for the following purposes:</p>
        
        <h3 className="text-lg font-semibold mb-4">Service Provision</h3>
        <ul className="list-disc ml-6 space-y-2 mb-6">
          <li>Creating and managing your account</li>
          <li>Generating AI-optimized business content</li>
          <li>Publishing and distributing your business information</li>
          <li>Processing payments and managing subscriptions</li>
          <li>Providing customer support</li>
        </ul>

        <h3 className="text-lg font-semibold mb-4">Communication</h3>
        <ul className="list-disc ml-6 space-y-2 mb-6">
          <li>Sending service-related notifications</li>
          <li>Responding to your inquiries</li>
          <li>Providing updates about new features</li>
          <li>Sending marketing communications (with consent)</li>
        </ul>

        <h3 className="text-lg font-semibold mb-4">Improvement and Analytics</h3>
        <ul className="list-disc ml-6 space-y-2 mb-6">
          <li>Analyzing usage patterns to improve our Service</li>
          <li>Conducting research and development</li>
          <li>Optimizing AI algorithms and content generation</li>
          <li>Measuring Service performance and reliability</li>
        </ul>

        <h3 className="text-lg font-semibold mb-4">Legal and Safety</h3>
        <ul className="list-disc ml-6 space-y-2">
          <li>Complying with legal obligations</li>
          <li>Protecting against fraud and abuse</li>
          <li>Enforcing our Terms of Service</li>
          <li>Responding to legal requests</li>
        </ul>
      </PageSection>

      <PageSection title="4. Information Sharing and Disclosure" id="information-sharing">
        <p>
          We do not sell, trade, or rent your personal information to third parties. We may share 
          your information in the following limited circumstances:
        </p>

        <h3 className="text-lg font-semibold mb-4">Service Providers</h3>
        <ul className="list-disc ml-6 space-y-2 mb-6">
          <li><strong>Supabase:</strong> Database and authentication services</li>
          <li><strong>Stripe:</strong> Payment processing and billing</li>
          <li><strong>Google Gemini:</strong> AI content generation (business content only)</li>
          <li><strong>Cloudflare:</strong> Content delivery and security</li>
        </ul>

        <h3 className="text-lg font-semibold mb-4">Business Transfers</h3>
        <p className="mb-6">
          In connection with any merger, sale, or transfer of company assets, your information 
          may be transferred to the acquiring entity.
        </p>

        <h3 className="text-lg font-semibold mb-4">Legal Requirements</h3>
        <p className="mb-6">
          We may disclose information when required by law, legal process, or to protect the 
          rights, property, or safety of LocRaven, our users, or others.
        </p>

        <h3 className="text-lg font-semibold mb-4">Public Information</h3>
        <p>
          Business information you choose to publish through our Service becomes publicly 
          available as part of your business&apos;s online presence.
        </p>
      </PageSection>

      <PageSection title="5. Data Retention" id="data-retention">
        <p>We retain your personal information for the following periods:</p>
        <ul className="list-disc ml-6 space-y-2 mb-6">
          <li><strong>Account Data:</strong> Until account deletion plus 90 days for legal compliance</li>
          <li><strong>Business Information:</strong> 3 years after account deletion</li>
          <li><strong>Usage Analytics:</strong> 2 years from collection date</li>
          <li><strong>Payment Records:</strong> 7 years for tax and accounting purposes</li>
          <li><strong>Support Communications:</strong> 3 years after issue resolution</li>
        </ul>
        <p>
          You may request deletion of your data at any time, subject to legal retention requirements. 
          We will securely delete data when retention periods expire.
        </p>
      </PageSection>

      <PageSection title="6. Your Privacy Rights" id="your-rights">
        <p>You have the following rights regarding your personal information:</p>

        <h3 className="text-lg font-semibold mb-4">Universal Rights</h3>
        <ul className="list-disc ml-6 space-y-2 mb-6">
          <li><strong>Access:</strong> Request a copy of your personal information</li>
          <li><strong>Correction:</strong> Update or correct inaccurate information</li>
          <li><strong>Deletion:</strong> Request deletion of your personal information</li>
          <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
          <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
        </ul>

        <div className="bg-green-900/20 border border-green-700 p-4 rounded-lg mb-6">
          <p className="font-semibold text-green-200 mb-2">Exercise Your Rights</p>
          <p>
            To exercise any of these rights, contact us at{' '}
            <a href="mailto:privacy@locraven.com" className="text-green-300 hover:text-green-200">
              privacy@locraven.com
            </a>{' '}
            or use our{' '}
            <a href="/support" className="text-green-300 hover:text-green-200">
              privacy request form
            </a>
            .
          </p>
        </div>

        <p>
          We will respond to your request within 30 days (or as required by applicable law) and 
          verify your identity before processing requests.
        </p>
      </PageSection>

      <PageSection title="7. Cookies and Tracking Technologies" id="cookies">
        <p>We use cookies and similar technologies to:</p>
        <ul className="list-disc ml-6 space-y-2 mb-6">
          <li>Maintain your login session</li>
          <li>Remember your preferences</li>
          <li>Analyze usage patterns (Google Analytics)</li>
          <li>Improve Service performance</li>
        </ul>

        <h3 className="text-lg font-semibold mb-4">Cookie Types</h3>
        <ul className="list-disc ml-6 space-y-2 mb-6">
          <li><strong>Essential Cookies:</strong> Required for Service functionality</li>
          <li><strong>Analytics Cookies:</strong> Help us understand usage patterns</li>
          <li><strong>Preference Cookies:</strong> Remember your settings and choices</li>
        </ul>

        <p>
          You can control cookies through your browser settings. Disabling essential cookies 
          may impact Service functionality.
        </p>
      </PageSection>

      <PageSection title="8. Data Security" id="data-security">
        <p>We implement comprehensive security measures to protect your information:</p>
        <ul className="list-disc ml-6 space-y-2 mb-6">
          <li><strong>Encryption:</strong> Data encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
          <li><strong>Access Controls:</strong> Role-based access with multi-factor authentication</li>
          <li><strong>Regular Audits:</strong> Security assessments and vulnerability testing</li>
          <li><strong>Monitoring:</strong> 24/7 system monitoring and threat detection</li>
          <li><strong>Incident Response:</strong> Established procedures for security breaches</li>
        </ul>
        <p>
          While we use industry-standard security measures, no system is completely secure. 
          We cannot guarantee absolute security of your information.
        </p>
      </PageSection>

      <PageSection title="9. International Data Transfers" id="international-transfers">
        <p>
          Your information may be transferred to and processed in countries other than your 
          country of residence. We ensure appropriate safeguards are in place for international 
          transfers, including:
        </p>
        <ul className="list-disc ml-6 space-y-2 mb-6">
          <li>Standard Contractual Clauses for GDPR compliance</li>
          <li>Adequacy decisions recognized by privacy regulators</li>
          <li>Data Processing Agreements with all service providers</li>
        </ul>
        <p>
          Our primary data processing occurs in the United States with service providers who 
          maintain appropriate privacy and security standards.
        </p>
      </PageSection>

      <PageSection title="10. Children's Privacy" id="children-privacy">
        <p>
          Our Service is not intended for children under 16 (or under 13 in the United States). 
          We do not knowingly collect personal information from children. If we learn that we have 
          collected information from a child, we will delete it promptly.
        </p>
        <p>
          If you believe a child has provided us with personal information, please contact us 
          immediately at privacy@locraven.com.
        </p>
      </PageSection>

      <PageSection title="11. California Privacy Rights (CCPA/CPRA)" id="california-privacy">
        <div className="bg-yellow-900/20 border border-yellow-700 p-4 rounded-lg mb-6">
          <p className="font-semibold text-yellow-200 mb-2">California Residents</p>
          <p>
            If you are a California resident, you have additional rights under the California 
            Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA).
          </p>
        </div>

        <h3 className="text-lg font-semibold mb-4">Your CCPA Rights</h3>
        <ul className="list-disc ml-6 space-y-2 mb-6">
          <li><strong>Right to Know:</strong> Categories of personal information collected and how it&apos;s used</li>
          <li><strong>Right to Delete:</strong> Request deletion of your personal information</li>
          <li><strong>Right to Opt-Out:</strong> Opt out of sale or sharing of personal information</li>
          <li><strong>Right to Correct:</strong> Request correction of inaccurate information</li>
          <li><strong>Right to Non-Discrimination:</strong> Equal service regardless of privacy choices</li>
        </ul>

        <h3 className="text-lg font-semibold mb-4">Categories of Information We Collect</h3>
        <ul className="list-disc ml-6 space-y-2 mb-6">
          <li>Identifiers (name, email, IP address)</li>
          <li>Commercial information (purchase history, preferences)</li>
          <li>Internet activity (usage patterns, interactions)</li>
          <li>Professional information (business details)</li>
          <li>Inferences (preferences and characteristics)</li>
        </ul>

        <div className="bg-zinc-800 p-4 rounded-lg mb-6">
          <p className="font-semibold mb-2">Important: We Do Not Sell Your Personal Information</p>
          <p>
            We do not sell personal information as defined by the CCPA. We may share information 
            for business purposes as described in this policy.
          </p>
        </div>

        <p>
          To exercise your CCPA rights, visit our{' '}
          <a href="/support" className="text-blue-400 hover:text-blue-300">
            privacy request form
          </a>{' '}
          or email privacy@locraven.com.
        </p>
      </PageSection>

      <PageSection title="12. European Privacy Rights (GDPR)" id="gdpr-rights">
        <div className="bg-blue-900/20 border border-blue-700 p-4 rounded-lg mb-6">
          <p className="font-semibold text-blue-200 mb-2">EU/UK/EEA Residents</p>
          <p>
            If you are in the European Union, United Kingdom, or European Economic Area, 
            you have rights under the General Data Protection Regulation (GDPR).
          </p>
        </div>

        <h3 className="text-lg font-semibold mb-4">Legal Basis for Processing</h3>
        <p>We process your personal information based on:</p>
        <ul className="list-disc ml-6 space-y-2 mb-6">
          <li><strong>Contract Performance:</strong> Providing our Service to you</li>
          <li><strong>Legitimate Interests:</strong> Improving our Service and preventing fraud</li>
          <li><strong>Legal Compliance:</strong> Meeting regulatory requirements</li>
          <li><strong>Consent:</strong> Marketing communications and optional features</li>
        </ul>

        <h3 className="text-lg font-semibold mb-4">Your GDPR Rights</h3>
        <ul className="list-disc ml-6 space-y-2 mb-6">
          <li><strong>Right of Access:</strong> Obtain confirmation and copy of your data</li>
          <li><strong>Right to Rectification:</strong> Correct inaccurate personal data</li>
          <li><strong>Right to Erasure:</strong> Request deletion in certain circumstances</li>
          <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
          <li><strong>Right to Data Portability:</strong> Receive data in structured format</li>
          <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
          <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
        </ul>

        <p>
          You also have the right to lodge a complaint with your local data protection authority 
          if you believe we have violated your privacy rights.
        </p>
      </PageSection>

      <PageSection title="13. Changes to This Policy" id="policy-changes">
        <p>
          We may update this Privacy Policy periodically to reflect changes in our practices, 
          technology, or legal requirements. We will:
        </p>
        <ul className="list-disc ml-6 space-y-2 mb-6">
          <li>Post the updated policy on our website</li>
          <li>Send email notifications for material changes</li>
          <li>Update the &quot;Last Modified&quot; date at the top</li>
          <li>Provide 30 days notice for significant changes</li>
        </ul>
        <p>
          Your continued use of the Service after changes become effective constitutes acceptance 
          of the updated policy.
        </p>
      </PageSection>

      <PageSection title="14. Contact Information" id="contact">
        <p>For privacy-related questions or to exercise your rights, contact us:</p>
        <div className="bg-zinc-800 p-6 rounded-lg">
          <h4 className="font-semibold mb-4">Privacy Officer</h4>
          <p>LocRaven, Inc.</p>
          <p>Email: privacy@locraven.com</p>
          <p>Support: support@locraven.com</p>
          <p>Response Time: Within 30 days</p>
          <br />
          <p className="text-sm text-neutral-400">
            For urgent privacy matters or data breach notifications, 
            please mark your email as &quot;URGENT - Privacy Matter&quot;
          </p>
        </div>
      </PageSection>
    </MarketingLayout>
  );
}