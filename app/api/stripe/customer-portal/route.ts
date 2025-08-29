import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/utils/supabase/server';
import { createCustomerPortalSession } from '@/lib/services/stripe';
import type { CustomerPortalRequest } from '@/types/subscription';


export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body: CustomerPortalRequest = await request.json();
    const { return_url } = body;
    
    if (!return_url) {
      return NextResponse.json(
        { error: 'Missing required field: return_url' },
        { status: 400 }
      );
    }
    
    // Get user's subscription to find Stripe customer ID
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select('stripe_customer_id')
      .eq('user_email', user.email!)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (subError || !subscription?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }
    
    // Create customer portal session
    const portalSession = await createCustomerPortalSession(
      { return_url },
      subscription.stripe_customer_id
    );
    
    return NextResponse.json(portalSession);
    
  } catch (error) {
    console.error('Error in customer-portal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}