import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_CLOUDFLARE_WORKER_URL: process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL,
  },
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP']
  },
  turbopack: {},
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
    config.resolve.alias["@/app"] = path.resolve(__dirname, "app");
    config.resolve.alias["@/app/lib"] = path.resolve(__dirname, "app/lib");
    config.resolve.alias["@/app/utils"] = path.resolve(__dirname, "app/utils");

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
