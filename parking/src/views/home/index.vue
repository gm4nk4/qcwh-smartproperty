<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-scrollbar class="home-dashboard-scrollbar">
				<div class="home-dashboard" :style="dashboardVars">
					<section class="home-toolbar">
						<div class="home-toolbar__tabs">
							<button
								v-for="item in rangeOptions"
								:key="item.value"
								type="button"
								class="home-toolbar__tab"
								:class="{ 'is-active': activeRange === item.value }"
								@click="handleRangeChange(item.value)"
							>
								{{ item.label }}
							</button>
						</div>
						<div v-if="activeRange === 'custom'" class="home-toolbar__picker">
							<el-date-picker
								v-model="customDateRange"
								class="home-toolbar__date-picker"
								type="daterange"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								format="YYYY-MM-DD"
								value-format="YYYY-MM-DD"
								:clearable="false"
								unlink-panels
								@change="handleCustomDateRangeChange"
							/>
						</div>
					</section>

					<section class="metric-grid">
						<article v-for="metric in currentSummaryMetrics" :key="metric.key" class="metric-card" :style="getMetricCardStyle(metric)">
							<div class="metric-card__content">
								<p class="metric-card__label">{{ metric.label }}</p>
								<div class="metric-card__value">
									<span>{{ formatNumber(metric.value) }}</span>
									<small>{{ metric.unit }}</small>
								</div>
								<p class="metric-card__context">{{ metric.context }}</p>
									<div class="metric-card__delta" :class="getDeltaClass(metric.deltaDirection)">
										<span v-if="metric.deltaDirection === 'up'" class="metric-card__triangle-up" aria-hidden="true"></span>
										<el-icon v-else>
											<ArrowDown />
										</el-icon>
										<span class="metric-card__delta-label">同比</span>
										<span class="metric-card__delta-value">{{ metric.deltaDirection === 'up' ? '+' : '-' }}{{ metric.delta.toFixed(1) }}%</span>
									</div>
							</div>
							<div class="metric-card__visual">
								<div class="metric-card__icon-shell">
									<img :src="getMetricImage(metric.key)" :alt="metric.label" class="metric-icon metric-icon--image" />
								</div>
							</div>
						</article>
					</section>

						<section class="home-grid home-grid--primary">
							<article class="panel-card panel-card--trend">
							<header class="panel-card__header">
								<div class="panel-card__title-block">
									<span class="panel-card__bar"></span>
									<div>
										<h3>{{ trendTitle }}</h3>
										<p>当前指标：{{ currentMetricLabel }}</p>
									</div>
								</div>
								<div class="metric-switch">
									<button
										v-for="item in metricTypeOptions"
										:key="item.value"
										type="button"
										class="metric-switch__button"
										:class="{ 'is-active': activeMetricType === item.value }"
										@click="activeMetricType = item.value"
									>
										{{ item.label }}
									</button>
								</div>
							</header>
							<v-chart class="panel-chart panel-chart--trend" :option="trendOption" autoresize />
						</article>

							<article class="panel-card panel-card--structure">
								<header class="panel-card__header">
								<div class="panel-card__title-block">
									<span class="panel-card__bar"></span>
									<div>
										<h3>能耗结构占比</h3>
									</div>
								</div>
								</header>
								<div class="structure-panel">
									<PieChartComponent
										:data="structureChartData"
										title="能耗占比"
										:legend-data="structureLegendNames"
										:still-show-zero-sum="structureHasValue"
									/>
								</div>
							</article>
						</section>

					<section class="home-grid home-grid--secondary">
						<article class="panel-card panel-card--warning">
							<header class="panel-card__header">
								<div class="panel-card__title-block">
									<span class="panel-card__bar"></span>
									<div>
										<h3>实时告警</h3>
									</div>
								</div>
								<button type="button" class="panel-card__link">警告处理</button>
							</header>
							<div class="warning-list" :class="{ 'is-empty': !currentWarnings.length }">
								<div v-if="!currentWarnings.length" class="panel-empty-state panel-empty-state--warning">
									<p class="panel-empty-state__title">暂无实时告警</p>
									<p class="panel-empty-state__desc">当前接口未返回可展示的告警记录。</p>
								</div>
								<div
									v-else
									ref="warningScrollViewportRef"
									class="warning-scroll-viewport"
									@mouseenter="isWarningScrollPaused = true"
									@mouseleave="isWarningScrollPaused = false"
								>
									<div class="warning-scroll-track">
										<div ref="warningScrollContentRef" class="warning-scroll-content">
											<article
												v-for="item in currentWarnings"
												:key="item.id"
												class="warning-item"
												:style="getWarningStyle(item.level)"
											>
												<div class="warning-item__marker"></div>
												<div class="warning-item__content">
													<div class="warning-item__copy">
														<div class="warning-item__head">
															<div class="warning-item__main">
																<img class="warning-item__icon-image" :src="getWarningLevelIcon(item.level)" :alt="`${item.levelLabel}图标`" />
																<span class="warning-item__label">{{ item.levelLabel }}</span>
																<h4>{{ item.title }}</h4>
															</div>
															<time>{{ item.timeText }}</time>
														</div>
														</div>
													</div>
												</article>
										</div>
										<div v-if="warningShouldLoop" class="warning-scroll-content is-clone" aria-hidden="true">
											<article
												v-for="(item, index) in currentWarnings"
												:key="`${item.id}-clone-${index}`"
												class="warning-item"
												:style="getWarningStyle(item.level)"
											>
												<div class="warning-item__marker"></div>
												<div class="warning-item__content">
													<div class="warning-item__copy">
														<div class="warning-item__head">
															<div class="warning-item__main">
																<img class="warning-item__icon-image" :src="getWarningLevelIcon(item.level)" :alt="`${item.levelLabel}图标`" />
																<span class="warning-item__label">{{ item.levelLabel }}</span>
																<h4>{{ item.title }}</h4>
															</div>
															<time>{{ item.timeText }}</time>
														</div>
														</div>
													</div>
												</article>
										</div>
									</div>
								</div>
							</div>
						</article>

						<HorizontalBarChart class="panel-card panel-card--ranking" :yAxisData="rankingYAxisData" :data="rankingSeriesData" :seriesName="currentRankingMetricLabel" :xAxisName="rankingUnitLabel" :valueDigits="2">
							<template #header>
								<div class="panel-card__header panel-card__header--embedded">
									<div class="panel-card__title-block">
										<span class="panel-card__bar"></span>
										<div>
											<h3>{{ rankingTitle }}</h3>
											<p>当前指标：{{ currentRankingMetricLabel }}</p>
										</div>
									</div>
									<div class="metric-switch">
										<button
											v-for="item in metricTypeOptions"
											:key="`ranking-${item.value}`"
											type="button"
											class="metric-switch__button"
											:class="{ 'is-active': activeRankingMetricType === item.value }"
											@click="activeRankingMetricType = item.value"
										>
											{{ item.label }}
										</button>
									</div>
								</div>
							</template>
						</HorizontalBarChart>
					</section>

						<section class="panel-card panel-card--balance">
							<header class="panel-card__header">
								<div class="panel-card__title-block">
									<span class="panel-card__bar"></span>
								<div>
									<h3>数据平衡校核</h3>
								</div>
								</div>
								<div class="balance-overview" :class="`is-${balanceSummaryStatus}`">
									<el-icon>
										<CircleCheckFilled v-if="balanceSummaryStatus === 'success'" />
										<QuestionFilled v-else-if="balanceSummaryStatus === 'processing'" />
										<WarningFilled v-else />
									</el-icon>
									<span>{{ balanceSummary }}</span>
								</div>
							</header>
							<div class="balance-grid">
								<article v-for="item in currentBalanceChecks" :key="item.key" class="balance-card" :style="getBalanceCardStyle(item.status)">
									<div class="balance-card__head">
										<div class="balance-card__title-line">
											<h4>{{ item.label }}</h4>
											<span class="balance-card__status">
												<el-icon>
													<CircleCheckFilled v-if="item.status === 'success'" />
													<QuestionFilled v-else-if="item.status === 'processing'" />
													<WarningFilled v-else />
												</el-icon>
												<span>{{ item.statusLabel }}</span>
											</span>
										</div>
									<el-tooltip placement="top" popper-class="balance-card__help-tooltip">
										<template #content>
											<p>损耗率标准：线路损耗率=(总表-∑分表)/总表×100%。</p>
											<p>电力系统合理损耗为2-5%，供水系统1-3%，燃气系统&lt;2%。</p>
											<p>超标需排查表计故障或管网泄漏。</p>
										</template>
										<button type="button" class="balance-card__help" aria-label="查看校核说明">
											<el-icon><QuestionFilled /></el-icon>
										</button>
									</el-tooltip>
								</div>
								<div class="balance-card__body">
									<div class="balance-card__visual">
										<img :src="getBalanceImage(item.key)" :alt="item.label" class="balance-card__icon" />
									</div>
									<div class="balance-card__stats">
										<div
											v-for="metric in item.metrics"
											:key="`${item.key}-${metric.label}`"
											class="balance-card__stat"
											:class="{ 'is-alert': metric.highlight === 'danger' }"
										>
											<span class="balance-card__stat-label">{{ metric.label }}</span>
											<div class="balance-card__stat-value">
												<strong>{{ formatValue(metric.value, metric.digits ?? 0) }}</strong>
												<small>{{ metric.unit }}</small>
											</div>
										</div>
									</div>
									</div>
								</article>
							</div>
						</section>
				</div>
			</el-scrollbar>
		</div>
	</div>
</template>

<script setup lang="ts" name="home">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import type { EChartsOption } from 'echarts';
import VChart from 'vue-echarts';
import { ArrowDown, CircleCheckFilled, QuestionFilled, WarningFilled } from '@element-plus/icons-vue';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useChangeColor } from '/@/utils/theme';
import { useThemeImage } from '/@/utils/themeImages';
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import PieChartComponent from '/@/components/Chart/pieChart.vue';
import HorizontalBarChart from '/@/components/Chart/horizontalBarChart.vue';
import {
	getDashboardBalanceCheck,
	getDashboardOverview,
	getDashboardRealtimeAlarms,
	type DashboardBalanceCheckData,
	type DashboardBaseParams,
	type DashboardDateType,
	type DashboardMetricType,
	type DashboardOverviewData,
	type DashboardRealtimeAlarmsData,
} from '/@/api/energy/dashboard';
import warningLevelCriticalIcon from '/@/assets/images/warning-level-critical.png';
import warningLevelWarningIcon from '/@/assets/images/warning-level-warning.png';
import warningLevelNoticeIcon from '/@/assets/images/warning-level-notice.png';

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent]);

type RangeKey = 'today' | 'recent7' | 'month' | 'custom';
type MetricKey = 'electricity' | 'water' | 'gas' | 'cost';
type DeltaDirection = 'up' | 'down';
type WarningLevel = 'critical' | 'warning' | 'notice';
type BalanceEnergyKey = 'electricity' | 'water' | 'gas';
type BalanceStatus = 'success' | 'warning' | 'processing';

interface MetricItem {
	key: MetricKey;
	label: string;
	value: number;
	unit: string;
	delta: number;
	deltaDirection: DeltaDirection;
	context: string;
}

interface TrendPoint {
	label: string;
	value: number;
}

interface StructureItem {
	key: string;
	label: string;
	value: number;
	amount: number;
	unit: string;
}

interface WarningItem {
	id: string;
	level: WarningLevel;
	levelLabel: string;
	title: string;
	time: string;
	timeText: string;
}

interface RankingItem {
	label: string;
	value: number;
	unit: string;
	rank: number;
}

interface BalanceItem {
	key: BalanceEnergyKey;
	label: string;
	status: BalanceStatus;
	statusLabel: string;
	metrics: Array<{
		label: string;
		value: number;
		unit: string;
		digits?: number;
		highlight?: 'danger';
	}>;
}

const rangeOptions: Array<{ label: string; value: RangeKey }> = [
	{ label: '今日', value: 'today' },
	{ label: '近7日', value: 'recent7' },
	{ label: '当月', value: 'month' },
	{ label: '自定义', value: 'custom' },
];

type CustomDateRange = [string, string] | [];

const activeRange = ref<RangeKey>('today');
const activeMetricType = ref<DashboardMetricType>('ELECTRICITY');
const activeRankingMetricType = ref<DashboardMetricType>('ELECTRICITY');
const customDateRange = ref<CustomDateRange>([]);
const overviewData = ref<DashboardOverviewData | null>(null);
const rankingOverviewData = ref<DashboardOverviewData | null>(null);
const realtimeAlarmsData = ref<DashboardRealtimeAlarmsData | null>(null);
const balanceCheckData = ref<DashboardBalanceCheckData | null>(null);
const lastPresetRange = ref<Exclude<RangeKey, 'custom'>>('today');

const metricTypeOptions: Array<{ label: string; value: DashboardMetricType }> = [
	{ label: '用电', value: 'ELECTRICITY' },
	{ label: '用水', value: 'WATER' },
	{ label: '费用', value: 'COST' },
];

const rangeToDateTypeMap: Record<RangeKey, DashboardDateType> = {
	today: 'TODAY',
	recent7: 'LAST_7_DAYS',
	month: 'CURRENT_MONTH',
	custom: 'CUSTOM',
};

const trendTitleMap: Record<RangeKey, string> = {
	today: '24小时能耗趋势',
	recent7: '近7日能耗趋势',
	month: '当月能耗趋势',
	custom: '自定义区间能耗趋势',
};

const summaryLabelMap: Record<RangeKey, Record<MetricKey, string>> = {
	today: {
		electricity: '今日用电',
		water: '今日用水',
		gas: '今日用气',
		cost: '今日费用',
	},
	recent7: {
		electricity: '近7日用电',
		water: '近7日用水',
		gas: '近7日用气',
		cost: '近7日费用',
	},
	month: {
		electricity: '当月用电',
		water: '当月用水',
		gas: '当月用气',
		cost: '当月费用',
	},
	custom: {
		electricity: '区间用电',
		water: '区间用水',
		gas: '区间用气',
		cost: '区间费用',
	},
};

const metricTypeLabelMap: Record<DashboardMetricType, string> = {
	ELECTRICITY: '用电',
	WATER: '用水',
	COST: '费用',
};

const warningLevelMap = {
	CRITICAL: 'critical',
	WARNING: 'warning',
	NOTICE: 'notice',
} satisfies Record<string, WarningLevel>;

const structureTypeLabelFallbackMap: Record<string, string> = {
	ac: '空调',
	elevator: '电梯',
	elev: '电梯',
	light: '照明',
	lighting: '照明',
	power: '动力',
	heat: '供热',
	other: '其他',
};

const fallbackStructureTypeOptions: Array<{ label: string; value: string }> = [
	{ label: '空调', value: 'ac' },
	{ label: '电梯', value: 'elevator' },
	{ label: '照明', value: 'light' },
	{ label: '动力', value: 'power' },
	{ label: '供热', value: 'heat' },
	{ label: '其他', value: 'other' },
];

const balanceEnergyKeyMap = {
	ELECTRICITY: 'electricity',
	WATER: 'water',
	GAS: 'gas',
} satisfies Record<string, BalanceEnergyKey>;

const balanceCardMetaList: Array<{ key: BalanceEnergyKey; label: string; unit: string }> = [
	{ key: 'electricity', label: '电力', unit: 'kWh' },
	{ key: 'water', label: '供水', unit: 'm³' },
	{ key: 'gas', label: '燃气', unit: 'm³' },
];

const message = useMessage();
const storesThemeConfig = useThemeConfig();
const { getDarkColor, getLightColor, hexToRgb } = useChangeColor();
const { system_type: systemType, alarm_level: alarmLevelDict } = useDict('system_type', 'alarm_level');
const electricityUsageImage = useThemeImage('electricityUsage');
const waterUsageImage = useThemeImage('waterUsage');
const gasUsageImage = useThemeImage('gasUsage');
const costImage = useThemeImage('cost');
const balanceElectricityImage = useThemeImage('electricity');
const balanceWaterImage = useThemeImage('water');
const balanceGasImage = useThemeImage('naturalGas');
const metricCardBackgroundImage = useThemeImage('metricCardBackground');

let dashboardRequestToken = 0;

const systemTypeOptions = computed<Array<{ label: string; value: string }>>(() => {
	return Array.isArray(systemType.value) ? systemType.value : [];
});

const alarmLevelLabelDict = computed(() => {
	const labelMap = new Map<string, string>();
	const source = Array.isArray(alarmLevelDict.value) ? alarmLevelDict.value : [];
	source.forEach((item) => {
		const rawValue = String(item?.value ?? '').trim();
		const rawLabel = String(item?.label ?? '').trim();
		if (!rawValue) return;
		const label = rawLabel || rawValue;
		labelMap.set(rawValue, label);
		labelMap.set(rawValue.toLowerCase(), label);
	});
	return labelMap;
});

const getAlarmLevelLabel = (levelCode?: string | null, fallback = '提醒') => {
	const rawCode = (levelCode ?? '').trim();
	if (!rawCode) return fallback;
	return alarmLevelLabelDict.value.get(rawCode) || alarmLevelLabelDict.value.get(rawCode.toLowerCase()) || fallback;
};

const normalizeSystemTypeValue = (value?: string | null) => (value ?? '').trim().toLowerCase();

const getSystemTypeLabel = (value?: string | null, fallback?: string) => {
	const normalizedValue = normalizeSystemTypeValue(value);
	const matchedItem = systemTypeOptions.value.find((item) => normalizeSystemTypeValue(item.value) === normalizedValue);
	return matchedItem?.label || structureTypeLabelFallbackMap[normalizedValue] || fallback || normalizedValue || '其他';
};

const structureTypeOptions = computed<Array<{ label: string; value: string }>>(() => {
	const normalizedOptionMap = new Map<string, { label: string; value: string }>();

	systemTypeOptions.value.forEach((item) => {
		const normalizedValue = normalizeSystemTypeValue(item.value);
		if (!normalizedValue || normalizedOptionMap.has(normalizedValue)) return;
		normalizedOptionMap.set(normalizedValue, {
			label: item.label || structureTypeLabelFallbackMap[normalizedValue] || normalizedValue,
			value: normalizedValue,
		});
	});

	return normalizedOptionMap.size ? [...normalizedOptionMap.values()] : fallbackStructureTypeOptions;
});

const formatPickerDate = (date: Date) => {
	const year = date.getFullYear();
	const month = `${date.getMonth() + 1}`.padStart(2, '0');
	const day = `${date.getDate()}`.padStart(2, '0');
	return `${year}-${month}-${day}`;
};

const getRelativeDate = (offset: number) => {
	const date = new Date();
	date.setDate(date.getDate() + offset);
	return formatPickerDate(date);
};

const getMonthStartDate = () => {
	const date = new Date();
	date.setDate(1);
	return formatPickerDate(date);
};

const createCustomDateRangeFromPreset = (range: Exclude<RangeKey, 'custom'>): [string, string] => {
	if (range === 'recent7') return [getRelativeDate(-6), getRelativeDate(0)];
	if (range === 'month') return [getMonthStartDate(), getRelativeDate(0)];
	return [getRelativeDate(0), getRelativeDate(0)];
};

const hasCustomDateRange = computed(
	() => Array.isArray(customDateRange.value) && customDateRange.value.length === 2 && !!customDateRange.value[0] && !!customDateRange.value[1]
);

const formatDashboardBoundary = (date: string, boundary: 'start' | 'end') => `${date} ${boundary === 'start' ? '00:00:00' : '23:59:59'}`;

const handleRangeChange = (range: RangeKey) => {
	if (range === 'custom') {
		if (!hasCustomDateRange.value) {
			customDateRange.value = createCustomDateRangeFromPreset(lastPresetRange.value);
		}
	} else {
		lastPresetRange.value = range;
	}

	activeRange.value = range;
};

const handleCustomDateRangeChange = () => {
	if (activeRange.value !== 'custom' || !hasCustomDateRange.value) return;
	void loadDashboardDataSafely().catch(() => undefined);
};

type OverviewLoadMode = 'all' | 'trend' | 'ranking';

const buildDashboardBaseParams = (): DashboardBaseParams => {
	const dateType = rangeToDateTypeMap[activeRange.value];

	if (dateType === 'CUSTOM') {
		const [startDate, endDate] = customDateRange.value;

		return {
			dateType,
			startTime: formatDashboardBoundary(startDate, 'start'),
			endTime: formatDashboardBoundary(endDate, 'end'),
		};
	}

	return {
		dateType,
	};
};

const createOverviewRequest = (baseParams: DashboardBaseParams, metricType: DashboardMetricType) => {
	return getDashboardOverview({
		...baseParams,
		metricType,
	});
};

const loadDashboardData = async (mode: OverviewLoadMode = 'all') => {
	const requestToken = ++dashboardRequestToken;
	const baseParams = buildDashboardBaseParams();

	if (mode === 'trend') {
		const overviewResponse = await createOverviewRequest(baseParams, activeMetricType.value);
		if (requestToken !== dashboardRequestToken) return;
		overviewData.value = overviewResponse.data;
		if (activeRankingMetricType.value === activeMetricType.value) {
			rankingOverviewData.value = overviewResponse.data;
		}
		return;
	}

	if (mode === 'ranking') {
		if (activeRankingMetricType.value === activeMetricType.value && overviewData.value) {
			rankingOverviewData.value = overviewData.value;
			return;
		}

		const rankingOverviewResponse = await createOverviewRequest(baseParams, activeRankingMetricType.value);
		if (requestToken !== dashboardRequestToken) return;
		rankingOverviewData.value = rankingOverviewResponse.data;
		return;
	}

	const overviewPromise = createOverviewRequest(baseParams, activeMetricType.value);
	const rankingOverviewPromise =
		activeRankingMetricType.value === activeMetricType.value
			? overviewPromise
			: createOverviewRequest(baseParams, activeRankingMetricType.value);

	const [overviewResponse, rankingOverviewResponse, realtimeAlarmsResponse, balanceCheckResponse] = await Promise.all([
		overviewPromise,
		rankingOverviewPromise,
		getDashboardRealtimeAlarms(baseParams),
		getDashboardBalanceCheck(baseParams),
	]);

	if (requestToken !== dashboardRequestToken) return;

	overviewData.value = overviewResponse.data;
	rankingOverviewData.value = rankingOverviewResponse.data;
	realtimeAlarmsData.value = realtimeAlarmsResponse.data;
	balanceCheckData.value = balanceCheckResponse.data;
};

const loadDashboardDataSafely = async (mode: OverviewLoadMode = 'all') => {
	try {
		await loadDashboardData(mode);
	} catch (error: any) {
		message.error(error?.msg || '首页数据加载失败');
		throw error;
	}
};

watch(
	activeRange,
	(nextValue) => {
		if (nextValue === 'custom' && !hasCustomDateRange.value) return;
		void loadDashboardDataSafely('all').catch(() => undefined);
	},
	{ immediate: true }
);

watch(activeMetricType, () => {
	if (activeRange.value === 'custom' && !hasCustomDateRange.value) return;
	void loadDashboardDataSafely('trend').catch(() => undefined);
});

watch(activeRankingMetricType, () => {
	if (activeRange.value === 'custom' && !hasCustomDateRange.value) return;
	void loadDashboardDataSafely('ranking').catch(() => undefined);
});

const currentTheme = computed(() => storesThemeConfig.themeConfig.currentTheme);
const primaryColor = computed(() => storesThemeConfig.themeConfig.primary || currentTheme.value?.color?.primary?.normal || '#1677FF');
const gradientStart = computed(() => currentTheme.value?.color?.gradient?.start || getLightColor(primaryColor.value, 0.12));
const gradientEnd = computed(() => currentTheme.value?.color?.gradient?.end || primaryColor.value);
const chartPalette = computed(() => currentTheme.value?.color?.chart || [primaryColor.value, '#00CAE8', '#E98A1D', '#E8BB19', '#BD74E6']);
const functionalColors = computed(() => currentTheme.value?.color?.functional || { error: '#F85A5A', warning: '#E98A1D', success: '#46B538' });

const toRgba = (color: string, alpha: number) => {
	const rgb = hexToRgb(color);
	if (!Array.isArray(rgb)) return color;
	return `rgba(${rgb.join(',')}, ${alpha})`;
};

const metricAccentColors = computed<Record<MetricKey, string>>(() => ({
	electricity: primaryColor.value,
	water: getLightColor(primaryColor.value, 0.14),
	gas: getDarkColor(primaryColor.value, 0.08),
	cost: getDarkColor(primaryColor.value, 0.18),
}));

const getMetricImage = (key: MetricKey) => {
	const imageMap: Record<MetricKey, string> = {
		electricity: electricityUsageImage.value,
		water: waterUsageImage.value,
		gas: gasUsageImage.value,
		cost: costImage.value,
	};

	return imageMap[key];
};

const createMetricCardItem = (key: MetricKey, label: string, item: DashboardOverviewData['summary']['electricity']): MetricItem => ({
	key,
	label,
	value: item.currentValue,
	unit: item.unit,
	delta: Math.abs(item.yoyRate ?? 0),
	deltaDirection: (item.yoyRate ?? 0) >= 0 ? 'up' : 'down',
	context: item.yoyValue === null ? '暂无同比基准' : `同比基准 ${formatNumber(item.yoyValue)} ${item.unit}`,
});

const currentSummaryMetrics = computed<MetricItem[]>(() => {
	if (!overviewData.value) return [];

	const currentLabels = summaryLabelMap[activeRange.value];
	const { summary } = overviewData.value;

	return [
		createMetricCardItem('electricity', currentLabels.electricity, summary.electricity),
		createMetricCardItem('water', currentLabels.water, summary.water),
		createMetricCardItem('gas', currentLabels.gas, summary.gas),
		createMetricCardItem('cost', currentLabels.cost, summary.cost),
	];
});

const currentMetricLabel = computed(() => metricTypeLabelMap[activeMetricType.value]);
const currentRankingMetricLabel = computed(() => metricTypeLabelMap[activeRankingMetricType.value]);
const trendTitle = computed(() => trendTitleMap[activeRange.value]);
const currentTrendPoints = computed<TrendPoint[]>(() =>
	overviewData.value?.energyTrend.points.map((item) => ({
		label: item.time,
		value: item.value,
	})) ?? []
);
const currentTrendUnit = computed(() => overviewData.value?.energyTrend.unit ?? '');

const structureItems = computed<StructureItem[]>(() => {
	const rawItems = overviewData.value?.energyComposition.items ?? [];
	const structureUnit = overviewData.value?.spaceEnergyRanking.unit || 'kWh';
	const structureTypeValueSet = new Set(structureTypeOptions.value.map((item) => item.value));
	const rawItemMap = new Map(rawItems.map((item) => [normalizeSystemTypeValue(item.categoryCode), item]));

	const fixedItems = structureTypeOptions.value.map((item) => {
		const matchedItem = rawItemMap.get(item.value);
		return {
			key: item.value,
			label: item.label,
			value: matchedItem?.ratio ?? 0,
			amount: matchedItem?.value ?? 0,
			unit: structureUnit,
		};
	});

	const extraItems = rawItems
		.filter((item) => !structureTypeValueSet.has(normalizeSystemTypeValue(item.categoryCode)))
		.map((item) => ({
			key: normalizeSystemTypeValue(item.categoryCode) || item.categoryName || 'other',
			label: getSystemTypeLabel(item.categoryCode, item.categoryName),
			value: item.ratio,
			amount: item.value,
			unit: structureUnit,
		}));

	return [...fixedItems, ...extraItems];
});

const currentWarnings = computed<WarningItem[]>(() =>
	realtimeAlarmsData.value?.records.map((item) => ({
		id: item.id,
		level: warningLevelMap[item.level],
		levelLabel: getAlarmLevelLabel(item.alarmLevel, item.levelName || '提醒'),
		title: item.content,
		time: item.alarmTime,
		timeText: item.alarmTime || '时间待补充',
	})) ?? []
);

const warningScrollViewportRef = ref<HTMLElement | null>(null);
const warningScrollContentRef = ref<HTMLElement | null>(null);
const warningShouldLoop = ref(false);
const isWarningScrollPaused = ref(false);

const WARNING_SCROLL_SPEED = 28;

let warningScrollFrameId = 0;
let warningScrollPreviousTimestamp = 0;

const stopWarningScroll = () => {
	if (warningScrollFrameId) {
		window.cancelAnimationFrame(warningScrollFrameId);
		warningScrollFrameId = 0;
	}
	warningScrollPreviousTimestamp = 0;
};

const runWarningScroll = (timestamp: number) => {
	const viewport = warningScrollViewportRef.value;
	const content = warningScrollContentRef.value;

	if (!viewport || !content || !warningShouldLoop.value) {
		stopWarningScroll();
		return;
	}

	if (!warningScrollPreviousTimestamp) {
		warningScrollPreviousTimestamp = timestamp;
	}

	const elapsed = timestamp - warningScrollPreviousTimestamp;
	warningScrollPreviousTimestamp = timestamp;

	if (!isWarningScrollPaused.value) {
		viewport.scrollTop += (WARNING_SCROLL_SPEED * elapsed) / 1000;

		if (viewport.scrollTop >= content.scrollHeight) {
			viewport.scrollTop -= content.scrollHeight;
		}
	}

	warningScrollFrameId = window.requestAnimationFrame(runWarningScroll);
};

const startWarningScroll = () => {
	if (warningScrollFrameId || !warningShouldLoop.value) return;
	warningScrollFrameId = window.requestAnimationFrame(runWarningScroll);
};

const syncWarningScroll = async () => {
	await nextTick();

	const viewport = warningScrollViewportRef.value;
	const content = warningScrollContentRef.value;

	if (!viewport || !content || !currentWarnings.value.length) {
		warningShouldLoop.value = false;
		stopWarningScroll();
		return;
	}

	const shouldLoop = currentWarnings.value.length > 1 && content.scrollHeight > viewport.clientHeight + 1;

	if (warningShouldLoop.value !== shouldLoop) {
		warningShouldLoop.value = shouldLoop;
		await nextTick();
	}

	const latestViewport = warningScrollViewportRef.value;
	const latestContent = warningScrollContentRef.value;

	if (!latestViewport || !latestContent) {
		stopWarningScroll();
		return;
	}

	latestViewport.scrollTop = 0;

	if (!shouldLoop) {
		stopWarningScroll();
		return;
	}

	stopWarningScroll();
	startWarningScroll();
};

watch(currentWarnings, () => {
	void syncWarningScroll();
});

onMounted(() => {
	void syncWarningScroll();
	window.addEventListener('resize', syncWarningScroll);
});

onBeforeUnmount(() => {
	stopWarningScroll();
	window.removeEventListener('resize', syncWarningScroll);
});

const currentRankings = computed<RankingItem[]>(() =>
	[...(rankingOverviewData.value?.spaceEnergyRanking.items ?? [])]
		.sort((a, b) => a.rank - b.rank)
		.map((item) => ({
			label: item.spaceName,
			value: item.value,
			unit: rankingOverviewData.value?.spaceEnergyRanking.unit ?? '',
			rank: item.rank,
		}))
);

const currentBalanceChecks = computed<BalanceItem[]>(() =>
	balanceCardMetaList.map((meta) => {
		const matchedItem = (balanceCheckData.value?.items ?? []).find((item) => balanceEnergyKeyMap[item.energyType] === meta.key);

		if (!matchedItem) {
			return {
				key: meta.key,
				label: meta.label,
				status: 'processing',
				statusLabel: '暂无数据',
				metrics: [
					{ label: '总读表数', value: 0, unit: meta.unit },
					{ label: '分表总计', value: 0, unit: meta.unit },
					{ label: '线路损耗', value: 0, unit: '%', digits: 2 },
				],
			};
		}

		return {
			key: meta.key,
			label: matchedItem.energyName,
			status: matchedItem.status === 'NORMAL' ? 'success' : 'warning',
			statusLabel: matchedItem.status === 'NORMAL' ? '平衡' : '待复核',
			metrics: [
				{ label: '总读表数', value: matchedItem.mainMeterValue, unit: matchedItem.unit },
				{ label: '分表总计', value: matchedItem.subMeterTotalValue, unit: matchedItem.unit },
				{
					label: '线路损耗',
					value: matchedItem.lineLossRate,
					unit: '%',
					digits: 2,
					highlight: matchedItem.status === 'ABNORMAL' ? 'danger' : undefined,
				},
			],
		};
	})
);

const missingBalanceCheckCount = computed(() => currentBalanceChecks.value.filter((item) => item.status === 'processing').length);

const dashboardVars = computed(() => {
	const primary = primaryColor.value;
	const isGreenSkin = storesThemeConfig.themeConfig.skin === 'light-green';
	return {
		'--dashboard-primary': primary,
		'--dashboard-primary-deep': getDarkColor(primary, 0.12),
		'--dashboard-primary-soft': getLightColor(primary, 0.84),
		'--dashboard-primary-softer': getLightColor(primary, 0.92),
		'--dashboard-metric-card-image': `url("${metricCardBackgroundImage.value}")`,
		'--dashboard-primary-rgb': Array.isArray(hexToRgb(primary)) ? hexToRgb(primary).join(',') : '0, 148, 255',
		'--dashboard-gradient-start': gradientStart.value,
		'--dashboard-gradient-end': gradientEnd.value,
		'--dashboard-chart-0': chartPalette.value[0],
		'--dashboard-chart-1': chartPalette.value[1],
		'--dashboard-chart-2': chartPalette.value[2],
		'--dashboard-chart-3': chartPalette.value[3],
		'--dashboard-chart-4': chartPalette.value[4],
		'--dashboard-title-bar-color': isGreenSkin ? '#4BA6A9' : '#1677FF',
		'--dashboard-title-bar-shadow': isGreenSkin
			? '0px 4px 10px 0px rgba(75,166,169,0.2)'
			: '0px 4px 10px 0px rgba(0, 148, 255, 0.2)',
		'--dashboard-balance-topbar-color': isGreenSkin ? '#4BA6A9' : '#1677FF',
		'--dashboard-balance-topbar-shadow': isGreenSkin
			? '0px 4px 10px 0px rgba(75,166,169,0.22)'
			: '0px 4px 10px 0px rgba(22,119,255,0.18)',
		'--dashboard-warning-link-color': isGreenSkin ? '#4BA6A9' : '#3F8DFF',
		'--dashboard-warning-link-hover-color': isGreenSkin ? '#2F9FA8' : '#2F7BE8',
	};
});

const structureChartData = computed(() =>
	structureItems.value.map((item) => ({
		value: item.amount,
		name: item.label,
	}))
);

const structureLegendNames = computed(() => structureItems.value.map((item) => item.label));
const structureHasValue = computed(() => structureItems.value.some((item) => item.amount > 0));

const balanceSummaryStatus = computed<BalanceStatus>(() => {
	const abnormalCount = balanceCheckData.value?.items.filter((item) => item.status === 'ABNORMAL').length ?? 0;
	if (abnormalCount > 0) return 'warning';
	if (missingBalanceCheckCount.value > 0) return 'processing';
	return 'success';
});

const balanceSummary = computed(() => {
	const abnormalCount = balanceCheckData.value?.items.filter((item) => item.status === 'ABNORMAL').length ?? 0;
	const missingCount = missingBalanceCheckCount.value;

	if (!balanceCheckData.value || !balanceCheckData.value.items.length) return '当前暂无校核数据';
	if (abnormalCount > 0 && missingCount > 0) return `有 ${abnormalCount} 项待复核，${missingCount} 项待补充`;
	if (abnormalCount > 0) return `有 ${abnormalCount} 项数据待复核`;
	if (missingCount > 0) return `有 ${missingCount} 项校核数据待补充`;
	return '所有数据平衡正常';
});

const formatNumber = (value: number) => {
	return new Intl.NumberFormat('zh-CN', {
		maximumFractionDigits: 0,
	}).format(value);
};

const formatValue = (value: number, digits = 0) => {
	return new Intl.NumberFormat('zh-CN', {
		maximumFractionDigits: digits,
		minimumFractionDigits: digits,
	}).format(value);
};

const getDeltaClass = (direction: DeltaDirection) => {
	return direction === 'up' ? 'is-up' : 'is-down';
};

const getMetricCardStyle = (metric: MetricItem) => {
	const accent = metricAccentColors.value[metric.key];
	return {
		'--metric-accent': accent,
		'--metric-soft': toRgba(accent, 0.18),
		'--metric-accent-soft': toRgba(accent, 0.14),
		'--metric-accent-softer': toRgba(accent, 0.08),
		'--metric-outline': toRgba(accent, 0.28),
		color: accent,
	};
};

const getWarningStyle = (level: WarningLevel) => {
	const colorMap: Record<WarningLevel, string> = {
		critical: functionalColors.value.error,
		warning: functionalColors.value.warning,
		notice: '#1677FF',
	};
	const accent = colorMap[level];
	return {
		'--warning-accent': accent,
		'--warning-accent-soft': toRgba(accent, 0.14),
	};
};

const getWarningLevelIcon = (level: WarningLevel) => {
	const iconMap: Record<WarningLevel, string> = {
		critical: warningLevelCriticalIcon,
		warning: warningLevelWarningIcon,
		notice: warningLevelNoticeIcon,
	};
	return iconMap[level];
};

const getBalanceImage = (key: BalanceEnergyKey) => {
	const imageMap: Record<BalanceEnergyKey, string> = {
		electricity: balanceElectricityImage.value,
		water: balanceWaterImage.value,
		gas: balanceGasImage.value,
	};

	return imageMap[key];
};

const getBalanceCardStyle = (status: BalanceStatus) => {
	const colorMap: Record<BalanceStatus, string> = {
		success: functionalColors.value.success,
		warning: functionalColors.value.warning,
		processing: primaryColor.value,
	};
	const accent = colorMap[status];
	return {
		'--balance-accent': accent,
		'--balance-accent-soft': toRgba(accent, 0.1),
		'--balance-accent-border': toRgba(accent, 0.22),
	};
};

const trendLineColor = computed(() => {
	return storesThemeConfig.themeConfig.skin === 'light-green' ? '#4BA6A9' : primaryColor.value;
});
const trendAreaGradientStops = computed(() => {
	if (storesThemeConfig.themeConfig.skin === 'light-green') {
		return [
			{ offset: 0, color: 'rgba(75,166,169,0.3)' },
			{ offset: 1, color: 'rgba(75,166,169,0.05)' },
		];
	}

	return [
		{ offset: 0, color: toRgba(trendLineColor.value, 0.3) },
		{ offset: 1, color: toRgba(trendLineColor.value, 0.05) },
	];
});
const trendLineShadowLayers = [
	{ shadowBlur: 3, shadowOffsetY: 3 },
	{ shadowBlur: 9, shadowOffsetY: 6 },
	{ shadowBlur: 18, shadowOffsetY: 9 },
];
const rankingTitle = computed(() => '空间能耗排名');
const rankingUnitLabel = computed(() => currentRankings.value[0]?.unit ?? '');
const rankingYAxisData = computed(() => currentRankings.value.map((item) => item.label));
const rankingSeriesData = computed(() => currentRankings.value.map((item) => item.value));

const trendOption = computed<EChartsOption>(() => ({
	tooltip: {
		trigger: 'axis',
		backgroundColor: 'rgba(15, 23, 42, 0.92)',
		borderWidth: 0,
		padding: [10, 14],
		textStyle: {
			color: '#ffffff',
		},
		formatter: (params: any) => {
			const point = Array.isArray(params) ? params.find((item: any) => item.seriesName === '能耗') || params[0] : params;
			return `${point.axisValue}<br/>${currentMetricLabel.value}：${formatNumber(point.data)} ${currentTrendUnit.value}`;
		},
	},
	grid: {
		left: 16,
		right: 16,
		top: 28,
		bottom: 18,
		containLabel: true,
	},
	xAxis: {
		type: 'category',
		boundaryGap: false,
		data: currentTrendPoints.value.map((item) => item.label),
		axisLine: {
			lineStyle: {
				color: toRgba(primaryColor.value, 0.18),
			},
		},
		axisTick: {
			show: false,
		},
		axisLabel: {
			color: '#7B8794',
			margin: 12,
		},
	},
	yAxis: {
		type: 'value',
		splitLine: {
			lineStyle: {
				color: 'rgba(206, 214, 229, 0.72)',
				type: 'dashed',
			},
		},
		axisLine: {
			show: false,
		},
		axisTick: {
			show: false,
		},
		axisLabel: {
			color: '#7B8794',
		},
	},
	series: [
		...trendLineShadowLayers.map((shadow, index) => ({
			type: 'line',
			name: `能耗阴影-${index + 1}`,
			smooth: true,
			symbol: 'none',
			silent: true,
			animation: false,
			z: index + 1,
			data: currentTrendPoints.value.map((item) => item.value),
			lineStyle: {
				width: 4,
				color: toRgba(trendLineColor.value, 0.01),
				shadowBlur: shadow.shadowBlur,
				shadowColor: toRgba(trendLineColor.value, 0.4),
				shadowOffsetX: 0,
				shadowOffsetY: shadow.shadowOffsetY,
			},
			tooltip: {
				show: false,
			},
		})),
		{
			name: '能耗',
			type: 'line',
			smooth: true,
			symbol: 'circle',
			symbolSize: 8,
			z: 10,
			data: currentTrendPoints.value.map((item) => item.value),
			lineStyle: {
				width: 4,
				color: trendLineColor.value,
			},
			itemStyle: {
				color: '#ffffff',
				borderColor: trendLineColor.value,
				borderWidth: 2,
			},
			areaStyle: {
				color: {
					type: 'linear',
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: trendAreaGradientStops.value,
				},
			},
		},
	],
}));

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

.home-dashboard-scrollbar {
	height: auto;
	min-height: 100%;
	padding: 0;

	:deep(.el-scrollbar__wrap) {
		overflow-x: hidden;
	}
}

.home-dashboard {
	min-height: 100%;
	padding: 8px 0 10px;
	display: flex;
	flex-direction: column;
	gap: 20px;
	background: transparent;
}

.home-toolbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	flex-wrap: wrap;
	min-height: 36px;
}

.home-toolbar__tabs {
	display: inline-flex;
	flex-wrap: wrap;
	gap: 14px;
	flex: 1;
	min-width: 0;
}

.home-toolbar__tab {
	width: 108px;
	min-width: 108px;
	height: 36px;
	padding: 0;
	border: 1px solid rgba(var(--dashboard-primary-rgb), 0.14);
	border-radius: 12px;
	background: #ffffff;
	color: var(--theme-text-primaryTitle);
	font-size: 16px;
	font-weight: 700;
	cursor: pointer;
	transition:
		transform 0.2s ease,
		box-shadow 0.2s ease,
		border-color 0.2s ease,
		color 0.2s ease;
}

.home-toolbar__tab:hover {
	transform: translateY(-1px);
	border-color: rgba(var(--dashboard-primary-rgb), 0.24);
	box-shadow: 0 10px 24px rgba(var(--dashboard-primary-rgb), 0.08);
}

.home-toolbar__tab.is-active {
	border-color: transparent;
	background: linear-gradient(135deg, var(--dashboard-gradient-start), var(--dashboard-gradient-end));
	color: #ffffff;
	box-shadow: none;
}

.home-toolbar__picker {
	display: flex;
	justify-content: flex-end;
	flex: none;
	margin-left: auto;
	align-items: center;
}

.home-toolbar__date-picker {
	width: 320px;
	max-width: 100%;
}

:deep(.home-toolbar__date-picker.el-date-editor) {
	height: 36px;
}

:deep(.home-toolbar__date-picker .el-input__wrapper) {
	min-height: 36px;
	padding: 0 12px;
	border-radius: 12px;
	box-shadow: 0 0 0 1px rgba(var(--dashboard-primary-rgb), 0.14) inset;
}

:deep(.home-toolbar__date-picker .el-range__icon),
:deep(.home-toolbar__date-picker .el-range__close-icon) {
	font-size: 14px;
	color: #8b95a4;
}

:deep(.home-toolbar__date-picker .el-range-separator) {
	color: #8b95a4;
	line-height: 1;
}

:deep(.home-toolbar__date-picker .el-range-input) {
	font-size: 14px;
	font-weight: 600;
	color: var(--theme-text-primaryTitle);
}

.home-toolbar__meta {
	display: flex;
	align-items: center;
	gap: 12px;
	flex-wrap: wrap;
}

.home-toolbar__meta-label {
	color: var(--theme-text-dataAssist);
	font-size: 13px;
}

.home-toolbar__meta-badge {
	padding: 10px 16px;
	border-radius: 999px;
	background: rgba(var(--dashboard-primary-rgb), 0.08);
	color: var(--dashboard-primary);
	font-size: 13px;
	font-weight: 700;
}

.metric-grid {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	width: 100%;
	align-items: stretch;
	gap: clamp(12px, 0.83333vw, 16px);
}

.metric-card {
	position: relative;
	display: grid;
	grid-template-columns: minmax(0, 1fr) 90px;
	align-items: center;
	height: 110px;
	padding: clamp(14px, 0.83333vw, 16px) clamp(16px, 1.04167vw, 20px);
	border-radius: clamp(16px, 1.04167vw, 20px);
	background-color: #ffffff;
	background-image: var(--dashboard-metric-card-image);
	background-repeat: no-repeat;
	background-position: center;
	background-size: 100% 100%;
	border: none;
	box-shadow: none;
	overflow: hidden;
}

.metric-card__content {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	gap: clamp(4px, 0.3125vw, 6px);
	color: var(--theme-text-system);
}

.metric-card__label {
	font-size: 14px;
	font-weight: 700;
	color: var(--theme-text-primaryTitle);
	line-height: 1.2;
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
	color: var(--theme-text-system);
}

.metric-card__value small {
	margin-bottom: 3px;
	font-size: clamp(14px, 0.83333vw, 16px);
	font-weight: 700;
	color: var(--theme-text-dataAssist);
}

.metric-card__context {
	display: none;
}

.metric-card__delta {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	width: fit-content;
	padding: 0;
	border-radius: 0;
	line-height: 1.1;
}

.metric-card__delta.is-up {
	background: transparent;
	color: #ef4444;
}

.metric-card__delta.is-down {
	background: transparent;
	color: #46b538;
}

.metric-card__delta :deep(.el-icon) {
	font-size: 12px;
}

.metric-card__triangle-up {
	display: inline-block;
	width: 0;
	height: 0;
	border-left: 4px solid transparent;
	border-right: 4px solid transparent;
	border-bottom: 6px solid currentColor;
}

.metric-card__delta-label {
	font-size: 12px;
	font-weight: 500;
	color: #566073;
}

.metric-card__delta-value {
	font-size: 16px;
	font-weight: 700;
}

.metric-card__visual {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	height: 100%;
	min-height: 0;
	z-index: 1;
}

.metric-card__icon-shell {
	position: relative;
	width: 90px;
	height: 90px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--metric-accent);
}

.metric-icon {
	width: 100%;
	height: 100%;
	filter: drop-shadow(0 8px 14px var(--metric-accent-soft));
}

.metric-icon--image {
	object-fit: contain;
}

.home-grid {
	display: grid;
	gap: 18px;
}

.home-grid--primary {
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: clamp(12px, 0.83333vw, 16px);
}

.home-grid--secondary {
	grid-template-columns: minmax(0, 1fr) minmax(420px, 1fr);
}

.panel-card--trend {
	grid-column: span 3;
}

.panel-card--structure {
	grid-column: span 1;
}

.panel-card {
	position: relative;
	padding: 24px;
	border-radius: 28px;
	background: #ffffff;
	border: 1px solid rgba(var(--dashboard-primary-rgb), 0.08);
	box-shadow: none;
	overflow: hidden;
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

.panel-card__header--embedded {
	margin-bottom: 0;
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
	background: var(--dashboard-title-bar-color, #1677FF);
	box-shadow: var(--dashboard-title-bar-shadow, 0px 4px 10px 0px rgba(0, 148, 255, 0.2));
}

.panel-card__title-block h3 {
	font-size: 18px;
	line-height: 1.2;
	color: var(--theme-text-system);
}

.panel-card__title-block p {
	margin-top: 6px;
	font-size: 13px;
	color: var(--theme-text-dataAssist);
}

.panel-card__summary {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
}

.panel-card__summary-item {
	padding: 10px 14px;
	border-radius: 16px;
	background: rgba(var(--dashboard-primary-rgb), 0.06);
	min-width: 110px;
}

.panel-card__summary-item span {
	display: block;
	font-size: 12px;
	color: var(--theme-text-dataAssist);
}

.panel-card__summary-item strong {
	display: block;
	margin-top: 6px;
	font-size: 15px;
	color: var(--theme-text-system);
}

.panel-card__link {
	display: inline-flex;
	align-items: center;
	padding: 0;
	border: none;
	border-radius: 0;
	background: transparent;
	color: var(--dashboard-warning-link-color, #3F8DFF);
	font-size: 16px;
	font-weight: 600;
	line-height: 1;
	cursor: pointer;
}

.panel-card__link:hover {
	color: var(--dashboard-warning-link-hover-color, #2F7BE8);
}

.metric-switch {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	padding: 4px;
	border-radius: 14px;
	background: rgba(var(--dashboard-primary-rgb), 0.06);
}

.metric-switch__button {
	height: 32px;
	padding: 0 14px;
	border: none;
	border-radius: 10px;
	background: transparent;
	color: #6a7382;
	font-size: 14px;
	font-weight: 700;
	cursor: pointer;
	transition:
		background-color 0.2s ease,
		color 0.2s ease,
		box-shadow 0.2s ease;
}

.metric-switch__button.is-active {
	background: #ffffff;
	color: var(--dashboard-primary);
	box-shadow: 0 8px 18px rgba(var(--dashboard-primary-rgb), 0.12);
}

.panel-chart {
	position: relative;
	z-index: 1;
	width: 100%;
}

.panel-chart--trend {
	height: 340px;
}

.structure-panel {
	position: relative;
	z-index: 1;
	min-height: 320px;
}

.structure-panel :deep(.chart) {
	min-height: 320px;
}

.panel-empty-state {
	min-height: 320px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 24px;
	border-radius: 20px;
	border: 1px dashed rgba(var(--dashboard-primary-rgb), 0.22);
	background: linear-gradient(180deg, rgba(var(--dashboard-primary-rgb), 0.05), rgba(var(--dashboard-primary-rgb), 0.02));
	text-align: center;
}

.panel-empty-state--warning {
	min-height: 220px;
	margin-top: 6px;
}

.panel-empty-state__title {
	margin: 0;
	font-size: 16px;
	font-weight: 700;
	color: var(--theme-text-system);
}

.panel-empty-state__desc {
	margin: 10px 0 0;
	max-width: 320px;
	font-size: 13px;
	line-height: 1.6;
	color: #8b95a4;
}

.warning-list {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
}

.warning-list::before {
	content: '';
	position: absolute;
	left: 20px;
	top: 20px;
	bottom: 20px;
	width: 2px;
	background: #edf1f6;
}

.warning-list.is-empty::before {
	display: none;
}

.warning-scroll-viewport {
	position: relative;
	height: 344px;
	overflow: hidden;
}

.warning-scroll-track {
	display: flex;
	flex-direction: column;
}

.warning-scroll-content {
	display: flex;
	flex-direction: column;
}

.warning-scroll-content.is-clone {
	pointer-events: none;
}

.warning-item {
	position: relative;
	display: grid;
	grid-template-columns: 40px minmax(0, 1fr);
	column-gap: 26px;
	align-items: center;
	min-height: 86px;
}

.warning-item__marker {
	position: relative;
	z-index: 1;
	justify-self: center;
	align-self: center;
	width: 20px;
	height: 20px;
	margin: 0;
	border-radius: 50%;
	background: var(--warning-accent);
	box-shadow: 0 0 0 4px var(--warning-accent-soft);
}

.warning-item__marker::after {
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

.warning-item__content {
	display: flex;
	align-items: center;
	min-width: 0;
	padding: 16px 0;
	border-bottom: 1px dashed #e8edf3;
}

.warning-item__copy {
	display: flex;
	flex-direction: column;
	gap: 8px;
	width: 100%;
	min-width: 0;
}

.warning-item__head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 20px;
	width: 100%;
	min-width: 0;
}

.warning-item__main {
	display: flex;
	align-items: center;
	gap: 14px;
	min-width: 0;
}

.warning-item__icon-image {
	flex: none;
	width: 14px;
	height: 14px;
	object-fit: contain;
}

.warning-item__label {
	display: inline-flex;
	align-items: center;
	color: #515a67;
	font-size: 14px;
	font-weight: 500;
	white-space: nowrap;
}

.warning-item__main h4 {
	margin: 0;
	font-size: 16px;
	font-weight: 700;
	color: var(--theme-text-system);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.warning-item:last-child .warning-item__content {
	border-bottom: none;
}

.warning-item__head time {
	flex: none;
	font-size: 12px;
	font-weight: 500;
	color: #a3acb9;
	white-space: nowrap;
}

.panel-card--balance {
	padding: 22px 18px 18px;
	isolation: isolate;
	min-height: 320px;
	margin-bottom: 12px;
}

.panel-card--balance .panel-card__header {
	justify-content: flex-start;
	align-items: center;
	gap: 10px;
}

.balance-overview {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	margin-left: 2px;
	height: 24px;
	padding: 0 14px;
	border: 1px solid #bbe9b7;
	border-radius: 10px;
	background: #f4fff2;
	font-size: 14px;
	font-weight: 700;
	color: #58be51;
}

.balance-overview :deep(.el-icon) {
	font-size: 18px;
}

.balance-overview.is-warning {
	border-color: rgba(233, 138, 29, 0.3);
	background: rgba(233, 138, 29, 0.1);
	color: #e98a1d;
}

.balance-overview.is-processing {
	border-color: rgba(var(--dashboard-primary-rgb), 0.24);
	background: rgba(var(--dashboard-primary-rgb), 0.08);
	color: var(--dashboard-primary);
}

.balance-grid {
	position: relative;
	z-index: 1;
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 18px;
	align-content: start;
}

.balance-empty {
	position: relative;
	z-index: 1;
	min-height: 120px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 14px;
	border: 1px dashed rgba(var(--dashboard-primary-rgb), 0.26);
	background: rgba(var(--dashboard-primary-rgb), 0.04);
	font-size: 14px;
	font-weight: 600;
	color: #8b95a4;
}

.balance-card {
	position: relative;
	padding: 6px 0 0;
	overflow: visible;
}

.balance-card::before {
	content: '';
	position: absolute;
	top: 0;
	left: 2px;
	right: 2px;
	height: 30px;
	z-index: 0;
	border-radius: 999px;
	background: var(--dashboard-balance-topbar-color, #1677FF);
	box-shadow: var(--dashboard-balance-topbar-shadow, 0px 4px 10px 0px rgba(22,119,255,0.18));
}

.balance-card::after {
	content: '';
	position: absolute;
	top: 6px;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 0;
	border-radius: 20px;
	background: #ffffff;
	border: 1px solid rgba(var(--dashboard-primary-rgb), 0.14);
	box-shadow: 0 6px 18px rgba(15, 23, 42, 0.04);
}

.balance-card__head {
	position: relative;
	z-index: 1;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 14px;
	padding: 16px 14px 14px;
	border-radius: 20px 20px 0 0;
	overflow: hidden;
	border-bottom: 1px solid rgba(var(--dashboard-primary-rgb), 0.15);
	background: rgba(255, 255, 255, 0.18);
	-webkit-backdrop-filter: blur(12px) saturate(165%);
	backdrop-filter: blur(12px) saturate(165%);
}

.balance-card__head::before {
	content: '';
	position: absolute;
	inset: 0;
	z-index: 0;
	background: linear-gradient(180deg, rgba(255, 255, 255, 0.26) 0%, rgba(255, 255, 255, 0.08) 100%);
	pointer-events: none;
}

.balance-card__head > * {
	position: relative;
	z-index: 1;
}

.balance-card__title-line {
	display: flex;
	align-items: center;
	gap: 10px;
	min-width: 0;
}

.balance-card__title-line h4 {
	margin: 0;
	font-size: 18px;
	font-weight: 700;
	line-height: 1.1;
	color: #2f3747;
}

.balance-card__status {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	height: 24px;
	padding: 0 12px 0 10px;
	border: 1px solid var(--balance-accent-border);
	border-radius: 10px;
	background: var(--balance-accent-soft);
	color: var(--balance-accent);
	font-size: 14px;
	font-weight: 700;
}

.balance-card__status :deep(.el-icon) {
	font-size: 18px;
}

.balance-card__help {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 22px;
	height: 22px;
	padding: 0;
	border: none;
	background: transparent;
	color: #697284;
	cursor: default;
}

.balance-card__help :deep(.el-icon) {
	font-size: 20px;
}

:deep(.balance-card__help-tooltip) {
	max-width: 360px;
	line-height: 1.6;
	white-space: normal;
}

:deep(.balance-card__help-tooltip p) {
	margin: 0;
}

:deep(.balance-card__help-tooltip p + p) {
	margin-top: 4px;
}

.balance-card__body {
	position: relative;
	z-index: 1;
	display: grid;
	grid-template-columns: 122px minmax(0, 1fr);
	align-items: center;
	gap: 16px;
	padding: 16px 14px 14px 12px;
}

.balance-card__visual {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 156px;
}

.balance-card__icon {
	width: 96px;
	height: 96px;
	object-fit: contain;
	filter: drop-shadow(0 10px 18px rgba(var(--dashboard-primary-rgb), 0.16));
}

.balance-card__stats {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.balance-card__stat {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	min-height: 52px;
	padding: 0 18px;
	border-radius: 14px;
	background: #F5F7F9;
}

.balance-card__stat.is-alert {
	background: rgba(239, 68, 68, 0.05);
}

.balance-card__stat-label {
	font-size: 14px;
	font-weight: 600;
	color: #687180;
}

.balance-card__stat-value {
	display: inline-flex;
	align-items: flex-end;
	gap: 6px;
	flex: none;
	line-height: 1;
}

.balance-card__stat-value strong {
	font-size: 24px;
	font-weight: 800;
	letter-spacing: -0.03em;
	color: #2f3747;
}

.balance-card__stat-value small {
	margin-bottom: 2px;
	font-size: 14px;
	font-weight: 600;
	color: #8b95a4;
}

@media screen and (max-width: 1680px) {
	.metric-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.home-grid--primary,
	.home-grid--secondary {
		grid-template-columns: 1fr;
	}

	.panel-card--trend,
	.panel-card--structure {
		grid-column: auto;
	}
}

@media screen and (max-width: 1100px) {
	.balance-grid {
		grid-template-columns: 1fr;
	}
}

@media screen and (max-width: 900px) {
	.metric-grid {
		grid-template-columns: 1fr;
	}

	.metric-card {
		grid-template-columns: 1fr;
		height: auto;
		gap: 18px;
	}

	.metric-card__visual {
		justify-content: flex-start;
	}

	.panel-card,
	.metric-card {
		padding: 20px;
		border-radius: 24px;
	}

	.panel-card__header,
	.warning-item__head,
	.home-toolbar {
		flex-direction: column;
		align-items: flex-start;
	}

	.panel-empty-state {
		min-height: 240px;
	}

	.panel-empty-state--warning {
		min-height: 180px;
	}

	.balance-overview {
		height: 24px;
		padding: 0 12px;
	}

	.warning-list::before {
		left: 18px;
	}

	.warning-item {
		grid-template-columns: 36px minmax(0, 1fr);
		column-gap: 16px;
	}

	.warning-item__marker {
		margin: 0;
	}

	.warning-scroll-viewport {
		height: 320px;
	}

	.warning-item__main {
		flex-wrap: wrap;
		gap: 10px;
	}

	.warning-item__main h4 {
		white-space: normal;
	}

	.balance-card__body {
		grid-template-columns: 1fr;
		padding: 14px;
	}

	.balance-card__visual {
		min-height: auto;
		padding-top: 4px;
	}

	.home-toolbar__tab {
		min-width: 122px;
	}

	.home-toolbar__picker {
		width: 100%;
		justify-content: flex-start;
		margin-left: 0;
	}

	.home-toolbar__date-picker {
		width: 100%;
	}

	.panel-card__summary {
		width: 100%;
	}

	.metric-switch {
		flex-wrap: wrap;
	}

	.metric-switch__button {
		flex: 1 1 auto;
	}

}

@media screen and (max-width: 640px) {
	.home-dashboard {
		padding-top: 0;
		padding-bottom: 64px;
	}

	.home-toolbar__tabs {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.home-toolbar__tab {
		width: 100%;
		min-width: 0;
	}

	.warning-scroll-viewport {
		height: 300px;
	}

	.metric-card__value span {
		font-size: 34px;
	}

	.balance-card__title-line,
	.balance-card__stat {
		flex-wrap: wrap;
	}

	.balance-card__stat {
		padding: 12px 14px;
	}

	.balance-card__stat-value strong {
		font-size: 22px;
	}
}
</style>
