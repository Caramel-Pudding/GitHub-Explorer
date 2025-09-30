import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable strict mode for better development experience
  reactStrictMode: true,
  // Optimize images if any are added in the future
  images: {
    formats: ["image/webp", "image/avif"],
  },
};

export default nextConfig;
