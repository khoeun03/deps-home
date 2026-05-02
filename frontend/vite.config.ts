import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles" as *;`,
      },
    },
  },
  server:
    mode === 'development'
      ? {
          proxy: {
            '/api': {
              target: 'http://api:3000',
              rewrite: (path) => path.replace(/^\/api/, ''),
            },
          },
        }
      : undefined,
}));
