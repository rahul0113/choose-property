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
        brand: {
          DEFAULT: "#0f766e", // teal-700 — trust + local market
          light: "#14b8a6",
          dark: "#115e59",
          soft: "#ccfbf1",
        },
        accent: {
          DEFAULT: "#b45309", // amber-700 — CTA warmth
          light: "#f59e0b",
          soft: "#fef3c7",
        },
        ink: {
          DEFAULT: "#1e293b",
          soft: "#475569",
          faint: "#94a3b8",
        },
        paper: {
          DEFAULT: "#ffffff",
          soft: "#f8fafc",
          line: "#e2e8f0",
        },
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Noto Sans",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 3px rgba(15, 23, 42, 0.08), 0 4px 14px rgba(15, 23, 42, 0.06)",
        sheet: "0 -8px 30px rgba(15, 23, 42, 0.18)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

export default config;
