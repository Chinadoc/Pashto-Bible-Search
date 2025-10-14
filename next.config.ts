import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP']
  },
  // Optimize for large JSON files
  images: {
    unoptimized: true,
  },
  // Handle large static files
  staticPageGenerationTimeout: 1000,
  webpack: (config, { isServer }) => {
    // Ensure TS path alias `@/*` resolves at runtime during webpack bundling
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias["@"] = path.resolve(__dirname);

    // Optimize for large JSON files in production
    if (isServer) {
      // Increase memory limit for server-side builds
      config.performance = config.performance || {};
      config.performance.maxAssetSize = 20 * 1024 * 1024; // 20MB
    }

    return config;
  },
};

export default nextConfig;
