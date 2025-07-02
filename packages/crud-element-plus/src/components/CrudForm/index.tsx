import { defineComponent, ref, computed, watch, nextTick, type PropType } from 'vue'
import {
    ElForm,
    ElFormItem,
    ElRow,
    ElCol,
    ElInput,
    ElInputNumber,
    ElSelect,
    ElOption,
    ElRadio,
    ElRadioGroup,
    ElCheckbox,
    ElCheckboxGroup,
    ElSwitch,
    ElDatePicker,
    ElTimePicker,
    ElCascader,
    ElTreeSelect,
    ElUpload,
    ElButton,
    type FormInstance,
    type FormRules
} from 'element-plus'
import type { FormConfig, FormField, FormMode, FormFieldRenderContext } from '../../types/form'
import type { CrudFormProps, CrudFormExpose } from './props'

export default defineComponent({
    name: 'CrudForm',
    props: {
        // 表单数据
        modelValue: {
            type: Object as PropType<Record<string, any>>,
            default: () => ({})
        },
        // 表单配置
        config: {
            type: Object as PropType<FormConfig>,
            required: true
        },
        // 表单模式
        mode: {
            type: Object as PropType<FormMode>,
            default: () => ({ action: 'create' })
        },
        // 是否显示提交按钮
        showSubmit: {
            type: Boolean,
            default: true
        },
        // 是否显示重置按钮
        showReset: {
            type: Boolean,
            default: true
        },
        // 提交按钮文本
        submitText: {
            type: String,
            default: '提交'
        },
        // 重置按钮文本
        resetText: {
            type: String,
            default: '重置'
        },
        // 是否加载中
        loading: {
            type: Boolean,
            default: false
        }
    },
    emits: ['update:modelValue', 'field-change', 'submit', 'reset', 'validate'],
    setup(props, { emit, expose }) {
        const formRef = ref<FormInstance>()
        const formData = ref<Record<string, any>>({ ...props.modelValue })

        // 监听外部数据变化
        watch(
            () => props.modelValue,
            newVal => {
                formData.value = { ...newVal }
            },
            { deep: true }
        )

        // 监听内部数据变化，同步到外部
        watch(
            formData,
            newVal => {
                emit('update:modelValue', newVal)
            },
            { deep: true }
        )

        // 计算表单是否只读
        const isReadonly = computed(() => {
            return props.mode?.readonly || props.mode?.action === 'view'
        })

        // 计算表单是否禁用
        const isDisabled = computed(() => {
            return props.config.disabled || isReadonly.value
        })

        // 计算表单规则
        const formRules = computed<FormRules>(() => {
            const rules: FormRules = { ...props.config.rules }

            // 自动生成必填规则
            props.config.fields.forEach(field => {
                if (field.required) {
                    const fieldRules = Array.isArray(rules[field.prop])
                        ? (rules[field.prop] as any[])
                        : [rules[field.prop]].filter(Boolean)
                    const hasRequiredRule = fieldRules.some((rule: any) => rule.required)

                    if (!hasRequiredRule) {
                        fieldRules.unshift({
                            required: true,
                            message: `请输入${field.label}`,
                            trigger: getValidationTrigger(field.type)
                        })
                        rules[field.prop] = fieldRules
                    }
                }

                // 添加字段自定义规则
                if (field.rules && field.rules.length > 0) {
                    const existingRules = Array.isArray(rules[field.prop])
                        ? (rules[field.prop] as any[])
                        : [rules[field.prop]].filter(Boolean)
                    rules[field.prop] = [...existingRules, ...field.rules]
                }
            })

            return rules
        })

        // 获取验证触发方式
        const getValidationTrigger = (type: string): string | string[] => {
            switch (type) {
                case 'select':
                case 'cascader':
                case 'tree-select':
                case 'date':
                case 'datetime':
                case 'time':
                    return 'change'
                case 'input':
                case 'textarea':
                case 'password':
                case 'number':
                default:
                    return 'blur'
            }
        }

        // 过滤可见字段
        const visibleFields = computed(() => {
            return props.config.fields.filter(field => {
                if (typeof field.show === 'function') {
                    return field.show(formData.value)
                }
                return field.show !== false
            })
        })

        // 字段值变化处理
        const handleFieldChange = (field: FormField, value: any) => {
            formData.value[field.prop] = value
            emit('field-change', field.prop, value, formData.value)

            // 执行字段的 onChange 回调
            if (field.onChange) {
                field.onChange(value, formData.value)
            }
        }

        // 渲染表单字段
        const renderFormField = (field: FormField) => {
            const context: FormFieldRenderContext = {
                field,
                formData: formData.value,
                disabled: isDisabled.value || field.disabled || false,
                readonly: isReadonly.value || field.readonly || false
            }

            // 如果有自定义渲染函数，使用自定义渲染
            if (field.render) {
                return field.render(field, formData.value)
            }

            const commonProps = {
                disabled: context.disabled,
                readonly: context.readonly,
                placeholder: field.placeholder || `请输入${field.label}`,
                ...field.componentProps
            }

            const value = formData.value[field.prop] ?? field.defaultValue

            switch (field.type) {
                case 'input':
                    return (
                        <ElInput
                            {...commonProps}
                            modelValue={value}
                            onUpdate:modelValue={(val: string) => handleFieldChange(field, val)}
                        />
                    )

                case 'textarea':
                    return (
                        <ElInput
                            {...commonProps}
                            type='textarea'
                            autosize={{ minRows: 3 }}
                            modelValue={value}
                            onUpdate:modelValue={(val: string) => handleFieldChange(field, val)}
                        />
                    )

                case 'password':
                    return (
                        <ElInput
                            {...commonProps}
                            type='password'
                            showPassword
                            modelValue={value}
                            onUpdate:modelValue={(val: string) => handleFieldChange(field, val)}
                        />
                    )

                case 'number':
                    return (
                        <ElInputNumber
                            {...commonProps}
                            modelValue={value}
                            onUpdate:modelValue={(val: number) => handleFieldChange(field, val)}
                        />
                    )

                case 'select':
                    return (
                        <ElSelect
                            {...commonProps}
                            placeholder={field.placeholder || `请选择${field.label}`}
                            modelValue={value}
                            onUpdate:modelValue={(val: any) => handleFieldChange(field, val)}>
                            {field.options?.map(option => (
                                <ElOption
                                    key={option.value}
                                    label={option.label}
                                    value={option.value}
                                    disabled={option.disabled}
                                />
                            ))}
                        </ElSelect>
                    )

                case 'radio':
                    return (
                        <ElRadioGroup
                            {...commonProps}
                            modelValue={value}
                            onUpdate:modelValue={(val: any) => handleFieldChange(field, val)}>
                            {field.options?.map(option => (
                                <ElRadio key={option.value} label={option.value} disabled={option.disabled}>
                                    {option.label}
                                </ElRadio>
                            ))}
                        </ElRadioGroup>
                    )

                case 'checkbox':
                    return (
                        <ElCheckboxGroup
                            {...commonProps}
                            modelValue={value || []}
                            onUpdate:modelValue={(val: any[]) => handleFieldChange(field, val)}>
                            {field.options?.map(option => (
                                <ElCheckbox key={option.value} label={option.value} disabled={option.disabled}>
                                    {option.label}
                                </ElCheckbox>
                            ))}
                        </ElCheckboxGroup>
                    )

                case 'switch':
                    return (
                        <ElSwitch
                            {...commonProps}
                            modelValue={value}
                            onUpdate:modelValue={(val: boolean) => handleFieldChange(field, val)}
                        />
                    )

                case 'date':
                    return (
                        <ElDatePicker
                            {...commonProps}
                            type='date'
                            placeholder={field.placeholder || `请选择${field.label}`}
                            modelValue={value}
                            onUpdate:modelValue={(val: Date) => handleFieldChange(field, val)}
                        />
                    )

                case 'datetime':
                    return (
                        <ElDatePicker
                            {...commonProps}
                            type='datetime'
                            placeholder={field.placeholder || `请选择${field.label}`}
                            modelValue={value}
                            onUpdate:modelValue={(val: Date) => handleFieldChange(field, val)}
                        />
                    )

                case 'time':
                    return (
                        <ElTimePicker
                            {...commonProps}
                            placeholder={field.placeholder || `请选择${field.label}`}
                            modelValue={value}
                            onUpdate:modelValue={(val: Date) => handleFieldChange(field, val)}
                        />
                    )

                case 'cascader':
                    return (
                        <ElCascader
                            {...commonProps}
                            options={field.options}
                            placeholder={field.placeholder || `请选择${field.label}`}
                            modelValue={value}
                            onUpdate:modelValue={(val: any) => handleFieldChange(field, val)}
                        />
                    )

                case 'tree-select':
                    return (
                        <ElTreeSelect
                            {...commonProps}
                            data={field.options}
                            placeholder={field.placeholder || `请选择${field.label}`}
                            modelValue={value}
                            onUpdate:modelValue={(val: any) => handleFieldChange(field, val)}
                        />
                    )

                default:
                    return (
                        <ElInput
                            {...commonProps}
                            modelValue={value}
                            onUpdate:modelValue={(val: string) => handleFieldChange(field, val)}
                        />
                    )
            }
        }

        // 表单验证
        const validate = async (): Promise<boolean> => {
            if (!formRef.value) return false

            try {
                await formRef.value.validate()
                emit('validate', true)
                return true
            } catch (error) {
                emit('validate', false, error)
                return false
            }
        }

        // 验证指定字段
        const validateField = async (props: string | string[]): Promise<boolean> => {
            if (!formRef.value) return false

            try {
                await formRef.value.validateField(props)
                return true
            } catch (error) {
                return false
            }
        }

        // 重置表单
        const resetFields = () => {
            if (formRef.value) {
                formRef.value.resetFields()
                // 重置为默认值
                const resetData: Record<string, any> = {}
                props.config.fields.forEach(field => {
                    if (field.defaultValue !== undefined) {
                        resetData[field.prop] = field.defaultValue
                    }
                })
                formData.value = resetData
                emit('reset')
            }
        }

        // 清除验证
        const clearValidate = (props?: string | string[]) => {
            if (formRef.value) {
                formRef.value.clearValidate(props)
            }
        }

        // 获取表单数据
        const getFormData = () => {
            return { ...formData.value }
        }

        // 设置表单数据
        const setFormData = (data: Record<string, any>) => {
            formData.value = { ...data }
        }

        // 提交表单
        const handleSubmit = async () => {
            const isValid = await validate()
            if (isValid) {
                emit('submit', getFormData())
            }
        }

        // 暴露方法
        const exposedMethods = {
            get formRef() {
                return formRef.value
            },
            validate,
            validateField,
            resetFields,
            clearValidate,
            getFormData,
            setFormData
        }

        expose(exposedMethods)

        return () => {
            const { config } = props
            const formProps = {
                ref: formRef,
                model: formData.value,
                rules: formRules.value,
                labelWidth: config.labelWidth || '120px',
                labelPosition: config.labelPosition || 'right',
                size: config.size || 'default',
                disabled: isDisabled.value,
                requireAsteriskPosition: config.requireAsteriskPosition || 'left',
                hideRequiredAsterisk: config.hideRequiredAsterisk || false
            }

            return (
                <>
                    <div class='crud-form'>
                        <ElForm {...formProps}>
                            {config.layout === 'inline' ? (
                                // 内联布局
                                visibleFields.value.map(field => (
                                    <ElFormItem
                                        key={field.prop}
                                        label={field.label}
                                        prop={field.prop}
                                        style={{ marginRight: '16px' }}>
                                        {renderFormField(field)}
                                    </ElFormItem>
                                ))
                            ) : (
                                // 栅格布局
                                <ElRow gutter={config.gutter || 16}>
                                    {visibleFields.value.map(field => (
                                        <ElCol key={field.prop} span={field.span || 24}>
                                            <ElFormItem label={field.label} prop={field.prop}>
                                                {renderFormField(field)}
                                            </ElFormItem>
                                        </ElCol>
                                    ))}
                                </ElRow>
                            )}

                            {/* 操作按钮 */}
                            {(props.showSubmit || props.showReset) && !isReadonly.value && (
                                <ElFormItem style={{ marginTop: '24px' }}>
                                    {props.showSubmit && (
                                        <ElButton type='primary' loading={props.loading} onClick={handleSubmit}>
                                            {props.submitText}
                                        </ElButton>
                                    )}
                                    {props.showReset && (
                                        <ElButton style={{ marginLeft: '12px' }} onClick={resetFields}>
                                            {props.resetText}
                                        </ElButton>
                                    )}
                                </ElFormItem>
                            )}
                        </ElForm>
                    </div>
                </>
            )
        }
    }
})
