<template>
    <div class="form-demo">
        <h2>表单示例</h2>

        <!-- 基础表单 -->
        <div class="demo-section">
            <h3>基础表单</h3>
            <CrudForm
                v-model="formData"
                :config="basicFormConfig"
                @submit="handleSubmit"
                @field-change="handleFieldChange" />
        </div>

        <!-- 使用构建器创建的表单 -->
        <div class="demo-section">
            <h3>使用构建器创建的表单</h3>
            <CrudForm v-model="builderFormData" :config="builderFormConfig" @submit="handleBuilderSubmit" />
        </div>

        <div class="demo-section">
            <h3>内联表单</h3>
            <CrudForm v-model="inlineFormData" :config="inlineFormConfig" @submit="handleInlineSubmit" />
        </div>

        <div class="demo-section">
            <h3>只读表单</h3>
            <CrudForm
                v-model="readonlyFormData"
                :config="basicFormConfig"
                :mode="{ action: 'view', readonly: true }"
                :show-submit="false"
                :show-reset="false" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, reactive } from 'vue'
    import { ElMessage } from 'element-plus'
    import { CrudForm, createForm, commonFields } from '@el/index'
    import type { FormConfig } from '@el/types/form'

    // 基础表单数据
    const formData = ref({
        name: '',
        email: '',
        age: null,
        gender: '',
        skills: [],
        isActive: false,
        description: '',
        birthDate: null
    })

    // 构建器表单数据
    const builderFormData = ref({
        username: '',
        password: '',
        department: '',
        role: '',
        phone: ''
    })

    // 内联表单数据
    const inlineFormData = ref({
        keyword: '',
        status: '',
        dateRange: null
    })

    // 只读表单数据
    const readonlyFormData = ref({
        name: '张三',
        email: 'zhangsan@example.com',
        age: 25,
        gender: 'male',
        skills: ['Vue', 'TypeScript'],
        isActive: true,
        description: '这是一个示例描述',
        birthDate: new Date('1998-05-15')
    })

    // 基础表单配置
    const basicFormConfig: FormConfig = {
        fields: [
            {
                prop: 'name',
                label: '姓名',
                type: 'input',
                required: true,
                span: 12,
                placeholder: '请输入姓名'
            },
            {
                prop: 'email',
                label: '邮箱',
                type: 'input',
                required: true,
                span: 12,
                placeholder: '请输入邮箱地址',
                rules: [
                    {
                        type: 'email',
                        message: '请输入正确的邮箱地址',
                        trigger: 'blur'
                    }
                ]
            },
            {
                prop: 'age',
                label: '年龄',
                type: 'number',
                span: 12,
                componentProps: {
                    min: 1,
                    max: 120
                }
            },
            {
                prop: 'gender',
                label: '性别',
                type: 'radio',
                span: 12,
                options: [
                    { label: '男', value: 'male' },
                    { label: '女', value: 'female' }
                ]
            },
            {
                prop: 'skills',
                label: '技能',
                type: 'checkbox',
                span: 24,
                options: [
                    { label: 'Vue', value: 'Vue' },
                    { label: 'React', value: 'React' },
                    { label: 'TypeScript', value: 'TypeScript' },
                    { label: 'Node.js', value: 'Node.js' }
                ]
            },
            {
                prop: 'isActive',
                label: '是否激活',
                type: 'switch',
                span: 12
            },
            {
                prop: 'birthDate',
                label: '出生日期',
                type: 'date',
                span: 12
            },
            {
                prop: 'description',
                label: '描述',
                type: 'textarea',
                span: 24,
                placeholder: '请输入描述信息'
            }
        ],
        labelWidth: '100px',
        gutter: 16
    }

    // 使用构建器创建的表单配置
    const builderFormConfig = createForm()
        .labelWidth('120px')
        .gutter(20)
        .addFields([
            commonFields.input('username', '用户名', true).span(12).placeholder('请输入用户名'),

            commonFields.password('password', '密码', true).span(12).placeholder('请输入密码'),

            commonFields
                .select(
                    'department',
                    '部门',
                    [
                        { label: '技术部', value: 'tech' },
                        { label: '产品部', value: 'product' },
                        { label: '设计部', value: 'design' }
                    ],
                    true
                )
                .span(12),

            commonFields
                .select('role', '角色', [
                    { label: '管理员', value: 'admin' },
                    { label: '普通用户', value: 'user' }
                ])
                .span(12)
                .show(formData => formData.department === 'tech'), // 只有技术部才显示角色选择

            commonFields
                .input('phone', '手机号')
                .span(24)
                .rules([
                    {
                        pattern: /^1[3-9]\d{9}$/,
                        message: '请输入正确的手机号',
                        trigger: 'blur'
                    }
                ])
        ])
        .build()

    // 内联表单配置
    const inlineFormConfig: FormConfig = {
        fields: [
            {
                prop: 'keyword',
                label: '关键词',
                type: 'input',
                placeholder: '请输入关键词'
            },
            {
                prop: 'status',
                label: '状态',
                type: 'select',
                options: [
                    { label: '全部', value: '' },
                    { label: '启用', value: 'active' },
                    { label: '禁用', value: 'inactive' }
                ]
            },
            {
                prop: 'dateRange',
                label: '日期范围',
                type: 'date',
                componentProps: {
                    type: 'daterange',
                    rangeSeparator: '至',
                    startPlaceholder: '开始日期',
                    endPlaceholder: '结束日期'
                }
            }
        ],
        layout: 'horizontal',
        labelWidth: '80px'
    }

    // 表单提交处理
    const handleSubmit = (data: Record<string, any>) => {
        console.log('基础表单提交:', data)
        ElMessage.success('基础表单提交成功')
    }

    const handleBuilderSubmit = (data: Record<string, any>) => {
        console.log('构建器表单提交:', data)
        ElMessage.success('构建器表单提交成功')
    }

    const handleInlineSubmit = (data: Record<string, any>) => {
        console.log('内联表单提交:', data)
        ElMessage.success('内联表单提交成功')
    }

    // 字段变化处理
    const handleFieldChange = (prop: string, value: any, formData: Record<string, any>) => {
        console.log('字段变化:', { prop, value, formData })
    }
</script>

<style scoped>
    .form-demo {
        padding: 20px;
        max-width: 1000px;
        margin: 0 auto;
    }

    .demo-section {
        margin-bottom: 40px;
        padding: 20px;
        border: 1px solid var(--el-border-color);
        border-radius: 6px;
    }

    .demo-section h3 {
        margin-top: 0;
        margin-bottom: 20px;
        color: var(--el-text-color-primary);
        border-bottom: 1px solid var(--el-border-color-light);
        padding-bottom: 10px;
    }
</style>
