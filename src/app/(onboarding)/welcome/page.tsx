import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { getAuthUser } from '@/features/account/controllers/get-auth-user';
import { getCurrentBusiness } from '@/features/business/controllers/get-current-business';

export default async function WelcomePage() {
  const [user, businessProfile] = await Promise.all([
    getAuthUser(),
    getCurrentBusiness()
  ]);

  if (!user) {
    redirect('/login');
  }

  if (!businessProfile?.is_onboarded) {
    redirect('/onboarding');
  }

  const permanentPageUrl = businessProfile?.permanent_page_path ? 
    `https://locraven.com${businessProfile.permanent_page_path}` : null;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center space-y-8 px-4">
        {/* Success icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Welcome message */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Welcome to LocRaven!</h1>
          <p className="text-xl text-gray-300">
            Your business profile has been created successfully
          </p>
        </div>

        {/* Permanent page info */}
        {permanentPageUrl && (
          <div className="bg-gray-900 rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-cyan-400">Your Permanent Business Page</h2>
            <p className="text-gray-300">
              We&apos;ve created a permanent page for your business that will never expire:
            </p>
            <div className="bg-gray-800 rounded p-3">
              <code className="text-cyan-300 break-all">{permanentPageUrl}</code>
            </div>
            <p className="text-sm text-gray-400">
              This page will automatically update whenever you change your business information.
              All your future generated pages will link back to this permanent page.
            </p>
          </div>
        )}

        {/* Next steps */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">What&apos;s next?</h3>
          <div className="grid gap-4 text-left max-w-md mx-auto">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-300">
                Create updates to generate additional pages for promotions and announcements
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-300">
                All generated pages will include a link back to your permanent business page
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-gray-300">
                Edit your business information anytime to keep your permanent page up-to-date
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-cyan-500 hover:bg-cyan-400 text-black">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          
          {permanentPageUrl && (
            <Button asChild variant="outline">
              <a 
                href={permanentPageUrl} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                View Your Business Page
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}