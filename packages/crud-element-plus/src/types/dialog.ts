import type { FormConfig, FormMode } from './form'

// 弹窗配置接口
export interface DialogConfig {
    /** 弹窗标题 */
    title?: string
    /** 弹窗宽度 */
    width?: string | number
    /** 是否可以通过点击模态框关闭弹窗 */
    closeOnClickModal?: boolean
    /** 是否可以通过按下 ESC 关闭弹窗 */
    closeOnPressEscape?: boolean
    /** 是否显示关闭按钮 */
    showClose?: boolean
    /** 是否显示底部操作区 */
    showFooter?: boolean
    /** 确认按钮文本 */
    confirmText?: string
    /** 取消按钮文本 */
    cancelText?: string
    /** 是否全屏显示 */
    fullscreen?: boolean
    /** 弹窗层级 */
    zIndex?: number
    /** 自定义类名 */
    customClass?: string
    /** 是否可以拖拽 */
    draggable?: boolean
}

// 弹窗表单配置
export interface DialogFormConfig extends DialogConfig {
    /** 表单配置 */
    formConfig: FormConfig
    /** 表单模式 */
    mode?: FormMode
    /** 初始表单数据 */
    initialData?: Record<string, any>
    /** 是否在确认时验证表单 */
    validateOnConfirm?: boolean
}
