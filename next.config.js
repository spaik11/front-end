// TODO: Implement when we upgrade next
// const hasBundleAnalyzer = process.env.ANALYZE === 'true';
// const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: hasBundleAnalyzer });
// const withMDX = require('@next/mdx')({ extension: /\.mdx$/ });
// const { s3hostName } = require('./common/constants/urls');
// const svgoConfig = require('./common/config/svgo');

// const nextConfig = {
//   productionBrowserSourceMaps: false,

//   eslint: {
//     ignoreDuringBuilds: true, // We lint during CI.
//   },

//   images: {
//     domains: [s3hostName, 'user-images.githubusercontent.com'],
//   },

//   /** @see https://nextjs.org/docs/api-reference/next.config.js/rewrites */
//   async rewrites() {
//     return [
//       {
//         source: '/media',
//         destination: '/branding',
//       },
//       {
//         source: '/privacy',
//         destination: 'https://www.iubenda.com/privacy-policy/8174861',
//       },
//     ];
//   },

//   /** @see https://nextjs.org/docs/api-reference/next.config.js/redirects */
//   async redirects() {
//     return [
//       {
//         source: '/resources',
//         destination: '/resources/1',
//         permanent: true,
//       },
//       {
//         source: '/logout',
//         destination: '/login?loggedOut=true',
//         permanent: true,
//       },
//       {
//         source: '/who_we_serve',
//         destination: '/services',
//         permanent: true,
//       },
//       {
//         source: '/swag',
//         destination: 'https://operationcode.threadless.com/',
//         permanent: true,
//       },
//       {
//         source: '/store',
//         destination: 'https://operationcode.threadless.com/',
//         permanent: true,
//       },
//       {
//         source: '/shop',
//         destination: 'https://operationcode.threadless.com/',
//         permanent: true,
//       },
//     ];
//   },

//   /** @see https://nextjs.org/docs/api-reference/next.config.js/headers */
//   async headers() {
//     return [
//       {
//         source: '/_next/static/([^/]+/pages|chunks|runtime|css|fonts)/(.+)',
//         headers: [
//           {
//             key: 'cache-control',
//             value: 'max-age=31536000',
//           },
//         ],
//       },
//       {
//         source: '/(favicon.ico|robots.txt|manifest.json|humans.txt|sitemap.xml|sitemap.xsl)',
//         headers: [
//           {
//             key: 'Cache-Control',
//             value: 'public, max-age=0, must-revalidate',
//           },
//         ],
//       },
//     ];
//   },

//   webpack: config => {
//     config.module.rules.push({
//       test: /\.svg$/,
//       use: [
//         {
//           loader: '@svgr/webpack',
//           options: {
//             svgoConfig,
//           },
//         },
//       ],
//     });

//     // Add polyfills
//     const originalEntry = config.entry;

//     // eslint-disable-next-line no-param-reassign
//     config.entry = async () => {
//       const entries = await originalEntry();

//       if (entries['main.js'] && !entries['main.js'].includes('./polyfills.js')) {
//         entries['main.js'].unshift('./polyfills.js');
//       }

//       return entries;
//     };

//     return config;
//   },
// };

// module.exports = withBundleAnalyzer(withMDX(nextConfig));

const hasBundleAnalyzer = process.env.ANALYZE === 'true';
const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: hasBundleAnalyzer });
const withMDX = require('@next/mdx')({ extension: /\.mdx$/ });
const svgoConfig = require('./common/config/svgo');
const { s3hostName } = require('./common/constants/urls');

const nextConfig = withBundleAnalyzer({
  productionBrowserSourceMaps: true,

  images: {
    domains: [s3hostName, 'user-images.githubusercontent.com'],
  },

  experimental: {
    scrollRestoration: false, // see: https://github.com/OperationCode/front-end/pull/1280
  },

  /** @see https://nextjs.org/docs/api-reference/next.config.js/rewrites */
  async rewrites() {
    return [
      {
        source: '/media',
        destination: '/branding',
      },
      {
        source: '/privacy',
        destination: 'https://www.iubenda.com/privacy-policy/8174861',
      },
    ];
  },

  /** @see https://nextjs.org/docs/api-reference/next.config.js/redirects */
  async redirects() {
    return [
      {
        source: '/resources',
        destination: '/resources/1',
        permanent: true,
      },
      {
        source: '/logout',
        destination: '/login?loggedOut=true',
        permanent: true,
      },
      {
        source: '/who_we_serve',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/swag',
        destination: 'https://operationcode.threadless.com/',
        permanent: true,
      },
      {
        source: '/store',
        destination: 'https://operationcode.threadless.com/',
        permanent: true,
      },
      {
        source: '/shop',
        destination: 'https://operationcode.threadless.com/',
        permanent: true,
      },
    ];
  },

  /** @see https://nextjs.org/docs/api-reference/next.config.js/headers */
  async headers() {
    return [
      {
        source: '/_next/static/([^/]+/pages|chunks|runtime|css|fonts)/(.+)',
        headers: [
          {
            key: 'cache-control',
            value: 'max-age=31536000',
          },
        ],
      },
      {
        source: '/(favicon.ico|robots.txt|manifest.json|humans.txt|sitemap.xml|sitemap.xsl)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },

  webpack: config => {
    // Fixes npm packages that depend on `fs` module
    // eslint-disable-next-line no-param-reassign
    config.node = { fs: 'empty' };

    config.module.rules.push(
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgoConfig,
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              fallback: {
                loader: 'file-loader',
                options: {
                  publicPath: '/_next/static/images',
                  outputPath: 'static/images',
                },
              },
              publicPath: '/_next/',
              outputPath: 'static/images/',
              name: '[name]-[hash].[ext]',
            },
          },
        ],
      },
    );

    // Add polyfills
    const originalEntry = config.entry;

    // eslint-disable-next-line no-param-reassign
    config.entry = async () => {
      const entries = await originalEntry();

      if (entries['main.js'] && !entries['main.js'].includes('./polyfills.js')) {
        entries['main.js'].unshift('./polyfills.js');
      }

      return entries;
    };

    return config;
  },
});

module.exports = withMDX(nextConfig);
