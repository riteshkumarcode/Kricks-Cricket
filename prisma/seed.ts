import { PrismaClient, StaffRole, ProductCategoryType } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Krickscricket database seed...");

  // 1. Initial Owner Admin
  const adminEmail = process.env.ADMIN_EMAIL || "admin@krickscricket.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@Kricks2026!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, role: StaffRole.OWNER },
    create: {
      email: adminEmail,
      name: "Kricks Founder",
      passwordHash,
      role: StaffRole.OWNER,
      isActive: true,
    },
  });
  console.log(`✅ Admin owner created/verified: ${admin.email}`);

  // 2. Currencies
  const currencies = [
    { code: "INR", name: "Indian Rupee", symbol: "₹", exchangeRate: 1.0, roundingRule: "none", isDefault: true, isEnabled: true },
    { code: "USD", name: "US Dollar", symbol: "$", exchangeRate: 1 / 88, roundingRule: "ceil", isDefault: false, isEnabled: true },
    { code: "GBP", name: "British Pound", symbol: "£", exchangeRate: 1 / 116, roundingRule: "ceil", isDefault: false, isEnabled: true },
    { code: "AUD", name: "Australian Dollar", symbol: "A$", exchangeRate: 1 / 57, roundingRule: "ceil", isDefault: false, isEnabled: true },
    { code: "AED", name: "UAE Dirham", symbol: "AED", exchangeRate: 1 / 24, roundingRule: "ceil", isDefault: false, isEnabled: true },
    { code: "ZAR", name: "South African Rand", symbol: "R", exchangeRate: 1 / 5, roundingRule: "ceil", isDefault: false, isEnabled: true },
  ];

  for (const c of currencies) {
    await prisma.currency.upsert({
      where: { code: c.code },
      update: c,
      create: c,
    });
  }
  console.log("✅ Currencies seeded.");

  // 3. Categories
  const categories = [
    {
      slug: "leather-bats",
      name: "Leather bats",
      subTitle: "English and Kashmir willow bats for the hard ball, pressed and shaped by hand. Every bat ships oiled, and you can add full knocking-in at checkout.",
      headerPhoto: "img/ball.jpg",
      type: ProductCategoryType.LEATHER,
      guideTitle: "Which grade of willow?",
      guideContent: [
        { term: "Grade 1 English", definition: "Straight, even grains with few marks. The best-performing willow, used for match bats." },
        { term: "Grade 2 English", definition: "The same wood with a few more marks or a slightly wider grain. Plays almost as well and costs much less." },
        { term: "Grade 3 English", definition: "More marks and wider grains. Good for club players moving up to the hard ball." },
        { term: "Kashmir willow", definition: "Harder and heavier than English willow, and very hard-wearing. A sensible bat for the nets." },
      ],
      filterConfig: { options: ["All", "Grade 1", "Grade 2", "Grade 3", "Kashmir"] },
      sortOrder: 1,
    },
    {
      slug: "tennis-bats",
      name: "Tennis bats",
      subTitle: "Light bats for the tennis ball and the taped ball. Thin handles, scooped backs and low middles for gully, street and box cricket.",
      headerPhoto: "img/redsky.jpg",
      type: ProductCategoryType.TENNIS,
      guideTitle: "Tennis ball or tape ball?",
      guideContent: [
        { term: "Tennis ball", definition: "A soft ball that bounces high. Choose a light bat with a mid middle so you can get on top of the bounce." },
        { term: "Tape ball", definition: "Taped tennis balls skid through low and fast. A low middle and a flat face meet them sooner." },
        { term: "Box cricket", definition: "Short boundaries and quick hands. Our lightest bats, around 850–950 g, are made for it." },
        { term: "Never with a leather ball", definition: "Tennis bats are not pressed for the hard ball and will crack. Use a leather bat for that." },
      ],
      filterConfig: { options: ["All", "Kashmir willow", "Popular willow"] },
      sortOrder: 2,
    },
    {
      slug: "accessories",
      name: "Accessories",
      subTitle: "Gloves, pads, helmets, kit bags, grips and balls. Everything you carry out to the middle, in Kricks colours.",
      headerPhoto: "img/stumps.jpg",
      type: ProductCategoryType.ACCESSORIES,
      guideTitle: "Getting the fit right",
      guideContent: [
        { term: "Gloves", definition: "Your fingertips should sit just short of the end of the finger rolls. Men's fits most adult hands; youth fits players up to about 15." },
        { term: "Pads", definition: "The centre of the knee roll should sit on the centre of your knee when you stand normally." },
        { term: "Helmet", definition: "Measure around your head just above the eyebrows. The grille should not touch your nose when you look forward." },
        { term: "Grips and toe guards", definition: "Fit a fresh grip when the old one turns smooth or splits, and a toe guard on any bat used on damp grounds." },
      ],
      filterConfig: { options: ["All", "Protection", "Bags", "Balls", "Bat care"] },
      sortOrder: 3,
    },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categories) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap.set(cat.slug, record.id);
  }
  console.log("✅ Categories seeded.");

  // 4. Products (18 products from kricks.js)
  const rawProducts = [
    // Leather bats
    { id: "pro-edition", cat: "leather-bats", name: "Pro Edition", sub: "Grade 1 English willow", price: 2499900, was: 2799900, tag: "Bestseller", grade: 1, grains: 11, weight: "2lb 8oz – 2lb 11oz", edge: "40 mm", profile: "Mid-low middle, full spine", blurb: "Our top cut. Straight, tight grains, big edges and a middle that sits where most of your drives are struck. Pressed by hand and finished with a light linseed coat.", blade: "#E8CE95", grip: "#C3262C", sticker: "#0A0A0A", stickerInk: "#F0E3C3", gradeLabel: "ENGLISH WILLOW" },
    { id: "players", cat: "leather-bats", name: "Players", sub: "Grade 1 English willow", price: 1699900, grade: 1, grains: 9, weight: "2lb 8oz – 2lb 10oz", edge: "38 mm", profile: "Mid middle, high spine", blurb: "Match-grade willow with a slightly wider grain. Picks up lighter than it weighs, which suits front-foot players.", blade: "#E3C78E", grip: "#0A0A0A", sticker: "#C3262C", stickerInk: "#F0E3C3", gradeLabel: "ENGLISH WILLOW" },
    { id: "club", cat: "leather-bats", name: "Club", sub: "Grade 2 English willow", price: 1099900, grade: 2, grains: 8, weight: "2lb 9oz – 2lb 11oz", edge: "36 mm", profile: "Mid middle, rounded spine", blurb: "Grade 2 willow with a few cosmetic marks and the same press and shaping as our top bats. The weekend-league favourite.", blade: "#DEBE82", grip: "#3A3A3A", sticker: "#F3EEE3", stickerInk: "#0A0A0A", gradeLabel: "ENGLISH WILLOW · G2" },
    { id: "academy", cat: "leather-bats", name: "Academy", sub: "Grade 3 English willow", price: 749900, tag: "New", grade: 3, grains: 7, weight: "2lb 9oz – 2lb 12oz", edge: "34 mm", profile: "Mid middle, flat face", blurb: "Honest English willow for players moving up from tennis-ball cricket to the hard ball. Knocking-in recommended.", blade: "#D9B97C", grip: "#F3EEE3", sticker: "#0A0A0A", stickerInk: "#F0E3C3", gradeLabel: "ENGLISH WILLOW · G3" },
    { id: "junior-harrow", cat: "leather-bats", name: "Junior Harrow", sub: "Grade 2 English willow", price: 599900, grade: 2, grains: 7, weight: "2lb 3oz – 2lb 5oz", edge: "32 mm", profile: "Light pick-up, Harrow size", blurb: "Sized for players between 5'6\" and 5'8\". Shorter blade and handle, same willow as our Club bat.", blade: "#E3C78E", grip: "#C3262C", sticker: "#3A3A3A", stickerInk: "#F0E3C3", gradeLabel: "ENGLISH WILLOW" },
    { id: "kashmir-match", cat: "leather-bats", name: "Kashmir Match", sub: "Kashmir willow", price: 349900, grade: 4, grains: 6, weight: "2lb 10oz – 2lb 13oz", edge: "32 mm", profile: "Mid middle", blurb: "Kashmir willow pressed for the leather ball. Heavier and harder than English willow, and very hard-wearing for net sessions.", blade: "#EAD6A8", grip: "#0A0A0A", sticker: "#C3262C", stickerInk: "#F0E3C3", gradeLabel: "KASHMIR WILLOW" },

    // Tennis bats
    { id: "street", cat: "tennis-bats", name: "Street", sub: "Kashmir willow tennis bat", price: 249900, was: 299900, tag: "Bestseller", grains: 6, weight: "950 – 1050 g", edge: "28 mm", profile: "Thin handle, scooped back", blurb: "Light, whippy and built for the tennis ball. A thin handle and scooped back so you can swing hard in gully and box cricket.", blade: "#EED9AB", grip: "#F3EEE3", sticker: "#C8501A", stickerInk: "#F0E3C3", gradeLabel: "KASHMIR WILLOW" },
    { id: "tape-ball", cat: "tennis-bats", name: "Tape Ball Special", sub: "Kashmir willow", price: 189900, grains: 5, weight: "900 – 1000 g", edge: "26 mm", profile: "Low middle, flat face", blurb: "A low middle and a flat face for the skidding tape ball. Light enough to swing through the line all evening.", blade: "#EBD3A0", grip: "#C3262C", sticker: "#0A0A0A", stickerInk: "#F0E3C3", gradeLabel: "KASHMIR WILLOW" },
    { id: "box-lite", cat: "tennis-bats", name: "Box Cricket Lite", sub: "Popular willow", price: 149900, tag: "New", grains: 5, weight: "850 – 950 g", edge: "24 mm", profile: "Very light pick-up", blurb: "Our lightest bat, for indoor box cricket and younger players. Popular willow with a full cane handle.", blade: "#F0E0BC", grip: "#3A3A3A", sticker: "#C3262C", stickerInk: "#F0E3C3", gradeLabel: "POPULAR WILLOW" },
    { id: "full-cane", cat: "tennis-bats", name: "Full Cane Tennis", sub: "Kashmir willow", price: 329900, grains: 7, weight: "1000 – 1100 g", edge: "30 mm", profile: "Mid middle, cane handle", blurb: "Twelve-piece cane handle for a softer feel off the bat. Our heaviest tennis bat, for players who like a bit of weight behind the shot.", blade: "#E5CB94", grip: "#0A0A0A", sticker: "#F3EEE3", stickerInk: "#0A0A0A", gradeLabel: "KASHMIR WILLOW" },

    // Accessories
    { id: "gloves", cat: "accessories", kind: "gloves", name: "Batting Gloves", sub: "Sausage-finger, men's and youth", price: 229900, tag: "Bestseller", blurb: "Split-finger sausage rolls with a sheep-leather palm. Right- and left-handed.", c1: "#F3EEE3", c2: "#C3262C" },
    { id: "pads", cat: "accessories", kind: "pads", name: "Batting Pads", sub: "Lightweight, three-strap", price: 349900, blurb: "Cane-reinforced bolsters with a moulded knee roll and three straps.", c1: "#F3EEE3", c2: "#0A0A0A" },
    { id: "helmet", cat: "accessories", kind: "helmet", name: "Batting Helmet", sub: "Steel grille", price: 399900, blurb: "Adjustable fit with a steel grille and removable sweatband.", c1: "#F3EEE3", c2: "#C8501A" },
    { id: "kitbag", cat: "accessories", kind: "kitbag", name: "Wheelie Kit Bag", sub: "Holds four bats", price: 499900, tag: "New", blurb: "Separate bat sleeve for four bats, a shoe pocket and sturdy wheels for the walk to the ground.", c1: "#F3EEE3", c2: "#C3262C" },
    { id: "leather-balls", cat: "accessories", kind: "balls", name: "Club Leather Balls", sub: "Pack of 6 · 156 g", price: 299900, blurb: "Four-piece, hand-stitched alum-tanned leather balls. Five red and one white." },
    { id: "tennis-balls", cat: "accessories", kind: "tballs", name: "Heavy Tennis Balls", sub: "Pack of 6", price: 89900, blurb: "Hard felt tennis balls that hold their bounce for tape-ball and box cricket." },
    { id: "grips", cat: "accessories", kind: "grips", name: "Bat Grips", sub: "Pack of 3", price: 59900, blurb: "Ribbed rubber grips in red, white and green. Fits any standard handle." },
    { id: "toe-guard", cat: "accessories", kind: "toeguard", name: "Toe Guard", sub: "Fits any adult bat", price: 29900, blurb: "Rubber toe guard that stops the toe from soaking up moisture and splitting.", c2: "#C3262C" },
  ];

  for (const p of rawProducts) {
    const isBat = p.cat !== "accessories";
    const specsData = isBat
      ? [
          { key: "Willow", value: p.sub },
          { key: "Grains", value: String(p.grains || "—") },
          { key: "Weight", value: p.weight },
          { key: "Edges", value: p.edge },
          { key: "Profile", value: p.profile },
          { key: "Handle", value: "Round, cane with rubber grip" },
          { key: "Finish", value: "Oiled, toe guard fitted" },
        ]
      : [
          { key: "Product", value: p.name },
          { key: "Details", value: p.sub },
        ];

    const productRecord = await prisma.product.upsert({
      where: { slug: p.id },
      update: {
        name: p.name,
        subTitle: p.sub,
        blurb: p.blurb,
        price: p.price,
        compareAtPrice: p.was || null,
        badge: p.tag || null,
        isSample: true,
        drawingType: isBat ? "bat" : p.kind,
        bladeColor: p.blade || null,
        gripColor: p.grip || null,
        stickerColor: p.sticker || null,
        stickerInkColor: p.stickerInk || null,
        grainsCount: p.grains || 9,
        gradeLabel: p.gradeLabel || null,
        color1: p.c1 || null,
        color2: p.c2 || null,
        allowKnockingIn: p.cat === "leather-bats",
        allowEngraving: isBat,
        specs: specsData,
        categoryId: categoryMap.get(p.cat)!,
      },
      create: {
        slug: p.id,
        name: p.name,
        subTitle: p.sub,
        blurb: p.blurb,
        price: p.price,
        compareAtPrice: p.was || null,
        badge: p.tag || null,
        isSample: true,
        drawingType: isBat ? "bat" : p.kind,
        bladeColor: p.blade || null,
        gripColor: p.grip || null,
        stickerColor: p.sticker || null,
        stickerInkColor: p.stickerInk || null,
        grainsCount: p.grains || 9,
        gradeLabel: p.gradeLabel || null,
        color1: p.c1 || null,
        color2: p.c2 || null,
        allowKnockingIn: p.cat === "leather-bats",
        allowEngraving: isBat,
        specs: specsData,
        categoryId: categoryMap.get(p.cat)!,
      },
    });

    // Default variant creation
    const sku = `SKU-${p.id.toUpperCase()}-STD`;
    await prisma.productVariant.upsert({
      where: { sku },
      update: {
        price: p.price,
        stock: 50,
      },
      create: {
        productId: productRecord.id,
        sku,
        title: "Standard",
        options: { Size: "Short Handle" },
        price: p.price,
        stock: 50,
      },
    });
  }
  console.log("✅ 18 Sample products and variants seeded.");

  // 5. Custom Bat Builder Settings
  const willowGrades = [
    { label: "Grade 1 English", price: 1849900, bladeColor: "#E8CE95", grainsCount: 11, gradeText: "ENGLISH WILLOW", sortOrder: 1 },
    { label: "Grade 2 English", price: 1399900, bladeColor: "#E3C78E", grainsCount: 8, gradeText: "ENGLISH WILLOW · G2", sortOrder: 2 },
    { label: "Kashmir", price: 499900, bladeColor: "#EAD6A8", grainsCount: 6, gradeText: "KASHMIR WILLOW", sortOrder: 3 },
  ];
  for (const wg of willowGrades) {
    await prisma.builderWillowGrade.create({ data: wg }).catch(() => {});
  }

  const gripColors = [
    { name: "Black", hexColor: "#111417", sortOrder: 1 },
    { name: "Navy", hexColor: "#0A0A0A", sortOrder: 2 },
    { name: "Red", hexColor: "#C3262C", sortOrder: 3 },
    { name: "Willow", hexColor: "#E3C78E", sortOrder: 4 },
    { name: "White", hexColor: "#F3EEE3", sortOrder: 5 },
    { name: "Green", hexColor: "#3A3A3A", sortOrder: 6 },
    { name: "Blue", hexColor: "#C8501A", sortOrder: 7 },
  ];
  for (const gc of gripColors) {
    await prisma.builderGripColor.create({ data: gc }).catch(() => {});
  }

  const stickerColors = [
    { name: "Black", hexColor: "#111417", textColor: "#FFFFFF", sortOrder: 1 },
    { name: "Navy", hexColor: "#0A0A0A", textColor: "#FFFFFF", sortOrder: 2 },
    { name: "Red", hexColor: "#C3262C", textColor: "#FFFFFF", sortOrder: 3 },
    { name: "Willow", hexColor: "#E3C78E", textColor: "#111111", sortOrder: 4 },
    { name: "White", hexColor: "#F3EEE3", textColor: "#111111", sortOrder: 5 },
    { name: "Green", hexColor: "#3A3A3A", textColor: "#FFFFFF", sortOrder: 6 },
    { name: "Blue", hexColor: "#C8501A", textColor: "#FFFFFF", sortOrder: 7 },
  ];
  for (const sc of stickerColors) {
    await prisma.builderStickerColor.create({ data: sc }).catch(() => {});
  }

  await prisma.builderRule.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      nameMaxLength: 10,
      numMaxLength: 3,
      knockingInPrice: 80000,
      leadTimeText: "Ships in 10 to 14 days",
      defaultValues: {
        willow: "Grade 1 English",
        size: "Short Handle",
        weight: "2lb 9oz",
        grip: "#0A0A0A",
        sticker: "#C3262C",
        name: "Arjun",
        number: "07",
      },
    },
  });
  console.log("✅ Custom builder options seeded.");

  // 6. Bulk Pricing Tiers
  const pricingTiers = [
    { minQuantity: 10, maxQuantity: 24, discountPct: 8, sortOrder: 1 },
    { minQuantity: 25, maxQuantity: 49, discountPct: 12, sortOrder: 2 },
    { minQuantity: 50, maxQuantity: null, discountPct: 15, sortOrder: 3 },
  ];
  for (const tier of pricingTiers) {
    await prisma.pricingTier.create({ data: tier }).catch(() => {});
  }

  // 7. Hero Slides
  const slides = [
    {
      kicker: "Leather bats",
      headline1: "Built for",
      headline2: "the big hit.",
      subText: "Grade 1 English willow, pressed and shaped by hand. Big edges, a low middle and a pick-up lighter than it weighs.",
      btn1Label: "Shop leather bats",
      btn1Link: "leather-bats.html",
      btn2Label: "Build a custom bat",
      btn2Link: "custom-bat.html",
      progressLabel: "Leather bats",
      imageUrl: "img/shot.jpg",
      productId: "pro-edition",
      cardTag: "Bestseller",
      sortOrder: 1,
    },
    {
      kicker: "Customised bat",
      headline1: "Your name",
      headline2: "on the willow.",
      subText: "Pick the willow, the grip and the sticker colours. We engrave your name and number down the blade.",
      btn1Label: "Design your bat",
      btn1Link: "custom-bat.html",
      btn2Label: null,
      btn2Link: null,
      progressLabel: "Customised bat",
      imageUrl: "img/whites.jpg",
      isCustomCard: true,
      cardTag: "Made to order",
      sortOrder: 2,
    },
    {
      kicker: "Tennis bats",
      headline1: "Play under",
      headline2: "the lights.",
      subText: "Light Kashmir willow bats for box cricket, night leagues and the taped ball.",
      btn1Label: "Shop tennis bats",
      btn1Link: "tennis-bats.html",
      btn2Label: null,
      btn2Link: null,
      progressLabel: "Tennis bats",
      imageUrl: "img/redsky.jpg",
      productId: "street",
      cardTag: "Night-league pick",
      sortOrder: 3,
    },
    {
      kicker: "Clubs & academies",
      headline1: "Kit out",
      headline2: "your club.",
      subText: "Bats in your club colours with your crest on the sticker, plus kit for the whole squad.",
      btn1Label: "Start a bulk enquiry",
      btn1Link: "bulk-enquiry.html",
      btn2Label: null,
      btn2Link: null,
      progressLabel: "Club & bulk",
      imageUrl: "img/stadium.jpg",
      productId: "kitbag",
      cardTag: "Squad kit",
      sortOrder: 4,
    },
  ];

  for (const s of slides) {
    await prisma.heroSlide.create({ data: s }).catch(() => {});
  }
  console.log("✅ Hero slides seeded.");

  // 8. Store Settings
  const defaultSettings = [
    { key: "store_name", value: "Krickscricket" },
    { key: "store_tagline", value: "Cricket bats made by hand, shipped worldwide" },
    { key: "contact_email", value: "hello@krickscricket.com" },
    { key: "whatsapp_enabled", value: true },
    { key: "whatsapp_number", value: "+919876543210" },
    { key: "order_number_prefix", value: "KC-" },
    { key: "announcement_text", value: "Free name engraving on every custom bat · Shipping worldwide" },
    { key: "announcement_highlight", value: "Shipping worldwide" },
    { key: "announcement_enabled", value: true },
  ];

  for (const st of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: st.key },
      update: { value: st.value },
      create: { key: st.key, value: st.value },
    });
  }
  console.log("✅ Store settings seeded.");

  console.log("🎉 Database seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

