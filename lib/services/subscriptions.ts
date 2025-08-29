// Supabase subscription service functions for client-side operations

import { createBrowserClient } from '../utils/supabase';
import type { 
  SubscriptionPlan, 
  UserSubscription, 
  SubscriptionStatusResponse 
} from '@/types/subscription';

// Get all active subscription plans (client-side)
export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const supabase = createBrowserClient();
  
  const { data: plans, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('active', true)
    .order('sort_order');
  
  if (error) {
    console.error('Error fetching subscription plans:', error);
    return [];
  }
  
  return plans || [];
}

// Get user's current subscription status (client-side)
export async function getUserSubscriptionStatus(
  userEmail: string
): Promise<SubscriptionStatusResponse | null> {
  const supabase = createBrowserClient();
  
  try {
    const { data, error } = await supabase
      .rpc('get_user_subscription_status', { user_email_param: userEmail });
    
    if (error) {
      console.error('Error getting subscription status:', error);
      return null;
    }
    
    return data?.[0] || null;
  } catch (error) {
    console.error('Error fetching user subscription status:', error);
    return null;
  }
}

// Get user's subscription details (client-side)
export async function getUserSubscription(
  userEmail: string
): Promise<UserSubscription | null> {
  const supabase = createBrowserClient();
  
  try {
    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        plan:subscription_plans(*)
      `)
      .eq('user_email', userEmail)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error getting user subscription:', error);
      return null;
    }
    
    return subscription;
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    return null;
  }
}

// Check if user has active subscription (client-side)
export async function hasActiveSubscription(userEmail: string): Promise<boolean> {
  const status = await getUserSubscriptionStatus(userEmail);
  return status?.has_active_subscription || false;
}

// Get subscription plan by ID (client-side)
export async function getSubscriptionPlanById(planId: string): Promise<SubscriptionPlan | null> {
  const supabase = createBrowserClient();
  
  try {
    const { data: plan, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single();
    
    if (error) {
      console.error('Error fetching subscription plan:', error);
      return null;
    }
    
    return plan;
  } catch (error) {
    console.error('Error fetching subscription plan:', error);
    return null;
  }
}