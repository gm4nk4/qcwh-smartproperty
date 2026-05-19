import ConfigurableQueryForm, { QueryFormConfig } from './ConfigurableQueryForm/index.vue';
import ConfigurableTable from './ConfigurableTable/index.vue';
import ConfigurableTableWithForm from './ConfigurableTableWithForm.vue';

// 表格列类型定义
export interface TableColumn {
	prop?: string; // 当type为'operation'时可选
	label: string;
	width?: number | string;
	minWidth?: number | string;
	fixed?: boolean | 'left' | 'right';
	sortable?: boolean | 'custom';
	showOverflowTooltip?: boolean;
	slot?: string;
	formatter?: (row: any, column: TableColumn, index: number) => string | null | undefined;
	show?: boolean | ((row: any) => boolean);
	// 新增：列类型，用于标识特殊列如操作列
	type?: 'normal' | 'operation' | 'index' | 'selection' | 'tag';
	// 新增：当type为operation时的操作按钮配置
	operations?: Operation[] | ((row: any) => Operation[]);
	// 新增：操作按钮大小
	buttonSize?: 'large' | 'default' | 'small';
	// 新增：对齐方式
	align?: 'left' | 'center' | 'right';
	// 新增：列的类名
	className?: string;
	// 新增：标签映射
	tagMap?: Record<string, { text: string; class?: string }>;
	// 新增：标签配置（支持自定义样式）
	tagConfig?: {
		// 标签类型映射：字段值 -> 标签配置
		map: Record<
			string,
			{
				text: string; // 显示文本
				class?: string; // 自定义 CSS 类名
			}
		>;
		// 默认标签配置（当字段值不在 map 中时使用）
		default?: {
			text: string;
			class?: string;
		};
		// 自定义类名前缀（用于 BEM 命名）
		classPrefix?: string;
	};
}

// 表格操作按钮类型定义
export interface Operation {
	label: string;
	action: string;
	type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default' | 'text';
	show?: boolean | ((row: any) => boolean);
	link?: boolean;
	size?: 'large' | 'default' | 'small';
	disabled?: boolean | ((row: any) => boolean);
	icon?: string | Component;
	// 自定义文字颜色
	textColor?: string;
	// 其他按钮属性
	[key: string]: any;
	// 新增：操作权限
	operationAuthCode?: string;
}

// 操作列配置接口
export interface OperationColumn {
	label?: string;
	width?: number | string;
	minWidth?: number | string;
	fixed?: boolean | 'left' | 'right';
	align?: 'left' | 'center' | 'right';
	className?: string;
	buttonSize?: 'large' | 'default' | 'small';
}

// RightToolbar配置接口
export interface RightToolbarConfig {
	// 是否显示搜索
	showSearch?: boolean;
	// 是否导出
	export?: string | boolean;
	// 导出权限
	exportAuth?: string;
	// 是否显示搜索按钮
	search?: boolean;
	// 是否显示布局切换
	layout?: boolean;
	// 是否显示表格列设置
	tableRowShow?: boolean;
	// 表格列配置
	tableColumns?: any[];
}

// 表格配置接口
export interface TableConfig {
	// 表格数据
	data?: any[];
	// 表格列配置
	columns: TableColumn[];
	// 操作列配置
	operations?: Operation[];
	// 操作列属性配置
	operationColumn?: OperationColumn;
	// 是否显示操作列
	showOperations?: boolean;
	// 选择类型 none | checkbox | radio
	selectionType?: string;
	// 是否显示序号
	showIndex?: boolean;
	// 是否显示新增按钮
	showAddButton?: boolean;
	// 是否显示导出按钮
	showExportButton?: boolean;
	// 默认选中行ID
	defaultSelectRowId?: string;
	// 是否显示单选列
	showSelectRadio?: boolean;
	// 多选框是否允许选择当前行
	selectionSelectable?: (row: any, index: number) => boolean;
	// 是否显示重置按钮
	showResetButton?: boolean;
	// 是否显示加载状态
	loading?: boolean;
	// 分页配置
	pagination?: boolean;
	// 分页布局
	paginationLayout?: string;
	// 每页显示条数选择器的选项
	pageSizes?: number[];
	// 当前页数
	currentPage?: number;
	// 每页显示条数
	pageSize?: number;
	// 总条数
	total?: number;
	// useTable相关配置
	// 查询表单
	queryForm?: any;
	// 数据查询API方法
	pageList?: (...arg: any) => Promise<any>;
	// 排序字段
	descs?: string[];
	// 是否自动加载数据
	autoLoad?: boolean;
	// RightToolbar配置
	rightToolbar?: RightToolbarConfig;
	// 是否显示RightToolbar
	showRightToolbar?: boolean;
}

// 字段选项类型定义
export interface FieldOption {
	label: string;
	value?: string | number;
}

export { ConfigurableQueryForm, ConfigurableTable, ConfigurableTableWithForm, type QueryFormConfig };

// 默认导出所有组件
export default {
	ConfigurableQueryForm,
	ConfigurableTable,
	ConfigurableTableWithForm,
};
