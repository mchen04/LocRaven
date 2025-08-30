'use client';

import ProtectedDynamicPage from '@/lib/components/layouts/ProtectedDynamicPage';

// Force dynamic rendering for this page since it requires authentication
export const dynamic = 'force-dynamic';

export default function ChatPage() {
  return (
    <ProtectedDynamicPage
      importPath={() => import('@/lib/components/features/chat/ChatDashboard')}
      loadingText="Loading chat interface..."
      fallbackText="Loading chat..."
      ssr={false}
    />
  );
}