import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";     // ← добавьте

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src") // ← @ указывает на каталог src
    }
  }
});
