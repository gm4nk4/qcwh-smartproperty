import type { Component } from "vue";

import ConfigurableQueryForm, {
  QueryFormConfig,
} from "./ConfigurableQueryForm/index.vue";
import ConfigurableTable from "./ConfigurableTable/index.vue";
import ConfigurableTableWithForm from "./ConfigurableTableWithForm.vue";

// 表格列类型定义
export interface TableColumn {
  prop?: string;
  label: string;
  children?: TableColumn[];
  width?: number | string;
  minWidth?: number | string;
  fixed?: boolean | "left" | "right";
  sortable?: boolean | "custom";
  showOverflowTooltip?: boolean;
  slot?: string;
  formatter?: (
    row: any,
    column: TableColumn,
    index: number,
  ) => string | null | undefined;
  show?: boolean | ((row: any) => boolean);
  type?: "normal" | "operation" | "index" | "selection" | "tag";
  operations?: Operation[] | ((row: any) => Operation[]);
  buttonSize?: "large" | "default" | "small";
  align?: "left" | "center" | "right";
  className?: string;
  tagMap?: Record<string, { text: string; class?: string }>;
  tagConfig?: {
    map: Record<
      string,
      {
        text: string;
        class?: string;
      }
    >;
    default?: {
      text: string;
      class?: string;
    };
    classPrefix?: string;
  };
}

// 表格操作按钮类型定义
export interface Operation {
  label: string;
  action: string;
  type?:
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "default"
    | "text";
  show?: boolean | ((row: any) => boolean);
  link?: boolean;
  size?: "large" | "default" | "small";
  disabled?: boolean | ((row: any) => boolean);
  icon?: string | Component;
  textColor?: string;
  [key: string]: any;
  operationAuthCode?: string;
}

// 操作列配置接口
export interface OperationColumn {
  label?: string;
  width?: number | string;
  minWidth?: number | string;
  fixed?: boolean | "left" | "right";
  align?: "left" | "center" | "right";
  className?: string;
  buttonSize?: "large" | "default" | "small";
}

// RightToolbar配置接口
export interface RightToolbarConfig {
  showSearch?: boolean;
  export?: string | boolean;
  exportAuth?: string;
  search?: boolean;
  layout?: boolean;
  tableRowShow?: boolean;
  tableColumns?: any[];
}

// 表格配置接口
export interface TableConfig {
  data?: any[];
  columns: TableColumn[];
  operations?: Operation[];
  operationColumn?: OperationColumn;
  showOperations?: boolean;
  selectionType?: string;
  showIndex?: boolean;
  showAddButton?: boolean;
  showExportButton?: boolean;
  defaultSelectRowId?: string;
  showSelectRadio?: boolean;
  selectionSelectable?: (row: any, index: number) => boolean;
  showResetButton?: boolean;
  loading?: boolean;
  pagination?: boolean;
  paginationLayout?: string;
  pageSizes?: number[];
  tableHeight?: number | string;
  currentPage?: number;
  pageSize?: number;
  total?: number;
  queryForm?: any;
  pageList?: (...arg: any) => Promise<any>;
  descs?: string[];
  autoLoad?: boolean;
  rightToolbar?: RightToolbarConfig;
  showRightToolbar?: boolean;
}

// 字段选项类型定义
export interface FieldOption {
  label: string;
  value?: string | number;
}

// 表格样式接口
export interface TableStyle {
  rowStyle?: any;
  cellStyle?: any;
  headerCellStyle?: any;
}

// useTable 返回值接口
export interface UseTableReturn {
  tableStyle: TableStyle;
  getDataList: (refresh?: any) => void;
  sizeChangeHandle: (val: number) => void;
  currentChangeHandle: (val: number) => void;
  sortChangeHandle: (column: any) => void;
  downBlobFile: (url: string, query: any, fileName: string) => void;
}

export {
  ConfigurableQueryForm,
  ConfigurableTable,
  ConfigurableTableWithForm,
  type QueryFormConfig,
};

export default {
  ConfigurableQueryForm,
  ConfigurableTable,
  ConfigurableTableWithForm,
};
