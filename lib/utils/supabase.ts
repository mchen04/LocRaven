// @supabase/ssr approach - browser client only (for client components)
export type { Business, Update, GeneratedPage } from '../../types'

// Export browser client factory
export { createClient as createBrowserClient } from './supabase/client'

// For components that haven't been updated yet, create a browser client instance
import { createClient } from './supabase/client'
export const supabase = createClient()