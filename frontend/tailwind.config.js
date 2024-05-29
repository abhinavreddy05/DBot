/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-blue': '#DDEFFF',
        'dark-blue': '#537CA5',
        'green': '#BDD959',
        'red': '#E95943',
        'black': '#0D0D0D',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

