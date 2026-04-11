// Auto-incremented on each build via timestamp
export const APP_VERSION = `1.0.${Math.floor(Date.now() / 86400000) - 20000}`;
export const BUILD_DATE = new Date().toLocaleDateString("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
