import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import legacy from '@vitejs/plugin-legacy'
import path from 'path'

const backendPrefixes = [
    '/doLogin', '/logout', '/verifyCode',
    '/hr', '/employee', '/system', '/salary', '/personnel'
]
const proxy = {}
backendPrefixes.forEach(p => {
    proxy[p] = { target: 'http://localhost:8081', changeOrigin: true }
})

export default defineConfig({
    plugins: [
        vue(),
        legacy({
            targets: ['defaults', 'ie >= 11', 'chrome >= 49'],
            additionalLegacyPolyfills: ['regenerator-runtime/runtime']
        })
    ],
    resolve: {
        alias: { '@': path.resolve(__dirname, 'src') }
    },
    server: {
        host: 'localhost',
        port: 8088,
        strictPort: true,
        proxy
    },
    build: { outDir: 'dist' }
})
