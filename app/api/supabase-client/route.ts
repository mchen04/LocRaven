import { createClient } from '@/lib/utils/supabase/server';
import { apiSuccess, withErrorHandler } from '@/lib/utils/api-response';


export const GET = withErrorHandler(async () => {
  // Create Supabase client using request context environment variables
  await createClient();
  
  // Return success indicator that client was created
  return apiSuccess({ configured: true });
});