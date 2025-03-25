import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    exclude: ["crypto"],
    include: ["vue", "vue-router"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      crypto: "crypto-js",
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
});
