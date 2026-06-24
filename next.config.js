const path = require('node:path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude large non-runtime assets from serverless function bundles (Vercel 250MB limit)
  outputFileTracingExcludes: {
    '*': [
      // UI-only packages not needed in server functions
      'node_modules/lucide-react/**',
      'node_modules/@img/**',
      'node_modules/sharp/**',
      // Large local data/content directories
      'data/**',
      'content-inbox/**',
      'references/**',
      'docs/**',
      'public/**',
      'scripts/**',
      '__tests__/**',
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
      { source: '/for-enterprise', destination: '/work-design-views-guide', permanent: true },
      { source: '/docs/:path*', destination: '/site-update/docs', permanent: false },
      { source: '/jac-foundations', destination: '/theory-method-trust', permanent: true },
      { source: '/what-we-do', destination: '/about-boundary', permanent: true },
      { source: '/knowledge', destination: '/theory-method-trust', permanent: true },
      { source: '/knowledge/network', destination: '/theory-method-trust', permanent: true },
      { source: '/knowledge/practice', destination: '/work-design-views-guide', permanent: true },
      { source: '/guide', destination: '/work-design-views-guide', permanent: true },
      { source: '/guide/download', destination: '/work-design-views-guide', permanent: true },
      { source: '/jac', destination: '/case-readings', permanent: true },
      { source: '/jac/intro', destination: '/case-readings', permanent: true },
      { source: '/jac/next', destination: '/case-readings', permanent: true },
      { source: '/jac/guide', destination: '/work-design-views-guide', permanent: true },
      { source: '/jac/frames', destination: '/work-design-views-guide', permanent: true },
      { source: '/jac/guidebook', destination: '/work-design-views-guide', permanent: true },
      { source: '/jac/guidebook/success', destination: '/work-design-views-guide', permanent: true },
      { source: '/resources/disability-work-design', destination: '/work-condition-window', permanent: true },
      { source: '/resources/work-design-foundations', destination: '/theory-method-trust', permanent: true },
      { source: '/resources/invisible-disability', destination: '/articles-social-questions', permanent: true },
      { source: '/resources/work-support-transformation', destination: '/work-design-views-guide', permanent: true },
      { source: '/organizations/design', destination: '/work-design-views-guide', permanent: true },
      { source: '/organizations', destination: '/work-condition-window', permanent: true },
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
