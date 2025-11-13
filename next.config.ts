import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['ftp.goit.study', 'res.cloudinary.com', 'i.imgur.com'],
    remotePatterns: [{ protocol: 'https', hostname: 'ac.goit.global' }],
  },
};

export default nextConfig;
