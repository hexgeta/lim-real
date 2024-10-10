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
        source: '/HEXCharts',
        destination: '/hexcharts',
        permanent: true,
      },
      {
        source: '/DeltaDiscounts',
        destination: '/deltadiscounts',
        permanent: true,
      },
      {
        source: '/Btc-Eth-Hex',
        destination: '/btc-eth-hex',
        permanent: true,
      },
      // Add more redirects as needed
    ]
  },
}