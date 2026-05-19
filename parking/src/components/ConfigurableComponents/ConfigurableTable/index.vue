<template>
	<div class="configurable-table-container">
		<div class="table-content">
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
					}
				"
				:cell-style="tableStyle.cellStyle || { textAlign: 'left' }"
				:row-style="{ background: '#fff' }"
				:highlight-current-row="selectionType === 'radio'"
				height="100%"
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
				<el-table-column v-if="selectionType === 'radio' && showSelectRadio" width="55" align="center" fixed="left">
					<template #default="scope">
						<el-radio :model-value="selectedRadioRow?.id === scope.row.id" @change="handleRadioChange(scope.row)" :label="true">
							<span></span>
						</el-radio>
					</template>
				</el-table-column>

				<!-- 序号列 -->
				<el-table-column v-if="showIndex" type="index" width="60" label="序号" fixed="left" align="center" />

				<!-- 动态列 -->
				<template v-for="column in visibleColumns" :key="column.prop">
					<!-- 操作列 -->
					<el-table-column
						v-if="column.type === 'operation'"
						:prop="column.prop"
						:label="column.label"
						:width="column.width"
						:min-width="column.minWidth"
						:fixed="column.fixed"
						:align="column.align || 'center'"
						:class-name="column.className"
					>
						<template #default="scope">
							<!-- 优先使用自定义插槽 -->
							<slot v-if="column.slot" :name="column.slot" :row="scope.row" :index="scope.$index"></slot>

							<!-- 使用默认操作按钮 -->
							<template v-else>
								<el-button
									v-for="(op, i) in getColumnOperations(column, scope.row)"
									:key="i"
									:type="op.type || 'primary'"
									:link="op.link !== false"
									:size="op.size || column.buttonSize || 'default'"
									:disabled="typeof op.disabled === 'function' ? op.disabled(scope.row) : op.disabled"
									:icon="getButtonIcon(op.label, op.icon)"
									:style="getButtonStyle(op, scope.row)"
									@click="handleOperation(op.action, scope.row, scope.$index)"
									v-auth="op.operationAuthCode"
								>
									{{ op.label }}
								</el-button>
							</template>
						</template>
					</el-table-column>

					<!-- 普通列 -->
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
							<!-- 优先使用自定义插槽 -->
							<template v-if="column.slot">
								<slot :name="column.slot" :row="scope.row" :index="scope.$index"></slot>
							</template>
							<!-- 标签列渲染 -->
							<template v-else-if="column.type === 'tag' || column.tagConfig">
								<span :class="getTagClass(scope.row, column)">
									{{ getTagText(scope.row, column) }}
								</span>
							</template>
							<!-- formatter 渲染 -->
							<template v-else-if="column.formatter">
								{{
									column.formatter?.(scope.row, column, scope.$index) === undefined ||
									column.formatter?.(scope.row, column, scope.$index) === null ||
									column.formatter?.(scope.row, column, scope.$index) === ''
										? '/'
										: column.formatter?.(scope.row, column, scope.$index)
								}}
							</template>
							<!-- 默认文本渲染 -->
							<template v-else>
								{{
									scope.row[column.prop] === undefined || scope.row[column.prop] === null || scope.row[column.prop] === ''
										? '/'
										: scope.row[column.prop]
								}}
							</template>
						</template>
					</el-table-column>
				</template>

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
								:disabled="typeof op.disabled === 'function' ? op.disabled(scope.row) : op.disabled"
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
		<div class="pagination-container" v-if="pagination">
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
	name: 'ConfigurableTable',
};
</script>

<script lang="ts" setup>
import { ref, computed, PropType, onMounted, watch, reactive } from 'vue';
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
} from '@element-plus/icons-vue';
import { TableColumn, Operation, TableConfig } from '../index';
import { BasicTableProps, useTable } from '/@/hooks/table';

const props = defineProps({
	// 统一表格配置对象
	config: {
		type: Object as PropType<TableConfig>,
		required: true,
	},
});

const emit = defineEmits([
	'add',
	'export',
	'reset',
	'select',
	'operation',
	'size-change',
	'current-change',
	'refresh',
	'update:showSearch',
	'sort-change',
]);

// 解构配置并设置默认值
const operations = computed(() => props.config.operations || []);
const operationColumn = computed(() => props.config.operationColumn || {});
const selectionType = computed(() => props.config.selectionType || 'none');
const showSelectRadio = computed(() => props.config.showSelectRadio !== false);
const selectionSelectable = computed(() => props.config.selectionSelectable);
const showIndex = computed(() => props.config.showIndex !== false);
const showOperations = computed(() => props.config.showOperations !== false);
const pagination = computed(() => props.config.pagination !== false);
const pageSizes = computed(() => props.config.pageSizes || [10, 20, 50, 100]);

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
	}
);

watch(
	() => props.config.pageSize,
	(val) => {
		if (val !== undefined) pageSize.value = val;
	}
);

watch(
	() => props.config.total,
	(val) => {
		if (val !== undefined) totalCount.value = val;
	}
);

// 设置useTable的state
const tableState = reactive<BasicTableProps>({
	queryForm: props.config.queryForm || {},
	pageList: props.config.pageList,
	descs: props.config.descs || [],
	pagination: {
		current: currentPage.value,
		size: pageSize.value,
		total: totalCount.value,
	},
});

// 使用useTable hook
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(tableState);

// 表格数据
const tableData = computed(() => props.config.data || tableState.dataList || []);

// 表格加载状态
const loadingComputed = computed(() => {
	return props.config.loading !== undefined ? props.config.loading : isLoading.value;
});

// 监听配置变化
watch(
	() => props.config.queryForm,
	(val) => {
		if (val && tableState.queryForm) Object.assign(tableState.queryForm, val);
	},
	{ deep: true }
);

// 可见列
const columns = computed(() => props.config.columns || []);
const visibleColumns = computed(() => {
	return columns.value.filter((col) => col.show !== false);
});

// 选择的数据
const selectedRows = ref<any[]>([]);
const selectedRadioRow = ref<Record<string, any>>({ id: '' });
const tableRef = ref();

// 处理多选变化
const handleSelectionChange = (selection: any[]) => {
	if (selectionType.value === 'checkbox') {
		selectedRows.value = selection;
		emit('select', selection);
	}
};

// 处理单选变化
const handleRadioChange = (row: any) => {
	selectedRadioRow.value = row;
	if (tableRef.value) {
		tableRef.value.setCurrentRow(row);
	}
	emit('select', row);
};

// 处理行点击
const handleRowClick = (row: any) => {
	if (selectionType.value === 'radio') {
		handleRadioChange(row);
	}
};

// 处理操作按钮点击
const handleOperation = (action: string, row: any, index: number) => {
	emit('operation', { action, row, index });
};

// 处理分页大小变化
const handleSizeChange = (size: number) => {
	pageSize.value = size;
	emit('size-change', size);
	if (tableState.pagination) {
		tableState.pagination.size = size;
	}
	sizeChangeHandle(size);
};

// 处理页码变化
const handleCurrentChange = (page: number) => {
	currentPage.value = page;
	emit('current-change', page);
	if (tableState.pagination) {
		tableState.pagination.current = page;
	}
	currentChangeHandle(page);
};

// 处理排序变化
const handleSortChange = (sort: any) => {
	emit('sort-change', sort);
};

// 获取可用操作
const getAvailableOperations = (row: any) => {
	return operations.value.filter((op) => {
		if (typeof op.show === 'function') {
			return op.show(row);
		}
		return op.show !== false;
	});
};

// 获取列的操作
const getColumnOperations = (column: TableColumn, row: any) => {
	if (!column.operations) return [];

	if (typeof column.operations === 'function') {
		return column.operations(row) || [];
	}

	// 过滤出应该显示的操作
	return column.operations.filter((op) => {
		if (typeof op.show === 'function') {
			return op.show(row);
		}
		return op.show !== false;
	});
};

// 判断是否存在操作列
const hasOperationColumn = computed(() => {
	return columns.value.some((col) => col.type === 'operation');
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
	// 自定义映射：业务按钮
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
	查看: '#2563eb', // 蓝色 - 编辑操作
	编辑: '#16a34a', // 绿色 - 编辑操作
	跟进: '#16a34a', // 绿色 - 编辑操作
	更新进度: '#16a34a', // 绿色 - 编辑操作

	删除: '#dc2626', // 红色 - 删除操作
	拒绝: '#dc2626',
	取消: '#dc2626',
	终止: '#dc2626',

	审核: '#9333ea', // 紫色 - 评审操作
	审批: '#9333ea',
	评审: '#9333ea',
	复核: '#9333ea',

	提交: '#4f46e5', // 靛蓝色 - 提交操作
	发起: '#4f46e5',
	发送: '#4f46e5',
	上报: '#4f46e5',
	转移: '#4f46e5',

	处理: '#0d9488', // 青色 - 处理操作
	完成: '#0d9488',
	通过: '#0d9488',
	确认: '#0d9488',

	归档: '#4a5565', //灰色-归档操作
	存档: '#4a5565',
	归档入库: '#4a5565',

	复制: '#ea580c', // 橙色- 复制操作
	下载: '#ea580c',
	上传: '#ea580c',
	导出: '#ea580c',
	导入: '#ea580c',
	变更: '#ea580c', // 蓝色 - 审批操作

	启用: '#67C23A', // 绿色
	禁用: '#F56C6C', // 红色
};

// 根据按钮标签获取图标，如果没有找到则返回编辑图标
const getButtonIcon = (label: string, customIcon?: any) => {
	// 如果已指定图标，优先使用指定的图标
	if (customIcon) {
		return customIcon;
	}
	if (label == '-' && customIcon === undefined) {
		return null;
	}
	// 根据标签查找图标
	return buttonIconMap[label] || Edit;
};

// 根据按钮标签获取文本颜色，如果没有找到则返回默认颜色
const getButtonTextColor = (label: string, customColor?: string) => {
	// 如果已指定颜色，优先使用指定的颜色
	if (customColor) {
		return customColor;
	}
	// 根据标签查找颜色，如果没有找到则返回默认的主题蓝色
	return buttonTextColorMap[label] || '#2563eb';
};

// 获取按钮样式，如果按钮是disabled状态，不应用自定义颜色
const getButtonStyle = (op: Operation, row: any) => {
	// 判断按钮是否disabled
	const isDisabled = typeof op.disabled === 'function' ? op.disabled(row) : op.disabled;

	// 如果按钮是disabled状态，不设置color，让Element Plus使用默认的disabled样式
	if (isDisabled) {
		return {};
	}

	// 如果按钮不是disabled状态，应用自定义颜色
	return {
		color: getButtonTextColor(op.label, op.textColor),
	};
};

// ========== Tag 标签辅助函数 ==========
/**
 * 获取标签文本
 */
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

/**
 * 获取标签类名（支持自定义 class 或 BEM 命名）
 * 自动添加 status-tag 基础类
 */
const getTagClass = (row: any, col: any) => {
	const v = row[col.prop];
	const cls = ['status-tag'];
	if (col.tagConfig) {
		const t = col.tagConfig.map[v];
		if (t?.class) {
			cls.push(t.class);
			return cls.join(' ');
		}
		if (col.tagConfig.classPrefix && v) {
			cls.push(`${col.tagConfig.classPrefix}-${v}`);
			return cls.join(' ');
		}
		// 没有找到匹配时，使用默认配置
		if (col.tagConfig.default?.class) {
			cls.push(col.tagConfig.default.class);
		}
		return cls.join(' ');
	}
	if (col.tagMap && v) {
		cls.push(`tag-${v}`);
	}
	return cls.join(' ') || 'status-tag';
};

// 初始化
onMounted(() => {
	if (props.config.autoLoad !== false && props.config.pageList) {
		getDataList();
	}
	if (props.config.defaultSelectRowId) {
		selectedRadioRow.value['id'] = props.config.defaultSelectRowId;
	}
});

// 监听内部状态变化，同步到分页状态
watch(
	() => tableState.pagination?.total,
	(val) => {
		if (val !== undefined) {
			totalCount.value = val;
		}
	}
);

watch(
	() => tableState.loading,
	(val) => {
		isLoading.value = val === true;
	}
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
		selectedRadioRow.value = { id: '' };
		if (tableRef.value) {
			tableRef.value.clearSelection?.();
			tableRef.value.setCurrentRow();
		}
	},
	clearSelection: () => tableRef.value?.clearSelection?.(),
	toggleRowSelection: (row: any, selected?: boolean) => tableRef.value?.toggleRowSelection?.(row, selected),
	tableRef,
});
</script>

<style scoped>
.configurable-table-container {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	background: #fff;
	border-radius: 4px;
	/* padding: 0 20px; */
	overflow: hidden;
	min-height: 0;
	min-width: 0;
	max-width: 100%;
	/* 添加最小高度为0，防止flex子元素溢出 */
}

.table-actions {
	display: flex;
	gap: 10px;
}

.table-content {
	flex: 1;
	overflow: auto;
	/* 改为auto，允许内容滚动 */
	position: relative;
	min-height: 200px;
	min-width: 0;
	/* 设置最小高度确保表格可见 */
}

:deep(.el-table) {
	height: 100%;
	/* 确保表格占满容器高度 */
}

:deep(.el-table__body-wrapper) {
	overflow-y: auto !important;
	/* 强制表格主体可垂直滚动 */
}

/* 移除所有内部竖线 */
:deep(.el-table--border .el-table__cell) {
	border-right: none !important;
}

:deep(.el-table--border th.el-table__cell) {
	border-right: none !important;
}

:deep(.el-table__border-left-patch) {
	display: none !important;
}

/* 保留横线 */
:deep(.el-table td.el-table__cell) {
	border-bottom: 1px solid var(--el-table-border-color);
}

:deep(.el-table th.el-table__cell) {
	border-bottom: 1px solid var(--el-table-border-color);
}

/* 强制设置表头背景色 */
:deep(.el-table__header-wrapper th) {
	background-color: #f8f9fa !important;
}

/* 确保所有数据行背景为白色 */
:deep(.el-table__row) {
	background-color: #fff !important;
}

:deep(.el-table__row--striped) {
	background-color: #fff !important;
}

:deep(.el-table__body tr.hover-row > td) {
	background-color: var(--el-table-row-hover-bg-color) !important;
}

.empty-data {
	padding: 60px 0;
}

/* 分页容器样式 - 作为表格尾部行，与表头样式一致 */
.pagination-container {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: #f9fafb;
	margin-top: 0 !important;
	border-left: 1px solid #ebebeb;
	border-right: 1px solid #ebebeb;
	border-bottom: 1px solid #ebebeb;
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
	/* 为页码按钮添加间距 */
}

/* 上一页/下一页按钮样式 */
:deep(.el-pagination .btn-prev),
:deep(.el-pagination .btn-next) {
	background-color: #fff;
	border: 1px solid #dcdfe6;
	border-radius: 4px;
	padding: 0 12px;
	margin: 0 4px;
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
</style>
