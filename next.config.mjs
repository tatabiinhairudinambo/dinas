/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true },
  async redirects() {
    return [{ source: '/cms', destination: '/admin', permanent: true }];
  },
};

export default nextConfig;
