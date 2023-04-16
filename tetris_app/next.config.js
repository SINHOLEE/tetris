/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  reactStrictMode: true,
  compiler: {
    emotion: {
      autoLabel: 'dev-only',
    },
  },
};

module.exports = nextConfig;
