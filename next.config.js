/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-project.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  compress: true,
  productionBrowserSourceMaps: false,
  swcMinify: true,
  httpAgentOptions: {
    keepAlive: true,
  },
};

module.exports = nextConfig;
