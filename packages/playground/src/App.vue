<template>
    <el-button @click="fetchList" :loading="loading">加载数据</el-button>
    <CrudTable :columns="columns" :data="tableData" :loading="loading" />
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { useCrud } from '@north/crud-core'
    import { CrudTable } from '@north/crud-element-plus'

    // 模拟接口
    const api = () => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    { id: 1, name: '张三' },
                    { id: 2, name: '李四' }
                ])
            }, 1000)
        })
    }

    const columns = ref([
        { label: 'ID', prop: 'id', width: 80 },
        { label: '姓名', prop: 'name' }
    ])

    const { tableData, loading, fetchList } = useCrud({ api })
</script>
