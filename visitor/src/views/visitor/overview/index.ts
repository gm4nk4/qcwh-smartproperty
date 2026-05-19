import type { TrendMetricKey, VisitorOverviewSummary } from './api';

export interface DashboardCardConfig {
	key: keyof VisitorOverviewSummary;
	label: string;
	helper: string;
	icon: string;
	accent: 'pink' | 'blue' | 'green' | 'violet' | 'amber';
}

export interface FieldOption {
	label: string;
	value: string;
}

export interface DynamicFieldConfig {
	key: string;
	field: string;
	component: 'el-select' | 'el-date-picker' | 'el-segmented';
	props: Record<string, unknown>;
	options?: FieldOption[];
}

export const dashboardCardConfigs: DashboardCardConfig[] = [
	{ key: 'totalVisitors', label: '访客总数', helper: '累计', icon: 'ele-User', accent: 'pink' },
	{ key: 'todayAppointments', label: '今日预约', helper: '今日', icon: 'ele-Calendar', accent: 'blue' },
	{ key: 'todayArrivals', label: '今日到访', helper: '今日', icon: 'ele-Position', accent: 'green' },
	{ key: 'monthAppointments', label: '本月预约', helper: '3月', icon: 'ele-Date', accent: 'violet' },
	{ key: 'monthArrivals', label: '本月到访', helper: '3月', icon: 'ele-Histogram', accent: 'amber' },
];

export const trendMetricOptions: FieldOption[] = [
	{ label: '到访人数', value: 'visitorCount' },
	{ label: '到访车辆', value: 'vehicleCount' },
];

export const createTrendToolbarConfig = (): DynamicFieldConfig[] => [
	{
		key: 'metric',
		field: 'metric',
		component: 'el-segmented',
		props: {
			options: trendMetricOptions,
			size: 'default',
		},
	},
	{
		key: 'dateRange',
		field: 'dateRange',
		component: 'el-date-picker',
		props: {
			type: 'daterange',
			valueFormat: 'YYYY-MM-DD',
			startPlaceholder: '开始日期',
			endPlaceholder: '结束日期',
			unlinkPanels: true,
			clearable: false,
		},
	},
];

export const metricLabelMap: Record<TrendMetricKey, string> = {
	visitorCount: '到访人数',
	vehicleCount: '到访车辆',
};

export const metricUnitMap: Record<TrendMetricKey, string> = {
	visitorCount: '人',
	vehicleCount: '辆',
};
