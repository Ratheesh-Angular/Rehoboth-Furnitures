import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{ts,tsx,js,jsx,md,mdx}",
    "./src/components/**/*.{ts,tsx,js,jsx,md,mdx}",
    "./src/features/**/*.{ts,tsx,js,jsx,md,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
module.exports = {
  important: true,
  // ...rest
};
