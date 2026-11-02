import React from "react";
import { PRODUCTS } from "@/lib/catalog";
import { CategoryTemplate } from "@/components/storefront/CategoryTemplate";

export const metadata = {
  title: "Tennis Bats · Krickscricket",
  description:
    "Light bats for the tennis ball and the taped ball. Thin handles, scooped backs and low middles for gully, street and box cricket.",
};

export default function TennisBatsPage() {
  const tennisProducts = PRODUCTS.filter((p) => p.cat === "tennis");

  const filterOptions = [
    { key: "all", label: "All" },
    { key: "Kashmir", label: "Kashmir willow" },
    { key: "Popular", label: "Popular willow" },
  ];

  const guideItems = [
    {
      term: "Tennis ball",
      desc: "A soft ball that bounces high. Choose a light bat with a mid middle so you can get on top of the bounce.",
    },
    {
      term: "Tape ball",
      desc: "Taped tennis balls skid through low and fast. A low middle and a flat face meet them sooner.",
    },
    {
      term: "Box cricket",
      desc: "Short boundaries and quick hands. Our lightest bats, around 850–950 g, are made for it.",
    },
    {
      term: "Never with a leather ball",
      desc: "Tennis bats are not pressed for the hard ball and will crack. Use a leather bat for that.",
    },
  ];

  return (
    <CategoryTemplate
      title="Tennis bats"
      description="Light bats for the tennis ball and the taped ball. Thin handles, scooped backs and low middles for gully, street and box cricket."
      heroImage="/img/redsky.jpg"
      products={tennisProducts}
      filterOptions={filterOptions}
      filterType="wood"
      guideTitle="Tennis ball or tape ball?"
      guideItems={guideItems}
    />
  );
}
