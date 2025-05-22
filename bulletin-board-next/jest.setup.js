require('@testing-library/jest-dom');
// ✅ 全局 mock window.alert，避免 jsdom 报错
global.alert = jest.fn();