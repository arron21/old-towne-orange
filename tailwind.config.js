/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        citrus: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        sage: {
          50: '#f6f7f4',
          100: '#eaede6',
          200: '#d5dcce',
          300: '#b6c3ab',
          400: '#94a584',
          500: '#778a66',
          600: '#5c6d4d',
          700: '#48553c',
          800: '#3a4431',
          900: '#30392a',
        },
        parchment: {
          DEFAULT: '#fdfbf7',
          50: '#faf8f2',
          100: '#f3efe3',
          200: '#e7e0cc',
        },
        brass: {
          DEFAULT: '#b48a3c',
          light: '#d4aa5d',
          dark: '#8b6623',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'warm': '0 4px 20px -2px rgba(194, 65, 12, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'warm-lg': '0 10px 25px -3px rgba(194, 65, 12, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
