"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { useToast } from "@/components/ui/Toast";

export const Footer: React.FC = () => {
  const { currency } = useStore();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    showToast("You’re in. Watch your inbox for the next willow drop.");
    setEmail("");
  };

  return (
    <footer id="ftr" className="foot">
      <div className="frame">
        <div className="f-top">
          {/* Newsletter Column */}
          <div>
            <h2>Join the Kricks club</h2>
            <p>New bats, limited willow drops and knocking-in tips. One email a month.</p>
            <form className="f-news" onSubmit={handleNewsletter}>
              <label className="sr" htmlFor="fmail">
                Email
              </label>
              <input
                id="fmail"
                type="email"
                placeholder="Your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="btn" type="submit">
                Join
              </button>
            </form>
          </div>

          {/* Shop Column */}
          <div className="f-col">
            <h3>Shop</h3>
            <ul>
              <li>
                <Link href="/leather-bats">Leather bats</Link>
              </li>
              <li>
                <Link href="/tennis-bats">Tennis bats</Link>
              </li>
              <li>
                <Link href="/custom-bat">Customised bat</Link>
              </li>
              <li>
                <Link href="/accessories">Accessories</Link>
              </li>
            </ul>
          </div>

          {/* Help Column */}
          <div className="f-col">
            <h3>Help</h3>
            <ul>
              <li>
                <Link href="/contact">Contact us</Link>
              </li>
              <li>
                <Link href="/contact">Shipping &amp; returns</Link>
              </li>
              <li>
                <Link href="/#size">Bat size guide</Link>
              </li>
              <li>
                <Link href="/product/pro-edition">Knocking-in guide</Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="f-col">
            <h3>Company</h3>
            <ul>
              <li>
                <Link href="/#craft">How we make bats</Link>
              </li>
              <li>
                <Link href="/bulk-enquiry">Clubs &amp; bulk orders</Link>
              </li>
              <li>
                <Link href="/contact">Privacy</Link>
              </li>
              <li>
                <Link href="/contact">Terms</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Giant Watermark Display Word */}
        <div className="f-word" aria-hidden="true">
          KRICKS<span>.</span>
        </div>

        {/* Legal Strip */}
        <div className="f-legal">
          <span>© 2026 Krickscricket. Cricket bats made by hand, shipped worldwide.</span>
          <span>Prices shown in {currency}</span>
        </div>
      </div>
    </footer>
  );
};

