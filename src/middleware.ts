import { type NextRequest, NextResponse } from 'next/server';

import { updateSession } from '@/libs/supabase/supabase-middleware-client';
import { createServerClient } from '@supabase/ssr';
import { getEnvVar } from '@/utils/get-env-var';

export async function middleware(request: NextRequest) {
  // First, update the session
  const response = await updateSession(request);
  
  const pathname = request.nextUrl.pathname;
  
  // Check for onboarding requirements
  
  // Skip onboarding checks for certain paths
  const skipOnboardingPaths = [
    '/login', '/signup', '/auth', '/api', '/_next', '/favicon.ico',
    '/onboarding', '/welcome', // Allow access to onboarding pages
    // Add paths that start with these patterns
  ];
  
  if (skipOnboardingPaths.some(path => pathname.startsWith(path))) {
    return response;
  }
  
  // Check if user needs onboarding for protected routes
  const protectedRoutes = ['/dashboard'];
  const needsOnboardingCheck = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (needsOnboardingCheck) {
    try {
      // Create Supabase client to check business status
      const supabase = createServerClient(
        getEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL'),
        getEnvVar(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'NEXT_PUBLIC_SUPABASE_ANON_KEY'),
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              // Don't modify cookies in this check
            },
          },
        }
      );
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && user.email) {
        // Check if business profile exists and is onboarded
        const { data: business } = await supabase
          .from('businesses')
          .select('is_onboarded')
          .eq('email', user.email)
          .single();
        
        // If no business profile or not onboarded, redirect to onboarding
        if (!business || !business.is_onboarded) {
          const url = request.nextUrl.clone();
          url.pathname = '/onboarding';
          return NextResponse.redirect(url);
        }
      }
    } catch (error) {
      console.error('Middleware onboarding check error:', error);
      // On error, let the request continue - the page will handle auth
    }
  }
  
  // If user is accessing onboarding but already completed, redirect to dashboard
  if (pathname === '/onboarding') {
    try {
      const supabase = createServerClient(
        getEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL'),
        getEnvVar(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'NEXT_PUBLIC_SUPABASE_ANON_KEY'),
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              // Don't modify cookies in this check
            },
          },
        }
      );
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && user.email) {
        const { data: business } = await supabase
          .from('businesses')
          .select('is_onboarded')
          .eq('email', user.email)
          .single();
        
        // If already onboarded, redirect to dashboard
        if (business && business.is_onboarded) {
          const url = request.nextUrl.clone();
          url.pathname = '/dashboard';
          return NextResponse.redirect(url);
        }
      }
    } catch (error) {
      console.error('Middleware onboarding redirect check error:', error);
    }
  }
  
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
