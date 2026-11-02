import fs from "fs";
import path from "path";
import { CatalogProduct, PRODUCTS } from "./catalog";
import { HeroSlideData } from "@/components/storefront/HeroSlider";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJsonFile<T>(filename: string, fallback: T): T {
  ensureDir();
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), "utf-8");
    return fallback;
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJsonFile<T>(filename: string, data: T): void {
  ensureDir();
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

/* =========================================================================
   1. PRODUCTS
   ========================================================================= */
export function getStoredProducts(): CatalogProduct[] {
  return readJsonFile<CatalogProduct[]>("products.json", PRODUCTS);
}

export function saveStoredProducts(products: CatalogProduct[]): void {
  writeJsonFile("products.json", products);
}

export function getStoredProductById(id: string): CatalogProduct | undefined {
  const list = getStoredProducts();
  return list.find((p) => p.id === id || p.slug === id);
}

export function updateStoredProduct(id: string, updates: Partial<CatalogProduct>): CatalogProduct | null {
  const list = getStoredProducts();
  const index = list.findIndex((p) => p.id === id || p.slug === id);
  if (index === -1) return null;
  list[index] = { ...list[index], ...updates };
  saveStoredProducts(list);
  logActivity("admin@kricks.com", "UPDATE_PRODUCT", `Updated product ${list[index].name}`);
  return list[index];
}

export function createStoredProduct(prod: CatalogProduct): CatalogProduct {
  const list = getStoredProducts();
  list.unshift(prod);
  saveStoredProducts(list);
  logActivity("admin@kricks.com", "CREATE_PRODUCT", `Created product ${prod.name}`);
  return prod;
}

export function deleteStoredProduct(id: string): boolean {
  const list = getStoredProducts();
  const next = list.filter((p) => p.id !== id && p.slug !== id);
  if (next.length === list.length) return false;
  saveStoredProducts(next);
  logActivity("admin@kricks.com", "DELETE_PRODUCT", `Deleted product ${id}`);
  return true;
}

/* =========================================================================
   2. HERO SLIDES
   ========================================================================= */
const DEFAULT_HERO_SLIDES: (HeroSlideData & { id: string; active: boolean; order: number })[] = [
  {
    id: "slide-1",
    order: 1,
    active: true,
    kick: "Leather bats",
    hl: ["Built for", "the big hit."],
    sub: "Grade 1 English willow, pressed and shaped by hand. Big edges, a low middle and a pick-up lighter than it weighs.",
    cta: "Shop leather bats",
    href: "/leather-bats",
    label: "Leather bats",
    card: { p: "pro-edition", k: "Bestseller" },
    img: "/img/shot.jpg",
    imgPos: "50% 40%",
  },
  {
    id: "slide-2",
    order: 2,
    active: true,
    kick: "Customised bat",
    hl: ["Your name", "on the willow."],
    sub: "Pick the willow, the grip and the sticker colours. We engrave your name and number down the blade.",
    cta: "Design your bat",
    href: "/custom-bat",
    label: "Customised bat",
    card: { custom: true, k: "Made to order" },
    img: "/img/whites.jpg",
    imgPos: "50% 30%",
  },
  {
    id: "slide-3",
    order: 3,
    active: true,
    kick: "Tennis bats",
    hl: ["Play under", "the lights."],
    sub: "Light Kashmir willow bats for box cricket, night leagues and the taped ball.",
    cta: "Shop tennis bats",
    href: "/tennis-bats",
    label: "Tennis bats",
    card: { p: "street", k: "Night-league pick" },
    img: "/img/redsky.jpg",
  },
  {
    id: "slide-4",
    order: 4,
    active: true,
    kick: "Clubs & academies",
    hl: ["Kit out", "the whole XI."],
    sub: "Tiered pricing for clubs, schools and academies. Custom club stickers, coloured grips and batch knocking-in.",
    cta: "Request club quote",
    href: "/bulk-enquiry",
    label: "Club orders",
    card: { p: "club-pack", k: "Save up to 30%" },
    img: "/img/ground.jpg",
    imgPos: "50% 60%",
  },
];

export function getHeroSlides() {
  return readJsonFile("hero-slides.json", DEFAULT_HERO_SLIDES);
}

export function saveHeroSlides(slides: typeof DEFAULT_HERO_SLIDES) {
  writeJsonFile("hero-slides.json", slides);
  logActivity("admin@kricks.com", "UPDATE_HERO_SLIDES", "Published hero slides update");
}

/* =========================================================================
   3. CATEGORIES
   ========================================================================= */
export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string;
  badge: string;
  headerImage: string;
  buyingGuideTitle: string;
  buyingGuideText: string;
  productCount: number;
}

const DEFAULT_CATEGORIES: CategoryData[] = [
  {
    id: "cat-leather",
    name: "Leather Bats",
    slug: "leather-bats",
    description: "English willow bats pressed for match balls and competitive cricket.",
    badge: "Match Grade",
    headerImage: "/img/leather-hero.jpg",
    buyingGuideTitle: "Choosing your English Willow",
    buyingGuideText: "Grade 1 willow features 8-12 tight straight grains, big edges (38-40mm) and optimal ping.",
    productCount: 6,
  },
  {
    id: "cat-tennis",
    name: "Tennis Bats",
    slug: "tennis-bats",
    description: "Lightweight Kashmir willow and composite blades engineered for taped & hard tennis balls.",
    badge: "Fast Swing",
    headerImage: "/img/tennis-hero.jpg",
    buyingGuideTitle: "Tennis & Box Cricket Selection",
    buyingGuideText: "Engineered scoop profiles give ultra-light pick-up under 1000g for rapid swing speeds.",
    productCount: 6,
  },
  {
    id: "cat-accessories",
    name: "Accessories & Care",
    slug: "accessories",
    description: "Bat care kits, raw linseed oil, octopus grips, padded covers, and mallets.",
    badge: "Workshop Goods",
    headerImage: "/img/care-hero.jpg",
    buyingGuideTitle: "Bat Longevity & Workshop Care",
    buyingGuideText: "Regular light linseed oiling and edge protection prolong the blade life and preserve stroke.",
    productCount: 6,
  },
];

export function getCategories(): CategoryData[] {
  return readJsonFile("categories.json", DEFAULT_CATEGORIES);
}

export function saveCategories(cats: CategoryData[]): void {
  writeJsonFile("categories.json", cats);
  logActivity("admin@kricks.com", "UPDATE_CATEGORIES", "Updated categories configuration");
}

/* =========================================================================
   4. CUSTOM BAT BUILDER SETTINGS
   ========================================================================= */
export interface CustomBatSettings {
  willowGrades: { id: string; name: string; price: number; bladeColor: string; grains: number; label: string }[];
  sizes: string[];
  weights: string[];
  gripColors: { name: string; hex: string }[];
  stickerColors: { name: string; hex: string; ink: string }[];
  knockingInPrice: number;
  maxNameLength: number;
  maxNumberLength: number;
  leadTimeDays: string;
}

const DEFAULT_BUILDER_SETTINGS: CustomBatSettings = {
  willowGrades: [
    { id: "g1-pro", name: "Grade 1 Pro English Willow", price: 2899900, bladeColor: "#E8CE95", grains: 11, label: "GRADE 1 PRO" },
    { id: "g1-player", name: "Grade 1 Players English Willow", price: 2199900, bladeColor: "#E3C78E", grains: 9, label: "PLAYERS" },
    { id: "g2-match", name: "Grade 2 Match English Willow", price: 1599900, bladeColor: "#DFBF82", grains: 7, label: "MATCH GRADE" },
    { id: "kashmir", name: "Selected Kashmir Willow", price: 899900, bladeColor: "#D6B270", grains: 6, label: "KASHMIR SELECT" },
  ],
  sizes: ["Short Handle (SH)", "Long Handle (LH)", "Harrow", "Size 6"],
  weights: ["Light (2lb 7oz – 2lb 8oz)", "Medium (2lb 9oz – 2lb 10oz)", "Heavy (2lb 11oz – 2lb 12oz)"],
  gripColors: [
    { name: "Signature Red", hex: "#C3262C" },
    { name: "Pure Black", hex: "#0A0A0A" },
    { name: "Clean White", hex: "#F4F3F0" },
    { name: "Burnt Orange", hex: "#C8501A" },
  ],
  stickerColors: [
    { name: "Black & Cream", hex: "#0A0A0A", ink: "#F0E3C3" },
    { name: "Crimson & White", hex: "#C3262C", ink: "#FFFFFF" },
    { name: "Monochrome White", hex: "#FFFFFF", ink: "#111111" },
  ],
  knockingInPrice: 150000,
  maxNameLength: 14,
  maxNumberLength: 2,
  leadTimeDays: "7–10 working days",
};

export function getCustomBatSettings(): CustomBatSettings {
  return readJsonFile("custom-bat-settings.json", DEFAULT_BUILDER_SETTINGS);
}

export function saveCustomBatSettings(settings: CustomBatSettings): void {
  writeJsonFile("custom-bat-settings.json", settings);
  logActivity("admin@kricks.com", "UPDATE_BAT_BUILDER", "Updated custom bat builder options");
}

/* =========================================================================
   5. HOME PAGE CMS BLOCKS
   ========================================================================= */
export interface HomeBlockSettings {
  announcement: { enabled: boolean; text: string; highlight: string; link: string };
  promiseStrip: { icon: string; title: string; subtitle: string }[];
  sizeFinderDefaults: { defaultHeight: number; minHeight: number; maxHeight: number };
  clubCTA: { heading: string; kicker: string; subtext: string; buttonText: string; buttonLink: string };
}

const DEFAULT_HOME_BLOCKS: HomeBlockSettings = {
  announcement: {
    enabled: true,
    text: "Pre-season workshop dispatch: Free knocking-in on all Grade 1 bats this week.",
    highlight: "Free knocking-in",
    link: "/custom-bat",
  },
  promiseStrip: [
    { icon: "Shield", title: "GENUINE WILLOW", subtitle: "Hand-selected clefts from J&K and Essex" },
    { icon: "Wrench", title: "WORKSHOP PRESSED", subtitle: "Individual density & rebound tuning" },
    { icon: "Truck", title: "WORLDWIDE SHIPPING", subtitle: "Express insured air courier" },
    { icon: "Clock", title: "LIFETIME SERVICE", subtitle: "Re-gripping & seasonal repair" },
  ],
  sizeFinderDefaults: {
    defaultHeight: 178,
    minHeight: 120,
    maxHeight: 205,
  },
  clubCTA: {
    kicker: "CLUBS, SCHOOLS & ACADEMIES",
    heading: "KIT OUT YOUR SQUAD WITH CUSTOM WORKSHOP BATS",
    subtext: "Tiered wholesale discounts starting from 10 bats with bespoke crest laser-engraving, custom grip colors and batch knocking-in.",
    buttonText: "CALCULATE CLUB ESTIMATE",
    buttonLink: "/bulk-enquiry",
  },
};

export function getHomeBlocks(): HomeBlockSettings {
  return readJsonFile("home-blocks.json", DEFAULT_HOME_BLOCKS);
}

export function saveHomeBlocks(blocks: HomeBlockSettings): void {
  writeJsonFile("home-blocks.json", blocks);
  logActivity("admin@kricks.com", "UPDATE_HOME_BLOCKS", "Updated home page layout blocks");
}

/* =========================================================================
   6. NAVIGATION & MEGA MENU
   ========================================================================= */
export interface NavigationSettings {
  headerNav: { label: string; href: string; hasMegaMenu: boolean }[];
  megaMenu: {
    categories: { title: string; links: { label: string; href: string }[] }[];
    featured: { title: string; productSlug: string; image: string; tag: string }[];
  };
  footerColumns: { title: string; links: { label: string; href: string }[] }[];
}

const DEFAULT_NAVIGATION: NavigationSettings = {
  headerNav: [
    { label: "Leather Bats", href: "/leather-bats", hasMegaMenu: true },
    { label: "Tennis Bats", href: "/tennis-bats", hasMegaMenu: true },
    { label: "Customised Bat", href: "/custom-bat", hasMegaMenu: false },
    { label: "Accessories", href: "/accessories", hasMegaMenu: false },
    { label: "Club Orders", href: "/bulk-enquiry", hasMegaMenu: false },
  ],
  megaMenu: {
    categories: [
      {
        title: "By Willow Grade",
        links: [
          { label: "Grade 1 English Willow", href: "/leather-bats" },
          { label: "Grade 2 Match Willow", href: "/leather-bats" },
          { label: "Selected Kashmir Willow", href: "/tennis-bats" },
        ],
      },
      {
        title: "By Playing Style",
        links: [
          { label: "Front Foot Heavy Drive", href: "/leather-bats" },
          { label: "360 Power Hitter (Light Pick-up)", href: "/tennis-bats" },
          { label: "Bespoke Custom Build", href: "/custom-bat" },
        ],
      },
    ],
    featured: [
      { title: "Pro Edition", productSlug: "pro-edition", image: "/img/shot.jpg", tag: "Flagship" },
      { title: "Custom Blade", productSlug: "custom-bat", image: "/img/whites.jpg", tag: "Personalised" },
    ],
  },
  footerColumns: [
    {
      title: "Workshop",
      links: [
        { label: "Custom Bat Builder", href: "/custom-bat" },
        { label: "Knocking-In & Repairs", href: "/accessories" },
        { label: "Bat Size Finder", href: "/#finder" },
        { label: "Bulk & Club Enquiries", href: "/bulk-enquiry" },
      ],
    },
    {
      title: "Help & Policies",
      links: [
        { label: "Track My Order", href: "/account" },
        { label: "Shipping & Returns", href: "/pages/shipping-returns" },
        { label: "Privacy Policy", href: "/pages/privacy" },
        { label: "Terms of Service", href: "/pages/terms" },
      ],
    },
  ],
};

export function getNavigationSettings(): NavigationSettings {
  return readJsonFile("navigation.json", DEFAULT_NAVIGATION);
}

export function saveNavigationSettings(nav: NavigationSettings): void {
  writeJsonFile("navigation.json", nav);
  logActivity("admin@kricks.com", "UPDATE_NAVIGATION", "Updated navigation menus and footer");
}

/* =========================================================================
   7. CMS PAGES
   ========================================================================= */
export interface CmsPage {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  content: string;
  faqs?: { q: string; a: string }[];
  status: "published" | "draft";
  updatedAt: string;
}

const DEFAULT_PAGES: CmsPage[] = [
  {
    id: "page-about",
    slug: "about",
    title: "About Krickscricket",
    subtitle: "Heritage batmaking from J&K and Essex clefts.",
    content: "Founded by cricketers for cricketers, Krickscricket crafts bespoke cricket blades using traditional English and Kashmir willow. Every bat is pressed individually to achieve optimal rebound and ping.",
    status: "published",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "page-shipping",
    slug: "shipping-returns",
    title: "Shipping & Returns",
    subtitle: "Insured domestic and international courier delivery.",
    content: "We deliver across India via Blue Dart and Delhivery, and worldwide via DHL Express. All orders are packed in rigid protective bat sleeves to ensure zero transit damage.",
    faqs: [
      { q: "How long does shipping take?", a: "Standard dispatch takes 2–4 business days. Custom bats take 7–10 business days for pressing, shaping, and knocking-in." },
      { q: "What is your return policy?", a: "Non-customised bats can be returned within 14 days in original unused condition. Custom bats with engraved names are made to order and non-returnable unless defective." },
    ],
    status: "published",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "page-privacy",
    slug: "privacy",
    title: "Privacy Policy",
    subtitle: "How we protect and manage your personal data.",
    content: "We treat your data with the utmost security. We never sell your personal information or share payment credentials. All payments are processed through Razorpay and Stripe with TLS 1.3 encryption.",
    status: "published",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "page-terms",
    slug: "terms",
    title: "Terms of Service",
    subtitle: "Workshop rules, warranties and store conditions.",
    content: "All bats carry a 12-month workshop warranty against manufacturer defects in the handle and splice. Normal surface willow wear from match play is not covered under warranty.",
    status: "published",
    updatedAt: new Date().toISOString(),
  },
];

export function getCmsPages(): CmsPage[] {
  return readJsonFile("cms-pages.json", DEFAULT_PAGES);
}

export function saveCmsPages(pages: CmsPage[]): void {
  writeJsonFile("cms-pages.json", pages);
  logActivity("admin@kricks.com", "UPDATE_CMS_PAGES", "Updated CMS pages");
}

export function getCmsPageBySlug(slug: string): CmsPage | undefined {
  const pages = getCmsPages();
  return pages.find((p) => p.slug === slug);
}

/* =========================================================================
   8. CUSTOMERS
   ========================================================================= */
export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  ordersCount: number;
  totalSpent: number;
  status: "active" | "blocked";
  joinedDate: string;
  notes?: string;
}

const DEFAULT_CUSTOMERS: CustomerRecord[] = [
  { id: "cust-1", name: "Rohan Sharma", email: "rohan@cricket.in", phone: "+91 98765 43210", city: "Mumbai", ordersCount: 3, totalSpent: 6299700, status: "active", joinedDate: "2025-08-12" },
  { id: "cust-2", name: "Ananya Iyer", email: "ananya.iyer@gmail.com", phone: "+91 98222 11345", city: "Bengaluru", ordersCount: 2, totalSpent: 3399800, status: "active", joinedDate: "2025-09-04" },
  { id: "cust-3", name: "Vikram Malhotra", email: "vikram@delhicricket.org", phone: "+91 99100 88776", city: "New Delhi", ordersCount: 5, totalSpent: 12499500, status: "active", joinedDate: "2025-05-18" },
  { id: "cust-4", name: "Liam Thompson", email: "liam.t@surreycricket.co.uk", phone: "+44 7700 900123", city: "London", ordersCount: 1, totalSpent: 2899900, status: "active", joinedDate: "2025-10-21" },
];

export function getCustomers(): CustomerRecord[] {
  return readJsonFile("customers.json", DEFAULT_CUSTOMERS);
}

export function saveCustomers(customers: CustomerRecord[]): void {
  writeJsonFile("customers.json", customers);
}

/* =========================================================================
   9. ABANDONED CARTS
   ========================================================================= */
export interface AbandonedCart {
  id: string;
  customerEmail: string;
  customerName: string;
  items: { name: string; price: number; qty: number }[];
  totalValue: number;
  currency: string;
  abandonedAt: string;
  recoverySent: boolean;
}

const DEFAULT_ABANDONED_CARTS: AbandonedCart[] = [
  {
    id: "cart-ab-1",
    customerEmail: "karan.mehta@outlook.com",
    customerName: "Karan Mehta",
    items: [{ name: "Custom Grade 1 Bat (Engraved)", price: 2899900, qty: 1 }],
    totalValue: 2899900,
    currency: "INR",
    abandonedAt: "2026-11-01T14:30:00Z",
    recoverySent: false,
  },
  {
    id: "cart-ab-2",
    customerEmail: "sam.curran@gmail.com",
    customerName: "Sam Curran",
    items: [
      { name: "Pro Edition English Willow", price: 2499900, qty: 1 },
      { name: "Workshop Bat Mallet", price: 129900, qty: 1 },
    ],
    totalValue: 2629800,
    currency: "INR",
    abandonedAt: "2026-10-31T18:15:00Z",
    recoverySent: true,
  },
];

export function getAbandonedCarts(): AbandonedCart[] {
  return readJsonFile("abandoned-carts.json", DEFAULT_ABANDONED_CARTS);
}

export function saveAbandonedCarts(carts: AbandonedCart[]): void {
  writeJsonFile("abandoned-carts.json", carts);
}

/* =========================================================================
   10. BULK ENQUIRIES & PRICING TIERS
   ========================================================================= */
export interface BulkEnquiryLead {
  id: string;
  clubName: string;
  contactName: string;
  email: string;
  phone: string;
  batModel: string;
  quantity: number;
  targetDate: string;
  notes: string;
  stage: "New" | "Contacted" | "Quote Sent" | "Won" | "Lost";
  quoteValue?: number;
  createdAt: string;
}

const DEFAULT_ENQUIRIES: BulkEnquiryLead[] = [
  {
    id: "ENQ-901",
    clubName: "Apex Cricket Academy",
    contactName: "Coach Rajesh Verma",
    email: "apex.academy@cricket.in",
    phone: "+91 98111 22334",
    batModel: "Players Grade 1 English Willow",
    quantity: 25,
    targetDate: "2026-12-15",
    notes: "Requires academy crest laser engraved on back spine and maroon grips.",
    stage: "Quote Sent",
    quoteValue: 33998000,
    createdAt: "2026-10-28T09:00:00Z",
  },
  {
    id: "ENQ-902",
    clubName: "Saint Paul's High School XI",
    contactName: "Father Thomas",
    email: "sports@stpaulsdelhi.edu",
    phone: "+91 98450 67890",
    batModel: "Kashmir Select Match Bats",
    quantity: 15,
    targetDate: "2026-11-20",
    notes: "Inter-school tournament kit package.",
    stage: "Contacted",
    createdAt: "2026-10-30T11:45:00Z",
  },
  {
    id: "ENQ-903",
    clubName: "London South Asian CC",
    contactName: "Tariq Mahmood",
    email: "tariq@lsacc.co.uk",
    phone: "+44 7911 123456",
    batModel: "Pro Edition Match Bats",
    quantity: 50,
    targetDate: "2027-01-10",
    notes: "Full team shipment to UK via DHL.",
    stage: "New",
    createdAt: "2026-11-01T16:20:00Z",
  },
];

export function getBulkEnquiries(): BulkEnquiryLead[] {
  return readJsonFile("bulk-enquiries.json", DEFAULT_ENQUIRIES);
}

export function saveBulkEnquiries(enquiries: BulkEnquiryLead[]): void {
  writeJsonFile("bulk-enquiries.json", enquiries);
  logActivity("admin@kricks.com", "UPDATE_ENQUIRIES", "Updated bulk enquiries CRM pipeline");
}

export interface PricingTier {
  minQty: number;
  maxQty: number;
  discountPercent: number;
  label: string;
}

const DEFAULT_PRICING_TIERS: PricingTier[] = [
  { minQty: 10, maxQty: 24, discountPercent: 15, label: "10–24 Bats (15% OFF)" },
  { minQty: 25, maxQty: 49, discountPercent: 20, label: "25–49 Bats (20% OFF)" },
  { minQty: 50, maxQty: 99, discountPercent: 25, label: "50–99 Bats (25% OFF)" },
  { minQty: 100, maxQty: 999, discountPercent: 30, label: "100+ Bats (30% OFF)" },
];

export function getPricingTiers(): PricingTier[] {
  return readJsonFile("pricing-tiers.json", DEFAULT_PRICING_TIERS);
}

export function savePricingTiers(tiers: PricingTier[]): void {
  writeJsonFile("pricing-tiers.json", tiers);
}

/* =========================================================================
   11. CONTACT MESSAGES
   ========================================================================= */
export interface ContactMessageRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied" | "archived";
  createdAt: string;
  replyText?: string;
}

const DEFAULT_MESSAGES: ContactMessageRecord[] = [
  {
    id: "msg-101",
    name: "Sunil Gavaskar Fans Club",
    email: "sunilclub@mumbai.com",
    phone: "+91 98201 98201",
    subject: "Custom bat weight inquiry",
    message: "Can we request a custom bat with a 2lb 6oz pick up for an opening batsman?",
    status: "unread",
    createdAt: "2026-11-01T10:15:00Z",
  },
  {
    id: "msg-102",
    name: "Devendra Patel",
    email: "patel.d@ahmedabad.in",
    phone: "+91 99090 12345",
    subject: "International delivery to Dubai",
    message: "How many days does courier take to Reach Dubai Marina?",
    status: "read",
    createdAt: "2026-10-30T14:20:00Z",
  },
];

export function getContactMessages(): ContactMessageRecord[] {
  return readJsonFile("contact-messages.json", DEFAULT_MESSAGES);
}

export function saveContactMessages(msgs: ContactMessageRecord[]): void {
  writeJsonFile("contact-messages.json", msgs);
}

/* =========================================================================
   12. REVIEWS
   ========================================================================= */
export interface ProductReview {
  id: string;
  productSlug: string;
  productName: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  status: "approved" | "pending" | "rejected";
  date: string;
}

const DEFAULT_REVIEWS: ProductReview[] = [
  {
    id: "rev-1",
    productSlug: "pro-edition",
    productName: "Pro Edition",
    author: "Aditya Roy",
    rating: 5,
    title: "Best ping I have ever experienced",
    comment: "Straight 11 grains, perfectly balanced pickup. First match scored 78 not out.",
    verified: true,
    status: "approved",
    date: "2026-10-25",
  },
  {
    id: "rev-2",
    productSlug: "custom-bat",
    productName: "Custom Bat",
    author: "Prashant K.",
    rating: 5,
    title: "Laser engraving looks exquisite",
    comment: "My jersey number and initials look stunning down the back spine. Worth every penny.",
    verified: true,
    status: "approved",
    date: "2026-10-27",
  },
  {
    id: "rev-3",
    productSlug: "street",
    productName: "Street Tennis Bat",
    author: "Naveen S.",
    rating: 4,
    title: "Great box cricket blade",
    comment: "Lightweight and packs immense power for overhead tennis smashes.",
    verified: false,
    status: "pending",
    date: "2026-10-31",
  },
];

export function getReviews(): ProductReview[] {
  return readJsonFile("reviews.json", DEFAULT_REVIEWS);
}

export function saveReviews(reviews: ProductReview[]): void {
  writeJsonFile("reviews.json", reviews);
}

/* =========================================================================
   13. DISCOUNTS & COUPONS
   ========================================================================= */
export interface CouponRecord {
  code: string;
  type: "percent" | "fixed" | "free_shipping";
  value: number; // percent or paise
  minOrderPaise: number;
  description: string;
  active: boolean;
  usageCount: number;
}

const DEFAULT_COUPONS: CouponRecord[] = [
  { code: "WELCOME10", type: "percent", value: 10, minOrderPaise: 500000, description: "10% off for first time buyers", active: true, usageCount: 42 },
  { code: "CLUB15", type: "percent", value: 15, minOrderPaise: 1500000, description: "15% off orders above ₹15,000", active: true, usageCount: 19 },
  { code: "FREESHIP", type: "free_shipping", value: 0, minOrderPaise: 0, description: "Free standard shipping nationwide", active: true, usageCount: 65 },
  { code: "KRICKS500", type: "fixed", value: 50000, minOrderPaise: 1000000, description: "Flat ₹500 discount on bats", active: true, usageCount: 8 },
];

export function getCoupons(): CouponRecord[] {
  return readJsonFile("coupons.json", DEFAULT_COUPONS);
}

export function saveCoupons(coupons: CouponRecord[]): void {
  writeJsonFile("coupons.json", coupons);
  logActivity("admin@kricks.com", "UPDATE_COUPONS", "Updated discount coupons configuration");
}

/* =========================================================================
   14. NEWSLETTER
   ========================================================================= */
export interface NewsletterSubscriber {
  email: string;
  subscribedAt: string;
  source: string;
  status: "active" | "unsubscribed";
}

const DEFAULT_SUBSCRIBERS: NewsletterSubscriber[] = [
  { email: "rohit.fans@gmail.com", subscribedAt: "2026-10-15T08:00:00Z", source: "Footer Form", status: "active" },
  { email: "virat.18@cricket.org", subscribedAt: "2026-10-20T11:20:00Z", source: "Footer Form", status: "active" },
  { email: "coach.anand@mumbai.in", subscribedAt: "2026-10-29T17:45:00Z", source: "Bulk Modal", status: "active" },
];

export function getNewsletterSubscribers(): NewsletterSubscriber[] {
  return readJsonFile("newsletter-subscribers.json", DEFAULT_SUBSCRIBERS);
}

export function saveNewsletterSubscribers(subs: NewsletterSubscriber[]): void {
  writeJsonFile("newsletter-subscribers.json", subs);
}

/* =========================================================================
   15. CURRENCIES
   ========================================================================= */
export interface CurrencyRecord {
  code: string;
  symbol: string;
  name: string;
  rateAgainstINR: number;
  active: boolean;
}

const DEFAULT_CURRENCIES: CurrencyRecord[] = [
  { code: "INR", symbol: "₹", name: "Indian Rupee", rateAgainstINR: 1, active: true },
  { code: "USD", symbol: "$", name: "US Dollar", rateAgainstINR: 0.012, active: true },
  { code: "GBP", symbol: "£", name: "British Pound", rateAgainstINR: 0.0095, active: true },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", rateAgainstINR: 0.018, active: true },
  { code: "AED", symbol: "AED", name: "UAE Dirham", rateAgainstINR: 0.044, active: true },
  { code: "ZAR", symbol: "R", name: "South African Rand", rateAgainstINR: 0.22, active: true },
];

export function getCurrencies(): CurrencyRecord[] {
  return readJsonFile("currencies.json", DEFAULT_CURRENCIES);
}

export function saveCurrencies(currencies: CurrencyRecord[]): void {
  writeJsonFile("currencies.json", currencies);
  logActivity("admin@kricks.com", "UPDATE_CURRENCIES", "Updated currency conversion rates");
}

/* =========================================================================
   16. SHIPPING SETTINGS
   ========================================================================= */
export interface ShippingSettings {
  domesticStandardFeePaise: number;
  domesticExpressFeePaise: number;
  codFeePaise: number;
  freeShippingThresholdPaise: number;
  internationalFlatRatePaise: number;
  estimatedDomesticDays: string;
  estimatedInternationalDays: string;
}

const DEFAULT_SHIPPING_SETTINGS: ShippingSettings = {
  domesticStandardFeePaise: 29900,
  domesticExpressFeePaise: 59900,
  codFeePaise: 9900,
  freeShippingThresholdPaise: 1000000,
  internationalFlatRatePaise: 249900,
  estimatedDomesticDays: "3–5 business days",
  estimatedInternationalDays: "5–8 business days",
};

export function getShippingSettings(): ShippingSettings {
  return readJsonFile("shipping-settings.json", DEFAULT_SHIPPING_SETTINGS);
}

export function saveShippingSettings(settings: ShippingSettings): void {
  writeJsonFile("shipping-settings.json", settings);
  logActivity("admin@kricks.com", "UPDATE_SHIPPING", "Updated shipping rates and zones");
}

/* =========================================================================
   17. TAXES & GST
   ========================================================================= */
export interface TaxSettings {
  legalBusinessName: string;
  gstin: string;
  stateCode: string;
  stateName: string;
  hsnCode: string;
  gstRatePercent: number;
  pricesIncludeTax: boolean;
}

const DEFAULT_TAX_SETTINGS: TaxSettings = {
  legalBusinessName: "KRICKS CRICKET GEAR PRIVATE LIMITED",
  gstin: "07AAACK1234F1Z5",
  stateCode: "07",
  stateName: "Delhi",
  hsnCode: "95069920",
  gstRatePercent: 12,
  pricesIncludeTax: true,
};

export function getTaxSettings(): TaxSettings {
  return readJsonFile("tax-settings.json", DEFAULT_TAX_SETTINGS);
}

export function saveTaxSettings(settings: TaxSettings): void {
  writeJsonFile("tax-settings.json", settings);
  logActivity("admin@kricks.com", "UPDATE_TAXES", "Updated GST tax configuration");
}

/* =========================================================================
   18. PAYMENTS
   ========================================================================= */
export interface PaymentGatewaySettings {
  razorpayEnabled: boolean;
  razorpayTestMode: boolean;
  stripeEnabled: boolean;
  stripeTestMode: boolean;
  codEnabled: boolean;
  codMaxOrderPaise: number;
}

const DEFAULT_PAYMENT_SETTINGS: PaymentGatewaySettings = {
  razorpayEnabled: true,
  razorpayTestMode: true,
  stripeEnabled: true,
  stripeTestMode: true,
  codEnabled: true,
  codMaxOrderPaise: 1500000,
};

export function getPaymentSettings(): PaymentGatewaySettings {
  return readJsonFile("payment-settings.json", DEFAULT_PAYMENT_SETTINGS);
}

export function savePaymentSettings(settings: PaymentGatewaySettings): void {
  writeJsonFile("payment-settings.json", settings);
  logActivity("admin@kricks.com", "UPDATE_PAYMENTS", "Updated payment gateways");
}

/* =========================================================================
   19. MEDIA ASSETS
   ========================================================================= */
export interface MediaAsset {
  id: string;
  filename: string;
  url: string;
  sizeKb: number;
  altText: string;
  focalPoint: string;
  uploadedAt: string;
}

const DEFAULT_MEDIA: MediaAsset[] = [
  { id: "media-1", filename: "shot.jpg", url: "/img/shot.jpg", sizeKb: 342, altText: "Cricketer executing cover drive with Kricks Pro Edition bat", focalPoint: "50% 40%", uploadedAt: "2026-10-01" },
  { id: "media-2", filename: "whites.jpg", url: "/img/whites.jpg", sizeKb: 288, altText: "Custom bat resting on workshop workbench", focalPoint: "50% 30%", uploadedAt: "2026-10-01" },
  { id: "media-3", filename: "redsky.jpg", url: "/img/redsky.jpg", sizeKb: 310, altText: "Tennis cricket night tournament under floodlights", focalPoint: "50% 50%", uploadedAt: "2026-10-01" },
  { id: "media-4", filename: "ground.jpg", url: "/img/ground.jpg", sizeKb: 405, altText: "Cricket ground pitch and pavilion", focalPoint: "50% 60%", uploadedAt: "2026-10-01" },
  { id: "media-5", filename: "leather-hero.jpg", url: "/img/leather-hero.jpg", sizeKb: 325, altText: "Row of English willow bats in seasoning kiln", focalPoint: "50% 50%", uploadedAt: "2026-10-01" },
];

export function getMediaAssets(): MediaAsset[] {
  return readJsonFile("media-assets.json", DEFAULT_MEDIA);
}

export function saveMediaAssets(assets: MediaAsset[]): void {
  writeJsonFile("media-assets.json", assets);
}

/* =========================================================================
   20. SEO & REDIRECTS
   ========================================================================= */
export interface SeoRedirectRecord {
  from: string;
  to: string;
  type: 301 | 302;
}

export interface SeoSettings {
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  ogImageUrl: string;
  robotsTxt: string;
  redirects: SeoRedirectRecord[];
}

const DEFAULT_SEO_SETTINGS: SeoSettings = {
  defaultMetaTitle: "Krickscricket · Cricket Bats Made by Hand",
  defaultMetaDescription: "English and Kashmir willow cricket bats pressed by hand in India. Shipped worldwide.",
  ogImageUrl: "/img/shot.jpg",
  robotsTxt: "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: https://kricks.com/sitemap.xml",
  redirects: [
    { from: "/bats", to: "/leather-bats", type: 301 },
    { from: "/custom", to: "/custom-bat", type: 301 },
  ],
};

export function getSeoSettings(): SeoSettings {
  return readJsonFile("seo-settings.json", DEFAULT_SEO_SETTINGS);
}

export function saveSeoSettings(settings: SeoSettings): void {
  writeJsonFile("seo-settings.json", settings);
  logActivity("admin@kricks.com", "UPDATE_SEO", "Updated SEO and 301 redirects");
}

/* =========================================================================
   21. STORE SETTINGS
   ========================================================================= */
export interface StoreSettings {
  storeName: string;
  tagline: string;
  contactEmail: string;
  supportPhone: string;
  whatsappNumber: string;
  enableWhatsappButton: boolean;
  addressLine1: string;
  cityStatePin: string;
  orderNumberPrefix: string;
  businessHours: string;
}

const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: "Krickscricket",
  tagline: "Cricket bats made by hand",
  contactEmail: "workshop@krickscricket.com",
  supportPhone: "+91 98765 43210",
  whatsappNumber: "919876543210",
  enableWhatsappButton: true,
  addressLine1: "Plot 42, Okhla Industrial Area Phase III",
  cityStatePin: "New Delhi, Delhi 110020, India",
  orderNumberPrefix: "KC-",
  businessHours: "Mon – Sat: 9:30 AM – 6:30 PM IST",
};

export function getStoreSettings(): StoreSettings {
  return readJsonFile("store-settings.json", DEFAULT_STORE_SETTINGS);
}

export function saveStoreSettings(settings: StoreSettings): void {
  writeJsonFile("store-settings.json", settings);
  logActivity("admin@kricks.com", "UPDATE_SETTINGS", "Updated general store settings");
}

/* =========================================================================
   22. EMAIL TEMPLATES
   ========================================================================= */
export interface EmailTemplateRecord {
  id: string;
  name: string;
  subject: string;
  previewHeader: string;
  bodyNote: string;
}

const DEFAULT_TEMPLATES: EmailTemplateRecord[] = [
  { id: "order_confirmation", name: "Order Confirmation", subject: "Your Krickscricket Order {{orderNumber}} has been confirmed", previewHeader: "Order Confirmed & Sent to Workshop", bodyNote: "We have received your order and our master batmakers are now preparing your cleft." },
  { id: "shipping_update", name: "Dispatch & Tracking", subject: "Your cricket bat has been dispatched! Track with {{carrier}}", previewHeader: "Dispatched via {{carrier}}", bodyNote: "Your blade has cleared our quality inspection and is on its way." },
  { id: "abandoned_recovery", name: "Abandoned Cart Reminder", subject: "Your custom willow bat is waiting on the workbench", previewHeader: "Complete Your Custom Bat", bodyNote: "We noticed you left items in your cart. Claim 10% off with coupon WELCOME10." },
  { id: "bulk_quote", name: "Bulk Club Quote", subject: "Official Quote from Krickscricket Workshop - {{clubName}}", previewHeader: "Special Club Pricing Estimate", bodyNote: "Thank you for inquiring with Krickscricket. Attached is your tiered quotation." },
];

export function getEmailTemplates(): EmailTemplateRecord[] {
  return readJsonFile("email-templates.json", DEFAULT_TEMPLATES);
}

export function saveEmailTemplates(templates: EmailTemplateRecord[]): void {
  writeJsonFile("email-templates.json", templates);
}

/* =========================================================================
   23. STAFF & ROLES
   ========================================================================= */
export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Workshop Manager" | "Fulfilment" | "Content Editor";
  twoFactorEnabled: boolean;
  status: "active" | "invited";
}

const DEFAULT_STAFF: StaffMember[] = [
  { id: "staff-1", name: "Master Batmaker (Owner)", email: "admin@kricks.com", role: "Owner", twoFactorEnabled: true, status: "active" },
  { id: "staff-2", name: "Workshop Supervisor", email: "workshop@kricks.com", role: "Workshop Manager", twoFactorEnabled: false, status: "active" },
  { id: "staff-3", name: "Logistics Desk", email: "dispatch@kricks.com", role: "Fulfilment", twoFactorEnabled: false, status: "active" },
];

export function getStaffMembers(): StaffMember[] {
  return readJsonFile("staff.json", DEFAULT_STAFF);
}

export function saveStaffMembers(staff: StaffMember[]): void {
  writeJsonFile("staff.json", staff);
  logActivity("admin@kricks.com", "UPDATE_STAFF", "Updated staff accounts");
}

/* =========================================================================
   24. ACTIVITY LOG
   ========================================================================= */
export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

const DEFAULT_LOGS: ActivityLogEntry[] = [
  { id: "log-1", timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), user: "admin@kricks.com", action: "SYSTEM_INITIALIZE", details: "Store seed data loaded" },
  { id: "log-2", timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), user: "admin@kricks.com", action: "LOGIN", details: "Staff login successful" },
];

export function getActivityLogs(): ActivityLogEntry[] {
  return readJsonFile("activity-logs.json", DEFAULT_LOGS);
}

export function logActivity(user: string, action: string, details: string): void {
  const logs = getActivityLogs();
  logs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    user,
    action,
    details,
  });
  writeJsonFile("activity-logs.json", logs.slice(0, 100)); // Keep last 100 entries
}

