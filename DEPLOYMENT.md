# Cravora AI — deployment and release checklist

Cravora AI is the food-discovery storefront brand built by Atlas.ai. The current repository is a static frontend prototype. Do not present it as a live food-delivery service until the backend, restaurant data, payment verification, and order lifecycle are connected.

## Deploy the current frontend to Vercel

1. Import `shubhampatil8464/atlas-ai-live-app` into the correct Vercel account.
2. Framework preset: **Other**. Build command: leave blank. Output directory: `.`.
3. Deploy the `main` branch and check the deployment's build and runtime logs.
4. Open the generated HTTPS URL and run the browser checks below against the deployment. A GitHub commit does not itself prove a Vercel deployment succeeded.

## Browser regression tests

- `npm install`
- `npx playwright install --with-deps chromium`
- `npm test`

The GitHub Actions workflow runs the same suite on pushes and pull requests. The suite covers menu rendering, search and category filters, cart quantities/subtotal, demo checkout safeguards, chatbot replies, theme toggle, local admin/social-link settings, and manual location input. Browser tests do not validate external payment providers, restaurant integrations, mobile devices, or real customer orders.

## Required before real-world ordering

- **Restaurant/menu backend:** persist merchants, locations, operating hours, menus, inventory, delivery areas, fees, taxes, and order status. Seeded menu cards are illustrative sample listings, not verified live vendors.
- **Geospatial search:** geocode delivery addresses and query real partner restaurants by service radius. Browser geolocation alone is not a nearby-vendor service.
- **Authentication and roles:** secure customer, merchant, support, and administrator accounts; enforce roles on the server. Browser-local settings are not an admin system.
- **Orders and notifications:** server-side order creation, restaurant acceptance, courier assignment/tracking, cancellations, refunds, receipts, email/SMS/push notifications, and audit history.
- **Payments:** merchant-approved payment gateway account, server-created payment intents/orders, signed webhook verification, idempotency, refund handling, and test/live credentials stored only in Vercel server environment variables. Never put secret keys in HTML, GitHub commits, or browser storage. UPI ID/QR details must be supplied and verified by the merchant.
- **AI and voice:** connect a server-side AI provider with scoped tools and order/customer context, safeguards, escalation to a human, rate limits, and usage monitoring. The current assistant is a small rule-based demo. Speech recognition support depends on browser/device.
- **Customer reviews:** collect verified, consented customer feedback; current cards are explicitly illustrative and are not real reviews.
- **Privacy and legal:** publish privacy policy, terms, refund/cancellation, delivery, allergen, and cookie/data-retention disclosures appropriate to launch markets; obtain consent for location access.
- **Observability and security:** error monitoring, server logs, backups, rate limiting, dependency scanning, and security review.

## Release status

A frontend commit is not evidence that CI passed or Vercel is live. Confirm the latest GitHub Actions run and Vercel deployment status before sharing a production URL. Payment and order placement must remain clearly marked as demo until backend verification is implemented.