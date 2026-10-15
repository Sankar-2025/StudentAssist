/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',  // Ultra-light mint white (excellent for card/section backgrounds)
          100: '#dcfce7', // Light green tint
          200: '#bbf7d0', // Pastel green indicator background
          300: '#86efac', 
          400: '#4ade80', 
          500: '#22c55e', // Vibrant Emerald Green (the core system primary color)
          600: '#16a34a', // Mid-tone structural green
          700: '#15803d', // Deep green for bold headers and active sidebar links
          800: '#166534', // Dark green for premium container states
          900: '#14532d', // Deep forest green
          950: '#052e16', // Deepest tone (perfect for high-contrast dark text/borders)
        },
      },
    },
  },
  plugins: [],
};
