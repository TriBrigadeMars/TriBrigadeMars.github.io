/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx,html}", "./*.html"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Public Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        display: ['"Barlow Condensed"', '"Public Sans"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        alabaster: '#FAF8F3',
        // Heritage Burnished & Deep Ochre (structural accent + WCAG AA text)
        gold: {
          100: '#F5EEDB',
          300: '#DEC484',
          500: '#C8A24A',
          600: '#7A5C18',
          700: '#634910',
        },
        // Warm Front Range surfaces (Alabaster & Warm Linen)
        sandstone: {
          50: '#FAF8F3',
          100: '#EFE9DC',
          200: '#DFD5C0',
        },
        // Deep & Skyline Slate
        skyline: {
          100: '#DAE6EA',
          600: '#275260',
          700: '#1F4350',
          800: '#17313B',
          900: '#121E24',
        },
        // Charcoal Ink & Muted Slate neutrals, tuned for WCAG AA/AAA
        ink: {
          300: '#C4CED2',
          500: '#687277',
          600: '#525C61',
          700: '#333D42',
          900: '#1B2428',
          950: '#121E24',
        },
        // Front Range Teal & Alpine Mist (signature interactive action, <=20% footprint)
        teal: {
          100: '#D8ECEE',
          300: '#6EC4C9',
          500: '#258991',
          600: '#1B5E63',
          700: '#154D52',
        },
        // Warm Editorial Highlights - icons / 3px borders / indicator dots only, never small prose
        terracotta: '#C4533A',
        sunset: '#E87451',
        brick: '#D44D08',
        cherry: '#9E1440',
      },
    },
  },
  plugins: [],
};
