'use client';

import AuthCallback from '@/lib/components/features/auth/AuthCallback';

// Force dynamic rendering for this page since it requires runtime data
export const dynamic = 'force-dynamic';

export default function AuthCallbackPage() {
  return <AuthCallback />;
}