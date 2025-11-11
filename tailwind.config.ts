import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-heading)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      colors: {
        brand: {
          // Древесные тона
          wood: {
            deep: '#4B2E2B',
            medium: '#6B4423',
            light: '#C19A6B'
          },
          // Золото и бронза
          gold: {
            rich: '#CFAE70',
            antique: '#B8860B'
          },
          bronze: '#8C7853',
          // Фон и текст
          paper: '#EDE3D2',
          beige: '#FAF7F2',
          heading: '#2C2C2C',
          text: '#3F3A36'
        },
        fender: {
          candyAppleRed: '#9B111E',
          fiestaRed: '#E32636',
          lakePlacidBlue: '#26619C',
          surfGreen: '#9FD5C9',
          olympicWhite: '#FAFAFA',
          shellPink: '#EEC9C0',
          sherwoodGreen: '#2A5D3C',
          shorelineGold: '#C0B283',
          incaSilver: '#C0C3C2',
          sonicBlue: '#C7E6F0',
          daphneBlue: '#7BAFD4',
          burgundyMist: '#8E6674',
          sunburstDark: '#2C1B18',
          sunburstMid: '#603813',
          sunburstEdge: '#D1A75F'
        }
      }
    }
  },
  plugins: []
};

export default config;

