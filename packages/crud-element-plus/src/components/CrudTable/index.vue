<script setup lang="ts">
    import { computed, ref, useAttrs } from 'vue'
    import { NorthTableProps } from '@/components/CrudTable/props'

    const attrs = useAttrs()
    const emits = defineEmits()

    // 获取table的on事件
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
    console.log(visibleColumns)
</script>

<template>
    <div class="north-crud-table">
        <el-table
            v-loading="loading"
            ref="tableRef"
            :data="data"
            :border="true"
            :stripe="true"
            style="width: 100%"
            v-bind="tableAttrs._attrs"
            v-on="tableAttrs._events">
            <el-table-column v-for="col in visibleColumns" :key="col.prop" v-bind="col" :label="col.label">
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

<style lang="scss" scoped></style>
