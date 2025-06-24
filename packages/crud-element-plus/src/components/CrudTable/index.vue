<script setup lang="ts">
    import { computed, ref, useAttrs } from 'vue'
    import { NorthTableProps, TableColumn } from '@/components/CrudTable/props'

    const attrs = useAttrs()
    const emits = defineEmits()
    const slots = defineSlots()

    // TODO:【目前来说有点多此一举的一步, 后续用不到删了】
    const tableAttrs = computed(() => {
        const _events = Object.fromEntries(Object.entries(attrs).filter(([key]) => key.startsWith('on')))
        const _attrs = Object.fromEntries(Object.entries(attrs).filter(([key]) => !key.startsWith('on')))
        return {
            _events,
            _attrs
        }
    })

    const props = defineProps<NorthTableProps>()

    const tableRef = ref()
    const visibleColumns = computed(() => props.columns.filter(col => col.hidden !== true))

    const formatTableColumnAttr = computed(() => {
        return (col: TableColumn) => {
            // 处理filter内容
            if (col.filter) {
                return {
                    ...col,
                    filters: col.filter.filters,
                    'filter-placement': col.filter.placement || 'bottom-end',
                    'filter-class-name': col.filter.className || '',
                    'filter-multiple': col.filter.multiple ?? true,
                    'filter-method': col.filter.method,
                    'filtered-value': col.filter.value
                }
            }
            return col
        }
    })

    defineExpose({
        tableRef
    })
</script>

<template>
    <div class="north-crud-table">
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
                v-bind="formatTableColumnAttr(col)">
                <template v-if="$slots[col.prop]" #default="{ row }">
                    <slot :name="col.prop" :row="row" />
                </template>
                <template v-else-if="col.render" #default="{ row, column, $index }">
                    <component :is="col.render(row, column, row[col.prop], $index)" />
                </template>
                <template v-else-if="col.formatter" #default="{ row, column, $index }">
                    {{ col.formatter(row, column, row[col.prop], $index) }}
                </template>
            </el-table-column>
        </el-table>
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
</style>
