import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import istanbul from 'vite-plugin-istanbul'

export default defineConfig({
  plugins: [
    react(),
    istanbul({
      include: 'src/*',
      exclude: ['node_modules', 'cypress/'],
      extension: ['.js', '.ts', '.jsx', '.tsx'],
      cypress: true,
    })],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
});