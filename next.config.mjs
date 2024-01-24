/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/',
        permanent: false,
      },
    ]
  },
  images: {
    domains: ['cdn.akamai.steamstatic.com'],
  },
};

export default nextConfig;