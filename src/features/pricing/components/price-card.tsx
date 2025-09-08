'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Check, Loader2 } from 'lucide-react';

import { SexyBoarder } from '@/components/sexy-boarder';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { PriceCardVariant, productMetadataSchema } from '../models/product-metadata';
import { BillingInterval, Price, ProductWithPrices } from '../types';

export function PricingCard({
  product,
  price,
  enableCheckout = false,
}: {
  product: ProductWithPrices;
  price?: Price;
  enableCheckout?: boolean;
}) {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>(
    price ? (price.interval as BillingInterval) : 'month'
  );
  const [isLoading, setIsLoading] = useState(false);

  // Determine the price to render
  const currentPrice = useMemo(() => {
    // If price is passed in we use that one. This is used on the account page when showing the user their current subscription.
    if (price) return price;

    // If no price provided we need to find the right one to render for the product.
    // First check if the product has a price - in the case of our enterprise product, no price is included.
    // We'll return null and handle that case when rendering.
    if (product.prices.length === 0) return null;

    // Next determine if the product is a one time purchase - in these cases it will only have a single price.
    if (product.prices.length === 1) return product.prices[0];

    // Lastly we can assume the product is a subscription one with a month and year price, so we get the price according to the select billingInterval
    return product.prices.find((price) => price.interval === billingInterval);
  }, [billingInterval, price, product.prices]);

  const monthPrice = product.prices.find((price) => price.interval === 'month')?.unit_amount;
  const yearPrice = product.prices.find((price) => price.interval === 'year')?.unit_amount;
  const isBillingIntervalYearly = billingInterval === 'year';
  const metadata = productMetadataSchema.parse(product.metadata);
  const buttonVariantMap = {
    basic: 'default',
    pro: 'sexy',
    enterprise: 'orange',
  } as const;

  function handleBillingIntervalChange(billingInterval: BillingInterval) {
    setBillingInterval(billingInterval);
  }

  async function handleCheckout() {
    if (!currentPrice) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId: currentPrice.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 && data.redirectUrl) {
          // User is not authenticated, redirect to signup
          window.location.href = data.redirectUrl;
          return;
        }
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      // You might want to show a toast notification here
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <WithSexyBorder variant={metadata.priceCardVariant} className='w-full flex-1'>
      <div className='flex w-full flex-col rounded-md border border-zinc-800 bg-black p-4 lg:p-8'>
        <div className='p-4'>
          <div className='mb-1 text-center font-alt text-xl font-bold'>{product.name}</div>
          <div className='flex justify-center gap-0.5 text-zinc-400'>
            <span className='font-semibold'>
              {yearPrice && isBillingIntervalYearly
                ? '$' + yearPrice / 100
                : monthPrice
                ? '$' + monthPrice / 100
                : 'Custom'}
            </span>
            <span>{yearPrice && isBillingIntervalYearly ? '/year' : monthPrice ? '/month' : null}</span>
          </div>
        </div>

        {!Boolean(price) && product.prices.length > 1 && <PricingSwitch onChange={handleBillingIntervalChange} />}

        <div className='m-auto flex w-fit flex-1 flex-col gap-2 px-8 py-4'>
          {metadata.generatedPages === 'unlimited' && <CheckItem text={`Unlimited business pages`} />}
          {metadata.generatedPages !== 'unlimited' && (
            <CheckItem text={`Generate ${metadata.generatedPages} business pages`} />
          )}
          {<CheckItem text={`${metadata.contentOptimization} content optimization`} />}
          {<CheckItem text={`${metadata.supportLevel} support`} />}
        </div>

        {enableCheckout && (
          <div className='py-4'>
            {currentPrice && (
              <Button
                onClick={handleCheckout}
                disabled={isLoading}
                variant={buttonVariantMap[metadata.priceCardVariant]}
                className='w-full'
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Get Started'
                )}
              </Button>
            )}
            {!currentPrice && (
              <Button variant={buttonVariantMap[metadata.priceCardVariant]} className='w-full' asChild>
                <Link href='/support' as={'/support' as any}>Contact Us</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </WithSexyBorder>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className='flex items-center gap-2'>
      <Check className='my-auto flex-shrink-0 text-slate-500' />
      <p className='text-sm font-medium text-white first-letter:capitalize'>{text}</p>
    </div>
  );
}

export function WithSexyBorder({
  variant,
  className,
  children,
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant: PriceCardVariant }) {
  if (variant === 'pro') {
    return (
      <SexyBoarder className={className} offset={100}>
        {children}
      </SexyBoarder>
    );
  } else {
    return <div className={className}>{children}</div>;
  }
}

function PricingSwitch({ onChange }: { onChange: (value: BillingInterval) => void }) {
  return (
    <Tabs
      defaultValue='month'
      className='flex items-center'
      onValueChange={(newBillingInterval) => onChange(newBillingInterval as BillingInterval)}
    >
      <TabsList className='m-auto'>
        <TabsTrigger value='month'>Monthly</TabsTrigger>
        <TabsTrigger value='year'>Yearly</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
