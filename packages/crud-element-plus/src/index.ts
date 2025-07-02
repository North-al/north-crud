import CrudTable from './components/CrudTable/index.vue'
import CrudForm from './components/CrudForm/index'
import { TableBuilder, TableColumnBuilder } from './utils/tableBuilder'
import { FormBuilder, FormFieldBuilder, createForm, createFormField, commonFields } from './utils/formBuilder'

export {
    CrudTable,
    CrudForm,
    TableBuilder,
    TableColumnBuilder,
    FormBuilder,
    FormFieldBuilder,
    createForm,
    createFormField,
    commonFields
}

// 导出类型定义
export type { TableConfig, PaginationConfig, ActionButton, SortParams, FilterParams } from './types'
export type { TableColumn } from './components/CrudTable/props'
// 导出表单相关类型
export type {
    FormConfig,
    FormField,
    FormFieldType,
    FormFieldOption,
    FormMode,
    FormAction,
    FormLayout
} from './types/form'
