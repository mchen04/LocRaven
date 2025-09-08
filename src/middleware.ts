import { type NextRequest, NextResponse } from 'next/server';

import { updateSession } from '@/libs/supabase/supabase-middleware-client';
import { getEnvVar } from '@/utils/get-env-var';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  // First, update the session and get user info
  const response = await updateSession(request);
  
  const pathname = request.nextUrl.pathname;
  
  // 2025 Security Compliance: Enhanced middleware with proper session validation
  // Using Supabase auth.getUser() result for secure route protection
  
  // Protected routes that require authentication
  const protectedRoutes = ['/onboarding', '/dashboard', '/account', '/manage-subscription'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    // Enhanced session validation using Supabase client
    const supabase = createServerClient(
      getEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL'),
      getEnvVar(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'NEXT_PUBLIC_SUPABASE_ANON_KEY'),
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            // Don't modify cookies in validation check
            return;
          },
        },
      }
    );
    
    // Verify actual user session
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (!user || error) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(url);
    }
  }
  
  // Note: Subscription verification and onboarding checks implemented in:
  // - Page components (client-side UX)  
  // - Data Access Layer controllers (server-side security)
  // - RLS policies (database-level enforcement)
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
