export type TrendMetricKey = 'visitorCount' | 'vehicleCount';

export interface VisitorMetricItem {
	visitorCount: number;
	vehicleCount: number;
}

export interface VisitorEnterpriseItem {
	code: string;
	name: string;
	color: string;
}

export interface VisitorTrendRecord {
	date: string;
	fullDate: string;
	metrics: Record<string, VisitorMetricItem>;
}

export interface VisitorOverviewSummary {
	totalVisitors: number;
	todayAppointments: number;
	todayArrivals: number;
	monthAppointments: number;
	monthArrivals: number;
}

export interface VisitorOverviewPayload {
	summary: VisitorOverviewSummary;
	enterprises: VisitorEnterpriseItem[];
	trendRecords: VisitorTrendRecord[];
	defaultMetric: TrendMetricKey;
	defaultDateRange: [string, string];
}

const enterprises: VisitorEnterpriseItem[] = [
	{ code: 'innovation', name: '创新科技有限公司', color: '#3b8eea' },
	{ code: 'huaxia', name: '华夏设计院', color: '#7bd332' },
	{ code: 'cscec3', name: '中建三局', color: '#834ad4' },
	{ code: 'sf', name: '顺丰速运', color: '#ff9f2d' },
	{ code: 'others', name: '其他企业', color: '#9e9e9e' },
];

const trendRecords: VisitorTrendRecord[] = [
	{
		date: '03-06',
		fullDate: '2026-03-06',
		metrics: {
			innovation: { visitorCount: 5, vehicleCount: 2 },
			huaxia: { visitorCount: 4, vehicleCount: 1 },
			cscec3: { visitorCount: 7, vehicleCount: 2 },
			sf: { visitorCount: 2, vehicleCount: 1 },
			others: { visitorCount: 5, vehicleCount: 2 },
		},
	},
	{
		date: '03-07',
		fullDate: '2026-03-07',
		metrics: {
			innovation: { visitorCount: 7, vehicleCount: 3 },
			huaxia: { visitorCount: 6, vehicleCount: 2 },
			cscec3: { visitorCount: 5, vehicleCount: 2 },
			sf: { visitorCount: 3, vehicleCount: 1 },
			others: { visitorCount: 4, vehicleCount: 1 },
		},
	},
	{
		date: '03-08',
		fullDate: '2026-03-08',
		metrics: {
			innovation: { visitorCount: 4, vehicleCount: 2 },
			huaxia: { visitorCount: 7, vehicleCount: 2 },
			cscec3: { visitorCount: 8, vehicleCount: 3 },
			sf: { visitorCount: 2, vehicleCount: 1 },
			others: { visitorCount: 4, vehicleCount: 1 },
		},
	},
	{
		date: '03-09',
		fullDate: '2026-03-09',
		metrics: {
			innovation: { visitorCount: 6, vehicleCount: 2 },
			huaxia: { visitorCount: 3, vehicleCount: 1 },
			cscec3: { visitorCount: 5, vehicleCount: 2 },
			sf: { visitorCount: 2, vehicleCount: 1 },
			others: { visitorCount: 4, vehicleCount: 1 },
		},
	},
	{
		date: '03-10',
		fullDate: '2026-03-10',
		metrics: {
			innovation: { visitorCount: 8, vehicleCount: 4 },
			huaxia: { visitorCount: 4, vehicleCount: 1 },
			cscec3: { visitorCount: 9, vehicleCount: 3 },
			sf: { visitorCount: 2, vehicleCount: 1 },
			others: { visitorCount: 3, vehicleCount: 1 },
		},
	},
	{
		date: '03-11',
		fullDate: '2026-03-11',
		metrics: {
			innovation: { visitorCount: 5, vehicleCount: 2 },
			huaxia: { visitorCount: 9, vehicleCount: 3 },
			cscec3: { visitorCount: 5, vehicleCount: 2 },
			sf: { visitorCount: 1, vehicleCount: 0 },
			others: { visitorCount: 8, vehicleCount: 3 },
		},
	},
	{
		date: '03-12',
		fullDate: '2026-03-12',
		metrics: {
			innovation: { visitorCount: 6, vehicleCount: 2 },
			huaxia: { visitorCount: 6, vehicleCount: 2 },
			cscec3: { visitorCount: 4, vehicleCount: 1 },
			sf: { visitorCount: 1, vehicleCount: 0 },
			others: { visitorCount: 2, vehicleCount: 1 },
		},
	},
	{
		date: '03-13',
		fullDate: '2026-03-13',
		metrics: {
			innovation: { visitorCount: 7, vehicleCount: 2 },
			huaxia: { visitorCount: 4, vehicleCount: 1 },
			cscec3: { visitorCount: 7, vehicleCount: 2 },
			sf: { visitorCount: 3, vehicleCount: 1 },
			others: { visitorCount: 3, vehicleCount: 1 },
		},
	},
	{
		date: '03-14',
		fullDate: '2026-03-14',
		metrics: {
			innovation: { visitorCount: 8, vehicleCount: 3 },
			huaxia: { visitorCount: 3, vehicleCount: 1 },
			cscec3: { visitorCount: 6, vehicleCount: 2 },
			sf: { visitorCount: 4, vehicleCount: 2 },
			others: { visitorCount: 7, vehicleCount: 2 },
		},
	},
	{
		date: '03-15',
		fullDate: '2026-03-15',
		metrics: {
			innovation: { visitorCount: 6, vehicleCount: 2 },
			huaxia: { visitorCount: 5, vehicleCount: 2 },
			cscec3: { visitorCount: 8, vehicleCount: 2 },
			sf: { visitorCount: 2, vehicleCount: 1 },
			others: { visitorCount: 9, vehicleCount: 3 },
		},
	},
	{
		date: '03-16',
		fullDate: '2026-03-16',
		metrics: {
			innovation: { visitorCount: 7, vehicleCount: 4 },
			huaxia: { visitorCount: 2, vehicleCount: 2 },
			cscec3: { visitorCount: 17, vehicleCount: 6 },
			sf: { visitorCount: 3, vehicleCount: 4 },
			others: { visitorCount: 8, vehicleCount: 3 },
		},
	},
	{
		date: '03-17',
		fullDate: '2026-03-17',
		metrics: {
			innovation: { visitorCount: 13, vehicleCount: 2 },
			huaxia: { visitorCount: 8, vehicleCount: 1 },
			cscec3: { visitorCount: 12, vehicleCount: 2 },
			sf: { visitorCount: 6, vehicleCount: 3 },
			others: { visitorCount: 5, vehicleCount: 2 },
		},
	},
	{
		date: '03-18',
		fullDate: '2026-03-18',
		metrics: {
			innovation: { visitorCount: 9, vehicleCount: 4 },
			huaxia: { visitorCount: 3, vehicleCount: 0 },
			cscec3: { visitorCount: 19, vehicleCount: 3 },
			sf: { visitorCount: 5, vehicleCount: 3 },
			others: { visitorCount: 10, vehicleCount: 3 },
		},
	},
	{
		date: '03-19',
		fullDate: '2026-03-19',
		metrics: {
			innovation: { visitorCount: 10, vehicleCount: 2 },
			huaxia: { visitorCount: 3, vehicleCount: 2 },
			cscec3: { visitorCount: 16, vehicleCount: 7 },
			sf: { visitorCount: 1, vehicleCount: 2 },
			others: { visitorCount: 8, vehicleCount: 2 },
		},
	},
	{
		date: '03-20',
		fullDate: '2026-03-20',
		metrics: {
			innovation: { visitorCount: 3, vehicleCount: 4 },
			huaxia: { visitorCount: 4, vehicleCount: 0 },
			cscec3: { visitorCount: 6, vehicleCount: 6 },
			sf: { visitorCount: 5, vehicleCount: 1 },
			others: { visitorCount: 6, vehicleCount: 2 },
		},
	},
];

const summary: VisitorOverviewSummary = {
	totalVisitors: 1286,
	todayAppointments: 23,
	todayArrivals: 18,
	monthAppointments: 347,
	monthArrivals: 312,
};

export const getVisitorOverviewData = async (): Promise<{ code: number; data: VisitorOverviewPayload }> => {
	return Promise.resolve({
		code: 0,
		data: {
			summary,
			enterprises,
			trendRecords,
			defaultMetric: 'visitorCount',
			defaultDateRange: ['2026-03-06', '2026-03-20'],
		},
	});
};
