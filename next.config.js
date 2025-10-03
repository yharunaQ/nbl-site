/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/docs/:path*', destination: 'https://files.nextbeinglab.org/:path*' },
    ];
  },
};
module.exports = nextConfig;