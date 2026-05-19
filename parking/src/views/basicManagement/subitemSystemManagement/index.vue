<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-scrollbar class="subitem-system-scrollbar">
				<div class="subitem-system-page">
					<section class="management-card">
						<header class="management-card__header">
							<div class="management-card__title">
								<span class="management-card__title-bar"></span>
								<span>分项系统管理</span>
							</div>
							<el-button type="primary" class="add-button" @click="handleAdd">
								<el-icon><Plus /></el-icon>
								<span>新增分项</span>
							</el-button>
						</header>

						<section class="management-card__content">
							<ConfigurableTableWithForm
								ref="tableRef"
								:query-form-config="queryFormConfig"
								:table-config="tableConfig"
								@search="handleSearch"
								@reset="handleReset"
							>
								<template #loadRate="{ row }">
									<span class="rate-tag" :class="getLoadRateClass(row.loadRate)">{{ formatRate(row.loadRate) }}</span>
								</template>

								<template #runStatus="{ row }">
									<span class="status-tag" :class="getRunStatusClass(row.runStatus)">{{ row.runStatusName || '--' }}</span>
								</template>

								<template #updateTime="{ row }">
									<div class="time-cell">
										<span>{{ getDatePart(row.updateTime) }}</span>
										<span>{{ getTimePart(row.updateTime) }}</span>
									</div>
								</template>

								<template #actions="{ row }">
									<div class="action-group">
										<el-button link class="action-link action-link--bind" @click="handleAction('bind', row)">设备绑定</el-button>
										<el-button link class="action-link action-link--view" @click="handleAction('view', row)">查看</el-button>
										<el-button link class="action-link action-link--edit" @click="handleAction('edit', row)">编辑</el-button>
										<el-button link class="action-link action-link--delete" @click="handleAction('delete', row)">删除</el-button>
									</div>
								</template>
							</ConfigurableTableWithForm>
						</section>
					</section>
				</div>
			</el-scrollbar>
		</div>

		<el-dialog
			v-model="dialogVisible"
			:title="dialogTitle"
			width="1200px"
			append-to-body
			destroy-on-close
			:close-on-click-modal="false"
			class="subitem-system-dialog"
			:before-close="handleDialogBeforeClose"
			@closed="handleDialogClosed"
		>
			<el-form
				ref="dialogFormRef"
				:model="dialogForm"
				:rules="dialogFormRules"
				:disabled="dialogReadonly"
				label-width="110px"
				class="subitem-dialog-form"
			>
				<div class="subitem-dialog-form__grid">
					<el-form-item label="系统名称" prop="systemName">
						<el-input v-model="dialogForm.systemName" maxlength="50" placeholder="请输入系统名称" clearable />
					</el-form-item>

					<el-form-item label="系统编码" prop="systemCode">
						<el-input v-model="dialogForm.systemCode" maxlength="50" placeholder="请输入系统编码" clearable />
					</el-form-item>

					<el-form-item label="系统类型" prop="systemType">
						<el-select v-model="dialogForm.systemType" placeholder="请选择系统类型" clearable class="dialog-field">
							<el-option v-for="item in systemTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</el-form-item>

					<el-form-item label="运行状态" prop="runningStatus">
						<el-select v-model="dialogForm.runningStatus" placeholder="请选择运行状态" class="dialog-field">
							<el-option v-for="item in runningStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</el-form-item>

					<el-form-item label="所属空间" prop="spaceId">
						<el-tree-select
							v-model="dialogForm.spaceId"
							:data="spaceOptions"
							:props="spaceTreeProps"
							node-key="value"
							check-strictly
							filterable
							clearable
							default-expand-all
							placeholder="请选择所属空间"
							class="dialog-field"
						/>
					</el-form-item>

					<el-form-item label="负责人" prop="responsiblePerson">
						<el-input v-model="dialogForm.responsiblePerson" maxlength="20" placeholder="请输入负责人" clearable />
					</el-form-item>

					<el-form-item label="联系电话" prop="phone">
						<el-input v-model="dialogForm.phone" maxlength="20" placeholder="请输入联系电话" clearable />
					</el-form-item>

					<el-form-item label="装机容量" prop="installedCapacity">
						<el-input v-model="dialogForm.installedCapacity" type="number" placeholder="0" class="dialog-field">
							<template #suffix>
								<span class="subitem-dialog-form__unit">kW</span>
							</template>
						</el-input>
					</el-form-item>

					<el-form-item label="能耗配额" prop="energyQuota">
						<el-input v-model="dialogForm.energyQuota" type="number" placeholder="0" class="dialog-field">
							<template #suffix>
								<span class="subitem-dialog-form__unit">kWh/月</span>
							</template>
						</el-input>
					</el-form-item>

					<el-form-item label="系统描述" prop="remark" class="subitem-dialog-form__item--full">
						<el-input
							v-model="dialogForm.remark"
							type="textarea"
							maxlength="200"
							show-word-limit
							:rows="4"
							resize="none"
							placeholder="请输入系统描述"
						/>
					</el-form-item>
				</div>
			</el-form>

			<template #footer>
				<div class="subitem-dialog__footer">
					<el-button class="subitem-dialog__cancel" :disabled="submitLoading" @click="handleDialogCancel">
						{{ dialogReadonly ? '关闭' : '取消' }}
					</el-button>
					<el-button v-if="!dialogReadonly" type="primary" class="subitem-dialog__confirm" :loading="submitLoading" @click="handleDialogSubmit">
						确定
					</el-button>
				</div>
			</template>
		</el-dialog>

		<el-dialog
			v-model="bindDialogVisible"
			title="设备绑定"
			width="min(1680px, calc(100vw - 32px))"
			append-to-body
			destroy-on-close
			:close-on-click-modal="false"
			class="device-bind-dialog"
			:before-close="handleBindDialogBeforeClose"
			@closed="handleBindDialogClosed"
		>
			<div class="device-bind-dialog__summary">
				<div class="device-bind-dialog__summary-item">
					<span class="device-bind-dialog__summary-label">分项系统：</span>
					<span class="device-bind-dialog__summary-value">{{ bindDialogSystem?.systemName || '--' }}</span>
				</div>
				<div class="device-bind-dialog__summary-item">
					<span class="device-bind-dialog__summary-label">已绑定设备：</span>
					<span class="device-bind-dialog__summary-value">{{ bindSelectedDeviceCount }} 台</span>
				</div>
			</div>

			<div class="device-bind-dialog__content" v-loading="bindDialogLoading">
				<ConfigurableTableWithForm
					ref="bindTableRef"
					:query-form-config="bindQueryFormConfig"
					:table-config="bindTableConfig"
					@search="handleBindSearch"
					@reset="handleBindReset"
					@select="handleBindSelect"
				>
					<template #bindRunStatus="{ row }">
						<span class="status-tag" :class="getDeviceRunStatusClass(row.runStatus)">{{ row.runStatusName || '--' }}</span>
					</template>

					<template #bindSubSystemName="{ row }">
						<span class="bind-subsystem-text" :class="{ 'bind-subsystem-text--empty': getBindSubSystemText(row) === '未绑定' }">
							{{ getBindSubSystemText(row) }}
						</span>
					</template>
				</ConfigurableTableWithForm>
			</div>

			<template #footer>
				<div class="device-bind-dialog__footer">
					<el-button class="device-bind-dialog__cancel" :disabled="bindSubmitLoading" @click="handleBindDialogCancel">取消</el-button>
					<el-button type="primary" class="device-bind-dialog__confirm" :loading="bindSubmitLoading" @click="handleBindDialogSubmit">
						确定绑定
					</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="subitemSystemManagement">
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ConfigurableTableWithForm, type TableConfig } from '/@/components/ConfigurableComponents';
import { useDict } from '/@/hooks/dict';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { TABLE_COLUMNS, createInitialFilterForm, createQueryFormConfig } from './config';
import {
	bindSubitemSystemDevices,
	deleteSubitemSystem,
	getDeviceBindList,
	getBaseSpaceTree,
	getSubitemSystemPage,
	saveSubitemSystem,
	type BaseSpaceTreeNode,
	type DeviceBindListData,
	type DeviceBindRecord,
	type SubitemSystemRecord,
} from '/@/api/basicManagement/subitemSystemManagement';

interface SubitemSystemItem {
	id: number | string;
	systemName: string;
	systemCode: string;
	systemType: string;
	systemTypeName: string;
	spaceId: number | string | undefined;
	spaceName: string;
	deviceCount: number | null;
	todayEnergy: number | null;
	loadRate: number | null;
	runStatus: string;
	runStatusName: string;
	principal: string;
	responsiblePerson: string;
	phone: string;
	installedCapacity: number | null;
	energyQuota: number | null;
	remark: string;
	updateTime: string;
}

interface PageQueryParams {
	systemName?: string;
	systemType?: string;
	runStatus?: string;
	current?: number;
	size?: number;
}

interface SubitemSystemFormState {
	id: number | string | undefined;
	systemName: string;
	systemCode: string;
	systemType: string;
	runningStatus: string;
	spaceId: number | string | undefined;
	responsiblePerson: string;
	phone: string;
	installedCapacity: string;
	energyQuota: string;
	remark: string;
}

interface SpaceOptionItem {
	value: number | string;
	label: string;
	children?: SpaceOptionItem[];
}

interface DeviceBindItem {
	id: number | string;
	deviceId: number | string;
	deviceName: string;
	deviceCode: string;
	deviceType: string;
	deviceTypeName: string;
	installLocation: string;
	ratedPower: number | null;
	runStatus: string;
	runStatusName: string;
	subSystemId: number | string | undefined;
	subSystemName: string;
	isChoose: boolean;
	disabled: boolean;
}

type FormValidateCallback = (error?: Error) => void;

const DEVICE_TYPE_LABEL_MAP: Record<string, string> = {
	ac: '空调',
	light: '照明',
	Light: '照明',
	power: '动力',
	elevator: '电梯',
	water: '水表',
	elec: '电表',
	gas: '气表',
	other: '其它',
};

const BIND_DEVICE_QUERY_FIELDS = [
	{ label: '设备名称', value: 'deviceName', type: 'text', selected: true },
	{ label: '设备类型', value: 'deviceType', type: 'select', selected: true },
];

const BIND_DEVICE_TABLE_COLUMNS = [
	{ prop: 'deviceName', label: '设备名称', minWidth: 220, align: 'left' },
	{ prop: 'deviceCode', label: '设备编码', minWidth: 150, align: 'center' },
	{ prop: 'deviceTypeName', label: '设备类型', minWidth: 140, align: 'center' },
	{ prop: 'installLocation', label: '安装位置', minWidth: 180, align: 'left' },
	{
		prop: 'ratedPower',
		label: '额定功率(kW)',
		minWidth: 150,
		align: 'right',
		formatter: (row: DeviceBindItem) => formatDevicePower(row.ratedPower),
	},
	{ prop: 'runStatus', label: '状态', width: 120, align: 'center', slot: 'bindRunStatus' },
	{ prop: 'subSystemName', label: '归属分项', minWidth: 160, align: 'center', slot: 'bindSubSystemName' },
];

const message = useMessage();
const messageBox = useMessageBox();
const { system_type: systemType, running_status: runningStatus } = useDict('system_type', 'running_status');
const tableRef = ref();
const bindTableRef = ref();
const dialogVisible = ref(false);
const submitLoading = ref(false);
const spaceLoading = ref(false);
const bindDialogVisible = ref(false);
const bindDialogLoading = ref(false);
const bindSubmitLoading = ref(false);
const bindSelectionSyncing = ref(false);
const bindSelectionInitialized = ref(false);
let bindSelectionRetryTimer: ReturnType<typeof setTimeout> | null = null;
const spaceOptions = ref<SpaceOptionItem[]>([]);
const bindSourceList = ref<DeviceBindItem[]>([]);
const bindCurrentPageRows = ref<DeviceBindItem[]>([]);
const bindSelectedDeviceIds = ref<Array<number | string>>([]);
const bindDialogSystem = ref<SubitemSystemItem | null>(null);
const dialogFormRef = ref<FormInstance>();
const dialogMode = ref<'add' | 'edit' | 'view'>('add');

const queryForm = reactive<Record<string, string>>(createInitialFilterForm());
const bindQueryForm = reactive<Record<string, string>>({
	deviceName: '',
	deviceType: '',
});
const systemTypeOptions = computed<Array<{ label: string; value: string }>>(() => {
	return Array.isArray(systemType.value) ? systemType.value : [];
});
const runningStatusOptions = computed<Array<{ label: string; value: string }>>(() => {
	return Array.isArray(runningStatus.value) ? runningStatus.value : [];
});
const queryFormConfig = computed(() => createQueryFormConfig(systemTypeOptions.value, runningStatusOptions.value));
const bindQueryFormConfig = computed(() => ({
	fields: BIND_DEVICE_QUERY_FIELDS,
	fieldOptions: {
		deviceType: bindDeviceTypeOptions.value,
	},
}));
const spaceTreeProps = {
	value: 'value',
	label: 'label',
	children: 'children',
};

function getDefaultRunningStatus() {
	return String(runningStatusOptions.value[0]?.value ?? '');
}

const createInitialDialogForm = (): SubitemSystemFormState => ({
	id: undefined,
	systemName: '',
	systemCode: '',
	systemType: '',
	runningStatus: getDefaultRunningStatus(),
	spaceId: undefined,
	responsiblePerson: '',
	phone: '',
	installedCapacity: '',
	energyQuota: '',
	remark: '',
});

const dialogForm = reactive<SubitemSystemFormState>(createInitialDialogForm());
const dialogReadonly = computed(() => dialogMode.value === 'view');
const dialogTitle = computed(() => {
	if (dialogMode.value === 'view') return '查看分项系统';
	if (dialogMode.value === 'edit') return '编辑分项系统';
	return '新增分项系统';
});
const bindSelectedDeviceCount = computed(() => bindSelectedDeviceIds.value.length);
const bindDeviceTypeOptions = computed(() => {
	const optionMap = new Map<string, { label: string; value: string }>();
	bindSourceList.value.forEach((item) => {
		if (!item.deviceType) return;
		optionMap.set(item.deviceType, {
			label: item.deviceTypeName || getDeviceTypeLabel(item.deviceType),
			value: item.deviceType,
		});
	});
	return Array.from(optionMap.values()).sort((prev, next) => prev.label.localeCompare(next.label, 'zh-CN'));
});

watch(
	runningStatusOptions,
	(options) => {
		if (dialogMode.value !== 'add' || !dialogVisible.value || dialogForm.runningStatus || !options.length) return;
		dialogForm.runningStatus = String(options[0].value ?? '');
	},
	{ immediate: true }
);

const tableConfig = reactive<TableConfig>({
	columns: TABLE_COLUMNS,
	queryForm,
	pageList: fetchSubitemSystemPage,
	showIndex: true,
	pagination: true,
	pageSize: 10,
	pageSizes: [10, 20, 50],
	autoLoad: true,
});
const bindTableConfig = reactive<TableConfig>({
	columns: BIND_DEVICE_TABLE_COLUMNS,
	queryForm: bindQueryForm,
	pageList: fetchBindDevicePage,
	selectionType: 'checkbox',
	selectionSelectable: (row: DeviceBindItem) => isBindDeviceSelectable(row),
	showIndex: true,
	pagination: true,
	pageSize: 10,
	pageSizes: [10, 20, 50],
	autoLoad: false,
});

watch(
	() => bindTableConfig.queryForm,
	() => {
		if (!bindDialogVisible.value) return;
		nextTick(() => syncBindTableSelection());
	},
	{ deep: true }
);

watch(
	() => bindCurrentPageRows.value,
	() => {
		if (!bindDialogVisible.value) return;
		nextTick(() => syncBindTableSelection());
	},
	{ deep: true }
);

const validatePhone = (_rule: unknown, value: string, callback: FormValidateCallback) => {
	const phoneValue = `${value || ''}`.trim();
	if (!phoneValue) {
		callback(new Error('请输入联系电话'));
		return;
	}

	if (!/^(1\d{10}|0\d{2,3}-?\d{7,8})$/.test(phoneValue)) {
		callback(new Error('请输入正确的联系电话'));
		return;
	}

	callback();
};

const validateOptionalNumber = (_rule: unknown, value: string, callback: FormValidateCallback) => {
	if (value === '' || value === null || value === undefined) {
		callback();
		return;
	}

	const numericValue = Number(value);
	if (Number.isNaN(numericValue)) {
		callback(new Error('请输入数字'));
		return;
	}

	if (numericValue < 0) {
		callback(new Error('请输入大于等于0的数值'));
		return;
	}

	callback();
};

const dialogFormRules: FormRules<SubitemSystemFormState> = {
	systemName: [
		{ required: true, message: '请输入系统名称', trigger: 'blur' },
		{ min: 1, max: 50, message: '系统名称长度在 1 到 50 个字符内', trigger: 'blur' },
	],
	systemCode: [
		{ required: true, message: '请输入系统编码', trigger: 'blur' },
		{ min: 1, max: 50, message: '系统编码长度在 1 到 50 个字符内', trigger: 'blur' },
	],
	systemType: [{ required: true, message: '请选择系统类型', trigger: 'change' }],
	responsiblePerson: [
		{ required: true, message: '请输入负责人', trigger: 'blur' },
		{ min: 1, max: 20, message: '负责人长度在 1 到 20 个字符内', trigger: 'blur' },
	],
	phone: [{ validator: validatePhone, trigger: ['blur', 'change'] }],
	installedCapacity: [{ validator: validateOptionalNumber, trigger: ['blur', 'change'] }],
	energyQuota: [{ validator: validateOptionalNumber, trigger: ['blur', 'change'] }],
	remark: [{ max: 200, message: '系统描述不能超过 200 个字符', trigger: 'blur' }],
};

async function fetchSubitemSystemPage(params: PageQueryParams) {
	const current = Number(params.current || 1);
	const size = Number(params.size || tableConfig.pageSize || 10);
	const response = await getSubitemSystemPage({
		systemName: (params.systemName || '').trim() || undefined,
		systemType: params.systemType || undefined,
		runningStatus: params.runStatus || undefined,
		current,
		size,
	});

	return {
		...response,
		data: {
			...response.data,
			records: (response.data?.records || []).map(normalizeSubitemSystemRecord),
			total: response.data?.total || 0,
		},
	};
}

function handleSearch(formData: Record<string, string>) {
	Object.assign(queryForm, createInitialFilterForm(), formData);
}

function handleReset() {
	Object.assign(queryForm, createInitialFilterForm());
}

function handleAdd() {
	openDialog('add');
}

function createInitialBindFilterForm() {
	return {
		deviceName: '',
		deviceType: '',
	};
}

async function fetchBindDevicePage(params: Record<string, string | number>) {
	const current = Number(params.current || 1);
	const size = Number(params.size || bindTableConfig.pageSize || 10);
	const keyword = `${params.deviceName || ''}`.trim().toLowerCase();
	const deviceType = `${params.deviceType || ''}`.trim();

	const filteredList = bindSourceList.value.filter((item) => {
		const matchName = !keyword || item.deviceName.toLowerCase().includes(keyword) || item.deviceCode.toLowerCase().includes(keyword);
		const matchType = !deviceType || item.deviceType === deviceType;
		return matchName && matchType;
	});

	const startIndex = (current - 1) * size;
	const records = filteredList.slice(startIndex, startIndex + size);
	bindCurrentPageRows.value = records;
	nextTick(() => syncBindTableSelection());

	return Promise.resolve({
		code: 0,
		data: {
			records,
			total: filteredList.length,
		},
	});
}

function handleBindSearch(formData: Record<string, string>) {
	Object.assign(bindQueryForm, createInitialBindFilterForm(), formData);
}

function handleBindReset() {
	Object.assign(bindQueryForm, createInitialBindFilterForm());
}

async function handleAction(action: 'bind' | 'view' | 'edit' | 'delete', row: SubitemSystemItem) {
	if (action === 'delete') {
		try {
			await messageBox.confirm(`确认删除“${row.systemName}”吗？`);
		} catch {
			return;
		}

		try {
			await deleteSubitemSystem([row.id]);
			tableRef.value?.getDataList(false);
			message.success('删除成功');
		} catch (error) {
			message.error(getErrorMessage(error, '删除失败'));
		}
		return;
	}

	if (action === 'view' || action === 'edit') {
		openDialog(action, row);
		return;
	}

	if (action === 'bind') {
		await openBindDialog(row);
	}
}

async function openBindDialog(row: SubitemSystemItem) {
	bindDialogSystem.value = row;
	bindDialogVisible.value = true;
	bindDialogLoading.value = true;
	bindSubmitLoading.value = false;
	bindSelectionSyncing.value = true;
	bindSelectionInitialized.value = false;
	bindSourceList.value = [];
	bindCurrentPageRows.value = [];
	bindSelectedDeviceIds.value = [];
	Object.assign(bindQueryForm, createInitialBindFilterForm());

	try {
		const response = await getDeviceBindList(row.id, createInitialBindFilterForm());
		const records = extractDeviceBindRecords(response.data);
		bindSourceList.value = records.map((item) => normalizeDeviceBindRecord(item));
		bindSelectedDeviceIds.value = uniqueIdList(bindSourceList.value.filter((item) => isDeviceBoundToCurrentSystem(item)).map((item) => item.deviceId));
		nextTick(() => bindTableRef.value?.getDataList?.());
	} catch (error) {
		bindSourceList.value = [];
		bindSelectedDeviceIds.value = [];
		bindSelectionSyncing.value = false;
		message.error(getErrorMessage(error, '设备列表加载失败'));
	} finally {
		bindDialogLoading.value = false;
	}
}

function handleBindDialogBeforeClose(done: () => void) {
	if (bindSubmitLoading.value) return;
	done();
}

function handleBindDialogClosed() {
	resetBindDialogState();
}

function handleBindDialogCancel() {
	if (bindSubmitLoading.value) return;
	bindDialogVisible.value = false;
}

async function handleBindDialogSubmit() {
	if (bindSubmitLoading.value || !bindDialogSystem.value?.id) return;

	bindSubmitLoading.value = true;
	try {
		await bindSubitemSystemDevices(bindDialogSystem.value.id, bindSelectedDeviceIds.value);
		message.success('设备绑定成功');
		bindDialogVisible.value = false;
		tableRef.value?.getDataList(false);
	} catch (error) {
		message.error(getErrorMessage(error, '设备绑定失败'));
	} finally {
		bindSubmitLoading.value = false;
	}
}

function resetBindDialogState() {
	clearBindSelectionRetryTimer();
	bindDialogSystem.value = null;
	bindDialogLoading.value = false;
	bindSubmitLoading.value = false;
	bindSelectionSyncing.value = false;
	bindSelectionInitialized.value = false;
	bindSourceList.value = [];
	bindCurrentPageRows.value = [];
	bindSelectedDeviceIds.value = [];
	Object.assign(bindQueryForm, createInitialBindFilterForm());
}

function handleBindSelect(selection: DeviceBindItem[]) {
	if (bindSelectionSyncing.value || !bindSelectionInitialized.value) return;

	const currentPageIdSet = new Set(bindCurrentPageRows.value.map((item) => String(item.deviceId)));
	const preservedIds = bindSelectedDeviceIds.value.filter((id) => !currentPageIdSet.has(String(id)));
	const currentSelectedIds = selection.map((item) => item.deviceId);
	bindSelectedDeviceIds.value = uniqueIdList([...preservedIds, ...currentSelectedIds]);
}

function clearBindSelectionRetryTimer() {
	if (!bindSelectionRetryTimer) return;
	clearTimeout(bindSelectionRetryTimer);
	bindSelectionRetryTimer = null;
}

function scheduleBindTableSelectionSync(retryCount = 0) {
	clearBindSelectionRetryTimer();
	bindSelectionRetryTimer = setTimeout(() => {
		syncBindTableSelection(retryCount);
	}, 16);
}

function syncBindTableSelection(retryCount = 0) {
	if (!bindDialogVisible.value) {
		bindSelectionSyncing.value = false;
		bindSelectionInitialized.value = false;
		clearBindSelectionRetryTimer();
		return;
	}
	if (!bindTableRef.value || !bindCurrentPageRows.value.length) {
		if (retryCount < 12) {
			scheduleBindTableSelectionSync(retryCount + 1);
			return;
		}
		bindSelectionSyncing.value = false;
		return;
	}

	const selectedIdSet = new Set(bindSelectedDeviceIds.value.map((id) => String(id)));
	const expectedSelectedRowIdSet = new Set(
		bindCurrentPageRows.value
			.filter((row) => selectedIdSet.has(String(row.deviceId)) && isBindDeviceSelectable(row))
			.map((row) => String(row.deviceId))
	);
	bindSelectionSyncing.value = true;
	bindTableRef.value.clearSelection?.();
	bindCurrentPageRows.value.forEach((row) => {
		if (expectedSelectedRowIdSet.has(String(row.deviceId))) {
			bindTableRef.value.toggleRowSelection?.(row, true);
		}
	});
	nextTick(() => {
		nextTick(() => {
			const currentSelectedRows = (bindTableRef.value?.getSelectedRows?.() || []) as DeviceBindItem[];
			const actualSelectedCount = currentSelectedRows.filter((row) => expectedSelectedRowIdSet.has(String(row.deviceId))).length;
			const expectedSelectedCount = expectedSelectedRowIdSet.size;
			const selectionApplied = actualSelectedCount >= expectedSelectedCount;

			if (!selectionApplied && retryCount < 12) {
				scheduleBindTableSelectionSync(retryCount + 1);
				return;
			}

			bindSelectionSyncing.value = false;
			bindSelectionInitialized.value = true;
			clearBindSelectionRetryTimer();
		});
	});
}

async function loadSpaceOptions() {
	if (spaceLoading.value || spaceOptions.value.length) return;

	spaceLoading.value = true;
	try {
		const response = await getBaseSpaceTree();
		spaceOptions.value = buildSpaceOptions(response.data || []);
	} catch (error) {
		spaceOptions.value = [];
		message.error(getErrorMessage(error, '所属空间加载失败'));
	} finally {
		spaceLoading.value = false;
	}
}

function buildSpaceOptions(nodes: BaseSpaceTreeNode[]): SpaceOptionItem[] {
	return nodes.map((node) => ({
		value: node.id,
		label: node.spaceName,
		children: buildSpaceOptions(node.child || []),
	}));
}

function extractDeviceBindRecords(data: DeviceBindListData | null | undefined) {
	if (Array.isArray(data)) return data;
	if (!data || typeof data !== 'object') return [];

	const records = data.records || data.list || data.rows || [];
	return Array.isArray(records) ? records : [];
}

function handleDialogBeforeClose(done: () => void) {
	if (submitLoading.value) return;
	done();
}

function handleDialogClosed() {
	resetDialogForm();
}

function handleDialogCancel() {
	if (submitLoading.value) return;
	dialogVisible.value = false;
}

async function handleDialogSubmit() {
	if (submitLoading.value) return;

	const isValid = await dialogFormRef.value?.validate().catch(() => false);
	if (!isValid) return;

	submitLoading.value = true;
	try {
		await saveSubitemSystem({
			id: dialogMode.value === 'edit' ? dialogForm.id : undefined,
			systemName: dialogForm.systemName.trim(),
			systemCode: dialogForm.systemCode.trim(),
			systemType: dialogForm.systemType,
			spaceId: dialogForm.spaceId || undefined,
			responsiblePerson: dialogForm.responsiblePerson.trim(),
			phone: dialogForm.phone.trim(),
			installedCapacity: parseOptionalNumber(dialogForm.installedCapacity),
			energyQuota: parseOptionalNumber(dialogForm.energyQuota),
			remark: dialogForm.remark.trim() || undefined,
			runningStatus: dialogForm.runningStatus,
		});
		message.success(dialogMode.value === 'edit' ? '编辑成功' : '新增成功');
		dialogVisible.value = false;
		tableRef.value?.getDataList(false);
	} catch (error) {
		message.error(getErrorMessage(error, dialogMode.value === 'edit' ? '编辑失败' : '新增失败'));
	} finally {
		submitLoading.value = false;
	}
}

function openDialog(mode: 'add' | 'view' | 'edit', row?: SubitemSystemItem) {
	dialogMode.value = mode;
	resetDialogForm();
	if (row) {
		fillDialogForm(row);
	}
	dialogVisible.value = true;
	void loadSpaceOptions();
}

function fillDialogForm(row: SubitemSystemItem) {
	Object.assign(dialogForm, {
		id: row.id,
		systemName: normalizeEmptyValue(row.systemName),
		systemCode: normalizeEmptyValue(row.systemCode),
		systemType: row.systemType || '',
		runningStatus: row.runStatus || getDefaultRunningStatus(),
		spaceId: row.spaceId || undefined,
		responsiblePerson: normalizeEmptyValue(row.responsiblePerson || row.principal),
		phone: row.phone || '',
		installedCapacity: formatOptionalFormNumber(row.installedCapacity),
		energyQuota: formatOptionalFormNumber(row.energyQuota),
		remark: row.remark || '',
	});
	nextTick(() => dialogFormRef.value?.clearValidate());
}

function resetDialogForm() {
	Object.assign(dialogForm, createInitialDialogForm());
	dialogFormRef.value?.clearValidate();
}

function normalizeSubitemSystemRecord(item: SubitemSystemRecord): SubitemSystemItem {
	const systemType = item.systemType || '';
	const runStatus = item.runStatus || item.runningStatus || '';

	return {
		id: item.id,
		systemName: item.systemName || '--',
		systemCode: item.systemCode || '--',
		systemType,
		systemTypeName: item.systemTypeName || getOptionLabel(systemTypeOptions.value, systemType),
		spaceId: item.spaceId ?? undefined,
		spaceName: item.spaceName || '--',
		deviceCount: item.deviceCount ?? null,
		todayEnergy: item.todayEnergy ?? null,
		loadRate: normalizeLoadRate(item.loadRate),
		runStatus,
		runStatusName: item.runStatusName || getRunningStatusLabel(runStatus),
		principal: item.principal || item.responsiblePerson || '--',
		responsiblePerson: item.responsiblePerson || item.principal || '',
		phone: item.phone || '',
		installedCapacity: item.installedCapacity ?? null,
		energyQuota: item.energyQuota ?? null,
		remark: item.remark || '',
		updateTime: item.updatedTime || item.updateTime || item.createTime || '',
	};
}

function normalizeDeviceBindRecord(item: DeviceBindRecord): DeviceBindItem {
	const raw = item as Record<string, unknown>;
	const deviceId = item.deviceId ?? item.id ?? (raw.device_id as number | string | null | undefined);
	const deviceType = item.deviceType || (raw.device_type as string) || '';
	const currentSystemId = item.systemId ?? (raw.systemId as number | string | null | undefined) ?? (raw.system_id as number | string | null | undefined);
	const subSystemId =
		currentSystemId ??
		item.subSystemId ??
		item.belongSubsystemId ??
		(raw.belongSubsystemId as number | string | null | undefined) ??
		(raw.belong_subsystem_id as number | string | null | undefined) ??
		(raw.subsystemId as number | string | null | undefined) ??
		(raw.subsystem_id as number | string | null | undefined) ??
		undefined;
	const subSystemName = normalizeDeviceSubSystemName(
		{
			...item,
			subSystemName:
				item.subSystemName ||
				item.belongSubsystemName ||
				(raw.subsystemName as string) ||
				(raw.sub_system_name as string) ||
				(raw.belongSubsystemName as string) ||
				(raw.belong_subsystem_name as string) ||
				(raw.belongSystemName as string) ||
				(raw.belong_system_name as string) ||
				null,
			systemName: item.systemName || (raw.system_name as string) || null,
		},
		subSystemId
	);
	const isCurrentSystemDevice =
		currentSystemId !== undefined && currentSystemId !== null && bindDialogSystem.value
			? String(currentSystemId) === String(bindDialogSystem.value.id)
			: false;
	const runStatus = normalizeDeviceRunStatusValue(
		item.runStatus || item.runningStatus || item.deviceStatus || (raw.status as string) || (raw.deviceStatus as string) || ''
	);

	return {
		id: item.id ?? (raw.deviceId as number | string | null | undefined) ?? deviceId ?? '',
		deviceId: deviceId ?? '',
		deviceName: item.name || item.deviceName || (raw.deviceAlias as string) || (raw.device_alias as string) || '--',
		deviceCode: item.deviceCode || (raw.device_code as string) || '--',
		deviceType,
		deviceTypeName: item.deviceTypeName || (raw.deviceTypeName as string) || (raw.device_type_name as string) || getDeviceTypeLabel(deviceType),
		installLocation:
			item.installLocation || (raw.installLoc as string) || (raw.install_location as string) || item.location || item.spaceName || '--',
		ratedPower: item.ratedPower ?? (raw.rated_power as number | null | undefined) ?? (raw.power as number | null | undefined) ?? null,
		runStatus,
		runStatusName:
			item.runStatusName ||
			item.deviceStatusName ||
			(raw.runningStatusName as string) ||
			(raw.statusName as string) ||
			(raw.deviceStatusName as string) ||
			getDeviceRunStatusName(runStatus),
		subSystemId,
		subSystemName,
		isChoose: isCurrentSystemDevice,
		disabled: !isCurrentSystemDevice && Boolean(item.disabled ?? raw.disabled ?? false),
	};
}

function normalizeDeviceSubSystemName(item: DeviceBindRecord, subSystemId: number | string | undefined) {
	const name = item.subSystemName || item.belongSubsystemName || item.systemName || '';
	if (name) return name;
	if ((item.isChoose || item.checked) && bindDialogSystem.value?.systemName) {
		return bindDialogSystem.value.systemName;
	}
	if (subSystemId !== undefined && bindDialogSystem.value && String(subSystemId) === String(bindDialogSystem.value.id)) {
		return bindDialogSystem.value.systemName;
	}
	return subSystemId !== undefined && subSystemId !== null ? '已绑定' : '未绑定';
}

function getDeviceTypeLabel(value: string) {
	return DEVICE_TYPE_LABEL_MAP[value] || value || '--';
}

function getRunningStatusLabel(value: string) {
	const normalizedValue = `${value || ''}`.trim();
	if (!normalizedValue) return '--';

	const exactMatchedOption = runningStatusOptions.value.find((option) => String(option.value) === normalizedValue);
	if (exactMatchedOption) return exactMatchedOption.label;

	const lowerCaseValue = normalizedValue.toLowerCase();
	return runningStatusOptions.value.find((option) => String(option.value).toLowerCase() === lowerCaseValue)?.label || normalizedValue;
}

function getDeviceRunStatusName(status: string) {
	const statusMap: Record<string, string> = {
		running: '运行',
		online: '在线',
		stop: '停止',
		stopped: '停止',
		offline: '离线',
		standby: '待机',
		fault: '故障',
		alarm: '告警',
		normal: '运行',
	};
	return statusMap[status] || status || '--';
}

function normalizeDeviceRunStatusValue(status: unknown) {
	return `${status || ''}`.trim().toLowerCase();
}

function getDeviceRunStatusClass(status: string) {
	if (status === 'running' || status === 'online' || status === 'normal') return 'status-tag--normal';
	if (status === 'standby' || status === 'alarm') return 'status-tag--warning';
	if (status === 'fault') return 'status-tag--danger';
	return 'status-tag--offline';
}

function getBindSubSystemText(row: DeviceBindItem) {
	return row.subSystemName || '未绑定';
}

function isDeviceBoundToCurrentSystem(row: DeviceBindItem) {
	if (!bindDialogSystem.value) return false;
	if (row.subSystemId === undefined || row.subSystemId === null) return false;
	return String(row.subSystemId) === String(bindDialogSystem.value.id);
}

function isBindDeviceSelectable(row: DeviceBindItem) {
	if (!bindDialogSystem.value) return false;
	if (isDeviceBoundToCurrentSystem(row)) return true;
	if (row.disabled) return false;
	if (row.subSystemId === undefined || row.subSystemId === null) {
		return !row.subSystemName || row.subSystemName === '未绑定' || row.subSystemName === '--';
	}
	return String(row.subSystemId) === String(bindDialogSystem.value.id);
}

function getOptionLabel(options: Array<{ label: string; value: string | number }>, value: string | number) {
	const normalizedValue = value === null || value === undefined ? '' : String(value);
	return options.find((option) => String(option.value) === normalizedValue)?.label || normalizedValue || '--';
}

function getErrorMessage(error: unknown, fallback: string) {
	const maybeError = error as { msg?: string; message?: string } | undefined;
	return maybeError?.msg || maybeError?.message || fallback;
}

function parseOptionalNumber(value: string) {
	if (value === '' || value === null || value === undefined) return undefined;
	const numberValue = Number(value);
	return Number.isNaN(numberValue) ? undefined : numberValue;
}

function formatOptionalFormNumber(value: number | null) {
	return value === null || value === undefined ? '' : String(value);
}

function normalizeEmptyValue(value: string) {
	return value === '--' ? '' : value || '';
}

function uniqueIdList(list: Array<number | string>) {
	const idMap = new Map<string, number | string>();
	list.forEach((item) => {
		idMap.set(String(item), item);
	});
	return Array.from(idMap.values());
}

function formatDevicePower(value: number | null) {
	if (value === null || value === undefined) return '--';
	return `${Number(value)}`;
}

function normalizeLoadRate(rate: number | string | null | undefined) {
	if (rate === null || rate === undefined) return null;
	if (typeof rate === 'number') return Number.isFinite(rate) ? rate : null;

	const normalizedRate = rate.trim();
	if (!normalizedRate) return null;

	const numericText = normalizedRate.endsWith('%') ? normalizedRate.slice(0, -1).trim() : normalizedRate;
	const numberValue = Number(numericText);
	return Number.isFinite(numberValue) ? numberValue : null;
}

function formatRate(rate: number | string | null) {
	const normalizedRate = normalizeLoadRate(rate);
	if (normalizedRate === null) return '--';
	return `${normalizedRate}%`;
}

function getLoadRateClass(rate: number | string | null) {
	const normalizedRate = normalizeLoadRate(rate);
	if (normalizedRate === null) return 'rate-tag--normal';
	if (normalizedRate >= 80) return 'rate-tag--warning';
	if (normalizedRate >= 60) return 'rate-tag--success';
	return 'rate-tag--normal';
}

function getRunStatusClass(status: string) {
	const normalizedStatus = normalizeDeviceRunStatusValue(status);
	if (normalizedStatus === 'alarm' || normalizedStatus === 'warning') return 'status-tag--warning';
	if (normalizedStatus === 'fault') return 'status-tag--offline';
	if (normalizedStatus === 'disabled' || normalizedStatus === 'offline' || normalizedStatus === 'stop' || normalizedStatus === 'stopped') {
		return 'status-tag--offline';
	}
	return 'status-tag--normal';
}

function getDatePart(dateTime: string) {
	return dateTime?.split(' ')[0] || '--';
}

function getTimePart(dateTime: string) {
	return dateTime?.split(' ')[1] || '--';
}
</script>

<style scoped lang="scss">
.layout-padding {
	position: relative !important;
	height: auto !important;
	min-height: 100% !important;
	overflow: visible !important;
}

.layout-padding-auto.layout-padding-view {
	padding: 0 !important;
}

.subitem-system-scrollbar {
	height: auto;
	min-height: 100%;
	padding: 0;

	:deep(.el-scrollbar__wrap) {
		overflow-x: hidden;
	}
}

.subitem-system-page {
	height: auto;
	min-height: 100%;
	padding: 0 0 10px;
	background: transparent;
}

.management-card {
	background: #fff;
	border-radius: 0;
	box-shadow: none;
	display: flex;
	flex-direction: column;
}

.management-card__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 8px 0 10px;
}

.management-card__title {
	display: inline-flex;
	align-items: center;
	gap: 10px;
	font-size: 16px;
	font-weight: 600;
	line-height: 24px;
	color: #1f2937;
}

.management-card__title-bar {
	width: 4px;
	height: 20px;
	border-radius: 999px;
	background: var(--dashboard-primary, var(--el-color-primary));
	box-shadow: 0 4px 10px rgba(var(--dashboard-primary-rgb, 64, 158, 255), 0.22);
}

.management-card__content {
	flex: 1;
	min-height: 0;
	padding: 12px 0 0;
	display: flex;
}

.management-card__content :deep(.configurable-table-with-form) {
	flex: 1;
	min-height: 0;
}

.management-card__content :deep(.form-container) {
	margin-bottom: 12px;
}

.management-card__content :deep(.query-form) {
	margin: 0;
	border: none;
	border-radius: 0;
	background: transparent;
}

.management-card__content :deep(.filter-content) {
	padding: 0 0 12px;
}

.management-card__content :deep(.query-form .el-form-item) {
	margin-bottom: 8px;
}

.management-card__content :deep(.query-form .filter-actions) {
	padding-top: 4px;
}

.management-card__content :deep(.configurable-table-container) {
	flex: 1;
	min-height: 0;
	border: 1px solid #e8eef5;
	border-radius: 8px;
	overflow: hidden;
	background: #fff;
}

.management-card__content :deep(.table-content) {
	min-height: 0;
}

.management-card__content :deep(.el-table th.el-table__cell) {
	// height: 46px;
	background: #fafbfd !important;
	font-size: 13px;
	font-weight: 400;
	color: #5f6b7a;
	border-right: 1px solid #eef2f7 !important;
}

.management-card__content :deep(.el-table td.el-table__cell) {
	padding: 11px 0;
	font-size: 13px;
	color: #5f6b7a;
	border-right: 1px solid #eef2f7 !important;
	border-bottom: 1px solid #eef2f7 !important;
}

.management-card__content :deep(.el-table--border .el-table__cell),
.management-card__content :deep(.el-table--border th.el-table__cell) {
	border-right: 1px solid #eef2f7 !important;
}

.management-card__content :deep(.el-table td.el-table__cell:last-child),
.management-card__content :deep(.el-table th.el-table__cell:last-child) {
	border-right: none !important;
}

.management-card__content :deep(.el-table__border-left-patch) {
	display: block !important;
	background: #eef2f7;
}

.management-card__content :deep(.el-table__inner-wrapper::before) {
	height: 1px !important;
	background-color: #eef2f7 !important;
}

.management-card__content :deep(.el-table__fixed-right::before),
.management-card__content :deep(.el-table__fixed::before) {
	background-color: #eef2f7 !important;
}

.management-card__content :deep(.pagination-container) {
	background: #fff;
	border-left: none;
	border-right: none;
	border-bottom: none;
	border-top: 1px solid #eef2f7;
	padding: 12px 14px;
}

.management-card__content :deep(.pagination-total) {
	font-size: 13px;
	color: #7b8794;
}

.management-card__content :deep(.el-pagination .btn-prev),
.management-card__content :deep(.el-pagination .btn-next) {
	min-width: 28px;
	height: 28px;
	padding: 0 8px;
	border: 1px solid #dbe3ec;
	color: #98a2b3;
}

.management-card__content :deep(.el-pagination .el-pager li) {
	min-width: 28px;
	height: 28px;
	line-height: 26px;
	border: 1px solid transparent;
	border-radius: 2px;
	font-size: 13px;
	color: #7b8794;
}

.management-card__content :deep(.el-pagination .el-pager li.is-active) {
	border-color: #409eff;
	color: #409eff;
	background: #fff;
}

.management-card__content :deep(.el-pagination .el-select .el-input__wrapper),
.management-card__content :deep(.el-pagination .el-input__wrapper) {
	box-shadow: 0 0 0 1px #dbe3ec inset;
	border-radius: 2px;
}

.rate-tag,
.status-tag {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 46px;
	height: 22px;
	padding: 0 8px;
	border: 1px solid transparent;
	border-radius: 3px;
	font-size: 12px;
	font-weight: 500;
	line-height: 20px;
	box-sizing: border-box;
}

.rate-tag--success,
.rate-tag--normal,
.status-tag--normal {
	background: #f6ffed;
	border-color: #b7eb8f;
	color: #52c41a;
}

.rate-tag--warning,
.status-tag--warning {
	background: #fff7e6;
	border-color: #ffd591;
	color: #fa8c16;
}

.status-tag--offline {
	background: #fafafa;
	border-color: #d9d9d9;
	color: #8c8c8c;
}

.status-tag--danger {
	background: #fff1f0;
	border-color: #ffccc7;
	color: #f5222d;
}

.time-cell {
	display: inline-flex;
	flex-direction: column;
	align-items: center;
	line-height: 1.5;
	color: #4b5563;
}

.action-group {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 0;
}

.action-link {
	padding: 0;
	height: auto;
	font-size: 13px;
	font-weight: 500;
	color: #1677ff;
}

.action-link--bind {
	color: #1677ff;
}

.action-link--view {
	color: #1677ff;
}

.action-link--edit {
	color: #1677ff;
}

.action-link--delete {
	color: #ff4d4f;
}

.action-group :deep(.el-button + .el-button) {
	margin-left: 14px;
}

.action-group :deep(.el-button:hover),
.action-group :deep(.el-button:focus-visible) {
	opacity: 0.9;
}

:deep(.subitem-system-dialog) {
	max-width: calc(100vw - 32px);
	border-radius: 12px;
	overflow: hidden;
}

:deep(.subitem-system-dialog .el-dialog__header) {
	margin-right: 0;
	padding: 28px 32px 12px;
}

:deep(.subitem-system-dialog .el-dialog__title) {
	font-size: 20px;
	font-weight: 600;
	line-height: 28px;
	color: #1f2937;
}

:deep(.subitem-system-dialog .el-dialog__headerbtn) {
	top: 28px;
	right: 24px;
}

:deep(.subitem-system-dialog .el-dialog__body) {
	padding: 12px 32px 8px;
}

:deep(.subitem-system-dialog .el-dialog__footer) {
	padding: 20px 32px 28px;
}

.subitem-dialog-form__grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	column-gap: 44px;
	row-gap: 6px;
}

.subitem-dialog-form__item--full {
	grid-column: 1 / -1;
}

.subitem-dialog-form :deep(.el-form-item) {
	margin-bottom: 20px;
}

.subitem-dialog-form :deep(.el-form-item__label) {
	font-size: 15px;
	color: #374151;
	line-height: 46px;
}

.subitem-dialog-form :deep(.el-input),
.subitem-dialog-form :deep(.el-select),
.subitem-dialog-form :deep(.el-tree-select) {
	width: 100%;
}

.subitem-dialog-form :deep(.el-input__wrapper),
.subitem-dialog-form :deep(.el-select__wrapper),
.subitem-dialog-form :deep(.el-textarea__inner) {
	border-radius: 8px;
	box-shadow: 0 0 0 1px #d7deea inset;
}

.subitem-dialog-form :deep(.el-input__wrapper),
.subitem-dialog-form :deep(.el-select__wrapper) {
	min-height: 46px;
	padding-left: 14px;
}

.subitem-dialog-form__unit {
	display: inline-flex;
	align-items: center;
	padding-left: 8px;
	color: #8b95a7;
	font-size: 15px;
	white-space: nowrap;
}

.subitem-dialog-form :deep(.el-textarea__inner) {
	min-height: 144px;
	padding: 12px 14px;
}

.subitem-dialog-form :deep(.el-input__count) {
	color: #98a2b3;
}

.subitem-dialog__footer {
	display: flex;
	justify-content: flex-end;
	gap: 16px;
}

.subitem-dialog__cancel,
.subitem-dialog__confirm {
	min-width: 116px;
	height: 42px;
	border-radius: 8px;
	font-size: 16px;
}

.subitem-dialog__cancel {
	border-color: #d7deea;
	color: #4b5563;
}

:deep(.device-bind-dialog),
:deep(.device-bind-dialog .el-dialog) {
	width: min(1680px, calc(100vw - 32px)) !important;
	max-width: calc(100vw - 32px) !important;
	box-sizing: border-box;
	border-radius: 12px;
	overflow: hidden;
}

:deep(.device-bind-dialog .el-dialog__header) {
	margin-right: 0;
	padding: 24px 28px 8px;
}

:deep(.device-bind-dialog .el-dialog__title) {
	font-size: 18px;
	font-weight: 600;
	color: #1f2937;
}

:deep(.device-bind-dialog .el-dialog__headerbtn) {
	top: 24px;
	right: 20px;
}

:deep(.device-bind-dialog .el-dialog__body) {
	padding: 8px 28px 0;
}

:deep(.device-bind-dialog .el-dialog__footer) {
	padding: 20px 28px 24px;
}

.device-bind-dialog__summary {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 36px;
	margin-bottom: 20px;
	font-size: 15px;
	color: #6b7280;
}

.device-bind-dialog__summary-item {
	display: inline-flex;
	align-items: center;
	gap: 8px;
}

.device-bind-dialog__summary-label {
	color: #4b5563;
}

.device-bind-dialog__summary-value {
	font-size: 16px;
	font-weight: 600;
	color: #1f2937;
}

.device-bind-dialog__content {
	display: flex;
	flex-direction: column;
	min-height: 640px;
}

.device-bind-dialog__content :deep(.configurable-table-with-form) {
	flex: 1;
	min-height: 0;
}

.device-bind-dialog__content :deep(.form-container) {
	margin-bottom: 12px;
}

.device-bind-dialog__content :deep(.query-form .el-form-item) {
	margin-bottom: 8px;
}

.device-bind-dialog__content :deep(.query-form .condition-value) {
	min-width: 220px;
}

.device-bind-dialog__content :deep(.query-form .filter-actions) {
	padding-top: 2px;
}

.device-bind-dialog__content :deep(.configurable-table-container) {
	flex: 1;
	min-height: 0;
	border: 1px solid #e8eef5;
	border-radius: 8px;
	overflow: hidden;
	background: #fff;
}

.device-bind-dialog__content :deep(.table-content) {
	height: 520px;
}

.device-bind-dialog__content :deep(.el-table th.el-table__cell) {
	height: 46px;
	background: #fafbfd !important;
	font-size: 13px;
	font-weight: 400;
	color: #5f6b7a;
	border-right: 1px solid #eef2f7 !important;
}

.device-bind-dialog__content :deep(.el-table td.el-table__cell) {
	padding: 11px 0;
	font-size: 13px;
	color: #5f6b7a;
	border-right: 1px solid #eef2f7 !important;
	border-bottom: 1px solid #eef2f7 !important;
}

.device-bind-dialog__content :deep(.el-table__inner-wrapper::before),
.device-bind-dialog__content :deep(.el-table__fixed-right::before),
.device-bind-dialog__content :deep(.el-table__fixed::before) {
	background-color: #eef2f7 !important;
}

.device-bind-dialog__content :deep(.pagination-container) {
	background: #fff;
	border-top: 1px solid #eef2f7;
	padding: 12px 14px;
}

.bind-subsystem-text {
	color: #4b5563;
}

.bind-subsystem-text--empty {
	color: #98a2b3;
}

.device-bind-dialog__footer {
	display: flex;
	justify-content: flex-end;
	gap: 16px;
}

.device-bind-dialog__cancel,
.device-bind-dialog__confirm {
	min-width: 120px;
	height: 42px;
	border-radius: 8px;
	font-size: 16px;
}

.device-bind-dialog__cancel {
	border-color: #d7deea;
	color: #4b5563;
}

@media screen and (max-width: 1280px) {
	.management-card__header {
		padding: 8px 0 10px;
	}

	.subitem-dialog-form__grid {
		column-gap: 24px;
	}

	.device-bind-dialog__content {
		min-height: 560px;
	}
}

@media screen and (max-width: 768px) {
	.subitem-system-page {
		padding-bottom: 64px;
	}

	.management-card__header {
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
	}

	.add-button {
		width: 100%;
		justify-content: center;
	}

	.filter-form {
		display: block;
	}

	.filter-form :deep(.el-form-item) {
		width: 100%;
		margin-right: 0;
	}

	.filter-form__actions {
		margin-left: 0;
	}

	.management-card__content {
		overflow-x: auto;
	}

	:deep(.subitem-system-dialog .el-dialog__header) {
		padding: 20px 20px 8px;
	}

	:deep(.subitem-system-dialog .el-dialog__body) {
		padding: 12px 20px 4px;
	}

	:deep(.subitem-system-dialog .el-dialog__footer) {
		padding: 16px 20px 20px;
	}

	:deep(.device-bind-dialog .el-dialog__header) {
		padding: 20px 20px 8px;
	}

	:deep(.device-bind-dialog .el-dialog__body) {
		padding: 12px 20px 0;
	}

	:deep(.device-bind-dialog .el-dialog__footer) {
		padding: 16px 20px 20px;
	}

	.subitem-dialog-form__grid {
		grid-template-columns: minmax(0, 1fr);
		row-gap: 0;
	}

	.subitem-dialog-form__item--full {
		grid-column: auto;
	}

	.subitem-dialog-form :deep(.el-form-item__label) {
		line-height: 1.5;
		padding-bottom: 8px;
	}

	.subitem-dialog__footer {
		flex-direction: column-reverse;
	}

	.subitem-dialog__cancel,
	.subitem-dialog__confirm {
		width: 100%;
	}

	.device-bind-dialog__summary {
		gap: 12px;
		margin-bottom: 16px;
	}

	.device-bind-dialog__content {
		min-height: 420px;
	}

	.device-bind-dialog__content :deep(.query-form .condition-value) {
		min-width: 0;
		width: 100%;
	}

	.device-bind-dialog__content :deep(.table-content) {
		height: 420px;
	}

	.device-bind-dialog__footer {
		flex-direction: column-reverse;
	}

	.device-bind-dialog__cancel,
	.device-bind-dialog__confirm {
		width: 100%;
	}
}
</style>
