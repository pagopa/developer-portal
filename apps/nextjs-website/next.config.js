const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
  serverExternalPackages: ['jsdom', 'isomorphic-dompurify'],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

// eslint-disable-next-line
module.exports = withNextIntl(nextConfig);
