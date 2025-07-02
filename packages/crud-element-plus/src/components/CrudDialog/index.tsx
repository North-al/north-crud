import { defineComponent, computed, type PropType } from 'vue'
import { ElDialog, ElButton, ElSpace } from 'element-plus'
import type { DialogConfig } from '../../types/dialog'

export default defineComponent({
    name: 'CrudDialog',
    props: {
        // 是否显示弹窗
        modelValue: {
            type: Boolean,
            required: true
        },
        // 弹窗配置
        config: {
            type: Object as PropType<DialogConfig>,
            default: () => ({})
        },
        // 是否加载中
        loading: {
            type: Boolean,
            default: false
        }
    },
    emits: ['update:modelValue', 'confirm', 'cancel', 'close'],
    setup(props, { emit, slots }) {
        // 计算弹窗配置
        const dialogConfig = computed(() => ({
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
            ...props.config
        }))

        // 处理弹窗显示状态变化
        const handleVisibleChange = (visible: boolean) => {
            emit('update:modelValue', visible)
            if (!visible) {
                emit('close')
            }
        }

        // 处理确认
        const handleConfirm = () => {
            emit('confirm')
        }

        // 处理取消
        const handleCancel = () => {
            emit('cancel')
            emit('update:modelValue', false)
        }

        return () => {
            const config = dialogConfig.value

            return (
                <ElDialog
                    modelValue={props.modelValue}
                    onUpdate:modelValue={handleVisibleChange}
                    title={config.title}
                    width={config.width}
                    closeOnClickModal={config.closeOnClickModal}
                    closeOnPressEscape={config.closeOnPressEscape}
                    showClose={config.showClose}
                    fullscreen={config.fullscreen}
                    zIndex={config.zIndex}
                    customClass={config.customClass}
                    draggable={config.draggable}>
                    {{
                        // 弹窗内容
                        default: () => slots.default?.(),

                        // 底部操作区
                        footer: () =>
                            config.showFooter ? (
                                <ElSpace>
                                    <ElButton onClick={handleCancel}>{config.cancelText}</ElButton>
                                    <ElButton type='primary' loading={props.loading} onClick={handleConfirm}>
                                        {config.confirmText}
                                    </ElButton>
                                </ElSpace>
                            ) : (
                                slots.footer?.()
                            )
                    }}
                </ElDialog>
            )
        }
    }
})
