import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

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
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
