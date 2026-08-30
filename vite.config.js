import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
  ],

  base:
    mode === "github"
      ? "/Portfoio/"
      : "/",

  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
  },
}));