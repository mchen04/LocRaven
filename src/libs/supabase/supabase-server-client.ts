// ref: https://github.com/vercel/next.js/blob/canary/examples/with-supabase/utils/supabase/server.ts

import { cookies } from 'next/headers';

import { Database } from '@/libs/supabase/types';
import { getEnvVar, getEnvVarCompat } from '@/utils/get-env-var';
import { type CookieOptions, createServerClient } from '@supabase/ssr';

export async function createSupabaseServerClient() {
  console.log('[supabaseServer] Creating Supabase server client...');
  
  try {
    // Get cookies with error handling for Workers compatibility
    console.log('[supabaseServer] Getting cookies...');
    const cookieStore = await cookies();
    console.log('[supabaseServer] Cookies retrieved successfully');

    // Get environment variables with fallback
    let supabaseUrl: string;
    let supabaseAnonKey: string;

    try {
      supabaseUrl = getEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL');
      supabaseAnonKey = getEnvVar(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'NEXT_PUBLIC_SUPABASE_ANON_KEY');
      console.log('[supabaseServer] Environment variables retrieved via standard method');
    } catch (envError) {
      console.log('[supabaseServer] Standard env access failed, trying compatibility mode:', envError);
      supabaseUrl = getEnvVarCompat('NEXT_PUBLIC_SUPABASE_URL');
      supabaseAnonKey = getEnvVarCompat('NEXT_PUBLIC_SUPABASE_ANON_KEY');
      console.log('[supabaseServer] Environment variables retrieved via compatibility mode');
    }

    const client = createServerClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            console.log(`[supabaseServer] Getting cookie: ${name}`);
            try {
              const value = cookieStore.get(name)?.value;
              console.log(`[supabaseServer] Cookie ${name} value:`, value ? 'present' : 'not found');
              return value;
            } catch (error) {
              console.error(`[supabaseServer] Error getting cookie ${name}:`, error);
              return undefined;
            }
          },
          set(name: string, value: string, options: CookieOptions) {
            console.log(`[supabaseServer] Setting cookie: ${name}`, { ...options, value: value ? 'present' : 'empty' });
            try {
              cookieStore.set({ name, value, ...options });
              console.log(`[supabaseServer] Cookie ${name} set successfully`);
            } catch (error) {
              console.error(`[supabaseServer] Error setting cookie ${name}:`, error);
            }
          },
          remove(name: string, options: CookieOptions) {
            console.log(`[supabaseServer] Removing cookie: ${name}`);
            try {
              cookieStore.set({ name, value: '', ...options });
              console.log(`[supabaseServer] Cookie ${name} removed successfully`);
            } catch (error) {
              console.error(`[supabaseServer] Error removing cookie ${name}:`, error);
            }
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

    console.log('[supabaseServer] Supabase server client created successfully');
    return client;

  } catch (error) {
    console.error('[supabaseServer] Failed to create Supabase server client:', error);
    console.error('[supabaseServer] Runtime info:', {
      hasCookies: typeof cookies !== 'undefined',
      hasProcess: typeof process !== 'undefined',
      isEdgeRuntime: typeof EdgeRuntime !== 'undefined',
    });
    throw error;
  }
}
