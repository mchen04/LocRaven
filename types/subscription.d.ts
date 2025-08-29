// Subscription-related TypeScript definitions for LocRaven

export interface SubscriptionPlan {
  id: string;
  stripe_price_id: string;
  stripe_product_id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'day' | 'week' | 'month' | 'year';
  interval_count: number;
  trial_period_days: number;
  features: string[];
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_email: string;
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
  plan_id: string | null;
  status: SubscriptionStatus;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  trial_start: string | null;
  trial_end: string | null;
  created_at: string;
  updated_at: string;
}

export type SubscriptionStatus = 
  | 'incomplete'
  | 'incomplete_expired'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'paused';

export type BusinessSubscriptionStatus = 
  | 'none'
  | 'trial'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'incomplete';

export interface SubscriptionStatusResponse {
  has_active_subscription: boolean;
  subscription_status: string;
  plan_name: string | null;
  current_period_end: string | null;
  trial_end: string | null;
}

// Stripe-related interfaces
export interface CreateCheckoutSessionRequest {
  price_id: string;
  success_url: string;
  cancel_url: string;
  customer_email?: string;
}

export interface CreateCheckoutSessionResponse {
  checkout_url: string;
  session_id: string;
}

export interface CustomerPortalRequest {
  return_url: string;
}

export interface CustomerPortalResponse {
  portal_url: string;
}

// Webhook event interfaces
export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
}

export interface StripeSubscription {
  id: string;
  customer: string;
  status: SubscriptionStatus;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  canceled_at: number | null;
  trial_start: number | null;
  trial_end: number | null;
  items: {
    data: Array<{
      price: {
        id: string;
        product: string;
      };
    }>;
  };
}

export interface StripeCustomer {
  id: string;
  email: string;
  created: number;
}

