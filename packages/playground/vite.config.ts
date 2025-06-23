import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vite.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@core': fileURLToPath(new URL('../crud-core/src', import.meta.url)),
            '@el': fileURLToPath(new URL('../crud-element-plus/src', import.meta.url))
        }
    },
    plugins: [vue(), vueJsx()]
})
