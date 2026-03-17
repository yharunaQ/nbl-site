/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow local cross-origin dev access (e.g. 127.0.0.1 -> localhost for /_next/* assets)
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
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
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
    ],
  },
};
module.exports = nextConfig;
