'use client';

import nextDynamic from 'next/dynamic';
import { Suspense } from 'react';
import ProtectedPageWrapper from '@/lib/components/ProtectedPageWrapper';

// Dynamically import Dashboard component with code splitting
const Dashboard = nextDynamic(() => import('@/lib/components/Dashboard'), {
  loading: () => (
    <div className="loading-container">
      <div className="text-center">
        <div className="loading-spinner"></div>
        Loading dashboard...
      </div>
    </div>
  ),
  ssr: false
});

// Force dynamic rendering for this page since it requires authentication
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return (
    <ProtectedPageWrapper>
      <Suspense fallback={
        <div className="loading-container">
          Loading...
        </div>
      }>
        <Dashboard />
      </Suspense>
    </ProtectedPageWrapper>
  );
}