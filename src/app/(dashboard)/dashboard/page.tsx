import { redirect } from 'next/navigation';

import { getAuthUser } from '@/features/account/controllers/get-auth-user';
import { getSubscription } from '@/features/account/controllers/get-subscription';
import { getUserUsageStats } from '@/features/account/controllers/get-usage-stats';
import { getCurrentBusiness } from '@/features/business/controllers/get-current-business';
import { getUserLinks } from '@/features/links/controllers/get-user-links';
import { getUserCurrentProduct } from '@/features/pricing/controllers/get-user-product';

import { DashboardTabs } from './dashboard-tabs';

export default async function DashboardPage() {
  const [user, subscription, businessProfile, usageStats, userLinks] = await Promise.all([
    getAuthUser(), 
    getSubscription(),
    getCurrentBusiness(),
    getUserUsageStats(),
    getUserLinks()
  ]);

  if (!user) {
    redirect('/login');
  }

  // Get user's current product/price
  const { product: userProduct, price: userPrice } = await getUserCurrentProduct(subscription);

  return (
    <section className='rounded-lg bg-black px-4 py-16'>
      <h1 className='mb-8 text-center'>Dashboard</h1>
      <DashboardTabs 
        subscription={subscription as any} 
        businessProfile={businessProfile as any}
        usageStats={usageStats as any}
        userProduct={userProduct}
        userPrice={userPrice}
        userEmail={user.email}
        userName={user.user_metadata?.full_name || user.user_metadata?.name}
        userLinks={userLinks as any}
      />
    </section>
  );
}