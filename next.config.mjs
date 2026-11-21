/** @type {import('next').NextConfig} */
const nextConfig = {
  // Engine legacy memasang listener global & merender #app sekali;
  // double-mount StrictMode membuat listener ganda, jadi dimatikan.
  reactStrictMode: false,
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true },
  async redirects() {
    // URL lama tetap jalan.
    return [{ source: '/cms', destination: '/admin', permanent: true }];
  },
};

export default nextConfig;
