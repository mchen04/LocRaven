// ref: https://github.com/vercel/next.js/blob/canary/examples/with-supabase/utils/supabase/server.ts

import { cookies } from 'next/headers';

import { Database } from '@/libs/supabase/types';
import { getEnvVar, getEnvVarCompat } from '@/utils/get-env-var';
import { type CookieOptions, createServerClient } from '@supabase/ssr';

export async function createSupabaseServerClient() {
  try {
    const cookieStore = await cookies();

    // Get environment variables with fallback
    let supabaseUrl: string;
    let supabaseAnonKey: string;

    try {
      supabaseUrl = getEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL');
      supabaseAnonKey = getEnvVar(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'NEXT_PUBLIC_SUPABASE_ANON_KEY');
    } catch (envError) {
      supabaseUrl = getEnvVarCompat('NEXT_PUBLIC_SUPABASE_URL');
      supabaseAnonKey = getEnvVarCompat('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    }

    const client = createServerClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
        // Edge Runtime compatibility - disable realtime features that use Node.js APIs
        realtime: {
          disabled: true,
        },
        // Additional edge runtime optimizations
        global: {
          headers: {
            'User-Agent': 'LocRaven-EdgeRuntime/1.0',
          },
        },
      }
    );

    return client;

  } catch (error) {
    console.error('[supabaseServer] Failed to create client:', error);
    throw error;
  }
}
