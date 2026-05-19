<template>
	<div class="configurable-table-with-form">
		<!-- 查询表单组件 -->
		<div v-show="showSearch" class="form-container mb20">
			<ConfigurableQueryForm ref="queryFormRef" v-if="queryFormConfig" :config="queryFormConfig" @search="handleFormSearch" @reset="handleFormReset">
				<template #actions>
					<slot name="formActions"></slot>
				</template>
			</ConfigurableQueryForm>
		</div>

		<div class="table-actions-container mb20">
			<div><slot name="tableActions"></slot></div>
			<div class="table-toolbar-right">
				<el-popover placement="bottom-end" trigger="hover" :width="180">
					<template #reference>
						<el-button :icon="Setting">表格列设置</el-button>
					</template>
					<el-checkbox-group v-model="checkedColumns" class="column-settings-group" @change="handleColumnChange">
						<el-checkbox v-for="col in settableColumns" :key="col.prop" :value="col.prop" :label="col.label" />
					</el-checkbox-group>
				</el-popover>
				<el-button :icon="Search" @click="toggleSearch">{{ showSearch ? '隐藏搜索' : '显示搜索' }}</el-button>
				<el-button :icon="Download" @click="handleExport">导出</el-button>
				<el-button :icon="RefreshRight" @click="handleRefreshData">刷新数据</el-button>
			</div>
		</div>

		<!-- 表格组件 -->
		<div class="table-container">
			<ConfigurableTable
				:key="tableKey"
				ref="tableRef"
				:config="tableConfig"
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

				<!-- 动态插槽转发，用于表格的列自定义渲染 -->
				<template v-for="(_, slotName) in filteredSlots" :key="slotName" #[slotName]="slotProps">
					<slot :name="slotName" v-bind="slotProps"></slot>
				</template>
			</ConfigurableTable>
		</div>
	</div>
</template>

<script lang="ts">
export default {
	name: 'ConfigurableTableWithForm',
};
</script>

<script lang="ts" setup>
import { ref, watch, computed, PropType, useSlots } from 'vue';
import { Setting, Search, Download, RefreshRight } from '@element-plus/icons-vue';
import { ConfigurableTable, ConfigurableQueryForm, QueryFormConfig, TableConfig } from './index';

const props = defineProps({
	// 表单配置
	queryFormConfig: {
		type: Object as PropType<QueryFormConfig>,
		default: null,
	},
	// 表格配置
	tableConfig: {
		type: Object as PropType<TableConfig>,
		required: true,
	},
} as const);

const slots = useSlots();

// 需要排除的插槽（已经显式处理的）
const excludedSlots = ['formActions', 'tableActions', 'tableSettings', 'rightToolbarSlot'];

// 过滤后的插槽（排除已显式处理的）
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
	'search',
	'reset',
	'add',
	'export',
	'select',
	'operation',
	'size-change',
	'current-change',
	'refresh',
	'update:showSearch',
	'sort-change',
]);

// 表格组件引用
const tableRef = ref();
const queryFormRef = ref();
const isProgrammaticReset = ref(false);

// 控制查询表单的显示/隐藏
const showSearch = ref(props.tableConfig?.rightToolbar?.showSearch !== false);

// 保存最新的表单数据
const formData = ref<Record<string, any>>({});

// 表格刷新 key
const tableKey = ref(0);

// 表格列设置 - 可配置的列（排除selection、index、operation等特殊列）
const settableColumns = computed(() => {
	const cols = props.tableConfig?.columns || [];
	return cols.filter((col: any) => col.type !== 'selection' && col.type !== 'index' && col.type !== 'operation');
});

// 已勾选的列
const checkedColumns = ref<string[]>([]);

// 初始化勾选列
const initCheckedColumns = () => {
	const cols = props.tableConfig?.columns || [];
	checkedColumns.value = cols
		.filter((col: any) => col.show !== false && col.type !== 'selection' && col.type !== 'index' && col.type !== 'operation')
		.map((col: any) => col.prop);
};
initCheckedColumns();

// 列显示/隐藏切换
const handleColumnChange = (checkedProps: string[]) => {
	const cols = props.tableConfig?.columns || [];
	props.tableConfig.columns = cols.map((col: any) => ({
		...col,
		show: col.type === 'selection' || col.type === 'index' || col.type === 'operation' ? col.show : checkedProps.includes(col.prop),
	}));
	tableKey.value++;
};

// 显示/隐藏搜索
const toggleSearch = () => {
	showSearch.value = !showSearch.value;
	emit('update:showSearch', showSearch.value);
};

// 刷新数据
const handleRefreshData = () => {
	if (tableRef.value && props.tableConfig.pageList) {
		tableRef.value.getDataList();
	}
	emit('search', formData.value);
};

// 事件处理函数
const handleFormSearch = (searchFormData: Record<string, any>) => {
	// 保存最新的表单数据
	formData.value = searchFormData;
	emit('search', searchFormData);
	// 如果表格配置中有pageList函数，自动调用获取数据
	if (tableRef.value && props.tableConfig.pageList) {
		tableRef.value.getDataList();
	}
};

const handleFormReset = () => {
	// 重置表单数据
	formData.value = {};

	if (!isProgrammaticReset.value) {
		emit('reset');
	}

	// 如果表格配置中有pageList函数，自动调用获取数据
	if (tableRef.value && props.tableConfig.pageList) {
		tableRef.value.getDataList();
	}
};

//刷新数据
const resetFun = () => {
	if (tableRef.value && props.tableConfig.pageList) {
		tableRef.value.getDataList();
	}
};

// 改变列
const changeColumns = (columns: any) => {};

const handleAdd = () => {
	emit('add');
};

const handleExport = () => {
	emit('export');
};

const handleReset = () => {
	emit('reset');
};

const handleSelect = (selection: any[]) => {
	emit('select', selection);
};

const handleOperation = (data: any) => {
	emit('operation', data);
};

const handleSizeChange = (size: number) => {
	emit('size-change', size);
};

const handleCurrentChange = (page: number) => {
	emit('current-change', page);
};

const handleRefresh = () => {
	emit('refresh');
};

const handleUpdateShowSearch = (val: boolean) => {
	showSearch.value = val;
	emit('update:showSearch', val);
};

const handleSortChange = (sort: any) => {
	emit('sort-change', sort);
};

// 监听配置变化
watch(
	() => props.tableConfig?.rightToolbar?.showSearch,
	(val) => {
		if (val !== undefined) showSearch.value = val !== false;
	}
);

// 向外暴露方法
defineExpose({
	// 转发表格组件的方法
	getSelectedRows: () => tableRef.value?.selectedRows,
	getVisibleColumns: () => tableRef.value?.visibleColumns,
	getDataList: () => tableRef.value?.getDataList(),
	downBlobFile: (...args: any[]) => tableRef.value?.downBlobFile(...args),
	resetSelection: () => tableRef.value?.resetSelection(),
	clearSelection: () => tableRef.value?.clearSelection?.(),
	toggleRowSelection: (row: any, selected?: boolean) => tableRef.value?.toggleRowSelection?.(row, selected),
	// 表单方法
	getFormData: () => {
		// 直接返回保存的表单数据，确保与搜索时的formData一致
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

<style scoped>
.configurable-table-with-form {
	display: flex;
	flex-direction: column;
	height: 100%;
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
}

.table-container :deep(.configurable-table-container) {
	min-width: 0;
	max-width: 100%;
}

.table-toolbar-right {
	display: flex;
	gap: 8px;
	align-items: center;
}

.column-settings-group {
	display: flex;
	flex-direction: column;
	gap: 8px;
}
</style>
