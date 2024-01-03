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
        name: 'finnhub api Application',
        short_name: 'FinnhubApp',
        theme_color: "#4A90E2", 
        background_color: '#ffffff',
        icons: [
        ],
      },
    }),
  
  ],
})
