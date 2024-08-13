import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: `${import.meta.env.VITE_BACKENDURL}/api`,
        changeOrigin: true,
        secure: false, //extra added
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
