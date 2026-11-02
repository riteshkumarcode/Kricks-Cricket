"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DEFAULT_RATES } from "@/lib/tokens";
import { useStore } from "@/context/StoreContext";
import { MegaMenu } from "./MegaMenu";
import { MobileNav } from "./MobileNav";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { currency, setCurrency, cartCount, isBadgeBumping } = useStore();

  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isTucked, setIsTucked] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [burgerCoords, setBurgerCoords] = useState<{ x: number; y: number }>({ x: 300, y: 60 });

  const burgerRef = useRef<HTMLButtonElement>(null);
  const megaTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollYRef = useRef(0);

  // Nav links matching static design
  const links = [
    { key: "home", href: "/", label: "Home" },
    { key: "custom", href: "/custom-bat", label: "Customised Bat" },
    { key: "leather", href: "/leather-bats", label: "Leather Bats", mega: "leather" },
    { key: "tennis", href: "/tennis-bats", label: "Tennis Bats", mega: "tennis" },
    { key: "acc", href: "/accessories", label: "Accessories", mega: "acc" },
    { key: "contact", href: "/contact", label: "Contact Us" },
    { key: "bulk", href: "/bulk-enquiry", label: "Bulk Enquiry" },
  ];

  // Smart sticky header scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 8);

      if (!isNavOpen && !activeMega) {
        setIsTucked(y > lastScrollYRef.current && y > 220);
      }
      lastScrollYRef.current = y;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isNavOpen, activeMega]);

  // Handle burger click & calculate origin coordinates for circle reveal
  const handleToggleNav = () => {
    if (!isNavOpen && burgerRef.current) {
      const rect = burgerRef.current.getBoundingClientRect();
      setBurgerCoords({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
      document.body.classList.add("nav-open");
      setIsNavOpen(true);
      setIsTucked(false);
    } else {
      document.body.classList.remove("nav-open");
      setIsNavOpen(false);
    }
  };

  const handleCloseNav = () => {
    document.body.classList.remove("nav-open");
    setIsNavOpen(false);
  };

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMega(null);
        handleCloseNav();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Desktop mega menu hover timing
  const handleOpenMega = (key: string) => {
    if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
    setActiveMega(key);
  };

  const handleCloseMega = () => {
    megaTimerRef.current = setTimeout(() => {
      setActiveMega(null);
    }, 140);
  };

  const renderRoll = (text: string) => (
    <span className="roll">
      <span data-t={text}>{text}</span>
    </span>
  );

  return (
    <>
      <header
        id="hdr"
        className={`bar ${isScrolled ? "scrolled" : ""} ${isTucked ? "tuck" : ""} ${
          activeMega ? "mega-on" : ""
        }`}
        onMouseLeave={handleCloseMega}
      >
        {/* Top Announcement Bar */}
        <div className="annc">
          Free name engraving on every custom bat · <b>Shipping worldwide</b>
        </div>

        {/* Main Header Bar */}
        <div className="frame bar-in">
          {/* Logo */}
          <Link href="/" className="word" aria-label="Krickscricket home">
            <svg viewBox="0 0 100 100" aria-hidden="true" className="w-[26px] h-[26px]">
              <circle cx="50" cy="50" r="46" fill="#C8501A" />
              <path
                d="M30 7c-8.5 27-8.5 59 0 86M38 5c-8.5 28-8.5 62 0 90"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeDasharray="6 6"
                fill="none"
              />
            </svg>
            Kricks
          </Link>

          {/* Desktop Navigation */}
          <ul className="nav">
            {links.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              const isMegaHot = activeMega === item.mega;

              return (
                <li
                  key={item.key}
                  data-mega={item.mega}
                  className={isMegaHot ? "hot" : ""}
                  onMouseEnter={() => (item.mega ? handleOpenMega(item.mega) : setActiveMega(null))}
                  onFocus={() => (item.mega ? handleOpenMega(item.mega) : setActiveMega(null))}
                >
                  <Link href={item.href} aria-current={isActive ? "page" : undefined}>
                    {renderRoll(item.label)}
                    {item.mega && (
                      <svg
                        className="chev"
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        aria-hidden="true"
                      >
                        <path
                          d="M2 4l4 4 4-4"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          fill="none"
                        />
                      </svg>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Tools (Currency, Cart, Mobile Burger) */}
          <div className="tools">
            <label className="sr" htmlFor="cur">
              Currency
            </label>
            <select
              className="cur"
              id="cur"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {Object.keys(DEFAULT_RATES).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <Link href="/cart" className="cartbtn">
              {renderRoll("Cart")}
              <b className={isBadgeBumping ? "bump" : ""}>{cartCount}</b>
            </Link>

            <button
              ref={burgerRef}
              type="button"
              className="burger"
              aria-expanded={isNavOpen}
              aria-controls="mnav"
              aria-label={isNavOpen ? "Close menu" : "Open menu"}
              onClick={handleToggleNav}
            >
              <i />
              <i />
            </button>
          </div>
        </div>

        {/* Desktop Mega Menu Dropdown */}
        <MegaMenu
          activeKey={activeMega}
          onMouseEnter={() => {
            if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
          }}
          onMouseLeave={handleCloseMega}
          onClose={() => setActiveMega(null)}
        />
      </header>

      {/* Fullscreen Mobile Menu Overlay */}
      <MobileNav
        isOpen={isNavOpen}
        onClose={handleCloseNav}
        burgerCoords={burgerCoords}
      />
    </>
  );
};

