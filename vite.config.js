import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // When running `vercel dev` on port 3000 alongside `vite`, API calls are proxied.
    proxy: { '/api': 'http://localhost:3000' },
  },
});
