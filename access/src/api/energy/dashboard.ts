import request from '/@/utils/request';

export type DashboardDateType = 'TODAY' | 'LAST_7_DAYS' | 'CURRENT_MONTH' | 'CUSTOM';
export type DashboardMetricType = 'ELECTRICITY' | 'WATER' | 'COST';
export type DashboardTrendGranularity = 'HOUR' | 'DAY';
export type DashboardAlarmLevel = 'CRITICAL' | 'WARNING' | 'NOTICE';
export type DashboardCheckStatus = 'NORMAL' | 'ABNORMAL';
export type DashboardOverallStatus = 'NORMAL' | 'ABNORMAL';

export interface DashboardBaseParams {
	siteId?: string;
	dateType: DashboardDateType;
	startTime?: string;
	endTime?: string;
}

export interface DashboardOverviewParams extends DashboardBaseParams {
	metricType: DashboardMetricType;
}

export interface ApiResponse<T> {
	code: number;
	msg: string;
	data: T;
}

export interface DashboardSummaryMetric {
	currentValue: number;
	unit: string;
	yoyValue: number | null;
	yoyRate: number | null;
}

export interface DashboardOverviewData {
	summary: {
		electricity: DashboardSummaryMetric;
		water: DashboardSummaryMetric;
		gas: DashboardSummaryMetric;
		cost: DashboardSummaryMetric;
	};
	energyTrend: {
		metricType: DashboardMetricType;
		unit: string;
		granularity: DashboardTrendGranularity;
		points: Array<{
			time: string;
			value: number;
		}>;
	};
	energyComposition: {
		items: Array<{
			categoryCode: string;
			categoryName: string;
			value: number;
			ratio: number;
		}>;
	};
	spaceEnergyRanking: {
		metricType: DashboardMetricType;
		unit: string;
		items: Array<{
			spaceId: string;
			spaceName: string;
			value: number;
			rank: number;
		}>;
	};
}

export interface DashboardRealtimeAlarmsData {
	records: Array<{
		id: string;
		alarmLevel: string;
		level: DashboardAlarmLevel;
		levelName: string;
		content: string;
		alarmTime: string;
		spaceName: string | null;
		deviceName: string | null;
	}>;
}

export interface DashboardBalanceCheckData {
	overallStatus: DashboardOverallStatus;
	items: Array<{
		energyType: 'ELECTRICITY' | 'WATER' | 'GAS';
		energyName: string;
		status: DashboardCheckStatus;
		mainMeterValue: number;
		subMeterTotalValue: number;
		lineLossRate: number;
		unit: string;
	}>;
}

interface BackendDashboardParams {
	timeRange: DashboardDateType;
	startDate?: string;
	endDate?: string;
}

interface BackendHomepageOverviewData {
	elec?: string | number | null;
	elecYoy?: string | number | null;
	water?: string | number | null;
	waterYoy?: string | number | null;
	gas?: string | number | null;
	gasYoy?: string | number | null;
	cost?: string | number | null;
	costYoy?: string | number | null;
	energyTrendList?: Array<{
		statDate?: string | null;
		elecValue?: string | number | null;
		waterValue?: string | number | null;
		costValue?: string | number | null;
	}>;
	subsystemRatioList?: Array<{
		subsystemType?: string | null;
		subsystemRatio?: string | number | null;
	}>;
	spaceRankList?: Array<{
		spaceCode?: string | null;
		spaceElec?: string | number | null;
		spaceWater?: string | number | null;
		spaceCost?: string | number | null;
	}>;
}

interface BackendRealtimeAlarmRecord {
	alarmLevel?: string | null;
	alarmContent?: string | null;
	alarmTime?: string | null;
}

interface BackendBalanceCheckRecord {
	statType?: string | null;
	totalReading?: string | number | null;
	submeterReading?: string | number | null;
	lineLoss?: string | number | null;
	status?: string | null;
}

const metricUnitMap: Record<DashboardMetricType, string> = {
	ELECTRICITY: 'kWh',
	WATER: 'm³',
	COST: '元',
};

const summaryUnitMap = {
	electricity: 'kWh',
	water: 'm³',
	gas: 'm³',
	cost: '元',
} as const;

const alarmLevelMetaMap: Record<string, { level: DashboardAlarmLevel; levelName: string }> = {
	emergency: { level: 'CRITICAL', levelName: '严重' },
	serious: { level: 'CRITICAL', levelName: '严重' },
	critical: { level: 'CRITICAL', levelName: '严重' },
	warning: { level: 'WARNING', levelName: '警告' },
	info: { level: 'NOTICE', levelName: '提醒' },
	notice: { level: 'NOTICE', levelName: '提醒' },
	严重: { level: 'CRITICAL', levelName: '严重' },
	警告: { level: 'WARNING', levelName: '警告' },
	提醒: { level: 'NOTICE', levelName: '提醒' },
};

const balanceTypeMetaMap = {
	ELECTRICITY: { energyType: 'ELECTRICITY', energyName: '电力', unit: 'kWh' },
	WATER: { energyType: 'WATER', energyName: '供水', unit: 'm³' },
	GAS: { energyType: 'GAS', energyName: '燃气', unit: 'm³' },
} as const;

const balanceTypeAliasMap: Record<string, keyof typeof balanceTypeMetaMap> = {
	elec: 'ELECTRICITY',
	electric: 'ELECTRICITY',
	electricity: 'ELECTRICITY',
	电: 'ELECTRICITY',
	电力: 'ELECTRICITY',
	water: 'WATER',
	供水: 'WATER',
	水: 'WATER',
	gas: 'GAS',
	燃气: 'GAS',
	天然气: 'GAS',
};

const normalizeBalanceType = (statType?: string | null): keyof typeof balanceTypeMetaMap => {
	const rawValue = (statType ?? '').trim();
	const normalizedKey = rawValue.toLowerCase();
	return balanceTypeAliasMap[normalizedKey] || balanceTypeAliasMap[rawValue] || 'GAS';
};

const normalizeBalanceStatus = (status?: string | null): DashboardCheckStatus => {
	const rawValue = (status ?? '').trim();
	const normalizedKey = rawValue.toLowerCase();
	if (['平衡', '正常', 'normal', 'ok', 'success'].includes(rawValue) || ['normal', 'ok', 'success'].includes(normalizedKey)) {
		return 'NORMAL';
	}
	return 'ABNORMAL';
};

const toNumber = (value: string | number | null | undefined) => {
	if (value === null || value === undefined || value === '') return 0;
	const normalized = typeof value === 'string' ? value.replace(/[%\s,]/g, '') : value;
	const numeric = Number(normalized);
	return Number.isFinite(numeric) ? numeric : 0;
};

const normalizeDate = (value: string | undefined) => {
	if (!value) return value;
	return value.split(' ')[0];
};

const buildBackendParams = (params: DashboardBaseParams): BackendDashboardParams => {
	const payload: BackendDashboardParams = {
		timeRange: params.dateType,
	};

	if (params.dateType === 'CUSTOM') {
		payload.startDate = normalizeDate(params.startTime);
		payload.endDate = normalizeDate(params.endTime);
	}

	return payload;
};

const inferGranularity = (dateType: DashboardDateType): DashboardTrendGranularity => {
	return dateType === 'TODAY' ? 'HOUR' : 'DAY';
};

const getTrendMetricValue = (
	item: NonNullable<BackendHomepageOverviewData['energyTrendList']>[number],
	metricType: DashboardMetricType
) => {
	if (metricType === 'ELECTRICITY') return toNumber(item.elecValue);
	if (metricType === 'WATER') return toNumber(item.waterValue);
	return toNumber(item.costValue);
};

const getRankingMetricValue = (
	item: NonNullable<BackendHomepageOverviewData['spaceRankList']>[number],
	metricType: DashboardMetricType
) => {
	if (metricType === 'ELECTRICITY') return toNumber(item.spaceElec);
	if (metricType === 'WATER') return toNumber(item.spaceWater);
	return toNumber(item.spaceCost);
};

const normalizeSummaryMetric = (
	currentValue: string | number | null | undefined,
	yoyMetric: string | number | null | undefined,
	unit: string
): DashboardSummaryMetric => {
	const normalizedCurrentValue = toNumber(currentValue);
	const hasYoyValue = yoyMetric !== null && yoyMetric !== undefined && yoyMetric !== '';
	const yoyValue = hasYoyValue ? toNumber(yoyMetric) : null;

	return {
		currentValue: normalizedCurrentValue,
		unit,
		yoyValue,
		yoyRate: yoyValue && yoyValue !== 0 ? ((normalizedCurrentValue - yoyValue) / yoyValue) * 100 : null,
	};
};

const transformOverview = (data: BackendHomepageOverviewData, params: DashboardOverviewParams): DashboardOverviewData => {
	const rawSubsystemItems = data.subsystemRatioList ?? [];
	const subsystemTotal = rawSubsystemItems.reduce((total, item) => total + toNumber(item.subsystemRatio), 0);
	const subsystemItems = rawSubsystemItems
		.map((item) => {
			const rawType = (item.subsystemType ?? '').trim();
			const typeKey = rawType.toLowerCase() || 'other';
			const value = toNumber(item.subsystemRatio);
			return {
				categoryCode: typeKey,
				categoryName: rawType || typeKey,
				value,
				ratio: subsystemTotal > 0 ? (value / subsystemTotal) * 100 : 0,
			};
		})
		.filter((item) => item.value > 0);

	const rankingItems = (data.spaceRankList ?? [])
		.map((item, index) => ({
			spaceId: item.spaceCode || `space-${index + 1}`,
			spaceName: item.spaceCode || '未分配空间',
			value: getRankingMetricValue(item, params.metricType),
			rank: index + 1,
		}))
		.sort((a, b) => b.value - a.value)
		.map((item, index) => ({
			...item,
			rank: index + 1,
		}));

	return {
		summary: {
			electricity: normalizeSummaryMetric(data.elec, data.elecYoy, summaryUnitMap.electricity),
			water: normalizeSummaryMetric(data.water, data.waterYoy, summaryUnitMap.water),
			gas: normalizeSummaryMetric(data.gas, data.gasYoy, summaryUnitMap.gas),
			cost: normalizeSummaryMetric(data.cost, data.costYoy, summaryUnitMap.cost),
		},
		energyTrend: {
			metricType: params.metricType,
			unit: metricUnitMap[params.metricType],
			granularity: inferGranularity(params.dateType),
			points: (data.energyTrendList ?? []).map((item) => ({
				time: item.statDate || '',
				value: getTrendMetricValue(item, params.metricType),
			})),
		},
		energyComposition: {
			items: subsystemItems,
		},
		spaceEnergyRanking: {
			metricType: params.metricType,
			unit: metricUnitMap[params.metricType],
			items: rankingItems,
		},
	};
};

const transformAlarmLevel = (alarmLevel: string | null | undefined) => {
	const rawValue = (alarmLevel ?? '').trim();
	const normalizedKey = rawValue.toLowerCase();
	return alarmLevelMetaMap[normalizedKey] || alarmLevelMetaMap[rawValue] || alarmLevelMetaMap.notice;
};

const transformRealtimeAlarms = (records: BackendRealtimeAlarmRecord[]): DashboardRealtimeAlarmsData => {
	return {
		records: records.map((item, index) => {
			const levelMeta = transformAlarmLevel(item.alarmLevel);
			const alarmLevel = (item.alarmLevel ?? '').trim();
			return {
				id: `alarm-${index + 1}`,
				alarmLevel,
				level: levelMeta.level,
				levelName: levelMeta.levelName,
				content: item.alarmContent || '暂无告警内容',
				alarmTime: (item.alarmTime ?? '').trim(),
				spaceName: null,
				deviceName: null,
			};
		}),
	};
};

const transformBalanceCheck = (records: BackendBalanceCheckRecord[]): DashboardBalanceCheckData => {
	const items = records.map((item) => {
		const typeMeta = balanceTypeMetaMap[normalizeBalanceType(item.statType)];
		const normalizedStatus = normalizeBalanceStatus(item.status);
		const mainMeterValue = toNumber(item.totalReading);
		const subMeterTotalValue = toNumber(item.submeterReading);
		const rawLineLossRate =
			item.lineLoss !== null && item.lineLoss !== undefined && item.lineLoss !== ''
				? toNumber(item.lineLoss)
				: mainMeterValue > 0
					? (mainMeterValue - subMeterTotalValue) / mainMeterValue
					: 0;
		return {
			energyType: typeMeta.energyType,
			energyName: typeMeta.energyName,
			status: normalizedStatus,
			mainMeterValue,
			subMeterTotalValue,
			lineLossRate: rawLineLossRate * 100,
			unit: typeMeta.unit,
		};
	});

	return {
		overallStatus: items.every((item) => item.status === 'NORMAL') ? 'NORMAL' : 'ABNORMAL',
		items,
	};
};

export const getDashboardOverview = async (params: DashboardOverviewParams): Promise<ApiResponse<DashboardOverviewData>> => {
	const response = (await request({
		url: '/platform/energy/homepage/overview',
		method: 'post',
		data: buildBackendParams(params),
	})) as ApiResponse<BackendHomepageOverviewData>;

	return {
		...response,
		data: transformOverview(response.data || {}, params),
	};
};

export const getDashboardRealtimeAlarms = async (params: DashboardBaseParams): Promise<ApiResponse<DashboardRealtimeAlarmsData>> => {
	const response = (await request({
		url: '/platform/energy/homepage/realtimeAlarms',
		method: 'get',
		params: buildBackendParams(params),
	})) as ApiResponse<BackendRealtimeAlarmRecord[]>;

	return {
		...response,
		data: transformRealtimeAlarms(response.data || []),
	};
};

export const getDashboardBalanceCheck = async (params: DashboardBaseParams): Promise<ApiResponse<DashboardBalanceCheckData>> => {
	const response = (await request({
		url: '/platform/energy/homepage/balanceCheck',
		method: 'post',
		data: buildBackendParams(params),
	})) as ApiResponse<BackendBalanceCheckRecord[]>;

	return {
		...response,
		data: transformBalanceCheck(response.data || []),
	};
};
