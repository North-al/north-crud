// src/shims-vue.d.ts
declare module '*.vue' {
    import { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

// 为 Element Plus 添加全局类型
