/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" }
        ],
      },
    ];
  },
  async rewrites() {
    return [
      { source: '/docs/:path*', destination: 'https://files.nextbeinglab.org/:path*' },
      { source: '/blog/:path*', destination: 'https://blog.nextbeinglab.org/:path*' },
    ];
  },
  images: { formats: ['image/avif', 'image/webp'] },
};
module.exports = nextConfig;