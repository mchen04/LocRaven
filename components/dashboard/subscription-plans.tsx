'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Crown, Building } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: 29,
    icon: Zap,
    current: true,
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
    icon: Crown,
    popular: true,
    features: [
      '50 updates per month',
      '250 AI-optimized pages',
      'Advanced analytics',
      'Priority support',
      'Custom branding',
      'API access'
    ]
  },
  {
    name: 'Enterprise',
    price: null,
    icon: Building,
    features: [
      'Unlimited updates',
      'Unlimited pages',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
      'White-label solution'
    ]
  }
];

export function SubscriptionPlans() {
  return (
    <div className="space-y-6">
      {/* Current Plan Status */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Starter Plan</h3>
              <p className="text-muted-foreground">$29/month • Next billing: February 15, 2024</p>
            </div>
            <Badge>Active</Badge>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Updates used this month</span>
              <span>3/10</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const Icon = plan.icon;
          
          return (
            <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{plan.name}</CardTitle>
                <div className="text-3xl font-bold">
                  {plan.price ? `$${plan.price}` : 'Custom'}
                  {plan.price && <span className="text-sm font-normal text-muted-foreground">/month</span>}
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full mt-6" 
                  variant={plan.current ? 'outline' : 'default'}
                  disabled={plan.current}
                >
                  {plan.current ? 'Current Plan' : plan.price ? 'Upgrade' : 'Contact Sales'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Billing Management */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Payment Method</p>
              <p className="text-sm text-muted-foreground">•••• •••• •••• 4242</p>
            </div>
            <Button variant="outline">Update</Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Billing History</p>
              <p className="text-sm text-muted-foreground">View and download past invoices</p>
            </div>
            <Button variant="outline">View History</Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Cancel Subscription</p>
              <p className="text-sm text-muted-foreground">Cancel your subscription anytime</p>
            </div>
            <Button variant="destructive">Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}