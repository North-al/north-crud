<template>
    <CrudTable
        :columns="columns"
        :data="tableData"
        :pagination="pagination"
        :loading="loading"
        @edit="onEdit"
        @delete="onDelete">
        <template #status="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
        </template>

        <template #operation="{ row }">
            <el-button size="small" type="primary" @click="onEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="onDelete(row)">删除</el-button>
        </template>
    </CrudTable>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { useCrud } from '@north/crud-core'
    // import { CrudTable } from '@north/crud-element-plus'
    // import { useCrud } from '@core/composables/useCrud'
    import CrudTable from '@el/components/CrudTable.vue'

    // 模拟接口
    const total = ref(53)
    const currentPage = ref(1)
    const pageSize = ref(10)

    const pagination = {
        currentPage: 1,
        pageSize: 10,
        total: total.value,
        onChange: (page: number, size: number) => {
            console.log('分页变化', page, size)
            pagination.currentPage = page
            pagination.pageSize = size
            // 可在此调用 API 重新请求数据
            fetchList()
        }
    }

    const api = async () => {
        const data = Array.from({ length: pageSize.value }, (_, i) => ({
            id: (currentPage.value - 1) * pageSize.value + i + 1,
            name: `用户 ${Math.random().toString(36).slice(2, 6)}`,
            status: Math.random() > 0.5 ? 1 : 0 // 随机状态
        }))
        return data
    }

    const { tableData, loading, fetchList } = useCrud({ api })

    const columns = [
        { type: 'index', width: 50 },
        { label: '姓名', prop: 'name' },
        { label: '状态', prop: 'status' },
        { label: '操作', type: 'action', width: 160, fixed: 'right' }
    ]

    const onEdit = (row: any) => {
        console.log('编辑', row)
    }

    const onDelete = (row: any) => {
        console.log('删除', row)
    }

    fetchList()
</script>
