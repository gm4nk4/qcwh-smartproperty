<template>
	<div class="layout-padding visitor-appointment">
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
				<template #statusSlot="{ row }">
					<span :class="getAppointmentStatusMeta(row.status).className">
						{{ getAppointmentStatusMeta(row.status).label }}
					</span>
				</template>
			</ConfigurableTableWithForm>
		</div>

		<el-dialog
			v-model="dialogState.visible"
			width="860px"
			destroy-on-close
			class="visitor-appointment__dialog"
			:close-on-click-modal="false"
			@closed="handleDialogClosed"
		>
			<template #header>
				<div class="visitor-appointment__dialog-header">
					<span class="visitor-appointment__dialog-title">{{ detailDialogTitle }}</span>
					<span v-if="currentDetail" :class="currentStatusMeta.className" class="visitor-appointment__dialog-status">
						{{ currentStatusMeta.label }}
					</span>
				</div>
			</template>

			<div v-loading="dialogState.loading">
				<section class="visitor-appointment__detail-section" v-for="section in detailSections" :key="section.key">
					<div class="visitor-appointment__detail-title">{{ section.title }}</div>
					<div class="visitor-appointment__detail-grid">
						<div
							class="visitor-appointment__detail-item"
							:class="{ 'visitor-appointment__detail-item--full': item.span === 2 }"
							v-for="item in section.items"
							:key="`${section.key}-${item.label}`"
						>
							<div class="visitor-appointment__detail-label">{{ item.label }}</div>
							<div class="visitor-appointment__detail-value">{{ item.value }}</div>
						</div>
					</div>
				</section>

				<section class="visitor-appointment__detail-section">
					<div class="visitor-appointment__detail-title">通行记录</div>
					<el-table :data="passRecordRows" border class="visitor-appointment__detail-table">
						<el-table-column
							v-for="column in passRecordColumnConfigs"
							:key="column.key"
							:prop="column.prop"
							:label="column.label"
							:min-width="column.minWidth"
							:width="column.width"
						>
							<template #default="{ row }">
								<template v-if="column.type === 'preview'">
									<el-image
										v-if="row.captureUrl"
										:src="row.captureUrl"
										:preview-src-list="[row.captureUrl]"
										:preview-teleported="true"
										fit="cover"
										class="visitor-appointment__capture"
									>
										<template #error>
											<div class="visitor-appointment__capture-fallback">
												<SvgIcon name="ele-Picture" :size="16" />
											</div>
										</template>
									</el-image>
									<span v-else>-</span>
								</template>
								<span v-else>{{ row[column.prop] }}</span>
							</template>
						</el-table-column>
					</el-table>
				</section>
			</div>

			<template #footer>
				<div class="visitor-appointment__dialog-footer">
					<el-button @click="dialogState.visible = false">关闭</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="visitorAppointmentRecords">
import { computed, onMounted, reactive, ref } from 'vue';
import { ConfigurableTableWithForm, type TableConfig } from '@zhqc-smart/table';
import { getVisitorAppointmentDetail, getVisitorAppointmentPage, type VisitorAppointmentDetail, type VisitorAppointmentItem } from './api';
import {
	type AppointmentFormData,
	defaultFormData,
	detailDialogTitle,
	detailSectionConfigs,
	passRecordColumnConfigs,
	queryFormConfig,
	tableColumns,
} from './index';
import {
	buildAppointmentDetailSections,
	buildAppointmentPassRecordRows,
	buildAppointmentQueryParams,
	getAppointmentStatusMeta,
} from './useBizProcess';

const tableRef = ref();

const queryParams = reactive<AppointmentFormData>({ ...defaultFormData });

const pageState = reactive({
	loading: false,
	total: 0,
	records: [] as VisitorAppointmentItem[],
});

const dialogState = reactive({
	visible: false,
	loading: false,
	currentDetail: null as VisitorAppointmentDetail | null,
});

const tableConfig = computed<TableConfig>(() => ({
	columns: tableColumns,
	data: pageState.records,
	selectionType: 'none',
	showIndex: true,
	showOperations: true,
	pagination: true,
	pageSize: queryParams.size,
	currentPage: queryParams.current,
	total: pageState.total,
	loading: pageState.loading,
}));

const currentDetail = computed(() => dialogState.currentDetail);

const currentStatusMeta = computed(() => {
	if (!dialogState.currentDetail) {
		return { label: '', className: '' };
	}
	return getAppointmentStatusMeta(dialogState.currentDetail.status);
});

const detailSections = computed(() => buildAppointmentDetailSections(dialogState.currentDetail, detailSectionConfigs));

const passRecordRows = computed(() => {
	return dialogState.currentDetail ? buildAppointmentPassRecordRows(dialogState.currentDetail.passRecords) : [];
});

const loadTableData = async () => {
	pageState.loading = true;
	try {
		const res = await getVisitorAppointmentPage(buildAppointmentQueryParams(queryParams));
		pageState.records = res.data.records;
		pageState.total = res.data.total;
	} finally {
		pageState.loading = false;
	}
};

const handleSearch = (formData: Record<string, unknown>) => {
	queryParams.visitorName = String(formData.visitorName ?? '');
	queryParams.visitorPhone = String(formData.visitorPhone ?? '');
	queryParams.visitorVehicleNo = String(formData.visitorVehicleNo ?? '');
	queryParams.visitedEnterprise = String(formData.visitedEnterprise ?? '');
	queryParams.visitedName = String(formData.visitedName ?? '');
	queryParams.status = (formData.status ?? '') as AppointmentFormData['status'];
	queryParams.current = 1;
	loadTableData();
};

const handleReset = () => {
	Object.assign(queryParams, { ...defaultFormData, size: queryParams.size });
	loadTableData();
};

const handleSizeChange = (size: number) => {
	queryParams.size = size;
	queryParams.current = 1;
	loadTableData();
};

const handleCurrentChange = (current: number) => {
	queryParams.current = current;
	loadTableData();
};

const handleOperation = ({ action, row }: { action: string; row: VisitorAppointmentItem }) => {
	if (action === 'detail') openDetailDialog(row.id);
};

const openDetailDialog = async (id: string) => {
	dialogState.visible = true;
	dialogState.loading = true;
	dialogState.currentDetail = null;
	try {
		const res = await getVisitorAppointmentDetail(id);
		dialogState.currentDetail = res.data;
	} finally {
		dialogState.loading = false;
	}
};

const handleDialogClosed = () => {
	dialogState.currentDetail = null;
};

onMounted(() => {
	loadTableData();
});
</script>

<style scoped lang="scss">
.visitor-appointment {
	&__dialog-header {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	&__dialog-title {
		font-size: 20px;
		font-weight: 700;
		color: #0f172a;
	}

	&__dialog-status {
		transform: translateY(1px);
	}

	&__detail-section {
		padding-bottom: 20px;
		margin-bottom: 20px;
		border-bottom: 1px solid #edf2f7;
	}

	&__detail-section:last-of-type {
		padding-bottom: 0;
		margin-bottom: 0;
		border-bottom: none;
	}

	&__detail-title {
		margin-bottom: 16px;
		font-size: 16px;
		font-weight: 700;
		color: #1e293b;
	}

	&__detail-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 16px 28px;
	}

	&__detail-item--full {
		grid-column: span 2;
	}

	&__detail-label {
		margin-bottom: 6px;
		font-size: 13px;
		color: #94a3b8;
	}

	&__detail-value {
		font-size: 15px;
		line-height: 1.6;
		color: #334155;
		white-space: pre-wrap;
		word-break: break-word;
	}

	&__detail-table {
		:deep(th.el-table__cell) {
			background: #f8fafc;
		}
	}

	&__capture {
		width: 38px;
		height: 32px;
		border-radius: 6px;
		overflow: hidden;
		background: #f8fafc;
		border: 1px solid #e2e8f0;
	}

	&__capture-fallback {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #94a3b8;
		background: #f8fafc;
	}

	&__dialog-footer {
		display: flex;
		justify-content: flex-end;
	}
}

@media (max-width: 992px) {
	.visitor-appointment {
		&__detail-grid {
			grid-template-columns: 1fr;
		}

		&__detail-item--full {
			grid-column: span 1;
		}
	}
}
</style>
