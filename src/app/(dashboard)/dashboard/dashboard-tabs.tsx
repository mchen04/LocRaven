'use client';

import dynamic from 'next/dynamic';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UsageStats } from '@/features/account/controllers/get-usage-stats';
import { BusinessProfile } from '@/features/business/types/business-types';
import { UserLink } from '@/features/links/types/links-types';
import { ProductWithPrices } from '@/features/pricing/controllers/get-user-product';
import { Price, SubscriptionWithProduct } from '@/features/pricing/types';

// Dynamic imports for tab components to reduce initial bundle size
const BusinessProfileTab = dynamic(() => import('./tabs/business-profile-tab').then(mod => ({ default: mod.BusinessProfileTab })), {
  loading: () => <div className="flex items-center justify-center p-8">Loading...</div>
});
const LinksTab = dynamic(() => import('./tabs/links-tab').then(mod => ({ default: mod.LinksTab })), {
  loading: () => <div className="flex items-center justify-center p-8">Loading...</div>
});
const SettingsTab = dynamic(() => import('./tabs/settings-tab').then(mod => ({ default: mod.SettingsTab })), {
  loading: () => <div className="flex items-center justify-center p-8">Loading...</div>
});
const SubscriptionsTab = dynamic(() => import('./tabs/subscriptions-tab').then(mod => ({ default: mod.SubscriptionsTab })), {
  loading: () => <div className="flex items-center justify-center p-8">Loading...</div>
});
const UpdatesTab = dynamic(() => import('./tabs/updates-tab').then(mod => ({ default: mod.UpdatesTab })), {
  loading: () => <div className="flex items-center justify-center p-8">Loading...</div>
});

interface DashboardTabsProps {
  subscription: SubscriptionWithProduct | null;
  businessProfile?: BusinessProfile | null;
  usageStats?: UsageStats | null;
  userProduct?: ProductWithPrices | null;
  userPrice?: Price | null;
  userEmail?: string;
  userName?: string;
  userLinks?: UserLink[] | null;
}

export function DashboardTabs({ subscription, businessProfile, usageStats, userProduct, userPrice, userEmail, userName, userLinks }: DashboardTabsProps) {
  return (
    <div className='mx-auto max-w-6xl'>
      <Tabs defaultValue='updates' className='space-y-6'>
        <div className='flex justify-center'>
          <TabsList className='flex w-full max-w-2xl overflow-x-auto bg-zinc-900 md:justify-center scrollbar-hide'>
            <TabsTrigger value='updates' className='text-sm whitespace-nowrap flex-shrink-0 min-w-fit px-4'>
              Updates
            </TabsTrigger>
            <TabsTrigger value='profile' className='text-sm whitespace-nowrap flex-shrink-0 min-w-fit px-3'>
              Business Profile
            </TabsTrigger>
            <TabsTrigger value='links' className='text-sm whitespace-nowrap flex-shrink-0 min-w-fit px-4'>
              Links
            </TabsTrigger>
            <TabsTrigger value='subscriptions' className='text-sm whitespace-nowrap flex-shrink-0 min-w-fit px-3'>
              Subscriptions
            </TabsTrigger>
            <TabsTrigger value='settings' className='text-sm whitespace-nowrap flex-shrink-0 min-w-fit px-4'>
              Settings
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value='updates' className='mt-6'>
          <UpdatesTab 
            initialBusinessProfile={businessProfile} 
            initialUsageStats={usageStats}
          />
        </TabsContent>

        <TabsContent value='profile' className='mt-6'>
          <BusinessProfileTab initialData={businessProfile} />
        </TabsContent>

        <TabsContent value='links' className='mt-6'>
          <LinksTab links={userLinks} />
        </TabsContent>

        <TabsContent value='subscriptions' className='mt-6'>
          <SubscriptionsTab 
            subscription={subscription} 
            usageStats={usageStats}
            userProduct={userProduct}
            userPrice={userPrice}
          />
        </TabsContent>

        <TabsContent value='settings' className='mt-6'>
          <SettingsTab userEmail={userEmail} userName={userName} />
        </TabsContent>
      </Tabs>
    </div>
  );
}