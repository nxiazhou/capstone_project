/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "http://8.210.165.181:8081/api/auth/:path*",
      },
      {
        source: "/api/payments/:path*",
        destination: "http://8.210.165.181:8085/api/payments/:path*",
      },
    ];
  },
};

export default nextConfig;