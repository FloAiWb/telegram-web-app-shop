/**
 * Vite configuration
 * ------------------
 * • React-плагин ─ JSX, Fast Refresh  
 * • vite-tsconfig-paths ─ подхватывает пути из tsconfig.json  
 * • Алиас "@" → папка src  (важно для "@/i18n/ru" и других импортов)
 * • Сервер dev:  localhost:3000, без auto-open
 * • Прод-сборка: minify = "terser"
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),          // JSX + Fast Refresh
    tsconfigPaths()   // читает "paths" из tsconfig.json (не обязателен, но полезен)
  ],

  /** важно: чтобы импорты вида "@/..." работали в любом .ts/.tsx/.js */
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")     // теперь "@/i18n/ru" → src/i18n/ru.*
    }
  },

  server: {
    open: false,       // не открывать браузер автоматически
    port: 3000         // http://localhost:3000
  },

  build: {
    minify: "terser"   // более компактный бандл (можно убрать, если не нужно)
  }
});
