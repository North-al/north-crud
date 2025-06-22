import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@core': fileURLToPath(new URL('../crud-core/src', import.meta.url)),
            '@el': fileURLToPath(new URL('../crud-element-plus/src', import.meta.url))
        }
    },
    plugins: [vue()]
})
