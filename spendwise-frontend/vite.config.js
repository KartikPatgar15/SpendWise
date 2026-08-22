import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Vite plugin to generate static route fallbacks and 404/200 SPA handlers for production hosting
function spaFallbackPlugin() {
  const routes = ["splitter", "notes", "analytics", "recurring", "goals", "ai", "ai-insights"];
  return {
    name: "spa-fallback-plugin",
    closeBundle() {
      const distDir = path.resolve(__dirname, "dist");
      const indexHtmlPath = path.join(distDir, "index.html");

      if (!fs.existsSync(indexHtmlPath)) return;

      const indexHtml = fs.readFileSync(indexHtmlPath, "utf-8");

      // 1. Create 404.html and 200.html fallbacks
      fs.writeFileSync(path.join(distDir, "404.html"), indexHtml);
      fs.writeFileSync(path.join(distDir, "200.html"), indexHtml);

      // 2. Create direct route directories with index.html for direct URL/refresh compatibility
      for (const route of routes) {
        const routeDir = path.join(distDir, route);
        if (!fs.existsSync(routeDir)) {
          fs.mkdirSync(routeDir, { recursive: true });
        }
        fs.writeFileSync(path.join(routeDir, "index.html"), indexHtml);
      }
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({
      presets: [reactCompilerPreset()]
    }),
    spaFallbackPlugin()
  ]
});