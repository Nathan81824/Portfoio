import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
base: process.env.VERCEL ? "/" : "/Portfoio/",

plugins: [
react(),


VitePWA({
  registerType: "autoUpdate",

  manifest: {
    name: "Nathan — Frontend Developer",
    short_name: "Nathan",
    description:
      "Nathan — Frontend Developer creating responsive, interactive and modern digital experiences.",
    theme_color: "#090909",
    background_color: "#090909",
    display: "standalone",
    start_url: "/",
    scope: "/",

    icons: [
      {
        src: "logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
}),


],
});
