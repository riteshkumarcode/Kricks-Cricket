# Krickscricket · Cricket Bats Made by Hand

> A production-grade e-commerce platform and workshop back-office system for handcrafted English and Kashmir willow cricket bats, built with Next.js 14 (App Router), TypeScript, Prisma ORM, and Auth.js.

Every piece of storefront content, product specification, willow grade, grip/sticker color swatch, hero slide, menu link, tiered club volume pricing rule, and store setting is manageable without touching code via the integrated 27-module `/admin` panel.

---

## 1. Quickstart Guide (Under 15 Minutes)

### Prerequisites
- **Node.js**: `v20 LTS` or newer
- **Package Manager**: `npm` (v10+)
- **Database**: PostgreSQL (Neon, Supabase, or local Docker container)

### Step 1: Clone & Install Dependencies
```bash
git clone https://github.com/your-org/krickscricket.git
cd krickscricket
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in the essential variables in `.env`:
- `NEXTAUTH_SECRET`: Generate a secure 32-byte secret (`openssl rand -hex 32`)
- `DATABASE_URL`: Your PostgreSQL connection string (or use the built-in resilient file fallback for rapid local testing)
- `ADMIN_EMAIL`: Initial staff administrator email (e.g. `admin@krickscricket.com`)
- `ADMIN_PASSWORD`: Master password for the admin portal

### Step 3: Seed Database & Initialize Sample Content
```bash
# Push schema to database
npm run db:push

# Seed products, initial slides, and admin account
npm run db:seed
```
*Note: The platform features resilient dual-storage. If a live database connection is not provided, all catalog and orders logic transparently fails over to persistent JSON storage under `data/`, guaranteeing 100% development uptime.*

### Step 4: Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** to view the storefront, or navigate to **[http://localhost:3000/admin](http://localhost:3000/admin)** to access the workshop admin panel.

---

## 2. Tech Stack

- **Framework**: Next.js 14.2.15 (App Router with React Server Components)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS + Custom Design Token Layer (`globals.css`)
- **Typography**: Google Fonts via `next/font` — Display: *Bebas Neue*, Body: *Jost*
- **Database & ORM**: PostgreSQL with Prisma ORM
- **Authentication**: Auth.js / NextAuth (Role-based access control + session cookies)
- **Procedural SVG Engine**: Zero-asset procedural bat and accessory generator (`src/lib/svg-bat.ts`, `src/lib/svg-items.ts`)
- **Validation**: Zod (End-to-end client & server schemas)
- **Testing**: Vitest (Unit) & Playwright (E2E across 375px, 768px, 1440px)

---

## 3. Brand & Design Tokens

| Token | Value | Application |
|---|---|---|
| **Primary Canvas** | `#FFFFFF` | Default page background, white cards, high-contrast panels |
| **Soft Warm Canvas** | `#F4F3F0` | Workspace backgrounds, secondary cards, product backdrop tiles |
| **Premium Black** | `#111111` | Primary text, inverse panels, footer, fixed admin sidebar |
| **Burnt Luxury Orange** | `#C8501A` | Primary action buttons, active navigation, price accents |
| **Orange Hover** | `#A9420F` | Interactive button and link hover states |
| **Muted Ink** | `#6B6966` | Secondary body text, subtitles, specs labels |
| **Hairline Divider** | `#E6E3DE` | Subtle 1px structural borders and dividers |
| **Display Font** | `Bebas Neue` | All uppercase headings, navigation links, buttons, prices |
| **Body Font** | `Jost` (400/500) | Editorial copy, descriptions, specifications tables, forms |
| **Corner Radius** | `0px` (Square) | Applied everywhere (buttons, inputs, cards, dialogs) |

---

## 4. Architecture & Key Features

### Storefront Routes
- `/`: Hero slider (Ken Burns zoom, split-text rise), promise strip, category grid, bestsellers rail, custom bat teaser, craft steps, bat size finder slider, club CTA.
- `/leather-bats`: Filterable catalog of English willow blades (Grade 1 Pro, Players, Match).
- `/tennis-bats`: Lightweight Kashmir willow and composite box-cricket bats.
- `/accessories`: Linseed bat care kits, octopus grips, mallet, balls, toe guards.
- `/custom-bat`: Real-time SVG custom bat builder (willow grades, grip colors, sticker decals, laser-engraved name & number, knocking-in service).
- `/cart`: Multi-currency cart with quantity adjustment, coupon engine, free shipping threshold bar.
- `/checkout`: Responsive 2-column checkout with domestic/international country fields, shipping methods, and Razorpay/Stripe/COD options.
- `/order-success/[orderNumber]`: 4-stage tracking timeline, item summary, WhatsApp alert, and printable Tax Invoice.
- `/bulk-enquiry`: Tiered wholesale calculator (10–100+ bats) with squad specifications and logo upload.

### Admin Panel (`/admin`) — 27 Modules
1. **Dashboard** (`/admin`): Real-time revenue, AOV, order volume, low stock alerts, date range selector.
2. **Products** (`/admin/products`): Full catalog management, specs repeater, prices, drawing tokens, live SVG preview.
3. **Categories** (`/admin/categories`): Banner images, buying guides, filter configurations.
4. **Custom Builder** (`/admin/custom-builder`): Willow grades, blade tints, grip/sticker palettes, knocking-in fee.
5. **Home Builder** (`/admin/home-builder`): Reorder blocks, edit framed hero slides, side-by-side device preview.
6. **Navigation** (`/admin/navigation`): Header links, mega menu columns, mobile drawer, footer directory.
7. **CMS Pages** (`/admin/pages`): Dynamic policy pages (`About`, `Terms`, `Privacy`, `Shipping`).
8. **Orders** (`/admin/orders`): Status transitions (`PENDING` → `PAID` → `IN_PRODUCTION` → `PACKED` → `SHIPPED`), tracking carrier and AWB input, custom bat spec sheet inspection.
9. **Customers** (`/admin/customers`): Lifetime spend, order count, account block/unblock.
10. **Abandoned Carts** (`/admin/abandoned-carts`): Shopper recovery email dispatcher.
11. **Bulk Enquiries** (`/admin/bulk-enquiries`): Kanban CRM pipeline (`New` → `Quote Sent` → `Won`) with quote generator.
12. **Bulk Pricing** (`/admin/bulk-pricing`): Tier discounts editor.
13. **Messages** (`/admin/messages`): Storefront contact inbox with email reply.
14. **Reviews** (`/admin/reviews`): Customer testimonials moderation queue.
15. **Discounts** (`/admin/discounts`): Promotional coupons (`WELCOME10`, `CLUB15`, `FREESHIP`).
16. **Newsletter** (`/admin/newsletter`): Audience list with CSV export and double opt-in.
17. **Currencies** (`/admin/currencies`): Multi-currency exchange rate multipliers (`INR`, `USD`, `GBP`, `AUD`, `AED`, `ZAR`).
18. **Shipping** (`/admin/shipping`): Domestic standard/express rates, free shipping threshold (₹10,000), global courier fees.
19. **Taxes & GST** (`/admin/taxes`): Business GSTIN, HSN `95069920`, 12% GST intra-state vs inter-state rules.
20. **Payments** (`/admin/payments`): Razorpay, Stripe, and COD toggles and test mode limits.
21. **Media Library** (`/admin/media`): Photograph gallery, focal points, SEO alt tags.
22. **SEO & Redirects** (`/admin/seo`): Global meta tags, OpenGraph images, robots.txt, 301 redirects, sitemap.
23. **Store Settings** (`/admin/settings`): Business hotline, floating WhatsApp chat number, physical address.
24. **Email Templates** (`/admin/email-templates`): Branded transactional HTML email templates with live test send.
25. **Staff & Roles** (`/admin/staff`): Team invites, role permissions matrix (`Owner`, `Manager`, `Fulfilment`, `Editor`), 2FA enforcement.
26. **Activity Log** (`/admin/activity-log`): Audit trail of all administrative actions.
27. **Backups & Data** (`/admin/backups`): On-demand full JSON database dump and per-module CSV downloads.

---

## 5. Verification & Testing

Run all automated verification suites:

```bash
# 1. Typecheck TypeScript strict build
npm run typecheck

# 2. Linting
npm run lint

# 3. Unit tests (Vitest)
npm test

# 4. End-to-End browser tests (Playwright)
npm run test:e2e
```

---

## 6. Production Deployment

### Option A: Vercel (Recommended)
1. Push your repository to GitHub.
2. Import the project into Vercel.
3. Add the environment variables from `.env.example` in the Vercel Dashboard.
4. Deploy with automatic Next.js App Router optimizations, edge caching, and image optimization.

### Option B: Docker / Node.js Production Build
```bash
# Build optimized production bundle
npm run build

# Start production server on port 3000
npm run start
```

---

## 7. License

Proprietary © Krickscricket Gear Private Limited. All rights reserved.

