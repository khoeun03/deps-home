import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
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
