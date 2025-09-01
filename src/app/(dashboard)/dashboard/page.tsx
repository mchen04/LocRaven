import { redirect } from 'next/navigation';

import { getSession } from '@/features/account/controllers/get-session';
import { getSubscription } from '@/features/account/controllers/get-subscription';

import { DashboardTabs } from './dashboard-tabs';

export default async function DashboardPage() {
  const [session, subscription] = await Promise.all([getSession(), getSubscription()]);

  if (!session) {
    redirect('/login');
  }

  return (
    <section className='rounded-lg bg-black px-4 py-16'>
      <h1 className='mb-8 text-center'>Dashboard</h1>
      <DashboardTabs subscription={subscription} />
    </section>
  );
}