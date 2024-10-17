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
        source: '/HEXCharts',
        destination: '/hex-charts',
        permanent: true,
      },
      {
        source: '/DeltaDiscounts',
        destination: '/delta-discounts',
        permanent: true,
      },
      {
        source: '/Btc-Eth-Hex',
        destination: '/btc-eth-hex',
        permanent: true,
      },
      // Add a catch-all redirect to prevent potential loops
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'app.lookintomaxi.com',
          },
        ],
        destination: 'https://app.lookintomaxi.com/:path*',
        permanent: true,
      },
    ]
  },
};

module.exports = nextConfig;
