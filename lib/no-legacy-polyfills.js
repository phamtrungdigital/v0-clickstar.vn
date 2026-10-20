// Thay cho next/dist/build/polyfills/polyfill-module (xem turbopack.resolveAlias trong next.config.mjs).
// Tệp gốc vá Array.prototype.at/flat/flatMap, Object.fromEntries/hasOwn, String.trimStart/trimEnd, Promise.finally,
// URL.canParse cho trình duyệt cũ. Mọi trình duyệt Next 16 hỗ trợ (Chrome/Edge/Firefox 111+, Safari 16.4+) đều đã có sẵn,
// nên bỏ để không tải mã thừa (Lighthouse báo "JavaScript cũ").
export {}
