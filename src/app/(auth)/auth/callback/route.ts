// ref: https://github.com/vercel/next.js/blob/canary/examples/with-supabase/app/auth/callback/route.ts

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';
import { getURL } from '@/utils/get-url';

const siteUrl = getURL();

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.exchangeCodeForSession(code);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      return NextResponse.redirect(`${siteUrl}/login`);
    }

    // ⚡ OPTIMIZED: Single query with JOIN to reduce CPU time
    const { data: userStatus, error } = await supabase
      .rpc('get_user_auth_status', {
        user_id: user.id,
        user_email: user.email
      });

    if (error) {
      console.error('[auth-callback] Failed to get user status:', error);
      return NextResponse.redirect(`${siteUrl}/login`);
    }

    const { has_subscription, is_onboarded } = userStatus[0] || {};

    // Redirect based on combined status
    if (!has_subscription) {
      return NextResponse.redirect(`${siteUrl}/pricing`);
    }

    if (!is_onboarded) {
      return NextResponse.redirect(`${siteUrl}/onboarding`);
    }

    // User has subscription and completed onboarding
    return NextResponse.redirect(`${siteUrl}/dashboard`);
  }

  return NextResponse.redirect(siteUrl);
}
