'use client';

import nextDynamic from 'next/dynamic';
import { Suspense } from 'react';
import ProtectedPageWrapper from '@/lib/components/ProtectedPageWrapper';
import LoadingSpinner from '@/lib/components/LoadingSpinner';

// Dynamically import ChatDashboard component with code splitting
const ChatDashboard = nextDynamic(() => import('@/lib/components/features/chat/ChatDashboard'), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <LoadingSpinner size="lg" text="Loading chat interface..." />
    </div>
  ),
  ssr: false
});

// Force dynamic rendering for this page since it requires authentication
export const dynamic = 'force-dynamic';

export default function ChatPage() {
  return (
    <ProtectedPageWrapper>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <LoadingSpinner size="lg" text="Loading chat..." />
        </div>
      }>
        <ChatDashboard />
      </Suspense>
    </ProtectedPageWrapper>
  );
}