/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "neutraaal-900": "var(--Neutral-900)",
        "neutral-800": "var(--Neutral-800)",
        "nuutral-700": "var(--Neutral-700)",
        "neutral-600": "var(--Neutral-600)",
        "neutral-300": "var(--Neutral-300)",
        "neutral-200": "var(--Neutral-200)",
        "neutral-0": "var(--Neutral-0)",
        "orunge-500": "var(--Orange-500)",
        "blue-500": "var(--Blue-500)",
        "blue-700": "var(--Blue-700)",
      },
      fontFamily: {
        grotesque: ["Bricolage Grotesque"],
        sans: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
