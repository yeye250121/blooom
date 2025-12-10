/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hvwgs4k77hcs8ntu.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'ktollehcctv.co',
      },
    ],
  },
};

module.exports = nextConfig;
