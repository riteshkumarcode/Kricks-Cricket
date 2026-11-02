import React from "react";
import { HeroSlider } from "@/components/storefront/HeroSlider";
import { PromiseStrip } from "@/components/storefront/PromiseStrip";
import { CategoryGrid } from "@/components/storefront/CategoryGrid";
import { BestsellersRail } from "@/components/storefront/BestsellersRail";
import { CustomBatTeaser } from "@/components/storefront/CustomBatTeaser";
import { CraftSteps } from "@/components/storefront/CraftSteps";
import { BatSizeFinder } from "@/components/storefront/BatSizeFinder";
import { ClubCTA } from "@/components/storefront/ClubCTA";
import { getHeroSlides } from "@/lib/cms-store";

export const metadata = {
  title: "Krickscricket · Cricket bats made by hand",
  description:
    "Cricket bats in English and Kashmir willow, pressed and shaped by hand and shipped worldwide.",
};

export default function HomePage() {
  const slides = getHeroSlides();

  return (
    <>
      <HeroSlider initialSlides={slides} />
      <PromiseStrip />
      <CategoryGrid />
      <BestsellersRail />
      <CustomBatTeaser />
      <CraftSteps />
      <BatSizeFinder />
      <ClubCTA />
    </>
  );
}

