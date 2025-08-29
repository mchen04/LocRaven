import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/utils/supabase/server';
import { 
  upsertUserSubscription, 
  updateBusinessSubscriptionStatus,
  getSubscriptionPlanByPriceId 
} from '@/lib/services/stripe';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const { session_id } = await request.json();
    
    if (!session_id) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    // Verify the session was successful and for the correct user
    if (session.payment_status !== 'paid' || session.customer_email !== user.email) {
      return NextResponse.json({
        verified: false,
        error: 'Payment not completed or email mismatch'
      });
    }

    // If this is a subscription, get the subscription details
    if (session.mode === 'subscription' && session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
      
      // Get plan info
      const priceId = subscription.items.data[0]?.price?.id;
      const plan = priceId ? await getSubscriptionPlanByPriceId(priceId) : null;
      
      // Update user subscription record
      await upsertUserSubscription({
        user_email: user.email!,
        stripe_customer_id: subscription.customer as string,
        stripe_subscription_id: subscription.id,
        plan_id: plan?.id || null,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
        trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
      });
      
      // Update business subscription status
      let businessStatus = 'none';
      switch (subscription.status) {
        case 'active':
          businessStatus = 'active';
          break;
        case 'trialing':
          businessStatus = 'trial';
          break;
        case 'past_due':
          businessStatus = 'past_due';
          break;
        case 'canceled':
          businessStatus = 'canceled';
          break;
        case 'incomplete':
        case 'incomplete_expired':
          businessStatus = 'incomplete';
          break;
        default:
          businessStatus = 'none';
      }
      
      await updateBusinessSubscriptionStatus(user.email!, businessStatus, subscription.customer as string);
      
      return NextResponse.json({
        verified: true,
        subscription_status: businessStatus,
        plan_name: plan?.name
      });
    }

    // For non-subscription payments, just verify success
    return NextResponse.json({
      verified: true,
      subscription_status: 'active'
    });
    
  } catch (error) {
    console.error('Error verifying session:', error);
    return NextResponse.json(
      { error: 'Session verification failed' },
      { status: 500 }
    );
  }
}