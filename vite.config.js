import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/sky_bird/', // Use repo name base for GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Optimize build
    minify: 'terser',
    sourcemap: false,
  },
  server: {
    port: 5173,
    open: true,
  },
})
