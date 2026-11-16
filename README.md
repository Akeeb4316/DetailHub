# DetailHub

Customers book and pay online for mobile car detailing; DetailHub sends a local detailer.
Stack: Next.js (TypeScript), Node.js, Stripe Checkout.

## Run it
1. Install Node.js 20+ from nodejs.org
2. `npm install`
3. Copy `.env.example` to `.env.local` and paste your Stripe **test** secret key (dashboard.stripe.com/test/apikeys)
4. `npm run dev` then open http://localhost:3000
5. Pay with test card `4242 4242 4242 4242`, any future date, any CVC

## What works now
Service/size/add-on selection, live price, address and time request, server-side pricing, Stripe payment.

## Next steps (in order)
1. Stripe webhook to save paid bookings in PostgreSQL
2. Detailer accounts, job notifications (email/SMS)
3. Stripe Connect payouts with your commission
4. Admin dashboard, reviews, automatic matching by ZIP
