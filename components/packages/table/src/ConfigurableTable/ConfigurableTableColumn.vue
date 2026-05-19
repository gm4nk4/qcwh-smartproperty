<template>
  <el-table-column
    v-if="isGroupColumn"
    :prop="column.prop"
    :label="column.label"
    :width="column.width"
    :min-width="column.minWidth"
    :fixed="column.fixed"
    :align="column.align || 'center'"
    :class-name="column.className"
  >
    <ConfigurableTableColumn
      v-for="(childColumn, childIndex) in visibleChildren"
      :key="getColumnKey(childColumn, childIndex)"
      :column="childColumn"
      :get-column-operations="getColumnOperations"
      :get-tag-class="getTagClass"
      :get-tag-text="getTagText"
      @operation="handleOperation"
    >
      <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps"></slot>
      </template>
    </ConfigurableTableColumn>
  </el-table-column>

  <el-table-column
    v-else-if="column.type === 'operation'"
    :prop="column.prop"
    :label="column.label"
    :width="column.width"
    :min-width="column.minWidth"
    :fixed="column.fixed"
    :align="column.align || 'center'"
    :class-name="column.className"
  >
    <template #default="scope">
      <template v-if="column.slot">
        <div class="table-actions-container">
          <slot
            :name="column.slot"
            :row="scope.row"
            :index="scope.$index"
          ></slot>
        </div>
      </template>

      <template v-else>
        <div class="table-actions-container">
          <el-button
            v-for="(op, i) in getColumnOperations(column, scope.row)"
            :key="i"
            :type="op.type || 'primary'"
            :link="op.link !== false"
            :size="op.size || column.buttonSize || 'default'"
            :disabled="
              typeof op.disabled === 'function'
                ? op.disabled(scope.row)
                : op.disabled
            "
            @click="
              handleOperation({
                action: op.action,
                row: scope.row,
                index: scope.$index,
              })
            "
          >
            {{ op.label }}
          </el-button>
        </div>
      </template>
    </template>
  </el-table-column>

  <el-table-column
    v-else
    :prop="column.prop"
    :label="column.label"
    :width="column.width"
    :min-width="column.minWidth"
    :fixed="column.fixed"
    :sortable="column.sortable === true ? 'custom' : column.sortable"
    :show-overflow-tooltip="column.showOverflowTooltip !== false"
    :align="column.align || 'center'"
    :class-name="column.className"
  >
    <template #default="scope">
      <template v-if="column.slot">
        <slot :name="column.slot" :row="scope.row" :index="scope.$index"></slot>
      </template>
      <template v-else-if="column.type === 'tag' || column.tagConfig">
        <span :class="getTagClass(scope.row, column)">
          {{ getTagText(scope.row, column) }}
        </span>
      </template>
      <template v-else-if="column.formatter">
        {{
          formatCellValue(column.formatter?.(scope.row, column, scope.$index))
        }}
      </template>
      <template v-else>
        {{ formatCellValue(scope.row[column.prop]) }}
      </template>
    </template>
  </el-table-column>
</template>

<script lang="ts">
export default {
  name: "ConfigurableTableColumn",
};
</script>

<script lang="ts" setup>
import { computed, PropType } from "vue";
import { TableColumn, Operation } from "../index";

defineSlots<Record<string, (props: any) => any>>();

const props = defineProps({
  column: {
    type: Object as PropType<TableColumn>,
    required: true,
  },
  getColumnOperations: {
    type: Function as PropType<(column: TableColumn, row: any) => Operation[]>,
    required: true,
  },
  getTagClass: {
    type: Function as PropType<(row: any, column: TableColumn) => string>,
    required: true,
  },
  getTagText: {
    type: Function as PropType<(row: any, column: TableColumn) => any>,
    required: true,
  },
});

const emit = defineEmits<{
  (
    event: "operation",
    payload: { action: string; row: any; index: number },
  ): void;
}>();

const visibleChildren = computed(() =>
  (props.column.children || []).filter((child) => child.show !== false),
);

const isGroupColumn = computed(() => visibleChildren.value.length > 0);

const getColumnKey = (column: TableColumn, index: number) =>
  column.prop || `${column.label}-${index}`;

const formatCellValue = (value: any) =>
  value === undefined || value === null || value === "" ? "/" : value;

const handleOperation = (payload: {
  action: string;
  row: any;
  index: number;
}) => {
  emit("operation", payload);
};
</script>

<style lang="scss" scoped>
.table-actions-container {
  display: flex;
  align-items: center;
  justify-content: center;

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
</style>
