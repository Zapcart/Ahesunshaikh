import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#070709",
          900: "#0b0b0f",
          800: "#101016",
          700: "#17171f",
          600: "#20202a",
        },
        mist: "#e9e9ec",
        smoke: "#9a9aa3",
        lime: "#c9f24a",
        coral: "#ff6b4a",
        charcoal: {
          DEFAULT: "#121212",
          deep: "#0e0e0e",
          light: "#1a1a1a",
        },
        cream: "#f4f1ea",
        crimson: "#c82323",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "ui-serif", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.06em",
        mega: "0.28em",
      },
    },
  },
  plugins: [],
};
export default config;
