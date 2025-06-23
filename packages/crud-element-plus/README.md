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

### AdvancedTable

高级表格组件，在基础组件上增加了工具栏、搜索、列设置等功能。

## 快速开始

### 安装

```bash
pnpm add @north-crud/element-plus
```

### 基础用法

```vue
<template>
    <CrudTable
        :data="tableData"
        :config="tableConfig"
        :pagination="paginationConfig"
        :loading="loading"
        :action-buttons="actionButtons" />
</template>

<script setup>
    import { CrudTable } from '@north-crud/element-plus'

    const tableData = ref([{ id: 1, name: '张三', email: 'zhang@example.com' }])

    const tableConfig = {
        columns: [
            { type: 'index', label: '序号', width: 60 },
            { label: '姓名', prop: 'name', width: 120 },
            { label: '邮箱', prop: 'email', width: 200 },
            { type: 'action', label: '操作', width: 150 }
        ],
        border: true,
        stripe: true
    }

    const paginationConfig = {
        currentPage: 1,
        pageSize: 10,
        total: 100,
        onChange: (page, size) => {
            // 处理分页变化
        }
    }

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

### 高级表格

```vue
<template>
    <AdvancedTable
        :data="tableData"
        :config="tableConfig"
        :pagination="paginationConfig"
        :loading="loading"
        :action-buttons="actionButtons"
        :show-toolbar="true"
        :show-search="true"
        :search-fields="['name', 'email']"
        @add="handleAdd"
        @batch-delete="handleBatchDelete"
        @export="handleExport"
        @refresh="handleRefresh">
        <!-- 自定义工具栏 -->
        <template #toolbar-left>
            <el-button type="primary" @click="handleAdd"> 新增用户 </el-button>
        </template>

        <!-- 自定义列内容 -->
        <template #status="{ row }">
            <el-tag :type="getStatusType(row.status)">
                {{ getStatusText(row.status) }}
            </el-tag>
        </template>
    </AdvancedTable>
</template>
```

## API 文档

### CrudTable Props

| 属性          | 说明         | 类型               | 默认值  |
| ------------- | ------------ | ------------------ | ------- |
| data          | 表格数据     | `Array`            | `[]`    |
| config        | 表格配置     | `TableConfig`      | `{}`    |
| loading       | 加载状态     | `boolean`          | `false` |
| pagination    | 分页配置     | `PaginationConfig` | -       |
| actionButtons | 操作按钮配置 | `ActionButton[]`   | `[]`    |

### AdvancedTable Props

继承 CrudTable 的所有属性，并增加：

| 属性            | 说明                 | 类型       | 默认值 |
| --------------- | -------------------- | ---------- | ------ |
| showToolbar     | 是否显示工具栏       | `boolean`  | `true` |
| showAdd         | 是否显示新增按钮     | `boolean`  | `true` |
| showBatchDelete | 是否显示批量删除按钮 | `boolean`  | `true` |
| showExport      | 是否显示导出按钮     | `boolean`  | `true` |
| showSearch      | 是否显示搜索框       | `boolean`  | `true` |
| searchFields    | 搜索字段             | `string[]` | `[]`   |

### TableColumn 配置

```typescript
interface TableColumn {
    label: string // 列标题
    prop?: string // 对应字段名
    width?: string | number // 列宽度
    minWidth?: string | number // 最小列宽度
    type?: 'index' | 'selection' | 'expand' | 'action' // 列类型
    fixed?: boolean | 'left' | 'right' // 是否固定列
    sortable?: boolean | 'custom' // 是否可排序
    filterable?: boolean // 是否可筛选
    filters?: Array<{ text: string; value: any }> // 筛选选项
    align?: 'left' | 'center' | 'right' // 列对齐方式
    headerAlign?: 'left' | 'center' | 'right' // 表头对齐方式
    showOverflowTooltip?: boolean // 是否显示溢出tooltip
    render?: Function // 自定义渲染函数
    formatter?: Function // 自定义格式化函数
    hidden?: boolean // 是否隐藏
}
```

### ActionButton 配置

```typescript
interface ActionButton {
    text: string // 按钮文本
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' // 按钮类型
    icon?: string // 按钮图标
    link?: boolean // 是否为链接按钮
    size?: 'large' | 'default' | 'small' // 按钮尺寸
    show?: boolean | Function // 是否显示
    disabled?: boolean | Function // 是否禁用
    onClick: Function // 点击回调
    confirm?: {
        // 确认提示
        title?: string
        message?: string
        type?: 'warning' | 'info' | 'success' | 'error'
    }
}
```

## 构建器 API

### TableColumnBuilder

```typescript
createColumn(label: string, prop?: string)
  .width(width: string | number)
  .type('index' | 'selection' | 'action')
  .sortable(true)
  .filterable()
  .align('center')
  .render((row, column, cellValue, index) => any)
  .formatter((row, column, cellValue, index) => string)
  .build()
```

### ActionButtonBuilder

```typescript
createActionButton(text: string, onClick: Function)
  .type('primary')
  .link(true)
  .size('small')
  .show(true)
  .disabled(false)
  .confirm('确认', '确定要执行此操作吗？', 'warning')
  .build()
```

### TableBuilder

```typescript
createTable()
    .border(true)
    .stripe(true)
    .size('default')
    .addColumn(column)
    .addColumns([...columns])
    .build()
```

## 常用列类型

```typescript
import { commonColumns } from '@north-crud/element-plus'

// 序号列
commonColumns.index('序号', 60)

// 选择列
commonColumns.selection(50)

// 操作列
commonColumns.action('操作', 200, 'right')

// 文本列
commonColumns.text('姓名', 'name', 120)

// 数字列
commonColumns.number('金额', 'amount', 120)

// 日期列
commonColumns.date('日期', 'date', 180)

// 日期时间列
commonColumns.datetime('创建时间', 'createTime', 200)

// 状态列
commonColumns.status(
    '状态',
    'status',
    {
        1: { text: '启用', type: 'success' },
        0: { text: '禁用', type: 'danger' }
    },
    100
)
```

## 常用操作按钮

```typescript
import { commonActions } from '@north-crud/element-plus'

// 编辑按钮
commonActions.edit((row, index) => handleEdit(row))

// 删除按钮
commonActions.delete((row, index) => handleDelete(row, index))

// 查看按钮
commonActions.view((row, index) => handleView(row))
```

## 事件

### CrudTable Events

| 事件名           | 说明     | 参数                                                   |
| ---------------- | -------- | ------------------------------------------------------ |
| sort-change      | 排序变化 | `{ prop: string, order: 'ascending' \| 'descending' }` |
| filter-change    | 筛选变化 | `filters: Record<string, any>`                         |
| selection-change | 选择变化 | `selection: any[]`                                     |
| row-click        | 行点击   | `(row, column, event)`                                 |
| row-dblclick     | 行双击   | `(row, column, event)`                                 |
| page-change      | 分页变化 | `(page: number, pageSize: number)`                     |

### AdvancedTable Events

继承 CrudTable 的所有事件，并增加：

| 事件名       | 说明     | 参数              |
| ------------ | -------- | ----------------- |
| add          | 新增     | -                 |
| batch-delete | 批量删除 | `rows: any[]`     |
| export       | 导出     | -                 |
| search       | 搜索     | `keyword: string` |
| refresh      | 刷新     | -                 |

## 插槽

### CrudTable Slots

| 插槽名 | 说明         | 参数                     |
| ------ | ------------ | ------------------------ |
| [prop] | 自定义列内容 | `{ row, column, index }` |
| action | 自定义操作列 | `{ row, index }`         |

### AdvancedTable Slots

继承 CrudTable 的所有插槽，并增加：

| 插槽名        | 说明           | 参数 |
| ------------- | -------------- | ---- |
| toolbar-left  | 工具栏左侧内容 | -    |
| toolbar-right | 工具栏右侧内容 | -    |

## 方法

表格实例暴露的方法：

```typescript
// 清空选择
clearSelection()

// 切换行选择状态
toggleRowSelection(row, selected?)

// 切换全选
toggleAllSelection()

// 设置当前行
setCurrentRow(row)

// 清除排序
clearSort()

// 清除筛选
clearFilter(columnKeys?)

// 重新布局
doLayout()

// 手动排序
sort(prop, order)
```

## 样式定制

组件使用 CSS 变量，可以通过修改变量来定制样式：

```css
:root {
    --el-table-border-color: #ebeef5;
    --el-table-bg-color: #ffffff;
    --el-table-header-bg-color: #fafafa;
}
```

## 示例项目

查看 `src/examples/TableDemo.vue` 获取完整的使用示例。

## 许可证

MIT License
