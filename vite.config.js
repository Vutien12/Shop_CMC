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
        rewrite: (p) => p.replace(/^\/api/, '/elec/api'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Add headers so backend trusts the request
            proxyReq.setHeader('Origin', 'http://localhost:8080');
            proxyReq.setHeader('Referer', 'http://localhost:8080/');

            // Log for debugging
            console.log('[Vite Proxy]', req.method, req.url, '→', proxyReq.path);
          });
        },
      },
      '/ws': {
        target: 'ws://localhost:8080/elec',
        ws: true,
        changeOrigin: true,
        secure: false
      },
    },
    historyApiFallback: true,
  }
})
