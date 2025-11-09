// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
// vite.config.js
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/api/, '/elec/api')
      },
      // XÓA 2 DÒNG NÀY:
      // '/oauth2': { target: 'http://localhost:8080', changeOrigin: true, secure: false },
      // '/login/oauth2': { target: 'http://localhost:8080', changeOrigin: true, secure: false },
    },
    historyApiFallback: true, // BÂY GIỜ HOẠT ĐỘNG!
  }
})
