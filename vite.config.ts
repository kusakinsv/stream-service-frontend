import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {

    plugins: [react()],
    define: {
      "import.meta.env.PROXY_URL": process.env.VITE_CORE_URL,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src/"),
      },
    },
    server: {
      port: 5100,
      host: "0.0.0.0",
      proxy: {
        "/search-service/api/v1": {
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/search-service/, ""),
          target: env.VITE_SEARCHER_URL || "http://localhost:8102",
        },
        "/stream-service/api/v1": {
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/stream-service/, ""),
          target: env.VITE_CORE_URL || "http://localhost:8101",
        },
      },
    },
  };
});
