/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        // CU Denver brand typeface is Helvetica Neue Bold Condensed Oblique.
        // Arial / Arial Narrow are the brand-approved substitutes.
        display: ['"Helvetica Neue"', 'Helvetica', 'Arial', '"Arial Narrow"', 'sans-serif'],
      },
      colors: {
        // CU Denver primary + accessible gold
        gold: {
          100: '#F4EDDC',
          300: '#DBC99E',
          500: '#CFB87C',
          600: '#8D7334',
          700: '#75602B',
        },
        // City Heights Sandstone
        sandstone: {
          50: '#FBF8F1',
          100: '#F1EAD8',
          200: '#E3D9C2',
        },
        // Skyline Slate (brand tertiary)
        skyline: {
          100: '#DCE7EB',
          600: '#2E5D6E',
          700: '#244C5A',
          800: '#1D3843',
        },
        // CU Black / Dark Gray / Light Gray neutrals, tuned for WCAG AA
        ink: {
          300: '#CBD1D3',
          500: '#6B6E70',
          600: '#565A5C',
          700: '#3A3A3A',
          900: '#1F1F1F',
          950: '#14262E',
        },
        // Centennial Teal (brand secondary)
        teal: {
          100: '#D9EEF0',
          300: '#6FC3CB',
          500: '#28939D',
          600: '#1B6B73',
          700: '#15545B',
        },
        // Brand tertiary accents - icons / CTAs / small accents only, never text
        sunset: '#F87C56',
        brick: '#E35205',
        cherry: '#A6093D',
      },
    },
  },
  plugins: [],
}
