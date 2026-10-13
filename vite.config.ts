import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

const isTauri = !!process.env.TAURI_ENV_PLATFORM;

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    !isTauri &&
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: "auto",
        includeAssets: ["favicon.svg", "icons/apple-touch-icon.png"],
        manifest: {
          name: "Velora",
          short_name: "Velora",
          description: "رزرو آنلاین نوبت سالن زیبایی ولورا",
          lang: "fa",
          dir: "rtl",
          start_url: "/",
          scope: "/",
          display: "standalone",
          background_color: "#faf7ff",
          theme_color: "#faf7ff",
          icons: [
            { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
            { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
            { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
          navigateFallback: "/index.html",
        },
      }),
  ],
  envPrefix: ["VITE_", "TAURI_ENV_"],
  clearScreen: false,
  server: { port: 5173, strictPort: true },
});
