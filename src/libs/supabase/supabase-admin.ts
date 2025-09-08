import type { Database } from '@/libs/supabase/types';
import { getEnvVar, getEnvVarCompat } from '@/utils/get-env-var';
import { createClient } from '@supabase/supabase-js';

let _supabaseAdminClient: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseAdminClient() {
  if (!_supabaseAdminClient) {
    try {
      const supabaseUrl = getEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL');
      const serviceRoleKey = getEnvVar(process.env.SUPABASE_SERVICE_ROLE_KEY, 'SUPABASE_SERVICE_ROLE_KEY');
      
      _supabaseAdminClient = createClient<Database>(
        supabaseUrl,
        serviceRoleKey,
        {
          // Edge Runtime compatibility - disable realtime features that use Node.js APIs
          realtime: {
            disabled: true,
          },
          // Optimize for server-side admin operations
          global: {
            headers: {
              'User-Agent': 'LocRaven-Admin-EdgeRuntime/1.0',
            },
          },
        }
      );
      
    } catch (error) {
      // Fallback to compatibility method
      const supabaseUrl = getEnvVarCompat('NEXT_PUBLIC_SUPABASE_URL');
      const serviceRoleKey = getEnvVarCompat('SUPABASE_SERVICE_ROLE_KEY');
      
      _supabaseAdminClient = createClient<Database>(
        supabaseUrl,
        serviceRoleKey,
        {
          realtime: {
            disabled: true,
          },
          global: {
            headers: {
              'User-Agent': 'LocRaven-Admin-EdgeRuntime-Compat/1.0',
            },
          },
        }
      );
    }
  }
  return _supabaseAdminClient;
}

// For backward compatibility
export const supabaseAdminClient = new Proxy({} as any, {
  get(target, prop) {
    return getSupabaseAdminClient()[prop as keyof ReturnType<typeof getSupabaseAdminClient>];
  }
});
