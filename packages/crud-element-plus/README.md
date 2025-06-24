# Element Plus Table 二次封装

基于 Element Plus 的 Table 组件进行二次封装，提供更丰富的功能和更简便的使用方式。

## 特性

-   🚀 **开箱即用**：预设常用配置，快速上手
-   🎨 **灵活定制**：支持自定义渲染、格式化、编辑等功能
-   📱 **响应式设计**：自适应不同屏幕尺寸
-   🔧 **工具栏集成**：内置搜索、筛选、导出等功能
-   🎯 **类型安全**：完整的 TypeScript 支持
-   🛠️ **构建器模式**：链式调用快速构建表格配置

## 组件说明

### CrudTable

基础表格组件，提供核心的表格功能。

## 快速开始

### 安装

```bash
pnpm add @north-crud/element-plus
```

### 基础用法

```vue
<template>
    <CrudTable
        :loading="loading"
        :data="tableData"
        :columns="radioTableConfig.columns"
        highlight-current-row
        @current-change="handleCurrentChange">
    </CrudTable>
</template>

<script setup>
    import { CrudTable } from '@north-crud/element-plus'

    const tableData = ref([{ id: 1, name: '张三', email: 'zhang@example.com' }])

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

    const actionButtons = [
        {
            text: '编辑',
            type: 'primary',
            onClick: (row, index) => {
                console.log('编辑', row)
            }
        }
    ]
</script>
```

### 使用构建器

```vue
<script setup>
    import { createTable, commonColumns, commonActions } from '@north-crud/element-plus'

    const tableConfig = createTable()
        .border()
        .stripe()
        .addColumns([
            commonColumns.selection(),
            commonColumns.index(),
            commonColumns.text('姓名', 'name', 120),
            commonColumns.text('邮箱', 'email', 200),
            commonColumns.status('状态', 'status', {
                1: { text: '启用', type: 'success' },
                0: { text: '禁用', type: 'danger' }
            }),
            commonColumns.datetime('创建时间', 'createTime'),
            commonColumns.action()
        ])
        .build()

    const actionButtons = [
        commonActions.edit((row, index) => handleEdit(row)),
        commonActions.delete((row, index) => handleDelete(row, index))
    ]
</script>
```
