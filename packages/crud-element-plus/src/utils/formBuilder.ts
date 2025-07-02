import type { FormConfig, FormField, FormFieldType, FormFieldOption } from '../types/form'

/**
 * 表单字段构建器
 */
export class FormFieldBuilder {
    private field: Partial<FormField>

    constructor(prop: string, label: string, type: FormFieldType) {
        this.field = {
            prop,
            label,
            type
        }
    }

    /**
     * 设置默认值
     */
    defaultValue(value: any): this {
        this.field.defaultValue = value
        return this
    }

    /**
     * 设置占位符
     */
    placeholder(text: string): this {
        this.field.placeholder = text
        return this
    }

    /**
     * 设置为必填
     */
    required(required = true): this {
        this.field.required = required
        return this
    }

    /**
     * 设置禁用状态
     */
    disabled(disabled = true): this {
        this.field.disabled = disabled
        return this
    }

    /**
     * 设置只读状态
     */
    readonly(readonly = true): this {
        this.field.readonly = readonly
        return this
    }

    /**
     * 设置栅格宽度
     */
    span(span: number): this {
        this.field.span = span
        return this
    }

    /**
     * 设置验证规则
     */
    rules(rules: any[]): this {
        this.field.rules = rules
        return this
    }

    /**
     * 设置选项（用于 select、radio、checkbox）
     */
    options(options: FormFieldOption[]): this {
        this.field.options = options
        return this
    }

    /**
     * 设置组件属性
     */
    componentProps(props: Record<string, any>): this {
        this.field.componentProps = { ...this.field.componentProps, ...props }
        return this
    }

    /**
     * 设置显示条件
     */
    show(show: boolean | ((formData: any) => boolean)): this {
        this.field.show = show
        return this
    }

    /**
     * 设置依赖字段
     */
    dependencies(deps: string[]): this {
        this.field.dependencies = deps
        return this
    }

    /**
     * 设置自定义渲染函数
     */
    render(renderFn: (field: FormField, formData: any) => any): this {
        this.field.render = renderFn
        return this
    }

    /**
     * 设置字段变化回调
     */
    onChange(callback: (value: any, formData: any) => void): this {
        this.field.onChange = callback
        return this
    }

    /**
     * 构建字段配置
     */
    build(): FormField {
        return { ...this.field } as FormField
    }
}

/**
 * 表单构建器
 */
export class FormBuilder {
    private config: Partial<FormConfig> = {
        fields: []
    }

    /**
     * 添加字段
     */
    addField(field: FormField | FormFieldBuilder): this {
        const fieldConfig = field instanceof FormFieldBuilder ? field.build() : field
        this.config.fields = this.config.fields || []
        this.config.fields.push(fieldConfig)
        return this
    }

    /**
     * 批量添加字段
     */
    addFields(fields: (FormField | FormFieldBuilder)[]): this {
        fields.forEach(field => this.addField(field))
        return this
    }

    /**
     * 设置布局
     */
    layout(layout: 'horizontal' | 'vertical' | 'inline'): this {
        this.config.layout = layout
        return this
    }

    /**
     * 设置标签宽度
     */
    labelWidth(width: string | number): this {
        this.config.labelWidth = width
        return this
    }

    /**
     * 设置标签位置
     */
    labelPosition(position: 'left' | 'right' | 'top'): this {
        this.config.labelPosition = position
        return this
    }

    /**
     * 设置栅格间距
     */
    gutter(gutter: number): this {
        this.config.gutter = gutter
        return this
    }

    /**
     * 设置表单尺寸
     */
    size(size: 'large' | 'default' | 'small'): this {
        this.config.size = size
        return this
    }

    /**
     * 设置必填标记位置
     */
    requireAsteriskPosition(position: 'left' | 'right'): this {
        this.config.requireAsteriskPosition = position
        return this
    }

    /**
     * 隐藏必填标记
     */
    hideRequiredAsterisk(hide = true): this {
        this.config.hideRequiredAsterisk = hide
        return this
    }

    /**
     * 设置表单验证规则
     */
    rules(rules: Record<string, any[]>): this {
        this.config.rules = rules
        return this
    }

    /**
     * 设置禁用状态
     */
    disabled(disabled = true): this {
        this.config.disabled = disabled
        return this
    }

    /**
     * 构建表单配置
     */
    build(): FormConfig {
        return this.config as FormConfig
    }
}

/**
 * 创建表单字段
 */
export const createFormField = (prop: string, label: string, type: FormFieldType): FormFieldBuilder => {
    return new FormFieldBuilder(prop, label, type)
}

/**
 * 创建表单构建器
 */
export const createForm = (): FormBuilder => {
    return new FormBuilder()
}

/**
 * 常用表单字段快捷方法
 */
export const commonFields = {
    /**
     * 文本输入框
     */
    input: (prop: string, label: string, required = false): FormFieldBuilder => {
        return createFormField(prop, label, 'input').required(required)
    },

    /**
     * 多行文本框
     */
    textarea: (prop: string, label: string, required = false): FormFieldBuilder => {
        return createFormField(prop, label, 'textarea').required(required)
    },

    /**
     * 密码输入框
     */
    password: (prop: string, label: string, required = false): FormFieldBuilder => {
        return createFormField(prop, label, 'password').required(required)
    },

    /**
     * 数字输入框
     */
    number: (prop: string, label: string, required = false): FormFieldBuilder => {
        return createFormField(prop, label, 'number').required(required)
    },

    /**
     * 下拉选择框
     */
    select: (prop: string, label: string, options: FormFieldOption[], required = false): FormFieldBuilder => {
        return createFormField(prop, label, 'select').options(options).required(required)
    },

    /**
     * 单选框组
     */
    radio: (prop: string, label: string, options: FormFieldOption[], required = false): FormFieldBuilder => {
        return createFormField(prop, label, 'radio').options(options).required(required)
    },

    /**
     * 复选框组
     */
    checkbox: (prop: string, label: string, options: FormFieldOption[], required = false): FormFieldBuilder => {
        return createFormField(prop, label, 'checkbox').options(options).required(required)
    },

    /**
     * 开关
     */
    switch: (prop: string, label: string, required = false): FormFieldBuilder => {
        return createFormField(prop, label, 'switch').required(required)
    },

    /**
     * 日期选择器
     */
    date: (prop: string, label: string, required = false): FormFieldBuilder => {
        return createFormField(prop, label, 'date').required(required)
    },

    /**
     * 日期时间选择器
     */
    datetime: (prop: string, label: string, required = false): FormFieldBuilder => {
        return createFormField(prop, label, 'datetime').required(required)
    },

    /**
     * 时间选择器
     */
    time: (prop: string, label: string, required = false): FormFieldBuilder => {
        return createFormField(prop, label, 'time').required(required)
    },

    /**
     * 级联选择器
     */
    cascader: (prop: string, label: string, options: FormFieldOption[], required = false): FormFieldBuilder => {
        return createFormField(prop, label, 'cascader').options(options).required(required)
    }
}
