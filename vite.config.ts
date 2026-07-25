import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const getEnv = (key: string, fallback: string) => {
  return process.env[key] || fallback;
};

export default defineConfig({

  plugins: [react()],
  envDir: "./", // явно указываем папку с .env файлами
  define: {
    "import.meta.env.PROXY_URL": JSON.stringify(process.env.VITE_CORE_URL),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/"),
    },
  },
  server: {
    host: "0.0.0.0",
    proxy: {
      '/core': {
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/stream-service/, ""),
        target: getEnv("VITE_CORE_URL", "http://localhost:8101"),
        // rewrite: (path) => path.replace(/^\/core/, ''),
        // target: "http://localhost:8101",
      },
      '/internet-searcher': {
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/stream-service/, ""),
        target: getEnv("VITE_SEARCHER_URL", "http://localhost:8102"),
      },
    },
  },
});
