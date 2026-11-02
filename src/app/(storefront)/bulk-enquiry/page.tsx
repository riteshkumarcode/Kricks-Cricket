"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/catalog";
import { useStore } from "@/context/StoreContext";

export default function BulkEnquiryPage() {
  const { formatPrice } = useStore();

  const batProducts = PRODUCTS.filter((p) => p.cat !== "acc");
  const [selectedBatId, setSelectedBatId] = useState("club");
  const [quantity, setQuantity] = useState(20);

  // Form states
  const [clubName, setClubName] = useState("");
  const [country, setCountry] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [neededByDate, setNeededByDate] = useState("");
  const [notes, setNotes] = useState("");
  const [hasError, setHasError] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Order Estimator Calculation
  const selectedBat = PRODUCTS.find((p) => p.id === selectedBatId) || batProducts[0];
  const discountRate = quantity >= 50 ? 0.15 : quantity >= 25 ? 0.12 : 0.08;
  const discountedUnit = Math.round(selectedBat.price * (1 - discountRate));
  const estimatedTotal = discountedUnit * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid =
      clubName.trim().length > 0 &&
      country.trim().length > 0 &&
      contactName.trim().length > 0 &&
      /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

    if (!isValid) {
      setHasError(true);
      return;
    }

    setHasError(false);
    setIsSubmitted(true);
  };

  return (
    <section className="frame ph">
      <h1>
        Bulk enquiry<span>.</span>
      </h1>
      <p className="lead">
        Bats, pads, gloves and bags for clubs, academies, schools and corporate teams, with your
        crest and colours on the stickers.
      </p>

      {/* Stadium Banner */}
      <div className="band">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/adelaide.jpg" alt="A cricket ground at dusk" />
      </div>

      {/* Left Column: Estimator & Squad Tiers */}
      <div className="side">
        <div className="est rv in" aria-live="polite">
          <h2>Estimate your order</h2>
          <label htmlFor="bm" className="sr">
            Bat
          </label>
          <select
            id="bm"
            value={selectedBatId}
            onChange={(e) => setSelectedBatId(e.target.value)}
          >
            {batProducts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {p.subTitle}
              </option>
            ))}
          </select>

          <label htmlFor="bq" style={{ fontSize: "17px" }}>
            Number of bats: <b id="bqv">{quantity}</b>
          </label>
          <input
            type="range"
            id="bq"
            min={10}
            max={150}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />

          <span className="big price" id="btot">
            {formatPrice(estimatedTotal)}
          </span>

          <p style={{ fontSize: "17px" }} id="bnote">
            {Math.round(discountRate * 100)}% off: <span>{formatPrice(discountedUnit)}</span> a bat
            instead of <span>{formatPrice(selectedBat.price)}</span>. Crest stickers included.
          </p>
        </div>

        <table className="tiers rv in">
          <caption className="sr">Squad pricing</caption>
          <thead>
            <tr>
              <th scope="col">Bats</th>
              <th scope="col">Saving per bat</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>10 to 24</td>
              <td>8% off</td>
            </tr>
            <tr>
              <td>25 to 49</td>
              <td>12% off</td>
            </tr>
            <tr>
              <td>50 or more</td>
              <td>15% off</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Right Column: Enquiry Form or Confirmation */}
      {isSubmitted ? (
        <div className="thanks" role="status">
          <h2>Thanks, {clubName}</h2>
          <p style={{ fontSize: "19px" }}>
            We&apos;ve got your enquiry for about {quantity} bats. We&apos;ll send a quote and
            sticker proofs to {email} within two working days.
          </p>
          <Link className="btn navy" href="/" style={{ justifySelf: "start" }}>
            Back to the shop <span className="ar">→</span>
          </Link>
        </div>
      ) : (
        <form className="f" id="form" noValidate onSubmit={handleSubmit}>
          <div className="two">
            <div className="field">
              <label htmlFor="club">Club, academy or company</label>
              <input
                id="club"
                required
                autoComplete="organization"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="ctry">Country</label>
              <input
                id="ctry"
                required
                autoComplete="country-name"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>

          <div className="two">
            <div className="field">
              <label htmlFor="n">Your name</label>
              <input
                id="n"
                required
                autoComplete="name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="e">Email</label>
              <input
                id="e"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <fieldset
            style={{
              border: 0,
              padding: 0,
              margin: 0,
              display: "grid",
              gap: "10px",
            }}
          >
            <legend
              style={{
                fontSize: "16px",
                color: "var(--muted)",
                padding: 0,
                marginBottom: "10px",
              }}
            >
              What do you need?
            </legend>
            <div className="checks">
              <label>
                <input type="checkbox" defaultChecked /> Leather bats
              </label>
              <label>
                <input type="checkbox" /> Tennis bats
              </label>
              <label>
                <input type="checkbox" /> Pads
              </label>
              <label>
                <input type="checkbox" /> Gloves
              </label>
              <label>
                <input type="checkbox" /> Helmets
              </label>
              <label>
                <input type="checkbox" /> Kit bags
              </label>
              <label>
                <input type="checkbox" /> Match balls
              </label>
            </div>
          </fieldset>

          <div className="field">
            <label htmlFor="logo">Your crest or logo (PNG, SVG or PDF)</label>
            <input
              id="logo"
              type="file"
              accept=".png,.svg,.pdf,.jpg,.jpeg"
            />
          </div>

          <div className="field">
            <label htmlFor="d">Needed by</label>
            <input
              id="d"
              type="date"
              value={neededByDate}
              onChange={(e) => setNeededByDate(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="m">Anything else we should know</label>
            <textarea
              id="m"
              placeholder="Sizes, colours, age groups, delivery address…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {hasError && (
            <p id="err" style={{ color: "#B3261E", fontSize: "17px" }}>
              Please add your club, country, name and a valid email.
            </p>
          )}

          <button className="btn" type="submit" style={{ justifySelf: "start" }}>
            Send enquiry <span className="ar">→</span>
          </button>
        </form>
      )}
    </section>
  );
}
