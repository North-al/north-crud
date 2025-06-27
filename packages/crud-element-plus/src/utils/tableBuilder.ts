import { TableColumn } from '..'
import type { TableConfig, ActionButton } from '../types'

/**
 * 表格列构建器
 */
export class TableColumnBuilder {
    private column: TableColumn

    constructor(label: string, prop?: string) {
        this.column = {
            label,
            prop
        }
    }

    /**
     * 设置列宽度
     */
    width(width: string | number): this {
        this.column.width = width
        return this
    }

    /**
     * 设置最小列宽度
     */
    minWidth(minWidth: string | number): this {
        this.column.minWidth = minWidth
        return this
    }

    /**
     * 设置列类型
     */
    // type(type: 'index' | 'selection' | 'expand' | 'action'): this {
    //     this.column.type = type
    //     return this
    // }

    /**
     * 设置固定列
     */
    fixed(fixed: boolean | 'left' | 'right'): this {
        this.column.fixed = fixed
        return this
    }

    /**
     * 设置排序
     */
    sortable(sortable: boolean | 'custom' = true): this {
        this.column.sortable = sortable
        return this
    }

    /**
     * 设置筛选
     */
    // filterable(filters?: Array<{ text: string; value: any }>): this {
    //     this.column.filterable = true
    //     if (filters) {
    //         this.column.filters = filters
    //     }
    //     return this
    // }

    /**
     * 设置对齐方式
     */
    align(align: 'left' | 'center' | 'right'): this {
        this.column.align = align
        return this
    }

    /**
     * 设置表头对齐方式
     */
    // headerAlign(align: 'left' | 'center' | 'right'): this {
    //     this.column.headerAlign = align
    //     return this
    // }

    /**
     * 设置溢出tooltip
     */
    showOverflowTooltip(show: boolean = true): this {
        this.column.showOverflowTooltip = show
        return this
    }

    /**
     * 设置自定义渲染函数
     */
    render(renderFn: (row: any, column: TableColumn, cellValue: any, index: number) => any): this {
        this.column.render = renderFn
        return this
    }

    /**
     * 设置格式化函数
     */
    formatter(formatterFn: (row: any, column: TableColumn, cellValue: any, index: number) => string): this {
        this.column.formatter = formatterFn
        return this
    }

    /**
     * 设置编辑功能
     */
    // editable(editType: 'input' | 'select' | 'date' | 'number', options?: Array<{ label: string; value: any }>): this {
    //     this.column.editable = true
    //     this.column.editType = editType
    //     if (options) {
    //         this.column.editOptions = options
    //     }
    //     return this
    // }

    /**
     * 设置必填
     */
    // required(required: boolean = true): this {
    //     this.column.required = required
    //     return this
    // }

    /**
     * 设置验证规则
     */
    // rules(rules: any[]): this {
    //     this.column.rules = rules
    //     return this
    // }

    /**
     * 设置隐藏
     */
    hidden(hidden: boolean = true): this {
        // this.column.hidden = hidden
        return this
    }

    /**
     * 构建列配置
     */
    build(): TableColumn {
        return { ...this.column }
    }
}

/**
 * 操作按钮构建器
 */
export class ActionButtonBuilder {
    private button: ActionButton

    constructor(text: string, onClick: (row: any, index: number) => void) {
        this.button = {
            text,
            onClick
        }
    }

    /**
     * 设置按钮类型
     */
    type(type: 'primary' | 'success' | 'warning' | 'danger' | 'info'): this {
        this.button.type = type
        return this
    }

    /**
     * 设置按钮图标
     */
    icon(icon: string): this {
        this.button.icon = icon
        return this
    }

    /**
     * 设置链接按钮
     */
    link(link: boolean = true): this {
        this.button.link = link
        return this
    }

    /**
     * 设置朴素按钮
     */
    plain(plain: boolean = true): this {
        this.button.plain = plain
        return this
    }

    /**
     * 设置按钮尺寸
     */
    size(size: 'large' | 'default' | 'small'): this {
        this.button.size = size
        return this
    }

    /**
     * 设置显示条件
     */
    show(show: boolean | ((row: any) => boolean)): this {
        this.button.show = show
        return this
    }

    /**
     * 设置禁用条件
     */
    disabled(disabled: boolean | ((row: any) => boolean)): this {
        this.button.disabled = disabled
        return this
    }

    /**
     * 设置确认提示
     */
    confirm(title?: string, message?: string, type?: 'warning' | 'info' | 'success' | 'error'): this {
        this.button.confirm = {
            title,
            message,
            type
        }
        return this
    }

    /**
     * 构建按钮配置
     */
    build(): ActionButton {
        return { ...this.button }
    }
}

/**
 * 表格构建器
 */
export class TableBuilder {
    private config: Partial<TableConfig> = {
        columns: []
    }

    /**
     * 添加列
     */
    addColumn(column: TableColumn | TableColumnBuilder): this {
        const col = column instanceof TableColumnBuilder ? column.build() : column
        this.config.columns = this.config.columns || []
        this.config.columns.push(col)
        return this
    }

    /**
     * 批量添加列
     */
    addColumns(columns: (TableColumn | TableColumnBuilder)[]): this {
        columns.forEach(column => this.addColumn(column))
        return this
    }

    /**
     * 设置边框
     */
    border(border: boolean = true): this {
        this.config.border = border
        return this
    }

    /**
     * 设置斑马纹
     */
    stripe(stripe: boolean = true): this {
        this.config.stripe = stripe
        return this
    }

    /**
     * 设置表格尺寸
     */
    size(size: 'large' | 'default' | 'small'): this {
        this.config.size = size
        return this
    }

    /**
     * 设置表格高度
     */
    height(height: string | number): this {
        this.config.height = height
        return this
    }

    /**
     * 设置最大高度
     */
    maxHeight(maxHeight: string | number): this {
        this.config.maxHeight = maxHeight
        return this
    }

    /**
     * 设置是否显示表头
     */
    showHeader(show: boolean = true): this {
        this.config.showHeader = show
        return this
    }

    /**
     * 设置空数据文本
     */
    emptyText(text: string): this {
        this.config.emptyText = text
        return this
    }

    /**
     * 设置行选择
     */
    selection(multiple: boolean = true, onSelectionChange?: (selection: any[]) => void): this {
        this.config.selection = {
            multiple,
            onSelectionChange
        }
        return this
    }

    /**
     * 构建表格配置
     */
    build(): TableConfig {
        return this.config as TableConfig
    }
}

/**
 * 创建表格列
 */
export const createColumn = (label: string, prop?: string): TableColumnBuilder => {
    return new TableColumnBuilder(label, prop)
}

/**
 * 创建操作按钮
 */
export const createActionButton = (text: string, onClick: (row: any, index: number) => void): ActionButtonBuilder => {
    return new ActionButtonBuilder(text, onClick)
}

/**
 * 创建表格构建器
 */
export const createTable = (): TableBuilder => {
    return new TableBuilder()
}

/**
 * 常用列类型快捷方法
 */
export const commonColumns = {
    /**
     * 序号列
     */
    // index: (label: string = '序号', width: number = 60): TableColumn => {
    //     return createColumn(label).type('index').width(width).align('center').build()
    // },

    /**
     * 选择列
     */
    // selection: (width: number = 50): TableColumn => {
    //     return createColumn('').type('selection').width(width).build()
    // },

    /**
     * 操作列
     */
    // action: (label: string = '操作', width: number = 200, fixed: 'right' | 'left' | boolean = 'right'): TableColumn => {
    //     return createColumn(label).type('action').width(width).fixed(fixed).align('center').build()
    // },

    /**
     * 文本列
     */
    text: (label: string, prop: string, width?: number): TableColumn => {
        const column = createColumn(label, prop).showOverflowTooltip()
        if (width) column.width(width)
        return column.build()
    },

    /**
     * 数字列
     */
    number: (label: string, prop: string, width?: number): TableColumn => {
        const column = createColumn(label, prop).align('right')
        if (width) column.width(width)
        return column.build()
    },

    /**
     * 日期列
     */
    date: (label: string, prop: string, width: number = 180): TableColumn => {
        return createColumn(label, prop)
            .width(width)
            .align('center')
            .formatter((row, column, cellValue) => {
                if (!cellValue) return ''
                return new Date(cellValue).toLocaleDateString()
            })
            .build()
    },

    /**
     * 日期时间列
     */
    datetime: (label: string, prop: string, width: number = 200): TableColumn => {
        return createColumn(label, prop)
            .width(width)
            .align('center')
            .formatter((row, column, cellValue) => {
                if (!cellValue) return ''
                return new Date(cellValue).toLocaleString()
            })
            .build()
    },

    /**
     * 状态列
     */
    status: (
        label: string,
        prop: string,
        statusMap: Record<string | number, { text: string; type?: 'success' | 'warning' | 'danger' | 'info' }>,
        width: number = 100
    ): TableColumn => {
        return createColumn(label, prop)
            .width(width)
            .align('center')
            .render((row, column, cellValue) => {
                const status = statusMap[cellValue]
                if (!status) return cellValue
                const className = status.type ? `status-${status.type}` : ''
                return `<span class="status-tag ${className}">${status.text}</span>`
            })
            .build()
    }
}

/**
 * 常用操作按钮
 */
export const commonActions = {
    /**
     * 编辑按钮
     */
    edit: (onClick: (row: any, index: number) => void): ActionButton => {
        return createActionButton('编辑', onClick).type('primary').link().size('small').build()
    },

    /**
     * 删除按钮
     */
    delete: (onClick: (row: any, index: number) => void): ActionButton => {
        return createActionButton('删除', onClick)
            .type('danger')
            .link()
            .size('small')
            .confirm('删除确认', '确定要删除这条记录吗？', 'warning')
            .build()
    },

    /**
     * 查看按钮
     */
    view: (onClick: (row: any, index: number) => void): ActionButton => {
        return createActionButton('查看', onClick).type('info').link().size('small').build()
    },

    /**
     * 启用/禁用按钮
     */
    toggle: (
        onClick: (row: any, index: number) => void,
        statusProp: string = 'status',
        activeValue: any = 1
    ): ActionButton => {
        return createActionButton('', onClick)
            .type('warning')
            .link()
            .size('small')
            .show(row => {
                // 动态设置按钮文本
                const isActive = row[statusProp] === activeValue
                return true
            })
            .confirm('状态切换', '确定要切换状态吗？', 'warning')
            .build()
    }
}
