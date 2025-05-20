const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",  // ✅ 改为你本地前端运行地址
    supportFile: "cypress/support/e2e.js",  // 默认支持文件路径
  },
});
