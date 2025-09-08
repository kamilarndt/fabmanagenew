import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({ filename: 'dist/stats.html', gzipSize: true, brotliSize: true, open: false }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png}'], maximumFileSizeToCacheInBytes: 6 * 1024 * 1024 },
      devOptions: { enabled: false },
      srcDir: 'src',
      filename: 'pwa-sw.ts'
    })
  ],
  optimizeDeps: {
    include: [
      'react-big-calendar',
      'react-big-calendar/lib/addons/dragAndDrop',
      'date-fns',
      'date-fns/locale',
      'date-fns/locale/pl'
    ]
  },
  server: {
    headers: {
      'Cache-Control': 'no-store'
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/files': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
})
