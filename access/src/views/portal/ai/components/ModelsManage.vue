<template>
	<div class="models-manage">
		<!-- 列表视图 -->
		<div class="models-list-view">
			<ConfigurableTableWithForm
				ref="tableRef"
				:query-form-config="queryFormConfig"
				:table-config="tableConfig"
				@operation="handleTableOperation"
				@search="handleSearch"
				@reset="handleReset"
				:showExport="false"
				:showColumnSettings="true"
				:showSearchToggle="false"
				:showRefresh="true"
			>
				<template #tableActions>
					<div class="table-actions">
						<el-button
							type="primary"
							@click="handleAdd"
						>
							<el-icon><Plus /></el-icon>
							新增模型
						</el-button>
					</div>
				</template>
				<!-- 状态列插槽 -->
				<template #statusSlot="{ row }">
					<el-tag
						:type="row.status === 'enabled' ? 'success' : 'info'"
						size="small"
					>
						{{ row.statusText }}
					</el-tag>
				</template>
				<!-- 首选列插槽 -->
				<template #preferredSlot="{ row }">
					<el-tag
						v-if="row.isPreferred"
						type="success"
						size="small"
					>
						首选
					</el-tag>
				</template>
				<template #cardView>
					<!-- 卡片视图 -->
					<div class="models-card-view">
						<div
							v-for="category in categories"
							:key="category.id"
							class="category-section"
						>
							<!-- 分类头部 -->
							<div class="category-header">
								<div class="category-info">
									<el-icon
										class="category-icon"
										:style="{ color: category.color }"
									>
										<component :is="getIconByName(category.icon)" />
									</el-icon>
									<span class="category-name">{{ category.name }}</span>
									<span class="category-count"> {{ getModelsByCategory(category.id).length }}个模型 </span>
									<el-divider direction="vertical" />
									<span class="category-sub"> 首选：{{ getPreferredModelsByCategory(category.id).length }} </span>
									<el-divider direction="vertical" />
									<span class="category-sub"> 未设置：{{ getUnconfiguredModelsByCategory(category.id).length }} </span>
								</div>
							</div>
							<!-- 分类下的模型卡片 -->
							<div class="category-models">
								<div
									v-for="model in getModelsByCategory(category.id)"
									:key="model.id"
									class="model-card"
									:class="{ disabled: model.status === 'disabled' }"
								>
									<div class="model-card-header">
										<div class="model-name">
											<span class="name-text">{{ model.name }}</span>
											<!-- 首选标签 -->
											<el-tag
												v-if="model.isPreferred"
												type="success"
												size="small"
												class="preferred-tag"
											>
												首选
											</el-tag>
											<!-- 状态标签 -->
											<el-tag
												:type="model.status === 'enabled' ? 'success' : 'info'"
												size="small"
												class="status-tag"
											>
												{{ model.statusText }}
											</el-tag>
										</div>
										<div class="model-actions">
											<el-button
												type="primary"
												link
												size="small"
												@click="handleSetPreferred(model)"
											>
												<el-icon><Star /></el-icon>
												设为首选
											</el-button>
											<el-button
												type="primary"
												link
												size="small"
												@click="handleEdit(model)"
											>
												<el-icon><Edit /></el-icon>
												编辑
											</el-button>
										</div>
									</div>
									<div class="model-card-body">
										<div class="model-item">
											<span class="label">提供商</span>
											<span class="value">{{ model.provider }}</span>
										</div>
										<div class="model-item">
											<span class="label">模型ID</span>
											<span class="value">{{ model.modelId }}</span>
										</div>
										<div class="model-item">
											<span class="label">Max Tokens</span>
											<span class="value">{{ model.maxTokens }}</span>
										</div>
									</div>
									<div class="model-card-footer">
										<el-button
											type="primary"
											link
											size="small"
											@click="handleEdit(model)"
										>
											<el-icon><Edit /></el-icon>
											编辑
										</el-button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</template>
			</ConfigurableTableWithForm>
		</div>
	</div>
</template>

<script setup lang="ts" name="ModelsManage">
import { ref, computed, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { Search, Refresh, Plus, Grid, List, Star, Edit, ChatDotRound, Picture, Microphone, Document, Monitor } from '@element-plus/icons-vue';
import { ConfigurableTableWithForm, type QueryFormConfig, type TableColumn, type TableConfig, type Operation } from '@zhqc-smart/table';
import type { Model, ViewType, ModelQueryParams } from '../type';
import { mockModelCategories, mockModels, providerOptions, modelTypeOptions } from '../mock';

/**
 * 组件属性定义
 */
interface Props {
	/** 模型列表数据 */
	models?: Model[];
	/** 模型分类数据 */
	categories?: any[];
}

/**
 * 组件事件定义
 */
interface Emits {
	/** 切换模型状态 */
	(e: 'toggle-status', model: Model): void;
	/** 编辑模型 */
	(e: 'edit', model: Model): void;
	/** 新增模型 */
	(e: 'add'): void;
	/** 设为首选 */
	(e: 'set-preferred', model: Model): void;
}

const props = withDefaults(defineProps<Props>(), {
	models: () => mockModels,
	categories: () => mockModelCategories,
});

const emit = defineEmits<Emits>();

/** 当前视图类型 */
const viewType = ref<ViewType>('card');
/** 表格引用 */
const tableRef = ref();

/** 查询参数 */
const queryParams = reactive<ModelQueryParams>({
	modelName: '',
	provider: '',
	modelType: '',
});

/** 筛选后的模型数据 */
const filteredModels = computed(() => {
	return props.models.filter((model) => {
		if (queryParams.modelName && !model.name.includes(queryParams.modelName)) {
			return false;
		}
		if (queryParams.provider && model.provider !== queryParams.provider) {
			return false;
		}
		return true;
	});
});

/** 查询表单配置 */
const queryFormConfig = computed<QueryFormConfig>(() => ({
	fields: [
		{ label: '模型名称', value: 'modelName', type: 'text', selected: true },
		{ label: '提供商', value: 'provider', type: 'select', selected: true },
		{ label: '模型类型', value: 'modelType', type: 'select', selected: true },
	],
	fieldOptions: {
		provider: providerOptions,
		modelType: modelTypeOptions,
	},
	maxConditions: 3,
	initialConditions: 3,
}));

/** 表格列配置 */
const tableColumns: TableColumn[] = [
	{ prop: 'name', label: '模型名称', width: 240, align: 'center' },
	{ prop: 'description', label: '模型描述', width: 300, align: 'center' },
	{ prop: 'category', label: '模型类型', width: 140, align: 'center' },
	{ prop: 'provider', label: '提供商', width: 120, align: 'center' },
	{ prop: 'modelId', label: '模型ID', width: 160, align: 'center' },
	{ prop: 'status', label: '模型状态', width: 100, align: 'center', slot: 'statusSlot' },
	{ prop: 'maxTokens', label: 'Max Tokens', width: 120, align: 'center' },
	{ prop: 'isPreferred', label: '是否首选', width: 100, align: 'center', slot: 'preferredSlot' },
	{
		prop: 'operation',
		label: '操作',
		type: 'operation',
		width: 260,
		fixed: 'right',
		align: 'center',
		buttonSize: 'small',
		operations: (row: any): Operation[] => {
			const ops: Operation[] = [
				{ label: '查看', action: 'view', type: 'primary', link: true },
				{ label: '编辑', action: 'edit', type: 'primary', link: true },
				{ label: '设为首选', action: 'setPreferred', type: 'primary', link: true },
			];
			return ops;
		},
	},
];

/** 表格配置 */
const tableConfig = computed<TableConfig>(() => ({
	columns: tableColumns,
	data: props.models,
	selectionType: 'checkbox',
	showIndex: true,
	loading: false,
	pagination: true,
	pageSize: 10,
	currentPage: 1,
	total: props.models.length,
	showAddButton: false,
	showExportButton: false,
	showResetButton: false,
	autoLoad: false,
	rightToolbar: {
		showSearch: true,
		export: false,
	},
}));

/**
 * 根据分类ID获取该分类下的模型
 * @param categoryId 分类ID
 * @returns 模型列表
 */
const getModelsByCategory = (categoryId: string) => {
	const category = props.categories.find((c) => c.id === categoryId);
	if (!category) return [];
	return filteredModels.value.filter((model) => model.category === category.name);
};

/**
 * 获取分类下的首选模型数量
 * @param categoryId 分类ID
 * @returns 首选模型数量
 */
const getPreferredModelsByCategory = (categoryId: string) => {
	return getModelsByCategory(categoryId).filter((model) => model.isPreferred);
};

/**
 * 获取分类下的未设置首选的模型数量
 * @param categoryId 分类ID
 * @returns 未设置首选的模型数量
 */
const getUnconfiguredModelsByCategory = (categoryId: string) => {
	return getModelsByCategory(categoryId).filter((model) => !model.isPreferred);
};

/**
 * 根据图标名称获取图标组件
 * @param iconName 图标名称
 * @returns 图标组件
 */
const getIconByName = (iconName: string) => {
	const iconMap: Record<string, any> = {
		ChatDotRound,
		Picture,
		Microphone,
		Document,
		Monitor,
	};
	return iconMap[iconName] || ChatDotRound;
};

/**
 * 处理搜索
 */
const handleSearch = () => {
	ElMessage.success('查询成功');
};

/**
 * 处理重置
 */
const handleReset = () => {
	queryParams.modelName = '';
	queryParams.provider = '';
	queryParams.modelType = '';
	ElMessage.success('重置成功');
};

/**
 * 处理新增模型
 */
const handleAdd = () => {
	emit('add');
	ElMessage.success('新增模型');
};

/**
 * 处理编辑模型
 * @param model 模型数据
 */
const handleEdit = (model: Model) => {
	emit('edit', model);
	ElMessage.success(`编辑模型: ${model.name}`);
};

/**
 * 处理设为首选
 * @param model 模型数据
 */
const handleSetPreferred = (model: Model) => {
	emit('set-preferred', model);
	ElMessage.success(`设为首选: ${model.name}`);
};

/**
 * 处理表格操作
 * @param data 操作数据
 */
const handleTableOperation = (data: { action: string; row: Model }) => {
	switch (data.action) {
		case 'view':
			ElMessage.info(`查看模型: ${data.row.name}`);
			break;
		case 'edit':
			handleEdit(data.row);
			break;
		case 'setPreferred':
			handleSetPreferred(data.row);
			break;
		default:
			break;
	}
};
</script>

<style scoped lang="scss">
.models-manage {
	display: flex;
	flex-direction: column;
	gap: 20px;
	flex: 1;
}

.filter-section {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	background: white;
	padding: 20px;
	border-radius: 8px;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

	.filter-form {
		flex: 1;
		margin-bottom: 0;
	}

	.filter-actions {
		display: flex;
		align-items: center;
		gap: 16px;

		.view-switch {
			display: flex;
			gap: 4px;

			.el-button {
				padding: 6px 12px;

				&.active {
					background: var(--el-color-primary);
					color: white;
				}
			}
		}
	}
}

.models-card-view {
	display: flex;
	flex-direction: column;
	gap: 24px;
}

.category-section {
	background: #f7f8fa;
	border-radius: 12px;
	padding: 16px;
}

.category-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;

	.category-info {
		display: flex;
		align-items: center;
		gap: 8px;

		.category-icon {
			font-size: 20px;
		}

		.category-name {
			font-size: 16px;
			font-weight: 600;
			color: #1f2937;
		}

		.category-count {
			font-size: 14px;
			color: #6b7280;
		}

		.category-sub {
			font-size: 14px;
			color: #9ca3af;
		}
	}
}

.category-models {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
	gap: 16px;
}

.model-card {
	background: white;
	border-radius: 12px;
	padding: 16px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	border: 1px solid #e5e7eb;
	transition: all 0.3s;

	&:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	&.disabled {
		opacity: 0.6;
	}
}

.model-card-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 16px;

	.model-name {
		display: flex;
		gap: 8px;
		align-items: center;

		.name-text {
			font-size: 15px;
			font-weight: 600;
			color: #1f2937;
		}

		.preferred-tag {
			margin: 0;
		}

		.status-tag {
			margin: 0;
		}
	}

	.model-actions {
		display: flex;
		gap: 4px;
	}
}

.model-card-body {
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-bottom: 12px;

	.model-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 13px;

		.label {
			color: #6b7280;
		}

		.value {
			color: #374151;
			font-weight: 500;
		}
	}
}

.model-card-footer {
	display: flex;
	justify-content: flex-end;
	border-top: 1px solid #f3f4f6;
	padding-top: 12px;
}

.models-list-view {
	background: white;
	border-radius: 12px;
	padding: 20px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	flex: 1;
	.table-actions {
		display: flex;
		gap: 12px;
	}
}
</style>
