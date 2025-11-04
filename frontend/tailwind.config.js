import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#10B981", // modern emerald green
          dark: "#0A0A0A", // deep black background
          grey: "#1A1A1A", // card/nav background
        },
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        taskmind: {
          primary: "#10B981", // green accent
          secondary: "#1A1A1A",
          accent: "#10B981",
          neutral: "#111111",
          "base-100": "#0A0A0A", // main background
          "base-200": "#1A1A1A", // card/nav background
          "base-content": "#FFFFFF", // text color
        },
      },
    ],
  },
};
