import { redirect } from 'next/navigation';

import { getAuthUser } from '@/features/account/controllers/get-auth-user';
import { hasActiveSubscription, hasCompletedOnboarding } from '@/features/account/controllers/subscription-data-layer';
import { getCurrentBusiness } from '@/features/business/controllers/get-current-business';

import { OnboardingWizard } from './onboarding-wizard';

export default async function OnboardingPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect('/login');
  }

  // Data Access Layer: Check subscription requirement
  const hasSubscription = await hasActiveSubscription();
  if (!hasSubscription) {
    redirect('/pricing');
  }

  // Check if already completed onboarding
  const isOnboarded = await hasCompletedOnboarding();
  if (isOnboarded) {
    redirect('/dashboard');
  }

  // Get business profile for form initialization
  const businessProfile = await getCurrentBusiness();

  return (
    <div className="space-y-8">
      <OnboardingWizard 
        initialData={businessProfile as any}
        userEmail={user.email || ''}
      />
    </div>
  );
}