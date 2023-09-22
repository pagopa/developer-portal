/** @type {import('next').NextConfig} */
/*
  Since version 13.1 of NextJS, it is possible to use the transpilePackages
  option within the configuration file instead of using external packages
  (as documented here: https://pagopa.atlassian.net/browse/MUI-141).

  NextJS reference: https://nextjs.org/docs/advanced-features/compiler#module-transpilation
 */
const nextConfig = {
  reactStrictMode: true,
  // TODO: Remove output: 'export' see the doc:
  // https://nextjs.org/docs/messages/export-no-custom-routes
  // output: 'export',
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
  async rewrites() {
    return [
      {
        source: '/:product/tutorial/:slug*',
        destination: '/:product/tutorials/:slug*',
      },
      {
        source: '/:product/manuali/:slug*',
        destination: '/:product/guides/:slug*',
      },
    ];
  },
};

module.exports = nextConfig;
