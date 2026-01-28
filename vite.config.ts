import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Use a sub-path in production so the app works on GitHub Pages.
  // If your repo name is different, change "gym_progress" below.
  base: mode === "development" ? "/" : "/gym_progress/",
  build: {
    // Output to "docs" so GitHub Pages can serve from main/docs
    outDir: "docs",
  },
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
