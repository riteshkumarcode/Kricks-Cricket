# Krickscricket — Full Build Prompt for Antigravity

> Paste everything below the line into Antigravity. Open the folder `D:\Web Design\krickscricket` as the workspace first, so the agent can read the approved design files.

---

## ROLE

You are a senior full-stack engineer and design-systems lead. You build production e-commerce on Node.js and you keep an approved visual design exactly as designed. You prefer correctness, security and clean architecture over clever shortcuts.

## MISSION (one sentence)

Turn the approved static Krickscricket design in this folder into a production-ready Node.js e-commerce web app with a full admin panel, where **every piece of content, product, price, menu, page section and setting on the storefront is editable from the admin**, and the admin itself uses the same premium visual style and is fully responsive on mobile.

## HARD RULES (read first, never break)

1. **The design in this folder is the source of truth.** Files: `index.html`, `leather-bats.html`, `tennis-bats.html`, `accessories.html`, `product.html`, `custom-bat.html`, `cart.html`, `contact.html`, `bulk-enquiry.html`, `kricks.css`, `kricks.js`, `img/`. Reproduce the layout, typography, colours, spacing, animations, hero slider, mega menu, mobile full-screen menu, bat builder, size finder and all interactions pixel-faithfully. MUST NOT redesign, "modernise", or swap in a UI kit look.
2. **Do not plan or code all at once.** Work in the phases below. At the end of each phase, produce an Antigravity Artifact (task list + implementation plan + screenshots) and **STOP and wait for my approval** before the next phase.
3. **Ask before:** deleting any file, adding a paid third-party service, changing the database schema after Phase 2 is approved, running destructive terminal commands (drop/reset/migrate --force), or force-pushing git.
4. **Never put secrets in code.** Use environment variables only and ship a `.env.example` listing every variable name with a comment (no real values).
5. After every step, output: `✅ [what was completed]` and the files touched.
6. Never invent business facts (prices, policies, addresses). Seed the sample content that already exists in the design files and mark it `sample: true` so it can be found and replaced in the admin.

## BRAND & DESIGN TOKENS (must match exactly)

- **Colours:** premium white `#FFFFFF` (primary background), soft warm white `#F4F3F0` (surfaces, product backgrounds), premium black `#111111` (text, inverse panels, footer, admin sidebar), muted text `#6B6966`, hairline `#E6E3DE`, burnt luxury orange `#C8501A` (accent: primary buttons, active states, highlights only — use sparingly), orange hover `#A9420F`.
- **Type:** Display = **Bebas Neue** (uppercase headings, nav, buttons, prices in large sizes). Body = **Jost** 400/500. Load via Google Fonts or self-host with `next/font`.
- **Shape:** square corners everywhere (radius 0) except circular icon buttons and colour swatches. Buttons are flat, 52px tall, Bebas 22px. No gradients except the dark photo scrims already in the design. No drop shadows on resting elements; shadows only on floating layers (mega menu, toasts, dropdowns, modals).
- **Motion:** keep the existing motion exactly: hero clip-path wipe + Ken Burns zoom + per-letter headline rise, nav text roll on hover, mega-menu clip reveal with staggered columns, mobile menu circle reveal from the burger with staggered links, smart header (hides on scroll down, shows on scroll up), section reveal on scroll, quick-add slide-up on product tiles. Respect `prefers-reduced-motion`.
- Extract all of this into a single design-token layer (CSS custom properties) shared by the storefront **and** the admin.

## TECH STACK (use exactly this unless you stop and ask)

- **Runtime:** Node.js 20 LTS, TypeScript strict mode.
- **Framework:** Next.js (App Router) — storefront, admin and API in one app. Server Components by default; Client Components only for interactive parts (slider, menus, builder, cart, admin forms).
- **Database:** PostgreSQL + Prisma ORM, with migrations and a seed script.
- **Auth:** Auth.js (NextAuth) — customer accounts (email + password, Google sign-in) and a separate admin login with role-based access. Passwords hashed with argon2 or bcrypt. Admin sessions expire; optional TOTP two-factor for admins.
- **Validation:** Zod on every API input and every admin form (shared schemas client + server).
- **Media:** uploads stored in Cloudinary (env-configured) with a local-disk fallback for development; automatic WebP/AVIF, responsive sizes, focal point / object-position stored per image.
- **Payments:** Razorpay (India, INR, UPI/cards/netbanking) and Stripe (international currencies). Webhooks verified by signature. Use test mode keys from env.
- **Shipping:** pluggable shipping-rate service; first adapter Shiprocket (India + international), plus manual flat-rate zones from admin.
- **Email:** transactional email via SMTP or Resend (env-configured) with React Email templates in brand style: order confirmation, shipped, delivered, refund, password reset, contact auto-reply, bulk enquiry received, abandoned cart, newsletter welcome.
- **Search:** PostgreSQL full-text search on products (name, sub-title, specs, tags).
- **Rich text:** TipTap editor in admin, stored as JSON, rendered safely.
- **Testing:** Vitest (unit), Playwright (e2e).
- **Quality:** ESLint, Prettier, Husky pre-commit.
- **Deploy target:** a Node VPS (PM2 + Nginx), also Vercel-compatible. Provide `README.md` with setup, env, migrate, seed, build, deploy steps.

## STOREFRONT — PAGES & BEHAVIOUR

Rebuild every page from the static files, but data-driven from the database:

1. **Home** — every section is a CMS block managed in admin (see "Home page builder"): announcement bar, framed hero photo slider (slides, kicker, 2-line headline with second line on its own, sub text, two buttons, linked product card, autoplay 7s, pause on hover/focus, swipe, keyboard arrows, counter + progress bars), promise strip, shop-by-category grid, bestsellers rail with category tabs and quick add, custom-bat teaser (live name/number/grip/sticker preview), "Made by hand" steps with photo, bat size finder (height slider → recommended size, length, weight, drawn to scale), club/bulk CTA, newsletter + footer.
2. **Category pages** (Leather bats, Tennis bats, Accessories, plus any new category created in admin) — photo header, intro, filters (configurable per category: grade, willow type, weight, size, price range, in stock), sort (featured, price low/high, newest, bestselling), product count, pagination or infinite load, buying-guide section (CMS).
3. **Product page** — gallery (multiple images + the existing face/back/edge drawn views as fallback), variant selectors (size, weight, hand, fit — driven by the product's option types), knocking-in add-on, free engraving field (rules from admin), quantity, stock state per variant, add to cart, price in selected currency, compare-at price, delivery estimate text, specs table, care section (knocking-in guide, CMS), related products, reviews (approved only), breadcrumbs, JSON-LD Product schema.
4. **Customised bat builder** — every option comes from admin: willow grades with price and blade colour, sizes, weights, grip colours, sticker colours, name max length + allowed characters, number max length, knocking-in price, lead time text. Live SVG preview (face/back) exactly as the current design. Adds a configured line item to the cart with all choices stored on the order.
5. **Cart** — server-persisted cart for logged-in users, cookie cart for guests, merge on login. Quantity, remove, coupon code, shipping estimate, free-shipping threshold message, totals in selected currency.
6. **Checkout** — guest or account; address with country-aware fields; shipping method selection from rates; GST invoice details (GSTIN optional) for India; Razorpay for INR, Stripe for other currencies; order created only after verified payment webhook; order-confirmation page.
7. **Customer account** — orders list and detail with tracking, addresses, profile, password, wishlist, saved custom bat designs.
8. **Contact Us** — form saved to DB + emailed, FAQ accordion (CMS), contact details (CMS).
9. **Bulk Enquiry** — estimator (bat model + quantity slider → tier discount from admin), form with logo file upload, saved to DB as a lead, emails admin + sends auto-reply.
10. **CMS pages** — Privacy, Terms, Shipping & returns, About, plus any page created in admin, at `/pages/[slug]`.
11. **Search** — header search overlay with instant results.
12. **Global** — multi-currency switcher (INR default, USD, GBP, AUD, AED, ZAR, editable list and rates in admin, optional per-product fixed prices per currency), header with rolling nav links and mega menu (content from admin), mobile full-screen menu, smart sticky header, toasts, 404 and 500 pages in brand style, cookie consent banner, WhatsApp chat button (number from admin, toggleable).
13. **SEO** — per-page and per-product meta title/description/OG image from admin, canonical URLs, `sitemap.xml`, `robots.txt`, redirects manager, JSON-LD (Organization, Product, BreadcrumbList, FAQPage), clean slugs.
14. **Performance & accessibility** — Lighthouse ≥ 90 on Performance, Accessibility, Best Practices, SEO on mobile for Home, Category and Product. WCAG 2.1 AA contrast, visible focus states, keyboard-operable menus/slider/builder, alt text from media library.

## ADMIN PANEL — EVERYTHING MANAGEABLE

Route: `/admin`. Same design language as the storefront (tokens above): white workspace, **premium black sidebar** with Bebas Neue section labels, orange for the active item and primary actions, Jost body, square inputs on `#F4F3F0`, Bebas buttons, subtle hairline dividers. It must feel like part of the same brand, not a generic dashboard template.

### Admin layout & UX
- **Desktop (≥1100px):** fixed black sidebar (collapsible to icons), top bar with global search (orders, products, customers), quick "+ New" menu, notifications bell (new orders, low stock, new enquiries, new reviews), "View store" link, profile menu.
- **Tablet (768–1099px):** sidebar collapses to icon rail; tables keep key columns.
- **Mobile (<768px):** sidebar becomes an off-canvas full-screen menu using the same circle-reveal animation as the storefront menu; a bottom tab bar (Dashboard, Orders, Products, Enquiries, More); every data table turns into stacked cards with the key fields and a tap-through to detail; forms become single-column with a sticky Save bar at the bottom; all tap targets ≥ 44px.
- Every list: search, filters, sort, pagination, column visibility, bulk select + bulk actions, CSV export; empty states with a clear first action; loading skeletons; error states with retry.
- Every form: inline Zod validation, unsaved-changes warning, Save / Save & continue / Discard, autosave drafts for long content, success and error toasts, optimistic UI where safe.
- **Live preview:** for Home page blocks, hero slides, menus, announcement bar and CMS pages, show a side-by-side preview (desktop / mobile toggle) before publishing. Draft vs Published states with "Publish" and "Schedule".
- Activity log on every record (who changed what, when).

### Admin modules (each needs list, create, edit, delete with confirm, and the fields named)

1. **Dashboard** — revenue (today/7d/30d, per currency converted to INR), orders count, AOV, conversion, top products, low-stock alerts, recent orders, new enquiries, abandoned carts, sales chart; date-range picker.
2. **Products** — name, slug, category, sub-title, description (rich text), specs (repeatable key/value: willow, grains, weight range, edges, profile, handle, finish), badges (Bestseller/New/custom text), tags, images (drag to reorder, focal point, alt text), drawing fallback colours (blade, grip, sticker, sticker text, grains, grade label — drives the SVG bat), option types and variants (size, weight, hand, fit) each with SKU, price, compare-at price, per-currency price override, stock, low-stock threshold, weight for shipping, barcode; knocking-in add-on on/off; engraving on/off; related products; SEO fields; status (draft/active/archived); duplicate product; bulk price/stock edit; CSV import/export.
3. **Categories & collections** — name, slug, header photo, intro text, buying-guide content, filter set to show, sort order, show in menu, SEO.
4. **Custom bat builder settings** — willow grades (label, price, blade colour, grains, grade label text, active), sizes, weights, grip colours (name + hex), sticker colours (name + hex + text colour), name/number rules, knocking-in price, lead-time text, default preview values.
5. **Home page builder** — reorder, show/hide and edit each block: announcement bar (text, highlighted part, link, on/off, schedule); hero slides (image with focal point, mobile image, kicker, headline line 1, headline line 2, sub text, button 1 label+link, button 2 label+link, linked product or custom card, progress label, order, active, start/end dates); promise strip items; category tiles (image, title, sub-title, link, size: large/small); bestsellers (manual pick + order, or auto by sales, tabs shown); custom-bat teaser text and colours; craft steps (title, text, photo); size chart (height ranges → size name, length, weight); club CTA (photo, heading, text, button).
6. **Navigation & mega menu** — main menu items (label, link, order, mega menu on/off), mega menu content per item (product list source, featured products, promo image, promo title, promo line, link), mobile menu photo cards, footer columns and links, footer newsletter text.
7. **Pages (CMS)** — title, slug, rich-text body with image/video blocks, FAQ blocks, SEO, status, schedule.
8. **Orders** — list with status filters; detail with line items (including full custom-bat configuration and engraving text), customer, addresses, payment status and gateway reference, shipping method; status workflow (Pending → Paid → In production (custom) → Packed → Shipped → Delivered / Cancelled / Refunded); create shipment and print label via Shiprocket; add tracking number; partial/full refund via gateway; internal notes; email customer from template; GST tax invoice PDF and packing slip PDF in brand style; manual order creation.
9. **Customers** — profile, order history, lifetime value, addresses, notes, tags, marketing consent, reset password, block/unblock.
10. **Abandoned carts** — list, value, contact, send recovery email.
11. **Bulk enquiries (CRM)** — pipeline board (New → Contacted → Quote sent → Won → Lost) with drag-and-drop, lead detail with uploaded logo, quantity, products, needed-by date, notes, quote builder (pick products + quantities → applies tier discounts → PDF quote in brand style → email to lead), convert won quote into an order.
12. **Bulk pricing tiers** — quantity ranges and discount % (drives the storefront estimator and quotes).
13. **Contact messages** — inbox with read/unread, reply by email from admin, archive.
14. **Reviews** — moderation queue (approve, reject, reply), star rating, verified-purchase flag.
15. **Discounts** — coupon codes (percent, fixed, free shipping), minimum spend, product/category limits, usage limits, start/end dates; automatic discounts.
16. **Newsletter** — subscribers list, export CSV, double opt-in toggle.
17. **Currencies** — enable/disable currencies, default currency, exchange rates (manual entry or daily auto-update from an env-configured rates API), rounding rules (e.g. .99 or whole numbers).
18. **Shipping** — zones (countries/states), rate type (flat, weight-based, free over threshold, carrier-calculated), free-shipping threshold message, delivery estimate text per zone.
19. **Taxes** — GST rates by category/HSN code, tax-inclusive pricing toggle, business GSTIN and invoice details, international tax rules.
20. **Payments** — enable/disable Razorpay/Stripe/COD, COD limits, test/live mode switch (keys stay in env).
21. **Media library** — upload, folders, search, alt text, focal point, usage list, delete with "in use" warning.
22. **SEO & redirects** — global meta defaults, OG image, redirects (301/302), sitemap regenerate.
23. **Store settings** — store name, logo (light/dark), favicon, contact email, WhatsApp number + on/off, social links, address, business hours, order number prefix, email sender name, cookie banner text.
24. **Email templates** — edit subject and body blocks for each transactional email with preview and "send test".
25. **Staff & roles** — invite staff, roles (Owner, Admin, Manager, Fulfilment, Content editor, Support) with a permissions matrix per module (view/create/edit/delete/export); 2FA enforcement option.
26. **Activity log** — global audit trail, filter by user/module/date.
27. **Backups & data** — on-demand DB export, CSV exports per module.

## API & DATA

- REST route handlers under `/api` (storefront) and `/api/admin` (admin, role-checked on every request via middleware). Rate-limit auth, contact, enquiry and checkout endpoints.
- Prisma models at minimum: User, Role, Permission, Session, Customer, Address, Category, Product, ProductImage, ProductOption, Variant, VariantPrice (per currency), Inventory, BuilderOption, Cart, CartItem, Order, OrderItem (with JSON `configuration` for custom bats), Payment, Refund, Shipment, Coupon, Review, BulkEnquiry, EnquiryStage, Quote, QuoteItem, PricingTier, ContactMessage, NewsletterSubscriber, Page, HomeBlock, HeroSlide, MenuItem, MegaMenu, FooterColumn, Media, Currency, ShippingZone, ShippingRate, TaxRule, Setting (key/value JSON), EmailTemplate, Redirect, ActivityLog.
- All money stored as integer minor units (paise) with currency code. Never floats.
- Inventory decremented atomically when payment is confirmed; release on cancellation.
- Seed script imports every product, price, spec, colour, slide text, category, FAQ and size-chart row that exists in the current design files, plus the 8 photos in `img/`, marked `sample: true`. Create one Owner admin from env `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

## SECURITY

Auth.js with httpOnly secure cookies, CSRF protection, role checks server-side on every admin route and action, Zod validation, Prisma (no raw SQL with user input), sanitised rich-text output, upload type/size checks, webhook signature verification, rate limiting, security headers (CSP, HSTS, X-Frame-Options), no PII in logs, password reset tokens that expire.

## PHASES (stop for my approval after each)

- **Phase 1 — Plan.** Read every design file. Produce an Artifact: component inventory, page map, design-token file, Prisma schema draft, API route list, admin module list, folder structure, and anything in this spec you see as a risk or contradiction. Do not write app code yet.
- **Phase 2 — Foundation.** Next.js + TypeScript setup, tokens, fonts, shared UI components (Button, Input, Select, Swatch, Tile, Toast, Modal, Drawer, Table/CardList), Prisma schema + migration + seed, Auth.js for admin and customers, admin shell (sidebar, top bar, mobile off-canvas + bottom tabs).
- **Phase 3 — Storefront.** All pages from the design, wired to the DB, with every animation and interaction preserved, currency switching, cart.
- **Phase 4 — Checkout & orders.** Payments (test mode), webhooks, shipping rates, emails, invoices, customer account.
- **Phase 5 — Admin modules.** All 27 modules above, live preview, draft/publish, permissions.
- **Phase 6 — Hardening.** SEO, performance, accessibility, security headers, tests, README and deploy guide.

## VERIFICATION (required before each phase is marked done)

- Use the browser agent to open every page built in that phase at **375px, 768px and 1440px**. Attach screenshots to the Artifact and compare side by side with the matching static design file. List any visual difference and fix it.
- Click through every interactive element (slider, menus, filters, builder, cart, forms, admin tables, admin forms on mobile).
- Playwright e2e must pass for: browse → product → add to cart → checkout (test payment) → order appears in admin → status updated to Shipped → customer sees tracking; admin edits a hero slide → storefront shows the change after publish; admin changes a product price → storefront and cart reflect it; custom bat ordered → full configuration visible on the admin order.
- `npm run lint`, `npm run typecheck`, `npm test` all pass with zero errors.

## DONE WHEN

- Every page in the static design exists in the app, looks identical at all three widths, and is data-driven.
- Every text, image, price, colour option, menu item, slide, section and setting visible on the storefront can be changed from `/admin` without touching code.
- The admin is fully usable on a 375px phone.
- A test order completes end to end with payment, email, invoice and shipment.
- All verification checks above pass and the README lets a new developer run the project in under 15 minutes.
