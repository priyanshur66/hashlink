/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['hashconnect'],
  webpack: (config) => {
    // Fallback for native ws dependencies to prevent build errors
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      bufferutil: false,
      'utf-8-validate': false
    };
    return config;
  },
  // Add this section
  experimental: {
    serverComponentsExternalPackages: ['hashconnect']
  }
};

export default nextConfig;