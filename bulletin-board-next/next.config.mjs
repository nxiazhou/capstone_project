/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://8.210.165.181:8081/api/:path*",
      },
    ];
  },
};

export default nextConfig;