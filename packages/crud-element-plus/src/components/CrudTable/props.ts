import type { TableProps as ElTableProps } from 'element-plus/es/components/table'
import type { TableColumn } from '@/types'

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
