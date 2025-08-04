import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  typescript: {
    ignoreBuildErrors: true, // Only for development, remove in production
  },
  eslint: {
    ignoreDuringBuilds: true, // Only for development, remove in production
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Removed the '/' redirect to fix the 404 error
  async redirects() {
    return []; // No redirects (or add valid ones)
  },
};

export default nextConfig;
