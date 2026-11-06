import path from "path";

const nextConfig = {
  env: {
    NEXT_PUBLIC_CLOUDFLARE_WORKER_URL: process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL,
  },
  experimental: {
    webVitalsAttribution: ["CLS", "LCP"],
  },
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

    // Fallbacks for node modules that don't work in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    return config;
  },
};

export default nextConfig;
