'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: 29,
    features: [
      '10 updates per month',
      '50 AI-optimized pages',
      'Basic analytics',
      'Email support',
      'AI discovery tracking'
    ]
  },
  {
    name: 'Professional',
    price: 99,
    popular: true,
    features: [
      '50 updates per month',
      '250 AI-optimized pages',
      'Advanced analytics',
      'Priority support',
      'Custom branding'
    ]
  },
  {
    name: 'Enterprise',
    price: null,
    features: [
      'Unlimited updates',
      'Unlimited pages',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee'
    ]
  }
];

export function PricingCards() {
  return (
    <section id="pricing" className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Simple pricing</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that's right for your business. Start free and upgrade as you grow.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-2">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    {plan.price ? `$${plan.price}` : 'Custom'}
                  </span>
                  {plan.price && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button asChild className="w-full">
                  <Link href="/login">
                    {plan.price ? 'Get Started' : 'Contact Sales'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* CTA section */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold mb-4">Ready to get discovered by AI?</h3>
          <p className="text-muted-foreground mb-6">
            Join thousands of businesses already getting found by AI assistants
          </p>
          <Button size="lg" asChild>
            <Link href="/login">Get Started Free</Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            30-day money-back guarantee
          </p>
        </div>
      </div>
    </section>
  );
}