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

    // Check if user is subscribed, if not redirect to pricing page
    const { data: userSubscription } = await supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .or('status.eq.trialing,status.eq.active')
      .maybeSingle();

    if (!userSubscription) {
      return NextResponse.redirect(`${siteUrl}/pricing`);
    }

    // Check if user has completed onboarding
    const { data: business } = await supabase
      .from('businesses')
      .select('is_onboarded')
      .eq('email', user.email)
      .single();

    // If has subscription but not onboarded, go to onboarding
    if (!business || !business.is_onboarded) {
      return NextResponse.redirect(`${siteUrl}/onboarding`);
    }

    // If has subscription and onboarded, go to dashboard
    return NextResponse.redirect(`${siteUrl}/dashboard`);
  }

  return NextResponse.redirect(siteUrl);
}
