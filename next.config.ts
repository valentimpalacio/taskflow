import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: ['172.19.208.1'],
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Ensure WebSocket works properly
      config.resolve.alias['ws'] = require.resolve('ws');
      
      // Fix for WebSocket connection issues
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          net: false,
          tls: false,
          fs: false,
        };
      }
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
