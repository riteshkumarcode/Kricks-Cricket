"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { PRODUCTS, getProductById } from "@/lib/catalog";
import { generateBatSvg } from "@/lib/svg-bat";
import { generateItemSvg } from "@/lib/svg-items";
import { useStore } from "@/context/StoreContext";

export interface HeroSlideData {
  kick: string;
  hl: [string, string];
  sub: string;
  cta: string;
  href: string;
  label: string;
  card: {
    p?: string;
    custom?: boolean;
    k: string;
  };
  img: string;
  imgPos?: string;
}

const SLIDES: HeroSlideData[] = [
  {
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
    kick: "Clubs & academies",
    hl: ["Kit out", "your club."],
    sub: "Bats in your club colours with your crest on the sticker, plus kit for the whole squad.",
    cta: "Start a bulk enquiry",
    href: "/bulk-enquiry",
    label: "Club & bulk",
    card: { p: "kitbag", k: "Squad kit" },
    img: "/img/stadium.jpg",
  },
];

const DURATION = 7000;

export interface HeroSliderProps {
  initialSlides?: HeroSlideData[];
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ initialSlides }) => {
  const { formatPrice } = useStore();
  const [slides, setSlides] = useState<HeroSlideData[]>(initialSlides || SLIDES);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetch("/api/hero-slides")
      .then((r) => r.json())
      .then((data) => {
        if (data.slides && Array.isArray(data.slides) && data.slides.length > 0) {
          setSlides(data.slides);
        }
      })
      .catch(() => {});
  }, []);

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const touchStartXRef = useRef<number | null>(null);

  const currentSlide = slides[activeIdx] || slides[0] || SLIDES[0];

  const goToSlide = useCallback((newIdx: number) => {
    setActiveIdx((newIdx + slides.length) % slides.length);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [slides.length]);

  const handleNext = useCallback(() => goToSlide(activeIdx + 1), [activeIdx, goToSlide]);
  const handlePrev = useCallback(() => goToSlide(activeIdx - 1), [activeIdx, goToSlide]);

  // Autoplay loop with progress tracking
  useEffect(() => {
    let animId: number;

    const tick = () => {
      if (!isPaused) {
        const elapsed = Date.now() - startTimeRef.current;
        const currentProgress = Math.min(1, elapsed / DURATION);
        setProgress(currentProgress);

        if (currentProgress >= 1) {
          handleNext();
        }
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Touch swipe detection
  const handlePointerDown = (e: React.PointerEvent) => {
    touchStartXRef.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = e.clientX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(diff) > 50) {
      if (diff < 0) handleNext();
      else handlePrev();
    }
  };

  // Render floating product card
  const renderCard = (slide: HeroSlideData) => {
    const { card } = slide;
    if (card.custom) {
      const batSvg = generateBatSvg({
        blade: "#E8CE95",
        grip: "#111111",
        sticker: "#C8501A",
        stickerInk: "#FFFFFF",
        name: "Arjun",
        num: "07",
        grains: 10,
        label: "Customised bat",
      });

      return (
        <Link href="/custom-bat" className="pcard">
          <span className="th" dangerouslySetInnerHTML={{ __html: batSvg }} />
          <span>
            <small>{card.k}</small>
            <b>Customised bat</b>
            <span className="price">From {formatPrice(499900)}</span>
            <span className="go">Design yours →</span>
          </span>
        </Link>
      );
    }

    const p = getProductById(card.p || "pro-edition");
    if (!p) return null;

    const isAcc = p.cat === "acc";
    const artSvg = isAcc
      ? generateItemSvg(p.drawingType || "kitbag", p.color1 || "#F3EEE3", p.color2 || "#C3262C")
      : generateBatSvg({
          blade: p.bladeColor || "#E8CE95",
          grip: p.gripColor || "#C3262C",
          sticker: p.stickerColor || "#0A0A0A",
          stickerInk: p.stickerInkColor || "#F0E3C3",
          grains: p.grainsCount || 11,
          label: `${p.name} cricket bat`,
        });

    return (
      <Link href={`/product/${p.slug}`} className="pcard">
        <span
          className={`th ${isAcc ? "acc" : ""}`}
          dangerouslySetInnerHTML={{ __html: artSvg }}
        />
        <span>
          <small>{card.k}</small>
          <b>{p.name}</b>
          <span className="price">{formatPrice(p.price)}</span>
          <span className="go">View product →</span>
        </span>
      </Link>
    );
  };

  return (
    <div className="hero-wrap frame">
      <section
        id="hero"
        className="hero"
        aria-roledescription="carousel"
        aria-label="Featured"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          startTimeRef.current = Date.now() - progress * DURATION;
          setIsPaused(false);
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <h1 className="sr">Krickscricket: cricket bats made by hand</h1>

        {/* Background Slides */}
        {slides.map((slide, idx) => (
          <div
            key={slide.label || idx}
            className={`slide ${idx === activeIdx ? "on" : ""}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.img}
              alt={slide.kick}
              style={{ objectPosition: slide.imgPos || "center center" }}
            />
          </div>
        ))}

        {/* Dark Scrim Gradients */}
        <div className="scrim" aria-hidden="true" />

        {/* Hero Copy */}
        <div className="hcopy" aria-live="polite">
          <span className="kick">{currentSlide.kick}</span>
          <p className="hl">
            <span className="ln">{currentSlide.hl[0]}</span>
            <span className="ln">{currentSlide.hl[1]}</span>
          </p>
          <p className="hsub">{currentSlide.sub}</p>
          <div className="hrow">
            <Link className="btn white" href={currentSlide.href}>
              <span>{currentSlide.cta}</span> <span className="ar">→</span>
            </Link>
            <Link className="btn ghost" href="/custom-bat">
              Build a custom bat
            </Link>
          </div>
        </div>

        {/* Floating Product Card */}
        {renderCard(currentSlide)}

        {/* Bottom Carousel Controls */}
        <div className="hctrl">
          <span className="cnt">
            <b>0{activeIdx + 1}</b> / 0{slides.length}
          </span>

          <div className="bars">
            {slides.map((s, idx) => (
              <button
                key={s.label}
                type="button"
                className={idx === activeIdx ? "on" : ""}
                aria-label={s.label}
                onClick={() => goToSlide(idx)}
              >
                <span>{s.label}</span>
                <i>
                  <b
                    style={{
                      width:
                        idx === activeIdx
                          ? `${progress * 100}%`
                          : idx < activeIdx
                          ? "100%"
                          : "0%",
                    }}
                  />
                </i>
              </button>
            ))}
          </div>

          <div className="harr">
            <button type="button" aria-label="Previous slide" onClick={handlePrev}>
              ←
            </button>
            <button type="button" aria-label="Next slide" onClick={handleNext}>
              →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

