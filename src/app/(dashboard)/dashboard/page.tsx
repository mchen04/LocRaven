import { redirect } from 'next/navigation';

import { getSession } from '@/features/account/controllers/get-session';
import { getSubscription } from '@/features/account/controllers/get-subscription';
import { getCurrentBusiness } from '@/features/business/controllers/get-current-business';

import { DashboardTabs } from './dashboard-tabs';

export default async function DashboardPage() {
  const [session, subscription, businessProfile] = await Promise.all([
    getSession(), 
    getSubscription(),
    getCurrentBusiness()
  ]);

  if (!session) {
    redirect('/login');
  }

  return (
    <section className='rounded-lg bg-black px-4 py-16'>
      <h1 className='mb-8 text-center'>Dashboard</h1>
      <DashboardTabs subscription={subscription} businessProfile={businessProfile} />
    </section>
  );
}