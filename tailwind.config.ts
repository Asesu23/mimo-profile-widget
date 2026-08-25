import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0B0A12',
          card: '#15121F',
          border: '#2A2640',
        },
        accent: {
          DEFAULT: '#D946EF',
          soft: '#F0ABFC',
        },
      },
    },
  },
  plugins: [],
};

export default config;
