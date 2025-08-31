'use client';

import { AnalyticsChart } from '@/components/dashboard/analytics-chart';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Track your business performance and AI assistant discovery metrics.
        </p>
      </div>

      {/* Analytics chart */}
      <AnalyticsChart />
    </div>
  );
}