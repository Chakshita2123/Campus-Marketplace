/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A',
        accent: '#3B82F6',
        secondary: '#C7D2FE',
        background: '#FFFFFF',
        surface: '#F3F4F6',
        success: '#10B981',
        alert: '#F59E0B',
      }
    },
  },
  plugins: [],
}
