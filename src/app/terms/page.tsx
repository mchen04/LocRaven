import { Metadata } from 'next';

import { MarketingLayout, PageSection } from '@/components/marketing-layout';

export const metadata: Metadata = {
  title: 'Terms of Service - LocRaven',
  description: 'Terms and conditions for using LocRaven\'s AI-powered local business discovery platform.',
  keywords: 'terms of service, terms and conditions, legal agreement, LocRaven platform',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Terms of Service - LocRaven',
    description: 'Terms and conditions for using LocRaven\'s AI-powered local business discovery platform.',
    type: 'website',
    url: 'https://locraven.com/terms',
    siteName: 'LocRaven',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'LocRaven Terms of Service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service - LocRaven',
    description: 'Terms and conditions for using LocRaven\'s AI-powered local business discovery platform.',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: 'https://locraven.com/terms',
  },
};

const tableOfContents = [
  { id: 'acceptance', title: '1. Acceptance of Terms', level: 1 },
  { id: 'service-description', title: '2. Service Description', level: 1 },
  { id: 'user-accounts', title: '3. User Accounts and Registration', level: 1 },
  { id: 'acceptable-use', title: '4. Acceptable Use Policy', level: 1 },
  { id: 'intellectual-property', title: '5. Intellectual Property Rights', level: 1 },
  { id: 'user-content', title: '6. User-Generated Content', level: 1 },
  { id: 'payment-terms', title: '7. Payment Terms', level: 1 },
  { id: 'limitation-liability', title: '8. Limitation of Liability', level: 1 },
  { id: 'warranties', title: '9. Disclaimers and Warranties', level: 1 },
  { id: 'termination', title: '10. Termination', level: 1 },
  { id: 'privacy', title: '11. Privacy and Data Protection', level: 1 },
  { id: 'indemnification', title: '12. Indemnification', level: 1 },
  { id: 'governing-law', title: '13. Governing Law and Dispute Resolution', level: 1 },
  { id: 'modifications', title: '14. Modifications to Terms', level: 1 },
  { id: 'contact', title: '15. Contact Information', level: 1 },
];

export default function TermsPage() {
  const lastUpdated = "January 2, 2025";

  return (
    <MarketingLayout
      title="Terms of Service"
      description="These terms govern your use of LocRaven's AI-powered local business discovery platform."
      lastUpdated={lastUpdated}
      showTableOfContents={true}
      tableOfContents={tableOfContents}
    >
      <PageSection title="1. Acceptance of Terms" id="acceptance">
        <p>
          By accessing or using LocRaven (&quot;Service&quot;), operated by LocRaven, Inc. (&quot;Company,&quot; &quot;we,&quot; or &quot;us&quot;), 
          you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you disagree with any part of these 
          terms, you may not access the Service.
        </p>
        <p>
          These Terms constitute a legally binding agreement between you and LocRaven regarding your use of 
          the Service. By creating an account, making a purchase, or using our services, you acknowledge 
          that you have read, understood, and agree to be bound by these Terms.
        </p>
      </PageSection>

      <PageSection title="2. Service Description" id="service-description">
        <p>
          LocRaven is an AI-powered platform that enables local businesses to create and manage discoverable 
          content optimized for AI search engines, chatbots, and voice assistants. Our Service includes:
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>AI-generated business pages and content</li>
          <li>Business profile management and updates</li>
          <li>AI search optimization tools</li>
          <li>Content publishing and distribution</li>
          <li>Analytics and performance tracking</li>
        </ul>
        <p>
          We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time, 
          with or without notice.
        </p>
      </PageSection>

      <PageSection title="3. User Accounts and Registration" id="user-accounts">
        <p>
          To access certain features of the Service, you must register for an account. You agree to:
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Provide accurate, complete, and current information</li>
          <li>Maintain the security of your password and account</li>
          <li>Accept responsibility for all activities under your account</li>
          <li>Notify us immediately of any unauthorized use</li>
        </ul>
        <p>
          You must be at least 18 years old to create an account. Accounts registered by &quot;bots&quot; or 
          automated methods are not permitted.
        </p>
      </PageSection>

      <PageSection title="4. Acceptable Use Policy" id="acceptable-use">
        <p>You agree not to use the Service to:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Violate any applicable laws or regulations</li>
          <li>Upload false, misleading, or fraudulent business information</li>
          <li>Infringe on intellectual property rights of others</li>
          <li>Transmit viruses, malware, or harmful code</li>
          <li>Engage in spam, harassment, or abusive behavior</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Use the Service for any commercial purpose not expressly permitted</li>
          <li>Scrape, crawl, or extract data from the Service without permission</li>
        </ul>
        <p>
          We reserve the right to investigate violations and take appropriate action, including 
          account termination and legal action.
        </p>
      </PageSection>

      <PageSection title="5. Intellectual Property Rights" id="intellectual-property">
        <p>
          The Service and its original content, features, and functionality are owned by LocRaven and 
          protected by international copyright, trademark, patent, trade secret, and other intellectual 
          property laws.
        </p>
        <p>
          We grant you a limited, non-exclusive, non-transferable license to access and use the Service 
          for your business purposes, subject to these Terms.
        </p>
        <p>
          All AI-generated content created through our Service remains your property, but you grant us 
          a license to use, modify, and distribute such content as necessary to provide the Service.
        </p>
      </PageSection>

      <PageSection title="6. User-Generated Content" id="user-content">
        <p>
          By submitting content to the Service, you grant us a worldwide, royalty-free, sublicensable 
          license to use, copy, modify, and display such content in connection with the Service.
        </p>
        <p>You represent and warrant that:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>You own or have the right to use all submitted content</li>
          <li>Your content does not violate any third-party rights</li>
          <li>Your content is accurate and not misleading</li>
          <li>Your content complies with applicable laws and these Terms</li>
        </ul>
        <p>
          We reserve the right to remove any content that violates these Terms or is otherwise 
          objectionable in our sole discretion.
        </p>
      </PageSection>

      <PageSection title="7. Payment Terms" id="payment-terms">
        <p>
          Paid features of the Service are billed in advance on a subscription basis. By purchasing 
          a subscription, you agree to pay all charges associated with your account.
        </p>
        <p>
          <strong>Billing:</strong> Subscription fees are billed monthly or annually as selected. 
          All payments are due immediately upon invoice.
        </p>
        <p>
          <strong>Refunds:</strong> Subscription fees are non-refundable except as required by law 
          or as expressly stated in these Terms.
        </p>
        <p>
          <strong>Changes:</strong> We may change our fees at any time by providing 30 days&apos; notice. 
          Continued use after fee changes constitutes acceptance of new rates.
        </p>
      </PageSection>

      <PageSection title="8. Limitation of Liability" id="limitation-liability">
        <div className="bg-yellow-900/20 border border-yellow-700 p-4 rounded-lg">
          <p className="font-semibold text-yellow-200 mb-2">IMPORTANT LEGAL LIMITATION</p>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL LOCRAVEN BE LIABLE FOR ANY 
            INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT 
            LIMITED TO LOSS OF PROFITS, DATA, USE, OR OTHER INTANGIBLE LOSSES.
          </p>
        </div>
        <p className="mt-4">
          Our total liability to you for any claims arising from these Terms or the Service shall not 
          exceed the total amount paid by you to LocRaven in the twelve (12) months preceding the claim.
        </p>
        <p>
          Some jurisdictions do not allow the exclusion or limitation of certain damages, so the above 
          limitations may not apply to you.
        </p>
      </PageSection>

      <PageSection title="9. Disclaimers and Warranties" id="warranties">
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER 
          EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, 
          FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
        </p>
        <p>
          We do not warrant that:
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>The Service will be uninterrupted or error-free</li>
          <li>Defects will be corrected</li>
          <li>The Service is free of viruses or harmful components</li>
          <li>Results from using the Service will meet your expectations</li>
        </ul>
      </PageSection>

      <PageSection title="10. Termination" id="termination">
        <p>
          Either party may terminate this agreement at any time. You may terminate by discontinuing 
          use of the Service and canceling your account. We may terminate your access for violation 
          of these Terms or for any other reason.
        </p>
        <p>
          Upon termination:
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Your right to use the Service ends immediately</li>
          <li>We may delete your account and data</li>
          <li>No refunds will be provided for unused subscription time</li>
          <li>Provisions that by their nature should survive termination shall survive</li>
        </ul>
      </PageSection>

      <PageSection title="11. Privacy and Data Protection" id="privacy">
        <p>
          Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect 
          your information when you use the Service. By using the Service, you agree to the collection 
          and use of information in accordance with our Privacy Policy.
        </p>
        <p>
          We comply with applicable data protection laws, including GDPR and CCPA. You have certain 
          rights regarding your personal data, as detailed in our Privacy Policy.
        </p>
      </PageSection>

      <PageSection title="12. Indemnification" id="indemnification">
        <p>
          You agree to defend, indemnify, and hold harmless LocRaven and its officers, directors, 
          employees, and agents from any claims, damages, obligations, losses, liabilities, costs, 
          or debts arising from:
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Your use of the Service</li>
          <li>Your violation of these Terms</li>
          <li>Your violation of any third-party rights</li>
          <li>Any content you submit to the Service</li>
        </ul>
      </PageSection>

      <PageSection title="13. Governing Law and Dispute Resolution" id="governing-law">
        <p>
          These Terms are governed by California state law without regard to conflict of law principles. 
          Any disputes arising from these Terms or the Service shall be resolved through binding arbitration 
          in accordance with the Commercial Arbitration Rules of the American Arbitration Association.
        </p>
        <p>
          The arbitration shall take place in San Francisco, California, and shall be conducted in English. 
          The arbitrator&apos;s decision shall be final and binding.
        </p>
        <p>
          <strong>Class Action Waiver:</strong> You agree that disputes must be brought in an individual 
          capacity and not as part of a class action or collective proceeding.
        </p>
      </PageSection>

      <PageSection title="14. Modifications to Terms" id="modifications">
        <p>
          We reserve the right to modify these Terms at any time. We will provide notice of material 
          changes by posting the updated Terms on our website and sending email notification to 
          registered users.
        </p>
        <p>
          Your continued use of the Service after changes become effective constitutes acceptance of 
          the new Terms. If you disagree with the changes, you must discontinue use of the Service.
        </p>
      </PageSection>

      <PageSection title="15. Contact Information" id="contact">
        <p>
          For questions about these Terms, please contact us at:
        </p>
        <div className="bg-zinc-800 p-4 rounded-lg">
          <p>LocRaven, Inc.</p>
          <p>Legal Department</p>
          <p>Email: legal@locraven.com</p>
          <p>Support: support@locraven.com</p>
        </div>
      </PageSection>
    </MarketingLayout>
  );
}