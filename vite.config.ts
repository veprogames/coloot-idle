import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from "vite-plugin-pwa"

// https://vitejs.dev/config/
export default defineConfig({
  base: '/coloot-idle/',
  plugins: [
    svelte(),
    // Source: https://adueck.github.io/blog/caching-everything-for-totally-offline-pwa-vite-react/
    VitePWA({
      // cache everything for offline capability
      workbox: {
        globPatterns: ["**/*"],
      },
      includeAssets: ["**/*"],
      manifest: {
        "name": "Coloot - Idle Loot Collector",
        "short_name": "Coloot",
        "theme_color": "#88cc00",
        "background_color": "#303030",
        "display": "fullScreen",
        "scope": "/coloot-idle",
        "start_url": "/coloot-idle",
        "icons": [
          {
            "src": "/coloot-idle/logo.png",
            "sizes": "any",
            "type": "image/png"
          }
        ]
      }
    }),
  ],
})
