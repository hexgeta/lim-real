/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

module.exports = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: '(?!www\\.).*',
          },
        ],
        destination: 'https://www.lookintomaxi.com/:path*',
        permanent: true,
      },
      {
        source: '/:path((?!api/).*)',
        has: [
          {
            type: 'query',
            key: '(.*)',
            value: '(.*)',
          },
        ],
        destination: '/:path*/:key*=:value*',
        permanent: true,
      },
      {
        source: '/:path(.*)',
        destination: '/:path*',
        permanent: true,
        has: [
          {
            type: 'header',
            key: 'x-forwarded-host',
          },
        ],
        missing: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'https',
          },
        ],
      },
      {
        source: '/:path(.*)',
        destination: '/:path*/",
        permanent: true,
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'https',
          },
        ],
      },
    ]
  },
}