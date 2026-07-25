import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const getEnv = (key: string, fallback: string) => {
  return process.env[key] || fallback;
};

export default defineConfig({

  plugins: [react()],
  envDir: "./",
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
    port: 5173,
    proxy: {
      '/core': {
        changeOrigin: true,
        target: getEnv("VITE_CORE_URL", "http://localhost:8101"),
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      },
      '/internet-searcher': {
        changeOrigin: true,
        target: getEnv("VITE_SEARCHER_URL", "http://localhost:8102"),
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      },
    },
  },
});
