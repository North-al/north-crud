# Element Plus Table 二次封装使用示例

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 基础用法示例

```vue
<template>
    <div class="demo-container">
        <h1>Element Plus Table 二次封装演示</h1>

        <!-- 基础表格 -->
        <div class="demo-section">
            <h2>基础表格</h2>
            <CrudTable
                :data="tableData"
                :config="tableConfig"
                :pagination="paginationConfig"
                :loading="loading"
                :action-buttons="actionButtons"
                @page-change="handlePageChange">
                <template #status="{ row }">
                    <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                        {{ row.status === 1 ? '启用' : '禁用' }}
                    </el-tag>
                </template>
            </CrudTable>
        </div>

        <!-- 高级表格 -->
        <div class="demo-section">
            <h2>高级表格（带工具栏）</h2>
            <AdvancedTable
                :data="tableData"
                :config="advancedTableConfig"
                :pagination="paginationConfig"
                :loading="loading"
                :action-buttons="actionButtons"
                @add="handleAdd"
                @batch-delete="handleBatchDelete"
                @export="handleExport"
                @refresh="handleRefresh" />
        </div>

        <!-- 构建器示例 -->
        <div class="demo-section">
            <h2>使用构建器创建的表格</h2>
            <CrudTable
                :data="tableData"
                :config="builderTableConfig"
                :pagination="paginationConfig"
                :loading="loading"
                :action-buttons="builderActionButtons" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, reactive } from 'vue'
    import { ElTag, ElMessage } from 'element-plus'
    import {
        CrudTable,
        AdvancedTable,
        createTable,
        commonColumns,
        commonActions,
        createActionButton,
        type TableConfig,
        type PaginationConfig,
        type ActionButton
    } from '@north-crud/element-plus'

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
    const tableConfig: TableConfig = {
        columns: [
            { type: 'index', label: '序号', width: 60, align: 'center' },
            { type: 'selection', width: 50 },
            { label: '姓名', prop: 'name', width: 120, sortable: true },
            { label: '邮箱', prop: 'email', width: 200, showOverflowTooltip: true },
            { label: '手机号', prop: 'phone', width: 140 },
            { label: '状态', prop: 'status', width: 100, align: 'center' },
            { label: '创建时间', prop: 'createTime', width: 180, align: 'center', sortable: true },
            { type: 'action', label: '操作', width: 150, fixed: 'right', align: 'center' }
        ],
        border: true,
        stripe: true
    }

    // 高级表格配置
    const advancedTableConfig: TableConfig = {
        columns: [
            { type: 'selection', width: 50 },
            { label: 'ID', prop: 'id', width: 80, align: 'center', sortable: true },
            { label: '姓名', prop: 'name', width: 120, sortable: true },
            { label: '邮箱', prop: 'email', minWidth: 200, showOverflowTooltip: true },
            { label: '手机号', prop: 'phone', width: 140 },
            { label: '角色', prop: 'role', width: 120 },
            {
                label: '状态',
                prop: 'status',
                width: 100,
                align: 'center',
                formatter: (row, column, cellValue) => {
                    return cellValue === 1 ? '启用' : '禁用'
                }
            },
            { label: '创建时间', prop: 'createTime', width: 180, align: 'center', sortable: true }
        ],
        border: true,
        stripe: true
    }

    // 使用构建器创建的表格配置
    const builderTableConfig = createTable()
        .border()
        .stripe()
        .addColumns([
            commonColumns.selection(),
            commonColumns.index(),
            commonColumns.text('姓名', 'name', 120),
            commonColumns.text('邮箱', 'email', 200),
            commonColumns.text('手机号', 'phone', 140),
            commonColumns.status('状态', 'status', {
                1: { text: '启用', type: 'success' },
                0: { text: '禁用', type: 'danger' }
            }),
            commonColumns.datetime('创建时间', 'createTime'),
            commonColumns.action()
        ])
        .build()

    // 分页配置
    const paginationConfig: PaginationConfig = {
        currentPage: 1,
        pageSize: 10,
        total: 100,
        onChange: (page: number, size: number) => {
            console.log('分页变化：', page, size)
        }
    }

    // 操作按钮配置
    const actionButtons: ActionButton[] = [
        {
            text: '编辑',
            type: 'primary',
            link: true,
            size: 'small',
            onClick: (row, index) => {
                ElMessage.info(`编辑用户：${row.name}`)
            }
        },
        {
            text: '删除',
            type: 'danger',
            link: true,
            size: 'small',
            confirm: {
                title: '删除确认',
                message: '确定要删除这条记录吗？',
                type: 'warning'
            },
            onClick: (row, index) => {
                ElMessage.success('删除成功')
            }
        }
    ]

    // 构建器创建的操作按钮
    const builderActionButtons: ActionButton[] = [
        commonActions.edit((row, index) => {
            ElMessage.info(`编辑用户：${row.name}`)
        }),
        createActionButton('查看详情', (row, index) => {
            ElMessage.info(`查看用户详情：${row.name}`)
        })
            .type('info')
            .link()
            .size('small')
            .build(),
        commonActions.delete((row, index) => {
            ElMessage.success('删除成功')
        })
    ]

    // 事件处理
    const handleAdd = () => {
        ElMessage.success('新增用户')
    }

    const handleBatchDelete = (rows: any[]) => {
        ElMessage.success(`批量删除 ${rows.length} 条记录`)
    }

    const handleExport = () => {
        ElMessage.success('导出数据')
    }

    const handleRefresh = () => {
        loading.value = true
        setTimeout(() => {
            loading.value = false
            ElMessage.success('刷新成功')
        }, 1000)
    }

    const handlePageChange = (page: number, pageSize: number) => {
        console.log('分页变化：', page, pageSize)
    }
</script>

<style scoped>
    .demo-container {
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
    }

    .demo-section {
        margin-bottom: 40px;
    }

    .demo-section h2 {
        margin-bottom: 20px;
        color: var(--el-text-color-primary);
        border-bottom: 2px solid var(--el-color-primary);
        padding-bottom: 10px;
    }

    h1 {
        text-align: center;
        color: var(--el-text-color-primary);
        margin-bottom: 40px;
    }
</style>
```

## 主要功能特性

### 1. 基础表格功能

-   ✅ 数据展示
-   ✅ 分页
-   ✅ 排序
-   ✅ 筛选
-   ✅ 选择
-   ✅ 操作按钮

### 2. 高级表格功能

-   ✅ 工具栏（新增、批量删除、导出、刷新）
-   ✅ 搜索功能
-   ✅ 列显示设置
-   ✅ 响应式设计

### 3. 构建器模式

-   ✅ 链式调用
-   ✅ 常用列类型
-   ✅ 常用操作按钮
-   ✅ 类型安全

### 4. 定制功能

-   ✅ 自定义渲染
-   ✅ 自定义格式化
-   ✅ 自定义操作按钮
-   ✅ 插槽支持

### 5. 类型安全

-   ✅ 完整的 TypeScript 支持
-   ✅ 接口定义
-   ✅ 类型检查

## 使用场景

1. **后台管理系统**：用户管理、权限管理、内容管理等
2. **数据展示**：报表、统计数据、列表页面
3. **电商系统**：商品管理、订单管理、库存管理
4. **企业应用**：员工管理、项目管理、财务管理

## 性能优化

1. **虚拟滚动**：大数据量时使用虚拟滚动
2. **懒加载**：分页加载数据
3. **防抖搜索**：搜索功能使用防抖
4. **缓存策略**：合理使用缓存

## 扩展性

该组件设计时考虑了扩展性，您可以：

1. **添加新的列类型**
2. **扩展操作按钮**
3. **自定义工具栏**
4. **添加新的功能模块**

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进这个组件。

## 许可证

MIT License
