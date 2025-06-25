import { ref } from 'vue';

function useCrud(options) {
    const tableData = ref([]);
    const loading = ref(false);
    const fetchList = async () => {
        loading.value = true;
        try {
            const res = await options.api();
            tableData.value = res;
        }
        catch (err) {
            console.error('fetchList error:', err);
        }
        finally {
            loading.value = false;
        }
    };
    return {
        tableData,
        loading,
        fetchList
    };
}

export { useCrud };
//# sourceMappingURL=index.mjs.map
