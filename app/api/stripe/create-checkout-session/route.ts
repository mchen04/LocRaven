import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/utils/supabase/server';
import { createCheckoutSession } from '@/lib/services/stripe';
import type { CreateCheckoutSessionRequest } from '@/types/subscription';


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
    const body: CreateCheckoutSessionRequest = await request.json();
    const { price_id, success_url, cancel_url } = body;
    
    // Validate required fields
    if (!price_id || !success_url || !cancel_url) {
      return NextResponse.json(
        { error: 'Missing required fields: price_id, success_url, cancel_url' },
        { status: 400 }
      );
    }
    
    // Verify the price ID exists in our subscription plans
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('stripe_price_id', price_id)
      .eq('active', true)
      .single();
    
    if (planError || !plan) {
      return NextResponse.json(
        { error: 'Invalid subscription plan' },
        { status: 400 }
      );
    }
    
    // Create checkout session with session ID in success URL for verification
    const session = await createCheckoutSession({
      price_id,
      success_url: `${new URL(success_url).origin}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url,
      customer_email: user.email,
    });
    
    return NextResponse.json(session);
    
  } catch (error) {
    console.error('Error in create-checkout-session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}