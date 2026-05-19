import request from '/@/utils/request';

export type ItemizedMonitorType = 'cooling' | 'lighting' | 'elevator' | 'power';

type BackendMonitorType = 'ac' | 'light' | 'elevator' | 'power';

export interface ItemizedMonitorApiResponse<T> {
	code: number;
	message?: string;
	msg?: string;
	data: T;
}

export interface ItemizedMonitorOverviewParams<T extends ItemizedMonitorType = ItemizedMonitorType> {
	monitorType: T;
}

export interface ItemizedMonitorPageParams<T extends ItemizedMonitorType = ItemizedMonitorType>
	extends ItemizedMonitorOverviewParams<T> {
	pageNum: number;
	pageSize: number;
}

export interface ItemizedMonitorDetailParams<T extends ItemizedMonitorType = ItemizedMonitorType>
	extends ItemizedMonitorOverviewParams<T> {
	id: number | string;
}

export interface ItemizedMonitorPageData<T> {
	total: number;
	pageNum: number;
	pageSize: number;
	list: T[];
}

export interface CoolingSummaryData {
	runningHostCount: number;
	coolingCapacity: number;
	copValue: number;
	totalElec: number;
}

export interface CoolingTemperatureTrendItem {
	statPeriod: string;
	supplyTemp: number;
	returnTemp: number;
}

export interface CoolingCopTrendItem {
	statPeriod: string;
	copValue: number;
}

export interface CoolingChartData {
	temperatureTrend: CoolingTemperatureTrendItem[];
	copTrend: CoolingCopTrendItem[];
}

export interface LightingSummaryData {
	onlineCircuitCount: number;
	realtimePower: number;
	todayElec: number;
	savingRate: number;
}

export interface PowerTrendItem {
	statPeriod: string;
	power: number;
}

export interface LightingZoneRatioItem {
	zoneCode: string;
	zoneName: string;
	value: number;
	ratio: number;
}

export interface LightingChartData {
	powerTrend: PowerTrendItem[];
	zoneLightingRatio: LightingZoneRatioItem[];
}

export interface ElevatorSummaryData {
	elevatorTotalCount: number;
	runningCount: number;
	realtimePower: number;
	todayElec: number;
}

export interface ElevatorRunTimesStatsItem {
	elevatorCode: string;
	elevatorName: string;
	runTimes: number;
}

export interface ElevatorChartData {
	powerTrend: PowerTrendItem[];
	runTimesStats: ElevatorRunTimesStatsItem[];
}

export interface PowerSummaryData {
	runningDeviceCount: number;
	realtimePower: number;
	todayElec: number;
	avgEfficiency: number;
}

export interface PowerDeviceDistributionItem {
	deviceTypeCode: string;
	deviceTypeName: string;
	deviceCount: number;
	ratio: number;
}

export interface PowerChartData {
	powerTrend: PowerTrendItem[];
	deviceTypeDistribution: PowerDeviceDistributionItem[];
}

export interface ItemizedMonitorOverviewBase<T extends ItemizedMonitorType, TSummary, TChartData> {
	monitorType: T;
	dataTime: string;
	summary: TSummary;
	chartData: TChartData;
	scadaConfig: Record<string, never>;
}

export type CoolingOverviewData = ItemizedMonitorOverviewBase<'cooling', CoolingSummaryData, CoolingChartData>;
export type LightingOverviewData = ItemizedMonitorOverviewBase<'lighting', LightingSummaryData, LightingChartData>;
export type ElevatorOverviewData = ItemizedMonitorOverviewBase<'elevator', ElevatorSummaryData, ElevatorChartData>;
export type PowerOverviewData = ItemizedMonitorOverviewBase<'power', PowerSummaryData, PowerChartData>;

export interface CoolingPageRecord {
	id: number;
	monitorType: 'cooling';
	deviceName: string;
	runStatusCode: string;
	runStatusName: string;
	loadRate: number;
	supplyTemp: number;
	returnTemp: number;
	copValue: number;
	power: number;
}

export interface LightingPageRecord {
	id: number;
	monitorType: 'lighting';
	circuitName: string;
	location: string;
	runStatusCode: string;
	runStatusName: string;
	power: number;
	voltage: number;
	current: number;
	todayElec: number;
}

export interface ElevatorPageRecord {
	id: number;
	monitorType: 'elevator';
	elevatorCode: string;
	elevatorType: string;
	location: string;
	runStatusCode: string;
	runStatusName: string;
	currentFloor: string;
	todayRunCount: number;
	power: number;
	todayElec: number;
}

export interface PowerPageRecord {
	id: number;
	monitorType: 'power';
	deviceName: string;
	deviceType: string;
	location: string;
	runStatusCode: string;
	runStatusName: string;
	power: number;
	efficiency: number;
	todayElec: number;
}

export interface ItemizedMonitorOverviewDataMap {
	cooling: CoolingOverviewData;
	lighting: LightingOverviewData;
	elevator: ElevatorOverviewData;
	power: PowerOverviewData;
}

export interface ItemizedMonitorPageRecordMap {
	cooling: CoolingPageRecord;
	lighting: LightingPageRecord;
	elevator: ElevatorPageRecord;
	power: PowerPageRecord;
}

export interface ItemizedMonitorDetailRecord {
	id: number;
	monitorType: ItemizedMonitorType;
	deviceName: string;
	deviceType: string;
	installLoc: string;
	runStatusCode: string;
	runStatusName: string;
	power: number;
	supplyTemp: number;
	returnTemp: number;
	copValue: number;
	voltage: number;
	current: number;
	currentFloor: string;
	todayRunCount: number;
	todayElec: number;
	loadRate: number;
	efficiency: number;
}

interface ItemizedMonitorRtBackendData {
	runHost?: string | number | null;
	coolCap?: string | number | null;
	cop?: string | number | null;
	onlineLoop?: string | number | null;
	lightPower?: string | number | null;
	elevatorTotal?: string | number | null;
	running?: string | number | null;
	elevatorPower?: string | number | null;
	runningDevice?: string | number | null;
	runPower?: string | number | null;
}

interface ItemizedMonitorTrendBackendItem {
	statPeriod?: string | null;
	supplyTemp?: string | number | null;
	returnTemp?: string | number | null;
	cop?: string | number | null;
	lightPower?: string | number | null;
	elevatorPower?: string | number | null;
	runCount?: string | number | null;
	dynPower?: string | number | null;
}

interface ItemizedMonitorZoneLightBackendItem {
	zone?: string | null;
	value?: string | number | null;
}

interface ItemizedMonitorDeviceTypeBackendItem {
	deviceType?: string | null;
	value?: string | number | null;
}

interface ItemizedMonitorUseBackendData {
	acUsages?: string | number | null;
	lightUsages?: string | number | null;
	energySaveRate?: string | number | null;
	elevatorUsages?: string | number | null;
	powerUsages?: string | number | null;
	subSystemTrend?: ItemizedMonitorTrendBackendItem[] | null;
	SubSystemTrend?: ItemizedMonitorTrendBackendItem[] | null;
	zoneLight?: ItemizedMonitorZoneLightBackendItem[] | null;
	ZoneLight?: ItemizedMonitorZoneLightBackendItem[] | null;
	deviceType?: ItemizedMonitorDeviceTypeBackendItem[] | null;
	DeviceType?: ItemizedMonitorDeviceTypeBackendItem[] | null;
}

interface ItemizedMonitorPageBackendRecord {
	id?: number | string | null;
	monitorType?: string | null;
	deviceName?: string | null;
	deviceType?: string | null;
	installLoc?: string | null;
	deviceStatus?: string | null;
	power?: string | number | null;
	supplyTemp?: string | number | null;
	returnTemp?: string | number | null;
	cop?: string | number | null;
	voltage?: string | number | null;
	current?: string | number | null;
	currentFloor?: string | null;
	runCount?: string | number | null;
	usages?: string | number | null;
	loadRate?: string | number | null;
	efficiency?: string | number | null;
}

interface ItemizedMonitorPageBackendData {
	total?: number | null;
	current?: number | null;
	size?: number | null;
	pageNum?: number | null;
	pageSize?: number | null;
	records?: ItemizedMonitorPageBackendRecord[] | null;
	list?: ItemizedMonitorPageBackendRecord[] | null;
}

const MONITOR_TYPE_TO_BACKEND: Record<ItemizedMonitorType, BackendMonitorType> = {
	cooling: 'ac',
	lighting: 'light',
	elevator: 'elevator',
	power: 'power',
};

const clampPercent = (value: number) => {
	if (!Number.isFinite(value)) return 0;
	if (value < 0) return 0;
	if (value > 100) return 100;
	return Number(value.toFixed(2));
};

const toSafeNumber = (value: unknown, fallback = 0) => {
	if (value === null || value === undefined) return fallback;
	if (typeof value === 'number') return Number.isFinite(value) ? value : fallback;
	const text = String(value).trim();
	if (!text) return fallback;
	const parsed = Number(text);
	if (Number.isFinite(parsed)) return parsed;
	const cleaned = text.replace(/[^0-9.-]/g, '');
	const cleanedParsed = Number(cleaned);
	return Number.isFinite(cleanedParsed) ? cleanedParsed : fallback;
};

const toSafeInteger = (value: unknown, fallback = 0) => {
	const parsed = Math.floor(toSafeNumber(value, fallback));
	return Number.isFinite(parsed) ? parsed : fallback;
};

const toRequestId = (value: number | string) => {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : value;
};

const toSafeString = (value: unknown, fallback = '') => {
	if (value === null || value === undefined) return fallback;
	const text = String(value).trim();
	return text || fallback;
};

const normalizePercent = (value: unknown) => {
	const parsed = toSafeNumber(value, 0);
	if (parsed > 0 && parsed <= 1) return parsed * 100;
	return parsed;
};

const resolveUseTrendList = (data?: ItemizedMonitorUseBackendData | null) => data?.subSystemTrend ?? data?.SubSystemTrend ?? [];

const resolveZoneLightList = (data?: ItemizedMonitorUseBackendData | null) => data?.zoneLight ?? data?.ZoneLight ?? [];

const resolveDeviceTypeList = (data?: ItemizedMonitorUseBackendData | null) => data?.deviceType ?? data?.DeviceType ?? [];

const pad2 = (value: number) => String(value).padStart(2, '0');

const createDataTime = () => {
	const now = new Date();
	return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())} ${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`;
};

const normalizeStatusCode = (status?: string | null) => {
	const text = toSafeString(status).toUpperCase();
	if (!text) return 'STOPPED';
	if (text.includes('FAULT') || text.includes('ERROR') || text.includes('ALARM') || text.includes('故障') || text.includes('异常')) return 'FAULT';
	if (text.includes('STANDBY') || text.includes('IDLE') || text.includes('待机')) return 'STANDBY';
	if (
		text.includes('RUNNING') ||
		text.includes('ONLINE') ||
		text.includes('ON') ||
		text.includes('开启') ||
		text.includes('运行') ||
		text.includes('正常')
	) {
		return 'RUNNING';
	}
	if (text.includes('STOP') || text.includes('OFFLINE') || text.includes('OFF') || text.includes('关闭') || text.includes('停止')) return 'STOPPED';
	return 'STOPPED';
};

const resolveStatusName = (code: string, monitorType: ItemizedMonitorType) => {
	if (monitorType === 'lighting') {
		if (code === 'RUNNING') return '开启';
		if (code === 'STANDBY') return '待机';
		if (code === 'FAULT') return '故障';
		return '关闭';
	}

	if (code === 'RUNNING') return '运行';
	if (code === 'STANDBY') return '待机';
	if (code === 'FAULT') return '故障';
	return '关闭';
};

const toPowerTrend = (
	trendList: ItemizedMonitorTrendBackendItem[],
	key: keyof ItemizedMonitorTrendBackendItem
): PowerTrendItem[] =>
	trendList.map((item) => ({
		statPeriod: toSafeString(item.statPeriod),
		power: toSafeNumber(item[key]),
	}));

const transformOverviewData = <T extends ItemizedMonitorType>(
	monitorType: T,
	rtData?: ItemizedMonitorRtBackendData | null,
	useData?: ItemizedMonitorUseBackendData | null
): ItemizedMonitorOverviewDataMap[T] => {
	const trendList = resolveUseTrendList(useData);
	const dataTime = createDataTime();

	if (monitorType === 'cooling') {
		const data: CoolingOverviewData = {
			monitorType,
			dataTime,
			summary: {
				runningHostCount: toSafeNumber(rtData?.runHost),
				coolingCapacity: toSafeNumber(rtData?.coolCap),
				copValue: toSafeNumber(rtData?.cop),
				totalElec: toSafeNumber(useData?.acUsages),
			},
			chartData: {
				temperatureTrend: trendList.map((item) => ({
					statPeriod: toSafeString(item.statPeriod),
					supplyTemp: toSafeNumber(item.supplyTemp),
					returnTemp: toSafeNumber(item.returnTemp),
				})),
				copTrend: trendList.map((item) => ({
					statPeriod: toSafeString(item.statPeriod),
					copValue: toSafeNumber(item.cop),
				})),
			},
			scadaConfig: {},
		};
		return data as ItemizedMonitorOverviewDataMap[T];
	}

	if (monitorType === 'lighting') {
		const zoneLightList = resolveZoneLightList(useData);
		const totalZoneValue = zoneLightList.reduce((sum, item) => sum + toSafeNumber(item.value), 0);
		const data: LightingOverviewData = {
			monitorType,
			dataTime,
			summary: {
				onlineCircuitCount: toSafeNumber(rtData?.onlineLoop),
				realtimePower: toSafeNumber(rtData?.lightPower),
				todayElec: toSafeNumber(useData?.lightUsages),
				savingRate: normalizePercent(useData?.energySaveRate),
			},
			chartData: {
				powerTrend: toPowerTrend(trendList, 'lightPower'),
				zoneLightingRatio: zoneLightList.map((item, index) => {
					const zoneName = toSafeString(item.zone, `分区${index + 1}`);
					const value = toSafeNumber(item.value);
					const ratio = totalZoneValue > 0 ? Number(((value / totalZoneValue) * 100).toFixed(2)) : 0;
					return {
						zoneCode: `ZONE_${index + 1}`,
						zoneName,
						value,
						ratio,
					};
				}),
			},
			scadaConfig: {},
		};
		return data as ItemizedMonitorOverviewDataMap[T];
	}

	if (monitorType === 'elevator') {
		const data: ElevatorOverviewData = {
			monitorType,
			dataTime,
			summary: {
				elevatorTotalCount: toSafeNumber(rtData?.elevatorTotal),
				runningCount: toSafeNumber(rtData?.running),
				realtimePower: toSafeNumber(rtData?.elevatorPower),
				todayElec: toSafeNumber(useData?.elevatorUsages),
			},
			chartData: {
				powerTrend: toPowerTrend(trendList, 'elevatorPower'),
				runTimesStats: trendList.map((item) => {
					const period = toSafeString(item.statPeriod, '--');
					return {
						elevatorCode: period,
						elevatorName: period,
						runTimes: toSafeNumber(item.runCount),
					};
				}),
			},
			scadaConfig: {},
		};
		return data as ItemizedMonitorOverviewDataMap[T];
	}

	const deviceTypeList = resolveDeviceTypeList(useData);
	const totalDeviceValue = deviceTypeList.reduce((sum, item) => sum + toSafeNumber(item.value), 0);
	const data: PowerOverviewData = {
		monitorType: 'power',
		dataTime,
		summary: {
			runningDeviceCount: toSafeNumber(rtData?.runningDevice),
			realtimePower: toSafeNumber(rtData?.runPower),
			todayElec: toSafeNumber(useData?.powerUsages),
			avgEfficiency: 0,
		},
		chartData: {
			powerTrend: toPowerTrend(trendList, 'dynPower'),
			deviceTypeDistribution: deviceTypeList.map((item, index) => {
				const deviceTypeName = toSafeString(item.deviceType, `类型${index + 1}`);
				const value = toSafeNumber(item.value);
				const ratio = totalDeviceValue > 0 ? Number(((value / totalDeviceValue) * 100).toFixed(2)) : 0;
				return {
					deviceTypeCode: `TYPE_${index + 1}`,
					deviceTypeName,
					deviceCount: Math.round(value),
					ratio,
				};
			}),
		},
		scadaConfig: {},
	};

	return data as ItemizedMonitorOverviewDataMap[T];
};

const transformCoolingRow = (
	record: ItemizedMonitorPageBackendRecord,
	id: number,
	maxPower: number
): CoolingPageRecord => {
	const statusCode = normalizeStatusCode(record.deviceStatus);
	const power = toSafeNumber(record.power);
	const rawLoadRate = toSafeNumber(record.loadRate, Number.NaN);
	const derivedLoadRate = Number.isFinite(rawLoadRate)
		? clampPercent(rawLoadRate)
		: maxPower > 0
			? clampPercent((power / maxPower) * 100)
			: statusCode === 'RUNNING'
				? 100
				: 0;

	return {
		id,
		monitorType: 'cooling',
		deviceName: toSafeString(record.deviceName, '--'),
		runStatusCode: statusCode,
		runStatusName: resolveStatusName(statusCode, 'cooling'),
		loadRate: derivedLoadRate,
		supplyTemp: toSafeNumber(record.supplyTemp),
		returnTemp: toSafeNumber(record.returnTemp),
		copValue: toSafeNumber(record.cop),
		power,
	};
};

const transformLightingRow = (record: ItemizedMonitorPageBackendRecord, id: number): LightingPageRecord => {
	const statusCode = normalizeStatusCode(record.deviceStatus);
	return {
		id,
		monitorType: 'lighting',
		circuitName: toSafeString(record.deviceName, '--'),
		location: toSafeString(record.installLoc, '--'),
		runStatusCode: statusCode,
		runStatusName: resolveStatusName(statusCode, 'lighting'),
		power: toSafeNumber(record.power),
		voltage: toSafeNumber(record.voltage),
		current: toSafeNumber(record.current),
		todayElec: toSafeNumber(record.usages),
	};
};

const transformElevatorRow = (record: ItemizedMonitorPageBackendRecord, id: number): ElevatorPageRecord => {
	const statusCode = normalizeStatusCode(record.deviceStatus);
	return {
		id,
		monitorType: 'elevator',
		elevatorCode: toSafeString(record.deviceName, '--'),
		elevatorType: toSafeString(record.deviceType, '--'),
		location: toSafeString(record.installLoc, '--'),
		runStatusCode: statusCode,
		runStatusName: resolveStatusName(statusCode, 'elevator'),
		currentFloor: toSafeString(record.currentFloor, '--'),
		todayRunCount: toSafeNumber(record.runCount),
		power: toSafeNumber(record.power),
		todayElec: toSafeNumber(record.usages),
	};
};

const transformPowerRow = (
	record: ItemizedMonitorPageBackendRecord,
	id: number,
	maxPower: number
): PowerPageRecord => {
	const statusCode = normalizeStatusCode(record.deviceStatus);
	const power = toSafeNumber(record.power);
	const rawEfficiency = toSafeNumber(record.efficiency, Number.NaN);
	const efficiency = Number.isFinite(rawEfficiency)
		? clampPercent(normalizePercent(rawEfficiency))
		: maxPower > 0
			? clampPercent((power / maxPower) * 100)
			: statusCode === 'RUNNING'
				? 100
				: 0;

	return {
		id,
		monitorType: 'power',
		deviceName: toSafeString(record.deviceName, '--'),
		deviceType: toSafeString(record.deviceType, '--'),
		location: toSafeString(record.installLoc, '--'),
		runStatusCode: statusCode,
		runStatusName: resolveStatusName(statusCode, 'power'),
		power,
		efficiency,
		todayElec: toSafeNumber(record.usages),
	};
};

const transformPageData = <T extends ItemizedMonitorType>(
	monitorType: T,
	backendData: ItemizedMonitorPageBackendData | null | undefined,
	params: ItemizedMonitorPageParams<T>
): ItemizedMonitorPageData<ItemizedMonitorPageRecordMap[T]> => {
	const pageNum = toSafeInteger(backendData?.current ?? backendData?.pageNum, params.pageNum);
	const pageSize = toSafeInteger(backendData?.size ?? backendData?.pageSize, params.pageSize);
	const rawList = backendData?.records ?? backendData?.list ?? [];
	const fallbackStartId = (pageNum - 1) * pageSize + 1;
	const maxPower = rawList.reduce((max, item) => Math.max(max, toSafeNumber(item.power)), 0);

	let list: ItemizedMonitorPageRecordMap[T][] = [];

	if (monitorType === 'cooling') {
		list = rawList.map((item, index) => {
			const id = toSafeInteger(item.id, fallbackStartId + index);
			return transformCoolingRow(item, id, maxPower) as ItemizedMonitorPageRecordMap[T];
		});
	} else if (monitorType === 'lighting') {
		list = rawList.map((item, index) => {
			const id = toSafeInteger(item.id, fallbackStartId + index);
			return transformLightingRow(item, id) as ItemizedMonitorPageRecordMap[T];
		});
	} else if (monitorType === 'elevator') {
		list = rawList.map((item, index) => {
			const id = toSafeInteger(item.id, fallbackStartId + index);
			return transformElevatorRow(item, id) as ItemizedMonitorPageRecordMap[T];
		});
	} else {
		list = rawList.map((item, index) => {
			const id = toSafeInteger(item.id, fallbackStartId + index);
			return transformPowerRow(item, id, maxPower) as ItemizedMonitorPageRecordMap[T];
		});
	}

	return {
		total: toSafeInteger(backendData?.total),
		pageNum,
		pageSize,
		list,
	};
};

const transformDetailData = <T extends ItemizedMonitorType>(
	monitorType: T,
	backendData: ItemizedMonitorPageBackendRecord | null | undefined,
	requestId: number | string
): ItemizedMonitorDetailRecord => {
	const statusCode = normalizeStatusCode(backendData?.deviceStatus);
	const power = toSafeNumber(backendData?.power);
	const rawLoadRate = toSafeNumber(backendData?.loadRate, Number.NaN);
	const loadRate = Number.isFinite(rawLoadRate) ? clampPercent(rawLoadRate) : statusCode === 'RUNNING' ? 100 : 0;
	const rawEfficiency = toSafeNumber(backendData?.efficiency, Number.NaN);
	const efficiency = Number.isFinite(rawEfficiency) ? clampPercent(normalizePercent(rawEfficiency)) : statusCode === 'RUNNING' ? 100 : 0;

	return {
		id: toSafeInteger(backendData?.id, toSafeInteger(requestId, 0)),
		monitorType,
		deviceName: toSafeString(backendData?.deviceName, '--'),
		deviceType: toSafeString(backendData?.deviceType, '--'),
		installLoc: toSafeString(backendData?.installLoc, '--'),
		runStatusCode: statusCode,
		runStatusName: resolveStatusName(statusCode, monitorType),
		power,
		supplyTemp: toSafeNumber(backendData?.supplyTemp),
		returnTemp: toSafeNumber(backendData?.returnTemp),
		copValue: toSafeNumber(backendData?.cop),
		voltage: toSafeNumber(backendData?.voltage),
		current: toSafeNumber(backendData?.current),
		currentFloor: toSafeString(backendData?.currentFloor, '--'),
		todayRunCount: toSafeNumber(backendData?.runCount),
		todayElec: toSafeNumber(backendData?.usages),
		loadRate,
		efficiency,
	};
};

export const getItemizedSystemMonitorOverview = async <T extends ItemizedMonitorType>(
	params: ItemizedMonitorOverviewParams<T>
): Promise<ItemizedMonitorApiResponse<ItemizedMonitorOverviewDataMap[T]>> => {
	const [rtResponse, useResponse] = (await Promise.all([
		request({
			url: '/platform/sub/system/view',
			method: 'post',
		}),
		request({
			url: '/platform/sub/system/use',
			method: 'post',
		}),
	])) as [ItemizedMonitorApiResponse<ItemizedMonitorRtBackendData>, ItemizedMonitorApiResponse<ItemizedMonitorUseBackendData>];

	return {
		code: useResponse.code ?? rtResponse.code,
		msg: useResponse.msg ?? rtResponse.msg,
		message: useResponse.message ?? rtResponse.message,
		data: transformOverviewData(params.monitorType, rtResponse.data, useResponse.data),
	};
};

export const getItemizedSystemMonitorPage = async <T extends ItemizedMonitorType>(
	params: ItemizedMonitorPageParams<T>
): Promise<ItemizedMonitorApiResponse<ItemizedMonitorPageData<ItemizedMonitorPageRecordMap[T]>>> => {
	const response = (await request({
		url: '/platform/sub/system/page',
		method: 'post',
		data: {
			monitorType: MONITOR_TYPE_TO_BACKEND[params.monitorType],
			current: params.pageNum,
			size: params.pageSize,
		},
	})) as ItemizedMonitorApiResponse<ItemizedMonitorPageBackendData>;

	return {
		...response,
		data: transformPageData(params.monitorType, response.data, params),
	};
};

export const getItemizedSystemMonitorDetail = async <T extends ItemizedMonitorType>(
	params: ItemizedMonitorDetailParams<T>
): Promise<ItemizedMonitorApiResponse<ItemizedMonitorDetailRecord>> => {
	const response = (await request({
		url: '/platform/sub/system/detail',
		method: 'post',
		data: {
			monitorType: MONITOR_TYPE_TO_BACKEND[params.monitorType],
			id: toRequestId(params.id),
		},
	})) as ItemizedMonitorApiResponse<ItemizedMonitorPageBackendRecord>;

	return {
		...response,
		data: transformDetailData(params.monitorType, response.data, params.id),
	};
};
