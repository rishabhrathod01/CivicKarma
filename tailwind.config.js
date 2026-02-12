/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e6f4ea",
          100: "#b8dfc5",
          200: "#8bcaa0",
          300: "#5db57b",
          400: "#30a056",
          500: "#1a7f37",
          600: "#15662c",
          700: "#104d21",
          800: "#0a3316",
          900: "#051a0b",
        },
        civic: {
          green: "#1a7f37",
          blue: "#0969da",
          orange: "#d29922",
          red: "#cf222e",
          gray: "#656d76",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
