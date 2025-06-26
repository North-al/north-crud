<template>
    <el-tabs v-model="activeName" tab-position="left" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="dev" name="dev">
            <dev-basic-table />
        </el-tab-pane>
        <el-tab-pane label="prod" name="prod">
            <prod-basic-table />
        </el-tab-pane>
    </el-tabs>
</template>

<script lang="tsx" setup>
    import { ref } from 'vue'
    import type { TabsPaneContext } from 'element-plus'

    import devBasicTable from './components/dev/basicTable.vue'
    import prodBasicTable from './components/prod/basicTable.vue'

    // const activeName = ref('first')
    const activeName = ref('dev')

    const handleClick = (tab: TabsPaneContext, event: Event) => {
        console.log(tab, event)
    }
</script>

<style scoped></style>
