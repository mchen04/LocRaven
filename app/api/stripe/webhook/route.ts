import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verifyStripeWebhook, handleStripeWebhook } from '@/lib/services/stripe';


export async function POST(request: NextRequest) {
  try {
    // Get the request body as text
    const body = await request.text();
    
    // Get the Stripe signature from headers
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');
    
    if (!signature) {
      console.error('Missing Stripe signature');
      return NextResponse.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      );
    }
    
    // Use local webhook secret for development, production secret for production
    const webhookSecret = process.env.NODE_ENV === 'development' 
      ? process.env.STRIPE_WEBHOOK_SECRET_LOCAL 
      : process.env.STRIPE_WEBHOOK_SECRET;
      
    if (!webhookSecret) {
      console.error('Webhook secret is not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }
    
    // Verify the webhook signature and construct the event
    let event;
    try {
      event = verifyStripeWebhook(body, signature, webhookSecret);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }
    
    // Handle the webhook event (gracefully handle unknown events)
    try {
      await handleStripeWebhook(event);
    } catch (error) {
      console.log(`Event ${event.type} handled with warning:`, error);
      // Continue and return 200 to prevent retries for unhandled events
    }
    
    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}