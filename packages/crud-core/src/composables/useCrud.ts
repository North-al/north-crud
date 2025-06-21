import { ref } from 'vue'
import type { CrudOptions } from '../types/crud'

export function useCrud(options: CrudOptions) {
    const tableData = ref<any[]>([])
    const loading = ref(false)

    const fetchList = async () => {
        loading.value = true
        try {
            const res = await options.api()
            tableData.value = res
        } catch (err) {
            console.error('fetchList error:', err)
        } finally {
            loading.value = false
        }
    }

    return {
        tableData,
        loading,
        fetchList
    }
}
