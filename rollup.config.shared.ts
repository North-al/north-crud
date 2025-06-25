import { defineConfig } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
// import typescript from 'rollup-plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import alias from '@rollup/plugin-alias'
import dts from 'rollup-plugin-dts'
import vue from '@vitejs/plugin-vue'
import { readFileSync } from 'fs'
import path from 'path'
import type { RollupOptions } from 'rollup'

/**
 * 创建通用的 rollup 配置
 */

// 配置选项类型
export interface RollupConfigOptions {
    /** 包目录路径 */
    packageDir: string
    /** 是否包含 Vue 组件 */
    hasVue?: boolean
    /** 是否需要处理样式 */
    hasStyles?: boolean
    /** 额外的外部依赖 */
    additionalExternal?: string[]
}

export function createRollupConfig(options: RollupConfigOptions): RollupOptions[] {
    const { packageDir, hasVue = false, hasStyles = false, additionalExternal = [] } = options

    // 读取包的 package.json
    const packageJsonPath = path.resolve(packageDir, 'package.json')
    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

    // 外部依赖
    const external = [
        ...Object.keys(pkg.peerDependencies || {}),
        ...Object.keys(pkg.dependencies || {}),
        ...additionalExternal,
        'vue',
        'element-plus'
    ]

    // 基础插件
    const basePlugins = [
        alias({
            entries: [{ find: '@', replacement: path.resolve(packageDir, 'src') }]
        }),
        nodeResolve({
            preferBuiltins: false
        }),
        commonjs()
    ]

    return defineConfig([
        // 构建js产物
        {
            input: path.resolve(packageDir, 'src/index.ts'),
            external,
            output: [
                {
                    file: path.resolve(packageDir, pkg.module || 'dist/index.mjs'),
                    format: 'esm',
                    sourcemap: true
                },
                {
                    file: path.resolve(packageDir, pkg.main || 'dist/index.js'),
                    format: 'cjs',
                    sourcemap: true,
                    exports: 'named'
                }
            ],
            plugins: [
                ...basePlugins,
                typescript({
                    tsconfig: path.resolve(packageDir, 'tsconfig.json'),
                    clean: true
                    // useTsconfigDeclarationDir: false
                    // 关键配置：处理 Vue 文件
                    // include: ['src/**/*.ts', 'src/**/*.vue'],
                    // exclude: ['node_modules', 'dist'],
                    // tsconfigOverride: {
                    //     compilerOptions: {
                    //         declaration: false,
                    //         declarationMap: false,
                    //         // 确保正确处理模块
                    //         moduleResolution: 'node',
                    //         allowSyntheticDefaultImports: true,
                    //         esModuleInterop: true,
                    //         skipLibCheck: true,
                    //         // 重要：忽略 Vue 文件中的一些类型错误
                    //         noImplicitAny: false,
                    //         strictNullChecks: false
                    //     }
                    // }
                })

                // typescript({
                //     tsconfig: path.resolve(packageDir, 'tsconfig.json'),
                //     // useTsconfigDeclarationDir: true, // 使用 tsconfig.json 中的 declarationDir 配置
                //     clean: true, // 清理缓存，防止旧声明干扰
                //     check: false // 需使用 rollup-plugin-typescript2
                // })
            ]
        },
        // 构建类型产物
        {
            input: path.resolve(packageDir, 'src/index.ts'),
            external,
            output: {
                file: path.resolve(packageDir, 'dist/index.d.ts'),
                format: 'es'
            },
            plugins: [
                alias({
                    entries: [{ find: '@', replacement: path.resolve(packageDir, 'src') }]
                }),
                dts({
                    tsconfig: path.resolve(packageDir, 'tsconfig.json'),
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
}
