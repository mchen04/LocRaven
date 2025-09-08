import { type NextRequest, NextResponse } from 'next/server';

import { updateSession } from '@/libs/supabase/supabase-middleware-client';

export async function middleware(request: NextRequest) {
  // First, update the session
  const response = await updateSession(request);
  
  const pathname = request.nextUrl.pathname;
  
  // 2025 Security Compliance: Minimal middleware with optimistic checks only
  // No database operations per CVE-2025-29927 guidelines
  // Subscription and business logic moved to Data Access Layer (controllers)
  
  // Basic session validation for protected routes
  const protectedRoutes = ['/onboarding', '/dashboard', '/account', '/manage-subscription'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    // Simple auth token check - no database queries for security/performance
    const cookies = request.cookies;
    const hasAuthCookie = cookies.has('sb-access-token') || 
                         cookies.has('sb-hmztritmqsscxnjhrvqi-auth-token') ||
                         cookies.toString().includes('supabase-auth-token');
    
    if (!hasAuthCookie) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }
  
  // Note: Subscription verification and onboarding checks now implemented in:
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
