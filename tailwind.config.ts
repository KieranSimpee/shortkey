import type { Config } from "tailwindcss";

/** SHORTKEY V3.0 Lilac Edition — official tokens only */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        silk: {
          DEFAULT: "#F7F5FF",
          light: "#FFFFFF",
          dark: "#EDEAFF",
        },
        brand: {
          DEFAULT: "#8C82FC",
          light: "#B9B3FF",
          dark: "#6F66E0",
          muted: "#F7F5FF",
          flare: "#EDEAFF",
          silver: "#E8E6F2",
        },
        ink: {
          DEFAULT: "#242424",
          muted: "#5A5A5A",
          subtle: "#8A8A8A",
        },
        surface: {
          dark: "#161226",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-montserrat)", "system-ui", "sans-serif"],
        mono: ["var(--font-space-grotesk)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        widest: "0.2em",
      },
      boxShadow: {
        soft: "0 8px 24px rgba(140, 130, 252, 0.12)",
        card: "0 10px 30px rgba(140, 130, 252, 0.12)",
        float: "0 12px 36px rgba(140, 130, 252, 0.14)",
      },
      borderRadius: {
        card: "24px",
      },
    },
  },
  plugins: [],
};

export default config;
