'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { PricingCard } from '@/features/pricing/components/price-card';
import { Price, ProductWithPrices } from '@/features/pricing/types';

interface SubscriptionsTabProps {
  subscription: any; // TODO: Type this properly
}

export function SubscriptionsTab({ subscription }: SubscriptionsTabProps) {
  const [userProduct, setUserProduct] = useState<ProductWithPrices | undefined>();
  const [userPrice, setUserPrice] = useState<Price | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        // TODO: Replace with actual API call
        const products = []; // await getProducts();
        
        if (subscription) {
          for (const product of products) {
            for (const price of product.prices) {
              if (price.id === subscription.price_id) {
                setUserProduct(product);
                setUserPrice(price);
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [subscription]);

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
        {loading ? (
          <div className='py-8 text-center text-zinc-400'>
            <p>Loading subscription details...</p>
          </div>
        ) : userProduct && userPrice ? (
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
          <div className='grid grid-cols-2 gap-6'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-white'>8</div>
              <div className='text-sm text-zinc-400'>Updates Used</div>
              <div className='text-xs text-zinc-500'>This month</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-white'>50</div>
              <div className='text-sm text-zinc-400'>Updates Remaining</div>
              <div className='text-xs text-zinc-500'>Resets Feb 15</div>
            </div>
          </div>
          
          <div className='mt-6'>
            <div className='flex justify-between text-sm mb-2'>
              <span className='text-zinc-400'>Monthly Usage</span>
              <span className='text-zinc-300'>8 / 58</span>
            </div>
            <div className='w-full bg-zinc-800 rounded-full h-2'>
              <div 
                className='bg-blue-600 h-2 rounded-full transition-all duration-300'
                style={{ width: '14%' }}
              ></div>
            </div>
          </div>
        </Card>
      )}

      <Card title='Billing History'>
        <div className='space-y-3'>
          {subscription ? (
            <>
              <div className='flex items-center justify-between py-2 border-b border-zinc-800'>
                <div>
                  <div className='text-sm font-medium text-white'>January 2024</div>
                  <div className='text-xs text-zinc-400'>Paid on Jan 1, 2024</div>
                </div>
                <div className='text-sm text-white'>$29.00</div>
              </div>
              <div className='flex items-center justify-between py-2 border-b border-zinc-800'>
                <div>
                  <div className='text-sm font-medium text-white'>December 2023</div>
                  <div className='text-xs text-zinc-400'>Paid on Dec 1, 2023</div>
                </div>
                <div className='text-sm text-white'>$29.00</div>
              </div>
              <div className='pt-4 text-center'>
                <Button size='sm' variant='secondary'>
                  View All Invoices
                </Button>
              </div>
            </>
          ) : (
            <div className='py-4 text-center text-zinc-400'>
              <p>No billing history available</p>
            </div>
          )}
        </div>
      </Card>
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