/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2c3e50',
        secondary: '#3498db',
        accent: '#e74c3c',
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

