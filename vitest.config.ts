import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Vitest configuration for Next.js
 * 
 * This config is separate from Next.js and optimized for testing.
 * It uses jsdom for browser environment simulation.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    css: true,
    clearMocks: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'app/**/*.{test,spec}.{ts,tsx}'],
    environmentOptions: {
      jsdom: {
        url: 'http://localhost',
      },
    },
    // Mock Next.js specific modules
    alias: {
      '@/': path.resolve(__dirname, './src/'),
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

