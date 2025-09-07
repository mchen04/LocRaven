import type { Database } from '@/libs/supabase/types';
import { getEnvVar } from '@/utils/get-env-var';
import { createClient } from '@supabase/supabase-js';

export const supabaseAdminClient = createClient<Database>(
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
