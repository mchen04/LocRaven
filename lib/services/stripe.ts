// Stripe service functions for LocRaven subscription management

import Stripe from 'stripe';
import { createClient } from '../utils/supabase/server';
import type { 
  SubscriptionPlan, 
  UserSubscription, 
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse,
  CustomerPortalRequest,
  CustomerPortalResponse,
  SubscriptionStatusResponse
} from '@/types/subscription';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
});

// Webhook signature verification
export function verifyStripeWebhook(
  payload: string,
  signature: string,
  secret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, secret);
}

// Get all active subscription plans
export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const supabase = await createClient();
  
  const { data: plans, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('active', true)
    .order('sort_order');
  
  if (error) {
    console.error('Error fetching subscription plans:', error);
    throw new Error('Failed to fetch subscription plans');
  }
  
  return plans || [];
}

// Create Stripe checkout session
export async function createCheckoutSession(
  request: CreateCheckoutSessionRequest
): Promise<CreateCheckoutSessionResponse> {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: request.price_id,
          quantity: 1,
        },
      ],
      success_url: request.success_url,
      cancel_url: request.cancel_url,
      customer_email: request.customer_email,
      subscription_data: {
        trial_settings: {
          end_behavior: {
            missing_payment_method: 'cancel',
          },
        },
      },
      payment_method_collection: 'if_required',
      billing_address_collection: 'auto',
      automatic_tax: { enabled: false },
    });

    return {
      checkout_url: session.url!,
      session_id: session.id,
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error('Failed to create checkout session');
  }
}

// Create customer portal session
export async function createCustomerPortalSession(
  request: CustomerPortalRequest,
  customer_id: string
): Promise<CustomerPortalResponse> {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customer_id,
      return_url: request.return_url,
    });

    return {
      portal_url: session.url,
    };
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    throw new Error('Failed to create customer portal session');
  }
}

// Get user's current subscription status
export async function getUserSubscriptionStatus(
  userEmail: string
): Promise<SubscriptionStatusResponse | null> {
  const supabase = await createClient();
  
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

// Create or update user subscription record
export async function upsertUserSubscription(
  subscription: Partial<UserSubscription>
): Promise<void> {
  const supabase = await createClient();
  
  try {
    const { error } = await supabase
      .from('user_subscriptions')
      .upsert(subscription, {
        onConflict: 'stripe_customer_id',
      });
    
    if (error) {
      console.error('Error upserting user subscription:', error);
      throw new Error('Failed to update subscription record');
    }
  } catch (error) {
    console.error('Error in upsertUserSubscription:', error);
    throw error;
  }
}

// Update business subscription status
export async function updateBusinessSubscriptionStatus(
  userEmail: string,
  subscriptionStatus: string,
  stripeCustomerId?: string
): Promise<void> {
  const supabase = await createClient();
  
  try {
    const updateData: any = { subscription_status: subscriptionStatus };
    if (stripeCustomerId) {
      updateData.stripe_customer_id = stripeCustomerId;
    }
    
    const { error } = await supabase
      .from('businesses')
      .update(updateData)
      .eq('email', userEmail);
    
    if (error) {
      console.error('Error updating business subscription status:', error);
      throw new Error('Failed to update business subscription status');
    }
  } catch (error) {
    console.error('Error in updateBusinessSubscriptionStatus:', error);
    throw error;
  }
}

// Get subscription plan by Stripe price ID
export async function getSubscriptionPlanByPriceId(
  priceId: string
): Promise<SubscriptionPlan | null> {
  const supabase = await createClient();
  
  try {
    const { data: plan, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('stripe_price_id', priceId)
      .single();
    
    if (error) {
      console.error('Error fetching subscription plan by price ID:', error);
      return null;
    }
    
    return plan;
  } catch (error) {
    console.error('Error in getSubscriptionPlanByPriceId:', error);
    return null;
  }
}

// Handle Stripe webhook events
export async function handleStripeWebhook(event: Stripe.Event): Promise<void> {
  console.log(`Processing webhook event: ${event.type}`);
  
  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
        
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
        
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
        
      default:
        console.log(`Received unhandled event type: ${event.type} - returning success`);
        // Return success for all events to prevent Stripe retries
        return;
    }
  } catch (error) {
    console.error(`Error handling webhook event ${event.type}:`, error);
    // Don't throw error for unhandled events - just log and continue
    if (!['customer.subscription.created', 'customer.subscription.updated', 'customer.subscription.deleted', 'invoice.payment_succeeded', 'invoice.payment_failed'].includes(event.type)) {
      console.log(`Continuing despite error for unhandled event: ${event.type}`);
      return;
    }
    throw error;
  }
}

// Handle subscription updates
async function handleSubscriptionUpdate(subscription: Stripe.Subscription): Promise<void> {
  const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
  const userEmail = customer.email;
  
  if (!userEmail) {
    console.error('No email found for customer:', subscription.customer);
    return;
  }
  
  // Get plan info
  const priceId = subscription.items.data[0]?.price?.id;
  const plan = priceId ? await getSubscriptionPlanByPriceId(priceId) : null;
  
  // Update user subscription record
  await upsertUserSubscription({
    user_email: userEmail,
    stripe_customer_id: subscription.customer as string,
    stripe_subscription_id: subscription.id,
    plan_id: plan?.id || null,
    status: subscription.status as any,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
    canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
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
  
  await updateBusinessSubscriptionStatus(userEmail, businessStatus, subscription.customer as string);
}

// Handle subscription deletion
async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
  const userEmail = customer.email;
  
  if (!userEmail) {
    console.error('No email found for customer:', subscription.customer);
    return;
  }
  
  // Update user subscription record
  await upsertUserSubscription({
    user_email: userEmail,
    stripe_customer_id: subscription.customer as string,
    stripe_subscription_id: subscription.id,
    status: 'canceled',
    canceled_at: new Date().toISOString(),
  });
  
  // Update business subscription status
  await updateBusinessSubscriptionStatus(userEmail, 'canceled');
}

// Handle successful payment
async function handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
    await handleSubscriptionUpdate(subscription);
  }
}

// Handle failed payment
async function handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
    const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
    const userEmail = customer.email;
    
    if (userEmail) {
      await updateBusinessSubscriptionStatus(userEmail, 'past_due');
    }
  }
}