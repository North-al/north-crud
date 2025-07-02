<template>
    <el-config-provider :locale="zhCn">
        <el-tabs v-model="activeName" tab-position="left" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="表格示例" name="table">
                <DevBasicTable />
            </el-tab-pane>
            <el-tab-pane label="表单示例" name="form">
                <FormDemo />
            </el-tab-pane>
            <el-tab-pane label="弹窗示例" name="dialog">
                <DialogDemo />
            </el-tab-pane>
            <el-tab-pane label="生产环境" name="prod">
                <ProdBasicTable />
            </el-tab-pane>
        </el-tabs>
    </el-config-provider>
</template>

<script lang="tsx" setup>
    import { ref } from 'vue'
    import type { TabsPaneContext } from 'element-plus'

    import DevBasicTable from './components/dev/basicTable.vue'
    import ProdBasicTable from './components/prod/basicTable.vue'
    import FormDemo from './components/dev/formDemo.vue'
    import zhCn from 'element-plus/es/locale/lang/zh-cn'

    const activeName = ref('table')

    const handleClick = (tab: TabsPaneContext, event: Event) => {
        console.log(tab, event)
    }
</script>

<style scoped></style>
