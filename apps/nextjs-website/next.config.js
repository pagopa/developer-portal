/** @type {import('next').NextConfig} */
/*
  Since version 13.1 of NextJS, it is possible to use the transpilePackages
  option within the configuration file instead of using external packages
  (as documented here: https://pagopa.atlassian.net/browse/MUI-141).

  NextJS reference: https://nextjs.org/docs/advanced-features/compiler#module-transpilation
 */
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
  webpack: (config, { isServer }) => {
    // Handle AWS SDK bundling issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Optimize AWS SDK modules
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push({
        '@aws-sdk/client-dynamodb': 'commonjs @aws-sdk/client-dynamodb',
        '@aws-sdk/credential-providers': 'commonjs @aws-sdk/credential-providers',
      });
    }
    
    return config;
  },
};

// eslint-disable-next-line
module.exports = nextConfig;
