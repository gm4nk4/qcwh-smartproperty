<template>
  <div class="configurable-table-with-form">
    <!-- 查询表单组件 -->
    <div v-show="showSearch" class="form-container mb20">
      <ConfigurableQueryForm
        ref="queryFormRef"
        v-if="queryFormConfig"
        :config="queryFormConfig"
        @search="handleFormSearch"
        @reset="handleFormReset"
      >
        <template #actions>
          <slot name="formActions"></slot>
        </template>
        <!-- 传递 departmentSelection 插槽 -->
        <template #departmentSelection="slotProps">
          <slot name="departmentSelection" v-bind="slotProps"></slot>
        </template>
      </ConfigurableQueryForm>
    </div>

    <div class="table-actions-container mb20">
      <div><slot name="tableActions"></slot></div>
      <div class="table-toolbar-right">
        <el-popover
          v-if="showColumnSettings"
          placement="bottom-end"
          trigger="hover"
          :width="180"
          popper-class="query-form-popover"
        >
          <template #reference>
            <el-button
              ><img :src="settingIcon" class="btn-icon" />表格列设置</el-button
            >
          </template>
          <el-checkbox-group
            v-model="checkedColumns"
            class="column-settings-group"
            @change="handleColumnChange"
          >
            <el-checkbox
              v-for="col in settableColumns"
              :key="getColumnKey(col)"
              :value="getColumnKey(col)"
              :label="col.label"
            />
          </el-checkbox-group>
        </el-popover>
        <el-button
          v-if="showSearchToggle"
          :icon="Search"
          @click="toggleSearch"
          >{{ showSearch ? "隐藏搜索" : "显示搜索" }}</el-button
        >
        <el-button v-if="showExport" @click="handleExport"
          ><img :src="directInboxIcon" class="btn-icon" />导出</el-button
        >
        <el-button v-if="showRefresh" @click="handleRefreshData"
          ><img :src="rotateLeftIcon" class="btn-icon" />刷新数据</el-button
        >
        <!-- 卡片列表转换,只要有cardView插槽,就显示转换按钮 -->
        <template v-if="slots.cardView?.()">
          <slot name="switchAction">
          <el-button @click="switchView('card')"
            ><el-icon><Menu /></el-icon>卡片视图</el-button
          >
          <el-button @click="switchView('list')"
            ><el-icon><Tickets /></el-icon>列表视图</el-button
          >
        </slot>
        </template>
      </div>
    </div>

    <!-- 表格组件 -->
    <div class="table-container" v-if="viewType === 'list'">
      <ConfigurableTable
        :key="tableKey"
        ref="tableRef"
        :config="filteredTableConfig"
        @add="handleAdd"
        @export="handleExport"
        @reset="handleReset"
        @select="handleSelect"
        @operation="handleOperation"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @refresh="handleRefresh"
        @update:showSearch="handleUpdateShowSearch"
        @sort-change="handleSortChange"
      >
        <template #rightToolbarSlot>
          <slot name="rightToolbarSlot"></slot>
        </template>

        <!-- 动态插槽转发 -->
        <template
          v-for="(_, slotName) in filteredSlots"
          :key="slotName"
          #[slotName]="slotProps"
        >
          <slot :name="slotName" v-bind="slotProps"></slot>
        </template>
      </ConfigurableTable>
    </div>
    <div v-else>
      <slot name="cardView"></slot>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "ConfigurableTableWithForm",
};
</script>

<script lang="ts" setup>
import { ref, watch, computed, PropType, useSlots } from "vue";
import { Search } from "@element-plus/icons-vue";
import {
  ConfigurableTable,
  ConfigurableQueryForm,
  QueryFormConfig,
  TableConfig,
} from "./index";

// 使用 Vite 推荐的方式导入静态资源
// const settingIcon = new URL("./assets/setting.png", import.meta.url).href;
// const directInboxIcon = new URL("./assets/direct-inbox.png", import.meta.url)
//   .href;
// const rotateLeftIcon = new URL("./assets/rotate-left.png", import.meta.url)
//   .href;

// 直接使用 base64 内联图片（微前端环境下最可靠）
const settingIcon =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAAXVJREFUeAGNU01OwlAQ/l6LdGc4Ap7AegLxBOIGiavHCQBh4U7YmSihnoDHxqAbewPqCcAb4A0MurGU1pm0NFDahkkmmb7Oz/e9+R6QY1XZK7Hn5Yi0w7q8KwdY3QfUI0qyBY76E/WwSOZqyYk1eUuFq2kA8eVifcLOsY/VjP9lIqjLbiVAMKJwLrBuT5S12EXVKvvQexSek7ff1MCOG9zIlulBf9cgGhP15CDHarJTpaKhiHILfOihwFzH28VMx8BShlOK9oY/T67Jrkn3U6FPR0ubwpdo4GdGpafE3yT+06xtpDYI4DIi51UNGjRRUvxh4Fce3CBpgntmWCHt8A++MqDPrmVnFCJCRYPXPxiBraxvWuUFlX6ykxbOkmvdQhdqwA81EO83yzZ60aFdvajHeSykzX4pdNJkG8l7SHTMbb3svQXacY9gN8ktF8fPfFbEsknCkbTSsQvPYoo7FPZhxrK9jJLoMa37WfeQaVXZKrHn5fwDKauk6gDqAIgAAAAASUVORK5CYII=";
const directInboxIcon =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAAZ1JREFUeAGNU01OwkAU/tqS6kZTb1BPIEeAG+BCIK6GE9gEFu4oOxdiygmYlUFWcALwBHAD8AaNukCxre+1HSwNqXzJdJJ5f9/73itQgJpwLfwDvcho4tOpi45b5FPKVjPxfqdBK3/hrDWRrr/PxrFOYAxDRFMD5nwkH9Y7Bk1xb5/gY0HBNp1BPpgxkZ7PNjqVENsZx/C7xp+GaA8jRG9j+eSqAH6jS2ngv8h+S9luRNujylf0Vo1biADxjfOLbEUDweAHxizpM6hmbVsErgljFTNoCscOyXEs+5d52rfCKfP9LL1l3kYMVxolLqEAhwLzUAlszpi0o/k6StdKZQUWLcKWdbETP9gsoNqDNdPhQ2K+kmM3X4nf2Kb8KHidZYCR9OIHmncsUF20pzqCtIUS6RRVdIRV5UeMY4u+oRHhb1zxvOmikWlU0ZglB10dWksFpy1YG1jJvjREhxajU8GRYF9a8UXMgD/UT48oDo9Jwj6kBYkZ9dLYBNRzjWmTgdX1DwUzbVrlJRccycf5XgIF/mlOM5pkwXqlGu3wC47nqYYgvbTyAAAAAElFTkSuQmCC";
const rotateLeftIcon =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAAXJJREFUeAGNUrtSwkAUPRscxsIin5DeYSaWjI1+gTQKY+PyBTydsSN0Fgq0Vq4dakNpqQ2WxgJbY2dnxooCWO+NPKIQklPksXfP2XP3HmANctIxEQMjqnAkq+1NfJcRA7GaXG8A2hHQFYGUT99eV108JhI4lKe2wOSFCh79BiQNYdPT1NDNe9VS4f2p/wJvbv8zY2c/iJQj0sOdalUGbv8qY+++kmh7286aA/f5abbfWNiu5fKyGvTcpVMMjHcEhDWrcwsC431akwVZ31sSoG4aE8BfEDrerbosht3xGgkUqZXGH9sFeWaRg3ckBO39KsiyFXIwsqaXlgjkwgU2rJBAcNOxoVmFQGCIESlqK0nyfg/T9hBb7lygpzo+20onSF5e1krUbq+nHH8uwBAY8Y2fHFOQosjTWpnG2VzwQuAs0OuaTHYMpG+66tzjdW6N3JU4AzzGcKyXoszjmSDl0OeBmOZCAybb5pM5C0gKFpvNOwo/bIeEwIPZRhIAAAAASUVORK5CYII=";

const props = defineProps({
  queryFormConfig: {
    type: Object as PropType<QueryFormConfig>,
    default: null,
  },
  tableConfig: {
    type: Object as PropType<TableConfig>,
    required: true,
  },
  showColumnSettings: {
    type: Boolean,
    default: true,
  },
  showSearchToggle: {
    type: Boolean,
    default: true,
  },
  showExport: {
    type: Boolean,
    default: true,
  },
  showRefresh: {
    type: Boolean,
    default: true,
  },
} as const);

const slots = useSlots();

const excludedSlots = [
  "formActions",
  "tableActions",
  "tableSettings",
  "rightToolbarSlot",
  "departmentSelection",
];

const filteredSlots = computed(() => {
  const result: Record<string, any> = {};
  for (const key in slots) {
    if (!excludedSlots.includes(key)) {
      result[key] = slots[key];
    }
  }
  return result;
});

const emit = defineEmits([
  "search",
  "reset",
  "add",
  "export",
  "select",
  "operation",
  "size-change",
  "current-change",
  "refresh",
  "update:showSearch",
  "sort-change",
  "switch-view",
]);

const tableRef = ref();
const queryFormRef = ref();
const isProgrammaticReset = ref(false);
const viewType = ref("list");

const showSearch = ref(props.tableConfig?.rightToolbar?.showSearch !== false);

const formData = ref<Record<string, any>>({});

const tableKey = ref(0);

const getColumnKey = (col: any) => col.prop || col.label;

const settableColumns = computed(() => {
  const cols = props.tableConfig?.columns || [];
  return cols.filter(
    (col: any) =>
      col.type !== "selection" &&
      col.type !== "index" &&
      col.type !== "operation",
  );
});

const checkedColumns = ref<string[]>([]);

const initCheckedColumns = () => {
  const cols = props.tableConfig?.columns || [];
  checkedColumns.value = cols
    .filter(
      (col: any) =>
        col.type !== "selection" &&
        col.type !== "index" &&
        col.type !== "operation" &&
        col.show !== false,
    )
    .map(getColumnKey);
};
initCheckedColumns();

const switchView = (type: string) => {
  viewType.value = type;
  emit("switch-view", type);
};
const filteredTableConfig = computed<TableConfig>(() => {
  const cols = props.tableConfig?.columns || [];
  const filteredCols = cols.map((col: any) => ({
    ...col,
    show:
      col.type === "selection" ||
      col.type === "index" ||
      col.type === "operation"
        ? col.show
        : checkedColumns.value.includes(getColumnKey(col)),
  }));
  return {
    ...props.tableConfig,
    columns: filteredCols,
  } as TableConfig;
});

const handleColumnChange = (checkedProps: string[]) => {
  tableKey.value++;
};

const toggleSearch = () => {
  showSearch.value = !showSearch.value;
  emit("update:showSearch", showSearch.value);
};

const handleRefreshData = () => {
  if (tableRef.value && props.tableConfig.pageList) {
    tableRef.value.getDataList();
  }
  emit("search", formData.value);
};

const handleFormSearch = (searchFormData: Record<string, any>) => {
  formData.value = searchFormData;
  emit("search", searchFormData);
  if (tableRef.value && props.tableConfig.pageList) {
    tableRef.value.getDataList();
  }
};

const handleFormReset = () => {
  formData.value = {};

  if (!isProgrammaticReset.value) {
    emit("reset");
  }

  if (tableRef.value && props.tableConfig.pageList) {
    tableRef.value.getDataList();
  }
};

const resetFun = () => {
  if (tableRef.value && props.tableConfig.pageList) {
    tableRef.value.getDataList();
  }
};

const changeColumns = (columns: any) => {};

const handleAdd = () => {
  emit("add");
};

const handleExport = () => {
  emit("export");
};

const handleReset = () => {
  emit("reset");
};

const handleSelect = (selection: any[]) => {
  emit("select", selection);
};

const handleOperation = (data: any) => {
  emit("operation", data);
};

const handleSizeChange = (size: number) => {
  emit("size-change", size);
};

const handleCurrentChange = (page: number) => {
  emit("current-change", page);
};

const handleRefresh = () => {
  emit("refresh");
};

const handleUpdateShowSearch = (val: boolean) => {
  showSearch.value = val;
  emit("update:showSearch", val);
};

const handleSortChange = (sort: any) => {
  emit("sort-change", sort);
};

watch(
  () => props.tableConfig?.rightToolbar?.showSearch,
  (val) => {
    if (val !== undefined) showSearch.value = val !== false;
  },
);

defineExpose({
  getSelectedRows: () => tableRef.value?.selectedRows,
  getVisibleColumns: () => tableRef.value?.visibleColumns,
  getDataList: () => tableRef.value?.getDataList(),
  downBlobFile: (...args: any[]) => tableRef.value?.downBlobFile(...args),
  resetSelection: () => tableRef.value?.resetSelection(),
  clearSelection: () => tableRef.value?.clearSelection?.(),
  toggleRowSelection: (row: any, selected?: boolean) =>
    tableRef.value?.toggleRowSelection?.(row, selected),
  getFormData: () => {
    return formData.value;
  },
  resetForm: () => {
    isProgrammaticReset.value = true;
    try {
      queryFormRef.value?.resetForm?.();
    } finally {
      isProgrammaticReset.value = false;
    }
  },
});
</script>

<style scoped lang="scss">
.configurable-table-with-form {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  width: 100%;
  min-width: 0;
  max-width: 100%;
}

.table-actions-container {
  width: 100%;
  min-width: 0;
  display: flex;
  justify-content: space-between;
}

.form-container {
  flex-shrink: 0;
  width: 100%;
  min-width: 0;
  max-width: 100%;
}

.table-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  min-height: 0;
}

.table-container :deep(.configurable-table-container) {
  min-width: 0;
  max-width: 100%;
  height: 100%;
  min-height: 0;
}

.table-toolbar-right {
  display: flex;
  align-items: center;
  .switch-action-container {
    display: flex;
    gap: 8px;
  }
}

.column-settings-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

:deep(.el-button:not(.el-button--text)) {
  display: flex;
  align-items: center;
  height: 32px !important;
  font-size: 12px !important;
}

.btn-icon {
  width: 14px;
  height: 14px;
  margin-right: 4px;
}

:deep(.el-popover.el-popper) {
  border: 1px solid var(--layout-shell-border) !important;
  border-radius: 16px !important;
  box-shadow: var(--layout-shell-shadow) !important;
}
</style>
