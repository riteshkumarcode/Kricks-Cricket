import React from "react";
import { PRODUCTS } from "@/lib/catalog";
import { CategoryTemplate } from "@/components/storefront/CategoryTemplate";

export const metadata = {
  title: "Accessories · Krickscricket",
  description:
    "Gloves, pads, helmets, kit bags, grips and balls. Everything you carry out to the middle, in Kricks colours.",
};

export default function AccessoriesPage() {
  const accProducts = PRODUCTS.filter((p) => p.cat === "acc");

  const filterOptions = [
    { key: "all", label: "All" },
    { key: "protect", label: "Protection" },
    { key: "bags", label: "Bags" },
    { key: "balls", label: "Balls" },
    { key: "care", label: "Bat care" },
  ];

  const guideItems = [
    {
      term: "Gloves",
      desc: "Your fingertips should sit just short of the end of the finger rolls. Men's fits most adult hands; youth fits players up to about 15.",
    },
    {
      term: "Pads",
      desc: "The centre of the knee roll should sit on the centre of your knee when you stand normally.",
    },
    {
      term: "Helmet",
      desc: "Measure around your head just above the eyebrows. The grille should not touch your nose when you look forward.",
    },
    {
      term: "Grips and toe guards",
      desc: "Fit a fresh grip when the old one turns smooth or splits, and a toe guard on any bat used on damp grounds.",
    },
  ];

  return (
    <CategoryTemplate
      title="Accessories"
      description="Gloves, pads, helmets, kit bags, grips and balls. Everything you carry out to the middle, in Kricks colours."
      heroImage="/img/stumps.jpg"
      products={accProducts}
      filterOptions={filterOptions}
      filterType="group"
      guideTitle="Getting the fit right"
      guideItems={guideItems}
    />
  );
}
