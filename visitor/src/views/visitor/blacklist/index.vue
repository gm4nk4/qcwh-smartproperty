<template>
	<div class="layout-padding visitor-blacklist">
		<div class="layout-padding-auto layout-padding-view visitor-blacklist__body">
			<section class="visitor-blacklist__search">
				<div class="visitor-blacklist__search-grid">
					<div class="visitor-blacklist__field" v-for="item in queryFieldConfigs" :key="item.key">
						<div class="visitor-blacklist__field-label">{{ item.label }}</div>
						<component
							:is="item.component"
							v-bind="item.props"
							:model-value="formData[item.field]"
							@update:modelValue="(value: unknown) => handleQueryValueChange(item.field, value)"
						>
							<template v-if="item.component === 'el-select'">
								<el-option v-for="option in item.options" :key="option.value" :label="option.label" :value="option.value" />
							</template>
						</component>
					</div>

					<div class="visitor-blacklist__actions">
						<el-button type="primary" @click="handleSearch">
							<el-icon class="mr5">
								<ele-Search />
							</el-icon>
							查询
						</el-button>
						<el-button @click="handleReset">
							<el-icon class="mr5">
								<ele-Refresh />
							</el-icon>
							重置
						</el-button>
					</div>

					<div class="visitor-blacklist__create-action">
						<el-button type="primary" @click="openCreateDialog">
							<el-icon class="mr5">
								<ele-Plus />
							</el-icon>
							新增
						</el-button>
					</div>
				</div>
			</section>

			<section class="visitor-blacklist__table-panel" v-loading="pageState.loading">
				<el-table :data="tableRows" class="visitor-blacklist__table" row-key="id">
					<el-table-column
						v-for="column in tableColumnConfigs"
						:key="column.key"
						:prop="column.prop"
						:label="column.label"
						:min-width="column.minWidth"
						:width="column.width"
						:fixed="column.fixed"
					>
						<template #default="{ row }">
							<span v-if="column.type === 'index'">{{ row.seq }}</span>
							<el-button v-else-if="column.type === 'operation'" type="primary" link @click="handleRemove(row.id)">移除</el-button>
							<span v-else>{{ row[column.prop] }}</span>
						</template>
					</el-table-column>
				</el-table>

				<div class="visitor-blacklist__pagination">
					<Pagination
						:current="formData.current"
						:size="formData.size"
						:total="pageState.total"
						@sizeChange="handleSizeChange"
						@currentChange="handleCurrentChange"
					/>
				</div>
			</section>
		</div>

		<el-dialog
			v-model="dialogState.visible"
			width="420px"
			destroy-on-close
			class="visitor-blacklist__dialog"
			:close-on-click-modal="false"
			@closed="handleDialogClosed"
		>
			<template #header>
				<div class="visitor-blacklist__dialog-title">{{ dialogTitle }}</div>
			</template>

			<div class="visitor-blacklist__dialog-body">
				<div class="visitor-blacklist__dialog-block">
					<div class="visitor-blacklist__dialog-label">名单类型</div>
					<el-radio-group :model-value="dialogFormData.type" @update:modelValue="handleDialogTypeChange">
						<el-radio v-for="item in blacklistTypeConfigs" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
					</el-radio-group>
				</div>

				<div class="visitor-blacklist__dialog-hint">{{ currentTypeConfig.description }}</div>

				<div class="visitor-blacklist__dialog-fields">
					<div class="visitor-blacklist__dialog-item" v-for="item in visibleDialogFieldConfigs" :key="item.key">
						<div class="visitor-blacklist__dialog-label">
							{{ item.label }}
							<span v-if="item.required" class="visitor-blacklist__required">*</span>
						</div>
						<component
							:is="item.component"
							v-bind="item.props"
							:model-value="dialogFormData[item.field]"
							@update:modelValue="(value: unknown) => handleDialogFieldChange(item.field, value)"
						/>
					</div>
				</div>
			</div>

			<template #footer>
				<div class="visitor-blacklist__dialog-footer">
					<el-button @click="dialogState.visible = false">关闭</el-button>
					<el-button type="primary" :loading="dialogState.submitting" @click="handleSubmitDialog">保存</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="visitorBlacklist">
import { computed, onMounted, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import Pagination from '/@/components/Pagination/index.vue';
import { createVisitorBlacklist, getVisitorBlacklistPage, removeVisitorBlacklist, type VisitorBlacklistItem, type VisitorBlacklistType } from './api';
import {
	blacklistTypeConfigs,
	defaultDialogFormData,
	defaultFormData,
	dialogFieldConfigs,
	dialogTitle,
	queryFieldConfigs,
	tableColumnConfigs,
	type BlacklistDialogField,
	type BlacklistQueryField,
} from './index';
import { buildBlacklistQueryParams, buildBlacklistTableRows, buildCreateBlacklistPayload } from './useBizProcess';

const formData = reactive({
	...defaultFormData,
});

const dialogFormData = reactive({
	...defaultDialogFormData,
});

const pageState = reactive({
	loading: false,
	total: 0,
	records: [] as VisitorBlacklistItem[],
});

const dialogState = reactive({
	visible: false,
	submitting: false,
});

const tableRows = computed(() => buildBlacklistTableRows(pageState.records, formData.current, formData.size));

const currentTypeConfig = computed(() => {
	return blacklistTypeConfigs.find((item) => item.value === dialogFormData.type) || blacklistTypeConfigs[0];
});

const visibleDialogFieldConfigs = computed(() => {
	return dialogFieldConfigs
		.filter((item) => item.field !== 'identityValue' || currentTypeConfig.value.identifierRequired)
		.map((item) => {
			if (item.field === 'name') {
				return {
					...item,
					required: true,
					props: {
						...item.props,
						placeholder: currentTypeConfig.value.namePlaceholder,
					},
				};
			}

			if (item.field === 'identityValue') {
				return {
					...item,
					label: currentTypeConfig.value.identityLabel,
					required: currentTypeConfig.value.identifierRequired,
					props: {
						...item.props,
						placeholder: currentTypeConfig.value.identityPlaceholder,
					},
				};
			}

			return {
				...item,
				required: false,
			};
		});
});

const handleQueryValueChange = (field: BlacklistQueryField, value: unknown) => {
	formData[field] = typeof value === 'string' ? value : '';
};

const handleDialogFieldChange = (field: BlacklistDialogField, value: unknown) => {
	dialogFormData[field] = typeof value === 'string' ? value : '';
};

const handleDialogTypeChange = (value: string | number | boolean) => {
	dialogFormData.type = value as VisitorBlacklistType;
	if (!currentTypeConfig.value.identifierRequired) {
		dialogFormData.identityValue = '';
	}
};

const loadTableData = async () => {
	pageState.loading = true;
	try {
		const res = await getVisitorBlacklistPage(buildBlacklistQueryParams(formData));
		pageState.records = res.data.records;
		pageState.total = res.data.total;
	} finally {
		pageState.loading = false;
	}
};

const handleSearch = () => {
	formData.current = 1;
	loadTableData();
};

const handleReset = () => {
	Object.assign(formData, {
		...defaultFormData,
		size: formData.size,
	});
	loadTableData();
};

const handleSizeChange = (size: number) => {
	formData.size = size;
	formData.current = 1;
	loadTableData();
};

const handleCurrentChange = (current: number) => {
	formData.current = current;
	loadTableData();
};

const resetDialogForm = () => {
	Object.assign(dialogFormData, {
		...defaultDialogFormData,
	});
};

const openCreateDialog = () => {
	resetDialogForm();
	dialogState.visible = true;
};

const validateDialogForm = () => {
	if (!dialogFormData.name.trim()) {
		ElMessage.warning('请输入名单名称');
		return false;
	}

	if (currentTypeConfig.value.identifierRequired && !dialogFormData.identityValue.trim()) {
		ElMessage.warning(`请输入${currentTypeConfig.value.identityLabel}`);
		return false;
	}

	return true;
};

const handleSubmitDialog = async () => {
	if (!validateDialogForm()) return;

	dialogState.submitting = true;
	try {
		await createVisitorBlacklist(buildCreateBlacklistPayload(dialogFormData, currentTypeConfig.value.description));
		ElMessage.success('新增成功');
		dialogState.visible = false;
		handleSearch();
	} finally {
		dialogState.submitting = false;
	}
};

const handleDialogClosed = () => {
	resetDialogForm();
};

const handleRemove = async (id: string) => {
	try {
		await ElMessageBox.confirm('移除后该对象将不再受黑名单限制，是否继续？', '提示', {
			type: 'warning',
			confirmButtonText: '确定',
			cancelButtonText: '取消',
		});
	} catch {
		return;
	}

	await removeVisitorBlacklist(id);
	ElMessage.success('移除成功');

	if (pageState.records.length === 1 && formData.current > 1) {
		formData.current -= 1;
	}

	loadTableData();
};

onMounted(() => {
	loadTableData();
});
</script>

<style scoped lang="scss">
.visitor-blacklist {
	height: auto;

	&__body {
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 16px;
		background: #f8fafc;
		border-radius: 22px;
		border: 1px solid #eef2f7;
		overflow: auto;
	}

	&__search,
	&__table-panel {
		padding: 18px;
		border-radius: 18px;
		background: #fff;
		border: 1px solid rgba(226, 232, 240, 0.9);
		box-shadow: 0 12px 34px rgba(15, 23, 42, 0.04);
	}

	&__search-grid {
		display: grid;
		grid-template-columns: 160px 220px 220px auto auto;
		gap: 12px;
		align-items: end;
	}

	&__field-label,
	&__dialog-label {
		margin-bottom: 8px;
		font-size: 13px;
		font-weight: 500;
		color: #475569;
	}

	&__actions {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	&__create-action {
		display: flex;
		justify-content: flex-end;
	}

	&__table {
		:deep(th.el-table__cell) {
			background: #f8fafc;
			color: #64748b;
			font-weight: 600;
		}
	}

	&__pagination {
		display: flex;
		justify-content: flex-end;
	}

	&__dialog-title {
		font-size: 20px;
		font-weight: 700;
		color: #0f172a;
	}

	&__dialog-body {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	&__dialog-block {
		padding-bottom: 4px;
	}

	&__dialog-hint {
		font-size: 14px;
		line-height: 1.6;
		color: #334155;
	}

	&__dialog-fields {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	&__required {
		color: #ef4444;
	}

	&__dialog-footer {
		display: flex;
		justify-content: flex-end;
		gap: 10px;
	}
}

@media (max-width: 1440px) {
	.visitor-blacklist {
		&__search-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		&__actions,
		&__create-action {
			justify-content: flex-start;
		}
	}
}

@media (max-width: 768px) {
	.visitor-blacklist {
		&__body {
			padding: 16px;
		}

		&__search-grid {
			grid-template-columns: 1fr;
		}

		&__actions {
			flex-wrap: wrap;
		}
	}
}
</style>
