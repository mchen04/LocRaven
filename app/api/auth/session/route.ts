import { createClient } from '@/lib/utils/supabase/server';
import { apiSuccess, apiError, withErrorHandler } from '@/lib/utils/api-response';


export const GET = withErrorHandler(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    return apiError('Unauthorized: ' + error.message, 401);
  }
  
  return apiSuccess(data);
});