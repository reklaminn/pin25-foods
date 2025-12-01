/** @type {import('next').NextConfig} */

// WebContainer ortamı için geçici çözüm (Polyfill)
if (process.stderr && process.stderr._handle && !process.stderr._handle.setBlocking) {
  process.stderr._handle.setBlocking = () => {};
}
if (process.stdout && process.stdout._handle && !process.stdout._handle.setBlocking) {
  process.stdout._handle.setBlocking = () => {};
}

const nextConfig = {
  reactStrictMode: true,
  // TypeScript ve ESLint hatalarını build sırasında yoksay
  typescript: {
    ignoreBuildErrors: true,
    tsconfigPath: './tsconfig.json'
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // SWC minification'ı devre dışı bırak (WebContainer uyumluluğu için)
  swcMinify: false,
  // Type generation ayarları
  experimental: {
    typedRoutes: false,
    // TypeScript tip dosyalarını .next/types içinde oluştur
    outputFileTracingRoot: undefined
  },
  // Deployment için gerekli ayarlar
  output: 'standalone',
  distDir: '.next'
}

module.exports = nextConfig
