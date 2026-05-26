import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons.svg'],
      manifest: {
        name: 'Kinesia Relief',
        short_name: 'Kinesia',
        description: 'Massothérapie · Kinésithérapie — Comprendre ta douleur et retrouver ton équilibre.',
        theme_color: '#1a4a3a',
        background_color: '#1a4a3a',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        lang: 'fr',
        icons: [
          {
            src: '/pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        cacheId: 'kinesia-v10',
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        // Exclure les images exercises du precache — elles seront toujours récupérées en réseau
        globPatterns: ['**/*.{css,html,ico,png,svg,woff2}'],
        globIgnores: ['exercises/**'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          },
          {
            // Bundle JS principal : réseau d'abord, cache en fallback — mise à jour auto
            urlPattern: /\.js$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'js-bundle-cache',
              expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 * 7 }
            }
          },
          {
            // Images exercises : toujours réseau, jamais mis en cache
            urlPattern: ({ url }) => url.pathname.startsWith('/exercises/'),
            handler: 'NetworkOnly',
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
})
