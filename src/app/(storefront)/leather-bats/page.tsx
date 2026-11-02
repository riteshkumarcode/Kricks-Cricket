import React from "react";
import { PRODUCTS } from "@/lib/catalog";
import { CategoryTemplate } from "@/components/storefront/CategoryTemplate";

export const metadata = {
  title: "Leather Bats · Krickscricket",
  description:
    "English and Kashmir willow bats for the hard ball, pressed and shaped by hand. Every bat ships oiled, and you can add full knocking-in at checkout.",
};

export default function LeatherBatsPage() {
  const leatherProducts = PRODUCTS.filter((p) => p.cat === "leather");

  const filterOptions = [
    { key: "all", label: "All" },
    { key: "1", label: "Grade 1" },
    { key: "2", label: "Grade 2" },
    { key: "3", label: "Grade 3" },
    { key: "4", label: "Kashmir" },
  ];

  const guideItems = [
    {
      term: "Grade 1 English",
      desc: "Straight, even grains with few marks. The best-performing willow, used for match bats.",
    },
    {
      term: "Grade 2 English",
      desc: "The same wood with a few more marks or a slightly wider grain. Plays almost as well and costs much less.",
    },
    {
      term: "Grade 3 English",
      desc: "More marks and wider grains. Good for club players moving up to the hard ball.",
    },
    {
      term: "Kashmir willow",
      desc: "Harder and heavier than English willow, and very hard-wearing. A sensible bat for the nets.",
    },
  ];

  return (
    <CategoryTemplate
      title="Leather bats"
      description="English and Kashmir willow bats for the hard ball, pressed and shaped by hand. Every bat ships oiled, and you can add full knocking-in at checkout."
      heroImage="/img/ball.jpg"
      products={leatherProducts}
      filterOptions={filterOptions}
      filterType="grade"
      guideTitle="Which grade of willow?"
      guideItems={guideItems}
    />
  );
}
