import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
base: "/Portfoio/",

plugins: [
react(),


VitePWA({
  registerType: "autoUpdate",

  includeAssets: [
    "favicon.ico",
    "robots.txt",
  ],

  manifest: {
    name: "Portfolio",
    short_name: "Portfolio",
    description: "Portfolio website with an offline game",
    theme_color: "#FFB703",
    background_color: "#14213D",
    display: "standalone",
    start_url: "/Portfoio/",
    scope: "/Portfoio/",
  },

  workbox: {
    globPatterns: [
      "**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,mp3,woff,woff2,ttf}",
    ],

    navigateFallback: "/Portfoio/index.html",

    navigateFallbackDenylist: [
      /^\/Portfoio\/api\//,
    ],

    cleanupOutdatedCaches: true,

    clientsClaim: true,

    skipWaiting: true,
  },
}),


],

build: {
outDir: "dist",
assetsDir: "assets",
sourcemap: false,
},
});
