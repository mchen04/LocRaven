import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hmztritmqsscxnjhrvqi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtenRyaXRtcXNzY3huamhydnFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjIxNTgsImV4cCI6MjA3MDI5ODE1OH0.SbDaNbMQEhpeENWk_GEJwNXwUWEbh1HpdR0tH-hebLg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)