/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Hanken Grotesk', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#2D7A89',
          light: '#B7DBD1',
          dark: '#111827',
        },
        secondary: {
          DEFAULT: '#BEC7E7',
          light: '#F3F4F6',
        },
        accent: {
          DEFAULT: '#6B7280',
          light: '#F3F4F6',
        },
      },
    },
  },
  plugins: [],
};