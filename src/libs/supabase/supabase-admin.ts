import type { Database } from '@/libs/supabase/types';
import { getEnvVar } from '@/utils/get-env-var';
import { createClient } from '@supabase/supabase-js';

let _supabaseAdminClient: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseAdminClient() {
  if (!_supabaseAdminClient) {
    _supabaseAdminClient = createClient<Database>(
      getEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL'),
      getEnvVar(process.env.SUPABASE_SERVICE_ROLE_KEY, 'SUPABASE_SERVICE_ROLE_KEY'),
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
  }
  return _supabaseAdminClient;
}

// For backward compatibility
export const supabaseAdminClient = new Proxy({} as any, {
  get(target, prop) {
    return getSupabaseAdminClient()[prop as keyof ReturnType<typeof getSupabaseAdminClient>];
  }
});
