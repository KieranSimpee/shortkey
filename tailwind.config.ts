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
        silk: {
          DEFAULT: "#f7f5f2",
          light: "#faf9f7",
          dark: "#f3f0ec",
        },
        brand: {
          DEFAULT: "#9B7AE3",
          light: "#B8A4ED",
          dark: "#7E5FD4",
          muted: "#F3EEFB",
          flare: "#EDE4FA",
          silver: "#E8E6EE",
        },
        ink: {
          DEFAULT: "#111111",
          muted: "#6B6B6B",
          subtle: "#9A9A9A",
        },
        surface: {
          dark: "#1A1520",
        },
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.2em",
      },
      boxShadow: {
        soft: "0 2px 16px rgba(155, 127, 212, 0.08)",
        card: "0 4px 24px rgba(0, 0, 0, 0.04)",
        float: "0 8px 32px rgba(155, 127, 212, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
