<template>
    <div class="table-demo">
        <h2>基础表格示例</h2>
        <CrudTable
            :loading="loading"
            :data="tableData"
            :columns="basicTableConfig.columns"
            @selection-change="handleSelectionChange"
            @row-dblclick="handleCurrentChange">
            <!-- 自定义状态列 -->
            <template #status="{ row }">
                <el-tag :type="getStatusType(row.status)">
                    {{ getStatusText(row.status) }}
                </el-tag>
            </template>

            <!-- 自定义操作列 -->
            <template #action="{ row, index }">
                <el-button type="primary" link size="small" @click="handleEdit(row)"> 编辑 </el-button>
                <el-button type="danger" link size="small" @click="handleDelete(row, index)"> 删除 </el-button>
            </template>
        </CrudTable>

        <h2>单选 + 显示索引表格示例</h2>
        <CrudTable
            :loading="loading"
            :data="tableData"
            :columns="radioTableConfig.columns"
            highlight-current-row
            @current-change="handleCurrentChange">
        </CrudTable>
    </div>
</template>

<script lang="tsx" setup>
    import { ref, reactive, onMounted } from 'vue'
    import { ElTag, ElButton, ElMessage } from 'element-plus'
    import CrudTable from '@el/components/CrudTable/index.vue'
    import { TableConfig } from '@el/types'
    import { TableColumn } from '@el/components/CrudTable/props'

    const handleSelectionChange = (val: any) => {
        console.log(val)
    }

    // const tableData = ref([])
    // 模拟数据
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

    // 基础表格配置
    const basicTableConfig = reactive<TableConfig>({
        columns: [
            { type: 'selection', width: 50 },
            { label: '序号', prop: 'id', width: 60, align: 'center' },
            { label: '姓名', prop: 'name', width: 120, sortable: true },
            { label: '邮箱', prop: 'email', showOverflowTooltip: true },
            { label: '手机号', prop: 'phone', width: 140, hidden: true },
            { label: '状态', prop: 'status', width: 100, align: 'center' },
            {
                label: '创建时间',
                prop: 'createTime',
                width: 180,
                align: 'center',
                sortable: true,
                render(row: any, column: any, cellValue: string, index: number) {
                    return <el-tag type='primary'>{cellValue}</el-tag>
                }
            },
            { prop: 'action', label: '操作', width: 150, fixed: 'right', align: 'center' }
        ],
        border: true,
        stripe: true
    })

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
            { label: '手机号', prop: 'phone', hidden: true },
            {
                label: '状态',
                prop: 'status',
                width: 100,
                align: 'center'
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
            { prop: 'action', label: '操作', width: 150, fixed: 'right', align: 'center' }
        ] as TableColumn[]
    })

    const handleCurrentChange = (row: any) => {
        ElMessage.info(`当前选中用户：${row.name}`)
    }
    // // 基础操作按钮
    // const actionButtons: ActionButton[] = [
    //     {
    //         text: '编辑',
    //         type: 'primary',
    //         link: true,
    //         size: 'small',
    //         onClick: (row, index) => {
    //             handleEdit(row)
    //         }
    //     },
    //     {
    //         text: '删除',
    //         type: 'danger',
    //         link: true,
    //         size: 'small',
    //         confirm: {
    //             title: '删除确认',
    //             message: '确定要删除这条记录吗？',
    //             type: 'warning'
    //         },
    //         onClick: (row, index) => {
    //             handleDelete(row, index)
    //         }
    //     }
    // ]

    const handleEdit = (row: any) => {
        ElMessage.info(`编辑用户：${row.name}`)
    }

    const handleDelete = (row: any, index: number) => {
        tableData.value.splice(index, 1)
        ElMessage.success('删除成功')
    }

    const handlePageChange = (page: number, pageSize: number) => {
        console.log('分页变化：', page, pageSize)
    }

    const loadData = () => {
        loading.value = true
        // 模拟接口请求
        setTimeout(() => {
            loading.value = false
        }, 1000)
    }

    // 状态相关方法
    const getStatusType = (status: number) => {
        return status === 1 ? 'success' : 'danger'
    }

    const getStatusText = (status: number) => {
        return status === 1 ? '启用' : '禁用'
    }

    onMounted(() => {
        loadData()
    })
</script>

<style scoped>
    .table-demo {
        padding: 20px;
    }

    .table-demo h2 {
        margin: 30px 0 20px;
        color: var(--el-text-color-primary);
        border-bottom: 2px solid var(--el-color-primary);
        padding-bottom: 10px;
    }

    .table-demo h2:first-child {
        margin-top: 0;
    }
</style>
