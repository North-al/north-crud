<template>
    <el-table :data="data" v-loading="loading" style="width: 100%">
        <el-table-column v-for="col in columns" :key="col.prop" :prop="col.prop" :label="col.label" :width="col.width">
            <template v-if="$slots[col.prop]" #default="{ row }">
                <slot :name="col.prop" :row="row" />
            </template>
        </el-table-column>
    </el-table>
</template>

<script lang="ts" setup>
    interface Column {
        label: string
        prop: string
        width?: string | number
    }

    const props = defineProps<{
        columns: Column[]
        data: Record<string, any>[]
        loading?: boolean
    }>()
</script>
