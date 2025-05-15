/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#646cff',
        yellow: '#fbbf24',
        purple: '#8b5cf6',
        pink: '#ec4899',
        green: '#22c55e',
        headingColor: '#1e293b',
        textColor: '#334155',
      },
      boxShadow: {
       panelShadow: '0 48px 100px 0px rgba(17, 12, 46, 0.15)',
      },
    },
  },
  plugins: [],
}

