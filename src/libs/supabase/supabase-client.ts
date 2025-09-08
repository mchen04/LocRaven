// Lightweight client-side Supabase client for Cloudflare Workers optimization
import { createBrowserClient } from '@supabase/ssr';

import { Database } from '@/libs/supabase/types';
import { getEnvVar } from '@/utils/get-env-var';

let _supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createSupabaseClient() {
  if (_supabaseClient) {
    return _supabaseClient;
  }

  const supabaseUrl = getEnvVar(
    process.env.NEXT_PUBLIC_SUPABASE_URL, 
    'NEXT_PUBLIC_SUPABASE_URL'
  );
  
  const supabaseAnonKey = getEnvVar(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );

  _supabaseClient = createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      // Edge Runtime optimizations - disable heavy features
      realtime: {
        disabled: true,
      },
      // Disable persistence to reduce bundle size
      localStorage: {
        disabled: process.env.DISABLE_SUPABASE_PERSISTENCE === 'true'
      },
      // Global configuration for edge compatibility
      global: {
        headers: {
          'User-Agent': 'LocRaven-EdgeClient/1.0',
        },
      },
      // Reduce cookie usage for edge compatibility
      cookieOptions: {
        name: 'sb-session',
        lifetime: 60 * 60 * 8, // 8 hours
        domain: undefined,
        path: '/',
        sameSite: 'lax',
      }
    }
  );

  return _supabaseClient;
}

// Export singleton instance
export const supabaseClient = createSupabaseClient();

// For environments where we need minimal imports, export a function 
// that dynamically imports Supabase only when needed
export async function createSupabaseClientAsync() {
  // Dynamic import to reduce initial bundle size
  const { createBrowserClient } = await import('@supabase/ssr');
  
  const supabaseUrl = getEnvVar(
    process.env.NEXT_PUBLIC_SUPABASE_URL, 
    'NEXT_PUBLIC_SUPABASE_URL'
  );
  
  const supabaseAnonKey = getEnvVar(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );

  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      realtime: { disabled: true },
      global: {
        headers: {
          'User-Agent': 'LocRaven-EdgeClient-Async/1.0',
        },
      }
    }
  );
}