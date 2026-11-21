/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true },
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/src/lib/:path*', destination: '/_raw/src/lib/:path*' },
        { source: '/src/components/:path*', destination: '/_raw/src/components/:path*' },
      ],
    };
  },
  async redirects() {
    return [{ source: '/cms', destination: '/admin', permanent: true }];
  },
};

export default nextConfig;
