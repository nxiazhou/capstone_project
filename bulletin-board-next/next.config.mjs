/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

    // ✅ 添加允许加载外部图片的域名
  images: {
    domains: ['dddd-platform.oss-ap-southeast-1.aliyuncs.com'], // 替换为你自己的 OSS 域名
  },
  
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "http://8.218.1.107:8081/api/auth/:path*",
      },
      {
        source: "/api/payments/:path*",
        destination: "http://8.218.1.107:8085/api/payments/:path*",
      },
      {
        // ✅ 新增：代理 admin 接口
        source: "/api/admin/:path*",
        destination: "http://8.218.1.107:8081/api/admin/:path*",
      },
      {
        source: '/api/schedules/:path*',
        destination: 'http://8.218.1.107:8087/api/schedules/:path*',
      },
      {
        source: '/api/files/:path*',
        destination: 'http://8.218.1.107:8083/api/files/:path*' // 真实服务地址
      }
    ];
  },
};

export default nextConfig;