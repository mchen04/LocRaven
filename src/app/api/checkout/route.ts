import { getAuthUser } from '@/features/account/controllers/get-auth-user';
import { getOrCreateCustomer } from '@/features/account/controllers/get-or-create-customer';
import { stripeAdmin } from '@/libs/stripe/stripe-admin';
import { getURL } from '@/utils/get-url';

async function handleCheckout(req: Request) {
  try {
    const { priceId } = await req.json();

    if (!priceId) {
      return Response.json({ error: 'Price ID is required' }, { status: 400 });
    }

    // 1. Get the authenticated user
    const user = await getAuthUser();

    if (!user) {
      return Response.json({ 
        error: 'Unauthorized',
        redirectUrl: `${getURL()}/signup`
      }, { status: 401 });
    }

    if (!user.email) {
      return Response.json({ error: 'User email not found' }, { status: 400 });
    }

    // 2. Get price details from Stripe to determine mode
    const price = await stripeAdmin.prices.retrieve(priceId);
    const mode = price.type === 'recurring' ? 'subscription' : 'payment';

    // 3. Retrieve or create the customer in Stripe
    const customer = await getOrCreateCustomer({
      userId: user.id,
      email: user.email,
    });

    // 4. Create a checkout session in Stripe
    const checkoutSession = await stripeAdmin.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      customer,
      customer_update: {
        address: 'auto',
      },
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode,
      allow_promotion_codes: true,
      success_url: `${getURL()}/onboarding`,
      cancel_url: `${getURL()}/`,
    });

    if (!checkoutSession || !checkoutSession.url) {
      return Response.json({ error: 'Failed to create checkout session' }, { status: 500 });
    }

    // 5. Return checkout URL for client-side redirect
    return Response.json({ 
      checkoutUrl: checkoutSession.url,
      success: true
    });

  } catch (error) {
    console.error('Checkout API error:', error);
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  return handleCheckout(req);
}