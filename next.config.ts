import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* Next.js config options here */
  reactStrictMode: true,
  
  // Experimental features
  experimental: {
    // Enable server actions if needed
    // serverActions: true,
  },
};

// Use the proper @next/bundle-analyzer wrapper pattern
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
