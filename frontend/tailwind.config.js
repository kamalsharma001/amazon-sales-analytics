/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#090B10",
          900: "#0F131C",
          850: "#141924",
          800: "#1A2030",
          700: "#242C40",
          600: "#374260",
        },
        paper: {
          50: "#F7F8FA",
          100: "#EEF0F4",
          200: "#E2E5EC",
        },
        gold: {
          400: "#F0B84B",
          500: "#E8A83C",
          600: "#C98A24",
        },
        teal: {
          400: "#3FC7AE",
          500: "#1F8A70",
          600: "#166654",
        },
        coral: {
          400: "#F16B6B",
          500: "#E14F4F",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -8px rgba(0,0,0,0.25)",
        glow: "0 0 0 1px rgba(232,168,60,0.15), 0 8px 30px -8px rgba(232,168,60,0.25)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #F0B84B 0%, #E8A83C 45%, #C98A24 100%)",
      },
    },
  },
  plugins: [],
};
