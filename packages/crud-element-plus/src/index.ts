import CrudTable from './components/CrudTable/index.vue'
// import AdvancedTable from './components/AdvancedTable.vue'

export { CrudTable }
export * from './utils/tableBuilder'

// 导出类型定义
export type { TableConfig, PaginationConfig, ActionButton, SortParams, FilterParams } from './types'
export type { TableColumn } from './components/CrudTable/props'

// 组件安装函数
export const install = (app: any) => {
    app.component('CrudTable', CrudTable)
}

// 版本信息
export const version = '1.0.0'
