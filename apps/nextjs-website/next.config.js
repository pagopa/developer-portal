/** @type {import('next').NextConfig} */
/*
  Since version 13.1 of NextJS, it is possible to use the transpilePackages
  option within the configuration file instead of using external packages
  (as documented here: https://pagopa.atlassian.net/browse/MUI-141).

  NextJS reference: https://nextjs.org/docs/advanced-features/compiler#module-transpilation
 */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
};

module.exports = nextConfig;
