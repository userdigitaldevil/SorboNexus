import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.VITE_API_URL": JSON.stringify(
      process.env.VITE_API_URL || "http://localhost:5001"
    ),
  },
  preview: {
    allowedHosts: [
      "sorbonexus-frontend.onrender.com",
      "sorbonexus.com",
      "www.sorbonexus.com",
      "sorbonexus-frontend-production-7763.up.railway.app",
    ],
    host: "0.0.0.0",
    port: process.env.PORT || 4173,
  },
  server: {
    host: "0.0.0.0",
    port: process.env.PORT || 5173,
    proxy: {
      "/api": "http://localhost:8080",
      "/uploads": "http://localhost:8080",
    },
  },
});
