# Stripe CLI Setup for Local Development

This guide walks through setting up Stripe CLI for local webhook development.

## Prerequisites

- Homebrew installed
- Stripe account with test mode enabled
- Next.js app running on localhost:3000

## Installation & Setup

### 1. Install Stripe CLI

```bash
brew install stripe/stripe-cli/stripe
```

### 2. Authenticate with Stripe

```bash
stripe login
```

This will:
- Generate a pairing code
- Open your browser for authentication
- Connect CLI to your Stripe account

### 3. Start Webhook Forwarding

```bash
stripe listen --forward-to localhost:3000/api/webhooks
```

**Keep this terminal window open** while developing. You'll see:
- Webhook signing secret (copy this for your .env file if needed)
- Real-time webhook events as they occur

## Webhook Code Configuration

Ensure your webhook handler uses the correct secret for development:

```typescript
// Use local webhook secret in development, remote in production
const webhookSecret = process.env.NODE_ENV === 'development' 
  ? process.env.STRIPE_WEBHOOK_SECRET_LOCAL
  : process.env.STRIPE_WEBHOOK_SECRET;
```

## Testing the Integration

1. **Start your Next.js app** in a separate terminal:
   ```bash
   npm run dev
   ```

2. **Complete a test checkout** using test card `4242 4242 4242 4242`

3. **Watch the Stripe CLI terminal** for webhook events:
   ```
   --> customer.subscription.created
   --> checkout.session.completed
   --> payment_intent.succeeded
   <-- [200] POST http://localhost:3000/api/webhooks
   ```

4. **Verify data sync** in your application (e.g., subscription shows in account page)

## Common Webhook Events

- `checkout.session.completed` - Payment completed
- `customer.subscription.created` - New subscription 
- `customer.subscription.updated` - Subscription changed
- `invoice.paid` - Invoice payment succeeded

## Environment Variables

Add to your `.env.local`:

```env
# Local development webhook secret (from stripe listen command)
STRIPE_WEBHOOK_SECRET_LOCAL=whsec_...

# Production webhook secret (from Stripe dashboard)
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Troubleshooting

- **Webhook events not appearing**: Ensure Stripe CLI is running and forwarding to correct URL
- **Webhook signature verification failed**: Check you're using the correct webhook secret for your environment
- **Connection refused**: Verify your Next.js app is running on the specified port

## Production Deployment

For production, configure webhooks directly in your Stripe dashboard:
1. Go to Developers → Webhooks
2. Add endpoint with your production URL
3. Select the events your app needs
4. Update environment variables with production webhook secret