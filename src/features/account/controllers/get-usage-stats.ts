import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';

export interface UsageStats {
  updatesUsed: number;
  updatesLimit: number | null; // null for unlimited plans
  periodStart: string;
  periodEnd: string;
  usagePercentage: number;
}

export async function getUserUsageStats(): Promise<UsageStats | null> {
  try {
    const supabase = await createSupabaseServerClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user?.email) {
      return null;
    }

    // Get user's business (same pattern as other components)
    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .eq('email', user.email)
      .single();

    if (!business) {
      return null;
    }

    // Get user's subscription to determine limits (same pattern as subscription component)
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .eq('user_id', user.id)
      .in('status', ['trialing', 'active'])
      .is('canceled_at', null)
      .order('created', { ascending: false })
      .maybeSingle();

    // Determine usage limit based on subscription tier
    let updatesLimit = 5; // Free tier default
    const metadata = subscription?.prices?.metadata as { tier?: string } | undefined;
    if (metadata?.tier === 'basic') {
      updatesLimit = 50;
    } else if (metadata?.tier === 'pro') {
      updatesLimit = 250;
    } else if (metadata?.tier === 'enterprise') {
      updatesLimit = 999999; // Unlimited (represented as high number)
    }

    // Calculate current month boundaries
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0, 0, 0, 0);
    
    const currentMonthEnd = new Date(currentMonthStart);
    currentMonthEnd.setMonth(currentMonthEnd.getMonth() + 1);

    // Get current usage tracking record (direct query like other components)
    const { data: usageData, error } = await supabase
      .from('business_usage_tracking')
      .select('*')
      .eq('business_id', business.id)
      .eq('usage_period_start', currentMonthStart.toISOString())
      .maybeSingle();

    if (error) {
      console.error('Error fetching usage tracking:', error);
      return null;
    }

    // If no usage record exists, create one
    if (!usageData) {
      const { data: newUsageData, error: insertError } = await supabase
        .from('business_usage_tracking')
        .insert({
          business_id: business.id,
          usage_period_start: currentMonthStart.toISOString(),
          usage_period_end: currentMonthEnd.toISOString(),
          updates_used: 0,
          updates_limit: updatesLimit
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating usage tracking record:', insertError);
        return null;
      }

      // Handle unlimited plans
      const usagePercentage = updatesLimit 
        ? Math.round((0 / updatesLimit) * 100)
        : 0; // 0% for unlimited plans

      return {
        updatesUsed: 0,
        updatesLimit: updatesLimit,
        periodStart: currentMonthStart.toISOString(),
        periodEnd: currentMonthEnd.toISOString(),
        usagePercentage,
      };
    }

    // Handle unlimited plans (updates_limit is null)
    const usagePercentage = usageData.updates_limit 
      ? Math.round((usageData.updates_used / usageData.updates_limit) * 100)
      : 0; // 0% for unlimited plans

    return {
      updatesUsed: usageData.updates_used,
      updatesLimit: usageData.updates_limit,
      periodStart: usageData.usage_period_start,
      periodEnd: usageData.usage_period_end,
      usagePercentage,
    };
  } catch (error) {
    console.error('Error fetching usage stats:', error);
    return null;
  }
}