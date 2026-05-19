<template>
  <div class="configurable-table-container" ref="containerRef">
    <div class="table-content" ref="tableContentRef">
      <el-table
        :data="tableData"
        border
        v-loading="loadingComputed"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
        @sort-change="handleSortChange"
        :header-cell-style="
          tableStyle.headerCellStyle || {
            background: '#f9fafb',
            color: 'var(--el-text-color-primary)',
            textAlign: 'left',
            borderRadius: '8px 8px 0 0 !important',
          }
        "
        :cell-style="tableStyle.cellStyle || { textAlign: 'left' }"
        :row-style="{ background: '#fff' }"
        :highlight-current-row="selectionType === 'radio'"
        :height="getTableHeight"
        ref="tableRef"
      >
        <!-- 多选列 -->
        <el-table-column
          v-if="selectionType === 'checkbox'"
          type="selection"
          width="55"
          align="center"
          fixed="left"
          :selectable="selectionSelectable"
        />

        <!-- 单选列 -->
        <el-table-column
          v-if="selectionType === 'radio' && showSelectRadio"
          width="55"
          align="center"
          fixed="left"
        >
          <template #default="scope">
            <el-radio
              :model-value="selectedRadioRow?.id === scope.row.id"
              @change="handleRadioChange(scope.row)"
              :label="true"
            >
              <span></span>
            </el-radio>
          </template>
        </el-table-column>

        <!-- 序号列 -->
        <el-table-column
          v-if="showIndex"
          type="index"
          width="60"
          label="序号"
          fixed="left"
          align="center"
        />

        <!-- 动态列 -->
        <ConfigurableTableColumn
          v-for="(column, index) in visibleColumns"
          :key="getColumnKey(column, index)"
          :column="column"
          :get-column-operations="getColumnOperations"
          :get-tag-class="getTagClass"
          :get-tag-text="getTagText"
          @operation="({ action, row, index }) => handleOperation(action, row, index)"
        >
          <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps"></slot>
          </template>
        </ConfigurableTableColumn>

        <!-- 操作列 - 当使用独立配置时 -->
        <el-table-column
          v-if="showOperations && operations.length > 0 && !hasOperationColumn"
          :label="operationColumn.label || '操作'"
          :width="operationColumn.width || 'auto'"
          :min-width="operationColumn.minWidth"
          :fixed="operationColumn.fixed || 'right'"
          :align="operationColumn.align || 'center'"
          :class-name="operationColumn.className"
        >
          <template #default="scope">
            <slot name="operations" :row="scope.row" :index="scope.$index">
              <el-button
                text
                v-for="(op, i) in getAvailableOperations(scope.row)"
                :key="i"
                :type="op.type || 'primary'"
                :link="op.link !== false"
                :size="op.size || operationColumn.buttonSize || 'default'"
                :disabled="
                  typeof op.disabled === 'function'
                    ? op.disabled(scope.row)
                    : op.disabled
                "
                :icon="getButtonIcon(op.label, op.icon)"
                :style="getButtonStyle(op, scope.row)"
                @click="handleOperation(op.action, scope.row, scope.$index)"
              >
                {{ op.label }}
              </el-button>
            </slot>
          </template>
        </el-table-column>

        <!-- 空数据展示 -->
        <template #empty>
          <div class="empty-data">
            <el-empty description="暂无数据" />
          </div>
        </template>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container" v-if="pagination" ref="paginationRef">
      <div class="pagination-left">
        <span class="pagination-total">共 {{ totalCount }} 条</span>
        <slot name="paginationExtra"></slot>
      </div>
      <div class="pagination-right">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="pageSizes"
          :total="totalCount"
          layout="sizes ,prev, pager, next"
          prev-text="上一页"
          next-text="下一页"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "ConfigurableTable",
};
</script>

<script lang="ts" setup>
import {
  ref,
  computed,
  PropType,
  onMounted,
  watch,
  reactive,
  onUnmounted,
  nextTick,
  inject,
} from "vue";
import {
  Download,
  Refresh,
  Edit,
  Delete,
  View,
  Document,
  Connection,
  Check,
  Upload,
  Tools,
  CircleCheck,
  CircleClose,
  InfoFilled,
  Stamp,
  Bell,
  SuccessFilled,
  Promotion,
  Files,
  Back,
  Paperclip,
  CopyDocument,
  Switch,
} from "@element-plus/icons-vue";
import ConfigurableTableColumn from "./ConfigurableTableColumn.vue";
import {
  TableColumn,
  Operation,
  TableConfig,
  TableStyle,
  UseTableReturn,
} from "../index";

// 定义 useTable 注入的 key
const USE_TABLE_KEY = Symbol("useTable");

const props = defineProps({
  config: {
    type: Object as PropType<TableConfig>,
    required: true,
  },
});

const emit = defineEmits([
  "add",
  "export",
  "reset",
  "select",
  "operation",
  "size-change",
  "current-change",
  "refresh",
  "update:showSearch",
  "sort-change",
]);

// 解构配置并设置默认值
const operations = computed(() => props.config.operations || []);
const operationColumn = computed(() => props.config.operationColumn || {});
const selectionType = computed(() => props.config.selectionType || "none");
const showSelectRadio = computed(() => props.config.showSelectRadio !== false);
const selectionSelectable = computed(() => props.config.selectionSelectable);
const showIndex = computed(() => props.config.showIndex !== false);
const showOperations = computed(() => props.config.showOperations !== false);
const pagination = computed(() => props.config.pagination !== false);
const pageSizes = computed(() => props.config.pageSizes || [10, 20, 50, 100]);
const explicitTableHeight = computed(() => props.config.tableHeight);

// 表格容器高度计算
const containerRef = ref<HTMLElement>();
const tableContentRef = ref<HTMLElement>();
const paginationRef = ref<HTMLElement>();
const containerHeight = ref(0);
const paginationHeight = ref(52);

const getTableHeight = computed(() => {
  if (explicitTableHeight.value !== undefined && explicitTableHeight.value !== null) {
    return explicitTableHeight.value;
  }

  if (containerHeight.value > 0) {
    return containerHeight.value - 1;
  }
  return undefined;
});

// ResizeObserver 监听容器高度变化
let resizeObserver: ResizeObserver | null = null;

const initResizeObserver = () => {
  if (explicitTableHeight.value !== undefined && explicitTableHeight.value !== null) {
    return;
  }

  const contentEl = tableContentRef.value;
  if (!contentEl) return;

  containerHeight.value = contentEl.getBoundingClientRect().height;

  resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      containerHeight.value = entry.contentRect.height;
    }
  });
  resizeObserver.observe(contentEl);
};

const updatePaginationHeight = () => {
  nextTick(() => {
    if (paginationRef.value) {
      paginationHeight.value =
        paginationRef.value.getBoundingClientRect().height;
    }
  });
};

// 本地维护分页状态
const currentPage = ref(props.config.currentPage || 1);
const pageSize = ref(props.config.pageSize || 10);
const totalCount = ref(props.config.total || 0);
const isLoading = ref(false);

// 监听配置变化，同步分页参数
watch(
  () => props.config.currentPage,
  (val) => {
    if (val !== undefined) currentPage.value = val;
  },
);

watch(
  () => props.config.pageSize,
  (val) => {
    if (val !== undefined) pageSize.value = val;
  },
);

watch(
  () => props.config.total,
  (val) => {
    if (val !== undefined) totalCount.value = val;
  },
);

// 尝试从 inject 获取 useTable，如果没有则使用默认实现
const injectedUseTable = inject<((options?: any) => UseTableReturn) | null>(
  USE_TABLE_KEY,
  null,
);

// 默认表格样式
const defaultTableStyle: TableStyle = {
  cellStyle: { textAlign: "center" },
  headerCellStyle: {
    textAlign: "center",
    background: "var(--el-table-row-hover-bg-color)",
    color: "var(--el-text-color-primary)",
  },
  rowStyle: { textAlign: "center" },
};

// 设置 useTable 的 state
const tableState = reactive<any>({
  queryForm: props.config.queryForm || {},
  pageList: props.config.pageList,
  descs: props.config.descs || [],
  pagination: {
    current: currentPage.value,
    size: pageSize.value,
    total: totalCount.value,
  },
  dataList: [],
  loading: false,
});

// 使用 useTable hook 或默认实现
let useTableReturn: UseTableReturn;

if (injectedUseTable) {
  useTableReturn = injectedUseTable(tableState);
} else {
  // 默认实现
  useTableReturn = {
    tableStyle: defaultTableStyle,
    getDataList: () => {
      console.warn("useTable not provided, getDataList not available");
    },
    sizeChangeHandle: (val: number) => {
      pageSize.value = val;
    },
    currentChangeHandle: (val: number) => {
      currentPage.value = val;
    },
    sortChangeHandle: () => {},
    downBlobFile: () => {
      console.warn("useTable not provided, downBlobFile not available");
    },
  };
}

const {
  getDataList,
  sizeChangeHandle,
  currentChangeHandle,
  downBlobFile,
  tableStyle,
} = useTableReturn;

// 表格数据
const tableData = computed(
  () => props.config.data || tableState.dataList || [],
);

// 表格加载状态
const loadingComputed = computed(() => {
  return props.config.loading !== undefined
    ? props.config.loading
    : isLoading.value;
});

// 监听配置变化
watch(
  () => props.config.queryForm,
  (val) => {
    if (val && tableState.queryForm) Object.assign(tableState.queryForm, val);
  },
  { deep: true },
);

// 可见列
const columns = computed(() => props.config.columns || []);
const visibleColumns = computed(() => {
  return columns.value.filter((col) => col.show !== false);
});

const getColumnKey = (column: TableColumn, index: number) =>
  column.prop || `${column.label}-${index}`;

// 选择的数据
const selectedRows = ref<any[]>([]);
const selectedRadioRow = ref<Record<string, any>>({ id: "" });
const tableRef = ref();

// 处理多选变化
const handleSelectionChange = (selection: any[]) => {
  if (selectionType.value === "checkbox") {
    selectedRows.value = selection;
    emit("select", selection);
  }
};

// 处理单选变化
const handleRadioChange = (row: any) => {
  selectedRadioRow.value = row;
  if (tableRef.value) {
    tableRef.value.setCurrentRow(row);
  }
  emit("select", row);
};

// 处理行点击
const handleRowClick = (row: any) => {
  if (selectionType.value === "radio") {
    handleRadioChange(row);
  }
};

// 处理操作按钮点击
const handleOperation = (action: string, row: any, index: number) => {
  emit("operation", { action, row, index });
};

// 处理分页大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  emit("size-change", size);
  if (tableState.pagination) {
    tableState.pagination.size = size;
  }
  sizeChangeHandle(size);
};

// 处理页码变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page;
  emit("current-change", page);
  if (tableState.pagination) {
    tableState.pagination.current = page;
  }
  currentChangeHandle(page);
};

// 处理排序变化
const handleSortChange = (sort: any) => {
  emit("sort-change", sort);
};

// 获取可用操作
const getAvailableOperations = (row: any) => {
  return operations.value.filter((op) => {
    if (typeof op.show === "function") {
      return op.show(row);
    }
    return op.show !== false;
  });
};

// 获取列的操作
const getColumnOperations = (column: TableColumn, row: any) => {
  if (!column.operations) return [];

  if (typeof column.operations === "function") {
    return column.operations(row) || [];
  }

  return column.operations.filter((op) => {
    if (typeof op.show === "function") {
      return op.show(row);
    }
    return op.show !== false;
  });
};

// 判断是否存在操作列
const hasOperationColumn = computed(() => {
  return columns.value.some((col) => col.type === "operation");
});

// 按钮名称到图标的映射
const buttonIconMap: Record<string, any> = {
  编辑: Edit,
  删除: Delete,
  查看: View,
  复制: CopyDocument,
  下载: Download,
  历史报告: Document,
  订阅接口: Connection,
  已订阅: Check,
  版本: Document,
  提交: Upload,
  上线: Upload,
  下线: Download,
  测试: Tools,
  启用: CircleCheck,
  禁用: CircleClose,
  详情: InfoFilled,
  开发: Tools,
  变更: Refresh,
  审核: Document,
  通知: Bell,
  评审: Stamp,
  查看评审: View,
  审批: SuccessFilled,
  发起评审: Promotion,
  发起审批: Promotion,
  归档入库: Files,
  撤回: Back,
  关联: Paperclip,
  处理: CircleCheck,
  转移: Switch,
  跟进: Files,
  更新进度: Edit,
};

// 按钮名称到文本颜色的映射
const buttonTextColorMap: Record<string, string> = {
  查看: "#2563eb",
  编辑: "#16a34a",
  跟进: "#16a34a",
  更新进度: "#16a34a",
  删除: "#dc2626",
  拒绝: "#dc2626",
  取消: "#dc2626",
  终止: "#dc2626",
  审核: "#9333ea",
  审批: "#9333ea",
  评审: "#9333ea",
  复核: "#9333ea",
  提交: "#4f46e5",
  发起: "#4f46e5",
  发送: "#4f46e5",
  上报: "#4f46e5",
  转移: "#4f46e5",
  处理: "#0d9488",
  完成: "#0d9488",
  通过: "#0d9488",
  确认: "#0d9488",
  归档: "#4a5565",
  存档: "#4a5565",
  归档入库: "#4a5565",
  复制: "#ea580c",
  下载: "#ea580c",
  上传: "#ea580c",
  导出: "#ea580c",
  导入: "#ea580c",
  变更: "#ea580c",
  启用: "#67C23A",
  禁用: "#F56C6C",
};

// 根据按钮标签获取图标
const getButtonIcon = (label: string, customIcon?: any) => {
  if (customIcon) {
    return customIcon;
  }
  if (label == "-" && customIcon === undefined) {
    return null;
  }
  return buttonIconMap[label] || Edit;
};

// 根据按钮标签获取文本颜色
const getButtonTextColor = (label: string, customColor?: string) => {
  if (customColor) {
    return customColor;
  }
  return buttonTextColorMap[label] || "#2563eb";
};

// 获取按钮样式
const getButtonStyle = (op: Operation, row: any) => {
  const isDisabled =
    typeof op.disabled === "function" ? op.disabled(row) : op.disabled;

  if (isDisabled) {
    return {};
  }

  return {
    color: getButtonTextColor(op.label, op.textColor),
  };
};

// ========== Tag 标签辅助函数 ==========
const getTagText = (row: any, col: any) => {
  if (!col.tagConfig && !col.tagMap) return row[col.prop];
  const v = row[col.prop];
  if (col.tagConfig) {
    const t = col.tagConfig.map[v];
    if (t) return t.text;
    return col.tagConfig.default?.text ?? v;
  }
  if (col.tagMap) {
    const t = col.tagMap[v];
    if (t) return t.text;
  }
  return v;
};

const getTagClass = (row: any, col: any) => {
  const v = row[col.prop];
  const cls = ["status-tag"];
  if (col.tagConfig) {
    const t = col.tagConfig.map[v];
    if (t?.class) {
      cls.push(t.class);
      return cls.join(" ");
    }
    if (col.tagConfig.classPrefix && v) {
      cls.push(`${col.tagConfig.classPrefix}-${v}`);
      return cls.join(" ");
    }
    if (col.tagConfig.default?.class) {
      cls.push(col.tagConfig.default.class);
    }
    return cls.join(" ");
  }
  if (col.tagMap && v) {
    cls.push(`tag-${v}`);
  }
  return cls.join(" ") || "status-tag";
};

// 初始化
onMounted(() => {
  if (props.config.autoLoad !== false && props.config.pageList) {
    getDataList();
  }
  if (props.config.defaultSelectRowId) {
    selectedRadioRow.value["id"] = props.config.defaultSelectRowId;
  }
  setTimeout(() => {
    initResizeObserver();
    updatePaginationHeight();
  }, 100);
});

// 清理 ResizeObserver
onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});

// 监听内部状态变化
watch(
  () => tableState.pagination?.total,
  (val) => {
    if (val !== undefined) {
      totalCount.value = val;
    }
  },
);

watch(
  () => tableState.loading,
  (val) => {
    isLoading.value = val === true;
  },
);

// 向外暴露方法和状态
defineExpose({
  selectedRows,
  selectedRadioRow,
  visibleColumns,
  tableState,
  getDataList,
  downBlobFile,
  resetSelection: () => {
    selectedRows.value = [];
    selectedRadioRow.value = { id: "" };
    if (tableRef.value) {
      tableRef.value.clearSelection?.();
      tableRef.value.setCurrentRow();
    }
  },
  clearSelection: () => tableRef.value?.clearSelection?.(),
  toggleRowSelection: (row: any, selected?: boolean) =>
    tableRef.value?.toggleRowSelection?.(row, selected),
  tableRef,
});
</script>

<style lang="scss" scoped>
.configurable-table-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  padding-bottom: 2px;
  overflow: hidden;
  min-height: 0;
  min-width: 0;
  max-width: 100%;
}

.table-actions {
  display: flex;
  gap: 10px;
}

.table-actions-container {
  display: flex;
  align-items: center;
}

.table-actions-container :deep(.el-button:last-child) {
  border-right: none;
}

.table-content {
  flex: 1;
  overflow: hidden;
  position: relative;
  min-width: 0;
  border-radius: 8px 8px 0 0;
}

:deep(.el-table) {
  height: 100%;
  border-radius: 8px 8px 0 0;
  border: 1px solid #e5eaf3;

  .el-table__header-wrapper {
    overflow-x: auto;
    overflow-y: hidden;
    // 隐藏表头滚动条
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .el-table__header {
    overflow: visible;
  }

  .el-table__body-wrapper {
    overflow-y: auto !important;
    overflow-x: auto !important;
  }

  .el-table__border-left-patch {
    display: none !important;
  }

  .el-table__cell {
    border-right: 1px solid #e5eaf3;
  }

  .el-table__inner-wrapper::before {
    display: none;
  }

  // 固定列容器 - 左侧
  .el-table__fixed {
    top: 0;
    z-index: 3;
  }

  // 固定列容器 - 右侧
  .el-table__fixed-right {
    top: 0;
    z-index: 3;
  }

  // 固定列表头wrapper
  .el-table__fixed-header-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 3;
  }

  .el-table__fixed-right-header-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 3;
  }
}

:deep(.el-table__row) {
  background-color: #fff !important;
}

:deep(.el-table__row--striped) {
  background-color: #fff !important;
}

:deep(.el-table__body tr.hover-row > td) {
  background-color: var(--el-table-row-hover-bg-color) !important;
}

:deep(.el-table) {
  --el-table-border-color: rgba(229, 234, 243, 0.1) !important;
  font-family: "SourceHanSansSC-Regular";
}

// 表头单元格样式
:deep(.el-table th.el-table__cell) {
  border-bottom: 1px solid #e5eaf3 !important;
  border-right: 1px solid #e5eaf3 !important;
  font-size: 12px;
  font-weight: 500;
  color: rgba(140, 140, 140, 1) !important;
  height: 44px !important;
  padding: 0 0px !important;
  background-color: #f9fafb !important;
}

// 表体单元格样式
:deep(.el-table td.el-table__cell) {
  border-bottom: 1px solid #e5eaf3 !important;
  border-right: 1px solid #e5eaf3 !important;
  font-size: 12px;
  font-weight: 400;
  color: rgba(89, 89, 89, 1) !important;
  height: 44px !important;
  padding: 0 0px !important;
  background-color: #fff !important;
}

// 最后一列单元格去掉右边框
:deep(.el-table td.el-table__cell:last-child) {
  border-right: none !important;
}

// 最后一列表头单元格去掉右边框
:deep(.el-table th.el-table__cell:last-child) {
  border-right: none !important;
}

// 固定列表头单元格背景色（确保遮挡滚动内容）
:deep(.el-table th.el-table-fixed-column--left),
:deep(.el-table th.el-table-fixed-column--right) {
  background-color: #f9fafb !important;
}

.empty-data {
  padding: 60px 0;
}

.pagination-container {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0 !important;
  border-left: 1px solid #ebebeb;
  border-right: 1px solid #ebebeb;
  border-bottom: 1px solid #ebebeb;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  padding: 10px 20px;
}

.pagination-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.pagination-total {
  color: var(--el-text-color-regular);
  font-size: 14px;
}

.pagination-right {
  display: flex;
  align-items: center;
}

.table-actions-container {
  display: flex;
  :deep(.el-button:not(.el-button--text)) {
    font-size: 12px;
    color: var(--el-color-primary);
    border: none;
    border-radius: 0px;
    height: 12px !important;
    padding-right: 10px;
    padding-left: 10px;
    border-color: var(--el-color-primary);
    border-right: 1px solid var(--el-color-primary-light-8);
  }
  :deep(.el-button:last-child) {
    border-right: none;
  }
  :deep(.el-button + .el-button) {
    margin-left: 0;
  }
}

:deep(.el-pagination) {
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
}

:deep(.el-pagination .el-pagination__sizes) {
  margin: 0;
}

:deep(.el-pagination .el-pagination__jump) {
  margin: 0;
}

:deep(.el-pagination .el-pager li) {
  margin: 0 3px;
  background-color: #fff !important;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  height: 28px !important;
}

:deep(.el-pagination .btn-prev),
:deep(.el-pagination .btn-next) {
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0 12px;
  margin: 0 4px;
  height: 28px !important;
}

:deep(.el-pagination .btn-prev:hover:not(:disabled)),
:deep(.el-pagination .btn-next:hover:not(:disabled)) {
  color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}

:deep(.el-pagination .btn-prev:disabled),
:deep(.el-pagination .btn-next:disabled) {
  background-color: #f5f7fa;
  color: #c0c4cc;
  cursor: not-allowed;
}
:deep(.el-pagination) {
  font-family: "SourceHanSansSC-Regular";
  color: rgba(89, 89, 89, 1);
  font-size: 12px;

  :deep(.el-pager) {
    li {
      background-color: rgba(255, 255, 255, 1) !important;
      border: 1px solid rgba(223, 223, 223, 1) !important;
      border-radius: 4px;
      color: rgba(89, 89, 89, 1);
      font-size: 12px;
      height: 28px;
      line-height: 26px;
      min-width: 28px;
    }
  }

  :deep(.btn-next),
  :deep(.btn-prev) {
    background-color: rgba(255, 255, 255, 1) !important;
    border: 1px solid rgba(223, 223, 223, 1) !important;
    border-radius: 4px;
    color: rgba(89, 89, 89, 1);
    font-size: 12px;
    height: 28px;
    line-height: 26px;
  }
}
:deep(.el-select) {
  min-height: 28px !important;
  height: 28px !important;
  padding: 0px 12px !important;
}
:deep(.el-select__wrapper) {
  min-height: 28px !important;
  height: 28px !important;
  border-radius: 4px;
  padding: 2px 12px !important;
}
:deep(.el-tag) {
  border: none !important;
}
</style>
