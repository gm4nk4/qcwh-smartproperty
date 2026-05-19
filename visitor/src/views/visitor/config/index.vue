<template>
	<div class="layout-padding visitor-config">
		<div class="layout-padding-auto layout-padding-view visitor-config__body" v-loading="pageState.loading">
			<section class="visitor-config__panel">
				<header class="visitor-config__panel-header">
					<div>
						<div class="visitor-config__panel-title">访客通行权限配置（默认公区权限）</div>
						<div class="visitor-config__panel-subtitle">请添加访客通行门禁设备，访客通行时默认可通行的公区门禁。</div>
					</div>

					<el-button type="primary" @click="openAddDeviceDialog">
						<el-icon class="mr5">
							<ele-Plus />
						</el-icon>
						新增
					</el-button>
				</header>

				<el-table :data="deviceTableRows" class="visitor-config__table" row-key="id">
					<el-table-column
						v-for="column in deviceTableColumnConfigs"
						:key="column.key"
						:prop="column.prop"
						:label="column.label"
						:min-width="column.minWidth"
						:width="column.width"
					>
						<template #default="{ row }">
							<span v-if="column.type === 'index'">{{ row.seq }}</span>
							<span v-else-if="column.type === 'deviceType'">{{ row.deviceTypeLabel }}</span>
							<el-button v-else-if="column.type === 'operation'" type="primary" link @click="handleRemoveDevice(row.id)">移除</el-button>
							<span v-else>{{ row[column.prop] }}</span>
						</template>
					</el-table-column>
				</el-table>

				<div class="visitor-config__panel-note">所有设备均在设备管理子系统中进行管理。</div>
			</section>

			<section class="visitor-config__panel">
				<header class="visitor-config__panel-header visitor-config__panel-header--stack">
					<div>
						<div class="visitor-config__panel-title">访客通行有效期截至日期</div>
					</div>
				</header>

				<el-radio-group
					class="visitor-config__validity-group"
					:model-value="formData.validityType"
					@update:modelValue="(value) => handleConfigFieldChange('validityType', value)"
				>
					<div class="visitor-config__validity-item" v-for="item in validityOptionConfigs" :key="item.value">
						<el-radio :label="item.value">{{ item.label }}</el-radio>
						<div v-if="item.extraFields?.length" class="visitor-config__validity-extras">
							<div class="visitor-config__validity-extra" v-for="field in item.extraFields" :key="field.key">
								<span v-if="field.prefixText" class="visitor-config__validity-text">{{ field.prefixText }}</span>
								<component
									:is="field.component"
									v-bind="{
										...field.props,
										disabled: formData.validityType !== item.value,
									}"
									:model-value="formData[field.field]"
									@update:modelValue="(value: unknown) => handleConfigFieldChange(field.field, value)"
								/>
								<span v-if="field.suffixText" class="visitor-config__validity-text">{{ field.suffixText }}</span>
							</div>
						</div>
					</div>
				</el-radio-group>

				<div class="visitor-config__notice">
					<div class="visitor-config__notice-line" v-for="(line, index) in pageState.noticeLines" :key="`${index}-${line}`">
						{{ line }}
					</div>
				</div>
			</section>

			<section class="visitor-config__panel">
				<header class="visitor-config__panel-header visitor-config__panel-header--stack">
					<div class="visitor-config__panel-title">通行方式配置</div>
				</header>

				<div class="visitor-config__pass-list">
					<label class="visitor-config__pass-item" v-for="item in passMethodConfigs" :key="item.value">
						<el-checkbox
							:model-value="formData.passMethods.includes(item.value)"
							@change="(checked: unknown) => handlePassMethodChange(item.value, Boolean(checked))"
						>
							{{ item.label }}
						</el-checkbox>
						<div class="visitor-config__pass-description">{{ item.description }}</div>
					</label>
				</div>
			</section>

			<div class="visitor-config__footer">
				<el-button type="primary" :loading="pageState.saving" @click="handleSave">保存</el-button>
			</div>
		</div>

		<el-dialog
			v-model="dialogState.visible"
			width="460px"
			destroy-on-close
			:close-on-click-modal="false"
			class="visitor-config__dialog"
			@closed="handleDialogClosed"
		>
			<template #header>
				<div class="visitor-config__dialog-title">添加门禁设备</div>
			</template>

			<div class="visitor-config__dialog-body">
				<div class="visitor-config__dialog-item" v-for="item in deviceDialogFieldConfigs" :key="item.key">
					<div class="visitor-config__dialog-label">{{ item.label }}</div>
					<component
						:is="item.component"
						v-bind="item.props"
						:model-value="dialogFormData[item.field]"
						@update:modelValue="(value: unknown) => handleDeviceDialogFieldChange(item.field, value)"
					>
						<el-option
							v-for="option in deviceDialogOptions"
							:key="option.value"
							:label="option.label"
							:value="option.value"
							:disabled="option.disabled"
						/>
					</component>
				</div>

				<div v-if="selectedDeviceOption" class="visitor-config__dialog-preview">
					<div class="visitor-config__dialog-preview-item">
						<span class="visitor-config__dialog-preview-label">设备类型</span>
						<span>{{ selectedDeviceOption.deviceTypeLabel }}</span>
					</div>
					<div class="visitor-config__dialog-preview-item">
						<span class="visitor-config__dialog-preview-label">设备位置</span>
						<span>{{ selectedDeviceOption.deviceLocation }}</span>
					</div>
				</div>
			</div>

			<template #footer>
				<div class="visitor-config__dialog-footer">
					<el-button @click="dialogState.visible = false">取消</el-button>
					<el-button type="primary" :loading="dialogState.submitting" @click="handleSubmitDeviceDialog">确定</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="visitorConfig">
import { computed, onMounted, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
	addVisitorConfigDevice,
	getVisitorConfigDetail,
	getVisitorConfigDeviceOptions,
	removeVisitorConfigDevice,
	saveVisitorConfig,
	type VisitorConfigDeviceItem,
	type VisitorConfigPassMethod,
	type VisitorConfigValidityType,
} from './api';
import {
	defaultDeviceDialogFormData,
	defaultFormData,
	deviceDialogFieldConfigs,
	deviceTableColumnConfigs,
	passMethodConfigs,
	validityOptionConfigs,
	type DeviceDialogFormData,
	type VisitorConfigEditableField,
} from './index';
import {
	buildAddVisitorConfigDevicePayload,
	buildVisitorConfigDeviceOptions,
	buildVisitorConfigDeviceRows,
	buildVisitorConfigFormData,
	buildVisitorConfigSavePayload,
	getSelectedVisitorConfigDeviceOption,
} from './useBizProcess';

const formData = reactive({
	...defaultFormData,
});

const dialogFormData = reactive({
	...defaultDeviceDialogFormData,
});

const pageState = reactive({
	loading: false,
	saving: false,
	noticeLines: [] as string[],
	deviceRecords: [] as VisitorConfigDeviceItem[],
	deviceOptions: [] as VisitorConfigDeviceItem[],
});

const dialogState = reactive({
	visible: false,
	submitting: false,
});

const deviceTableRows = computed(() => buildVisitorConfigDeviceRows(pageState.deviceRecords));

const deviceDialogOptions = computed(() => buildVisitorConfigDeviceOptions(pageState.deviceOptions, pageState.deviceRecords));

const selectedDeviceOption = computed(() => {
	return getSelectedVisitorConfigDeviceOption(dialogFormData.deviceId, deviceDialogOptions.value);
});

const handleConfigFieldChange = (field: VisitorConfigEditableField, value: unknown) => {
	if (field === 'validityType') {
		formData.validityType = value as VisitorConfigValidityType;
		return;
	}

	if (field === 'fixedHours') {
		formData.fixedHours = Number(value) || 1;
		return;
	}

	formData.untilTime = typeof value === 'string' ? value : '';
};

const handleDeviceDialogFieldChange = (field: keyof DeviceDialogFormData, value: unknown) => {
	dialogFormData[field] = typeof value === 'string' ? value : '';
};

const handlePassMethodChange = (value: VisitorConfigPassMethod, checked: boolean) => {
	const currentValues = new Set(formData.passMethods);
	if (checked) {
		currentValues.add(value);
	} else {
		currentValues.delete(value);
	}
	formData.passMethods = Array.from(currentValues) as VisitorConfigPassMethod[];
};

const loadPageData = async () => {
	pageState.loading = true;
	try {
		const [detailRes, optionRes] = await Promise.all([getVisitorConfigDetail(), getVisitorConfigDeviceOptions()]);
		Object.assign(formData, buildVisitorConfigFormData(detailRes.data));
		pageState.noticeLines = detailRes.data.noticeLines;
		pageState.deviceRecords = detailRes.data.devices;
		pageState.deviceOptions = optionRes.data;
	} finally {
		pageState.loading = false;
	}
};

const openAddDeviceDialog = () => {
	Object.assign(dialogFormData, {
		...defaultDeviceDialogFormData,
	});
	dialogState.visible = true;
};

const handleDialogClosed = () => {
	Object.assign(dialogFormData, {
		...defaultDeviceDialogFormData,
	});
};

const handleSubmitDeviceDialog = async () => {
	if (!dialogFormData.deviceId) {
		ElMessage.warning('请选择设备');
		return;
	}

	dialogState.submitting = true;
	try {
		await addVisitorConfigDevice(buildAddVisitorConfigDevicePayload(dialogFormData));
		ElMessage.success('设备已添加');
		dialogState.visible = false;
		await loadPageData();
	} finally {
		dialogState.submitting = false;
	}
};

const handleRemoveDevice = async (id: string) => {
	try {
		await ElMessageBox.confirm('移除后访客将不再默认拥有该设备通行权限，是否继续？', '提示', {
			type: 'warning',
			confirmButtonText: '确定',
			cancelButtonText: '取消',
		});
	} catch {
		return;
	}

	await removeVisitorConfigDevice(id);
	ElMessage.success('设备已移除');
	loadPageData();
};

const validateConfigForm = () => {
	if (formData.validityType === 'fixed_hours' && formData.fixedHours <= 0) {
		ElMessage.warning('固定间隔小时需大于 0');
		return false;
	}

	if (formData.validityType === 'same_day_until' && !formData.untilTime) {
		ElMessage.warning('请选择截止时间');
		return false;
	}

	if (!formData.passMethods.length) {
		ElMessage.warning('请至少选择一种通行方式');
		return false;
	}

	return true;
};

const handleSave = async () => {
	if (!validateConfigForm()) return;

	pageState.saving = true;
	try {
		await saveVisitorConfig(buildVisitorConfigSavePayload(formData));
		ElMessage.success('保存成功');
		await loadPageData();
	} finally {
		pageState.saving = false;
	}
};

onMounted(() => {
	loadPageData();
});
</script>

<style scoped lang="scss">
.visitor-config {
	height: auto;

	&__body {
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 20px;
		background: #f8fafc;
		border-radius: 22px;
		border: 1px solid #eef2f7;
		overflow: auto;
	}

	&__panel {
		padding: 18px;
		border-radius: 20px;
		background: #fff;
		border: 1px solid rgba(226, 232, 240, 0.9);
		box-shadow: 0 12px 34px rgba(15, 23, 42, 0.04);
	}

	&__panel-header {
		margin-bottom: 16px;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 16px;
	}

	&__panel-header--stack {
		margin-bottom: 20px;
	}

	&__panel-title {
		font-size: 16px;
		font-weight: 700;
		color: #0f172a;
	}

	&__panel-subtitle,
	&__panel-note {
		font-size: 13px;
		line-height: 1.6;
		color: #94a3b8;
	}

	&__panel-note {
		margin-top: 10px;
	}

	&__table {
		:deep(th.el-table__cell) {
			background: #f8fafc;
			color: #64748b;
			font-weight: 600;
		}
	}

	&__validity-group {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 18px 26px;
	}

	&__validity-item {
		display: inline-flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 10px;
	}

	&__validity-extras,
	&__validity-extra {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}

	&__validity-text {
		font-size: 14px;
		color: #475569;
	}

	&__notice {
		margin-top: 18px;
		padding: 14px 16px;
		border-radius: 14px;
		background: #fffbeb;
		border: 1px solid #fde68a;
	}

	&__notice-line {
		font-size: 13px;
		line-height: 1.8;
		color: #92400e;
	}

	&__pass-list {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	&__pass-item {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	&__pass-description {
		padding-left: 24px;
		font-size: 13px;
		line-height: 1.6;
		color: #64748b;
	}

	&__footer {
		display: flex;
		justify-content: flex-start;
	}

	&__dialog-title {
		font-size: 20px;
		font-weight: 700;
		color: #0f172a;
	}

	&__dialog-body {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	&__dialog-item {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	&__dialog-label {
		font-size: 13px;
		font-weight: 500;
		color: #475569;
	}

	&__dialog-preview {
		padding: 14px 16px;
		border-radius: 14px;
		background: #f8fafc;
		border: 1px solid #e2e8f0;
	}

	&__dialog-preview-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		font-size: 14px;
		line-height: 1.8;
		color: #334155;
	}

	&__dialog-preview-label {
		color: #64748b;
	}

	&__dialog-footer {
		display: flex;
		justify-content: flex-end;
		gap: 10px;
	}
}

@media (max-width: 992px) {
	.visitor-config {
		&__body {
			padding: 16px;
		}

		&__panel-header {
			flex-direction: column;
		}
	}
}

@media (max-width: 640px) {
	.visitor-config {
		&__validity-group {
			flex-direction: column;
			align-items: flex-start;
		}

		&__dialog-preview-item {
			flex-direction: column;
			align-items: flex-start;
		}
	}
}
</style>
