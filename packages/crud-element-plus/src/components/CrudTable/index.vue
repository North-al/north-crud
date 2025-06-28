<script setup lang="tsx" generic="T">
    import { computed, provide, ref, useAttrs } from 'vue'
    import { NorthTableProps, TableColumn } from './props'
    import ToolBar from '../ToolBar/index.vue'
    import type { CrudToolType } from '../../types'

    defineOptions({ name: 'CrudTable' })

    const attrs = useAttrs()

    // TODO:【目前来说有点多此一举的一步, 后续用不到删了】
    const tableAttrs = computed(() => {
        const _events = Object.fromEntries(Object.entries(attrs).filter(([key]) => key.startsWith('on')))
        const _attrs = Object.fromEntries(Object.entries(attrs).filter(([key]) => !key.startsWith('on')))
        return {
            _events,
            _attrs
        }
    })

    const emits = defineEmits()
    const props = withDefaults(defineProps<NorthTableProps<T>>(), {
        hasPagination: true
    })

    const page = defineModel<number>('page', {
        type: Number,
        default: 1
    })

    const pageSize = defineModel<number>('pageSize', {
        type: Number,
        default: 10
    })

    const tableRef = ref()
    const proxyColumns = ref(props.columns.map(col => ({ visible: true, ...col })))
    const visibleColumns = computed(() => proxyColumns.value.filter(col => col.visible !== false))

    defineExpose({ tableRef })

    provide<CrudToolType>('crud-table-to-tool', {
        tableRef
    })

    const extractColumnProps = (col: TableColumn): Partial<TableColumn> => {
        // 不传递 formatter、render、filter
        const { filter, formatter, render, ...rest } = col
        return rest
    }

    const handlePaginationChange = (currentPage: number, pageSize: number) => {}
</script>

<template>
    <div class="north-crud-table">
        <ToolBar v-model:columns="proxyColumns">
            <template #left>
                <slot name="toolbar-left"></slot>
            </template>
        </ToolBar>

        <el-table
            v-loading="loading"
            ref="tableRef"
            :data="data"
            :border="false"
            :stripe="false"
            row-key="id"
            style="width: 100%"
            header-row-class-name="crud-header-row"
            header-cell-class-name="crud-header-cell"
            highlight-current-row
            show-overflow-tooltip
            v-bind="{ ...tableAttrs._attrs, ...tableAttrs._events }">
            <el-table-column
                v-for="col in visibleColumns"
                :key="col.prop"
                :column-key="col.prop"
                :label="col.label"
                :filters="col?.filter?.filters"
                :filter-placement="col?.filter?.placement || 'bottom-end'"
                :filter-class-name="col?.filter?.className"
                :filter-multiple="col?.filter?.multiple ?? true"
                :filter-method="col?.filter?.method"
                :filtered-value="col?.filter?.value"
                v-bind="{ ...extractColumnProps(col) }">
                <template v-if="col?.prop && $slots[col.prop]" #default="{ row }">
                    <slot :name="col.prop" :row="row" />
                </template>
                <template v-else-if="col?.render" #default="{ row, column, $index }">
                    <template v-if="Array.isArray(col.render!(row, column, row[col.prop!], $index))">
                        <component
                            v-for="(comp, idx) in col.render!(row, column, row[col.prop!], $index)"
                            :is="comp"
                            :key="idx" />
                    </template>
                    <template v-else>
                        <component :is="col.render!(row, column, row[col.prop!], $index)" />
                    </template>
                </template>
                <template v-else-if="col?.formatter" #default="{ row, column, $index }">
                    {{ col.formatter!(row, column, row[col.prop!], $index) }}
                </template>
            </el-table-column>
        </el-table>

        <div class="north-crud-pagination" v-if="hasPagination">
            <el-pagination
                v-model:current-page="page"
                v-model:page-size="pageSize"
                :total="total"
                :page-sizes="[10, 20, 30, 40, 50]"
                layout="total, sizes, prev, pager, next, jumper"
                background
                v-bind="{ ...props.pagination }"
                @change="handlePaginationChange" />
        </div>
    </div>
</template>

<style>
    .north-crud-table .crud-header-row {
        background-color: #f2f3f5;
    }

    .north-crud-table .crud-header-row th.crud-header-cell {
        color: #606266;
        background-color: #f2f3f5;
    }

    .north-crud-table .el-table.is-scrolling-none th.el-table-fixed-column--left,
    .north-crud-table .el-table.is-scrolling-none th.el-table-fixed-column--right {
        background-color: #f2f3f5;
    }

    .north-crud-pagination {
        margin-top: 16px;
        display: flex;
        justify-content: flex-end;
    }
</style>
