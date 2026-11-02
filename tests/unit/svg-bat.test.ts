import { describe, it, expect } from "vitest";
import { generateBatSvg } from "../../src/lib/svg-bat";
import { generateBallSvg, generateItemSvg } from "../../src/lib/svg-items";

describe("Procedural SVG Generation", () => {
  it("renders default bat face view with brand sticker and grains", () => {
    const svg = generateBatSvg({ view: "face", grains: 10 });
    expect(svg).toContain("<svg");
    expect(svg).toContain("KRICKS");
    expect(svg).toContain("ENGLISH WILLOW");
    expect(svg).toContain('role="img"');
  });

  it("renders edge view of cricket bat", () => {
    const svg = generateBatSvg({ view: "edge" });
    expect(svg).toContain("<svg");
    expect(svg).toContain("Cricket bat");
  });

  it("renders back view of cricket bat", () => {
    const svg = generateBatSvg({ view: "back" });
    expect(svg).toContain("<svg");
    expect(svg).toContain("KRICKS");
  });

  it("embeds engraved custom name and number into face view", () => {
    const svg = generateBatSvg({
      view: "face",
      name: "Arjun",
      num: "07",
    });
    expect(svg).toContain("ARJUN");
    expect(svg).toContain("07");
  });

  it("generates cricket ball SVGs", () => {
    const leather = generateBallSvg("leather");
    expect(leather).toContain("Red leather ball");

    const tennis = generateBallSvg("tennis");
    expect(tennis).toContain("Tennis ball");
  });

  it("generates equipment SVGs", () => {
    const gloves = generateItemSvg("gloves");
    expect(gloves).toContain("Batting glove");

    const helmet = generateItemSvg("helmet");
    expect(helmet).toContain("Batting helmet");

    const kitbag = generateItemSvg("kitbag");
    expect(kitbag).toContain("Kit bag");
  });
});

