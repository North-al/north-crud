// 表格列配置接口

import { TableColumn } from '@/components/CrudTable/props'

// 表格配置接口
export interface TableConfig {
    /** 表格列配置 */
    columns: TableColumn[]
    /** 是否显示边框 */
    border?: boolean
    /** 是否显示斑马纹 */
    stripe?: boolean
    /** 表格尺寸 */
    size?: 'large' | 'default' | 'small'
    /** 行高 */
    height?: string | number
    /** 最大高度 */
    maxHeight?: string | number
    /** 是否显示表头 */
    showHeader?: boolean
    /** 空数据时显示的文本 */
    emptyText?: string
    /** 行选择配置 */
    selection?: {
        /** 是否支持多选 */
        multiple?: boolean
        /** 选择改变回调 */
        onSelectionChange?: (selection: any[]) => void
    }
}

// 分页配置接口
export interface PaginationConfig {
    /** 当前页码 */
    currentPage: number
    /** 每页条数 */
    pageSize: number
    /** 总条数 */
    total: number
    /** 每页显示个数选择器的选项 */
    pageSizes?: number[]
    /** 分页布局 */
    layout?: string
    /** 是否显示背景色 */
    background?: boolean
    /** 页码改变回调 */
    onChange: (page: number, size: number) => void
}

// 操作按钮配置接口
export interface ActionButton {
    /** 按钮文本 */
    text: string
    /** 按钮类型 */
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
    /** 按钮图标 */
    icon?: string
    /** 是否为链接按钮 */
    link?: boolean
    /** 是否为文字按钮 */
    plain?: boolean
    /** 按钮尺寸 */
    size?: 'large' | 'default' | 'small'
    /** 是否显示（可以是函数） */
    show?: boolean | ((row: any) => boolean)
    /** 是否禁用（可以是函数） */
    disabled?: boolean | ((row: any) => boolean)
    /** 点击回调 */
    onClick: (row: any, index: number) => void
    /** 确认提示 */
    confirm?: {
        title?: string
        message?: string
        type?: 'warning' | 'info' | 'success' | 'error'
    }
}

// 排序参数接口
export interface SortParams {
    prop: string
    order: 'ascending' | 'descending'
}

// 筛选参数接口
export interface FilterParams {
    [key: string]: any
}
