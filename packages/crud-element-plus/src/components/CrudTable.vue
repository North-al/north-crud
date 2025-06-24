<script lang="ts" setup>
    // import { ref, computed } from 'vue'
    // import { ElTable, ElMessageBox, ElMessage } from 'element-plus'
    // import type { TableColumn, TableConfig, PaginationConfig, ActionButton, SortParams, FilterParams } from '../types'

    // interface Props {
    //     /** 表格数据 */
    //     data: any[]
    //     /** 表格配置 */
    //     config?: Partial<TableConfig>
    //     /** 分页配置 */
    //     pagination?: PaginationConfig
    //     /** 加载状态 */
    //     loading?: boolean
    //     /** 操作按钮配置 */
    //     actionButtons?: ActionButton[]
    // }

    // interface Emits {
    //     (e: 'sort-change', sort: SortParams): void
    //     (e: 'filter-change', filters: FilterParams): void
    //     (e: 'selection-change', selection: any[]): void
    //     (e: 'row-click', row: any, column: any, event: Event): void
    //     (e: 'row-dblclick', row: any, column: any, event: Event): void
    //     (e: 'page-change', page: number, pageSize: number): void
    // }

    // const props = withDefaults(defineProps<Props>(), {
    //     data: () => [],
    //     config: () => ({}),
    //     loading: false,
    //     actionButtons: () => []
    // })

    // const emit = defineEmits<Emits>()

    // const tableRef = ref<InstanceType<typeof ElTable>>()

    // // 计算可见列
    // const visibleColumns = computed(() => {
    //     return props.config.columns?.filter(column => !column.hidden) || []
    // })

    // // 获取单元格值
    // const getCellValue = (row: any, prop?: string) => {
    //     if (!prop) return ''
    //     return prop.split('.').reduce((obj, key) => obj?.[key], row) || ''
    // }

    // // 判断操作按钮是否可见
    // const isActionVisible = (action: ActionButton, row: any): boolean => {
    //     if (typeof action.show === 'function') {
    //         return action.show(row)
    //     }
    //     return action.show !== false
    // }

    // // 判断操作按钮是否禁用
    // const isActionDisabled = (action: ActionButton, row: any): boolean => {
    //     if (typeof action.disabled === 'function') {
    //         return action.disabled(row)
    //     }
    //     return action.disabled === true
    // }

    // // 处理操作按钮点击
    // const handleActionClick = async (action: ActionButton, row: any, index: number) => {
    //     // 如果有确认提示
    //     if (action.confirm) {
    //         try {
    //             await ElMessageBox.confirm(
    //                 action.confirm.message || `确定要${action.text}吗？`,
    //                 action.confirm.title || '提示',
    //                 {
    //                     confirmButtonText: '确定',
    //                     cancelButtonText: '取消',
    //                     type: action.confirm.type || 'warning'
    //                 }
    //             )
    //         } catch {
    //             return // 用户取消
    //         }
    //     }

    //     // 执行操作
    //     try {
    //         await action.onClick(row, index)
    //         if (action.confirm) {
    //             ElMessage.success(`${action.text}成功`)
    //         }
    //     } catch (error) {
    //         ElMessage.error(`${action.text}失败`)
    //         console.error(`Action ${action.text} failed:`, error)
    //     }
    // }

    // // 排序变化处理
    // const handleSortChange = ({ prop, order }: { prop: string; order: string | null }) => {
    //     if (order) {
    //         emit('sort-change', {
    //             prop,
    //             order: order as 'ascending' | 'descending'
    //         })
    //     }
    // }

    // // 筛选变化处理
    // const handleFilterChange = (filters: Record<string, any>) => {
    //     emit('filter-change', filters)
    // }

    // // 选择变化处理
    // const handleSelectionChange = (selection: any[]) => {
    //     emit('selection-change', selection)
    //     props.config.selection?.onSelectionChange?.(selection)
    // }

    // // 行点击处理
    // const handleRowClick = (row: any, column: any, event: Event) => {
    //     emit('row-click', row, column, event)
    // }

    // // 行双击处理
    // const handleRowDblClick = (row: any, column: any, event: Event) => {
    //     emit('row-dblclick', row, column, event)
    // }

    // // 分页变化处理
    // const handlePageChange = (page: number) => {
    //     props.pagination?.onChange(page, props.pagination.pageSize)
    //     emit('page-change', page, props.pagination?.pageSize || 10)
    // }

    // const handlePageSizeChange = (size: number) => {
    //     props.pagination?.onChange(props.pagination.currentPage, size)
    //     emit('page-change', props.pagination?.currentPage || 1, size)
    // }

    // // 暴露方法
    // const clearSelection = () => {
    //     tableRef.value?.clearSelection()
    // }

    // const toggleRowSelection = (row: any, selected?: boolean) => {
    //     tableRef.value?.toggleRowSelection(row, selected)
    // }

    // const toggleAllSelection = () => {
    //     tableRef.value?.toggleAllSelection()
    // }

    // const setCurrentRow = (row: any) => {
    //     tableRef.value?.setCurrentRow(row)
    // }

    // const clearSort = () => {
    //     tableRef.value?.clearSort()
    // }

    // const clearFilter = (columnKeys?: string[]) => {
    //     tableRef.value?.clearFilter(columnKeys)
    // }

    // const doLayout = () => {
    //     tableRef.value?.doLayout()
    // }

    // const sort = (prop: string, order: string) => {
    //     tableRef.value?.sort(prop, order)
    // }

    // defineExpose({
    //     clearSelection,
    //     toggleRowSelection,
    //     toggleAllSelection,
    //     setCurrentRow,
    //     clearSort,
    //     clearFilter,
    //     doLayout,
    //     sort,
    //     tableRef
    // })
</script>

<template>
    <div class="crud-table-container">
        <!-- 表格 -->
        <!-- <el-table
            ref="tableRef"
            :data="data"
            v-loading="loading"
            :border="config.border ?? true"
            :stripe="config.stripe"
            :size="config.size || 'default'"
            :height="config.height"
            :max-height="config.maxHeight"
            :show-header="config.showHeader ?? true"
            :empty-text="config.emptyText || '暂无数据'"
            style="width: 100%"
            @sort-change="handleSortChange"
            @filter-change="handleFilterChange"
            @selection-change="handleSelectionChange"
            @row-click="handleRowClick"
            @row-dblclick="handleRowDblClick">
            <el-table-column
                v-for="(column, index) in visibleColumns"
                :key="column.prop || column.type || index"
                :prop="column.prop"
                :label="column.label"
                :width="column.width"
                :min-width="column.minWidth"
                :type="column.type"
                :fixed="column.fixed"
                :sortable="column.sortable"
                :filters="column.filters"
                :align="column.align"
                :header-align="column.headerAlign"
                :show-overflow-tooltip="column.showOverflowTooltip ?? true">
                <template v-if="column.type === 'action'" #default="scope">
                    <slot name="action" :row="scope.row" :index="scope.$index">
                        <div class="table-actions">
                            <template v-for="(action, actionIndex) in actionButtons" :key="actionIndex">
                                <el-button
                                    v-if="isActionVisible(action, scope.row)"
                                    :type="action.type || 'primary'"
                                    :size="action.size || 'small'"
                                    :link="action.link ?? true"
                                    :plain="action.plain"
                                    :disabled="isActionDisabled(action, scope.row)"
                                    :icon="action.icon"
                                    @click="handleActionClick(action, scope.row, scope.$index)">
                                    {{ action.text }}
                                </el-button>
                            </template>
                        </div>
                    </slot>
                </template>

                <template v-else #default="scope">
                    <div
                        v-if="column.render"
                        v-html="column.render(scope.row, column, scope.row[column.prop!], scope.$index)"></div>

                    <span v-else-if="column.formatter">
                        {{ column.formatter(scope.row, column, scope.row[column.prop!], scope.$index) }}
                    </span>

                    <slot v-else :name="column.prop" :row="scope.row" :column="column" :index="scope.$index">
                        {{ getCellValue(scope.row, column.prop) }}
                    </slot>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            v-if="pagination && pagination.total > 0"
            class="table-pagination"
            :background="pagination.background ?? true"
            :layout="pagination.layout || 'total, sizes, prev, pager, next, jumper'"
            :total="pagination.total"
            :current-page="pagination.currentPage"
            :page-size="pagination.pageSize"
            :page-sizes="pagination.pageSizes || [10, 20, 50, 100]"
            @update:current-page="handlePageChange"
            @update:page-size="handlePageSizeChange" /> -->
    </div>
</template>

<style scoped>
    .crud-table-container {
        width: 100%;
    }

    .table-actions {
        display: flex;
        gap: 8px;
        align-items: center;
        flex-wrap: wrap;
    }

    .table-pagination {
        margin-top: 16px;
        display: flex;
        justify-content: flex-end;
    }

    :deep(.el-table) {
        --el-table-border-color: var(--el-border-color-lighter);
    }

    :deep(.el-table__header-wrapper) {
        background-color: var(--el-bg-color-page);
    }

    :deep(.el-table__row) {
        transition: background-color 0.2s ease;
    }

    :deep(.el-table__row:hover) {
        background-color: var(--el-fill-color-light);
    }

    :deep(.el-pagination) {
        --el-pagination-font-size: 14px;
    }

    .table-actions .el-button + .el-button {
        margin-left: 0;
    }
</style>
