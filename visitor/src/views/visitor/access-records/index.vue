<template>
	<div class="layout-padding visitor-access-record">
		<div class="layout-padding-auto layout-padding-view visitor-access-record__body">
			<section class="visitor-access-record__search">
				<div class="visitor-access-record__search-grid">
					<div class="visitor-access-record__field" v-for="item in queryFieldConfigs" :key="item.key">
						<div class="visitor-access-record__field-label">{{ item.label }}</div>
						<component
							:is="item.component"
							v-bind="item.props"
							:model-value="formData[item.field]"
							@update:modelValue="(value: unknown) => handleFormValueChange(item.field, value)"
						>
							<template v-if="item.component === 'el-select'">
								<el-option v-for="option in item.options" :key="option.value" :label="option.label" :value="option.value" />
							</template>
						</component>
					</div>

					<div class="visitor-access-record__actions">
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
				</div>
			</section>

			<section class="visitor-access-record__table-panel" v-loading="pageState.loading">
				<el-table :data="tableRows" class="visitor-access-record__table" row-key="id">
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
							<span v-else-if="column.type === 'status'" :class="row.statusClassName">{{ row.statusText }}</span>
							<el-button v-else-if="column.type === 'operation'" type="primary" link @click="openDetailDialog(row.id)">详情</el-button>
							<template v-else-if="column.type === 'preview'">
								<el-image
									v-if="row.captureUrl"
									:src="row.captureUrl"
									:preview-src-list="[row.captureUrl]"
									:preview-teleported="true"
									fit="cover"
									class="visitor-access-record__capture"
								>
									<template #error>
										<div class="visitor-access-record__capture-fallback">
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

				<div class="visitor-access-record__pagination">
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
			width="860px"
			destroy-on-close
			class="visitor-access-record__dialog"
			:close-on-click-modal="false"
			@closed="handleDialogClosed"
		>
			<template #header>
				<div class="visitor-access-record__dialog-header">
					<span class="visitor-access-record__dialog-title">{{ detailDialogTitle }}</span>
					<span v-if="currentDetail" :class="currentStatusMeta.className" class="visitor-access-record__dialog-status">
						{{ currentStatusMeta.label }}
					</span>
				</div>
			</template>

			<div v-loading="dialogState.loading">
				<section class="visitor-access-record__detail-section" v-for="section in detailSections" :key="section.key">
					<div class="visitor-access-record__detail-title">{{ section.title }}</div>
					<div class="visitor-access-record__detail-grid">
						<div
							class="visitor-access-record__detail-item"
							:class="{ 'visitor-access-record__detail-item--full': item.span === 2 }"
							v-for="item in section.items"
							:key="`${section.key}-${item.label}`"
						>
							<div class="visitor-access-record__detail-label">{{ item.label }}</div>
							<div class="visitor-access-record__detail-value">{{ item.value }}</div>
						</div>
					</div>
				</section>

				<section class="visitor-access-record__detail-section">
					<div class="visitor-access-record__detail-title">通行记录</div>
					<el-table :data="passRecordRows" border class="visitor-access-record__detail-table">
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
										class="visitor-access-record__capture"
									>
										<template #error>
											<div class="visitor-access-record__capture-fallback">
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
				<div class="visitor-access-record__dialog-footer">
					<el-button @click="dialogState.visible = false">关闭</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="visitorAccessRecords">
import { computed, onMounted, reactive } from 'vue';
import Pagination from '/@/components/Pagination/index.vue';
import {
	getVisitorAccessRecordDetail,
	getVisitorAccessRecordPage,
	type VisitorAccessRecordDetail,
	type VisitorAccessRecordItem,
} from './api';
import {
	type AccessRecordFormData,
	type AccessRecordQueryField,
	defaultFormData,
	defaultStatusMeta,
	detailDialogTitle,
	detailSectionConfigs,
	passRecordColumnConfigs,
	queryFieldConfigs,
	tableColumnConfigs,
} from './index';
import {
	buildAccessRecordDetailSections,
	buildAccessRecordPassRows,
	buildAccessRecordQueryParams,
	buildAccessRecordTableRows,
	getAccessRecordStatusMeta,
} from './useBizProcess';

const formData = reactive<AccessRecordFormData>({
	...defaultFormData,
});

const pageState = reactive({
	loading: false,
	total: 0,
	records: [] as VisitorAccessRecordItem[],
});

const dialogState = reactive({
	visible: false,
	loading: false,
	currentDetail: null as VisitorAccessRecordDetail | null,
});

const tableRows = computed(() => buildAccessRecordTableRows(pageState.records, formData.current, formData.size));

const currentDetail = computed(() => dialogState.currentDetail);

const currentStatusMeta = computed(() => {
	if (!dialogState.currentDetail) return defaultStatusMeta;
	return getAccessRecordStatusMeta(dialogState.currentDetail.status);
});

const detailSections = computed(() => buildAccessRecordDetailSections(dialogState.currentDetail, detailSectionConfigs));

const passRecordRows = computed(() => {
	return dialogState.currentDetail ? buildAccessRecordPassRows(dialogState.currentDetail.passRecords) : [];
});

const handleFormValueChange = (field: AccessRecordQueryField, value: unknown) => {
	formData[field] = typeof value === 'string' ? value : '';
};

const loadTableData = async () => {
	pageState.loading = true;
	try {
		const res = await getVisitorAccessRecordPage(buildAccessRecordQueryParams(formData));
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

const openDetailDialog = async (id: string) => {
	dialogState.visible = true;
	dialogState.loading = true;
	dialogState.currentDetail = null;
	try {
		const res = await getVisitorAccessRecordDetail(id);
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
.visitor-access-record {
	height: auto;

	&__body {
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 16px;
		background:
			radial-gradient(circle at top left, rgba(59, 130, 246, 0.05), transparent 26%),
			radial-gradient(circle at top right, rgba(14, 165, 233, 0.05), transparent 24%),
			#f8fafc;
		border-radius: 22px;
		border: 1px solid #eef2f7;
		overflow: auto;
	}

	&__search,
	&__table-panel {
		padding: 18px;
		border-radius: 20px;
		background: rgba(255, 255, 255, 0.95);
		border: 1px solid rgba(226, 232, 240, 0.9);
		box-shadow: 0 12px 34px rgba(15, 23, 42, 0.04);
	}

	&__search-grid {
		display: grid;
		grid-template-columns: repeat(9, minmax(0, 1fr)) auto;
		gap: 12px;
		align-items: end;
	}

	&__field-label {
		margin-bottom: 6px;
		font-size: 13px;
		color: #64748b;
		font-weight: 500;
	}

	&__actions {
		display: flex;
		align-items: center;
		gap: 10px;
		padding-top: 22px;
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

	&__dialog-footer {
		display: flex;
		justify-content: flex-end;
	}
}

@media (max-width: 1600px) {
	.visitor-access-record {
		&__search-grid {
			grid-template-columns: repeat(5, minmax(0, 1fr));
		}

		&__actions {
			padding-top: 0;
		}
	}
}

@media (max-width: 992px) {
	.visitor-access-record {
		&__body {
			padding: 16px;
		}

		&__search-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		&__detail-grid {
			grid-template-columns: 1fr;
		}

		&__detail-item--full {
			grid-column: span 1;
		}
	}
}

@media (max-width: 640px) {
	.visitor-access-record {
		&__search-grid {
			grid-template-columns: 1fr;
		}

		&__actions {
			flex-wrap: wrap;
		}
	}
}
</style>
