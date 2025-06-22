<template>
    <el-table :data="data" v-loading="loading" style="width: 100%" border>
        <el-table-column
            v-for="col in columns"
            :key="col.prop || col.type"
            :prop="col.prop"
            :label="col.label"
            :width="col.width"
            :type="col.type"
            :fixed="col.fixed">
            <template v-if="col.type === 'action'" #default="{ row }">
                <slot name="action" :row="row">
                    <el-button size="small" text type="primary" @click="$emit('edit', row)">编辑</el-button>
                    <el-button size="small" text type="danger" @click="$emit('delete', row)">删除</el-button>
                </slot>
            </template>

            <template v-else #default="{ row }">
                <slot :name="col.prop" :row="row">
                    {{ row[col.prop as keyof typeof row] }}
                </slot>
            </template>
        </el-table-column>
    </el-table>

    <el-pagination
        class="mt-4"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        @update:current-page="handlePageChange"
        @update:page-size="handlePageSizeChange" />
</template>

<script lang="ts" setup>
    interface Column {
        label: string
        prop?: string
        width?: string | number
        type?: 'index' | 'selection' | 'action'
        fixed?: boolean | 'left' | 'right'
    }

    interface Pagination {
        currentPage: number
        pageSize: number
        total: number
        onChange: (page: number, size: number) => void
    }

    const props = defineProps<{
        columns: Column[]
        data: any[]
        loading?: boolean
        pagination: Pagination
    }>()

    const emit = defineEmits<{
        (e: 'edit', row: any): void
        (e: 'delete', row: any): void
    }>()

    defineSlots<Record<string, (props: { row: any }) => any>>()

    const handlePageChange = (page: number) => {
        props.pagination.onChange(page, props.pagination.pageSize)
    }

    const handlePageSizeChange = (size: number) => {
        props.pagination.onChange(props.pagination.currentPage, size)
    }
</script>

<style scoped>
    .mt-4 {
        margin-top: 16px;
    }
</style>
