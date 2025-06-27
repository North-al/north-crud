import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import { readFileSync } from 'fs'

const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'))

export default defineConfig({
    // 路径别名
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },
    plugins: [
        vue(),
        dts({
            entryRoot: './src',
            outDir: resolve(__dirname, 'dist'),
            tsconfigPath: './tsconfig.json', // 指定使用的tsconfig.json
            insertTypesEntry: true
        })
    ],
    build: {
        // 构建为库模式
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'NorthCrudElementPlus',
            fileName: format => `index.${format === 'es' ? 'mjs' : format === 'cjs' ? 'cjs' : 'js'}`
        },
        sourcemap: true,
        emptyOutDir: true,
        target: 'es2020',
        // 外部化依赖
        rollupOptions: {
            // external: ['vue', 'element-plus', '@element-plus/icons-vue', 'vue-draggable-next'],
            external: pkg.peerDependencies ? Object.keys(pkg.peerDependencies) : [],
            output: {
                // 统一的资源文件命名规则
                assetFileNames: chunkInfo => {
                    // 将 CSS 文件名改为 index.css
                    if (chunkInfo.name?.endsWith('.css')) {
                        return 'index.css'
                    }
                    return '[name][extname]'
                },
                globals: {
                    vue: 'Vue',
                    'element-plus': 'ElementPlus',
                    '@element-plus/icons-vue': 'ElementPlusIconsVue'
                    // 'vue-draggable-next': 'VueDraggableNext'
                }
            }
        }
    }
})
