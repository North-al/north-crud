<template>
    <div class="dialog-demo">
        <h2>弹窗示例</h2>

        <div class="demo-buttons">
            <el-space wrap>
                <el-button type="primary" @click="openCreateDialog">新增用户</el-button>
                <el-button type="success" @click="openEditDialog">编辑用户</el-button>
                <el-button type="info" @click="openViewDialog">查看用户</el-button>
                <el-button type="warning" @click="showConfirmDialog">确认对话框</el-button>
                <el-button type="danger" @click="showDeleteDialog">删除确认</el-button>
            </el-space>
        </div>

        <!-- 表单弹窗 -->
        <CrudFormDialog
            v-model="formDialog.isVisible.value"
            :form-config="userFormConfig"
            :config="formDialog.dialogConfig.value"
            :form-data="formDialog.formData.value"
            :loading="formDialog.isLoading.value"
            @form-submit="handleFormSubmit"
            @cancel="formDialog.cancel" />

        <!-- 确认弹窗 -->
        <CrudDialog
            v-model="confirmDialog.isVisible.value"
            :config="confirmDialog.dialogConfig.value"
            :loading="confirmDialog.isLoading.value"
            @confirm="confirmDialog.confirm"
            @cancel="confirmDialog.cancel">
            <p>{{ confirmMessage }}</p>
        </CrudDialog>

        <!-- 用户列表 -->
        <div class="demo-section">
            <h3>用户列表</h3>
            <el-table :data="userList" style="width: 100%">
                <el-table-column prop="name" label="姓名" />
                <el-table-column prop="email" label="邮箱" />
                <el-table-column prop="role" label="角色" />
                <el-table-column label="操作" width="200">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="editUser(scope.row)"> 编辑 </el-button>
                        <el-button type="info" size="small" @click="viewUser(scope.row)"> 查看 </el-button>
                        <el-button type="danger" size="small" @click="deleteUser(scope.row)"> 删除 </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, reactive } from 'vue'
    import { ElMessage, ElTable, ElTableColumn, ElButton, ElSpace } from 'element-plus'
    import { CrudFormDialog, CrudDialog, createForm, commonFields } from '../../..'
    import { useFormDialog, useConfirmDialog } from '@northal/crud-core'

    // 用户数据
    const userList = ref([
        { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'admin' },
        { id: 2, name: '李四', email: 'lisi@example.com', role: 'user' },
        { id: 3, name: '王五', email: 'wangwu@example.com', role: 'user' }
    ])

    // 表单配置
    const userFormConfig = createForm()
        .labelWidth('100px')
        .addFields([
            commonFields.input('name', '姓名', true).placeholder('请输入姓名'),

            commonFields
                .input('email', '邮箱', true)
                .placeholder('请输入邮箱')
                .rules([
                    {
                        type: 'email',
                        message: '请输入正确的邮箱格式',
                        trigger: 'blur'
                    }
                ]),

            commonFields.select(
                'role',
                '角色',
                [
                    { label: '管理员', value: 'admin' },
                    { label: '普通用户', value: 'user' }
                ],
                true
            )
        ])
        .build()

    // 表单弹窗
    const formDialog = useFormDialog()
    const confirmDialog = useConfirmDialog()
    const confirmMessage = ref('')

    // 打开新增弹窗
    const openCreateDialog = () => {
        formDialog.openCreateForm(
            userFormConfig,
            { width: '500px' },
            {
                onCreate: async data => {
                    // 模拟API调用
                    await new Promise(resolve => setTimeout(resolve, 1000))

                    const newUser = {
                        id: Date.now(),
                        ...data
                    }
                    userList.value.push(newUser)
                    ElMessage.success('用户创建成功')
                }
            }
        )
    }

    // 打开编辑弹窗
    const openEditDialog = () => {
        const user = userList.value[0] // 默认编辑第一个用户
        editUser(user)
    }

    // 编辑用户
    const editUser = (user: any) => {
        formDialog.openEditForm(
            userFormConfig,
            { ...user },
            { width: '500px' },
            {
                onUpdate: async data => {
                    // 模拟API调用
                    await new Promise(resolve => setTimeout(resolve, 1000))

                    const index = userList.value.findIndex(u => u.id === user.id)
                    if (index > -1) {
                        userList.value[index] = { ...user, ...data }
                    }
                    ElMessage.success('用户更新成功')
                }
            }
        )
    }

    // 打开查看弹窗
    const openViewDialog = () => {
        const user = userList.value[0] // 默认查看第一个用户
        viewUser(user)
    }

    // 查看用户
    const viewUser = (user: any) => {
        formDialog.openViewForm(userFormConfig, user, { width: '500px' })
    }

    // 显示确认对话框
    const showConfirmDialog = () => {
        confirmMessage.value = '这是一个确认对话框，请选择是否继续？'
        confirmDialog.open(
            {
                title: '确认操作',
                width: '400px'
            },
            {
                onConfirm: async () => {
                    await new Promise(resolve => setTimeout(resolve, 1000))
                    ElMessage.success('操作确认成功')
                },
                onCancel: () => {
                    ElMessage.info('操作已取消')
                }
            }
        )
    }

    // 显示删除确认对话框
    const showDeleteDialog = () => {
        const user = userList.value[0] // 默认删除第一个用户
        deleteUser(user)
    }

    // 删除用户
    const deleteUser = (user: any) => {
        confirmMessage.value = `确定要删除用户"${user.name}"吗？`
        confirmDialog.open(
            {
                title: '删除确认',
                width: '400px',
                confirmText: '删除',
                cancelText: '取消'
            },
            {
                onConfirm: async () => {
                    // 模拟API调用
                    await new Promise(resolve => setTimeout(resolve, 1000))

                    const index = userList.value.findIndex(u => u.id === user.id)
                    if (index > -1) {
                        userList.value.splice(index, 1)
                    }
                    ElMessage.success('用户删除成功')
                }
            }
        )
    }

    // 处理表单提交
    const handleFormSubmit = (data: Record<string, any>) => {
        console.log('表单提交:', data)
    }
</script>

<style scoped>
    .dialog-demo {
        padding: 20px;
        max-width: 1000px;
        margin: 0 auto;
    }

    .demo-buttons {
        margin-bottom: 30px;
        padding: 20px;
        border: 1px solid var(--el-border-color);
        border-radius: 6px;
        background-color: var(--el-bg-color-page);
    }

    .demo-section {
        margin-top: 30px;
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
