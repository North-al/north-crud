import type { DialogConfig, DialogFormConfig } from '../../types/dialog'

// CrudDialog 组件属性
export interface CrudDialogProps {
    /** 是否显示弹窗 */
    modelValue: boolean
    /** 弹窗配置 */
    config?: DialogConfig
    /** 是否加载中 */
    loading?: boolean
}

// CrudDialog 组件事件
export interface CrudDialogEmits {
    /** 更新显示状态 */
    'update:modelValue': (visible: boolean) => void
    /** 确认事件 */
    confirm: () => void
    /** 取消事件 */
    cancel: () => void
    /** 关闭事件 */
    close: () => void
}

// CrudFormDialog 组件属性
export interface CrudFormDialogProps extends CrudDialogProps {
    /** 表单配置 */
    formConfig?: DialogFormConfig
    /** 表单数据 */
    formData?: Record<string, any>
    /** 是否在确认时验证表单 */
    validateOnConfirm?: boolean
}

// CrudFormDialog 组件事件
export interface CrudFormDialogEmits extends CrudDialogEmits {
    /** 表单数据变化 */
    'form-change': (data: Record<string, any>) => void
    /** 表单提交 */
    'form-submit': (data: Record<string, any>) => void
}
