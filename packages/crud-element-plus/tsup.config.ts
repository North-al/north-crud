import { defineConfig } from 'tsup'
import vue from 'unplugin-vue/esbuild'

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    // dts: true, ⛔ 禁用，让 vue-tsc 负责生成类型
    sourcemap: true,
    clean: true,
    target: 'esnext',
    esbuildPlugins: [vue()],
    loader: {
        '.vue': 'ts'
    }
})
