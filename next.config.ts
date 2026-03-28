import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // 🔹 აქტიურობს React-ის strict mode
  images: {
    domains: ["res.cloudinary.com"], // 🔹 Cloudinary hostname
  },
};

export default nextConfig;
