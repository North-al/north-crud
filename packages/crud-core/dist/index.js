'use strict';

var vue = require('vue');

function useCrud(options) {
    const tableData = vue.ref([]);
    const loading = vue.ref(false);
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

exports.useCrud = useCrud;
//# sourceMappingURL=index.js.map
