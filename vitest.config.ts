import { defineConfig } from 'vitest/config';
import path from 'path';

/**
 * Vitest configuration for Next.js
 * 
 * This config is separate from Next.js and optimized for testing.
 * It uses jsdom for browser environment simulation.
 * Note: @vitejs/plugin-react is NOT needed for Vitest tests.
 */
export default defineConfig({
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
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

