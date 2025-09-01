import { redirect } from 'next/navigation';

import { getSession } from '@/features/account/controllers/get-session';
import { getSubscription } from '@/features/account/controllers/get-subscription';
import { getUserUsageStats } from '@/features/account/controllers/get-usage-stats';
import { getCurrentBusiness } from '@/features/business/controllers/get-current-business';
import { getUserCurrentProduct } from '@/features/pricing/controllers/get-user-product';

import { DashboardTabs } from './dashboard-tabs';

export default async function DashboardPage() {
  const [session, subscription, businessProfile, usageStats] = await Promise.all([
    getSession(), 
    getSubscription(),
    getCurrentBusiness(),
    getUserUsageStats()
  ]);

  if (!session) {
    redirect('/login');
  }

  // Get user's current product/price
  const { product: userProduct, price: userPrice } = await getUserCurrentProduct(subscription);

  return (
    <section className='rounded-lg bg-black px-4 py-16'>
      <h1 className='mb-8 text-center'>Dashboard</h1>
      <DashboardTabs 
        subscription={subscription} 
        businessProfile={businessProfile}
        usageStats={usageStats}
        userProduct={userProduct}
        userPrice={userPrice}
        userEmail={session.user?.email}
        userName={session.user?.user_metadata?.full_name || session.user?.user_metadata?.name}
      />
    </section>
  );
}