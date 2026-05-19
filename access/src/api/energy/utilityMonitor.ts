import request from '/@/utils/request';

export type UtilityMonitorType = 'elec' | 'water' | 'gas' | 'heat';

export interface UtilityMonitorApiResponse<T> {
	code: number;
	message?: string;
	msg?: string;
	data: T;
}

export interface UtilityMonitorOverviewParams {
	monitorType: UtilityMonitorType;
}

export interface UtilityMonitorTrendRecord {
	statPeriod: string;
	realtimePower: string;
	waterCons: string;
	gasCons: string;
	supplyTemp: string;
	returnTemp: string;
}

export interface UtilityMonitorSpaceRankRecord {
	spaceCode: string;
	zoneWater: string;
	zoneGas: string;
	zoneHeat: string;
}

export interface UtilityMonitorOverviewData {
	monitorType: UtilityMonitorType;
	power: string;
	todayElec: string;
	powerFactor: string;
	loadRate: string;
	phaseACurrent: string;
	phaseBCurrent: string;
	phaseCCurrent: string;
	realtimeFlow: string;
	todayWater: string;
	poolLevel: string;
	leakageRate: string;
	todayGas: string;
	pipePressure: string;
	safetyStatus: string;
	heatSupply: string;
	todayHeat: string;
	supplyTemp: string;
	returnTemp: string;
	energyTrend: UtilityMonitorTrendRecord[];
	spaceRankList: UtilityMonitorSpaceRankRecord[];
	scadaConfig: Record<string, string | number | boolean | null | undefined>;
}

export interface UtilityMonitorMeterPageParams {
	monitorType: UtilityMonitorType;
	pageNum: number;
	pageSize: number;
}

export interface UtilityMonitorMeterPageRecord {
	id: number;
	monitorType: UtilityMonitorType;
	meterName: string;
	installLoc: string;
	voltage: string;
	current: string;
	power: string;
	cumulativeReading: string;
	todayElec: string;
	status: string;
	phaseACurrent: string;
	phaseBCurrent: string;
	phaseCCurrent: string;
	instantFlow: string;
	pressure: string;
	waterConsum: string;
	gasConsum: string;
	supplyWaterTemp: string;
	returnWaterTemp: string;
	cumulativeHeat: string;
	tenantId: number;
	createBy: string;
	createTime: string;
	updateBy: string;
	updateTime: string;
	isDeleted: number;
}

export interface UtilityMonitorMeterPageData {
	total: number;
	pageNum: number;
	pageSize: number;
	list: UtilityMonitorMeterPageRecord[];
}

interface UtilityMonitorRtBackendData {
	activePower?: string | number | null;
	powerFactor?: string | number | null;
	phaseACurrent?: string | number | null;
	phaseBCurrent?: string | number | null;
	phaseCCurrent?: string | number | null;
	realtimeFlow?: string | number | null;
	poolLevel?: string | number | null;
	gasFlow?: string | number | null;
	pipePressure?: string | number | null;
	safetyStatus?: string | null;
	totalHeat?: string | number | null;
	supplyTemp?: string | number | null;
	returnTemp?: string | number | null;
}

interface UtilityMonitorZoneBackendItem {
	zone?: string | null;
	value?: string | number | null;
}

interface UtilityMonitorUseBackendData {
	todayElec?: string | number | null;
	todayWater?: string | number | null;
	todayGas?: string | number | null;
	todayHeat?: string | number | null;
	leakageRate?: string | number | null;
	monitorTrend?: UtilityMonitorTrendRecord[] | null;
	zoneWater?: UtilityMonitorZoneBackendItem[] | null;
	zoneGas?: UtilityMonitorZoneBackendItem[] | null;
	zoneHeat?: UtilityMonitorZoneBackendItem[] | null;
}

interface UtilityMonitorMeterPageBackendRecord {
	id?: number | string | null;
	monitorType?: string | null;
	meterName?: string | null;
	installLoc?: string | null;
	voltage?: string | number | null;
	current?: string | number | null;
	power?: string | number | null;
	cumReading?: string | number | null;
	cumulativeReading?: string | number | null;
	todayElec?: string | number | null;
	status?: string | null;
	phaseACurrent?: string | number | null;
	phaseBCurrent?: string | number | null;
	phaseCCurrent?: string | number | null;
	instantFlow?: string | number | null;
	pressure?: string | number | null;
	waterConsum?: string | number | null;
	gasConsum?: string | number | null;
	supplyWaterTemp?: string | number | null;
	returnWaterTemp?: string | number | null;
	cumulativeHeat?: string | number | null;
	tenantId?: number | string | null;
	createBy?: string | null;
	createTime?: string | null;
	updateBy?: string | null;
	updateTime?: string | null;
	isDeleted?: number | null;
}

interface UtilityMonitorMeterPageBackendData {
	total?: number | null;
	current?: number | null;
	size?: number | null;
	records?: UtilityMonitorMeterPageBackendRecord[] | null;
	pageNum?: number | null;
	pageSize?: number | null;
	list?: UtilityMonitorMeterPageBackendRecord[] | null;
}

const UTILITY_MONITOR_MOCK_STORAGE_KEY = 'smart-energy-utility-monitor-mock';

const getUtilityMonitorMockEnvDefault = () => {
	const envValue = import.meta.env.VITE_UTILITY_MONITOR_MOCK;
	if (envValue === 'true') return true;
	if (envValue === 'false') return false;
	return false;
};

export const isUtilityMonitorMockEnabled = () => {
	if (typeof window === 'undefined') return getUtilityMonitorMockEnvDefault();
	const storageValue = window.localStorage.getItem(UTILITY_MONITOR_MOCK_STORAGE_KEY);
	if (storageValue === 'true') return true;
	if (storageValue === 'false') return false;
	return getUtilityMonitorMockEnvDefault();
};

export const setUtilityMonitorMockEnabled = (enabled: boolean) => {
	if (typeof window === 'undefined') return;
	window.localStorage.setItem(UTILITY_MONITOR_MOCK_STORAGE_KEY, String(enabled));
};

const shouldUseUtilityMonitorMock = () => isUtilityMonitorMockEnabled();

const sleep = (timeout = 120) => new Promise((resolve) => window.setTimeout(resolve, timeout));

const mockResponse = async <T>(data: T): Promise<UtilityMonitorApiResponse<T>> => {
	await sleep();
	return {
		code: 200,
		message: 'success',
		data,
	};
};

const createTrendRecord = (
	statPeriod: string,
	values: Partial<Omit<UtilityMonitorTrendRecord, 'statPeriod'>>
): UtilityMonitorTrendRecord => ({
	statPeriod,
	realtimePower: values.realtimePower ?? '',
	waterCons: values.waterCons ?? '',
	gasCons: values.gasCons ?? '',
	supplyTemp: values.supplyTemp ?? '',
	returnTemp: values.returnTemp ?? '',
});

const createSpaceRankRecord = (
	spaceCode: string,
	values: Partial<Omit<UtilityMonitorSpaceRankRecord, 'spaceCode'>>
): UtilityMonitorSpaceRankRecord => ({
	spaceCode,
	zoneWater: values.zoneWater ?? '',
	zoneGas: values.zoneGas ?? '',
	zoneHeat: values.zoneHeat ?? '',
});

const createEmptyOverview = (monitorType: UtilityMonitorType): UtilityMonitorOverviewData => ({
	monitorType,
	power: '',
	todayElec: '',
	powerFactor: '',
	loadRate: '',
	phaseACurrent: '',
	phaseBCurrent: '',
	phaseCCurrent: '',
	realtimeFlow: '',
	todayWater: '',
	poolLevel: '',
	leakageRate: '',
	todayGas: '',
	pipePressure: '',
	safetyStatus: '',
	heatSupply: '',
	todayHeat: '',
	supplyTemp: '',
	returnTemp: '',
	energyTrend: [],
	spaceRankList: [],
	scadaConfig: {},
});

const utilityMonitorOverviewMockMap: Record<UtilityMonitorType, UtilityMonitorOverviewData> = {
	elec: {
		...createEmptyOverview('elec'),
		power: '1250.50',
		todayElec: '37500.00',
		powerFactor: '0.92',
		loadRate: '0.78',
		phaseACurrent: '185.2',
		phaseBCurrent: '182.5',
		phaseCCurrent: '184.8',
		energyTrend: [
			createTrendRecord('00:00', { realtimePower: '1100.3' }),
			createTrendRecord('02:00', { realtimePower: '1050.8' }),
			createTrendRecord('04:00', { realtimePower: '980.5' }),
			createTrendRecord('06:00', { realtimePower: '1185.6' }),
			createTrendRecord('08:00', { realtimePower: '1216.3' }),
			createTrendRecord('10:00', { realtimePower: '1268.4' }),
			createTrendRecord('12:00', { realtimePower: '1198.2' }),
			createTrendRecord('14:00', { realtimePower: '1235.9' }),
			createTrendRecord('16:00', { realtimePower: '1286.8' }),
			createTrendRecord('18:00', { realtimePower: '1332.4' }),
			createTrendRecord('20:00', { realtimePower: '1308.5' }),
			createTrendRecord('22:00', { realtimePower: '1246.2' }),
		],
		spaceRankList: [
			createSpaceRankRecord('A栋', {}),
			createSpaceRankRecord('B栋', {}),
			createSpaceRankRecord('E栋', {}),
		],
		scadaConfig: {},
	},
	water: {
		...createEmptyOverview('water'),
		realtimeFlow: '10.6',
		todayWater: '258',
		poolLevel: '70.5',
		leakageRate: '5.50',
		energyTrend: [
			createTrendRecord('00:00', { waterCons: '4.8' }),
			createTrendRecord('02:00', { waterCons: '5.8' }),
			createTrendRecord('04:00', { waterCons: '6.8' }),
			createTrendRecord('06:00', { waterCons: '7.4' }),
			createTrendRecord('08:00', { waterCons: '6.9' }),
			createTrendRecord('10:00', { waterCons: '8.5' }),
			createTrendRecord('12:00', { waterCons: '4.8' }),
			createTrendRecord('14:00', { waterCons: '6.7' }),
			createTrendRecord('16:00', { waterCons: '6.7' }),
			createTrendRecord('18:00', { waterCons: '8.5' }),
			createTrendRecord('20:00', { waterCons: '6.9' }),
			createTrendRecord('22:00', { waterCons: '7.4' }),
		],
		spaceRankList: [
			createSpaceRankRecord('A栋', { zoneWater: '45.6' }),
			createSpaceRankRecord('B栋', { zoneWater: '52.3' }),
			createSpaceRankRecord('C栋', { zoneWater: '39.8' }),
			createSpaceRankRecord('D栋', { zoneWater: '34.2' }),
			createSpaceRankRecord('E栋', { zoneWater: '22.5' }),
		],
		scadaConfig: {
			municipalPressure: '0.31 MPa',
			reservoirLevel: '70.5 %',
			reservoirStorage: '145 m³',
			tankLevel: '60.1 %',
			tankStorage: '34 m³',
		},
	},
	gas: {
		...createEmptyOverview('gas'),
		realtimeFlow: '9.64',
		todayGas: '245',
		pipePressure: '2.32',
		safetyStatus: '正常',
		energyTrend: [
			createTrendRecord('00:00', { gasCons: '3320' }),
			createTrendRecord('02:00', { gasCons: '2710' }),
			createTrendRecord('04:00', { gasCons: '2890' }),
			createTrendRecord('06:00', { gasCons: '3090' }),
			createTrendRecord('08:00', { gasCons: '2860' }),
			createTrendRecord('10:00', { gasCons: '3290' }),
			createTrendRecord('12:00', { gasCons: '1620' }),
			createTrendRecord('14:00', { gasCons: '2510' }),
			createTrendRecord('16:00', { gasCons: '2520' }),
			createTrendRecord('18:00', { gasCons: '3070' }),
			createTrendRecord('20:00', { gasCons: '2570' }),
			createTrendRecord('22:00', { gasCons: '2740' }),
		],
		spaceRankList: [
			createSpaceRankRecord('1#锅炉', { zoneGas: '86' }),
			createSpaceRankRecord('2#锅炉', { zoneGas: '61' }),
			createSpaceRankRecord('3#锅炉', { zoneGas: '44' }),
			createSpaceRankRecord('4#锅炉', { zoneGas: '32' }),
			createSpaceRankRecord('5#锅炉', { zoneGas: '23' }),
		],
		scadaConfig: {},
	},
	heat: {
		...createEmptyOverview('heat'),
		heatSupply: '125.5',
		todayHeat: '458',
		supplyTemp: '66',
		returnTemp: '50',
		energyTrend: [
			createTrendRecord('00:00', { supplyTemp: '68', returnTemp: '54' }),
			createTrendRecord('02:00', { supplyTemp: '60', returnTemp: '47' }),
			createTrendRecord('04:00', { supplyTemp: '63', returnTemp: '51' }),
			createTrendRecord('06:00', { supplyTemp: '65', returnTemp: '49' }),
			createTrendRecord('08:00', { supplyTemp: '62', returnTemp: '39' }),
			createTrendRecord('10:00', { supplyTemp: '68', returnTemp: '49' }),
			createTrendRecord('12:00', { supplyTemp: '47', returnTemp: '46' }),
			createTrendRecord('14:00', { supplyTemp: '59', returnTemp: '62' }),
			createTrendRecord('16:00', { supplyTemp: '59', returnTemp: '39' }),
			createTrendRecord('18:00', { supplyTemp: '65', returnTemp: '45' }),
			createTrendRecord('20:00', { supplyTemp: '58', returnTemp: '48' }),
			createTrendRecord('22:00', { supplyTemp: '60', returnTemp: '50' }),
		],
		spaceRankList: [
			createSpaceRankRecord('A栋', { zoneHeat: '215' }),
			createSpaceRankRecord('B栋', { zoneHeat: '136' }),
			createSpaceRankRecord('C栋', { zoneHeat: '168' }),
		],
		scadaConfig: {},
	},
};

const statusCycle = ['正常', '提醒', '预警', '严重'] as const;

const createMeterRecordBase = (
	id: number,
	monitorType: UtilityMonitorType,
	meterName: string,
	installLoc: string,
	status: string
): UtilityMonitorMeterPageRecord => ({
	id,
	monitorType,
	meterName,
	installLoc,
	voltage: '',
	current: '',
	power: '',
	cumulativeReading: '',
	todayElec: '',
	status,
	phaseACurrent: '',
	phaseBCurrent: '',
	phaseCCurrent: '',
	instantFlow: '',
	pressure: '',
	waterConsum: '',
	gasConsum: '',
	supplyWaterTemp: '',
	returnWaterTemp: '',
	cumulativeHeat: '',
	tenantId: 1001,
	createBy: 'system',
	createTime: '2026-03-19 08:00:00',
	updateBy: 'admin',
	updateTime: '2026-03-19 09:50:00',
	isDeleted: 0,
});

const electricityMeterMockList = Array.from({ length: 18 }, (_, index) => {
	const building = String.fromCharCode(65 + (index % 9));
	const floor = (index % 6) + 1;
	const cabinetNo = (index % 3) + 1;
	const current = 168 + index * 6.5;
	const power = 112 + index * 4.8;

	return {
		...createMeterRecordBase(
			index + 1,
			'elec',
			`${building}栋${floor}层配电室#${cabinetNo}配电柜电表`,
			`${building}栋${floor}层配电室`,
			statusCycle[index % statusCycle.length]
		),
		voltage: '380V',
		current: `${current.toFixed(1)}A`,
		power: `${power.toFixed(1)}KW`,
		cumulativeReading: `${(375000 + index * 24800).toFixed(0)}kWh`,
		todayElec: `${(375 + index * 18.5).toFixed(1)}kWh`,
		phaseACurrent: `${(current + 1.2).toFixed(1)}A`,
		phaseBCurrent: `${(current - 2.1).toFixed(1)}A`,
		phaseCCurrent: `${(current - 0.4).toFixed(1)}A`,
		updateTime: `2026-03-19 ${String(9 + Math.floor(index / 2)).padStart(2, '0')}:${index % 2 === 0 ? '15' : '45'}:00`,
	};
});

const waterMeterMockList = Array.from({ length: 16 }, (_, index) => {
	const zone = String.fromCharCode(65 + (index % 10));
	const instantFlow = 25.8 - index * 0.8;
	const pressure = 0.35 - index * 0.005;
	const waterConsum = 620.5 - index * 18.2;

	return {
		...createMeterRecordBase(index + 101, 'water', `${zone}栋供水分表`, `${zone}栋水井`, statusCycle[index % statusCycle.length]),
		cumulativeReading: `${(78500 + index * 1860).toFixed(0)}m³`,
		instantFlow: `${Math.max(3.2, instantFlow).toFixed(1)}m³/h`,
		pressure: `${Math.max(0.22, pressure).toFixed(2)}MPa`,
		waterConsum: `${Math.max(125.5, waterConsum).toFixed(1)}m³`,
		supplyWaterTemp: `${(24.5 + index * 0.1).toFixed(1)}°C`,
		updateTime: `2026-03-19 ${String(9 + Math.floor(index / 3)).padStart(2, '0')}:${index % 2 === 0 ? '20' : '40'}:00`,
	};
});

const gasMeterMockList = Array.from({ length: 15 }, (_, index) => {
	const areaLabel = index < 5 ? `${index + 1}#锅炉区` : `${String.fromCharCode(65 + (index % 6))}区调压站`;
	const instantFlow = 18.5 - index * 0.7;
	const pressure = 0.2 - index * 0.004;
	const gasConsum = 156.8 - index * 6.3;

	return {
		...createMeterRecordBase(
			index + 201,
			'gas',
			index < 5 ? `${index + 1}#锅炉燃气表` : `${String.fromCharCode(65 + (index % 6))}区燃气表`,
			areaLabel,
			statusCycle[index % statusCycle.length]
		),
		cumulativeReading: `${(45800 + index * 1320).toFixed(0)}m³`,
		instantFlow: `${Math.max(6.5, instantFlow).toFixed(1)}m³/h`,
		pressure: `${Math.max(0.08, pressure).toFixed(2)}MPa`,
		gasConsum: `${Math.max(62.5, gasConsum).toFixed(1)}m³`,
		updateTime: `2026-03-19 ${String(9 + Math.floor(index / 3)).padStart(2, '0')}:${index % 2 === 0 ? '10' : '35'}:00`,
	};
});

const heatMeterMockList = Array.from({ length: 14 }, (_, index) => {
	const zone = String.fromCharCode(65 + (index % 10));
	const instantFlow = 30.2 - index * 0.7;
	const supplyWaterTemp = 55.2 - index * 0.6;
	const returnWaterTemp = 42.8 - index * 0.45;

	return {
		...createMeterRecordBase(index + 301, 'heat', `${zone}栋热量表`, `${zone}栋换热站`, statusCycle[index % statusCycle.length]),
		instantFlow: `${Math.max(12.8, instantFlow).toFixed(1)}m³/h`,
		pressure: `${Math.max(0.24, 0.4 - index * 0.01).toFixed(2)}MPa`,
		supplyWaterTemp: `${Math.max(41.5, supplyWaterTemp).toFixed(1)}°C`,
		returnWaterTemp: `${Math.max(32.6, returnWaterTemp).toFixed(1)}°C`,
		cumulativeHeat: `${(8500 + index * 268).toFixed(0)}GJ`,
		updateTime: `2026-03-19 ${String(9 + Math.floor(index / 2)).padStart(2, '0')}:${index % 2 === 0 ? '05' : '25'}:00`,
	};
});

const utilityMonitorMeterPageMockMap: Record<UtilityMonitorType, UtilityMonitorMeterPageRecord[]> = {
	elec: electricityMeterMockList,
	water: waterMeterMockList,
	gas: gasMeterMockList,
	heat: heatMeterMockList,
};

const paginateList = <T>(list: T[], pageNum: number, pageSize: number) => {
	const safePageNum = Math.max(1, Number(pageNum) || 1);
	const safePageSize = Math.max(1, Number(pageSize) || 10);
	const start = (safePageNum - 1) * safePageSize;

	return {
		total: list.length,
		pageNum: safePageNum,
		pageSize: safePageSize,
		list: list.slice(start, start + safePageSize),
	};
};

const monitorTypeList: UtilityMonitorType[] = ['elec', 'water', 'gas', 'heat'];

const isUtilityMonitorType = (value: string): value is UtilityMonitorType => monitorTypeList.includes(value as UtilityMonitorType);

const toDisplayValue = (value: string | number | null | undefined) => {
	if (value === null || value === undefined) return '';
	return String(value).trim();
};

const normalizeMonitorType = (value: string | null | undefined, fallback: UtilityMonitorType): UtilityMonitorType => {
	const rawValue = toDisplayValue(value).toLowerCase();
	return isUtilityMonitorType(rawValue) ? rawValue : fallback;
};

const toSafeNumber = (value: number | string | null | undefined, fallback = 0) => {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : fallback;
};

const mapZoneRankList = (
	monitorType: UtilityMonitorType,
	useData: UtilityMonitorUseBackendData | null | undefined
): UtilityMonitorSpaceRankRecord[] => {
	const createRecord = (zone: UtilityMonitorZoneBackendItem, field: 'zoneWater' | 'zoneGas' | 'zoneHeat'): UtilityMonitorSpaceRankRecord => ({
		spaceCode: toDisplayValue(zone.zone),
		zoneWater: field === 'zoneWater' ? toDisplayValue(zone.value) : '',
		zoneGas: field === 'zoneGas' ? toDisplayValue(zone.value) : '',
		zoneHeat: field === 'zoneHeat' ? toDisplayValue(zone.value) : '',
	});

	if (monitorType === 'water') return (useData?.zoneWater ?? []).map((item) => createRecord(item, 'zoneWater'));
	if (monitorType === 'gas') return (useData?.zoneGas ?? []).map((item) => createRecord(item, 'zoneGas'));
	if (monitorType === 'heat') return (useData?.zoneHeat ?? []).map((item) => createRecord(item, 'zoneHeat'));
	return [];
};

const transformUtilityMonitorOverview = (
	monitorType: UtilityMonitorType,
	rtData: UtilityMonitorRtBackendData | null | undefined,
	useData: UtilityMonitorUseBackendData | null | undefined
): UtilityMonitorOverviewData => {
	const energyTrend =
		useData?.monitorTrend?.map((item) => ({
			statPeriod: toDisplayValue(item.statPeriod),
			realtimePower: toDisplayValue(item.realtimePower),
			waterCons: toDisplayValue(item.waterCons),
			gasCons: toDisplayValue(item.gasCons),
			supplyTemp: toDisplayValue(item.supplyTemp),
			returnTemp: toDisplayValue(item.returnTemp),
		})) ?? [];

	return {
		...createEmptyOverview(monitorType),
		monitorType,
		power: toDisplayValue(rtData?.activePower),
		todayElec: toDisplayValue(useData?.todayElec),
		powerFactor: toDisplayValue(rtData?.powerFactor),
		loadRate: '',
		phaseACurrent: toDisplayValue(rtData?.phaseACurrent),
		phaseBCurrent: toDisplayValue(rtData?.phaseBCurrent),
		phaseCCurrent: toDisplayValue(rtData?.phaseCCurrent),
		realtimeFlow: monitorType === 'gas' ? toDisplayValue(rtData?.gasFlow) : toDisplayValue(rtData?.realtimeFlow),
		todayWater: toDisplayValue(useData?.todayWater),
		poolLevel: toDisplayValue(rtData?.poolLevel),
		leakageRate: toDisplayValue(useData?.leakageRate),
		todayGas: toDisplayValue(useData?.todayGas),
		pipePressure: toDisplayValue(rtData?.pipePressure),
		safetyStatus: toDisplayValue(rtData?.safetyStatus),
		heatSupply: toDisplayValue(rtData?.totalHeat),
		todayHeat: toDisplayValue(useData?.todayHeat),
		supplyTemp: toDisplayValue(rtData?.supplyTemp),
		returnTemp: toDisplayValue(rtData?.returnTemp),
		energyTrend,
		spaceRankList: mapZoneRankList(monitorType, useData),
		scadaConfig: {},
	};
};

const transformUtilityMeterPageRecord = (
	record: UtilityMonitorMeterPageBackendRecord,
	monitorType: UtilityMonitorType
): UtilityMonitorMeterPageRecord => ({
	id: toSafeNumber(record.id),
	monitorType: normalizeMonitorType(record.monitorType, monitorType),
	meterName: toDisplayValue(record.meterName),
	installLoc: toDisplayValue(record.installLoc),
	voltage: toDisplayValue(record.voltage),
	current: toDisplayValue(record.current),
	power: toDisplayValue(record.power),
	cumulativeReading: toDisplayValue(record.cumReading ?? record.cumulativeReading),
	todayElec: toDisplayValue(record.todayElec),
	status: toDisplayValue(record.status),
	phaseACurrent: toDisplayValue(record.phaseACurrent),
	phaseBCurrent: toDisplayValue(record.phaseBCurrent),
	phaseCCurrent: toDisplayValue(record.phaseCCurrent),
	instantFlow: toDisplayValue(record.instantFlow),
	pressure: toDisplayValue(record.pressure),
	waterConsum: toDisplayValue(record.waterConsum),
	gasConsum: toDisplayValue(record.gasConsum),
	supplyWaterTemp: toDisplayValue(record.supplyWaterTemp),
	returnWaterTemp: toDisplayValue(record.returnWaterTemp),
	cumulativeHeat: toDisplayValue(record.cumulativeHeat),
	tenantId: toSafeNumber(record.tenantId),
	createBy: toDisplayValue(record.createBy),
	createTime: toDisplayValue(record.createTime),
	updateBy: toDisplayValue(record.updateBy),
	updateTime: toDisplayValue(record.updateTime),
	isDeleted: toSafeNumber(record.isDeleted),
});

const transformUtilityMeterPageData = (
	backendData: UtilityMonitorMeterPageBackendData | null | undefined,
	params: UtilityMonitorMeterPageParams
): UtilityMonitorMeterPageData => {
	const rawList = backendData?.records ?? backendData?.list ?? [];
	return {
		total: toSafeNumber(backendData?.total),
		pageNum: toSafeNumber(backendData?.current ?? backendData?.pageNum, params.pageNum),
		pageSize: toSafeNumber(backendData?.size ?? backendData?.pageSize, params.pageSize),
		list: rawList.map((item) => transformUtilityMeterPageRecord(item, params.monitorType)),
	};
};

export const getUtilityMonitorOverview = async (
	params: UtilityMonitorOverviewParams
): Promise<UtilityMonitorApiResponse<UtilityMonitorOverviewData>> => {
	if (shouldUseUtilityMonitorMock()) {
		return mockResponse(utilityMonitorOverviewMockMap[params.monitorType]);
	}

	const [rtResponse, useResponse] = (await Promise.all([
		request({
			url: '/platform/monitor/meter/view',
			method: 'post',
		}),
		request({
			url: '/platform/monitor/meter/use',
			method: 'post',
		}),
	])) as [UtilityMonitorApiResponse<UtilityMonitorRtBackendData>, UtilityMonitorApiResponse<UtilityMonitorUseBackendData>];

	return {
		code: useResponse.code ?? rtResponse.code,
		msg: useResponse.msg ?? rtResponse.msg,
		message: useResponse.message ?? rtResponse.message,
		data: transformUtilityMonitorOverview(params.monitorType, rtResponse.data, useResponse.data),
	};
};

export const getUtilityMonitorMeterPage = async (
	params: UtilityMonitorMeterPageParams
): Promise<UtilityMonitorApiResponse<UtilityMonitorMeterPageData>> => {
	if (shouldUseUtilityMonitorMock()) {
		return mockResponse(paginateList(utilityMonitorMeterPageMockMap[params.monitorType], params.pageNum, params.pageSize));
	}

	const response = (await request({
		url: '/platform/monitor/meter/page',
		method: 'post',
		data: {
			monitorType: params.monitorType,
			current: params.pageNum,
			size: params.pageSize,
		},
	})) as UtilityMonitorApiResponse<UtilityMonitorMeterPageBackendData>;

	return {
		...response,
		data: transformUtilityMeterPageData(response.data, params),
	};
};
