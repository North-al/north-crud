import type { FormField, FormFieldType, FormConfig, FormMode, FormEvents } from '../../types/form'
import type { FormInstance } from 'element-plus'

// CrudForm 组件属性
export interface CrudFormProps {
    /** 表单数据 */
    modelValue?: Record<string, any>
    /** 表单配置 */
    config: FormConfig
    /** 表单模式 */
    mode?: FormMode
    /** 是否显示提交按钮 */
    showSubmit?: boolean
    /** 是否显示重置按钮 */
    showReset?: boolean
    /** 提交按钮文本 */
    submitText?: string
    /** 重置按钮文本 */
    resetText?: string
    /** 是否加载中 */
    loading?: boolean
}

// CrudForm 组件暴露的方法
export interface CrudFormExpose {
    /** 表单实例 */
    formRef: FormInstance | undefined
    /** 验证表单 */
    validate: () => Promise<boolean>
    /** 验证指定字段 */
    validateField: (props: string | string[]) => Promise<boolean>
    /** 重置表单 */
    resetFields: () => void
    /** 清除验证 */
    clearValidate: (props?: string | string[]) => void
    /** 获取表单数据 */
    getFormData: () => Record<string, any>
    /** 设置表单数据 */
    setFormData: (data: Record<string, any>) => void
}
