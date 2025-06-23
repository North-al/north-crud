import { defineConfig } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import babel from '@rollup/plugin-babel'
import alias from '@rollup/plugin-alias'
// import vue from 'rollup-plugin-vue'
import vue from '@vitejs/plugin-vue'

/**
 * Rollup Configuration
 */
export default defineConfig([
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/index.esm.js',
                format: 'esm',
                sourcemap: true
            },
            {
                file: 'dist/index.cjs.js',
                format: 'cjs',
                sourcemap: true,
                exports: 'named'
            }
        ],

        plugins: [
            alias({
                entries: [
                    {
                        find: '@',
                        replacement: new URL('./src', import.meta.url).pathname
                    }
                ]
            }),
            nodeResolve(),
            commonjs(),
            typescript({
                tsconfig: './tsconfig.json',
                // useTsconfigDeclarationDir: true, // 使用 tsconfig.json 中的 declarationDir 配置
                // clean: true, // 清理缓存，防止旧声明干扰
                check: false // 需使用 rollup-plugin-typescript2
            }), // 而不是 @rollup/plugin-typescript
            vue({
                include: /\.vue$/
            }),
            postcss(),
            babel({
                // 指定 babel 处理文件类型
                babelHelpers: 'bundled', // 如果 vue 存在 jsx 语法，
                extensions: ['.js', '.ts', '.vue'] // 则会从 babel.config.js, 调用 @vue/babel-plugin-jsx 处理
            })
        ],

        // 排除不需要混入代码中的第三方依赖
        // external: [/^vue(\/.+|$)/, /^ant-design-vue(\/.+|$)/, /^@ant-design\/icons-vue/, /^element-plus(\/.+|$)/]
        external: [/^vue(\/.+|$)/]
    }
])
