import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',

  theme: {
    extend: {
      fontFamily: {
        sans: ['"Pretendard Variable"', 'Pretendard', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },

      fontSize: {
        headline1: ['1.875rem', { lineHeight: '1.3', fontWeight: '700', letterSpacing: '-0.02em' }],
        headline2: ['1.375rem', { lineHeight: '1.35', fontWeight: '700', letterSpacing: '-0.01em' }],
        headline3: ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
        body1: ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        body2: ['0.875rem', { lineHeight: '1.55', fontWeight: '400' }],
        label1: ['0.9375rem', { lineHeight: '1.4', fontWeight: '600' }],
        label2: ['0.8125rem', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '0.01em' }],
        caption: ['0.75rem', { lineHeight: '1.4', fontWeight: '400', letterSpacing: '0.01em' }],
        code: ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
      },

      colors: {
        primary: {
          50: '#f5f8fa',
          100: '#d7e4eb',
          200: '#b7d2df',
          300: '#91c1d9',
          400: '#66b1d7',
          500: '#3aa3d7',
          600: '#228dc2',
          700: '#1c729c',
          800: '#155677',
          900: '#0e3b51',
          950: '#081f2b',
        },

        secondary: {
          50: '#f7f5f9',
          100: '#e2daea',
          200: '#ccbbdd',
          300: '#b698d4',
          400: '#a172d0',
          500: '#8b49cd',
          600: '#752fbc',
          700: '#602699',
          800: '#4a1e76',
          900: '#341554',
          950: '#1f0c31',
        },

        neutral: {
          50: '#f7f7f8',
          100: '#dfe1e3',
          200: '#c8cacd',
          300: '#b0b4b8',
          400: '#999ea2',
          500: '#82878c',
          600: '#6d7175',
          700: '#575a5d',
          800: '#424446',
          900: '#2c2d2e',
          950: '#161717',
        },

        success: {
          bg: 'var(--color-success-bg)',
          fg: 'var(--color-success-fg)',
          text: 'var(--color-success-text)',
        },

        warning: {
          bg: 'var(--color-warning-bg)',
          fg: 'var(--color-warning-fg)',
          text: 'var(--color-warning-text)',
        },

        danger: {
          bg: 'var(--color-danger-bg)',
          fg: 'var(--color-danger-fg)',
          text: 'var(--color-danger-text)',
        },

        info: {
          bg: 'var(--color-info-bg)',
          fg: 'var(--color-info-fg)',
          text: 'var(--color-info-text)',
        },
      },
    },
  },

  plugins: [],
};

export default config;
