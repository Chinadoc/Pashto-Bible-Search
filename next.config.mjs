import path from "path";

const nextConfig = {
  env: {
    NEXT_PUBLIC_CLOUDFLARE_WORKER_URL: process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL,
  },
  experimental: {
    webVitalsAttribution: ["CLS", "LCP"],
  },
  turbopack: {},
  images: {
    unoptimized: true,
  },
  staticPageGenerationTimeout: 1000,
  webpack: (config, { isServer }) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias["@"] = path.resolve(process.cwd());

    if (isServer) {
      config.performance = config.performance || {};
      config.performance.maxAssetSize = 20 * 1024 * 1024;
    }

    return config;
  },
};

export default nextConfig;
