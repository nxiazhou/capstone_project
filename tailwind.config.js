/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js"  // ⬅️ 加上这行

  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')         // ⬅️ 加上这行
  ],
}

