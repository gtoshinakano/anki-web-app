/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "noto": ["Noto Sans JP"],
        "dm": ["DM Sans"],
        "montserrat": ["Montserrat"]

      }
    },
  },
  plugins: [],
}
