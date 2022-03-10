import vue from '@vitejs/plugin-vue'
import {defineConfig} from 'vite'
import {VitePWA} from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      strategies: 'generateSW',
      injectRegister: 'inline',
      includeAssets: ['./img/icons/favicon.ico', 'robots.txt', './img/icons/apple-touch-icon.png'],
      manifest: {
        name: 'Mahjong scoreboard',
        short_name: 'MJ scoreboard',
        description: 'Mahjong scoreboard MCR rules',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: './img/icons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: './img/icons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    port: 9000
  },
  base: './',
  define: {
    __VUE_I18N_FULL_INSTALL__: false,
    __VUE_I18N_LEGACY_API__: false,
    __VUE_I18N_PROD_DEVTOOLS__: false,
    __VUE_OPTIONS_API__: false
  }
})
