import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';

export async function getAuthUser() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error(error);
    return null;
  }

  return data.user;
}
