import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';
import path from 'path';

const nextConfig: NextConfig = {
  /* Next.js config options here */
  reactStrictMode: true,
  
  // Turbopack configuration for Next.js 16
  turbopack: {
    resolveAlias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@contexts': path.resolve(__dirname, 'src/contexts'),
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@types': path.resolve(__dirname, 'src/types'),
    },
  },
  
  // Experimental features
  experimental: {
    // Enable server actions if needed
    // serverActions: true,
  },
};

// Use the proper @next/bundle-analyzer wrapper pattern
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
