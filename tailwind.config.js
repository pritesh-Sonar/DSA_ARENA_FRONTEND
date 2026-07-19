/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        arena: {
          bg: "#05070C",
          surface: "#0D111B",
          surfaceHover: "#131826",
          border: "#1E2536",
        },
        accent: {
          cyan: "#22D3EE",
          amber: "#F5A623",
          green: "#34D399",
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};