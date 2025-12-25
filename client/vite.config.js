import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://selfless-renewal-production-793e.up.railway.app/', // your backend API
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
