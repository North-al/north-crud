import { defineComponent, ref, computed, watch, type PropType } from 'vue'
import CrudDialog from './index'
import CrudForm from '../CrudForm/index'
import type { DialogFormConfig } from '../../types/dialog'
import type { FormConfig } from '../../types/form'

export default defineComponent({
    name: 'CrudFormDialog',
    components: {
        CrudDialog,
        CrudForm
    },
    props: {
        // 是否显示弹窗
        modelValue: {
            type: Boolean,
            required: true
        },
        // 表单配置
        formConfig: {
            type: Object as PropType<FormConfig>,
            required: true
        },
        // 弹窗配置
        config: {
            type: Object as PropType<Partial<DialogFormConfig>>,
            default: () => ({})
        },
        // 表单数据
        formData: {
            type: Object as PropType<Record<string, any>>,
            default: () => ({})
        },
        // 是否加载中
        loading: {
            type: Boolean,
            default: false
        },
        // 是否在确认时验证表单
        validateOnConfirm: {
            type: Boolean,
            default: true
        }
    },
    emits: ['update:modelValue', 'confirm', 'cancel', 'close', 'form-change', 'form-submit'],
    setup(props, { emit }) {
        const formRef = ref()
        const internalFormData = ref<Record<string, any>>({})

        // 监听外部表单数据变化
        watch(
            () => props.formData,
            newData => {
                internalFormData.value = { ...newData }
            },
            { immediate: true, deep: true }
        )

        // 监听弹窗显示状态，重置表单数据
        watch(
            () => props.modelValue,
            visible => {
                if (visible) {
                    internalFormData.value = { ...props.formData }
                }
            }
        )

        // 计算弹窗配置
        const dialogConfig = computed(() => {
            let title = props.config.title
            if (!title && props.config.mode) {
                switch (props.config.mode.action) {
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

            return {
                title: title || '表单',
                width: '600px',
                ...props.config
            }
        })

        // 处理表单数据变化
        const handleFormChange = (data: Record<string, any>) => {
            internalFormData.value = data
            emit('form-change', data)
        }

        // 处理确认
        const handleConfirm = async () => {
            if (props.validateOnConfirm && formRef.value) {
                const isValid = await formRef.value.validate()
                if (!isValid) {
                    return
                }
            }

            emit('form-submit', internalFormData.value)
            emit('confirm')
        }

        // 处理取消
        const handleCancel = () => {
            emit('cancel')
        }

        // 处理关闭
        const handleClose = () => {
            emit('close')
        }

        // 处理表单提交
        const handleFormSubmit = (data: Record<string, any>) => {
            emit('form-submit', data)
        }

        return () => {
            const config = dialogConfig.value

            return (
                <CrudDialog
                    modelValue={props.modelValue}
                    onUpdate:modelValue={(visible: boolean) => emit('update:modelValue', visible)}
                    config={config}
                    loading={props.loading}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    onClose={handleClose}>
                    <CrudForm
                        ref={formRef}
                        modelValue={internalFormData.value}
                        onUpdate:modelValue={handleFormChange}
                        config={props.formConfig}
                        mode={props.config.mode}
                        showSubmit={false}
                        showReset={false}
                        onSubmit={handleFormSubmit}
                        onField-change={(prop: string, value: any, formData: Record<string, any>) => {
                            emit('form-change', formData)
                        }}
                    />
                </CrudDialog>
            )
        }
    }
})
