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
	return {
		color: enterprises.map((item) => item.color),
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
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
		series: enterprises.map((enterprise) => ({
			name: enterprise.name,
			type: 'bar',
			stack: metric,
			barWidth: 26,
			itemStyle: {
				borderRadius: [6, 6, 0, 0],
			},
			emphasis: {
				focus: 'series',
			},
			data: records.map((record) => getMetricValue(record.metrics[enterprise.code], metric)),
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
