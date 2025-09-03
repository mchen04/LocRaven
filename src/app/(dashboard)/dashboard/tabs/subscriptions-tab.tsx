'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { UsageStats } from '@/features/account/controllers/get-usage-stats';
import { PricingCard } from '@/features/pricing/components/price-card';
import { ProductWithPrices } from '@/features/pricing/controllers/get-user-product';
import { Price, SubscriptionWithProduct } from '@/features/pricing/types';

interface SubscriptionsTabProps {
  subscription: SubscriptionWithProduct | null;
  usageStats?: UsageStats | null;
  userProduct?: ProductWithPrices | null;
  userPrice?: Price | null;
}

export function SubscriptionsTab({ subscription, usageStats, userProduct, userPrice }: SubscriptionsTabProps) {

  return (
    <div className='space-y-6'>
      <Card
        title='Your Plan'
        footer={
          subscription ? (
            <Button size='sm' variant='secondary' asChild>
              <Link href='/manage-subscription'>Manage your subscription</Link>
            </Button>
          ) : (
            <Button size='sm' variant='secondary' asChild>
              <Link href='/pricing'>Start a subscription</Link>
            </Button>
          )
        }
      >
        {userProduct && userPrice ? (
          <PricingCard product={userProduct} price={userPrice} />
        ) : (
          <div className='py-8 text-center'>
            <p className='text-zinc-400 mb-4'>You don&apos;t have an active subscription</p>
            <p className='text-sm text-zinc-500'>
              Subscribe to start generating AI-powered business pages and managing your online presence.
            </p>
          </div>
        )}
      </Card>

      {subscription && (
        <Card title='Usage & Limits'>
          {usageStats ? (
            <>
              <div className='grid grid-cols-2 gap-6'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-white'>{usageStats.updatesUsed}</div>
                  <div className='text-sm text-zinc-400'>Updates Used</div>
                  <div className='text-xs text-zinc-500'>This period</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-white'>
                    {usageStats.updatesLimit === null 
                      ? 'Unlimited' 
                      : usageStats.updatesLimit - usageStats.updatesUsed
                    }
                  </div>
                  <div className='text-sm text-zinc-400'>Updates Remaining</div>
                  <div className='text-xs text-zinc-500'>
                    Resets {new Date(usageStats.periodEnd).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className='mt-6'>
                <div className='flex justify-between text-sm mb-2'>
                  <span className='text-zinc-400'>Usage Progress</span>
                  <span className='text-zinc-300'>
                    {usageStats.updatesUsed} / {usageStats.updatesLimit === null ? 'Unlimited' : usageStats.updatesLimit}
                  </span>
                </div>
                {usageStats.updatesLimit === null ? (
                  <div className='w-full bg-zinc-800 rounded-full h-2'>
                    <div className='bg-green-500 h-2 rounded-full transition-all duration-300 w-full opacity-50'></div>
                  </div>
                ) : (
                  <div className='w-full bg-zinc-800 rounded-full h-2'>
                    <div 
                      className='bg-blue-600 h-2 rounded-full transition-all duration-300'
                      style={{ width: `${usageStats.usagePercentage}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className='py-4 text-center text-zinc-400'>
              <p>Usage tracking not available</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

// Reuse the Card component from the original account page
function Card({
  title,
  footer,
  children,
}: {
  title: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className='w-full rounded-md bg-zinc-900'>
      <div className='p-4'>
        <h2 className='mb-4 text-xl font-semibold text-white'>{title}</h2>
        <div>{children}</div>
      </div>
      {footer && (
        <div className='flex justify-end rounded-b-md border-t border-zinc-800 p-4'>{footer}</div>
      )}
    </div>
  );
}