import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: `https://facul-link-api.vercel.app/api`,
        changeOrigin: true,
        secure: false, //extra added
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
