import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    'https://hmztritmqsscxnjhrvqi.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtenRyaXRtcXNzY3huamhydnFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjIxNTgsImV4cCI6MjA3MDI5ODE1OH0.SbDaNbMQEhpeENWk_GEJwNXwUWEbh1HpdR0tH-hebLg',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}