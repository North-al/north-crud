<script setup lang="tsx">
    import CrudTable from '@el/components/CrudTable/index.vue'
    import { TableConfig } from '@el/types'
    import { ElMessage } from 'element-plus'
    import { Edit } from '@element-plus/icons-vue'
    import { computed, h, reactive, ref } from 'vue'
    const tableData = ref([
        {
            id: 1,
            name: '张三',
            email: 'zhangsan@example.com',
            phone: '13800138000',
            status: 1,
            createTime: '2024-01-15 10:30:00',
            role: '管理员'
        },
        {
            id: 2,
            name: '李四',
            email: 'lisi@example.com',
            phone: '13800138001',
            status: 0,
            createTime: '2024-01-16 14:20:00',
            role: '普通用户'
        },
        {
            id: 3,
            name: '王五',
            email: 'wangwu@example.com',
            phone: '13800138002',
            status: 1,
            createTime: '2024-01-17 09:15:00',
            role: '编辑'
        }
    ])

    const loading = ref(false)

    const radioTableConfig = reactive<TableConfig>({
        columns: [
            {
                type: 'expand',
                render(row, column, cellValue, index) {
                    return (
                        <>
                            <div>
                                <p>姓名: {row.name}</p>
                                <p>邮箱: {row.email}</p>
                                <p>cellValue: {cellValue}</p>
                                <p>索引: {index}</p>
                                <p>列: {column}</p>
                            </div>
                        </>
                    )
                }
            },
            { type: 'index', width: 50 },
            {
                label: '姓名',
                prop: 'name',
                width: 120,
                sortable: true,
                filter: {
                    filters: [{ text: '张三', value: '张三' }],
                    method(value, row, column) {
                        const property = column['property']
                        return row[property] === value
                    },
                    multiple: false
                }
            },
            { label: '邮箱', prop: 'email', minWidth: 200, showOverflowTooltip: true },
            { label: '手机号', prop: 'phone', visible: false },
            {
                label: '状态',
                prop: 'status',
                align: 'center',
                render(row, column, cellValue) {
                    return [
                        <>
                            <el-tag type={cellValue === 1 ? 'success' : 'danger'}>
                                {cellValue === 1 ? '启用' : '禁用'}
                            </el-tag>
                        </>
                    ]
                }
            },
            {
                label: '创建时间',
                prop: 'createTime',
                width: 180,
                align: 'center',
                sortable: true,
                render(row, column, cellValue, index) {
                    return <el-tag type='primary'>{cellValue}</el-tag>
                }
            },
            {
                prop: 'action',
                label: '操作',
                fixed: 'right',
                align: 'center'
            }
        ]
    })

    const handleCurrentChange = (row: any) => {
        ElMessage.info(`当前选中用户：${row.name}`)
    }
</script>

<template>
    <div class="table-demo">
        <h2>单选 + 显示索引表格示例</h2>
        <CrudTable
            :loading="loading"
            :data="tableData"
            :columns="radioTableConfig.columns"
            highlight-current-row
            @current-change="handleCurrentChange">
            <template #toolbar-left>
                <el-button type="primary">添加数据</el-button>
            </template>
        </CrudTable>
    </div>
</template>

<style lang="scss" scoped></style>
