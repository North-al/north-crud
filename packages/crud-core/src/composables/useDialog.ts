import { ref, computed, createApp, type App, type VNode, h } from 'vue'
import type { FormConfig, FormAction, FormMode } from '../types/form'

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

// 弹窗回调函数
export interface DialogCallbacks {
    /** 确认回调 */
    onConfirm?: (data?: any) => void | Promise<void>
    /** 取消回调 */
    onCancel?: () => void
    /** 关闭回调 */
    onClose?: () => void
    /** 表单数据变化回调 */
    onFormChange?: (data: Record<string, any>) => void
}

// 弹窗实例管理器
class DialogManager {
    private static instance: DialogManager
    private dialogs: Map<string, { app: App; container: HTMLElement }> = new Map()
    private dialogComponents: any = {}

    static getInstance(): DialogManager {
        if (!DialogManager.instance) {
            DialogManager.instance = new DialogManager()
        }
        return DialogManager.instance
    }

    // 注册弹窗组件
    registerComponent(name: string, component: any) {
        this.dialogComponents[name] = component
    }

    // 创建弹窗
    createDialog(
        id: string,
        componentName: string,
        props: any,
        callbacks: DialogCallbacks = {}
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.dialogs.has(id)) {
                this.destroyDialog(id)
            }

            const component = this.dialogComponents[componentName]
            if (!component) {
                reject(new Error(`弹窗组件 ${componentName} 未注册`))
                return
            }

            // 创建容器
            const container = document.createElement('div')
            container.id = `dialog-${id}`
            document.body.appendChild(container)

            // 创建应用实例
            const app = createApp({
                setup() {
                    const visible = ref(true)

                    const handleConfirm = async (data?: any) => {
                        try {
                            if (callbacks.onConfirm) {
                                await callbacks.onConfirm(data)
                            }
                            resolve(data)
                            this.destroyDialog(id)
                        } catch (error) {
                            reject(error)
                        }
                    }

                    const handleCancel = () => {
                        if (callbacks.onCancel) {
                            callbacks.onCancel()
                        }
                        resolve(null)
                        this.destroyDialog(id)
                    }

                    const handleClose = () => {
                        if (callbacks.onClose) {
                            callbacks.onClose()
                        }
                        resolve(null)
                        this.destroyDialog(id)
                    }

                    return () =>
                        h(component, {
                            ...props,
                            modelValue: visible.value,
                            'onUpdate:modelValue': (val: boolean) => {
                                visible.value = val
                                if (!val) {
                                    handleClose()
                                }
                            },
                            onConfirm: handleConfirm,
                            onCancel: handleCancel,
                            onClose: handleClose
                        })
                }
            })

            // 挂载应用
            app.mount(container)

            // 保存引用
            this.dialogs.set(id, { app, container })
        })
    }

    // 销毁弹窗
    destroyDialog(id: string) {
        const dialog = this.dialogs.get(id)
        if (dialog) {
            dialog.app.unmount()
            document.body.removeChild(dialog.container)
            this.dialogs.delete(id)
        }
    }

    // 销毁所有弹窗
    destroyAllDialogs() {
        for (const id of this.dialogs.keys()) {
            this.destroyDialog(id)
        }
    }
}

/**
 * 函数式弹窗 Hook
 */
export function useDialog() {
    const manager = DialogManager.getInstance()

    /**
     * 显示确认弹窗
     */
    const confirm = (
        message: string,
        config: Partial<DialogConfig> = {},
        callbacks: DialogCallbacks = {}
    ): Promise<boolean> => {
        const id = `confirm-${Date.now()}`
        const props = {
            config: {
                title: '确认',
                width: '400px',
                confirmText: '确定',
                cancelText: '取消',
                ...config
            },
            content: message
        }

        return manager.createDialog(id, 'CrudDialog', props, {
            onConfirm: async () => {
                if (callbacks.onConfirm) {
                    await callbacks.onConfirm()
                }
                return true
            },
            onCancel: () => {
                if (callbacks.onCancel) {
                    callbacks.onCancel()
                }
                return false
            }
        })
    }

    /**
     * 显示表单弹窗
     */
    const showForm = (
        formConfig: FormConfig,
        mode: FormAction = 'create',
        initialData: Record<string, any> = {},
        config: Partial<DialogConfig> = {},
        callbacks: DialogCallbacks = {}
    ): Promise<any> => {
        const id = `form-${Date.now()}`
        const props = {
            formConfig,
            config: {
                title: mode === 'create' ? '新增' : mode === 'edit' ? '编辑' : '查看',
                width: '600px',
                ...config
            },
            formData: { ...initialData },
            mode: { action: mode, readonly: mode === 'view' }
        }

        return manager.createDialog(id, 'CrudFormDialog', props, callbacks)
    }

    /**
     * 显示新增表单
     */
    const create = (
        formConfig: FormConfig,
        config: Partial<DialogConfig> = {},
        callbacks: Omit<DialogCallbacks, 'onConfirm'> & {
            onCreate?: (data: any) => void | Promise<void>
        } = {}
    ): Promise<any> => {
        return showForm(
            formConfig,
            'create',
            {},
            { title: '新增', ...config },
            {
                ...callbacks,
                onConfirm: callbacks.onCreate
            }
        )
    }

    /**
     * 显示编辑表单
     */
    const edit = (
        formConfig: FormConfig,
        initialData: Record<string, any>,
        config: Partial<DialogConfig> = {},
        callbacks: Omit<DialogCallbacks, 'onConfirm'> & {
            onUpdate?: (data: any) => void | Promise<void>
        } = {}
    ): Promise<any> => {
        return showForm(
            formConfig,
            'edit',
            initialData,
            { title: '编辑', ...config },
            {
                ...callbacks,
                onConfirm: callbacks.onUpdate
            }
        )
    }

    /**
     * 显示查看表单
     */
    const view = (
        formConfig: FormConfig,
        data: Record<string, any>,
        config: Partial<DialogConfig> = {}
    ): Promise<any> => {
        return showForm(formConfig, 'view', data, { title: '查看', ...config })
    }

    /**
     * 注册弹窗组件
     */
    const registerComponent = (name: string, component: any) => {
        manager.registerComponent(name, component)
    }

    return {
        confirm,
        showForm,
        create,
        edit,
        view,
        registerComponent,
        // 兼容性方法
        destroyAll: () => manager.destroyAllDialogs()
    }
}

/**
 * 专门用于表单弹窗的 Hook
 */
export function useFormDialog() {
    const dialog = useDialog()

    return {
        openCreateForm: dialog.create,
        openEditForm: dialog.edit,
        openViewForm: dialog.view
    }
}

/**
 * 专门用于确认弹窗的 Hook
 */
export function useConfirmDialog() {
    const dialog = useDialog()

    const open = (
        message: string,
        config: Partial<DialogConfig> = {},
        callbacks: DialogCallbacks = {}
    ) => {
        return dialog.confirm(message, config, callbacks)
    }

    const confirmDelete = (
        itemName: string = '此项',
        onConfirm?: () => void | Promise<void>
    ) => {
        return dialog.confirm(
            `确定要删除${itemName}吗？删除后无法恢复。`,
            {
                title: '删除确认',
                confirmText: '删除',
                cancelText: '取消'
            },
            { onConfirm }
        )
    }

    return {
        open,
        confirmDelete
    }
}
    config: DialogConfig
    /** 表单数据（如果是表单弹窗） */
    formData: Record<string, any>
}

// 弹窗回调函数
export interface DialogCallbacks {
    /** 确认回调 */
    onConfirm?: (data?: any) => void | Promise<void>
    /** 取消回调 */
    onCancel?: () => void
    /** 关闭回调 */
    onClose?: () => void
    /** 表单数据变化回调 */
    onFormChange?: (data: Record<string, any>) => void
}

// 弹窗操作方法
export interface DialogActions {
    /** 打开弹窗 */
    open: (config?: Partial<DialogConfig>, callbacks?: DialogCallbacks) => void
    /** 关闭弹窗 */
    close: () => void
    /** 确认操作 */
    confirm: (data?: any) => Promise<void>
    /** 取消操作 */
    cancel: () => void
    /** 设置加载状态 */
    setLoading: (loading: boolean) => void
    /** 更新配置 */
    updateConfig: (config: Partial<DialogConfig>) => void
    /** 更新表单数据 */
    updateFormData: (data: Record<string, any>) => void
}

/**
 * 通用弹窗 Hook
 */
export function useDialog() {
    const state = ref<DialogState>({
        visible: false,
        loading: false,
        config: {},
        formData: {}
    })

    let callbacks: DialogCallbacks = {}

    // 计算属性
    const isVisible = computed(() => state.value.visible)
    const isLoading = computed(() => state.value.loading)
    const dialogConfig = computed(() => state.value.config)
    const formData = computed(() => state.value.formData)

    /**
     * 打开弹窗
     */
    const open = (config: Partial<DialogConfig> = {}, cbs: DialogCallbacks = {}) => {
        state.value.config = {
            title: '弹窗',
            width: '50%',
            closeOnClickModal: false,
            closeOnPressEscape: true,
            showClose: true,
            showFooter: true,
            confirmText: '确定',
            cancelText: '取消',
            fullscreen: false,
            draggable: false,
            ...config
        }
        state.value.visible = true
        state.value.loading = false
        callbacks = cbs
    }

    /**
     * 关闭弹窗
     */
    const close = () => {
        state.value.visible = false
        state.value.loading = false
        state.value.formData = {}
        if (callbacks.onClose) {
            callbacks.onClose()
        }
        callbacks = {}
    }

    /**
     * 确认操作
     */
    const confirm = async (data?: any) => {
        if (callbacks.onConfirm) {
            try {
                state.value.loading = true
                await callbacks.onConfirm(data)
                close()
            } catch (error) {
                console.error('确认操作失败:', error)
                state.value.loading = false
            }
        } else {
            close()
        }
    }

    /**
     * 取消操作
     */
    const cancel = () => {
        if (callbacks.onCancel) {
            callbacks.onCancel()
        }
        close()
    }

    /**
     * 设置加载状态
     */
    const setLoading = (loading: boolean) => {
        state.value.loading = loading
    }

    /**
     * 更新配置
     */
    const updateConfig = (config: Partial<DialogConfig>) => {
        state.value.config = { ...state.value.config, ...config }
    }

    /**
     * 更新表单数据
     */
    const updateFormData = (data: Record<string, any>) => {
        state.value.formData = { ...data }
        if (callbacks.onFormChange) {
            callbacks.onFormChange(data)
        }
    }

    const actions: DialogActions = {
        open,
        close,
        confirm,
        cancel,
        setLoading,
        updateConfig,
        updateFormData
    }

    return {
        // 状态
        state: state as Ref<DialogState>,
        isVisible,
        isLoading,
        dialogConfig,
        formData,

        // 操作方法
        ...actions
    }
}

/**
 * 表单弹窗 Hook
 */
export function useFormDialog() {
    const dialog = useDialog()

    /**
     * 打开表单弹窗
     */
    const openForm = (
        config: DialogFormConfig,
        callbacks: DialogCallbacks & {
            onFormSubmit?: (data: Record<string, any>) => void | Promise<void>
        } = {}
    ) => {
        // 设置初始表单数据
        if (config.initialData) {
            dialog.updateFormData(config.initialData)
        }

        // 处理表单提交
        const handleFormSubmit = async (data: Record<string, any>) => {
            if (callbacks.onFormSubmit) {
                await callbacks.onFormSubmit(data)
            } else if (callbacks.onConfirm) {
                await callbacks.onConfirm(data)
            }
        }

        // 设置弹窗标题
        let title = config.title
        if (!title && config.mode) {
            switch (config.mode.action) {
                case 'create':
                    title = '新增'
                    break
                case 'edit':
                    title = '编辑'
                    break
                case 'view':
                    title = '查看'
                    break
                default:
                    title = '表单'
            }
        }

        dialog.open(
            {
                ...config,
                title
            },
            {
                ...callbacks,
                onConfirm: handleFormSubmit
            }
        )
    }

    /**
     * 新增表单
     */
    const openCreateForm = (
        formConfig: FormConfig,
        config: Partial<DialogConfig> = {},
        callbacks: DialogCallbacks & {
            onCreate?: (data: Record<string, any>) => void | Promise<void>
        } = {}
    ) => {
        openForm(
            {
                ...config,
                formConfig,
                mode: { action: 'create' },
                title: config.title || '新增'
            },
            {
                ...callbacks,
                onFormSubmit: callbacks.onCreate
            }
        )
    }

    /**
     * 编辑表单
     */
    const openEditForm = (
        formConfig: FormConfig,
        initialData: Record<string, any>,
        config: Partial<DialogConfig> = {},
        callbacks: DialogCallbacks & {
            onUpdate?: (data: Record<string, any>) => void | Promise<void>
        } = {}
    ) => {
        openForm(
            {
                ...config,
                formConfig,
                mode: { action: 'edit' },
                initialData,
                title: config.title || '编辑'
            },
            {
                ...callbacks,
                onFormSubmit: callbacks.onUpdate
            }
        )
    }

    /**
     * 查看表单
     */
    const openViewForm = (formConfig: FormConfig, data: Record<string, any>, config: Partial<DialogConfig> = {}) => {
        openForm({
            ...config,
            formConfig,
            mode: { action: 'view', readonly: true },
            initialData: data,
            title: config.title || '查看',
            showFooter: false
        })
    }

    return {
        ...dialog,
        openForm,
        openCreateForm,
        openEditForm,
        openViewForm
    }
}

/**
 * 确认对话框 Hook
 */
export function useConfirmDialog() {
    const dialog = useDialog()

    /**
     * 显示确认对话框
     */
    const confirm = (message: string, title = '确认', config: Partial<DialogConfig> = {}): Promise<boolean> => {
        return new Promise(resolve => {
            dialog.open(
                {
                    title,
                    width: '400px',
                    ...config
                },
                {
                    onConfirm: () => {
                        resolve(true)
                    },
                    onCancel: () => {
                        resolve(false)
                    },
                    onClose: () => {
                        resolve(false)
                    }
                }
            )
        })
    }

    /**
     * 删除确认对话框
     */
    const confirmDelete = (message = '确定要删除这条记录吗？', title = '删除确认'): Promise<boolean> => {
        return confirm(message, title, {
            confirmText: '删除',
            cancelText: '取消'
        })
    }

    return {
        ...dialog,
        confirm,
        confirmDelete
    }
}
