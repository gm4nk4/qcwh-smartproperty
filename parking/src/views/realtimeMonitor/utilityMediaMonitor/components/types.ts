import type { UtilityMonitorType } from '/@/api/energy/utilityMonitor';

export type MeterStatus = 'normal' | 'notice' | 'warning' | 'critical';
export type MetricValueTone = 'default' | 'success' | 'warning' | 'danger';

export interface MetricCardItem {
	key: string;
	label: string;
	value: string;
	unit: string;
	icon: string;
	valueTone?: MetricValueTone;
}

export interface TrendSeriesItem {
	name: string;
	data: number[];
	color?: string;
	fillArea?: boolean;
	areaOpacity?: number;
	lineType?: 'solid' | 'dashed';
}

export interface TrendChartConfig {
	title: string;
	unit: string;
	yAxisName: string;
	xAxis: string[];
	series: TrendSeriesItem[];
	decimals?: number;
}

export interface DistributionItem {
	name: string;
	value: number;
	color: string;
}

export interface DistributionConfig {
	title: string;
	centerLabel: string;
	unit: string;
	items: DistributionItem[];
}

export interface BarDistributionItem {
	name: string;
	value: number;
	paletteIndex?: number;
	color?: string;
	gradientColor?: string;
}

export interface BarDistributionConfig {
	title: string;
	unit: string;
	yAxisName: string;
	legendLabel: string;
	items: BarDistributionItem[];
	decimals?: number;
}

export interface PhaseChartConfig {
	title: string;
	yAxisName: string;
	mode: 'single';
	singleSeriesName: string;
	lastPeriodData: number[];
	currentData: number[];
	xAxisData: string[];
	decimals?: number;
}

export interface DiagramSummaryItem {
	label: string;
	value: string;
	helper: string;
}

export interface DiagramConfig {
	title: string;
	badge: string;
	hint: string;
	mode: 'generic' | 'water';
	summary?: DiagramSummaryItem[];
}

export interface TableColumnConfig {
	key: string;
	label: string;
	minWidth?: number;
	width?: number;
	fixed?: 'right';
	type?: 'status' | 'actions';
	tooltip?: boolean;
}

export interface UtilityMonitorMeterRow {
	id: string;
	monitorType: UtilityMonitorType;
	name: string;
	location: string;
	status: MeterStatus;
	voltage: string;
	current: string;
	power: string;
	energy: string;
	cumulativeReading: string;
	todayElec: string;
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
	createBy: string;
	createTime: string;
	updateBy: string;
	updateTime: string;
	tenantId: string;
	[key: string]: string | MeterStatus;
}

export interface TableHeaderAction {
	label: string;
	icon?: 'refresh';
	loading?: boolean;
	onClick?: () => void | Promise<void>;
}

export interface TablePaginationConfig {
	total: number;
	pageNum: number;
	pageSize: number;
	pageSizes?: number[];
}

export interface TableConfig {
	title: string;
	columns: TableColumnConfig[];
	rows: UtilityMonitorMeterRow[];
	actions: string[];
	loading?: boolean;
	headerAction?: TableHeaderAction;
	pagination?: TablePaginationConfig;
	onPageChange?: (page: number) => void | Promise<void>;
	onPageSizeChange?: (size: number) => void | Promise<void>;
	onActionClick?: (action: string, row: UtilityMonitorMeterRow) => void | Promise<void>;
}
