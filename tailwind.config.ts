import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#FFFFFF",
        surface: {
          DEFAULT: "#F4F3F0",
          hover: "#ECEAE5",
          active: "#E9E7E2",
        },
        ink: {
          DEFAULT: "#111111",
          muted: "#6B6966",
        },
        accent: {
          DEFAULT: "#C8501A",
          hover: "#A9420F",
          ink: "#FFFFFF",
        },
        line: "#E6E3DE",
        chalk: {
          DEFAULT: "#111111",
          ink: "#FFFFFF",
          subtle: "#1C1C1C",
          border: "#2C2C2C",
          muted: "#8C8984",
        },
        willow: "#E3C78E",
      },
      fontFamily: {
        display: ["var(--font-bebas)", "Bebas Neue", "Oswald", "Arial Narrow", "Impact", "sans-serif"],
        body: ["var(--font-jost)", "Jost", "Futura", "Century Gothic", "Segoe UI", "sans-serif"],
      },
      transitionTimingFunction: {
        brand: "cubic-bezier(0.2, 0.8, 0.2, 1)",
        wipe: "cubic-bezier(0.77, 0, 0.18, 1)",
      },
      borderRadius: {
        none: "0px",
        DEFAULT: "0px",
      },
      boxShadow: {
        header: "0 8px 30px rgba(17, 17, 17, 0.06)",
        mega: "0 30px 60px rgba(17, 17, 17, 0.12)",
        floating: "0 18px 40px rgba(0, 0, 0, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;

