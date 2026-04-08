const path = require('node:path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude UI-only packages from serverless function bundles (Vercel 250MB limit)
  outputFileTracingExcludes: {
    '*': [
      'node_modules/lucide-react/**',
      'node_modules/@img/**',
      'node_modules/sharp/**',
    ],
  },
  // Allow local cross-origin dev access (e.g. 127.0.0.1 -> localhost for /_next/* assets)
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  turbopack: {
    root: path.resolve(__dirname),
  },
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
  async redirects() {
    return [
      { source: '/for-enterprise', destination: '/organizations', permanent: true },
      { source: '/docs/:path*', destination: '/site-update/docs', permanent: false },
    ];
  },
  async rewrites() {
    return [
      { source: '/blog/:path*', destination: 'https://blog.nextbeinglab.org/:path*' },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    localPatterns: [
      {
        pathname: '**',
        search: '',
      },
      {
        pathname: '/jac-foundations/**',
      },
      {
        pathname: '/resources/invisible-disability/**',
      },
      {
        pathname: '/resources/work-support-transformation/**',
      },
      {
        pathname: '/review/invisible-disability/**',
      },
      {
        pathname: '/resources/disability-work-design/**',
      },
      {
        pathname: '/about/**',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
    ],
  },
};
module.exports = nextConfig;
