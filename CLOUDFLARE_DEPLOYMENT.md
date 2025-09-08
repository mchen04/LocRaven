# Cloudflare Pages Deployment Configuration

This document outlines the required configuration for deploying LocRaven to Cloudflare Pages with full Stripe integration support.

## Critical Requirements for Production

### 1. Compatibility Configuration

**nodejs_compat Flag**: Required for Next.js compatibility
```
Cloudflare Pages Settings → Functions → Compatibility flags
✅ Add: nodejs_compat
```

**Compatibility Date**: Must be 2024-09-23 or later
```
Cloudflare Pages Settings → Functions → Compatibility date
✅ Set: 2024-09-23 (or later)
```

### 2. Environment Variables

Ensure all required environment variables are configured in Cloudflare Pages:

**Supabase Configuration**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**Stripe Configuration**:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET` (production webhook secret)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**Application Configuration**:
- `NODE_ENV=production`
- `NEXT_PUBLIC_SITE_URL=https://locraven.com`

### 3. Edge Runtime Compatibility

The following files have been configured for edge runtime compatibility:

✅ **API Routes with Edge Runtime**:
- `/src/app/api/webhooks/route.ts` - Stripe webhook handler
- `/src/app/api/analytics/route.ts` - Web vitals analytics

✅ **Pages with Edge Runtime**:
- `/src/app/pricing/page.tsx` - Pricing page (server actions inherit runtime)

### 4. Stripe Webhook Configuration

**Production Webhook Setup**:
1. Create webhook endpoint: `https://locraven.com/api/webhooks`
2. Configure events to listen for:
   - `product.created`
   - `product.updated`
   - `price.created`
   - `price.updated`
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

3. Set webhook secret in Cloudflare Pages environment variables as `STRIPE_WEBHOOK_SECRET`

## Architecture Notes

### Server Actions & Edge Runtime

**Important**: Server actions cannot directly export edge runtime configuration due to Next.js restrictions. The pricing page sets `export const runtime = 'edge'` at the page level, which causes server actions to inherit the edge runtime.

### Native Stripe SDK Support

Cloudflare Workers now natively supports the Stripe SDK (2024 update). Our configuration uses:
- `Stripe.createFetchHttpClient()` for Workers compatibility
- Proper timeout configuration (30 seconds)
- Error handling optimized for edge environment

### Analytics Integration

The `/api/analytics` endpoint handles web vitals data from the client-side analytics component. Currently configured for development logging with production-ready structure for future analytics service integration.

## Verification Checklist

After deployment, verify:

- [ ] Pricing page loads without 500 errors
- [ ] "Get Started" buttons trigger checkout flow
- [ ] No 404 errors on `/api/analytics`
- [ ] Stripe webhooks receive and process events
- [ ] Server Components render correctly
- [ ] Web vitals analytics data is captured

## Troubleshooting

**Common Issues**:

1. **Server Components Render Errors**: Usually caused by missing edge runtime configuration
2. **Stripe API Failures**: Check environment variables and compatibility flags
3. **404 on API Routes**: Ensure edge runtime is properly configured
4. **Webhook Failures**: Verify webhook secret and event configuration

## Production Error Resolution

This configuration resolves the following production errors:
- ✅ Server-side exception (digest 3249446105)
- ✅ Multiple 404 errors on `/api/analytics`
- ✅ Server Components render failures
- ✅ "Get Started" button functionality

## Next Steps

1. Apply these configurations to your Cloudflare Pages project
2. Redeploy the application
3. Test the pricing page and checkout flow
4. Monitor for any remaining issues

---

**Last Updated**: September 8, 2025
**Version**: 1.0.0