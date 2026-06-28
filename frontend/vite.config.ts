import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const backendPrefixes = [
  '/doLogin', '/logout', '/verifyCode',
  '/hr', '/employee', '/system', '/salary', '/personnel', '/api'
]

const proxy: Record<string, object> = {}
backendPrefixes.forEach((prefix) => {
  proxy[prefix] = { target: 'http://localhost:8081', changeOrigin: true }
})

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: 'localhost',
    port: 3000,
    strictPort: true,
    proxy,
  },
  build: {
    outDir: 'dist',
  },
})
