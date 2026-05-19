<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-scrollbar class="quality-analysis-scrollbar">
				<div class="quality-analysis-page" :style="pageVars">
					<section class="quality-toolbar">
						<div class="quality-tabs">
							<button
								v-for="item in qualityTabOptions"
								:key="item.value"
								type="button"
								class="quality-tab"
								:class="{ 'is-active': activeTab === item.value }"
								@click="activeTab = item.value"
							>
								{{ item.label }}
							</button>
						</div>
					</section>

					<section class="metric-grid">
						<article
							v-for="metric in activeMetricCards"
							:key="metric.key"
							class="metric-card"
							:class="{
								'metric-card--power': activeTab === 'power',
								'metric-card--energy': activeTab === 'energy',
								'metric-card--score': Boolean(metric.badge),
							}"
							:style="getMetricCardStyle(metric)"
						>
							<div class="metric-card__content">
								<p class="metric-card__label">{{ metric.label }}</p>
								<div class="metric-card__value">
									<span>{{ metric.value }}</span>
									<small>{{ metric.unit }}</small>
								</div>

								<template v-if="activeTab === 'power'">
									<span v-if="metric.badge" class="metric-card__badge">{{ metric.badge }}</span>
									<div v-else class="metric-card__progress">
										<span :style="{ width: `${metric.progress ?? 0}%` }"></span>
									</div>
								</template>

								<div v-else class="metric-card__rating">
									<el-rate
										:model-value="metric.rating"
										disabled
										allow-half
										:colors="['#f59e0b', '#f59e0b', '#f59e0b']"
										disabled-void-color="#c8d2e5"
									/>
									<span class="metric-card__rating-value">{{ metric.rating?.toFixed(1) }}</span>
								</div>
							</div>

							<div class="metric-card__visual">
								<div class="metric-card__icon-shell">
									<img :src="metric.icon" :alt="metric.label" class="metric-card__icon" />
								</div>
							</div>
						</article>
					</section>

					<template v-if="activeTab === 'power'">
						<section class="content-grid content-grid--power">
							<article class="panel-card">
								<header class="panel-card__header">
									<div class="panel-card__title-block">
										<span class="panel-card__bar"></span>
										<div>
											<h3>电压偏差监测</h3>
											<p>电压偏差(%)</p>
										</div>
									</div>
								</header>
								<v-chart class="panel-chart panel-chart--monitor" :option="voltageDeviationOption" autoresize />
							</article>

							<article class="panel-card">
								<header class="panel-card__header">
									<div class="panel-card__title-block">
										<span class="panel-card__bar"></span>
										<div>
											<h3>频率偏差监测</h3>
											<p>频率偏差(Hz)</p>
										</div>
									</div>
								</header>
								<v-chart class="panel-chart panel-chart--monitor" :option="frequencyDeviationOption" autoresize />
							</article>

							<article class="panel-card">
								<header class="panel-card__header">
									<div class="panel-card__title-block">
										<span class="panel-card__bar"></span>
										<div>
											<h3>三相不平衡度</h3>
											<p>不平衡度(%)</p>
										</div>
									</div>
								</header>
								<v-chart class="panel-chart panel-chart--monitor" :option="imbalanceOption" autoresize />
								<div class="threshold-legend">
									<span class="threshold-legend__item">
										<i class="is-normal"></i>
										不平衡度-正常
									</span>
									<span class="threshold-legend__item">
										<i class="is-warning"></i>
										不平衡度-超限
									</span>
									<span class="threshold-legend__item">
										<i class="is-danger"></i>
										不平衡度-严重超限
									</span>
								</div>
							</article>

							<article class="panel-card">
								<header class="panel-card__header">
									<div class="panel-card__title-block">
										<span class="panel-card__bar"></span>
										<div>
											<h3>功率因数趋势</h3>
											<p>功率因数</p>
										</div>
									</div>
								</header>
								<v-chart class="panel-chart panel-chart--monitor" :option="powerFactorOption" autoresize />
							</article>
						</section>

						<section class="panel-card panel-card--table">
							<header class="panel-card__header panel-card__header--table">
								<div class="panel-card__title-block">
									<span class="panel-card__bar"></span>
									<div>
										<h3>电力质量事件记录</h3>
									</div>
								</div>
							</header>

							<div class="table-shell">
								<el-table
									:data="pagedPowerEventRecords"
									class="power-event-table"
									border
									empty-text="暂无电力质量事件"
									:header-cell-style="tableHeaderCellStyle"
									:cell-style="tableCellStyle"
								>
									<el-table-column prop="eventTime" label="发生时间" min-width="180" />
									<el-table-column prop="eventType" label="事件类型" min-width="150" />
									<el-table-column prop="location" label="位置" min-width="160" />
									<el-table-column prop="monitorValue" label="监测值" min-width="240" />
									<el-table-column prop="standardRange" label="标准范围" min-width="140" />
									<el-table-column prop="monitorInterval" label="监测间隔" min-width="120" />
									<el-table-column prop="impact" label="影响" min-width="260" />
								</el-table>

								<div class="table-pagination">
									<span class="table-pagination__total">共 {{ powerEventRecords.length }} 条</span>
									<el-pagination
										v-model:current-page="powerEventCurrentPage"
										v-model:page-size="powerEventPageSize"
										background
										layout="sizes, prev, pager, next, jumper"
										:page-sizes="pageSizeOptions"
										:total="powerEventRecords.length"
										@current-change="handlePowerEventPageChange"
										@size-change="handlePowerEventPageSizeChange"
									/>
								</div>
							</div>
						</section>
					</template>

					<template v-else>
						<section class="panel-card panel-card--wide">
							<header class="panel-card__header">
								<div class="panel-card__title-block">
									<span class="panel-card__bar"></span>
									<div>
										<h3>用能质量月度评分趋势</h3>
										<p>评分</p>
									</div>
								</div>
							</header>
							<v-chart class="panel-chart panel-chart--wide" :option="energyTrendOption" autoresize />
						</section>

						<section class="content-grid content-grid--energy">
							<article class="panel-card panel-card--diagnosis">
								<header class="panel-card__header">
									<div class="panel-card__title-block">
										<span class="panel-card__bar"></span>
										<div>
											<h3>质量问题诊断</h3>
										</div>
									</div>
								</header>
								<el-scrollbar class="panel-scrollbar">
									<div class="diagnosis-list">
										<article v-for="item in diagnosisRecords" :key="item.id" class="diagnosis-item" :style="getDiagnosisItemStyle(item.tone)">
											<div class="diagnosis-item__marker" :class="`is-${item.tone}`"></div>
											<div class="diagnosis-item__body">
												<div class="diagnosis-item__header">
													<div class="diagnosis-item__title">
														<span class="diagnosis-item__level" :class="`is-${item.tone}`">{{ item.levelLabel }}</span>
														<strong>{{ item.title }}</strong>
													</div>
													<time>{{ item.time }}</time>
												</div>
												<p class="diagnosis-item__desc">{{ item.description }}</p>
											</div>
										</article>
									</div>
								</el-scrollbar>
							</article>

							<article class="panel-card panel-card--suggestion">
								<header class="panel-card__header">
									<div class="panel-card__title-block">
										<span class="panel-card__bar"></span>
										<div>
											<h3>改进建议</h3>
										</div>
									</div>
								</header>
								<el-scrollbar class="panel-scrollbar">
									<div class="suggestion-list">
										<article v-for="item in suggestionRecords" :key="item.id" class="suggestion-card">
											<div class="suggestion-card__icon">✓</div>
											<div class="suggestion-card__body">
												<div class="suggestion-card__header">
													<strong>{{ item.title }}</strong>
													<div class="suggestion-card__tags">
														<span class="suggestion-tag" :class="`is-${item.priorityTone}`">{{ item.priorityLabel }}</span>
														<span class="suggestion-tag is-benefit">{{ item.benefit }}</span>
													</div>
												</div>
												<p>{{ item.description }}</p>
											</div>
										</article>
									</div>
								</el-scrollbar>
							</article>
						</section>

						<section class="panel-card panel-card--report">
							<header class="panel-card__header panel-card__header--table">
								<div class="panel-card__title-block">
									<span class="panel-card__bar"></span>
									<div>
										<h3>质量分析报告</h3>
									</div>
								</div>

								<div class="panel-card__actions">
									<el-button class="report-button" @click="handleGenerateReport">
										<el-icon><Download /></el-icon>
										<span>生成报告</span>
									</el-button>
								</div>
							</header>

							<div class="report-table-shell">
								<table class="quality-report-table">
									<tbody>
										<tr v-for="row in energyReportRows" :key="`${row.leftLabel}-${row.rightLabel}`">
											<th>{{ row.leftLabel }}</th>
											<td>{{ row.leftValue }}</td>
											<th>{{ row.rightLabel }}</th>
											<td>{{ row.rightValue }}</td>
										</tr>
										<tr>
											<th>改进措施</th>
											<td colspan="3">{{ reportImprovementAction }}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</section>
					</template>
				</div>
			</el-scrollbar>
		</div>
	</div>
</template>

<script setup lang="ts" name="qualityAnalysis">
import { computed, ref } from 'vue';
import type { EChartsOption } from 'echarts';
import * as echarts from 'echarts';
import { use } from 'echarts/core';
import { LineChart, BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import VChart from 'vue-echarts';
import { Download } from '@element-plus/icons-vue';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useChangeColor } from '/@/utils/theme';
import { useThemeImage } from '/@/utils/themeImages';
import { handleBlobFile } from '/@/utils/other';
import { useMessage } from '/@/hooks/message';

use([CanvasRenderer, LineChart, BarChart, GridComponent, TooltipComponent, LegendComponent]);

type QualityTabKey = 'power' | 'energy';
type DiagnosisTone = 'critical' | 'warning' | 'info' | 'success';
type SuggestionPriorityTone = 'high' | 'medium' | 'low';

interface MetricCardItem {
	key: string;
	label: string;
	value: string;
	unit: string;
	icon: string;
	accent: string;
	progress?: number;
	badge?: string;
	rating?: number;
}

interface PowerEventRecord {
	id: number;
	eventTime: string;
	eventType: string;
	location: string;
	monitorValue: string;
	standardRange: string;
	monitorInterval: string;
	impact: string;
}

interface DiagnosisRecord {
	id: number;
	levelLabel: string;
	tone: DiagnosisTone;
	title: string;
	description: string;
	time: string;
}

interface SuggestionRecord {
	id: number;
	title: string;
	priorityLabel: string;
	priorityTone: SuggestionPriorityTone;
	benefit: string;
	description: string;
}

interface EnergyReportRow {
	leftLabel: string;
	leftValue: string;
	rightLabel: string;
	rightValue: string;
}

interface ThresholdLine {
	value: number;
	color: string;
}

const qualityTabOptions: Array<{ label: string; value: QualityTabKey }> = [
	{ label: '电力质量', value: 'power' },
	{ label: '用能质量', value: 'energy' },
];

const pageSizeOptions = [10, 20, 50];
const activeTab = ref<QualityTabKey>('power');
const powerEventCurrentPage = ref(1);
const powerEventPageSize = ref(10);

const message = useMessage();
const storesThemeConfig = useThemeConfig();
const { getDarkColor, getLightColor, hexToRgb } = useChangeColor();

const metricCardBackgroundImage = useThemeImage('metricCardBackground');
const powerQualityImage = useThemeImage('powerQuality');
const voltageComplianceRateImage = useThemeImage('voltageComplianceRate');
const frequencyComplianceRateImage = useThemeImage('frequencyComplianceRate');
const powerFactorImage = useThemeImage('powerFactor');
const energyUtilizationEfficiencyImage = useThemeImage('energyUtilizationEfficiency');
const equipmentOperationEfficiencyImage = useThemeImage('equipmentOperationEfficiency');
const energyConsumptionStabilityImage = useThemeImage('energyConsumptionStability');
const peakValleyRateImage = useThemeImage('peakValleyRate');

const currentTheme = computed(() => storesThemeConfig.themeConfig.currentTheme);
const primaryColor = computed(() => storesThemeConfig.themeConfig.primary || currentTheme.value?.color?.primary?.normal || '#1677FF');
const gradientStart = computed(() => currentTheme.value?.color?.gradient?.start || getLightColor(primaryColor.value, 0.15));
const gradientEnd = computed(() => currentTheme.value?.color?.gradient?.end || primaryColor.value);
const chartPalette = computed(() => currentTheme.value?.color?.chart || [primaryColor.value, '#00CAE8', '#F59E0B', '#E8BB19', '#BD74E6']);
const qualityChartPrimaryColor = computed(() => chartPalette.value[0] || primaryColor.value);
const qualityChartSecondaryColor = computed(() => getLightColor(primaryColor.value, 0.22));
const qualityChartPowerFactorColor = computed(() => getDarkColor(qualityChartPrimaryColor.value, 0.06));
const qualityChartWarningColor = computed(() => currentTheme.value?.color?.functional?.warning || '#E98A1D');
const qualityChartDangerColor = computed(() => currentTheme.value?.color?.functional?.error || '#F85A5A');
const qualityChartWarningSoftColor = computed(() => getLightColor(qualityChartWarningColor.value, 0.58));
const qualityChartDangerSoftColor = computed(() => getLightColor(qualityChartDangerColor.value, 0.5));
const qualityChartPrimarySoftColor = computed(() => getLightColor(qualityChartPrimaryColor.value, 0.56));
const energyTrendColorMap = computed(() => ({
	utilization: qualityChartPrimaryColor.value,
	operation: qualityChartSecondaryColor.value,
	stability: chartPalette.value[2] || qualityChartWarningColor.value,
	overall: chartPalette.value[3] || getDarkColor(qualityChartWarningColor.value, 0.08),
}));

const formatRgbString = (color: string) => {
	const rgb = hexToRgb(color);
	return Array.isArray(rgb) ? rgb.join(',') : '22, 119, 255';
};

const alphaColor = (color: string, alpha: number) => {
	const rgb = hexToRgb(color);
	return Array.isArray(rgb) ? `rgba(${rgb.join(',')}, ${alpha})` : color;
};

const pageVars = computed(() => ({
	'--quality-primary': primaryColor.value,
	'--quality-primary-rgb': formatRgbString(primaryColor.value),
	'--quality-gradient-start': gradientStart.value,
	'--quality-gradient-end': gradientEnd.value,
	'--quality-chart-primary': qualityChartPrimaryColor.value,
	'--quality-chart-warning': qualityChartWarningColor.value,
	'--quality-chart-danger': qualityChartDangerColor.value,
	'--quality-metric-card-image': `url("${metricCardBackgroundImage.value}")`,
}));

const powerMetricCards = computed<MetricCardItem[]>(() => [
	{
		key: 'power-score',
		label: '电力质量综合评分',
		value: '92',
		unit: '分',
		icon: powerQualityImage.value,
		accent: '#16A34A',
		badge: '优秀',
	},
	{
		key: 'voltage-rate',
		label: '电压合格率',
		value: '98.5',
		unit: '%',
		icon: voltageComplianceRateImage.value,
		accent: qualityChartPrimaryColor.value,
		progress: 98.5,
	},
	{
		key: 'frequency-rate',
		label: '频率合格率',
		value: '99.8',
		unit: '%',
		icon: frequencyComplianceRateImage.value,
		accent: qualityChartSecondaryColor.value,
		progress: 99.8,
	},
	{
		key: 'power-factor-rate',
		label: '功率因数达标率',
		value: '96.2',
		unit: '%',
		icon: powerFactorImage.value,
		accent: qualityChartPowerFactorColor.value,
		progress: 96.2,
	},
]);

const energyMetricCards = computed<MetricCardItem[]>(() => [
	{
		key: 'energy-utilization-efficiency',
		label: '能源利用效率',
		value: '92',
		unit: '%',
		icon: energyUtilizationEfficiencyImage.value,
		accent: '#327BFF',
		rating: 4.6,
	},
	{
		key: 'equipment-operation-efficiency',
		label: '设备运行效率',
		value: '98.5',
		unit: '%',
		icon: equipmentOperationEfficiencyImage.value,
		accent: '#14C5FF',
		rating: 4.8,
	},
	{
		key: 'energy-consumption-stability',
		label: '能耗稳定性',
		value: '88',
		unit: '%',
		icon: energyConsumptionStabilityImage.value,
		accent: '#F4B000',
		rating: 4.4,
	},
	{
		key: 'peak-valley-rate',
		label: '峰谷差率',
		value: '28',
		unit: '%',
		icon: peakValleyRateImage.value,
		accent: '#FF9F1C',
		rating: 4.5,
	},
]);

const activeMetricCards = computed(() => (activeTab.value === 'power' ? powerMetricCards.value : energyMetricCards.value));

const powerEventRecords: PowerEventRecord[] = [
	{
		id: 1,
		eventTime: '实际时间',
		eventType: '三相不平衡',
		location: '实际设备位置',
		monitorValue: '可见左侧计算方式，最大最小值之差除以三相平均值',
		standardRange: '<4%',
		monitorInterval: '实时',
		impact: '可能导致设备发热、电机损坏、变压器损耗大、保护误动',
	},
	{
		id: 2,
		eventTime: '实际时间',
		eventType: '电压偏差过大',
		location: '实际设备位置',
		monitorValue: '可见左侧计算方式',
		standardRange: '220V±7%',
		monitorInterval: '实时',
		impact: '可能导致低压乏力卡顿、高压烧设备、线路损耗增加',
	},
	{
		id: 3,
		eventTime: '实际时间',
		eventType: '频率偏差过大',
		location: '实际设备位置',
		monitorValue: '表具读数-50',
		standardRange: '0.2Hz',
		monitorInterval: '实时',
		impact: '可能导致电机转速异常、设备振动发热、并网不稳定',
	},
	{
		id: 4,
		eventTime: '实际时间',
		eventType: '功率因数偏低',
		location: '实际设备位置',
		monitorValue: '表具读数',
		standardRange: '0.85',
		monitorInterval: '实时',
		impact: '可能导致无功罚款、电流增大、压降大、浪费容量',
	},
];

const diagnosisRecords: DiagnosisRecord[] = [
	{
		id: 1,
		levelLabel: '严重',
		tone: 'critical',
		title: 'B栋谐波畸变率超标',
		description: '检测到 B 栋配电室谐波畸变率达 8.2%，超过标准值 5%，建议安装谐波治理装置。',
		time: '2025-11-18 12:30:15',
	},
	{
		id: 2,
		levelLabel: '中等',
		tone: 'warning',
		title: '能耗稳定性有待提升',
		description: '近期能耗波动较大，标准差达 15%，建议优化用能计划，平衡高峰时段负载。',
		time: '2025-11-18 11:30:15',
	},
	{
		id: 3,
		levelLabel: '轻微',
		tone: 'info',
		title: '设备运行效率有待提升',
		description: '部分老旧设备运行效率低于月均水平，建议结合运维计划逐步替换高损耗设备。',
		time: '2025-11-18 10:30:15',
	},
	{
		id: 4,
		levelLabel: '已解决',
		tone: 'success',
		title: 'C栋三相不平衡问题已解决',
		description: '通过调整负载分配，三相不平衡度已降至 3.5%，符合标准要求。',
		time: '2025-11-18 10:30:15',
	},
	{
		id: 5,
		levelLabel: '严重',
		tone: 'critical',
		title: '峰谷差率偏高',
		description: '8 月峰谷差率显著升高，需复核峰时段生产计划并优化需量控制策略。',
		time: '2025-11-18 09:20:15',
	},
];

const suggestionRecords: SuggestionRecord[] = [
	{
		id: 1,
		title: '安装谐波治理装置',
		priorityLabel: '优先级:高',
		priorityTone: 'high',
		benefit: '预期提升: 电力质量提升 5 分',
		description: '在 B 栋配电室安装有源滤波器，将谐波畸变率控制在标准范围内。',
	},
	{
		id: 2,
		title: '优化峰谷用电策略',
		priorityLabel: '优先级:中',
		priorityTone: 'medium',
		benefit: '预期提升: 节能率提升 3%',
		description: '结合分时电价与生产排班，降低高峰时段集中用电冲击，平衡全天负载波动。',
	},
	{
		id: 3,
		title: '制定设备维护计划',
		priorityLabel: '优先级:低',
		priorityTone: 'low',
		benefit: '预期提升: 设备效率提升 2%',
		description: '定期检查老旧设备运行状态，及时更换效率低下设备，降低额外损耗。',
	},
	{
		id: 4,
		title: '优化无功补偿配置',
		priorityLabel: '优先级:中',
		priorityTone: 'medium',
		benefit: '预期提升: 功率因数提升 2%',
		description: '复核重点回路补偿容量和投切策略，减少低功率因数时段，稳定关键设备运行。',
	},
];

const energyReportRows: EnergyReportRow[] = [
	{ leftLabel: '报告周期', leftValue: '2024年1月', rightLabel: '综合评分', rightValue: '92分（优秀）' },
	{ leftLabel: '能源利用效率', leftValue: '92% ↑ 2%', rightLabel: '设备运行效率', rightValue: '95% ↑ 1%' },
	{ leftLabel: '能耗稳定性', leftValue: '88% ↑ 3%', rightLabel: '峰谷差率', rightValue: '28% ↓ 5%' },
	{ leftLabel: '发现问题数', leftValue: '3个', rightLabel: '已解决', rightValue: '2个' },
];

const reportImprovementAction = '实施峰谷电价优化、更新老旧设备、加强巡检管理';

const powerEventPageStart = computed(() => (powerEventCurrentPage.value - 1) * powerEventPageSize.value);
const pagedPowerEventRecords = computed(() =>
	powerEventRecords.slice(powerEventPageStart.value, powerEventPageStart.value + powerEventPageSize.value)
);

const handlePowerEventPageChange = (page: number) => {
	powerEventCurrentPage.value = page;
};

const handlePowerEventPageSizeChange = (size: number) => {
	powerEventPageSize.value = size;
	powerEventCurrentPage.value = 1;
};

const getMetricCardStyle = (metric: MetricCardItem) => ({
	'--metric-accent': metric.accent,
	'--metric-accent-soft': alphaColor(metric.accent, 0.16),
	'--metric-accent-strong': alphaColor(metric.accent, 0.28),
});

const getDiagnosisItemStyle = (tone: DiagnosisTone) => {
	const colorMap: Record<DiagnosisTone, string> = {
		critical: currentTheme.value?.color?.functional?.error || '#F85A5A',
		warning: currentTheme.value?.color?.functional?.warning || '#E98A1D',
		info: '#1677FF',
		success: currentTheme.value?.color?.functional?.success || '#46B538',
	};
	const accent = colorMap[tone];
	return {
		'--diagnosis-accent': accent,
		'--diagnosis-accent-soft': alphaColor(accent, 0.14),
	};
};

const fullDayAxis = ['0:00', '2:00', '4:00', '6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
const powerMonitorAxis = fullDayAxis;
const monthlyAxis = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

const voltageDeviationData = [11.0, 6.6, 8.0, 9.7, 7.9, 11.0, 0.2, 5.8, 5.8, 9.6, 6.2, 7.1];
const frequencyDeviationData = [11.0, 6.4, 7.9, 9.6, 7.8, 10.9, 0.0, 5.6, 5.6, 9.5, 6.0, 6.9];
const imbalanceData = [4.5, 2.9, 5.8, 4.5, 2.0, 1.5, 1.0, 2.9, 6.1, 6.5, 11.1, 4.5];
const powerFactorData = [1.0, 0.95, 0.96, 0.98, 0.99, 0.96, 0.99, 0.87, 0.94, 0.94, 0.99, 0.95];

const energyUtilizationTrend = [101, 79, 85, 92, 84, 99, 49, 75, 75, 91, 77, 81];
const equipmentOperationTrend = [48, 18, 39, 67, 52, 67, 35, 94, 49, 66, 50, 55];
const energyStabilityTrend = [81, 58, 65, 74, 64, 80, 29, 55, 55, 73, 56, 61];
const overallScoreTrend = [35, 40, 23, 41, 29, 54, 16, 32, 23, 31, 37, 15];

const buildThresholdMarkLine = (lines: ThresholdLine[]) => ({
	silent: true,
	symbol: ['none', 'arrow'],
	symbolSize: 10,
	label: {
		show: false,
	},
	data: lines.map((item) => ({
		yAxis: item.value,
		lineStyle: {
			color: item.color,
			type: 'dashed',
			width: 1.5,
		},
	})),
});

const createBarGradient = (startColor: string, endColor: string) =>
	new echarts.graphic.LinearGradient(0, 0, 0, 1, [
		{ offset: 0, color: startColor },
		{ offset: 1, color: endColor },
	]);

const energyTrendShadowLayers = [
	{ width: 14, colorAlpha: 0.04, shadowBlur: 24, shadowAlpha: 0.12, shadowOffsetY: 10 },
	{ width: 10, colorAlpha: 0.07, shadowBlur: 16, shadowAlpha: 0.16, shadowOffsetY: 7 },
	{ width: 6, colorAlpha: 0.12, shadowBlur: 8, shadowAlpha: 0.12, shadowOffsetY: 4 },
];

const createEnergyTrendShadowSeries = (seriesName: string, color: string, data: number[]) =>
	energyTrendShadowLayers.map((shadow, index) => ({
		type: 'line' as const,
		name: `${seriesName}-shadow-${index + 1}`,
		smooth: true,
		symbol: 'none',
		silent: true,
		animation: false,
		z: index + 1,
		data,
		lineStyle: {
			width: shadow.width,
			color: alphaColor(color, shadow.colorAlpha),
			shadowBlur: shadow.shadowBlur,
			shadowColor: alphaColor(color, shadow.shadowAlpha),
			shadowOffsetX: 0,
			shadowOffsetY: shadow.shadowOffsetY,
		},
		tooltip: {
			show: false,
		},
	}));

const createImbalanceBarItemStyle = (value: number) => {
	let barStartColor = qualityChartPrimaryColor.value;
	let barEndColor = qualityChartPrimarySoftColor.value;

	if (value > 10) {
		barStartColor = qualityChartDangerColor.value;
		barEndColor = qualityChartDangerSoftColor.value;
	} else if (value > 5) {
		barStartColor = qualityChartWarningColor.value;
		barEndColor = qualityChartWarningSoftColor.value;
	}

	return {
		color: createBarGradient(barStartColor, barEndColor),
		borderRadius: [15, 15, 0, 0],
		borderColor: createBarGradient(alphaColor(barStartColor, 0.32), alphaColor(barEndColor, 0.16)),
		borderWidth: 6,
	};
};

const buildSingleLineChartOption = (config: {
	name: string;
	xAxisData: string[];
	data: number[];
	color: string;
	yAxisName: string;
	min: number;
	max: number;
	thresholds?: ThresholdLine[];
	areaOpacity?: number;
	tooltipFormatter?: (value: number) => string;
	xAxisLabelFormatter?: (value: string, index: number) => string;
}) =>
	({
		grid: {
			left: 54,
			right: 18,
			top: 18,
			bottom: 48,
		},
		tooltip: {
			trigger: 'axis',
			backgroundColor: 'rgba(17, 24, 39, 0.88)',
			borderWidth: 0,
			textStyle: {
				color: '#ffffff',
			},
			formatter: (params: Array<{ axisValue: string; data: number }>) => {
				const point = params[0];
				const valueText = config.tooltipFormatter ? config.tooltipFormatter(point.data) : `${point.data}`;
				return `${point.axisValue}<br/>${config.name}: ${valueText}`;
			},
		},
		legend: {
			bottom: 0,
			icon: 'circle',
			itemWidth: 8,
			itemHeight: 8,
			textStyle: {
				color: '#667085',
				fontSize: 12,
			},
			data: [config.name],
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: config.xAxisData,
			axisLine: {
				lineStyle: {
					color: '#d8e3f0',
				},
			},
			axisTick: {
				show: false,
			},
			axisLabel: {
				color: '#667085',
				formatter: config.xAxisLabelFormatter,
			},
		},
		yAxis: {
			type: 'value',
			min: config.min,
			max: config.max,
			name: config.yAxisName,
			nameTextStyle: {
				color: '#667085',
				padding: [0, 0, 8, 0],
			},
			axisLine: {
				show: false,
			},
			axisTick: {
				show: false,
			},
			axisLabel: {
				color: '#667085',
			},
			splitLine: {
				lineStyle: {
					color: '#d6e1ef',
					type: 'dashed',
				},
			},
		},
		series: [
			{
				name: config.name,
				type: 'line',
				smooth: true,
				data: config.data,
				symbol: 'circle',
				symbolSize: 8,
				showSymbol: true,
				itemStyle: {
					color: '#ffffff',
					borderColor: config.color,
					borderWidth: 2,
				},
				lineStyle: {
					color: config.color,
					width: 2.5,
					shadowColor: alphaColor(config.color, 0.2),
					shadowBlur: 8,
				},
				areaStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{ offset: 0, color: alphaColor(config.color, config.areaOpacity ?? 0.2) },
						{ offset: 1, color: alphaColor(config.color, 0.02) },
					]),
				},
				markLine: config.thresholds?.length ? buildThresholdMarkLine(config.thresholds) : undefined,
			},
		],
	}) as EChartsOption;

const voltageDeviationOption = computed<EChartsOption>(() =>
	buildSingleLineChartOption({
		name: '偏差值',
		xAxisData: powerMonitorAxis,
		data: voltageDeviationData,
		color: qualityChartPrimaryColor.value,
		yAxisName: '电压偏差(%)',
		min: -10,
		max: 15,
		thresholds: [
			{ value: 8, color: qualityChartWarningColor.value },
			{ value: -2.5, color: qualityChartWarningColor.value },
		],
		tooltipFormatter: (value) => `${value.toFixed(1)}%`,
		xAxisLabelFormatter: (value, index) => (index === 0 ? '' : value),
	})
);

const frequencyDeviationOption = computed<EChartsOption>(() =>
	buildSingleLineChartOption({
		name: '偏差值',
		xAxisData: powerMonitorAxis,
		data: frequencyDeviationData,
		color: qualityChartSecondaryColor.value,
		yAxisName: '频率偏差(Hz)',
		min: -10,
		max: 15,
		thresholds: [
			{ value: 8, color: qualityChartWarningColor.value },
			{ value: -2.5, color: qualityChartWarningColor.value },
		],
		tooltipFormatter: (value) => `${value.toFixed(1)}Hz`,
		xAxisLabelFormatter: (value, index) => (index === 0 ? '' : value),
	})
);

const imbalanceOption = computed<EChartsOption>(
	() =>
		({
			grid: {
				left: 54,
				right: 18,
				top: 22,
				bottom: 42,
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow',
				},
				backgroundColor: 'rgba(17, 24, 39, 0.88)',
				borderWidth: 0,
				textStyle: {
					color: '#ffffff',
				},
				formatter: (params: Array<{ axisValue: string; data: number }>) => `${params[0].axisValue}<br/>不平衡度: ${params[0].data.toFixed(1)}%`,
			},
			xAxis: {
				type: 'category',
				data: ['2:00', '4:00', '6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00'],
				axisLine: {
					lineStyle: {
						color: alphaColor(primaryColor.value, 0.18),
					},
				},
				axisTick: {
					show: false,
				},
				axisLabel: {
					color: '#667085',
					margin: 12,
					fontWeight: 600,
				},
			},
			yAxis: {
				type: 'value',
				min: 0,
				max: 14,
				name: '不平衡度(%)',
				nameTextStyle: {
					color: '#667085',
					padding: [0, 0, 8, 0],
				},
				axisLine: {
					show: false,
				},
				axisTick: {
					show: false,
				},
				axisLabel: {
					color: '#667085',
				},
				splitLine: {
					lineStyle: {
						color: 'rgba(206, 214, 229, 0.72)',
						type: 'dashed',
					},
				},
			},
			series: [
				{
					type: 'bar',
					data: imbalanceData.map((value) => ({
						value,
						itemStyle: createImbalanceBarItemStyle(value),
					})),
					barWidth: 24,
					label: {
						show: true,
						position: 'top',
						color: '#5b6577',
						fontSize: 15,
						fontWeight: 700,
						formatter: ({ value }: { value: number }) => value.toFixed(1),
					},
					markLine: buildThresholdMarkLine([
						{ value: 5, color: qualityChartWarningColor.value },
						{ value: 11.5, color: qualityChartDangerColor.value },
					]),
				},
			],
		}) as EChartsOption
);

const powerFactorOption = computed<EChartsOption>(() =>
	buildSingleLineChartOption({
		name: '功率因数',
		xAxisData: fullDayAxis,
		data: powerFactorData,
		color: qualityChartPowerFactorColor.value,
		yAxisName: '功率因数',
		min: 0,
		max: 1.1,
		thresholds: [{ value: 0.9, color: qualityChartPrimaryColor.value }],
		areaOpacity: 0.24,
		tooltipFormatter: (value) => value.toFixed(2),
	})
);

const energyTrendOption = computed<EChartsOption>(
	() =>
		({
			grid: {
				left: 54,
				right: 18,
				top: 22,
				bottom: 54,
			},
			tooltip: {
				trigger: 'axis',
				backgroundColor: 'rgba(17, 24, 39, 0.88)',
				borderWidth: 0,
				textStyle: {
					color: '#ffffff',
				},
				formatter: (params: any) => {
					if (!Array.isArray(params) || !params.length) return '';
					const visibleParams = params.filter((item: any) => !String(item.seriesName || '').includes('-shadow-'));
					const lines = visibleParams.map((item: any) => `${item.marker}${item.seriesName}：${Number(item.data || 0).toFixed(0)}`);
					return `${visibleParams[0]?.axisValue || params[0].axisValue}<br/>${lines.join('<br/>')}`;
				},
			},
			legend: {
				bottom: 0,
				itemWidth: 10,
				itemHeight: 10,
				icon: 'circle',
				textStyle: {
					color: '#667085',
					fontSize: 12,
				},
				data: ['能源利用效率', '设备运行效率', '能耗稳定性', '综合评分'],
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: monthlyAxis,
				axisLine: {
					lineStyle: {
						color: '#d8e3f0',
					},
				},
				axisTick: {
					show: false,
				},
				axisLabel: {
					color: '#667085',
				},
			},
			yAxis: {
				type: 'value',
				min: 0,
				max: 110,
				name: '评分',
				nameTextStyle: {
					color: '#667085',
					padding: [0, 0, 8, 0],
				},
				axisLine: {
					show: false,
				},
				axisTick: {
					show: false,
				},
				axisLabel: {
					color: '#667085',
				},
				splitLine: {
					lineStyle: {
						color: '#d6e1ef',
						type: 'dashed',
					},
				},
			},
			series: [
				...createEnergyTrendShadowSeries('能源利用效率', energyTrendColorMap.value.utilization, energyUtilizationTrend),
				{
					name: '能源利用效率',
					type: 'line',
					smooth: true,
					data: energyUtilizationTrend,
					symbol: 'circle',
					symbolSize: 7,
					itemStyle: { color: '#ffffff', borderColor: energyTrendColorMap.value.utilization, borderWidth: 1.5 },
					lineStyle: { color: energyTrendColorMap.value.utilization, width: 2.5 },
					z: 10,
				},
				...createEnergyTrendShadowSeries('设备运行效率', energyTrendColorMap.value.operation, equipmentOperationTrend),
				{
					name: '设备运行效率',
					type: 'line',
					smooth: true,
					data: equipmentOperationTrend,
					symbol: 'circle',
					symbolSize: 7,
					itemStyle: { color: '#ffffff', borderColor: energyTrendColorMap.value.operation, borderWidth: 1.5 },
					lineStyle: { color: energyTrendColorMap.value.operation, width: 2.5 },
					z: 10,
				},
				...createEnergyTrendShadowSeries('能耗稳定性', energyTrendColorMap.value.stability, energyStabilityTrend),
				{
					name: '能耗稳定性',
					type: 'line',
					smooth: true,
					data: energyStabilityTrend,
					symbol: 'circle',
					symbolSize: 7,
					itemStyle: { color: '#ffffff', borderColor: energyTrendColorMap.value.stability, borderWidth: 1.5 },
					lineStyle: { color: energyTrendColorMap.value.stability, width: 2.5 },
					z: 10,
				},
				...createEnergyTrendShadowSeries('综合评分', energyTrendColorMap.value.overall, overallScoreTrend),
				{
					name: '综合评分',
					type: 'line',
					smooth: true,
					data: overallScoreTrend,
					symbol: 'circle',
					symbolSize: 7,
					itemStyle: { color: '#ffffff', borderColor: energyTrendColorMap.value.overall, borderWidth: 1.5 },
					lineStyle: { color: energyTrendColorMap.value.overall, width: 2.5 },
					z: 10,
				},
			],
		}) as EChartsOption
);

const tableHeaderCellStyle = () => ({
	background: '#f8f9fa',
	color: '#4d5669',
	fontSize: '15px',
	fontWeight: 700,
	height: '58px',
});

const tableCellStyle = () => ({
	color: '#6a7488',
	fontSize: '15px',
	paddingTop: '16px',
	paddingBottom: '16px',
	verticalAlign: 'top',
});

const handleGenerateReport = () => {
	const reportContent = [
		'质量分析报告',
		`报告周期：2024年1月`,
		`生成时间：${new Date().toLocaleString('zh-CN')}`,
		'',
		'一、核心指标',
		'能源利用效率：92% ↑2%',
		'设备运行效率：95% ↑1%',
		'能耗稳定性：88% ↑3%',
		'峰谷差率：28% ↓5%',
		'综合评分：92分（优秀）',
		'',
		'二、问题诊断',
		...diagnosisRecords.map((item, index) => `${index + 1}. [${item.levelLabel}] ${item.title} - ${item.description}`),
		'',
		'三、改进建议',
		...suggestionRecords.map((item, index) => `${index + 1}. ${item.title}（${item.priorityLabel}，${item.benefit}） - ${item.description}`),
		'',
		`四、改进措施：${reportImprovementAction}`,
	].join('\n');

	handleBlobFile(new Blob([reportContent], { type: 'text/plain;charset=utf-8' }), 'quality-analysis-report-2024-01.txt');
	message.success('已生成模拟质量分析报告');
};
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

.quality-analysis-scrollbar {
	height: auto;
	min-height: 100%;
	padding: 0;

	:deep(.el-scrollbar__wrap) {
		overflow-x: hidden;
	}
}

.quality-analysis-page {
	min-height: 100%;
	padding: 8px 0 10px;
	display: flex;
	flex-direction: column;
	gap: 14px;
	background: transparent;
}

.quality-toolbar {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	gap: 16px;
	flex-wrap: wrap;
}

.quality-tabs {
	display: inline-flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 12px;
}

.quality-tab {
	height: 36px;
	padding: 0 18px;
	border: 1px solid rgba(var(--quality-primary-rgb), 0.14);
	border-radius: 12px;
	background: #ffffff;
	color: var(--theme-text-primaryTitle);
	font-size: 14px;
	font-weight: 700;
	cursor: pointer;
	transition:
		transform 0.2s ease,
		box-shadow 0.2s ease,
		border-color 0.2s ease,
		color 0.2s ease;
}

.quality-tab:hover {
	transform: translateY(-1px);
	border-color: rgba(var(--quality-primary-rgb), 0.24);
	box-shadow: 0 10px 24px rgba(var(--quality-primary-rgb), 0.08);
}

.quality-tab.is-active {
	border-color: transparent;
	background: linear-gradient(135deg, var(--quality-gradient-start), var(--quality-gradient-end));
	color: #ffffff;
}

.metric-grid {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 14px;
}

.metric-card {
	position: relative;
	display: grid;
	grid-template-columns: minmax(0, 1fr) 90px;
	align-items: center;
	height: 110px;
	min-height: 0;
	padding: 16px 18px;
	border-radius: 20px;
	background: linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%);
	background-image: var(--quality-metric-card-image);
	background-repeat: no-repeat;
	background-position: center;
	background-size: 100% 100%;
	border: 1px solid rgba(86, 133, 214, 0.08);
	overflow: hidden;
}

.metric-card__content {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	gap: 6px;
	min-width: 0;
}

.metric-card__label {
	margin: 0;
	font-size: 14px;
	font-weight: 700;
	line-height: 1.2;
	color: #293548;
}

.metric-card__value {
	display: flex;
	align-items: flex-end;
	gap: 6px;
	line-height: 1;
}

.metric-card__value span {
	font-size: 24px;
	font-weight: 800;
	letter-spacing: -0.03em;
	color: #233248;
}

.metric-card__value small {
	margin-bottom: 3px;
	font-size: 15px;
	font-weight: 700;
	color: #738198;
}

.metric-card__badge {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: fit-content;
	padding: 4px 10px;
	border-radius: 8px;
	border: 1px solid #46b538;
	background: rgba(70, 181, 56, 0.05);
	color: #46b538;
	font-size: 13px;
	font-weight: 700;
}

.metric-card__progress {
	position: relative;
	width: 100%;
	height: 8px;
	margin-top: 4px;
	border-radius: 999px;
	background: rgba(var(--quality-primary-rgb), 0.12);
	overflow: hidden;
}

.metric-card__progress span {
	display: block;
	height: 100%;
	border-radius: inherit;
	background: linear-gradient(90deg, var(--metric-accent-soft), var(--metric-accent));
	box-shadow: 0 4px 12px var(--metric-accent-strong);
}

.metric-card__rating {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	margin-top: 4px;
}

.metric-card__rating-value {
	font-size: 13px;
	font-weight: 700;
	color: #f59e0b;
}

.metric-card__visual {
	display: flex;
	align-items: center;
	justify-content: flex-end;
}

.metric-card__icon-shell {
	width: 90px;
	height: 90px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.metric-card__icon {
	width: 100%;
	height: 100%;
	object-fit: contain;
	filter: drop-shadow(0 10px 18px var(--metric-accent-soft));
}

.content-grid {
	display: grid;
	gap: 14px;
}

.content-grid--power {
	grid-template-columns: repeat(2, minmax(0, 1fr));
}

.content-grid--energy {
	grid-template-columns: minmax(0, 1.02fr) minmax(0, 1fr);
	align-items: stretch;
}

.panel-card {
	position: relative;
	padding: 22px 24px;
	border-radius: 28px;
	background: #ffffff;
	border: 1px solid rgba(var(--quality-primary-rgb), 0.08);
	overflow: hidden;
}

.panel-card--wide {
	padding-bottom: 18px;
}

.panel-card--table {
	padding: 22px 24px 24px;
}

.panel-card--diagnosis,
.panel-card--suggestion {
	min-height: 412px;
}

.panel-card--report {
	padding-bottom: 22px;
}

.panel-card__header {
	position: relative;
	z-index: 1;
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 16px;
	margin-bottom: 20px;
}

.panel-card__header--table {
	align-items: center;
}

.panel-card__title-block {
	display: flex;
	align-items: flex-start;
	gap: 12px;
	min-width: 0;
}

.panel-card__bar {
	flex: none;
	width: 4px;
	height: 22px;
	border-radius: 999px;
	background: var(--quality-primary);
	box-shadow: 0 4px 10px rgba(var(--quality-primary-rgb), 0.2);
}

.panel-card__title-block h3 {
	margin: 0;
	font-size: 18px;
	font-weight: 700;
	line-height: 1.2;
	color: var(--theme-text-system);
}

.panel-card__title-block p {
	margin: 6px 0 0;
	font-size: 13px;
	color: var(--theme-text-dataAssist);
}

.panel-card__actions {
	display: inline-flex;
	align-items: center;
	gap: 10px;
	flex-wrap: wrap;
}

.panel-chart {
	width: 100%;
}

.panel-chart--monitor {
	height: 250px;
}

.panel-chart--wide {
	height: 260px;
}

.threshold-legend {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-wrap: wrap;
	gap: 18px;
	margin-top: 4px;
}

.threshold-legend__item {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	font-size: 13px;
	color: #667085;
}

.threshold-legend__item i {
	width: 10px;
	height: 10px;
	border-radius: 3px;
	display: inline-block;
}

.threshold-legend__item .is-normal {
	background: var(--quality-chart-primary);
}

.threshold-legend__item .is-warning {
	background: var(--quality-chart-warning);
}

.threshold-legend__item .is-danger {
	background: var(--quality-chart-danger);
}

.table-shell {
	display: flex;
	flex-direction: column;
	gap: 18px;
	background: #ffffff;
	border: 1px solid #e1e9f4;
	border-radius: 16px;
	overflow: hidden;
}

.table-pagination {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	flex-wrap: wrap;
	padding: 0 18px 18px;
}

.table-pagination__total {
	font-size: 16px;
	font-weight: 500;
	color: #586378;
}

.panel-scrollbar {
	height: 336px;

	:deep(.el-scrollbar__wrap) {
		padding-right: 6px;
	}
}

.diagnosis-list,
.suggestion-list {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.diagnosis-list {
	padding-left: 6px;
}

.diagnosis-item {
	position: relative;
	display: flex;
	gap: 16px;
	padding-left: 30px;
}

.diagnosis-item::before {
	content: '';
	position: absolute;
	left: 9px;
	top: 20px;
	bottom: -18px;
	width: 2px;
	background: #e3eaf5;
}

.diagnosis-item:last-child::before {
	display: none;
}

.diagnosis-item__marker {
	position: absolute;
	left: 0;
	top: 10px;
	z-index: 1;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	background: var(--diagnosis-accent);
	box-shadow: 0 0 0 4px var(--diagnosis-accent-soft);
}

.diagnosis-item__marker::after {
	content: '';
	position: absolute;
	top: 50%;
	left: 50%;
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background: #ffffff;
	transform: translate(-50%, -50%);
}

.diagnosis-item__body {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 10px;
	padding: 0 0 14px;
	border-bottom: 1px dashed #e6edf6;
}

.diagnosis-item:last-child .diagnosis-item__body {
	border-bottom: none;
	padding-bottom: 0;
}

.diagnosis-item__header {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 12px;
}

.diagnosis-item__title {
	display: flex;
	align-items: center;
	gap: 10px;
	flex-wrap: wrap;
}

.diagnosis-item__title strong {
	font-size: 16px;
	font-weight: 700;
	color: #253244;
}

.diagnosis-item__header time {
	flex: none;
	font-size: 13px;
	color: #98a2b3;
}

.diagnosis-item__level {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 3px 10px;
	border-radius: 999px;
	font-size: 13px;
	font-weight: 700;
}

.diagnosis-item__level.is-critical {
	color: #ef4444;
	background: rgba(239, 68, 68, 0.08);
}

.diagnosis-item__level.is-warning {
	color: #f59e0b;
	background: rgba(245, 158, 11, 0.08);
}

.diagnosis-item__level.is-info {
	color: #3d8cff;
	background: rgba(61, 140, 255, 0.08);
}

.diagnosis-item__level.is-success {
	color: #16a34a;
	background: rgba(22, 163, 74, 0.08);
}

.diagnosis-item__desc {
	margin: 0;
	font-size: 14px;
	line-height: 1.7;
	color: #667085;
}

.suggestion-card {
	display: flex;
	gap: 14px;
	padding: 18px 18px 16px;
	border-radius: 18px;
	background: linear-gradient(180deg, #f9fbff 0%, #f4f8ff 100%);
	border: 1px solid rgba(var(--quality-primary-rgb), 0.08);
}

.suggestion-card__icon {
	flex: none;
	width: 22px;
	height: 22px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background: linear-gradient(135deg, var(--quality-gradient-start), var(--quality-gradient-end));
	color: #ffffff;
	font-size: 14px;
	font-weight: 700;
}

.suggestion-card__body {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 10px;
	min-width: 0;
}

.suggestion-card__header {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	gap: 16px;
	flex-wrap: wrap;
}

.suggestion-card__header strong {
	font-size: 16px;
	font-weight: 700;
	color: #253244;
}

.suggestion-card__tags {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	flex-wrap: wrap;
	justify-content: flex-start;
}

.suggestion-tag {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	height: 28px;
	padding: 0 10px;
	border-radius: 6px;
	font-size: 13px;
	font-weight: 600;
	border: 1px solid transparent;
	white-space: nowrap;
}

.suggestion-tag.is-high {
	color: #ef4444;
	background: rgba(239, 68, 68, 0.08);
	border-color: rgba(239, 68, 68, 0.24);
}

.suggestion-tag.is-medium {
	color: #f59e0b;
	background: rgba(245, 158, 11, 0.08);
	border-color: rgba(245, 158, 11, 0.24);
}

.suggestion-tag.is-low {
	color: #327bff;
	background: rgba(50, 123, 255, 0.08);
	border-color: rgba(50, 123, 255, 0.24);
}

.suggestion-tag.is-benefit {
	color: #46b538;
	background: rgba(70, 181, 56, 0.08);
	border-color: rgba(70, 181, 56, 0.28);
}

.suggestion-card__body p {
	margin: 0;
	font-size: 14px;
	line-height: 1.7;
	color: #667085;
}

.report-button {
	height: 40px;
	padding: 0 18px;
	border: 1px solid #9aa8bb;
	border-radius: 14px;
	background: #ffffff;
	color: #5b6780;
	font-size: 14px;
	font-weight: 700;
	box-shadow: none;
}

.report-button:hover,
.report-button:focus {
	border-color: #7f90aa;
	color: #44516a;
	background: #ffffff;
}

.report-button :deep(.el-icon) {
	margin-right: 6px;
	font-size: 16px;
}

.report-table-shell {
	border: 1px solid #e6edf6;
	border-radius: 16px;
	overflow: hidden;
}

.quality-report-table {
	width: 100%;
	border-collapse: collapse;
	table-layout: fixed;
}

.quality-report-table th,
.quality-report-table td {
	padding: 18px 20px;
	border-right: 1px solid #e6edf6;
	border-bottom: 1px solid #edf2f8;
	font-size: 15px;
	line-height: 1.5;
}

.quality-report-table th {
	width: 16%;
	background: #f8f9fa;
	text-align: left;
	font-weight: 700;
	color: #4d5669;
}

.quality-report-table td {
	background: #ffffff;
	font-weight: 600;
	color: #5b6577;
}

.quality-report-table tr:last-child th,
.quality-report-table tr:last-child td {
	border-bottom: none;
}

.quality-report-table tr th:last-child,
.quality-report-table tr td:last-child {
	border-right: none;
}

:deep(.metric-card__rating .el-rate) {
	height: auto;
}

:deep(.metric-card__rating .el-rate__icon) {
	font-size: 20px;
	margin-right: 2px;
}

:deep(.power-event-table) {
	--el-table-border-color: #e6edf6;
	--el-table-header-bg-color: #f8f9fa;
	--el-table-row-hover-bg-color: #fafcff;
	--el-table-current-row-bg-color: #fafcff;
	border-top-left-radius: 16px;
	border-top-right-radius: 16px;
}

:deep(.power-event-table::before),
:deep(.power-event-table .el-table__inner-wrapper::before) {
	display: none;
}

:deep(.power-event-table .el-table__row td.el-table__cell:last-child),
:deep(.power-event-table .el-table__header th.el-table__cell:last-child) {
	border-right: none;
}

:deep(.power-event-table .cell) {
	line-height: 1.5;
}

:deep(.table-pagination .el-pagination) {
	gap: 10px;
}

:deep(.table-pagination .el-pagination__sizes .el-input__wrapper) {
	height: 36px;
	border-radius: 4px;
	box-shadow: 0 0 0 1px #e1e9f4 inset;
}

:deep(.table-pagination .btn-prev),
:deep(.table-pagination .btn-next),
:deep(.table-pagination .el-pager li) {
	min-width: 36px;
	height: 36px;
	border: 1px solid #e1e9f4;
	border-radius: 4px;
	background: #ffffff;
	color: #667388;
	box-shadow: none;
}

:deep(.table-pagination .el-pager li.is-active) {
	border-color: #4d8dff;
	color: #4d8dff;
	background: #ffffff;
}

:deep(.table-pagination .el-pagination__jump) {
	margin-left: 6px;
	color: #667388;
}

:deep(.table-pagination .el-pagination__editor.el-input .el-input__wrapper) {
	height: 36px;
	border-radius: 4px;
	box-shadow: 0 0 0 1px #e1e9f4 inset;
}

@media screen and (max-width: 1440px) {
	.metric-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.content-grid--power,
	.content-grid--energy {
		grid-template-columns: minmax(0, 1fr);
	}
}

@media screen and (max-width: 992px) {
	.panel-card--diagnosis,
	.panel-card--suggestion {
		min-height: 0;
	}

	.panel-scrollbar {
		height: auto;
		max-height: 360px;
	}
}

@media screen and (max-width: 768px) {
	.metric-grid {
		grid-template-columns: minmax(0, 1fr);
	}

	.metric-card {
		grid-template-columns: minmax(0, 1fr) 78px;
	}

	.panel-card {
		padding: 18px;
		border-radius: 22px;
	}

	.panel-card__header,
	.suggestion-card__header,
	.diagnosis-item__header {
		flex-direction: column;
		align-items: stretch;
	}

	.panel-chart--monitor,
	.panel-chart--wide {
		height: 240px;
	}

	.table-pagination {
		flex-direction: column;
		align-items: flex-start;
	}

	.quality-report-table,
	.quality-report-table tbody,
	.quality-report-table tr,
	.quality-report-table th,
	.quality-report-table td {
		display: block;
		width: 100%;
	}

	.quality-report-table th,
	.quality-report-table td {
		border-right: none;
	}

	.quality-report-table th {
		border-bottom: none;
		padding-bottom: 8px;
	}

	.quality-report-table td {
		padding-top: 0;
	}
}
</style>
