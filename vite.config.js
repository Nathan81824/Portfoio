import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(() => {
  const isGitHubPages =
    process.env.GITHUB_PAGES === "true";

  const base = isGitHubPages
    ? "/Portfoio/"
    : "/";

  return {
    base,

    plugins: [
      react(),

      VitePWA({
        registerType: "autoUpdate",

        includeAssets: [
          "favicon.ico",
          "logo.png",
          "robots.txt",
        ],

        manifest: {
          name: "Nathan — Frontend Developer",

          short_name: "Nathan",

          description:
            "Nathan — Frontend Developer creating responsive, interactive and modern digital experiences.",

          theme_color: "#090909",

          background_color: "#090909",

          display: "standalone",

          start_url: base,

          scope: base,

          icons: [
            {
              src: `${base}logo.png`,
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: `${base}logo.png`,
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },

        workbox: {
          maximumFileSizeToCacheInBytes:
            10 * 1024 * 1024,

          navigateFallback:
            `${base}index.html`,

          navigateFallbackDenylist: [
            /^\/Portfoio\/api/,
          ],

          globPatterns: [
            "**/*.{js,css,html,ico,png,jpg,jpeg,svg,gif,webp,woff,woff2,ttf,otf,mp3,mp4,webm,wav}"
          ],

          runtimeCaching: [
            {
              urlPattern: ({ request }) =>
                request.destination === "image",

              handler: "CacheFirst",

              options: {
                cacheName: "portfolio-images",

                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds:
                    60 * 60 * 24 * 30,
                },

                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },

            {
              urlPattern: ({ request }) =>
                request.destination === "video",

              handler: "CacheFirst",

              options: {
                cacheName: "portfolio-videos",

                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds:
                    60 * 60 * 24 * 30,
                },

                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },

            {
              urlPattern: ({ request }) =>
                request.destination === "audio",

              handler: "CacheFirst",

              options: {
                cacheName: "portfolio-audio",

                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds:
                    60 * 60 * 24 * 30,
                },

                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },

            {
              urlPattern: ({ request }) =>
                request.destination === "font",

              handler: "CacheFirst",

              options: {
                cacheName: "portfolio-fonts",

                expiration: {
                  maxEntries: 30,
                  maxAgeSeconds:
                    60 * 60 * 24 * 365,
                },

                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
      }),
    ],

    build: {
      chunkSizeWarningLimit: 1000,
    },
  };
});