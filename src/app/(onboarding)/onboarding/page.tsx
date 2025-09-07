import { redirect } from 'next/navigation';

import { getAuthUser } from '@/features/account/controllers/get-auth-user';
import { getCurrentBusiness } from '@/features/business/controllers/get-current-business';

import { OnboardingWizard } from './onboarding-wizard';

export default async function OnboardingPage() {
  const [user, businessProfile] = await Promise.all([
    getAuthUser(),
    getCurrentBusiness()
  ]);

  if (!user) {
    redirect('/login');
  }

  // If user has already completed onboarding, redirect to dashboard
  if ((businessProfile as any)?.is_onboarded) {
    redirect('/dashboard');
  }

  return (
    <div className="space-y-8">
      <OnboardingWizard 
        initialData={businessProfile as any}
        userEmail={user.email || ''}
      />
    </div>
  );
}