import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removido output: "standalone" para deploy na Vercel
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
