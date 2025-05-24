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
      {
        // ✅ 新增：代理 admin 接口
        source: "/api/admin/:path*",
        destination: "http://8.210.165.181:8081/api/admin/:path*",
      },
      {
        source: '/api/schedules/:path*',
        destination: 'http://8.210.165.181:8087/api/schedules/:path*',
      },
      {
        source: '/api/files/:path*',
        destination: 'http://8.210.165.181:8083/api/files/:path*' // 真实服务地址
      }
    ];
  },
};

export default nextConfig;