/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'localhost:5006', 'cloudflare.com', 'stanford.edu','http://202.51.83.166','https://202.51.83.166','kedc.edu.np','202.51.83.166'],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  basePath: '/dashboard',
};

export default nextConfig;
