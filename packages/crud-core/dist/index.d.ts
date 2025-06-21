import * as vue from 'vue';

interface CrudOptions {
    api: () => Promise<any[]>;
}

declare function useCrud(options: CrudOptions): {
    tableData: vue.Ref<any[], any[]>;
    loading: vue.Ref<boolean, boolean>;
    fetchList: () => Promise<void>;
};

export { type CrudOptions, useCrud };
