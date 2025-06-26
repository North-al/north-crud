<template>
    <div class="toolbar">
        <div class="left">
            <slot name="left" />
        </div>
        <div class="right">
            <el-button :icon="Refresh" circle></el-button>
            <el-button :icon="FullScreen" circle></el-button>

            <el-popover placement="bottom" width="350" trigger="click">
                <template #reference>
                    <el-button :icon="Setting" circle></el-button>
                </template>

                <div class="column-settings">
                    <div class="settings-tip">点击勾选或取消勾选各项，拖动行可以调整显示顺序</div>
                    <vue-draggable-next :list="columnsDraft" class="column-list">
                        <div class="column-item" v-for="(element, index) in columnsDraft" :key="element.prop">
                            <el-checkbox
                                v-model="element.visible"
                                :label="element.label"
                                @change="onColumnVisibilityChange" />
                            <div class="column-actions">
                                <el-button
                                    text
                                    circle
                                    :icon="ArrowUp"
                                    size="small"
                                    :disabled="index === 0"
                                    @click="moveColumn(index, index - 1)" />
                                <el-button
                                    text
                                    :icon="ArrowDown"
                                    size="small"
                                    circle
                                    :disabled="index === columnsDraft.length - 1"
                                    @click="moveColumn(index, index + 1)" />
                                <el-button class="drag-handle" text :icon="Rank" size="small" circle> </el-button>
                            </div>
                        </div>
                    </vue-draggable-next>
                </div>

                <div class="settings-footer">
                    <el-button size="small" @click="onReset">重置</el-button>
                    <!-- <el-button size="small" type="primary" @click="onApply">应用</el-button> -->
                </div>
            </el-popover>
            <!-- 
            <el-button icon="FullScreen" @click="tool.toggleFullscreen">
                {{ tool.isFullscreen ? '退出全屏' : '全屏' }}
            </el-button> -->
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, inject, ref } from 'vue'
    import { VueDraggableNext } from 'vue-draggable-next'
    import { Refresh, FullScreen, Setting, ArrowUp, ArrowDown, Rank } from '@element-plus/icons-vue'
    import { TableColumn } from '../CrudTable/props'
    import type { CrudToolType } from '../../types'

    const { columns } = defineProps<{ columns: TableColumn[] }>()
    const columnsDraft = ref<TableColumn[]>(
        columns.filter(col => {
            return !col.type
        })
    )

    console.log(columnsDraft)

    const onColumnVisibilityChange = () => {
        console.log('Column visibility changed')
    }

    const moveColumn = (fromIndex: number, toIndex: number) => {
        const column = columnsDraft.value.splice(fromIndex, 1)[0]
        columnsDraft.value.splice(toIndex, 0, column)
    }

    const onReset = () => {
        // columnsDraft.value = columns.filter(col => !col.type)
    }

    const onApply = () => {
        // 这里可以触发一个事件或者调用一个方法来应用更改
        console.log('Applied changes:', columnsDraft.value)
    }
</script>

<style scoped>
    .toolbar {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
    }

    .column-settings {
        padding: 0 8px;
        max-height: 400px;
    }

    .settings-tip {
        font-size: 12px;
        color: #909399;
        margin-bottom: 12px;
        line-height: 1.4;
    }

    .column-list {
        max-height: 300px;
        overflow-y: auto;
    }

    .column-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #f0f0f0;
    }

    .column-item:last-child {
        border-bottom: none;
    }

    .column-actions {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .drag-handle {
        cursor: move;
        color: #c0c4cc;
        display: flex;
        align-items: center;
    }

    .drag-handle:hover {
        color: #409eff;
    }

    .settings-footer {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 12px;
    }

    /* 拖拽时的样式 */
    .sortable-ghost {
        opacity: 0.5;
        background: #f5f7fa;
    }

    .sortable-chosen {
        background: #ecf5ff;
    }
</style>
