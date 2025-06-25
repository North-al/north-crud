import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import '@northal/crud-element-plus/index.css'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(ElementPlus)
// 注册 CRUD 组件库

app.mount('#app')
