import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable static exports for better Netlify compatibility
  output: 'export',
  trailingSlash: true,

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Configure basePath if deploying to a subdirectory
  // basePath: '/your-app-name',

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Experimental features
  experimental: {
    // Enable if using app directory
    appDir: true,
  },
};

export default nextConfig;
