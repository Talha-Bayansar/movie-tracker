/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "c-background": "#16122F",
        "c-text": "#FFFFFF",
        "c-text-small": "#5D5D6E",
        "c-primary": "#F09531",
        "c-background-light": "#1C2238",
        "c-grey": "#DADADA",
      },
    },
  },
  plugins: [],
};
