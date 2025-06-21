<template>
    <el-button @click="fetchList" :loading="loading">加载数据</el-button>
    <el-table :data="tableData" style="width: 100%; margin-top: 20px">
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="name" label="名称" />
    </el-table>
</template>

<script setup lang="ts">
    import { useCrud } from '@core'
    import { ref } from 'vue'

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

    const { tableData, loading, fetchList } = useCrud({ api })
</script>
