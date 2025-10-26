import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* Next.js config options here */
  reactStrictMode: true,
  
  // Enable bundle analyzer when ANALYZE=true
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        const { BundleAnalyzerPlugin } = require('@next/bundle-analyzer')();
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: '../analyze/client.html',
          })
        );
      }
      return config;
    },
  }),
  
  // Experimental features
  experimental: {
    // Enable server actions if needed
    // serverActions: true,
  },
};

export default nextConfig;

