import type { Database } from '@/libs/supabase/types';
import { getEnvVar, getEnvVarCompat } from '@/utils/get-env-var';
import { createClient } from '@supabase/supabase-js';

let _supabaseAdminClient: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseAdminClient() {
  if (!_supabaseAdminClient) {
    console.log('[supabaseAdmin] Initializing Supabase admin client...');
    
    try {
      // Try standard method first
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
      
      console.log('[supabaseAdmin] Supabase admin client initialized successfully');
      
    } catch (error) {
      console.error('[supabaseAdmin] Standard initialization failed:', error);
      
      try {
        // Fallback to compatibility method
        console.log('[supabaseAdmin] Attempting compatibility mode initialization...');
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
        
        console.log('[supabaseAdmin] Supabase admin client initialized via compatibility mode');
        
      } catch (compatError) {
        console.error('[supabaseAdmin] Compatibility mode also failed:', compatError);
        throw new Error(`Failed to initialize Supabase admin client: ${compatError instanceof Error ? compatError.message : 'Unknown error'}`);
      }
    }
  }
  return _supabaseAdminClient;
}

// For backward compatibility
export const supabaseAdminClient = new Proxy({} as any, {
  get(target, prop) {
    try {
      console.log(`[supabaseAdmin] Accessing Supabase admin method: ${String(prop)}`);
      return getSupabaseAdminClient()[prop as keyof ReturnType<typeof getSupabaseAdminClient>];
    } catch (error) {
      console.error(`[supabaseAdmin] Error accessing Supabase admin method ${String(prop)}:`, error);
      throw error;
    }
  }
});
