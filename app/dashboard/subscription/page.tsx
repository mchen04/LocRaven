'use client';

import { SubscriptionPlans } from '@/components/dashboard/subscription-plans';

export default function SubscriptionPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Subscription</h1>
        <p className="text-muted-foreground">
          Manage your billing and upgrade your plan for more AI discovery features.
        </p>
      </div>

      {/* Subscription plans */}
      <SubscriptionPlans />
    </div>
  );
}