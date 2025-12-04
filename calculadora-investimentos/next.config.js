/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração otimizada para Vercel
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;