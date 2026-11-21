import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["exceljs/dist/exceljs.min.js"],
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3500',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:3500',
        changeOrigin: true,
      },
    },
  },
});
