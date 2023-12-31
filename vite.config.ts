import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'Nombre de tu aplicación',
        short_name: 'Nombre corto',
        theme_color: '#ffffff',
        icons: [
        ],
      },
    }),
  
  ],
})
