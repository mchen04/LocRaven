'use client';

import ProtectedDynamicPage from '@/lib/components/layouts/ProtectedDynamicPage';

// Force dynamic rendering for this page since it requires authentication
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return (
    <ProtectedDynamicPage
      importPath={() => import('@/lib/components/Dashboard')}
      loadingText="Loading dashboard..."
      fallbackText="Loading..."
      ssr={false}
    />
  );
}