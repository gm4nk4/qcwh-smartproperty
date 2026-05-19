export type ItemizedMonitorType = 'cooling' | 'lighting' | 'elevator' | 'power';

export interface ItemizedMonitorResponse<T> {
	code: number;
	message: string;
	data: T;
}

export interface ItemizedMonitorParams<T extends ItemizedMonitorType = ItemizedMonitorType> {
	monitorType: T;
}

export interface ItemizedMonitorPageParams<T extends ItemizedMonitorType = ItemizedMonitorType> extends ItemizedMonitorParams<T> {
	pageNum: number;
	pageSize: number;
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

const MOCK_DATA_TIME = '2026-03-19 14:30:00';
const MOCK_DELAY = 180;

const coolingOverviewData: CoolingOverviewData = {
	monitorType: 'cooling',
	dataTime: MOCK_DATA_TIME,
	summary: {
		runningHostCount: 2,
		coolingCapacity: 1250,
		copValue: 4.2,
		totalElec: 8569,
	},
	chartData: {
		temperatureTrend: [
			{ statPeriod: '00:00', supplyTemp: 6.8, returnTemp: 12.1 },
			{ statPeriod: '02:00', supplyTemp: 6.9, returnTemp: 11.9 },
			{ statPeriod: '04:00', supplyTemp: 7.1, returnTemp: 12.2 },
			{ statPeriod: '06:00', supplyTemp: 7.0, returnTemp: 12.0 },
			{ statPeriod: '08:00', supplyTemp: 6.7, returnTemp: 11.6 },
			{ statPeriod: '10:00', supplyTemp: 6.5, returnTemp: 11.3 },
			{ statPeriod: '12:00', supplyTemp: 6.6, returnTemp: 11.4 },
			{ statPeriod: '14:00', supplyTemp: 6.8, returnTemp: 11.7 },
			{ statPeriod: '16:00', supplyTemp: 7.0, returnTemp: 12.0 },
			{ statPeriod: '18:00', supplyTemp: 7.2, returnTemp: 12.3 },
			{ statPeriod: '20:00', supplyTemp: 7.1, returnTemp: 12.1 },
			{ statPeriod: '22:00', supplyTemp: 6.9, returnTemp: 11.8 },
		],
		copTrend: [
			{ statPeriod: '00:00', copValue: 4.1 },
			{ statPeriod: '02:00', copValue: 4.08 },
			{ statPeriod: '04:00', copValue: 4.03 },
			{ statPeriod: '06:00', copValue: 4.11 },
			{ statPeriod: '08:00', copValue: 4.18 },
			{ statPeriod: '10:00', copValue: 4.24 },
			{ statPeriod: '12:00', copValue: 4.19 },
			{ statPeriod: '14:00', copValue: 4.22 },
			{ statPeriod: '16:00', copValue: 4.27 },
			{ statPeriod: '18:00', copValue: 4.16 },
			{ statPeriod: '20:00', copValue: 4.09 },
			{ statPeriod: '22:00', copValue: 4.04 },
		],
	},
	scadaConfig: {},
};

const lightingOverviewData: LightingOverviewData = {
	monitorType: 'lighting',
	dataTime: MOCK_DATA_TIME,
	summary: {
		onlineCircuitCount: 156,
		realtimePower: 285,
		todayElec: 2456,
		savingRate: 23,
	},
	chartData: {
		powerTrend: [
			{ statPeriod: '00:00', power: 205 },
			{ statPeriod: '02:00', power: 198 },
			{ statPeriod: '04:00', power: 190 },
			{ statPeriod: '06:00', power: 186 },
			{ statPeriod: '08:00', power: 224 },
			{ statPeriod: '10:00', power: 268 },
			{ statPeriod: '12:00', power: 285 },
			{ statPeriod: '14:00', power: 279 },
			{ statPeriod: '16:00', power: 265 },
			{ statPeriod: '18:00', power: 242 },
			{ statPeriod: '20:00', power: 218 },
			{ statPeriod: '22:00', power: 196 },
		],
		zoneLightingRatio: [
			{ zoneCode: 'A', zoneName: 'A栋', value: 78, ratio: 27.37 },
			{ zoneCode: 'B', zoneName: 'B栋', value: 82, ratio: 28.77 },
			{ zoneCode: 'C', zoneName: 'C栋', value: 65, ratio: 22.81 },
			{ zoneCode: 'D', zoneName: 'D栋', value: 60, ratio: 21.05 },
		],
	},
	scadaConfig: {},
};

const elevatorOverviewData: ElevatorOverviewData = {
	monitorType: 'elevator',
	dataTime: MOCK_DATA_TIME,
	summary: {
		elevatorTotalCount: 12,
		runningCount: 8,
		realtimePower: 156,
		todayElec: 1245,
	},
	chartData: {
		powerTrend: [
			{ statPeriod: '00:00', power: 102 },
			{ statPeriod: '02:00', power: 96 },
			{ statPeriod: '04:00', power: 90 },
			{ statPeriod: '06:00', power: 88 },
			{ statPeriod: '08:00', power: 121 },
			{ statPeriod: '10:00', power: 149 },
			{ statPeriod: '12:00', power: 156 },
			{ statPeriod: '14:00', power: 152 },
			{ statPeriod: '16:00', power: 146 },
			{ statPeriod: '18:00', power: 132 },
			{ statPeriod: '20:00', power: 118 },
			{ statPeriod: '22:00', power: 104 },
		],
		runTimesStats: [
			{ elevatorCode: 'EL001', elevatorName: '1#客梯', runTimes: 256 },
			{ elevatorCode: 'EL002', elevatorName: '2#客梯', runTimes: 248 },
			{ elevatorCode: 'EL003', elevatorName: '3#货梯', runTimes: 85 },
			{ elevatorCode: 'EL004', elevatorName: '4#扶梯', runTimes: 132 },
			{ elevatorCode: 'EL005', elevatorName: '5#扶梯', runTimes: 128 },
			{ elevatorCode: 'EL006', elevatorName: '6#货梯', runTimes: 94 },
		],
	},
	scadaConfig: {},
};

const powerOverviewData: PowerOverviewData = {
	monitorType: 'power',
	dataTime: MOCK_DATA_TIME,
	summary: {
		runningDeviceCount: 18,
		realtimePower: 568,
		todayElec: 5689,
		avgEfficiency: 87,
	},
	chartData: {
		powerTrend: [
			{ statPeriod: '00:00', power: 420 },
			{ statPeriod: '02:00', power: 398 },
			{ statPeriod: '04:00', power: 405 },
			{ statPeriod: '06:00', power: 412 },
			{ statPeriod: '08:00', power: 468 },
			{ statPeriod: '10:00', power: 526 },
			{ statPeriod: '12:00', power: 568 },
			{ statPeriod: '14:00', power: 551 },
			{ statPeriod: '16:00', power: 534 },
			{ statPeriod: '18:00', power: 503 },
			{ statPeriod: '20:00', power: 475 },
			{ statPeriod: '22:00', power: 436 },
		],
		deviceTypeDistribution: [
			{ deviceTypeCode: 'PUMP', deviceTypeName: '水泵', deviceCount: 6, ratio: 33.33 },
			{ deviceTypeCode: 'FAN', deviceTypeName: '风机', deviceCount: 5, ratio: 27.78 },
			{ deviceTypeCode: 'MOTOR', deviceTypeName: '电机', deviceCount: 4, ratio: 22.22 },
			{ deviceTypeCode: 'OTHER', deviceTypeName: '其他', deviceCount: 3, ratio: 16.67 },
		],
	},
	scadaConfig: {},
};

const coolingPageList: CoolingPageRecord[] = [
	{ id: 1, monitorType: 'cooling', deviceName: '1#冷水机组', runStatusCode: 'RUNNING', runStatusName: '运行', loadRate: 75.13, supplyTemp: 7.0, returnTemp: 12.0, copValue: 4.3, power: 320 },
	{ id: 2, monitorType: 'cooling', deviceName: '2#冷水机组', runStatusCode: 'RUNNING', runStatusName: '运行', loadRate: 69.35, supplyTemp: 7.1, returnTemp: 11.9, copValue: 4.1, power: 298 },
	{ id: 3, monitorType: 'cooling', deviceName: '3#冷水机组', runStatusCode: 'STANDBY', runStatusName: '待机', loadRate: 0, supplyTemp: 0, returnTemp: 0, copValue: 0, power: 0 },
	{ id: 4, monitorType: 'cooling', deviceName: '4#冷水机组', runStatusCode: 'RUNNING', runStatusName: '运行', loadRate: 72.48, supplyTemp: 6.9, returnTemp: 11.8, copValue: 4.2, power: 305 },
	{ id: 5, monitorType: 'cooling', deviceName: '5#冷水机组', runStatusCode: 'STOPPED', runStatusName: '关闭', loadRate: 0, supplyTemp: 0, returnTemp: 0, copValue: 0, power: 0 },
	{ id: 6, monitorType: 'cooling', deviceName: '6#冷水机组', runStatusCode: 'FAULT', runStatusName: '故障', loadRate: 0, supplyTemp: 0, returnTemp: 0, copValue: 0, power: 0 },
	{ id: 7, monitorType: 'cooling', deviceName: '7#冷水机组', runStatusCode: 'RUNNING', runStatusName: '运行', loadRate: 66.52, supplyTemp: 7.2, returnTemp: 12.3, copValue: 4.0, power: 286 },
	{ id: 8, monitorType: 'cooling', deviceName: '8#冷水机组', runStatusCode: 'STANDBY', runStatusName: '待机', loadRate: 0, supplyTemp: 0, returnTemp: 0, copValue: 0, power: 0 },
	{ id: 9, monitorType: 'cooling', deviceName: '9#冷水机组', runStatusCode: 'RUNNING', runStatusName: '运行', loadRate: 64.18, supplyTemp: 7.0, returnTemp: 11.7, copValue: 4.1, power: 274 },
	{ id: 10, monitorType: 'cooling', deviceName: '10#冷水机组', runStatusCode: 'RUNNING', runStatusName: '运行', loadRate: 71.06, supplyTemp: 6.8, returnTemp: 11.6, copValue: 4.2, power: 301 },
	{ id: 11, monitorType: 'cooling', deviceName: '11#冷水机组', runStatusCode: 'STOPPED', runStatusName: '关闭', loadRate: 0, supplyTemp: 0, returnTemp: 0, copValue: 0, power: 0 },
	{ id: 12, monitorType: 'cooling', deviceName: '12#冷水机组', runStatusCode: 'RUNNING', runStatusName: '运行', loadRate: 68.42, supplyTemp: 7.1, returnTemp: 12.0, copValue: 4.0, power: 292 },
];

const lightingPageList: LightingPageRecord[] = [
	{ id: 1, monitorType: 'lighting', circuitName: 'A栋1F照明', location: 'A栋1层', runStatusCode: 'RUNNING', runStatusName: '开启', power: 12.5, voltage: 220, current: 56.8, todayElec: 125 },
	{ id: 2, monitorType: 'lighting', circuitName: 'A栋2F照明', location: 'A栋2层', runStatusCode: 'RUNNING', runStatusName: '开启', power: 11.8, voltage: 220, current: 53.6, todayElec: 118 },
	{ id: 3, monitorType: 'lighting', circuitName: 'A栋3F照明', location: 'A栋3层', runStatusCode: 'RUNNING', runStatusName: '开启', power: 10.9, voltage: 220, current: 49.7, todayElec: 109 },
	{ id: 4, monitorType: 'lighting', circuitName: 'B栋1F照明', location: 'B栋1层', runStatusCode: 'RUNNING', runStatusName: '开启', power: 13.4, voltage: 220, current: 60.9, todayElec: 133 },
	{ id: 5, monitorType: 'lighting', circuitName: 'B栋2F照明', location: 'B栋2层', runStatusCode: 'STOPPED', runStatusName: '关闭', power: 0, voltage: 220, current: 0, todayElec: 84 },
	{ id: 6, monitorType: 'lighting', circuitName: 'C栋1F照明', location: 'C栋1层', runStatusCode: 'RUNNING', runStatusName: '开启', power: 14.2, voltage: 220, current: 64.1, todayElec: 142 },
	{ id: 7, monitorType: 'lighting', circuitName: 'C栋2F照明', location: 'C栋2层', runStatusCode: 'RUNNING', runStatusName: '开启', power: 12.1, voltage: 220, current: 54.8, todayElec: 121 },
	{ id: 8, monitorType: 'lighting', circuitName: 'D栋1F照明', location: 'D栋1层', runStatusCode: 'RUNNING', runStatusName: '开启', power: 11.6, voltage: 220, current: 52.7, todayElec: 116 },
	{ id: 9, monitorType: 'lighting', circuitName: 'D栋2F照明', location: 'D栋2层', runStatusCode: 'STOPPED', runStatusName: '关闭', power: 0, voltage: 220, current: 0, todayElec: 76 },
	{ id: 10, monitorType: 'lighting', circuitName: '地下车库照明', location: '地下1层', runStatusCode: 'RUNNING', runStatusName: '开启', power: 18.3, voltage: 220, current: 83.1, todayElec: 183 },
	{ id: 11, monitorType: 'lighting', circuitName: '景观照明回路', location: '园区室外', runStatusCode: 'STANDBY', runStatusName: '待机', power: 0, voltage: 220, current: 0, todayElec: 58 },
	{ id: 12, monitorType: 'lighting', circuitName: '应急照明回路', location: '配电间', runStatusCode: 'FAULT', runStatusName: '故障', power: 3.2, voltage: 198, current: 18.4, todayElec: 43 },
];

const elevatorPageList: ElevatorPageRecord[] = [
	{ id: 1, monitorType: 'elevator', elevatorCode: '1#客梯', elevatorType: '客梯', location: 'A栋', runStatusCode: 'RUNNING', runStatusName: '运行', currentFloor: '5F', todayRunCount: 256, power: 18.5, todayElec: 125 },
	{ id: 2, monitorType: 'elevator', elevatorCode: '2#客梯', elevatorType: '客梯', location: 'A栋', runStatusCode: 'RUNNING', runStatusName: '运行', currentFloor: '3F', todayRunCount: 248, power: 17.2, todayElec: 118 },
	{ id: 3, monitorType: 'elevator', elevatorCode: '3#货梯', elevatorType: '货梯', location: 'B栋', runStatusCode: 'STANDBY', runStatusName: '待机', currentFloor: '1F', todayRunCount: 85, power: 0, todayElec: 62 },
	{ id: 4, monitorType: 'elevator', elevatorCode: '4#扶梯', elevatorType: '扶梯', location: '商业连廊', runStatusCode: 'RUNNING', runStatusName: '运行', currentFloor: '1F', todayRunCount: 132, power: 14.6, todayElec: 88 },
	{ id: 5, monitorType: 'elevator', elevatorCode: '5#扶梯', elevatorType: '扶梯', location: '商业连廊', runStatusCode: 'RUNNING', runStatusName: '运行', currentFloor: '2F', todayRunCount: 128, power: 14.4, todayElec: 86 },
	{ id: 6, monitorType: 'elevator', elevatorCode: '6#货梯', elevatorType: '货梯', location: '后勤区', runStatusCode: 'STOPPED', runStatusName: '关闭', currentFloor: '1F', todayRunCount: 0, power: 0, todayElec: 14 },
	{ id: 7, monitorType: 'elevator', elevatorCode: '7#客梯', elevatorType: '客梯', location: 'C栋', runStatusCode: 'RUNNING', runStatusName: '运行', currentFloor: '8F', todayRunCount: 204, power: 16.8, todayElec: 112 },
	{ id: 8, monitorType: 'elevator', elevatorCode: '8#客梯', elevatorType: '客梯', location: 'C栋', runStatusCode: 'RUNNING', runStatusName: '运行', currentFloor: '12F', todayRunCount: 198, power: 16.2, todayElec: 105 },
	{ id: 9, monitorType: 'elevator', elevatorCode: '9#货梯', elevatorType: '货梯', location: '物流区', runStatusCode: 'STANDBY', runStatusName: '待机', currentFloor: '1F', todayRunCount: 54, power: 0, todayElec: 35 },
	{ id: 10, monitorType: 'elevator', elevatorCode: '10#客梯', elevatorType: '客梯', location: 'D栋', runStatusCode: 'RUNNING', runStatusName: '运行', currentFloor: '6F', todayRunCount: 176, power: 15.9, todayElec: 98 },
	{ id: 11, monitorType: 'elevator', elevatorCode: '11#扶梯', elevatorType: '扶梯', location: '主入口', runStatusCode: 'FAULT', runStatusName: '故障', currentFloor: '1F', todayRunCount: 12, power: 5.6, todayElec: 26 },
	{ id: 12, monitorType: 'elevator', elevatorCode: '12#客梯', elevatorType: '客梯', location: 'D栋', runStatusCode: 'RUNNING', runStatusName: '运行', currentFloor: '10F', todayRunCount: 188, power: 16.1, todayElec: 101 },
];

const powerPageList: PowerPageRecord[] = [
	{ id: 1, monitorType: 'power', deviceName: '1#生活水泵', deviceType: '水泵', location: '水泵房', runStatusCode: 'RUNNING', runStatusName: '运行', power: 45, efficiency: 92, todayElec: 458 },
	{ id: 2, monitorType: 'power', deviceName: '1#排风机', deviceType: '风机', location: '地下车库', runStatusCode: 'RUNNING', runStatusName: '运行', power: 22, efficiency: 88, todayElec: 256 },
	{ id: 3, monitorType: 'power', deviceName: '2#生活水泵', deviceType: '水泵', location: '水泵房', runStatusCode: 'RUNNING', runStatusName: '运行', power: 43, efficiency: 91, todayElec: 436 },
	{ id: 4, monitorType: 'power', deviceName: '1#消防泵', deviceType: '水泵', location: '消防泵房', runStatusCode: 'STANDBY', runStatusName: '待机', power: 0, efficiency: 0, todayElec: 36 },
	{ id: 5, monitorType: 'power', deviceName: '1#送风机', deviceType: '风机', location: '机房层', runStatusCode: 'RUNNING', runStatusName: '运行', power: 28, efficiency: 86, todayElec: 298 },
	{ id: 6, monitorType: 'power', deviceName: '2#送风机', deviceType: '风机', location: '机房层', runStatusCode: 'RUNNING', runStatusName: '运行', power: 26, efficiency: 84, todayElec: 281 },
	{ id: 7, monitorType: 'power', deviceName: '1#冷却塔风机', deviceType: '风机', location: '屋顶', runStatusCode: 'RUNNING', runStatusName: '运行', power: 31, efficiency: 89, todayElec: 312 },
	{ id: 8, monitorType: 'power', deviceName: '1#加压泵', deviceType: '水泵', location: '生活水泵房', runStatusCode: 'RUNNING', runStatusName: '运行', power: 19, efficiency: 87, todayElec: 202 },
	{ id: 9, monitorType: 'power', deviceName: '1#电机', deviceType: '电机', location: '设备夹层', runStatusCode: 'RUNNING', runStatusName: '运行', power: 38, efficiency: 85, todayElec: 341 },
	{ id: 10, monitorType: 'power', deviceName: '2#电机', deviceType: '电机', location: '设备夹层', runStatusCode: 'STOPPED', runStatusName: '关闭', power: 0, efficiency: 0, todayElec: 29 },
	{ id: 11, monitorType: 'power', deviceName: '备用排风机', deviceType: '风机', location: '地下车库', runStatusCode: 'STANDBY', runStatusName: '待机', power: 0, efficiency: 0, todayElec: 18 },
	{ id: 12, monitorType: 'power', deviceName: '应急水泵', deviceType: '水泵', location: '消防泵房', runStatusCode: 'FAULT', runStatusName: '故障', power: 7, efficiency: 24, todayElec: 51 },
];

const overviewDataMap: ItemizedMonitorOverviewDataMap = {
	cooling: coolingOverviewData,
	lighting: lightingOverviewData,
	elevator: elevatorOverviewData,
	power: powerOverviewData,
};

const pageListMap: { [K in ItemizedMonitorType]: ItemizedMonitorPageRecordMap[K][] } = {
	cooling: coolingPageList,
	lighting: lightingPageList,
	elevator: elevatorPageList,
	power: powerPageList,
};

const sleep = (timeout = MOCK_DELAY) => new Promise((resolve) => setTimeout(resolve, timeout));

const paginate = <T>(list: T[], pageNum: number, pageSize: number): ItemizedMonitorPageData<T> => {
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

export const getItemizedSystemMonitorMockOverview = async <T extends ItemizedMonitorType>(
	params: ItemizedMonitorParams<T>
): Promise<ItemizedMonitorResponse<ItemizedMonitorOverviewDataMap[T]>> => {
	await sleep();
	return {
		code: 200,
		message: 'success',
		data: overviewDataMap[params.monitorType] as ItemizedMonitorOverviewDataMap[T],
	};
};

export const getItemizedSystemMonitorMockPage = async <T extends ItemizedMonitorType>(
	params: ItemizedMonitorPageParams<T>
): Promise<ItemizedMonitorResponse<ItemizedMonitorPageData<ItemizedMonitorPageRecordMap[T]>>> => {
	await sleep();
	return {
		code: 200,
		message: 'success',
		data: paginate(pageListMap[params.monitorType], params.pageNum, params.pageSize) as ItemizedMonitorPageData<ItemizedMonitorPageRecordMap[T]>,
	};
};
