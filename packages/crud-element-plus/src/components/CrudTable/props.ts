import type { TableProps as ElTableProps } from 'element-plus/es/components/table'

type Position =
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end'

export interface NorthTableProps<T = any> extends Partial<Omit<ElTableProps<T>, 'data' | 'columns'>> {
    data: T[]
    columns: TableColumn[]
    border?: boolean
    stripe?: boolean
    size?: 'large' | 'default' | 'small'
    height?: string | number
    maxHeight?: string | number
    showHeader?: boolean
    emptyText?: string
    loading?: boolean
}

export interface TableColumn {
    /** 列标题 */
    label?: string
    /** 对应字段名 */
    prop?: string
    /** 列宽度 */
    width?: string | number
    /** 最小列宽度 */
    minWidth?: string | number
    /** 是否固定列 */
    fixed?: boolean | 'left' | 'right'
    /** 是否可排序 */
    sortable?: boolean | 'custom'
    /** 列类型 */
    type?: 'selection' | 'index' | 'expand' | 'default'
    /** 列对齐方式 */
    align?: 'left' | 'center' | 'right'
    /** 筛选参数接口 */
    filter?: TableColumnFilter
    /** 是否显示溢出tooltip */
    showOverflowTooltip?: boolean
    /** 自定义渲染函数 */
    render?: (row: any, column: TableColumn, cellValue: any, index: number) => any
    /** 自定义格式化函数 */
    formatter?: (row: any, column: TableColumn, cellValue: any, index: number) => string
    /** 是否隐藏 */
    hidden?: boolean
}

export interface TableColumnFilter {
    filters?: Array<{ text: string; value: any }>
    placement?: Position
    className?: string
    multiple?: boolean
    method?: (value: any, row: any, column: any) => void
    value: string[]
}
