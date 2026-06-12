import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#0E1117",
        surface: "#161B27",
        elevated: "#1E2535",
        accent: {
          DEFAULT: "#F5A623",
          soft: "#F5A62318",
        },
        primary: "#F0EDE6",
        secondary: "#8891A4",
        tertiary: "#4A5262",
        success: "#22C55E",
        danger: "#EF4444",
        border: "#252D3D",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.02em",
      },
      maxWidth: {
        phone: "420px",
      },
      keyframes: {
        "pulse-scale": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.08)" },
          "100%": { transform: "scale(1)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "pulse-scale": "pulse-scale 0.18s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
