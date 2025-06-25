interface CrudOptions {
    api: () => Promise<any[]>;
}
interface PaginationParams {
    page: number;
    pageSize: number;
    total?: number;
}
interface SortParams {
    prop: string;
    order: 'ascending' | 'descending';
}
interface FilterParams {
    [key: string]: any;
}
interface TableColumn {
    /** 列标题 */
    label: string;
    /** 对应字段名 */
    prop?: string;
    /** 列宽度 */
    width?: string | number;
    /** 最小列宽度 */
    minWidth?: string | number;
    /** 列类型 */
    type?: 'index' | 'selection' | 'expand' | 'action';
    /** 是否固定列 */
    fixed?: boolean | 'left' | 'right';
    /** 是否可排序 */
    sortable?: boolean | 'custom';
    /** 是否可筛选 */
    filterable?: boolean;
    /** 筛选选项 */
    filters?: Array<{
        text: string;
        value: any;
    }>;
    /** 列对齐方式 */
    align?: 'left' | 'center' | 'right';
    /** 表头对齐方式 */
    headerAlign?: 'left' | 'center' | 'right';
    /** 是否显示溢出tooltip */
    showOverflowTooltip?: boolean;
    /** 自定义渲染函数 */
    render?: (row: any, column: TableColumn, cellValue: any, index: number) => any;
    /** 自定义格式化函数 */
    formatter?: (row: any, column: TableColumn, cellValue: any, index: number) => string;
    /** 是否可编辑 */
    editable?: boolean;
    /** 编辑类型 */
    editType?: 'input' | 'select' | 'date' | 'number';
    /** 编辑选项（用于select类型） */
    editOptions?: Array<{
        label: string;
        value: any;
    }>;
    /** 是否必填 */
    required?: boolean;
    /** 验证规则 */
    rules?: any[];
    /** 是否隐藏 */
    hidden?: boolean;
}
interface TableConfig {
    /** 表格列配置 */
    columns: TableColumn[];
    /** 是否显示边框 */
    border?: boolean;
    /** 是否显示斑马纹 */
    stripe?: boolean;
    /** 表格尺寸 */
    size?: 'large' | 'default' | 'small';
    /** 行高 */
    height?: string | number;
    /** 最大高度 */
    maxHeight?: string | number;
    /** 是否显示表头 */
    showHeader?: boolean;
    /** 空数据时显示的文本 */
    emptyText?: string;
    /** 行选择配置 */
    selection?: {
        /** 是否支持多选 */
        multiple?: boolean;
        /** 选择改变回调 */
        onSelectionChange?: (selection: any[]) => void;
    };
}
interface PaginationConfig {
    /** 当前页码 */
    currentPage: number;
    /** 每页条数 */
    pageSize: number;
    /** 总条数 */
    total: number;
    /** 每页显示个数选择器的选项 */
    pageSizes?: number[];
    /** 分页布局 */
    layout?: string;
    /** 是否显示背景色 */
    background?: boolean;
    /** 页码改变回调 */
    onChange: (page: number, size: number) => void;
}
interface ActionButton {
    /** 按钮文本 */
    text: string;
    /** 按钮类型 */
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
    /** 按钮图标 */
    icon?: string;
    /** 是否为链接按钮 */
    link?: boolean;
    /** 是否为文字按钮 */
    plain?: boolean;
    /** 按钮尺寸 */
    size?: 'large' | 'default' | 'small';
    /** 是否显示（可以是函数） */
    show?: boolean | ((row: any) => boolean);
    /** 是否禁用（可以是函数） */
    disabled?: boolean | ((row: any) => boolean);
    /** 点击回调 */
    onClick: (row: any, index: number) => void;
    /** 确认提示 */
    confirm?: {
        title?: string;
        message?: string;
        type?: 'warning' | 'info' | 'success' | 'error';
    };
}

declare function useCrud(options: CrudOptions): {
    tableData: any;
    loading: any;
    fetchList: () => Promise<void>;
};

export { useCrud };
export type { ActionButton, CrudOptions, FilterParams, PaginationConfig, PaginationParams, SortParams, TableColumn, TableConfig };
