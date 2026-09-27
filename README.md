# 8Mealz beta website

Securing remittance with food. Next.js 15 (App Router), TypeScript, Tailwind CSS v4.
Home page content and brand come from the 8Mealz one-pager.

## Pages

| Route | What it does |
|---|---|
| `/` | Home: hero, problem, how it works, value props, packages, extras, pricing, photos, pilot signup, country vote |
| `/send` | 4-step order: package, extras, details, review. Saves a pilot reservation and creates a pickup code |
| `/order/[code]` | Order confirmation with pickup code and live status |
| `/partners` | Market partner landing page and application form |
| `/partners/demo` | Merchant dashboard demo (sample data) |
| `/pilot` | Pilot signup page |
| `/admin` | Password-protected admin: orders, signups, partners, votes, status changes, CSV export |
| `/privacy`, `/terms`, `/pilot-disclosure` | Draft legal pages, marked for legal review |

EN / PT toggle in the navbar. Portuguese browsers get PT by default.

## Where to edit

- Prices and fees: `lib/pricing.ts` (currency, 8 membership, 8% service fee, 18 / 80 partner fees, 8% markup)
- Packages, extras, neighborhoods: `lib/data.ts`
- All site copy (EN and PT): `lib/dictionary.ts`
- Social links and footer credit: `lib/site.ts`
- Brand colors: `app/globals.css` (`@theme` block)
- Images: `public/images`, logo: `public/brand/logo.png`

## Deploy on Vercel

1. Push this folder to a GitHub repo, then import it in Vercel (or in v0: Import from GitHub).
2. In Vercel, open Storage and add Supabase. This sets `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
3. In Supabase, open SQL Editor and run `supabase/schema.sql`.
4. Add `ADMIN_PASSWORD` in Vercel environment variables.
5. Optional: add `RESEND_API_KEY` and `ADMIN_EMAIL` to get an email for every signup, application and order.
6. Set `NEXT_PUBLIC_SITE_URL` to your domain. Redeploy.

Without Supabase the site runs in demo mode. Forms work, but data lives in server memory and resets. Use demo mode for previews only.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev
```

## Beta rules built in

- No payment is taken. Orders are reservations. The team confirms payment on WhatsApp.
- All prices are recomputed on the server from `lib/data.ts` and `lib/pricing.ts`.
- The 8 membership is added once per sender email per year.
- Forms use server validation (zod) and a hidden honeypot field against spam.
