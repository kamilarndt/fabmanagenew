import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
      open: false
    }),
    // VitePWA disabled in development to prevent caching issues
    ...(process.env.NODE_ENV === 'production' ? [VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png}'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024
      },
      devOptions: { enabled: false },
      srcDir: 'src',
      filename: 'pwa-sw.ts'
    })] : [])
  ],

  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: 'esbuild',

    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: (id) => {
          // React ecosystem
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor'
          }

          // Ant Design
          if (id.includes('antd') || id.includes('@ant-design')) {
            return 'antd-vendor'
          }

          // Calendar related
          if (id.includes('react-big-calendar') ||
            id.includes('date-fns') ||
            id.includes('dayjs') ||
            id.includes('@fullcalendar')) {
            return 'calendar-vendor'
          }

          // Form libraries
          if (id.includes('react-hook-form') ||
            id.includes('@hookform') ||
            id.includes('zod')) {
            return 'forms-vendor'
          }

          // HTTP clients
          if (id.includes('axios') ||
            id.includes('ky') ||
            id.includes('@supabase')) {
            return 'http-vendor'
          }

          // State management
          if (id.includes('zustand') ||
            id.includes('immer')) {
            return 'state-vendor'
          }

          // DnD
          if (id.includes('react-dnd') ||
            id.includes('@dnd-kit')) {
            return 'dnd-vendor'
          }

          // Utilities
          if (id.includes('lodash') ||
            id.includes('ramda') ||
            id.includes('uuid')) {
            return 'utils-vendor'
          }

          // Large individual libraries
          if (id.includes('monaco-editor')) {
            return 'monaco-vendor'
          }

          if (id.includes('three.js') || id.includes('three')) {
            return 'three-vendor'
          }

          // Speckle (3D viewer)
          if (id.includes('@speckle')) {
            return 'speckle-vendor'
          }

          // DXF libraries
          if (id.includes('dxf-parser') || id.includes('dxf-viewer')) {
            return 'dxf-vendor'
          }

          // React Router
          if (id.includes('react-router')) {
            return 'router-vendor'
          }

          // React Query
          if (id.includes('@tanstack/react-query')) {
            return 'query-vendor'
          }

          // React Window
          if (id.includes('react-window')) {
            return 'window-vendor'
          }

          // Frappe Gantt
          if (id.includes('frappe-gantt')) {
            return 'gantt-vendor'
          }

          // Puppeteer (dev only)
          if (id.includes('puppeteer')) {
            return 'puppeteer-vendor'
          }

          // Other node_modules
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },

        // Filename patterns for better caching
        chunkFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'vendor') {
            return 'assets/vendor-[hash].js'
          }
          if (chunkInfo.name?.includes('vendor')) {
            return `assets/${chunkInfo.name}-[hash].js`
          }
          return 'assets/[name]-[hash].js'
        },

        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/[name]-[hash].css'
          }
          return 'assets/[name]-[hash].[ext]'
        }
      }
    },

    // Chunk size warning limit
    chunkSizeWarningLimit: 500,

    // Enable sourcemaps for production debugging
    sourcemap: process.env.NODE_ENV === 'development'
  },

  optimizeDeps: {
    include: [
      // React ecosystem
      'react',
      'react-dom',
      'react-router-dom',

      // Ant Design core
      'antd',
      '@ant-design/icons',

      // Calendar dependencies
      'dayjs',
      '@fullcalendar/core',
      '@fullcalendar/react',

      // Form libraries
      'react-hook-form',
      '@hookform/resolvers',
      'zod',

      // State management
      'zustand',
      'zustand/middleware',

      // HTTP
      'axios',
      '@supabase/supabase-js',

      // DnD
      'react-dnd',
      'react-dnd-html5-backend',

      // Utilities
      'uuid',
      'date-fns',

      // React Query
      '@tanstack/react-query',

      // React Window
      'react-window',
      'react-window-infinite-loader'
    ],

    // Force certain dependencies to be pre-bundled
    force: true
  },

  server: {
    port: 5173,
    host: '0.0.0.0',
    headers: {
      'Cache-Control': 'no-store'
    },
    proxy: {
      '/api': {
        target: 'http://backend:3001',
        changeOrigin: true,
      },
      '/files': {
        target: 'http://backend:3001',
        changeOrigin: true,
      }
    }
  },

  resolve: {
    alias: {
    }
  },

  // Experimental features for better performance
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
  }
})