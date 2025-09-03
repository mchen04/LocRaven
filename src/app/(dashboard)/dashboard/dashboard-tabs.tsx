'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UsageStats } from '@/features/account/controllers/get-usage-stats';
import { BusinessProfile } from '@/features/business/types/business-types';
import { UserLink } from '@/features/links/types/links-types';
import { ProductWithPrices } from '@/features/pricing/controllers/get-user-product';
import { Price, SubscriptionWithProduct } from '@/features/pricing/types';

import { BusinessProfileTab } from './tabs/business-profile-tab';
import { LinksTab } from './tabs/links-tab';
import { SettingsTab } from './tabs/settings-tab';
import { SubscriptionsTab } from './tabs/subscriptions-tab';
import { UpdatesTab } from './tabs/updates-tab';

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
          <TabsList className='grid w-full max-w-2xl grid-cols-5 bg-zinc-900'>
            <TabsTrigger value='updates' className='text-sm'>
              Updates
            </TabsTrigger>
            <TabsTrigger value='profile' className='text-sm'>
              Business Profile
            </TabsTrigger>
            <TabsTrigger value='links' className='text-sm'>
              Links
            </TabsTrigger>
            <TabsTrigger value='subscriptions' className='text-sm'>
              Subscriptions
            </TabsTrigger>
            <TabsTrigger value='settings' className='text-sm'>
              Settings
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value='updates' className='mt-6'>
          <UpdatesTab />
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