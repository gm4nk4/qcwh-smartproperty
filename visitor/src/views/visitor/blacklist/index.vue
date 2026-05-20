<template>
	<div class="layout-padding visitor-blacklist">
		<div class="layout-padding-auto layout-padding-view">
			<ConfigurableTableWithForm
				ref="tableRef"
				:query-form-config="queryFormConfig"
				:table-config="tableConfig"
				:show-export="false"
				@search="handleSearch"
				@reset="handleReset"
				@operation="handleOperation"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
			>
				<template #tableActions>
					<el-button type="primary" @click="openCreateDialog">
						<el-icon class="mr5">
							<ele-Plus />
						</el-icon>
						新增
					</el-button>
				</template>
			</ConfigurableTableWithForm>
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
import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ConfigurableTableWithForm, type TableConfig } from '@zhqc-smart/table';
import { createVisitorBlacklist, getVisitorBlacklistPage, removeVisitorBlacklist, type VisitorBlacklistItem, type VisitorBlacklistType } from './api';
import {
	blacklistTypeConfigs,
	defaultDialogFormData,
	defaultFormData,
	dialogFieldConfigs,
	dialogTitle,
	queryFormConfig,
	tableColumns,
	type BlacklistDialogField,
	type BlacklistPageFormData,
} from './index';
import { buildBlacklistQueryParams, buildBlacklistTableRows, buildCreateBlacklistPayload } from './useBizProcess';

const tableRef = ref();

const formData = reactive<BlacklistPageFormData>({ ...defaultFormData });

const dialogFormData = reactive({ ...defaultDialogFormData });

const pageState = reactive({
	loading: false,
	total: 0,
	records: [] as VisitorBlacklistItem[],
});

const dialogState = reactive({
	visible: false,
	submitting: false,
});

const tableRows = computed(() => buildBlacklistTableRows(pageState.records));

const tableConfig = computed<TableConfig>(() => ({
	columns: tableColumns,
	data: tableRows.value,
	selectionType: 'none',
	showIndex: true,
	showOperations: true,
	pagination: true,
	pageSize: formData.size,
	currentPage: formData.current,
	total: pageState.total,
	loading: pageState.loading,
}));

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

const handleSearch = (queryData: Record<string, unknown>) => {
	formData.type = (queryData.type ?? '') as BlacklistPageFormData['type'];
	formData.name = String(queryData.name ?? '');
	formData.identityValue = String(queryData.identityValue ?? '');
	formData.current = 1;
	loadTableData();
};

const handleReset = () => {
	Object.assign(formData, { ...defaultFormData, size: formData.size });
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

const handleOperation = ({ action, row }: { action: string; row: VisitorBlacklistItem }) => {
	if (action === 'remove') handleRemove(row.id);
};

const resetDialogForm = () => {
	Object.assign(dialogFormData, { ...defaultDialogFormData });
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
		formData.current = 1;
		loadTableData();
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

	&__dialog-label {
		margin-bottom: 8px;
		font-size: 13px;
		font-weight: 500;
		color: #475569;
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
</style>
