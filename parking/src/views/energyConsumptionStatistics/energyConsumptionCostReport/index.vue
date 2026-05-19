<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-scrollbar class="cost-report-scrollbar">
				<div class="cost-report-page" :style="reportThemeVars">
					<section class="management-card">
						<div class="report-tabs">
							<button
								v-for="item in reportTabOptions"
								:key="item.value"
								type="button"
								class="report-tab"
								:class="{ 'is-active': activeTab === item.value }"
								@click="handleTabChange(item.value)"
							>
								{{ item.label }}
							</button>
						</div>

						<section class="management-card__content">
							<div class="report-filter-panel">
								<ConfigurableQueryForm
									:key="`${activeTab}-${queryFormRenderKey}`"
									:config="queryFormConfig"
									@search="handleSearch"
									@reset="handleReset"
								>
									<template #actions>
										<el-button type="primary" size="large" class="report-export-button" :icon="Download" :loading="exportLoading" @click="handleExport">
											导出Excel
										</el-button>
									</template>
								</ConfigurableQueryForm>
							</div>

							<div class="report-table-panel" v-loading="tableLoading">
								<el-table
									:data="pagedRows"
									border
									row-key="id"
									empty-text="暂无报表数据"
									class="report-table"
									:header-cell-style="tableHeaderCellStyle"
									:cell-style="tableCellStyle"
									:tree-props="{ children: 'children' }"
									:row-class-name="getTableRowClassName"
								>
									<el-table-column label="统计项目" min-width="220" fixed="left" align="left">
										<template #default="{ row }">
											<div class="statistics-item" :class="{ 'statistics-item--child': row.isChildRow }">
												<span v-if="!row.isChildRow" class="statistics-item__icons">
													<el-icon><Calendar /></el-icon>
												</span>
												<span class="statistics-item__label" :class="{ 'statistics-item__label--child': row.isChildRow }">{{ row.label }}</span>
											</div>
										</template>
									</el-table-column>

									<template v-if="activeTab === 'electricity'">
										<el-table-column label="用量统计" align="center">
											<el-table-column prop="peakUsage" label="峰时用量(kWh)" min-width="128" align="left" :formatter="formatTableIntegerColumn" />
											<el-table-column prop="flatUsage" label="平时用量(kWh)" min-width="128" align="left" :formatter="formatTableIntegerColumn" />
											<el-table-column prop="valleyUsage" label="谷时用量(kWh)" min-width="128" align="left" :formatter="formatTableIntegerColumn" />
											<el-table-column prop="totalUsage" label="总用量(kWh)" min-width="128" align="left">
												<template #default="{ row }">
													<span class="report-value report-value--primary">{{ formatInteger(row.totalUsage) }}</span>
												</template>
											</el-table-column>
										</el-table-column>

										<el-table-column label="费用统计" align="center">
											<el-table-column prop="peakCost" label="峰时费用(元)" min-width="118" align="left" :formatter="formatTableIntegerColumn" />
											<el-table-column prop="flatCost" label="平时费用(元)" min-width="118" align="left" :formatter="formatTableIntegerColumn" />
											<el-table-column prop="valleyCost" label="谷时费用(元)" min-width="118" align="left" :formatter="formatTableIntegerColumn" />
											<el-table-column prop="basicCost" label="基本费用(元)" min-width="118" align="left" :formatter="formatTableIntegerColumn" />
											<el-table-column prop="surchargeCost" label="附加费用(元)" min-width="118" align="left" :formatter="formatTableIntegerColumn" />
											<el-table-column prop="totalCost" label="总费用(元)" min-width="118" align="left">
												<template #default="{ row }">
													<span class="report-value report-value--warning">{{ formatCurrency(row.totalCost) }}</span>
												</template>
											</el-table-column>
										</el-table-column>
									</template>

									<template v-else>
										<el-table-column label="用量统计" align="center">
											<el-table-column :prop="utilityUsageColumn.prop" :label="utilityUsageColumn.label" min-width="128" align="left">
												<template #default="{ row }">
													<span class="report-value report-value--primary">{{ formatInteger(row.totalUsage) }}</span>
												</template>
											</el-table-column>
										</el-table-column>

										<el-table-column label="费用统计" align="center">
											<el-table-column prop="basicCost" label="基本费用(元)" min-width="118" align="left" :formatter="formatTableIntegerColumn" />
											<el-table-column prop="surchargeCost" label="附加费用(元)" min-width="118" align="left" :formatter="formatTableIntegerColumn" />
											<el-table-column prop="totalCost" label="总费用(元)" min-width="118" align="left">
												<template #default="{ row }">
													<span class="report-value report-value--warning">{{ formatCurrency(row.totalCost) }}</span>
												</template>
											</el-table-column>
										</el-table-column>
									</template>
								</el-table>

								<div class="pagination-container">
									<div class="pagination-left">
										<span class="pagination-total">共 {{ filteredRows.length }} 条</span>
									</div>
									<div class="pagination-right">
										<el-pagination
											v-model:current-page="currentPage"
											v-model:page-size="pageSize"
											background
											layout="sizes, prev, pager, next, jumper"
											:total="filteredRows.length"
											:page-sizes="pageSizeOptions"
											@current-change="handleCurrentPageChange"
											@size-change="handlePageSizeChange"
										/>
									</div>
								</div>
							</div>
						</section>
					</section>
				</div>
			</el-scrollbar>
		</div>
	</div>
</template>

<script setup lang="ts" name="energyConsumptionCostReport">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { Calendar, Download } from '@element-plus/icons-vue';
import { ConfigurableQueryForm, type QueryFormConfig } from '/@/components/ConfigurableComponents';
import { useMessage } from '/@/hooks/message';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useChangeColor } from '/@/utils/theme';
import { handleBlobFile } from '/@/utils/other';

type ReportTabKey = 'electricity' | 'water' | 'gas';
type GranularityValue = 'DAY' | 'WEEK' | 'MONTH';
type TimeRangeValue = 'CURRENT_MONTH' | 'FIRST_HALF_MONTH' | 'SECOND_HALF_MONTH';
type SummaryModeValue = 'TOTAL' | 'PHASE' | 'LADDER';

interface FilterState {
	granularity: GranularityValue;
	timeRange: TimeRangeValue;
	summaryMode: SummaryModeValue;
}

interface BaseReportRow {
	id: string;
	label: string;
	startDate: string;
	endDate: string;
	totalUsage: number;
	basicCost: number;
	surchargeCost: number;
	totalCost: number;
	isChildRow?: boolean;
	children?: ReportTableRow[];
}

interface ElectricityReportRow extends BaseReportRow {
	peakUsage: number;
	flatUsage: number;
	valleyUsage: number;
	peakCost: number;
	flatCost: number;
	valleyCost: number;
}

interface UtilityReportRow extends BaseReportRow {}

type ReportTableRow = ElectricityReportRow | UtilityReportRow;

const REPORT_YEAR = 2026;
const REPORT_MONTH = 4;
const REPORT_DAYS = 30;
const PAGE_SIZE_OPTIONS = [10, 20, 30, 50];

const reportTabOptions: Array<{ label: string; value: ReportTabKey }> = [
	{ label: '用电明细表', value: 'electricity' },
	{ label: '用水明细表', value: 'water' },
	{ label: '用气明细表', value: 'gas' },
];

const granularityOptions = [
	{ label: '按天分段', value: 'DAY' },
	{ label: '按周分段', value: 'WEEK' },
	{ label: '按月分段', value: 'MONTH' },
];

const timeRangeOptions = [
	{ label: '当月', value: 'CURRENT_MONTH' },
	{ label: '上半月', value: 'FIRST_HALF_MONTH' },
	{ label: '下半月', value: 'SECOND_HALF_MONTH' },
];

const summaryModeOptionsMap: Record<ReportTabKey, Array<{ label: string; value: SummaryModeValue }>> = {
	electricity: [
		{ label: '合计汇总', value: 'TOTAL' },
		{ label: '时段汇总', value: 'PHASE' },
	],
	water: [
		{ label: '合计汇总', value: 'TOTAL' },
		{ label: '阶梯汇总', value: 'LADDER' },
	],
	gas: [
		{ label: '合计汇总', value: 'TOTAL' },
		{ label: '阶梯汇总', value: 'LADDER' },
	],
};

const pageSizeOptions = PAGE_SIZE_OPTIONS;
const message = useMessage();
const storesThemeConfig = useThemeConfig();
const { getLightColor, hexToRgb } = useChangeColor();
const activeTab = ref<ReportTabKey>('electricity');
const currentPage = ref(1);
const pageSize = ref(10);
const exportLoading = ref(false);
const tableLoading = ref(false);
const queryFormRenderKey = ref(0);

let loadingTimer: number | undefined;

const currentTheme = computed(() => storesThemeConfig.themeConfig.currentTheme);
const primaryColor = computed(() => storesThemeConfig.themeConfig.primary || currentTheme.value?.color?.primary?.normal || '#0094FF');
const gradientStart = computed(() => currentTheme.value?.color?.gradient?.start || getLightColor(primaryColor.value, 0.12));
const gradientEnd = computed(() => currentTheme.value?.color?.gradient?.end || primaryColor.value);
const reportThemeVars = computed(() => {
	const primary = primaryColor.value;
	return {
		'--report-primary': primary,
		'--report-primary-rgb': Array.isArray(hexToRgb(primary)) ? hexToRgb(primary).join(',') : '0, 148, 255',
		'--report-gradient-start': gradientStart.value,
		'--report-gradient-end': gradientEnd.value,
	};
});

const createDefaultFilters = (tab: ReportTabKey): FilterState => ({
	granularity: 'DAY',
	timeRange: 'CURRENT_MONTH',
	summaryMode: summaryModeOptionsMap[tab][0].value,
});

const currentFilters = reactive<FilterState>(createDefaultFilters(activeTab.value));

const padNumber = (value: number) => String(value).padStart(2, '0');
const buildDateLabel = (day: number) => `${REPORT_YEAR}-${padNumber(REPORT_MONTH)}-${padNumber(day)}`;
const extractDayNumber = (dateValue: string) => Number(dateValue.slice(-2));

const formatInteger = (value: number) =>
	new Intl.NumberFormat('zh-CN', {
		maximumFractionDigits: 0,
	}).format(value);

const formatCurrency = (value: number) => `¥${formatInteger(value)}`;
const formatTableIntegerColumn = (_row: ReportTableRow, _column: unknown, cellValue: number) => formatInteger(Number(cellValue || 0));

const sleep = (duration = 160) => new Promise<void>((resolve) => window.setTimeout(resolve, duration));

const startTableLoading = () => {
	tableLoading.value = true;
	if (loadingTimer) window.clearTimeout(loadingTimer);
	loadingTimer = window.setTimeout(() => {
		tableLoading.value = false;
	}, 180);
};

const createElectricityRows = (): ElectricityReportRow[] => {
	return Array.from({ length: REPORT_DAYS }, (_, index) => {
		const day = index + 1;
		const dateLabel = buildDateLabel(day);
		const peakUsage = 960 + (day % 5) * 118 + Math.floor(day / 3) * 27;
		const flatUsage = 1450 + (day % 6) * 147 + Math.floor(day / 2) * 18;
		const valleyUsage = 780 + (day % 4) * 96 + Math.floor(day / 4) * 21;
		const totalUsage = peakUsage + flatUsage + valleyUsage;
		const peakCost = 1120 + (day % 5) * 124 + Math.floor(day / 3) * 18;
		const flatCost = 1080 + (day % 6) * 117 + Math.floor(day / 4) * 16;
		const valleyCost = 312 + (day % 4) * 39 + Math.floor(day / 5) * 9;
		const basicCost = 2680 + (day % 7) * 146 + Math.floor(day / 4) * 25;
		const surchargeCost = 268 + (day % 6) * 17 + Math.floor(day / 4) * 6;
		const totalCost = 2920 + (day % 6) * 208 + Math.floor(day / 4) * 34;

		return {
			id: `electricity-${dateLabel}`,
			label: dateLabel,
			startDate: dateLabel,
			endDate: dateLabel,
			peakUsage,
			flatUsage,
			valleyUsage,
			totalUsage,
			peakCost,
			flatCost,
			valleyCost,
			basicCost,
			surchargeCost,
			totalCost,
		};
	});
};

const createUtilityRows = (tab: 'water' | 'gas'): UtilityReportRow[] => {
	return Array.from({ length: REPORT_DAYS }, (_, index) => {
		const day = index + 1;
		const dateLabel = buildDateLabel(day);
		const isWater = tab === 'water';
		const totalUsage = isWater ? 7 + (day % 4) + (day % 6 === 0 ? 1 : 0) : 4 + (day % 3) + (day % 5 === 0 ? 1 : 0);
		const basicCost = isWater ? 24 + (day % 5) * 2 + Math.floor(day / 6) : 13 + (day % 4) * 2 + Math.floor(day / 7);
		const surchargeCost = isWater ? 1 + (day % 4 === 0 ? 1 : 0) : 1 + (day % 6 === 0 ? 1 : 0);
		return {
			id: `${tab}-${dateLabel}`,
			label: dateLabel,
			startDate: dateLabel,
			endDate: dateLabel,
			totalUsage,
			basicCost,
			surchargeCost,
			totalCost: basicCost + surchargeCost,
		};
	});
};

const electricitySourceRows = createElectricityRows();
const waterSourceRows = createUtilityRows('water');
const gasSourceRows = createUtilityRows('gas');

const getSourceRows = (tab: ReportTabKey): ReportTableRow[] => {
	if (tab === 'electricity') return electricitySourceRows;
	if (tab === 'water') return waterSourceRows;
	return gasSourceRows;
};

const filterRowsByTimeRange = <T extends BaseReportRow>(rows: T[], timeRange: TimeRangeValue): T[] => {
	if (timeRange === 'CURRENT_MONTH') return rows;
	return rows.filter((row) => {
		const day = extractDayNumber(row.startDate);
		return timeRange === 'FIRST_HALF_MONTH' ? day <= 15 : day > 15;
	});
};

const getMonthAggregateLabel = (rows: BaseReportRow[]) => {
	const monthLabel = rows[0]?.startDate.slice(0, 7) || '';
	if (!rows.length) return monthLabel;
	if (rows.length <= 15) {
		return `${monthLabel} ${extractDayNumber(rows[0].startDate) <= 15 ? '上半月' : '下半月'}`;
	}
	return monthLabel;
};

const aggregateUtilityRows = (rows: UtilityReportRow[], granularity: GranularityValue, idPrefix: string): UtilityReportRow[] => {
	if (granularity === 'DAY') return rows.map((row) => ({ ...row }));
	if (!rows.length) return [];

	if (granularity === 'WEEK') {
		const weeklyRows: UtilityReportRow[] = [];
		for (let index = 0; index < rows.length; index += 7) {
			const chunk = rows.slice(index, index + 7);
			weeklyRows.push({
				id: `${idPrefix}-week-${index}`,
				label: `${chunk[0].startDate} ~ ${chunk[chunk.length - 1].endDate}`,
				startDate: chunk[0].startDate,
				endDate: chunk[chunk.length - 1].endDate,
				totalUsage: chunk.reduce((sum, item) => sum + item.totalUsage, 0),
				basicCost: chunk.reduce((sum, item) => sum + item.basicCost, 0),
				surchargeCost: chunk.reduce((sum, item) => sum + item.surchargeCost, 0),
				totalCost: chunk.reduce((sum, item) => sum + item.totalCost, 0),
			});
		}
		return weeklyRows;
	}

	return [
		{
			id: `${idPrefix}-month`,
			label: getMonthAggregateLabel(rows),
			startDate: rows[0].startDate,
			endDate: rows[rows.length - 1].endDate,
			totalUsage: rows.reduce((sum, item) => sum + item.totalUsage, 0),
			basicCost: rows.reduce((sum, item) => sum + item.basicCost, 0),
			surchargeCost: rows.reduce((sum, item) => sum + item.surchargeCost, 0),
			totalCost: rows.reduce((sum, item) => sum + item.totalCost, 0),
		},
	];
};

const aggregateElectricityRows = (rows: ElectricityReportRow[], granularity: GranularityValue): ElectricityReportRow[] => {
	if (granularity === 'DAY') return rows.map((row) => ({ ...row }));
	if (!rows.length) return [];

	if (granularity === 'WEEK') {
		const weeklyRows: ElectricityReportRow[] = [];
		for (let index = 0; index < rows.length; index += 7) {
			const chunk = rows.slice(index, index + 7);
			weeklyRows.push({
				id: `electricity-week-${index}`,
				label: `${chunk[0].startDate} ~ ${chunk[chunk.length - 1].endDate}`,
				startDate: chunk[0].startDate,
				endDate: chunk[chunk.length - 1].endDate,
				peakUsage: chunk.reduce((sum, item) => sum + item.peakUsage, 0),
				flatUsage: chunk.reduce((sum, item) => sum + item.flatUsage, 0),
				valleyUsage: chunk.reduce((sum, item) => sum + item.valleyUsage, 0),
				totalUsage: chunk.reduce((sum, item) => sum + item.totalUsage, 0),
				peakCost: chunk.reduce((sum, item) => sum + item.peakCost, 0),
				flatCost: chunk.reduce((sum, item) => sum + item.flatCost, 0),
				valleyCost: chunk.reduce((sum, item) => sum + item.valleyCost, 0),
				basicCost: chunk.reduce((sum, item) => sum + item.basicCost, 0),
				surchargeCost: chunk.reduce((sum, item) => sum + item.surchargeCost, 0),
				totalCost: chunk.reduce((sum, item) => sum + item.totalCost, 0),
			});
		}
		return weeklyRows;
	}

	return [
		{
			id: 'electricity-month',
			label: getMonthAggregateLabel(rows),
			startDate: rows[0].startDate,
			endDate: rows[rows.length - 1].endDate,
			peakUsage: rows.reduce((sum, item) => sum + item.peakUsage, 0),
			flatUsage: rows.reduce((sum, item) => sum + item.flatUsage, 0),
			valleyUsage: rows.reduce((sum, item) => sum + item.valleyUsage, 0),
			totalUsage: rows.reduce((sum, item) => sum + item.totalUsage, 0),
			peakCost: rows.reduce((sum, item) => sum + item.peakCost, 0),
			flatCost: rows.reduce((sum, item) => sum + item.flatCost, 0),
			valleyCost: rows.reduce((sum, item) => sum + item.valleyCost, 0),
			basicCost: rows.reduce((sum, item) => sum + item.basicCost, 0),
			surchargeCost: rows.reduce((sum, item) => sum + item.surchargeCost, 0),
			totalCost: rows.reduce((sum, item) => sum + item.totalCost, 0),
		},
	];
};

const applySummaryMode = (rows: ReportTableRow[], tab: ReportTabKey, summaryMode: SummaryModeValue): ReportTableRow[] => {
	if (summaryMode === 'TOTAL') return rows.map((row) => ({ ...row }));

	if (tab === 'electricity' && summaryMode === 'PHASE') {
		return (rows as ElectricityReportRow[]).map((row, index) => {
			const extraPeakCost = 18 + (index % 4) * 5;
			const extraFlatCost = 14 + (index % 3) * 4;
			const extraValleyCost = 8 + (index % 2) * 3;
			return {
				...row,
				peakCost: row.peakCost + extraPeakCost,
				flatCost: row.flatCost + extraFlatCost,
				valleyCost: row.valleyCost + extraValleyCost,
				totalCost: row.totalCost + extraPeakCost + extraFlatCost + extraValleyCost,
			};
		});
	}

	return (rows as UtilityReportRow[]).map((row, index) => {
		const extraBasicCost = 1 + (index % 3);
		const extraSurchargeCost = index % 2 === 0 ? 1 : 0;
		return {
			...row,
			basicCost: row.basicCost + extraBasicCost,
			surchargeCost: row.surchargeCost + extraSurchargeCost,
			totalCost: row.totalCost + extraBasicCost + extraSurchargeCost,
		};
	});
};

const filteredRows = computed<ReportTableRow[]>(() => {
	const sourceRows = getSourceRows(activeTab.value);
	const timeRangeRows = filterRowsByTimeRange(sourceRows as BaseReportRow[], currentFilters.timeRange);

	if (activeTab.value === 'electricity') {
		const granularityRows = aggregateElectricityRows(timeRangeRows as ElectricityReportRow[], currentFilters.granularity);
		return applySummaryMode(granularityRows, activeTab.value, currentFilters.summaryMode);
	}

	const granularityRows = aggregateUtilityRows(timeRangeRows as UtilityReportRow[], currentFilters.granularity, activeTab.value);
	return applySummaryMode(granularityRows, activeTab.value, currentFilters.summaryMode);
});

const createChildSummaryRow = (row: ReportTableRow): ReportTableRow => ({
	...row,
	id: `${row.id}-summary`,
	label: '合计汇总',
	isChildRow: true,
	children: [],
});

const pagedRows = computed<ReportTableRow[]>(() => {
	const startIndex = (currentPage.value - 1) * pageSize.value;
	return filteredRows.value.slice(startIndex, startIndex + pageSize.value).map((row) => ({
		...row,
		isChildRow: false,
		children: [createChildSummaryRow(row)],
	}));
});

const utilityUsageColumn = computed(() => ({
	prop: 'totalUsage',
	label: activeTab.value === 'water' ? '总用量(m³)' : '总用量(m³)',
}));

const queryFormConfig = computed<QueryFormConfig>(() => ({
	fields: [
		{
			label: '时间颗粒分段',
			value: 'granularity',
			type: 'select',
			selected: true,
			defaultValue: currentFilters.granularity,
		},
		{
			label: '查询时间范围',
			value: 'timeRange',
			type: 'select',
			selected: true,
			defaultValue: currentFilters.timeRange,
		},
		{
			label: '数据汇总方式',
			value: 'summaryMode',
			type: 'select',
			selected: true,
			defaultValue: currentFilters.summaryMode,
		},
	],
	fieldOptions: {
		granularity: granularityOptions,
		timeRange: timeRangeOptions,
		summaryMode: summaryModeOptionsMap[activeTab.value],
	},
}));

const tableHeaderCellStyle = ({ columnIndex }: { columnIndex: number }) => ({
	background: '#fafbfd',
	color: '#5f6b7a',
	fontSize: '13px',
	fontWeight: 400,
	textAlign: columnIndex === 0 ? 'left' : 'center',
});

const tableCellStyle = () => ({
	textAlign: 'left',
});

const getTableRowClassName = ({ row }: { row: ReportTableRow }) => (row.isChildRow ? 'summary-child-row' : 'summary-parent-row');

const getTimeRangeLabel = (value: TimeRangeValue) => timeRangeOptions.find((item) => item.value === value)?.label || '当月';
const getSummaryModeLabel = (value: SummaryModeValue) =>
	summaryModeOptionsMap[activeTab.value].find((item) => item.value === value)?.label || '合计汇总';
const getTabLabel = (value: ReportTabKey) => reportTabOptions.find((item) => item.value === value)?.label || '明细表';

const buildExportContent = (rows: ReportTableRow[]) => {
	if (activeTab.value === 'electricity') {
		const header = [
			'统计项目',
			'峰时用量(kWh)',
			'平时用量(kWh)',
			'谷时用量(kWh)',
			'总用量(kWh)',
			'峰时费用(元)',
			'平时费用(元)',
			'谷时费用(元)',
			'基本费用(元)',
			'附加费用(元)',
			'总费用(元)',
		];
		const body = (rows as ElectricityReportRow[]).map((row) => [
			row.label,
			row.peakUsage,
			row.flatUsage,
			row.valleyUsage,
			row.totalUsage,
			row.peakCost,
			row.flatCost,
			row.valleyCost,
			row.basicCost,
			row.surchargeCost,
			row.totalCost,
		]);
		return [header, ...body];
	}

	const usageLabel = activeTab.value === 'water' ? '总用量(m³)' : '总用量(m³)';
	const header = ['统计项目', usageLabel, '基本费用(元)', '附加费用(元)', '总费用(元)'];
	const body = (rows as UtilityReportRow[]).map((row) => [row.label, row.totalUsage, row.basicCost, row.surchargeCost, row.totalCost]);
	return [header, ...body];
};

const handleSearch = (formData: Partial<FilterState>) => {
	Object.assign(currentFilters, createDefaultFilters(activeTab.value), formData);
	currentPage.value = 1;
	queryFormRenderKey.value += 1;
	startTableLoading();
};

const handleReset = () => {
	Object.assign(currentFilters, createDefaultFilters(activeTab.value));
	currentPage.value = 1;
	queryFormRenderKey.value += 1;
	startTableLoading();
};

const handleTabChange = (tab: ReportTabKey) => {
	if (activeTab.value === tab) return;
	activeTab.value = tab;
	Object.assign(currentFilters, createDefaultFilters(tab));
	currentPage.value = 1;
	queryFormRenderKey.value += 1;
	startTableLoading();
};

const handlePageSizeChange = (size: number) => {
	pageSize.value = size;
	currentPage.value = 1;
	startTableLoading();
};

const handleCurrentPageChange = (page: number) => {
	currentPage.value = page;
	startTableLoading();
};

const handleExport = async () => {
	if (!filteredRows.value.length) {
		message.warning('暂无可导出的报表数据');
		return;
	}

	exportLoading.value = true;
	try {
		await sleep(120);
		const matrix = buildExportContent(filteredRows.value);
		const fileContent = matrix
			.map((row) =>
				row
					.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`)
					.join('\t')
			)
			.join('\n');
		const blob = new Blob([`\ufeff${fileContent}`], {
			type: 'application/vnd.ms-excel;charset=utf-8;',
		});
		handleBlobFile(blob, `${getTabLabel(activeTab.value)}-${getTimeRangeLabel(currentFilters.timeRange)}-${getSummaryModeLabel(currentFilters.summaryMode)}.xls`);
		message.success('导出成功');
	} catch (error) {
		message.error((error as { message?: string })?.message || '导出失败');
	} finally {
		exportLoading.value = false;
	}
};

watch(
	() => filteredRows.value.length,
	(total) => {
		const maxPage = total > 0 ? Math.ceil(total / pageSize.value) : 1;
		if (currentPage.value > maxPage) {
			currentPage.value = 1;
		}
	}
);

onMounted(() => {
	startTableLoading();
});

onBeforeUnmount(() => {
	if (loadingTimer) window.clearTimeout(loadingTimer);
});
</script>

<style scoped lang="scss">
.layout-padding-auto.layout-padding-view {
	padding: 0 !important;
}

.cost-report-scrollbar {
	height: auto;
	min-height: 100%;
	padding: 0;

	:deep(.el-scrollbar__wrap) {
		overflow-x: hidden;
	}
}

.cost-report-page {
	min-height: 100%;
	padding: 0 0 10px;
}

.management-card {
	background: #fff;
	display: flex;
	flex-direction: column;
}

.management-card__content {
	display: flex;
	flex-direction: column;
	gap: 18px;
	padding-top: 0;
}

.report-tabs {
	display: inline-flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 12px;
	align-self: flex-start;
	padding: 0;
	margin-bottom: 20px;
}

.report-tab {
	min-width: 112px;
	height: 36px;
	padding: 0 20px;
	border: 1px solid rgba(var(--report-primary-rgb), 0.14);
	border-radius: 12px;
	background: #ffffff;
	color: var(--theme-text-primaryTitle);
	font-size: 15px;
	font-weight: 700;
	cursor: pointer;
	transition:
		transform 0.2s ease,
		box-shadow 0.2s ease,
		border-color 0.2s ease,
		color 0.2s ease,
		background 0.2s ease;
}

.report-tab:hover {
	transform: translateY(-1px);
	border-color: rgba(var(--report-primary-rgb), 0.24);
	box-shadow: 0 8px 20px rgba(var(--report-primary-rgb), 0.08);
}

.report-tab.is-active {
	border-color: transparent;
	background: linear-gradient(135deg, var(--report-gradient-start), var(--report-gradient-end));
	color: #ffffff;
	box-shadow: none;
}

.report-filter-panel {
	padding: 0;
}

.report-filter-panel :deep(.query-form-body) {
	column-gap: 20px;
	row-gap: 12px;
}

.report-filter-panel :deep(.query-form .condition-value) {
	width: 190px;
}

.report-filter-panel :deep(.query-form .el-form-item) {
	margin-bottom: 0;
}

.report-filter-panel :deep(.query-form .el-form-item:last-child) {
	align-items: center;
}

.report-table-panel {
	border: 1px solid #e8eef5;
	border-radius: 8px;
	overflow: hidden;
	background: #fff;
}

.report-table-panel :deep(.el-table th.el-table__cell) {
	background: #fafbfd !important;
	font-size: 13px;
	font-weight: 400;
	color: #5f6b7a;
	border-right: 1px solid #eef2f7 !important;
}

.report-table-panel :deep(.el-table td.el-table__cell) {
	padding: 11px 0;
	font-size: 13px;
	color: #5f6b7a;
	border-right: 1px solid #eef2f7 !important;
	border-bottom: 1px solid #eef2f7 !important;
}

.report-table-panel :deep(.el-table--border .el-table__cell),
.report-table-panel :deep(.el-table--border th.el-table__cell) {
	border-right: 1px solid #eef2f7 !important;
}

.report-table-panel :deep(.el-table td.el-table__cell:last-child),
.report-table-panel :deep(.el-table th.el-table__cell:last-child) {
	border-right: none !important;
}

.report-table-panel :deep(.el-table__border-left-patch) {
	display: block !important;
	background: #eef2f7;
}

.report-table-panel :deep(.el-table__inner-wrapper::before) {
	height: 1px !important;
	background-color: #eef2f7 !important;
}

.report-table-panel :deep(.el-table__fixed-right::before),
.report-table-panel :deep(.el-table__fixed::before) {
	background-color: #eef2f7 !important;
}

.report-table-panel :deep(.el-table .cell) {
	white-space: nowrap;
}

.report-table-panel :deep(.el-table .el-table__expand-icon) {
	color: #98a2b3;
}

.report-table-panel :deep(.el-table .el-table__expand-icon--expanded) {
	color: #409eff;
}

.report-table-panel :deep(.el-table__empty-block) {
	min-height: 360px;
}

.statistics-item {
	display: inline-flex;
	align-items: center;
	gap: 10px;
}

.statistics-item--child {
	padding-left: 8px;
}

.statistics-item__icons {
	display: inline-flex;
	align-items: center;
	color: #98a2b3;
	font-size: 14px;
}

.statistics-item__label {
	color: #1677ff;
	font-size: 15px;
	font-weight: 600;
}

.statistics-item__label--child {
	color: #303133;
	font-weight: 500;
}

.report-value {
	display: inline-flex;
	align-items: center;
	font-weight: 600;
}

.report-value--primary {
	color: #1677ff;
}

.report-value--warning {
	color: #ff7a00;
}

.report-table-panel :deep(.summary-child-row td.el-table__cell) {
	background: #fff;
}

.pagination-container {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	border-top: 1px solid #eef2f7;
	padding: 12px 14px;
	background: #fff;
}

.pagination-left {
	display: flex;
	align-items: center;
}

.pagination-total {
	font-size: 13px;
	color: #7b8794;
}

.pagination-right {
	margin-left: auto;
}

.report-table-panel :deep(.el-pagination .btn-prev),
.report-table-panel :deep(.el-pagination .btn-next) {
	min-width: 28px;
	height: 28px;
	padding: 0 8px;
	border: 1px solid #dbe3ec;
	color: #98a2b3;
}

.report-table-panel :deep(.el-pagination .el-pager li) {
	min-width: 28px;
	height: 28px;
	line-height: 26px;
	border: 1px solid transparent;
	border-radius: 2px;
	font-size: 13px;
	color: #7b8794;
}

.report-table-panel :deep(.el-pagination .el-pager li.is-active) {
	border-color: #409eff;
	color: #409eff;
	background: #fff;
}

.report-table-panel :deep(.el-pagination .el-select .el-input__wrapper),
.report-table-panel :deep(.el-pagination .el-input__wrapper) {
	box-shadow: 0 0 0 1px #dbe3ec inset;
	border-radius: 2px;
}

@media screen and (max-width: 992px) {
	.report-tabs {
		width: 100%;
	}

	.report-tab {
		padding: 0 18px;
	}

	.report-filter-panel :deep(.query-form .condition-value) {
		width: 170px;
	}

	.pagination-container {
		flex-direction: column;
		align-items: flex-start;
	}

	.pagination-right {
		width: 100%;
		margin-left: 0;
		overflow-x: auto;
	}
}

@media screen and (max-width: 768px) {
	.report-tabs {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		align-self: stretch;
	}

	.report-filter-panel {
		padding: 0;
	}

	.report-filter-panel :deep(.query-form .condition-value) {
		width: 100%;
	}

	.report-tab {
		width: 100%;
		min-width: 0;
	}

	.statistics-item__label {
		font-size: 14px;
	}
}
</style>
