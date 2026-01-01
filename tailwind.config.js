/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        morandi: {
          sage: "#98A697", // Sage Green
          rose: "#D6A6A6", // Dusty Rose
          grey: "#B0B0A9", // Warm Grey
          slate: "#8B9BB4", // Slate Blue
          cream: "#F2F0E9", // Background Cream
          dark: "#5C5C5C", // Text Dark
          muted: "#858585", // Text Muted
        },
      },
      fontFamily: {
        sans: ["Inter", "Microsoft JhengHei", "sans-serif"],
      },
    },
  },
  plugins: [],
};
