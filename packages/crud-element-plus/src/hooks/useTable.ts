import { TableColumn } from '@el/components/CrudTable/props'
import { computed, ref } from 'vue'

export interface UseTableOptions<T = any> {
    /** 原始列配置 */
    columns: TableColumn[]
    /** 默认可见列 */
    defaultVisibleKeys?: string[]
}

export function useTable<T = any>(options: UseTableOptions<T>) {
    const { columns, defaultVisibleKeys } = options

    // 表格数据
    const tableData = ref<T[]>([])

    // 表格加载状态
    const loading = ref(false)

    // 列配置
    const allColumns = ref<TableColumn[]>(columns)

    // 用户控制的可见列 key
    const visibleKeys = ref<string[]>(defaultVisibleKeys ?? columns.map(col => col.prop as string))

    // 过滤后的可见列
    const visibleColumns = computed(() => {
        return allColumns.value.filter(col => {
            // 如果列配置中有 visible 属性，则以该属性为准
            if (col.visible !== undefined) {
                return col.visible === true
            }
            // 否则使用 visibleKeys 控制
            return visibleKeys.value.includes(col.prop as string)
        })
    })

    // computed(() => props.columns.filter(col => col.hidden !== true))

    // 表格刷新方法
    const refresh = async (fetchData: () => Promise<T[]>) => {
        loading.value = true
        try {
            const result = await fetchData()
            tableData.value = result
        } finally {
            loading.value = false
        }
    }

    // 设置列可见性（配合列设置功能）
    const setVisibleKeys = (keys: string[]) => {
        visibleKeys.value = keys
    }

    return {
        // 状态
        tableData,
        loading,
        visibleColumns,

        // 操作
        refresh,
        setVisibleKeys
    }
}
