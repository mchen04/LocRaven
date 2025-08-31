'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/utils/supabase/client';

// Force dynamic rendering for this page since it requires runtime data
export const dynamic = 'force-dynamic';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabase = createClient();
      
      try {
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          router.push('/login?error=auth_callback_failed');
          return;
        }

        // Redirect to dashboard on successful authentication
        router.push('/dashboard');
      } catch (error) {
        router.push('/login?error=auth_callback_failed');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}