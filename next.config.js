/** @type {import('next').NextConfig} */

// WebContainer polyfill for SWC compatibility
if (typeof process !== 'undefined') {
  if (process.stdout && process.stdout._handle && !process.stdout._handle.setBlocking) {
    process.stdout._handle.setBlocking = () => {};
  }
  if (process.stderr && process.stderr._handle && !process.stderr._handle.setBlocking) {
    process.stderr._handle.setBlocking = () => {};
  }
}

const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable SWC minification for WebContainer compatibility
  swcMinify: false,
  // Exclude types directory from build
  webpack: (config) => {
    config.watchOptions = {
      ignored: ['**/types/**'],
    };
    return config;
  },
}

module.exports = nextConfig
