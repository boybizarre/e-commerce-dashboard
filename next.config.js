/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    // swcPlugins: [['next-superjson-plugin', {}]],
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],

    // domains: [
    //   // 'res.cloudinary.com',
    //   // 'avatars.githubusercontent.com',
    //   'lh3.googleusercontent.com',
    //   'utfs.io',
    // ],
  },
};

module.exports = nextConfig;
