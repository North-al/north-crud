import { defineConfig } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import alias from '@rollup/plugin-alias'
import dts from 'rollup-plugin-dts'
import path, { dirname } from 'path'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'

// 获取当前文件的目录路径（ES 模块方式）
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 读取包的 package.json
const packageJsonPath = path.resolve(__dirname, 'package.json')
const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

// 外部依赖
const external = [...Object.keys(pkg.peerDependencies || {}), ...Object.keys(pkg.dependencies || {})]

const outputDir = path.resolve(__dirname, 'dist')

export default defineConfig([
    {
        input: path.resolve(__dirname, 'src/index.ts'),
        external,
        output: [
            {
                file: path.resolve(outputDir, 'index.mjs'),
                format: 'esm',
                sourcemap: true
            },
            {
                file: path.resolve(outputDir, 'index.js'),
                format: 'cjs',
                sourcemap: true,
                exports: 'named'
            }
        ],
        plugins: [
            alias({
                entries: [{ find: '@', replacement: path.resolve(__dirname, 'src') }]
            }),
            nodeResolve({
                preferBuiltins: false
            }),
            commonjs(),
            typescript({
                tsconfig: path.resolve(__dirname, 'tsconfig.json'),
                clean: true
            })
        ]
    },
    {
        input: path.resolve(__dirname, 'src/index.ts'),
        external,
        output: {
            file: path.resolve(outputDir, 'index.d.ts'),
            format: 'es'
        },
        plugins: [
            alias({
                entries: [{ find: '@', replacement: path.resolve(__dirname, 'src') }]
            }),
            dts({
                tsconfig: path.resolve(__dirname, 'tsconfig.json'),
                compilerOptions: {
                    skipLibCheck: true,
                    include: ['src/**/*.ts'],
                    // 确保正确处理 Vue 文件
                    exclude: ['node_modules', 'dist', 'src/**/*.vue']
                }
            })
        ]
    }
])
