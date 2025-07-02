// 表单字段类型
export type FormFieldType =
    | 'input'
    | 'textarea'
    | 'password'
    | 'number'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'date'
    | 'datetime'
    | 'time'
    | 'upload'
    | 'switch'
    | 'cascader'
    | 'tree-select'

// 表单字段选项
export interface FormFieldOption {
    label: string
    value: any
    disabled?: boolean
    children?: FormFieldOption[]
}

// 表单字段配置
export interface FormField {
    /** 字段名 */
    prop: string
    /** 标签文本 */
    label: string
    /** 字段类型 */
    type: FormFieldType
    /** 默认值 */
    defaultValue?: any
    /** 占位符 */
    placeholder?: string
    /** 是否必填 */
    required?: boolean
    /** 是否禁用 */
    disabled?: boolean
    /** 是否只读 */
    readonly?: boolean
    /** 字段宽度（栅格） */
    span?: number
    /** 验证规则 */
    rules?: any[]
    /** 选项数据（用于 select、radio、checkbox 等） */
    options?: FormFieldOption[]
    /** 组件属性 */
    componentProps?: Record<string, any>
    /** 是否显示 */
    show?: boolean | ((formData: any) => boolean)
    /** 依赖字段（当依赖字段变化时重新渲染） */
    dependencies?: string[]
    /** 自定义渲染函数 */
    render?: (field: FormField, formData: any) => any
    /** 字段变化回调 */
    onChange?: (value: any, formData: any) => void
}

// 表单布局类型
export type FormLayout = 'horizontal' | 'vertical' | 'inline'

// 表单配置
export interface FormConfig {
    /** 表单字段列表 */
    fields: FormField[]
    /** 表单布局 */
    layout?: FormLayout
    /** 标签宽度 */
    labelWidth?: string | number
    /** 标签位置 */
    labelPosition?: 'left' | 'right' | 'top'
    /** 栅格间距 */
    gutter?: number
    /** 表单尺寸 */
    size?: 'large' | 'default' | 'small'
    /** 是否显示必填标记 */
    requireAsteriskPosition?: 'left' | 'right'
    /** 是否隐藏必填标记 */
    hideRequiredAsterisk?: boolean
    /** 表单验证规则 */
    rules?: Record<string, any[]>
    /** 是否禁用整个表单 */
    disabled?: boolean
}

// 表单操作类型
export type FormAction = 'create' | 'edit' | 'view'

// 表单模式配置
export interface FormMode {
    /** 操作类型 */
    action: FormAction
    /** 是否只读模式 */
    readonly?: boolean
    /** 标题 */
    title?: string
}

// 表单事件
export interface FormEvents {
    /** 表单数据变化 */
    'update:modelValue': (value: Record<string, any>) => void
    /** 字段值变化 */
    'field-change': (prop: string, value: any, formData: Record<string, any>) => void
    /** 表单提交 */
    submit: (formData: Record<string, any>) => void
    /** 表单重置 */
    reset: () => void
    /** 表单验证完成 */
    validate: (isValid: boolean, invalidFields?: any) => void
}

// 本包特有的表单相关类型
export interface FormFieldRenderContext {
    field: FormField
    formData: Record<string, any>
    disabled: boolean
    readonly: boolean
}
