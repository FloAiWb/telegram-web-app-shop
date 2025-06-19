/** @type {import('vite').UserConfig} */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";          // ✨ добавляем

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {                             // ✨ новый блок
    alias: {
      "@": resolve(__dirname, "src")     // теперь @/ указывает на каталог src
    }
  },
  server: {
    open: false,
    port: 3000
  },
  build: {
    minify: "terser"
  }
});
