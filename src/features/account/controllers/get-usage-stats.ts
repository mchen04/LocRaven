import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';

export interface UsageStats {
  updatesUsed: number;
  updatesLimit: number;
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

    // Get user's business
    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .eq('email', user.email)
      .single();

    if (!business) {
      return null;
    }

    // Get current usage period
    const { data: usageData, error } = await supabase
      .rpc('get_current_usage_period', { business_id_param: business.id });

    if (error || !usageData) {
      // Return default values if no usage tracking exists yet
      return {
        updatesUsed: 0,
        updatesLimit: 10, // Default limit
        periodStart: new Date().toISOString(),
        periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        usagePercentage: 0,
      };
    }

    const usagePercentage = (usageData.updates_used / usageData.updates_limit) * 100;

    return {
      updatesUsed: usageData.updates_used,
      updatesLimit: usageData.updates_limit,
      periodStart: usageData.usage_period_start,
      periodEnd: usageData.usage_period_end,
      usagePercentage: Math.round(usagePercentage),
    };
  } catch (error) {
    console.error('Error fetching usage stats:', error);
    return null;
  }
}