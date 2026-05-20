import type { DashboardCardConfig } from './index';
import { metricLabelMap, metricUnitMap } from './index';
import type { TrendMetricKey, VisitorEnterpriseItem, VisitorMetricItem, VisitorOverviewSummary, VisitorTrendRecord } from './api';

export interface DashboardCardItem extends DashboardCardConfig {
	value: string;
	rawValue: number;
}

export interface TrendTableColumn {
	prop: string;
	label: string;
	type: 'enterprise' | 'metric' | 'total';
	minWidth?: number;
}

export interface TrendTableRow {
	enterpriseCode: string;
	enterpriseName: string;
	color: string;
	totalMetrics: VisitorMetricItem;
	[prop: string]: string | VisitorMetricItem;
}

const getMetricValue = (item: VisitorMetricItem | undefined, metric: TrendMetricKey) => item?.[metric] ?? 0;

const formatNumber = (value: number) => value.toLocaleString('en-US');

export const buildDashboardCards = (summary: VisitorOverviewSummary, configs: DashboardCardConfig[]): DashboardCardItem[] =>
	configs.map((config) => ({
		...config,
		rawValue: summary[config.key],
		value: formatNumber(summary[config.key]),
	}));

export const buildInsightText = (summary: VisitorOverviewSummary, companyCount: number) => {
	const todayRate = summary.todayAppointments ? Math.round((summary.todayArrivals / summary.todayAppointments) * 100) : 0;
	const monthRate = summary.monthAppointments ? Math.round((summary.monthArrivals / summary.monthAppointments) * 100) : 0;
	const vehicleRatio = summary.monthArrivals ? Math.round((summary.monthArrivals / summary.totalVisitors) * 100) : 0;
	return `今日预约到访率 ${todayRate}% ，本月预约到访率 ${monthRate}% ，到访企业 ${companyCount} 家，车辆到访占比约 ${vehicleRatio}%`;
};

export const filterTrendRecordsByRange = (records: VisitorTrendRecord[], dateRange: string[]) => {
	if (!dateRange?.length || dateRange.length !== 2) return records;
	const [startDate, endDate] = dateRange;
	return records.filter((item) => item.fullDate >= startDate && item.fullDate <= endDate);
};

export const buildTrendChartOption = (records: VisitorTrendRecord[], enterprises: VisitorEnterpriseItem[], metric: TrendMetricKey) => {
	const unit = metricUnitMap[metric];

	// 预计算二维数据矩阵 [series][xIndex]，并按 x 找出"最顶上一个非零段"的 series 下标，
	// 后续 itemStyle.borderRadius 只在该段顶部生效，避免每段都顶部圆角导致的"胶囊堆叠"丑感。
	const dataMatrix = enterprises.map((enterprise) => records.map((r) => getMetricValue(r.metrics[enterprise.code], metric)));
	const topSeriesPerX = records.map((_, xIndex) => {
		for (let s = enterprises.length - 1; s >= 0; s--) {
			if (dataMatrix[s][xIndex] > 0) return s;
		}
		return -1;
	});

	return {
		color: enterprises.map((item) => item.color),
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
				shadowStyle: {
					color: 'rgba(99, 102, 241, 0.06)',
				},
			},
			backgroundColor: 'rgba(15, 23, 42, 0.92)',
			borderWidth: 0,
			padding: [12, 14],
			textStyle: {
				color: '#f8fafc',
			},
			formatter: (params: Array<{ axisValueLabel: string; seriesName: string; color: string; value: number }>) => {
				const total = params.reduce((sum, item) => sum + Number(item.value || 0), 0);
				const lines = params.map((item) => {
					return `${item.seriesName}: ${item.value}${unit}`;
				});
				return [params[0]?.axisValueLabel || '', ...lines, `合计: ${total}${unit}`].join('<br/>');
			},
		},
		legend: {
			top: 0,
			left: 0,
			icon: 'roundRect',
			itemWidth: 10,
			itemHeight: 10,
			itemGap: 18,
			textStyle: {
				color: '#64748b',
				fontSize: 12,
			},
		},
		grid: {
			left: 16,
			right: 16,
			top: 64,
			bottom: 24,
			containLabel: true,
		},
		xAxis: {
			type: 'category',
			data: records.map((item) => item.date),
			axisTick: {
				show: false,
			},
			axisLine: {
				lineStyle: {
					color: '#e2e8f0',
				},
			},
			axisLabel: {
				color: '#94a3b8',
			},
		},
		yAxis: {
			type: 'value',
			name: metricLabelMap[metric],
			nameTextStyle: {
				color: '#94a3b8',
				padding: [0, 0, 0, 8],
			},
			splitLine: {
				lineStyle: {
					color: '#edf2f7',
				},
			},
			axisLine: {
				show: false,
			},
			axisTick: {
				show: false,
			},
			axisLabel: {
				color: '#94a3b8',
			},
		},
		series: enterprises.map((enterprise, sIndex) => ({
			name: enterprise.name,
			type: 'bar',
			stack: metric,
			barWidth: 20,
			emphasis: {
				focus: 'series',
				itemStyle: {
					shadowBlur: 14,
					shadowOffsetY: 4,
					shadowColor: 'rgba(15, 23, 42, 0.18)',
				},
			},
			data: records.map((_, xIndex) => {
				const value = dataMatrix[sIndex][xIndex];
				const isTop = topSeriesPerX[xIndex] === sIndex;
				// 仅最顶段顶部圆角，其余段保持矩形拼接；段与段之间用 1px 同背景色 borderColor 形成细缝，
				// 避免相邻同色段挤在一起糊成一片。
				return {
					value,
					itemStyle: {
						borderRadius: isTop ? [8, 8, 0, 0] : [0, 0, 0, 0],
						borderColor: '#ffffff',
						borderWidth: value > 0 ? 1 : 0,
					},
				};
			}),
		})),
	};
};

export const buildTrendTableColumns = (records: VisitorTrendRecord[]): TrendTableColumn[] => [
	{
		prop: 'enterpriseName',
		label: '企业',
		type: 'enterprise',
		minWidth: 220,
	},
	...records.map((item) => ({
		prop: item.date,
		label: item.date,
		type: 'metric' as const,
		minWidth: 130,
	})),
	{
		prop: 'totalMetrics',
		label: `${records.length}日合计`,
		type: 'total',
		minWidth: 140,
	},
];

export const buildTrendTableRows = (records: VisitorTrendRecord[], enterprises: VisitorEnterpriseItem[]): TrendTableRow[] =>
	enterprises.map((enterprise) => {
		const row: TrendTableRow = {
			enterpriseCode: enterprise.code,
			enterpriseName: enterprise.name,
			color: enterprise.color,
			totalMetrics: {
				visitorCount: 0,
				vehicleCount: 0,
			},
		};

		records.forEach((record) => {
			const metricItem = record.metrics[enterprise.code] || { visitorCount: 0, vehicleCount: 0 };
			row[record.date] = metricItem;
			row.totalMetrics = {
				visitorCount: row.totalMetrics.visitorCount + metricItem.visitorCount,
				vehicleCount: row.totalMetrics.vehicleCount + metricItem.vehicleCount,
			};
		});

		return row;
	});
