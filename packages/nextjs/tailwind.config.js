/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [require("daisyui")],
  darkMode: ["class", '[data-theme="dark"]'], // or 'media' if you prefer
  daisyui: {
    darkTheme: "dark",
    themes: [
      {
        light: {
          primary: "#D9480F",
          "primary-content": "#ffffff",
          secondary: "#E25822",
          "secondary-content": "#ffffff",
          accent: "#FFDAB9",
          "accent-content": "#1E1E1E",
          neutral: "#f4f4f4",
          "neutral-content": "#1E1E1E",
          "base-100": "#FAFAFA", // << Light background
          "base-200": "#f0f0f0",
          "base-300": "#e0e0e0",
          "base-content": "#1A1A1A",
        },
      },
      {
        dark: {
          primary: "#D9480F",
          "primary-content": "#ffffff",
          secondary: "#E25822",
          "secondary-content": "#ffffff",
          accent: "#FFDAB9",
          "accent-content": "#1E1E1E",
          neutral: "#1E1E1E",
          "neutral-content": "#FAFAFA",
          "base-100": "#111111", // << Dark background
          "base-200": "#1A1A1A",
          "base-300": "#2A2A2A",
          "base-content": "#FAFAFA",
        },
      },
    ],
  },
  theme: {
    extend: {
      fontFamily: {
        "space-grotesk": ["Space Grotesk", "sans-serif"],
      },
    },
  },
};
