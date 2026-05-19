import request from '/@/utils/request';

export type EnergyCostStatType = 'day' | 'month' | 'year';
export type EnergyCostDateType = 'DAY' | 'MONTH' | 'YEAR';
export type EnergyCostTimeRange = '30d' | '90d' | '180d' | '1y';
export type EnergyCostEnergyTypeCode = 'ELECTRICITY' | 'WATER' | 'GAS';

export interface EnergyCostApiResponse<T> {
	code: number;
	message?: string;
	msg?: string;
	data: T;
}

export interface EnergyCostStatsParams {
	statType: EnergyCostStatType;
	statValue: string;
}

export interface EnergyCostTrendRecord {
	statPeriod: string;
	elecCost: string;
	waterCost: string;
	gasCost: string;
}

export interface EnergyCostSpaceRankRecord {
	spaceCode: string;
	cost: string;
	rank: string;
}

export interface EnergyCostStatsData {
	totalCost: string;
	elecCost: string;
	elecLast: string;
	elecYoY: string;
	waterCost: string;
	waterLast: string;
	waterYoY: string;
	gasCost: string;
	gasLast: string;
	gasYoY: string;
	peak: string;
	valley: string;
	flat: string;
	energyTrend: EnergyCostTrendRecord[];
	spaceRankList: EnergyCostSpaceRankRecord[];
}

export interface EnergyUtilityCostParams {
	timeRange: EnergyCostTimeRange;
}

export interface EnergyUtilityCostData {
	totalElec: string;
	elecCost: string;
	elecPrice: string;
	totalWater: string;
	waterCost: string;
	waterPrice: string;
	totalGas: string;
	gasCost: string;
	gasPrice: string;
	statDays: string;
	energyTrend: EnergyCostTrendRecord[];
}

export interface EnergyCostDetailPageParams {
	dateType: EnergyCostDateType;
	statDate: string;
	pageNum: number;
	pageSize: number;
}

export interface EnergyCostDetailPageRecord {
	periodLabel: string;
	energyTypeCode: EnergyCostEnergyTypeCode;
	energyTypeName: string;
	usageAmount: number;
	usageUnit: string;
	avgUnitPrice: number;
	unitPriceUnit: string;
	costAmount: number;
	yoyRate: number;
	momRate: number;
	zoneName: string;
	remark: string | null;
}

export interface EnergyCostDetailPageData {
	total: number;
	pageNum: number;
	pageSize: number;
	list: EnergyCostDetailPageRecord[];
}

const ENERGY_COST_MOCK_STORAGE_KEY = 'smart-energy-cost-statistics-mock';

const getEnergyCostMockEnvDefault = () => {
	const envValue = import.meta.env.VITE_ENERGY_COST_STATISTICS_MOCK;
	if (envValue === 'true') return true;
	if (envValue === 'false') return false;
	return true;
};

export const isEnergyUsageCostStatisticsMockEnabled = () => {
	if (typeof window === 'undefined') return getEnergyCostMockEnvDefault();
	const storageValue = window.localStorage.getItem(ENERGY_COST_MOCK_STORAGE_KEY);
	if (storageValue === 'true') return true;
	if (storageValue === 'false') return false;
	return getEnergyCostMockEnvDefault();
};

export const setEnergyUsageCostStatisticsMockEnabled = (enabled: boolean) => {
	if (typeof window === 'undefined') return;
	window.localStorage.setItem(ENERGY_COST_MOCK_STORAGE_KEY, String(enabled));
};

const shouldUseEnergyCostMock = () => isEnergyUsageCostStatisticsMockEnabled();

const sleep = (timeout = 120) => new Promise((resolve) => setTimeout(resolve, timeout));

const mockResponse = async <T>(data: T): Promise<EnergyCostApiResponse<T>> => {
	await sleep();
	return {
		code: 200,
		message: 'success',
		msg: 'success',
		data,
	};
};

const formatNumber = (value: number, digits = 2) => {
	return new Intl.NumberFormat('zh-CN', {
		maximumFractionDigits: digits,
		minimumFractionDigits: digits,
	}).format(value);
};

const formatInteger = (value: number) => {
	return new Intl.NumberFormat('zh-CN', {
		maximumFractionDigits: 0,
	}).format(value);
};

const createAmountText = (value: number, unit: string) => `${formatNumber(value)}${unit}`;
const createCountText = (value: number, unit: string) => `${formatInteger(value)}${unit}`;

const createTrendRecord = (statPeriod: string, elecCost: number, waterCost: number, gasCost: number): EnergyCostTrendRecord => ({
	statPeriod,
	elecCost: createAmountText(elecCost, '元'),
	waterCost: createAmountText(waterCost, '元'),
	gasCost: createAmountText(gasCost, '元'),
});

const createSpaceRankRecord = (rank: number, spaceCode: string, cost: number): EnergyCostSpaceRankRecord => ({
	spaceCode,
	cost: createAmountText(cost, '元'),
	rank: String(rank),
});

const overviewStatsMockMap: Record<EnergyCostStatType, EnergyCostStatsData> = {
	day: {
		totalCost: createAmountText(12856.3, '元'),
		elecCost: createAmountText(9218.2, '元'),
		elecLast: createAmountText(8735.4, '元'),
		elecYoY: createAmountText(8254.6, '元'),
		waterCost: createAmountText(1498.6, '元'),
		waterLast: createAmountText(1536.2, '元'),
		waterYoY: createAmountText(1392.5, '元'),
		gasCost: createAmountText(2139.5, '元'),
		gasLast: createAmountText(2264.3, '元'),
		gasYoY: createAmountText(1986.7, '元'),
		peak: createAmountText(5182.6, '元'),
		valley: createAmountText(2645.8, '元'),
		flat: createAmountText(3208.7, '元'),
		energyTrend: [
			createTrendRecord('00:00', 268, 38, 58),
			createTrendRecord('02:00', 242, 35, 49),
			createTrendRecord('04:00', 218, 32, 43),
			createTrendRecord('06:00', 236, 34, 47),
			createTrendRecord('08:00', 295, 41, 55),
			createTrendRecord('10:00', 356, 53, 77),
			createTrendRecord('12:00', 408, 67, 96),
			createTrendRecord('14:00', 331, 58, 82),
			createTrendRecord('16:00', 294, 50, 69),
			createTrendRecord('18:00', 386, 63, 92),
			createTrendRecord('20:00', 345, 57, 84),
			createTrendRecord('22:00', 309, 48, 71),
		],
		spaceRankList: [
			createSpaceRankRecord(1, 'A栋', 3582.4),
			createSpaceRankRecord(2, 'B栋', 3028.6),
			createSpaceRankRecord(3, '综合楼', 2472.1),
			createSpaceRankRecord(4, '实验楼', 1968.8),
			createSpaceRankRecord(5, '宿舍区', 1804.4),
		],
	},
	month: {
		totalCost: createAmountText(2957010, '元'),
		elecCost: createAmountText(2419200, '元'),
		elecLast: createAmountText(2563710, '元'),
		elecYoY: createAmountText(2295800, '元'),
		waterCost: createAmountText(25725, '元'),
		waterLast: createAmountText(26215, '元'),
		waterYoY: createAmountText(24890, '元'),
		gasCost: createAmountText(13986, '元'),
		gasLast: createAmountText(15680, '元'),
		gasYoY: createAmountText(12820, '元'),
		peak: createAmountText(1096320, '元'),
		valley: createAmountText(698850, '元'),
		flat: createAmountText(624030, '元'),
		energyTrend: [
			createTrendRecord('1日', 78560, 738, 426),
			createTrendRecord('4日', 68240, 692, 398),
			createTrendRecord('7日', 71580, 745, 412),
			createTrendRecord('10日', 75620, 804, 456),
			createTrendRecord('13日', 70110, 768, 438),
			createTrendRecord('16日', 68950, 722, 401),
			createTrendRecord('19日', 81240, 853, 486),
			createTrendRecord('22日', 64350, 691, 369),
			createTrendRecord('25日', 76880, 819, 472),
			createTrendRecord('28日', 72410, 781, 451),
		],
		spaceRankList: [
			createSpaceRankRecord(1, 'E栋', 236832),
			createSpaceRankRecord(2, 'B栋', 198517),
			createSpaceRankRecord(3, 'A栋', 175829),
			createSpaceRankRecord(4, 'D栋', 162454),
			createSpaceRankRecord(5, 'C栋', 144686),
		],
	},
	year: {
		totalCost: createAmountText(31892000, '元'),
		elecCost: createAmountText(26542000, '元'),
		elecLast: createAmountText(27815600, '元'),
		elecYoY: createAmountText(24980000, '元'),
		waterCost: createAmountText(318600, '元'),
		waterLast: createAmountText(327100, '元'),
		waterYoY: createAmountText(301500, '元'),
		gasCost: createAmountText(524300, '元'),
		gasLast: createAmountText(566200, '元'),
		gasYoY: createAmountText(488900, '元'),
		peak: createAmountText(12458800, '元'),
		valley: createAmountText(7842100, '元'),
		flat: createAmountText(6235400, '元'),
		energyTrend: [
			createTrendRecord('1月', 2154200, 25700, 41280),
			createTrendRecord('2月', 2089310, 24650, 40126),
			createTrendRecord('3月', 2261500, 25880, 42960),
			createTrendRecord('4月', 2319820, 26940, 43810),
			createTrendRecord('5月', 2456100, 28160, 46720),
			createTrendRecord('6月', 2589340, 29860, 50650),
			createTrendRecord('7月', 2764820, 31650, 55820),
			createTrendRecord('8月', 2682950, 30480, 53460),
			createTrendRecord('9月', 2363180, 28710, 49230),
			createTrendRecord('10月', 2246800, 27320, 45610),
			createTrendRecord('11月', 2197520, 26160, 43950),
			createTrendRecord('12月', 2412460, 29090, 48684),
		],
		spaceRankList: [
			createSpaceRankRecord(1, 'E栋', 2823168),
			createSpaceRankRecord(2, 'A栋', 2361517),
			createSpaceRankRecord(3, 'B栋', 2287514),
			createSpaceRankRecord(4, '综合楼', 2054438),
			createSpaceRankRecord(5, '公寓区', 1962815),
		],
	},
};

const utilityCostMockMap: Record<EnergyCostTimeRange, EnergyUtilityCostData> = {
	'30d': {
		totalElec: createCountText(85600, 'kWh'),
		elecCost: createAmountText(68480, '元'),
		elecPrice: createAmountText(0.8, '元/kWh'),
		totalWater: createCountText(1250, 'm3'),
		waterCost: createAmountText(5625, '元'),
		waterPrice: createAmountText(4.5, '元/m3'),
		totalGas: createCountText(850, 'm3'),
		gasCost: createAmountText(2975, '元'),
		gasPrice: createAmountText(3.5, '元/m3'),
		statDays: '30天',
		energyTrend: [
			createTrendRecord('02-01', 2240, 168, 89),
			createTrendRecord('02-04', 2138, 172, 97),
			createTrendRecord('02-07', 2295, 181, 96),
			createTrendRecord('02-10', 2362, 188, 104),
			createTrendRecord('02-13', 2201, 176, 101),
			createTrendRecord('02-16', 2470, 194, 109),
			createTrendRecord('02-19', 2282.67, 187.5, 99.17),
			createTrendRecord('02-22', 2310.5, 190.2, 102.3),
			createTrendRecord('02-25', 2356, 196, 106),
			createTrendRecord('02-28', 2441, 201, 112),
		],
	},
	'90d': {
		totalElec: createCountText(248600, 'kWh'),
		elecCost: createAmountText(196294, '元'),
		elecPrice: createAmountText(0.79, '元/kWh'),
		totalWater: createCountText(3860, 'm3'),
		waterCost: createAmountText(17032, '元'),
		waterPrice: createAmountText(4.41, '元/m3'),
		totalGas: createCountText(2480, 'm3'),
		gasCost: createAmountText(8618, '元'),
		gasPrice: createAmountText(3.48, '元/m3'),
		statDays: '90天',
		energyTrend: [
			createTrendRecord('01-01', 6080, 512, 253),
			createTrendRecord('01-11', 6320, 538, 267),
			createTrendRecord('01-21', 6490, 556, 281),
			createTrendRecord('01-31', 6710, 568, 294),
			createTrendRecord('02-10', 6880, 592, 308),
			createTrendRecord('02-20', 7035, 618, 327),
			createTrendRecord('03-02', 7210, 635, 338),
			createTrendRecord('03-12', 7395, 661, 351),
			createTrendRecord('03-22', 7520, 678, 366),
		],
	},
	'180d': {
		totalElec: createCountText(512300, 'kWh'),
		elecCost: createAmountText(401643, '元'),
		elecPrice: createAmountText(0.78, '元/kWh'),
		totalWater: createCountText(7250, 'm3'),
		waterCost: createAmountText(31465, '元'),
		waterPrice: createAmountText(4.34, '元/m3'),
		totalGas: createCountText(4870, 'm3'),
		gasCost: createAmountText(16727, '元'),
		gasPrice: createAmountText(3.43, '元/m3'),
		statDays: '180天',
		energyTrend: [
			createTrendRecord('2025-10', 56320, 4415, 2346),
			createTrendRecord('2025-11', 59810, 4682, 2481),
			createTrendRecord('2025-12', 62495, 4871, 2596),
			createTrendRecord('2026-01', 65142, 5090, 2724),
			createTrendRecord('2026-02', 68480, 5625, 2975),
			createTrendRecord('2026-03', 69396, 5782, 3011),
		],
	},
	'1y': {
		totalElec: createCountText(1028000, 'kWh'),
		elecCost: createAmountText(801840, '元'),
		elecPrice: createAmountText(0.78, '元/kWh'),
		totalWater: createCountText(14980, 'm3'),
		waterCost: createAmountText(64830, '元'),
		waterPrice: createAmountText(4.33, '元/m3'),
		totalGas: createCountText(10150, 'm3'),
		gasCost: createAmountText(34612, '元'),
		gasPrice: createAmountText(3.41, '元/m3'),
		statDays: '365天',
		energyTrend: [
			createTrendRecord('1月', 64210, 5124, 2788),
			createTrendRecord('2月', 68480, 5625, 2975),
			createTrendRecord('3月', 70260, 5751, 3044),
			createTrendRecord('4月', 68950, 5540, 2952),
			createTrendRecord('5月', 71480, 5828, 3096),
			createTrendRecord('6月', 73120, 5976, 3182),
			createTrendRecord('7月', 75820, 6204, 3360),
			createTrendRecord('8月', 74560, 6128, 3298),
			createTrendRecord('9月', 70140, 5846, 3114),
			createTrendRecord('10月', 66890, 5482, 2896),
			createTrendRecord('11月', 65230, 5317, 2812),
			createTrendRecord('12月', 70700, 6009, 3095),
		],
	},
};

const energyDetailTypeMap: Record<EnergyCostEnergyTypeCode, { name: string; usageUnit: string; unitPriceUnit: string; baseUsage: number; basePrice: number; remark: string | null }> = {
	ELECTRICITY: {
		name: '电',
		usageUnit: 'kWh',
		unitPriceUnit: '元/kWh',
		baseUsage: 1752000,
		basePrice: 0.672,
		remark: '峰谷电价优化后',
	},
	WATER: {
		name: '水',
		usageUnit: 'm3',
		unitPriceUnit: '元/m3',
		baseUsage: 7350,
		basePrice: 3.5,
		remark: null,
	},
	GAS: {
		name: '气',
		usageUnit: 'm3',
		unitPriceUnit: '元/m3',
		baseUsage: 4680,
		basePrice: 2.99,
		remark: '锅炉运行减少',
	},
};

const detailZones = ['全部', '办公区', '实验区', '公区', '宿舍区', '食堂'];

const createDetailRows = (params: Pick<EnergyCostDetailPageParams, 'dateType' | 'statDate'>): EnergyCostDetailPageRecord[] => {
	const energyTypes: EnergyCostEnergyTypeCode[] = ['ELECTRICITY', 'WATER', 'GAS'];
	return detailZones.flatMap((zoneName, zoneIndex) =>
		energyTypes.map((energyTypeCode, energyIndex) => {
			const energyConfig = energyDetailTypeMap[energyTypeCode];
			const usageFactor = 1 - zoneIndex * 0.08;
			const typeFactor = 1 + energyIndex * 0.03;
			const usageAmount = Number((energyConfig.baseUsage * usageFactor * typeFactor).toFixed(3));
			const avgUnitPrice = Number((energyConfig.basePrice + zoneIndex * 0.018 - energyIndex * 0.006).toFixed(3));
			const costAmount = Number((usageAmount * avgUnitPrice).toFixed(2));
			const yoyRate = Number(((-3.5 + zoneIndex * 0.9 + energyIndex * 1.6) * (energyTypeCode === 'WATER' ? -1 : 1)).toFixed(1));
			const momRate = Number((-5.8 + zoneIndex * 0.7 + energyIndex * 1.9).toFixed(1));
			return {
				periodLabel: params.statDate,
				energyTypeCode,
				energyTypeName: energyConfig.name,
				usageAmount,
				usageUnit: energyConfig.usageUnit,
				avgUnitPrice,
				unitPriceUnit: energyConfig.unitPriceUnit,
				costAmount,
				yoyRate,
				momRate,
				zoneName,
				remark: zoneIndex === 0 ? energyConfig.remark : null,
			};
		})
	);
};

const createCsvText = (rows: EnergyCostDetailPageRecord[]) => {
	const header = ['时间', '能源类型', '用量', '综合单价', '费用(元)', '同比(%)', '环比(%)', '分区', '备注'];
	const body = rows.map((row) => [
		row.periodLabel,
		row.energyTypeName,
		`${row.usageAmount}${row.usageUnit}`,
		`${row.avgUnitPrice}${row.unitPriceUnit}`,
		row.costAmount,
		row.yoyRate,
		row.momRate,
		row.zoneName,
		row.remark ?? '',
	]);
	return [header, ...body]
		.map((columns) => columns.map((item) => `"${String(item).replace(/"/g, '""')}"`).join(','))
		.join('\n');
};

const getMockDetailPageData = (params: EnergyCostDetailPageParams): EnergyCostDetailPageData => {
	const rows = createDetailRows(params);
	const start = Math.max(params.pageNum - 1, 0) * params.pageSize;
	const end = start + params.pageSize;
	return {
		total: rows.length,
		pageNum: params.pageNum,
		pageSize: params.pageSize,
		list: rows.slice(start, end),
	};
};

export const getEnergyCostStats = (params: EnergyCostStatsParams): Promise<EnergyCostApiResponse<EnergyCostStatsData>> => {
	if (shouldUseEnergyCostMock()) {
		return mockResponse(overviewStatsMockMap[params.statType] || overviewStatsMockMap.month);
	}

	return request({
		url: '/api/energy/cost/stats',
		method: 'get',
		params,
	}) as Promise<EnergyCostApiResponse<EnergyCostStatsData>>;
};

export const getEnergyUtilityCost = (params: EnergyUtilityCostParams): Promise<EnergyCostApiResponse<EnergyUtilityCostData>> => {
	if (shouldUseEnergyCostMock()) {
		return mockResponse(utilityCostMockMap[params.timeRange] || utilityCostMockMap['30d']);
	}

	return request({
		url: '/api/energy/utility/cost',
		method: 'get',
		params,
	}) as Promise<EnergyCostApiResponse<EnergyUtilityCostData>>;
};

export const getEnergyCostDetailPage = (params: EnergyCostDetailPageParams): Promise<EnergyCostApiResponse<EnergyCostDetailPageData>> => {
	if (shouldUseEnergyCostMock()) {
		return mockResponse(getMockDetailPageData(params));
	}

	return request({
		url: '/api/energy/cost/detail/page',
		method: 'get',
		params,
	}) as Promise<EnergyCostApiResponse<EnergyCostDetailPageData>>;
};

export const exportEnergyCostDetail = async (params: Pick<EnergyCostDetailPageParams, 'dateType' | 'statDate'>) => {
	if (shouldUseEnergyCostMock()) {
		const rows = createDetailRows(params);
		const csvText = `\uFEFF${createCsvText(rows)}`;
		return new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
	}

	return request({
		url: '/api/energy/cost/detail/export',
		method: 'get',
		params,
		responseType: 'blob',
	});
};
