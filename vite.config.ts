import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3006,
    host: true,
    open: true,
  },
  preview: {
    port: 3006,
    host: true,
  },
  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  // Source map configuration
  build: {
    sourcemap: true,
  },
  // Development source map configuration
  css: {
    devSourcemap: true,
  },
});
