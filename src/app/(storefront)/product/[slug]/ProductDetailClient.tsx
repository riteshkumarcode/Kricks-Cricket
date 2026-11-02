"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CatalogProduct, PRODUCTS } from "@/lib/catalog";
import { generateBatSvg } from "@/lib/svg-bat";
import { generateItemSvg } from "@/lib/svg-items";
import { Tile } from "@/components/ui/Tile";
import { useStore } from "@/context/StoreContext";
import { useToast } from "@/components/ui/Toast";

interface ReviewItem {
  id: string;
  author: string;
  role: string;
  location: string;
  rating: number;
  date: string;
  spec: string;
  title: string;
  body: string;
  verified: boolean;
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: "r1",
    author: "Rohan Deshmukh",
    role: "Opening Batsman · Mumbai Division A",
    location: "Mumbai, IN",
    rating: 5,
    date: "2 weeks ago",
    spec: "Short Handle · 2lb 9oz · Knocked in",
    title: "Pings off the middle like a gun.",
    body: "Ordered 2lb 9oz and it picks up like a 2lb 7oz. Evenly spaced straight grains, zero dead spots on the toe, and the workshop knocking-in saved me a week of mallet work. Straight into league matches.",
    verified: true,
  },
  {
    id: "r2",
    author: "James Harrington",
    role: "Club Captain · Surrey Championship",
    location: "London, UK",
    rating: 5,
    date: "1 month ago",
    spec: "Short Handle · 2lb 10oz · Engraved",
    title: "Better willow than bats twice the price in the UK.",
    body: "Arrived in London in 6 days via DHL. The pressing is spot on—firm enough for English early-season seams without feeling boardy. Huge 39mm edges and clean laser-like hand engraving.",
    verified: true,
  },
  {
    id: "r3",
    author: "Karthik Nair",
    role: "All-Rounder · Corporate Premier League",
    location: "Bengaluru, IN",
    rating: 5,
    date: "1 month ago",
    spec: "Short Handle · 2lb 8oz · Anti-Scuff fitted",
    title: "Effortless pick-up and massive sweet spot.",
    body: "The balance is unreal. Even mistimed drives past extra cover carry to the rope. The signed workshop card showing the exact cleft weight and moisture reading was a great touch.",
    verified: true,
  },
  {
    id: "r4",
    author: "Liam O'Connor",
    role: "Top-Order Batter · Grade Cricket",
    location: "Melbourne, AU",
    rating: 4,
    date: "2 months ago",
    spec: "Long Handle · 2lb 10oz · Knocked in",
    title: "Built for hard, bouncy tracks.",
    body: "Took it into the nets against bowling machines at 135 km/h. High spine transfers power cleanly on the pull and cut. Highly recommend adding the anti-scuff sheet.",
    verified: true,
  },
];

const GRIP_SWATCHES: [string, string][] = [
  ["Default", ""],
  ["Black", "#111111"],
  ["Burnt Orange", "#C8501A"],
  ["Crimson", "#C3262C"],
  ["Chalk White", "#F3EEE3"],
];

export function ProductDetailClient({ product }: { product: CatalogProduct }) {
  const router = useRouter();
  const { currency, formatPrice, addToCart } = useStore();
  const { showToast } = useToast();

  const isBat = product.cat !== "acc";
  const [currentView, setCurrentView] = useState<"face" | "back" | "edge">("face");
  const [quantity, setQuantity] = useState(1);

  // Customizations & Add-ons
  const [knockIn, setKnockIn] = useState(false);
  const [antiScuff, setAntiScuff] = useState(false);
  const [extraGrip, setExtraGrip] = useState(false);
  const [customGripColor, setCustomGripColor] = useState<string>("");
  const [engraving, setEngraving] = useState("");
  const [playingStyle, setPlayingStyle] = useState("All-round strokeplay");

  // Delivery Estimator
  const [deliveryZone, setDeliveryZone] = useState<"IN" | "UK" | "AU" | "US" | "AE">("IN");
  const [pincode, setPincode] = useState("");
  const [deliveryChecked, setDeliveryChecked] = useState(false);

  // Anatomy Tab
  const [activeAnatomyZone, setActiveAnatomyZone] = useState<"sweetspot" | "edges" | "handle" | "toe">("sweetspot");

  // Bundle selection
  const bundleCandidates = PRODUCTS.filter(
    (p) => p.id !== product.id && ["gloves", "leather-balls", "grips", "toe-guard", "kitbag"].includes(p.id)
  ).slice(0, 3);
  const [selectedBundleIds, setSelectedBundleIds] = useState<string[]>(
    bundleCandidates.slice(0, 2).map((p) => p.id)
  );

  // Reviews state
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [reviewFilter, setReviewFilter] = useState<"all" | "5" | "4">("all");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewRole, setNewReviewRole] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState("");
  const [newReviewBody, setNewReviewBody] = useState("");

  // Sticky Bottom Bar visibility
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowStickyBar(window.scrollY > 680);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Default option selections
  const getInitialOptions = (): Record<string, string> => {
    if (product.cat === "leather") {
      return {
        Size: product.id === "junior-harrow" ? "Harrow" : "Short Handle",
        Weight: product.id === "junior-harrow" ? "2lb 4oz" : "2lb 9oz",
      };
    }
    if (product.cat === "tennis") {
      return { Size: "Short Handle" };
    }
    if (["gloves", "pads", "helmet"].includes(product.id)) {
      return {
        Fit: "Men's",
        ...(product.id !== "helmet" ? { Hand: "Right-handed" } : {}),
      };
    }
    return {};
  };

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(getInitialOptions());

  // Category breadcrumb details
  const categoryMeta: Record<string, [string, string]> = {
    leather: ["Leather bats", "/leather-bats"],
    tennis: ["Tennis bats", "/tennis-bats"],
    acc: ["Accessories", "/accessories"],
  };
  const [catName, catUrl] = categoryMeta[product.cat] || ["Shop", "/"];

  // Unit and total price calculation (including add-ons in paise)
  const addOnsTotal =
    (knockIn ? 80000 : 0) +
    (antiScuff ? 45000 : 0) +
    (extraGrip ? 29900 : 0);
  const unitPrice = product.price + addOnsTotal;
  const totalPrice = unitPrice * quantity;

  const activeGripHex = customGripColor || product.gripColor || "#C3262C";

  // Gallery rendering
  const renderMainGraphic = () => {
    if (!isBat) {
      const itemSvg = generateItemSvg(
        product.drawingType || "gloves",
        product.color1 || "#F3EEE3",
        product.color2 || "#C3262C"
      );
      return <div dangerouslySetInnerHTML={{ __html: itemSvg }} />;
    }

    const batSvg = generateBatSvg({
      blade: product.bladeColor || "#E8CE95",
      grip: activeGripHex,
      sticker: product.stickerColor || "#0A0A0A",
      stickerInk: product.stickerInkColor || "#F0E3C3",
      grains: product.grainsCount || 9,
      grade: product.gradeLabel || "ENGLISH WILLOW",
      name: currentView === "face" && engraving ? engraving : "",
      view: currentView,
      label: `${product.name} ${currentView} view`,
    });
    return <div dangerouslySetInnerHTML={{ __html: batSvg }} />;
  };

  // Thumbnail buttons for bats
  const views: { key: "face" | "back" | "edge"; label: string }[] = [
    { key: "face", label: "Face" },
    { key: "back", label: "Back" },
    { key: "edge", label: "Edge" },
  ];

  // Options configuration
  const availableOptionGroups = (): Array<[string, string[]]> => {
    if (product.cat === "leather") {
      return [
        [
          "Size",
          product.id === "junior-harrow"
            ? ["Harrow"]
            : ["Short Handle", "Long Handle", "Harrow"],
        ],
        [
          "Weight",
          product.id === "junior-harrow"
            ? ["2lb 3oz", "2lb 4oz", "2lb 5oz"]
            : ["2lb 8oz", "2lb 9oz", "2lb 10oz", "2lb 11oz"],
        ],
      ];
    }
    if (product.cat === "tennis") {
      return [["Size", ["Short Handle", "Long Handle", "Size 6"]]];
    }
    if (["gloves", "pads", "helmet"].includes(product.id)) {
      const groups: Array<[string, string[]]> = [["Fit", ["Men's", "Youth"]]];
      if (product.id !== "helmet") {
        groups.push(["Hand", ["Right-handed", "Left-handed"]]);
      }
      return groups;
    }
    return [];
  };

  // Specs table rows
  const specRows = isBat
    ? [
        ["Willow Grade", product.subTitle],
        ["Grain Structure", `${product.grains || "8–12"} straight, even grains`],
        ["Weight Range", product.weight || "2lb 8oz – 2lb 10oz"],
        ["Edge Thickness", product.edge || "38–40 mm"],
        ["Spine Height", "63–65 mm apex"],
        ["Sweet Spot Profile", product.profile || "Mid-to-low swell"],
        ["Bow & Pick-up", "12 mm standard bow · Feather-light pick-up"],
        ["Handle", "6-piece Sarawak cane with rubber/cork inserts"],
        ["Toe Protection", "Factory-fitted rubber toe guard"],
        ["Workshop Origin", "Hand-pressed in New Delhi & Meerut, India"],
      ]
    : [
        ["Product", product.name],
        ["Specification", product.subTitle],
        ["Materials", "Match-grade leather & high-density impact foam"],
        ["Ventilation", "Mesh gussets & moisture-wicking lining"],
        ["Certification", "Club & league match standard"],
        ["Origin", "Hand-finished in India"],
      ];

  const relatedProducts = PRODUCTS.filter(
    (x) => x.cat === product.cat && x.id !== product.id
  ).slice(0, 3);

  const buildOptionSummary = () => {
    const bits = Object.values(selectedOptions);
    if (isBat && product.cat === "leather") bits.push(playingStyle);
    if (customGripColor) {
      const found = GRIP_SWATCHES.find((g) => g[1] === customGripColor);
      if (found) bits.push(`${found[0]} grip`);
    }
    if (knockIn) bits.push("Knocked in");
    if (antiScuff) bits.push("Anti-scuff sheet");
    if (extraGrip) bits.push("Spare grip");
    if (engraving) bits.push(`Engraved "${engraving.toUpperCase()}"`);
    return bits.join(" · ");
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      opts: buildOptionSummary(),
      price: unitPrice,
      qty: quantity,
      drawingType: product.drawingType || undefined,
      color1: product.color1 || undefined,
      color2: product.color2 || undefined,
      bat: isBat
        ? {
            blade: product.bladeColor || "#E8CE95",
            grip: activeGripHex,
            sticker: product.stickerColor || "#0A0A0A",
            grains: product.grainsCount || 9,
            name: engraving || undefined,
          }
        : undefined,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const handleAddBundle = () => {
    handleAddToCart();
    selectedBundleIds.forEach((id) => {
      const item = PRODUCTS.find((p) => p.id === id);
      if (item) {
        addToCart({
          id: item.id,
          name: item.name,
          opts: item.subTitle,
          price: item.price,
          qty: 1,
          drawingType: item.drawingType || undefined,
          color1: item.color1 || undefined,
          color2: item.color2 || undefined,
        });
      }
    });
    showToast(`Added ${product.name} + ${selectedBundleIds.length} kit items to cart.`);
  };

  const toggleBundleItem = (id: string) => {
    setSelectedBundleIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const bundleTotal =
    unitPrice +
    selectedBundleIds.reduce((sum, id) => {
      const p = PRODUCTS.find((x) => x.id === id);
      return sum + (p ? p.price : 0);
    }, 0);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewTitle.trim() || !newReviewBody.trim()) return;
    const item: ReviewItem = {
      id: `r-${Date.now()}`,
      author: newReviewName.trim(),
      role: newReviewRole.trim() || "Club Cricketer",
      location: "Verified Player",
      rating: newReviewRating,
      date: "Just now",
      spec: buildOptionSummary() || product.subTitle,
      title: newReviewTitle.trim(),
      body: newReviewBody.trim(),
      verified: true,
    };
    setReviews([item, ...reviews]);
    setNewReviewName("");
    setNewReviewRole("");
    setNewReviewTitle("");
    setNewReviewBody("");
    setShowReviewForm(false);
    showToast("Thank you. Your pitch report has been published.");
  };

  const filteredReviews = reviews.filter((r) =>
    reviewFilter === "all" ? true : String(r.rating) === reviewFilter
  );

  const deliveryEstimates: Record<string, { window: string; courier: string; duty: string }> = {
    IN: {
      window: "3–5 working days",
      courier: "BlueDart / Delhivery Air (Free over ₹10,000)",
      duty: "All GST included · No extra charges",
    },
    UK: {
      window: "5–8 working days",
      courier: "DHL Express Worldwide",
      duty: "Tracked air freight from New Delhi",
    },
    AU: {
      window: "6–9 working days",
      courier: "DHL / FedEx Priority",
      duty: "Biosecurity cleared English/Kashmir willow",
    },
    US: {
      window: "6–9 working days",
      courier: "FedEx International Priority",
      duty: "Doorstep tracked air delivery",
    },
    AE: {
      window: "3–5 working days",
      courier: "DHL Express Gulf",
      duty: "Fast customs clearance",
    },
  };

  const anatomyData = {
    sweetspot: {
      tag: "ZONE 01 · THE ENGINE ROOM",
      title: "Extended Mid-to-Low Sweet Spot",
      desc: "Pressed progressively with dual steel rollers so the face yields slightly under seam impact while rebounding with maximum trampoline transfer. Engineered for both front-foot drives and late back-foot punches.",
      metricLabel: "Sweet Spot Span",
      metricValue: "215 mm",
    },
    edges: {
      tag: "ZONE 02 · PERIMETER MASS",
      title: "Towering 38–40 mm Edges & 64 mm Spine",
      desc: "Instead of scooping wood out of the back, we retain full convex mass behind the swell. Even off-centre inside and outside edges carry over the infield.",
      metricLabel: "Edge Profile",
      metricValue: "39 mm",
    },
    handle: {
      tag: "ZONE 03 · ENERGY DAMPENING",
      title: "6-Piece Sarawak Cane Handle",
      desc: "Split Malaysian Sarawak cane laminated with natural rubber and cork strips. Absorbs harsh bottom-hand jar from fast Yorkers while keeping the blade feeling 2 oz lighter on pick-up.",
      metricLabel: "Cane Laminates",
      metricValue: "6-Piece",
    },
    toe: {
      tag: "ZONE 04 · GROUND DEFENCE",
      title: "Sealed Semi-Square Toe with Guard",
      desc: "Shaped with a gentle radius at the corners to prevent splitting when tapping down in the crease, sealed against damp turf, and fitted with a heavy-duty vulcanised toe guard.",
      metricLabel: "Moisture Seal",
      metricValue: "Fitted",
    },
  };

  return (
    <>
      <section className="frame pdp">
        {/* Left Column: Sticky Gallery */}
        <div className="gal">
          <div className={`main ${!isBat ? "acc" : ""}`} data-v={currentView}>
            {product.badge && <span className="pdp-badge">{product.badge}</span>}
            {renderMainGraphic()}
            {isBat && engraving && currentView === "face" && (
              <span className="pdp-live-pill">
                Live Engraving: <b>{engraving.toUpperCase()}</b>
              </span>
            )}
          </div>

          {isBat && (
            <div className="thumbs">
              {views.map((v) => (
                <button
                  key={v.key}
                  type="button"
                  aria-pressed={currentView === v.key}
                  aria-label={`${v.label} view`}
                  onClick={() => setCurrentView(v.key)}
                >
                  <div
                    style={{ display: "contents" }}
                    dangerouslySetInnerHTML={{
                      __html: generateBatSvg({
                        blade: product.bladeColor || "#E8CE95",
                        grip: activeGripHex,
                        sticker: product.stickerColor || "#0A0A0A",
                        stickerInk: product.stickerInkColor || "#F0E3C3",
                        grains: product.grainsCount || 9,
                        view: v.key,
                      }),
                    }}
                  />
                  <small className="thumb-lbl">{v.label}</small>
                </button>
              ))}
            </div>
          )}

          {/* Gallery Highlight Strip */}
          <div className="pdp-gal-meta">
            <div>
              <b>Cleft Selection</b>
              <span>Hand-picked by master bat-maker</span>
            </div>
            <div>
              <b>Balance Check</b>
              <span>Tested for dead-weight vs pick-up</span>
            </div>
            <div>
              <b>Authenticity</b>
              <span>Serialised workshop build card</span>
            </div>
          </div>
        </div>

        {/* Right Column: Buy Panel */}
        <div className="buy">
          <div className="pdp-top-bar">
            <p className="crumb">
              <Link href="/">Home</Link> / <Link href={catUrl}>{catName}</Link> / {product.name}
            </p>
            <a href="#reviews" className="pdp-rating-link">
              <span className="stars">★★★★★</span>
              <b>4.9</b>
              <span>({reviews.length} reviews)</span>
            </a>
          </div>

          <div>
            <h1>{product.name}</h1>
            <p className="sub soft">{product.subTitle}</p>
          </div>

          <div className="pdp-price-row">
            <div className="pr price">
              <span>{formatPrice(totalPrice)}</span>
              {product.was && <s>{formatPrice(product.was * quantity)}</s>}
            </div>
            <span className="pdp-stock-pill">
              <i className="dot" /> In workshop · Ships in 3 days
            </span>
          </div>

          <p style={{ fontSize: "19px", maxWidth: "48ch" }}>{product.blurb}</p>

          <div style={{ display: "grid", gap: "22px" }}>
            {availableOptionGroups().map(([groupName, options]) => (
              <div key={groupName} className="grp">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span>{groupName}</span>
                  {groupName === "Size" && isBat && (
                    <Link href="/#size" style={{ fontSize: "14px", color: "var(--accent)", textDecoration: "none" }}>
                      Find your bat size →
                    </Link>
                  )}
                </div>
                <div className="opts" data-k={groupName}>
                  {options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className="opt"
                      aria-pressed={selectedOptions[groupName] === opt}
                      onClick={() =>
                        setSelectedOptions({ ...selectedOptions, [groupName]: opt })
                      }
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Cleft Preference / Playing Style for Leather Bats */}
            {product.cat === "leather" && (
              <div className="grp">
                <span>Preferred Balance &amp; Pick-up</span>
                <div className="opts">
                  {["All-round strokeplay", "Feather-light pick-up", "Heavy bottom-hand power"].map((style) => (
                    <button
                      key={style}
                      type="button"
                      className="opt"
                      style={{ fontSize: "17px", padding: "10px 14px", minHeight: "42px" }}
                      aria-pressed={playingStyle === style}
                      onClick={() => setPlayingStyle(style)}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Grip Colour Selector for Bats */}
            {isBat && (
              <div className="grp">
                <span>
                  Grip Colour:{" "}
                  <b style={{ color: "var(--ink)", fontWeight: 500 }}>
                    {GRIP_SWATCHES.find((g) => g[1] === customGripColor)?.[0] || "Workshop Standard"}
                  </b>
                </span>
                <div className="pdp-swatches">
                  {GRIP_SWATCHES.map(([label, hex]) => (
                    <button
                      key={label}
                      type="button"
                      title={label}
                      aria-label={`Grip colour ${label}`}
                      aria-pressed={customGripColor === hex}
                      style={
                        {
                          "--c": hex || product.gripColor || "#C3262C",
                        } as React.CSSProperties
                      }
                      onClick={() => {
                        setCustomGripColor(hex);
                        setCurrentView("face");
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Workshop Preparation & Add-ons */}
            {isBat && (
              <div className="grp">
                <span>Workshop Match Preparation</span>
                <div style={{ display: "grid", gap: "10px" }}>
                  {product.cat === "leather" && (
                    <label className="chk">
                      <input
                        type="checkbox"
                        checked={knockIn}
                        onChange={(e) => setKnockIn(e.target.checked)}
                      />
                      <span>
                        <b>Hand Knocking-In &amp; Raw Linseed Oiling (+{formatPrice(80000)})</b>
                        <small style={{ display: "block", color: "var(--muted)", marginTop: "2px" }}>
                          2 hours of traditional hardwood mallet conditioning so the bat is ready for the nets on arrival.
                        </small>
                      </span>
                    </label>
                  )}

                  <label className="chk">
                    <input
                      type="checkbox"
                      checked={antiScuff}
                      onChange={(e) => setAntiScuff(e.target.checked)}
                    />
                    <span>
                      <b>Clear Anti-Scuff Sheet &amp; Fibre Edge Tape (+{formatPrice(45000)})</b>
                      <small style={{ display: "block", color: "var(--muted)", marginTop: "2px" }}>
                        Protects the blade face and edges from surface seam marks and moisture.
                      </small>
                    </span>
                  </label>

                  <label className="chk">
                    <input
                      type="checkbox"
                      checked={extraGrip}
                      onChange={(e) => setExtraGrip(e.target.checked)}
                    />
                    <span>
                      <b>Add Spare Octopus Replacement Grip (+{formatPrice(29900)})</b>
                      <small style={{ display: "block", color: "var(--muted)", marginTop: "2px" }}>
                        Pack an extra tournament-grade tacky rubber grip in your kit bag.
                      </small>
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Name Engraving */}
            {isBat && (
              <div className="field">
                <label htmlFor="eng">
                  Engrave your name or number on the blade (free, up to 10 letters)
                </label>
                <input
                  id="eng"
                  maxLength={10}
                  autoComplete="off"
                  placeholder="e.g. KOHLI 18 (Optional)"
                  value={engraving}
                  onChange={(e) => {
                    setEngraving(e.target.value.replace(/[^a-zA-Z0-9 ]/g, ""));
                    if (currentView !== "face") setCurrentView("face");
                  }}
                />
              </div>
            )}
          </div>

          {/* Quantity & Dual CTA Row */}
          <div className="pdp-action-block">
            <div className="grp">
              <span>Quantity</span>
              <div className="qty">
                <button
                  type="button"
                  aria-label="One fewer"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  −
                </button>
                <output>{quantity}</output>
                <button
                  type="button"
                  aria-label="One more"
                  onClick={() => setQuantity(Math.min(20, quantity + 1))}
                >
                  +
                </button>
              </div>
            </div>

            <div className="addrow">
              <button className="btn" type="button" onClick={handleAddToCart}>
                Add to cart · {formatPrice(totalPrice)} <span className="ar">→</span>
              </button>
              <button className="btn ink" type="button" onClick={handleBuyNow}>
                Buy it now
              </button>
            </div>
          </div>

          {/* Delivery & Dispatch Estimator Box */}
          <div className="pdp-delivery-box">
            <div className="pdp-delivery-head">
              <b>Check Dispatch &amp; Delivery Estimate</b>
              <select
                value={deliveryZone}
                onChange={(e) => {
                  setDeliveryZone(e.target.value as any);
                  setDeliveryChecked(true);
                }}
                aria-label="Select destination country"
              >
                <option value="IN">🇮🇳 India</option>
                <option value="UK">🇬🇧 United Kingdom</option>
                <option value="AU">🇦🇺 Australia</option>
                <option value="US">🇺🇸 United States</option>
                <option value="AE">🇦🇪 UAE</option>
              </select>
            </div>

            {deliveryZone === "IN" && (
              <div className="pdp-pin-row">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit PIN code (e.g. 110001)"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                />
                <button
                  type="button"
                  className="btn ink"
                  style={{ minHeight: "42px", fontSize: "17px", padding: "0 18px" }}
                  onClick={() => setDeliveryChecked(true)}
                >
                  Check
                </button>
              </div>
            )}

            <div className="pdp-delivery-info">
              <div>
                <span>Estimated Arrival:</span>
                <b>
                  {deliveryEstimates[deliveryZone].window}
                  {pincode.length === 6 && deliveryChecked ? ` to PIN ${pincode}` : ""}
                </b>
              </div>
              <div>
                <span>Courier Partner:</span>
                <span>{deliveryEstimates[deliveryZone].courier}</span>
              </div>
              <div>
                <span>Duties &amp; Taxes:</span>
                <span>{deliveryEstimates[deliveryZone].duty}</span>
              </div>
            </div>
          </div>

          {/* 4-Pillar Workshop Guarantee Grid */}
          <div className="pdp-guarantees">
            <div>
              <b>Hand-Split Clefts</b>
              <span>Split with the grain, never sawn across it.</span>
            </div>
            <div>
              <b>Ping &amp; Weight Verified</b>
              <span>Weighed on digital scales before dispatch.</span>
            </div>
            <div>
              <b>14-Day Crease Return</b>
              <span>Easy exchange on any unused stock bat.</span>
            </div>
            <div>
              <b>Insured Air Transit</b>
              <span>Hard-wall shipping tube to your door.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Blade Anatomy & Performance Breakdown (Dark Chalk Section) */}
      {isBat && (
        <section className="pdp-anatomy" aria-labelledby="anatT">
          <div className="frame">
            <div className="head">
              <div>
                <span className="kick">Workshop Engineering</span>
                <h2 id="anatT">Inside the {product.name}</h2>
              </div>
              <p style={{ color: "#BDBAB4" }}>
                Every curve, spine apex, and edge profile is shaped with draw-knife and spokeshave to maximise rebound without adding dead weight.
              </p>
            </div>

            <div className="pdp-anatomy-grid">
              {/* Left: Interactive Zone Selector */}
              <div className="pdp-anatomy-tabs" role="tablist">
                {(
                  [
                    ["sweetspot", "01 · Sweet Spot & Pressing"],
                    ["edges", "02 · 39mm Edges & Spine"],
                    ["handle", "03 · Sarawak Cane Handle"],
                    ["toe", "04 · Toe Shield & Balance"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={activeAnatomyZone === key}
                    className={activeAnatomyZone === key ? "active" : ""}
                    onClick={() => setActiveAnatomyZone(key)}
                  >
                    <span>{label}</span>
                    <span className="ar">→</span>
                  </button>
                ))}
              </div>

              {/* Middle: Active Zone Detail Card */}
              <div className="pdp-anatomy-card" role="tabpanel">
                <span className="anat-tag">{anatomyData[activeAnatomyZone].tag}</span>
                <h3>{anatomyData[activeAnatomyZone].title}</h3>
                <p>{anatomyData[activeAnatomyZone].desc}</p>
                <div className="anat-stat">
                  <span>{anatomyData[activeAnatomyZone].metricLabel}</span>
                  <b>{anatomyData[activeAnatomyZone].metricValue}</b>
                </div>
              </div>

              {/* Right: Performance Meters */}
              <div className="pdp-meters">
                <h3>Performance Profile</h3>
                <div className="meter-row">
                  <div className="meter-lbl">
                    <span>Power &amp; Boundary Carry</span>
                    <b>96 / 100</b>
                  </div>
                  <div className="meter-track">
                    <div className="meter-fill" style={{ width: "96%" }} />
                  </div>
                </div>

                <div className="meter-row">
                  <div className="meter-lbl">
                    <span>Pick-Up Lightness</span>
                    <b>94 / 100</b>
                  </div>
                  <div className="meter-track">
                    <div className="meter-fill" style={{ width: "94%" }} />
                  </div>
                </div>

                <div className="meter-row">
                  <div className="meter-lbl">
                    <span>Off-Centre Edge Forgiveness</span>
                    <b>92 / 100</b>
                  </div>
                  <div className="meter-track">
                    <div className="meter-fill" style={{ width: "92%" }} />
                  </div>
                </div>

                <div className="meter-row">
                  <div className="meter-lbl">
                    <span>Handle Shock Absorption</span>
                    <b>95 / 100</b>
                  </div>
                  <div className="meter-track">
                    <div className="meter-fill" style={{ width: "95%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Specifications Table + What's In The Box */}
      <section className="frame spec" aria-labelledby="specT">
        <div style={{ gridColumn: "1 / 6", display: "grid", gap: "24px", alignContent: "start" }}>
          <h2 id="specT" className="rv in" style={{ gridColumn: "auto" }}>
            The details
          </h2>
          <div className="pdp-box-card">
            <h3>What&apos;s in the box</h3>
            <ul>
              <li>
                <b>01</b>
                <span>{product.name} ({product.subTitle})</span>
              </li>
              <li>
                <b>02</b>
                <span>Full-length padded Krickscricket transit sleeve</span>
              </li>
              <li>
                <b>03</b>
                <span>Signed Workshop Build Card (cleft weight, grain count &amp; maker initials)</span>
              </li>
              <li>
                <b>04</b>
                <span>Knocking-in &amp; linseed oil care guide</span>
              </li>
            </ul>
          </div>
        </div>

        <table id="spec" className="rv in">
          <tbody>
            {specRows.map(([label, val]) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                <td>{val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Complete Your Kit (Frequently Bought Together Bundle) */}
      {bundleCandidates.length > 0 && (
        <section className="frame pdp-bundle" aria-labelledby="bundleT">
          <div className="pdp-bundle-box">
            <div className="pdp-bundle-head">
              <div>
                <span className="soft" style={{ textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "14px" }}>
                  Match-Day Kit Builder
                </span>
                <h2 id="bundleT">Complete your crease kit</h2>
              </div>
              <div className="pdp-bundle-cta">
                <div>
                  <small>Bundle total ({1 + selectedBundleIds.length} items)</small>
                  <b className="price">{formatPrice(bundleTotal)}</b>
                </div>
                <button type="button" className="btn" onClick={handleAddBundle}>
                  Add bundle to cart <span className="ar">→</span>
                </button>
              </div>
            </div>

            <div className="pdp-bundle-grid">
              {bundleCandidates.map((item) => {
                const isSelected = selectedBundleIds.includes(item.id);
                const svg = generateItemSvg(
                  item.drawingType || "gloves",
                  item.color1 || "#F3EEE3",
                  item.color2 || "#C3262C"
                );
                return (
                  <label
                    key={item.id}
                    className={`pdp-bundle-item ${isSelected ? "selected" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleBundleItem(item.id)}
                    />
                    <div
                      className="b-thumb"
                      dangerouslySetInnerHTML={{ __html: svg }}
                    />
                    <div className="b-info">
                      <b>{item.name}</b>
                      <span>{item.subTitle}</span>
                      <span className="price">+ {formatPrice(item.price)}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Knocking In Care Section (Leather bats only) */}
      {product.cat === "leather" && (
        <section className="frame care" id="careSec" aria-labelledby="careT">
          <h2 id="careT" className="rv in">
            Knocking in your bat
          </h2>
          <ol className="rv in">
            <li>
              Rub a teaspoon of raw linseed oil into the face, edges and toe. Leave it to soak in
              overnight. Never oil the splice or the sticker.
            </li>
            <li>
              Tap the face with a bat mallet for about two hours, slowly building up force. Round
              the edges and toe gently.
            </li>
            <li>
              Face throw-downs with an old ball for a week, then play in the nets before using it in
              a match.
            </li>
            <li>
              Add our knocking-in service above and we do all of this for you before the bat ships.
            </li>
          </ol>
        </section>
      )}

      {/* Verified Player Reviews & Pitch Reports */}
      <section className="frame pdp-reviews" id="reviews" aria-labelledby="revT">
        <div className="pdp-reviews-head">
          <div>
            <h2 id="revT">Player pitch reports</h2>
            <p className="soft" style={{ marginTop: "8px", fontSize: "18px" }}>
              Verified feedback from league, club, and academy cricketers worldwide.
            </p>
          </div>

          <div className="pdp-reviews-summary">
            <div className="big-score">
              <b>4.9</b>
              <div>
                <span className="stars">★★★★★</span>
                <small>Based on {reviews.length} verified reviews</small>
              </div>
            </div>
            <button
              type="button"
              className="btn ink"
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              {showReviewForm ? "Close form" : "Write a pitch report"}
            </button>
          </div>
        </div>

        {/* Optional Write Review Form */}
        {showReviewForm && (
          <form className="pdp-review-form" onSubmit={handleSubmitReview}>
            <h3>Submit your review for {product.name}</h3>
            <div className="two">
              <div className="field">
                <label htmlFor="rv-name">Your name</label>
                <input
                  id="rv-name"
                  required
                  value={newReviewName}
                  onChange={(e) => setNewReviewName(e.target.value)}
                  placeholder="e.g. Siddharth Sharma"
                />
              </div>
              <div className="field">
                <label htmlFor="rv-role">Club, League or Role</label>
                <input
                  id="rv-role"
                  value={newReviewRole}
                  onChange={(e) => setNewReviewRole(e.target.value)}
                  placeholder="e.g. Opening Batter · Delhi Gymkhana"
                />
              </div>
            </div>

            <div className="two">
              <div className="field">
                <label htmlFor="rv-rating">Rating</label>
                <select
                  id="rv-rating"
                  value={newReviewRating}
                  onChange={(e) => setNewReviewRating(Number(e.target.value))}
                >
                  <option value={5}>★★★★★ (5/5) — Exceptional</option>
                  <option value={4}>★★★★☆ (4/5) — Very Good</option>
                  <option value={3}>★★★☆☆ (3/5) — Solid</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="rv-title">Review headline</label>
                <input
                  id="rv-title"
                  required
                  value={newReviewTitle}
                  onChange={(e) => setNewReviewTitle(e.target.value)}
                  placeholder="e.g. Light pick-up and massive ping"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="rv-body">How does it play?</label>
              <textarea
                id="rv-body"
                required
                value={newReviewBody}
                onChange={(e) => setNewReviewBody(e.target.value)}
                placeholder="Share your thoughts on pick-up, balance, sweet spot, and delivery..."
              />
            </div>

            <button type="submit" className="btn" style={{ justifySelf: "start" }}>
              Publish review <span className="ar">→</span>
            </button>
          </form>
        )}

        {/* Filter Pills */}
        <div className="opts" style={{ marginBottom: "28px" }}>
          <button
            type="button"
            className="opt"
            aria-pressed={reviewFilter === "all"}
            onClick={() => setReviewFilter("all")}
          >
            All ({reviews.length})
          </button>
          <button
            type="button"
            className="opt"
            aria-pressed={reviewFilter === "5"}
            onClick={() => setReviewFilter("5")}
          >
            5 Stars ({reviews.filter((r) => r.rating === 5).length})
          </button>
          <button
            type="button"
            className="opt"
            aria-pressed={reviewFilter === "4"}
            onClick={() => setReviewFilter("4")}
          >
            4 Stars ({reviews.filter((r) => r.rating === 4).length})
          </button>
        </div>

        {/* Review Cards Grid */}
        <div className="pdp-reviews-grid">
          {filteredReviews.map((r) => (
            <article key={r.id} className="pdp-review-card">
              <div className="r-top">
                <span className="stars">{"★".repeat(r.rating)}</span>
                <span className="r-date">{r.date}</span>
              </div>
              <h3>{r.title}</h3>
              <p>{r.body}</p>
              <div className="r-spec">{r.spec}</div>
              <div className="r-foot">
                <div>
                  <b>{r.author}</b>
                  <span>{r.role} · {r.location}</span>
                </div>
                {r.verified && <span className="v-badge">✓ Verified Buyer</span>}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Product FAQ Accordion */}
      <section className="frame faq" aria-labelledby="pdpFaqT">
        <h2 id="pdpFaqT" className="rv in">
          Questions before you buy
        </h2>
        <div className="qs">
          <details className="rv in" open>
            <summary>Can I request a specific dead-weight or grain count?</summary>
            <p>
              Yes. Select your weight above, and if you have a specific preference (for example, straight narrow grains or a slightly fuller toe), leave a note at checkout and our bat-maker will hand-pick the closest matching cleft on the rack.
            </p>
          </details>
          <details className="rv in">
            <summary>Is the bat ready to play in a match immediately?</summary>
            <p>
              If you tick &ldquo;Hand Knocking-In &amp; Raw Linseed Oiling&rdquo; above, our workshop oils the blade and knocks in the face and edges by hand so you can take it straight into net sessions. For untreated English willow bats, always knock in before facing a hard leather ball.
            </p>
          </details>
          <details className="rv in">
            <summary>How is the bat packaged for international shipping?</summary>
            <p>
              Every bat is sealed inside a padded sleeve, wrapped in moisture-barrier film, and packed inside a crush-proof double-walled cylinder with full DHL/FedEx transit insurance.
            </p>
          </details>
          <details className="rv in">
            <summary>What if the pick-up doesn&apos;t suit my stance?</summary>
            <p>
              Unused stock bats (without custom name engraving) can be exchanged or returned within 14 days of delivery. Message us on WhatsApp with a video of your swing and we will swap it for the ideal profile.
            </p>
          </details>
        </div>
      </section>

      {/* Related Products Rail */}
      {relatedProducts.length > 0 && (
        <section className="frame rel" aria-labelledby="relT">
          <h2 id="relT" className="rv in">
            You may also like
          </h2>
          <div className="tiles">
            {relatedProducts.map((p) => (
              <Tile
                key={p.id}
                product={p}
                currency={currency}
                onQuickAdd={() =>
                  addToCart({
                    id: p.id,
                    name: p.name,
                    opts: p.subTitle,
                    price: p.price,
                    qty: 1,
                  })
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Bottom Quick-Buy Bar */}
      <div className={`pdp-sticky-bar ${showStickyBar ? "show" : ""}`} aria-hidden={!showStickyBar}>
        <div className="frame pdp-sticky-in">
          <div className="pdp-sticky-left">
            <b>{product.name}</b>
            <span>{buildOptionSummary() || product.subTitle}</span>
          </div>
          <div className="pdp-sticky-right">
            <span className="price">{formatPrice(totalPrice)}</span>
            <button type="button" className="btn" onClick={handleAddToCart}>
              Add to cart <span className="ar">→</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
