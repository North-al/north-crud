<template>
    <el-tabs v-model="activeName" tab-position="left" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="dev" name="dev">
            <DevBasicTable />
        </el-tab-pane>
        <el-tab-pane label="prod" name="prod">
            <ProdBasicTable />
        </el-tab-pane>
    </el-tabs>
</template>

<script lang="tsx" setup>
    import { ref } from 'vue'
    import type { TabsPaneContext } from 'element-plus'

    import DevBasicTable from './components/dev/basicTable.vue'
    import ProdBasicTable from './components/prod/basicTable.vue'

    const activeName = ref('dev')

    const handleClick = (tab: TabsPaneContext, event: Event) => {
        console.log(tab, event)
    }
</script>

<style scoped></style>
