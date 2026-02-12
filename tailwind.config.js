/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
      colors: {
        neon: '#C5FF38',
        ink: '#0A0A0E',
        mist: '#F5F7FA',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(197,255,56,0.65), 0 0 28px rgba(197,255,56,0.2)',
      },
      backgroundImage: {
        grid: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)',
      },
    },
  },
  plugins: [],
};
