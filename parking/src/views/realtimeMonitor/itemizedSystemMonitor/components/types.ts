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
}

export interface TrendChartConfig {
	title: string;
	unit: string;
	yAxisName: string;
	xAxis: string[];
	series: TrendSeriesItem[];
	decimals?: number;
}

export interface PieChartItem {
	name: string;
	value: number;
	color: string;
}

export interface PieSecondaryChartConfig {
	type: 'pie';
	title: string;
	centerLabel: string;
	unit: string;
	items: PieChartItem[];
}

export interface BarChartItem {
	name: string;
	value: number;
	paletteIndex?: number;
	color?: string;
	gradientColor?: string;
}

export interface BarSecondaryChartConfig {
	type: 'bar';
	title: string;
	unit: string;
	yAxisName: string;
	legendLabel: string;
	items: BarChartItem[];
	decimals?: number;
}

export type SecondaryChartConfig = PieSecondaryChartConfig | BarSecondaryChartConfig;

export type ItemizedTableCellValue = string | number;

export interface ItemizedTableRow {
	id: string;
	[key: string]: ItemizedTableCellValue;
}

export interface TableColumnConfig {
	key: string;
	label: string;
	minWidth?: number;
	width?: number;
	fixed?: 'right';
	type?: 'status' | 'efficiency' | 'actions';
	tooltip?: boolean;
	cellClass?: string | ((row: ItemizedTableRow) => string | undefined);
	formatter?: (row: ItemizedTableRow) => string | number;
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

export interface TableStatusMeta {
	label?: string;
	className: string;
}

export interface TableConfig {
	sectionTitle: string;
	columns: TableColumnConfig[];
	rows: ItemizedTableRow[];
	actions: string[];
	loading?: boolean;
	headerAction?: TableHeaderAction;
	pagination?: TablePaginationConfig;
	statusMap?: Record<string, TableStatusMeta>;
	onPageChange?: (page: number) => void | Promise<void>;
	onPageSizeChange?: (size: number) => void | Promise<void>;
	onActionClick?: (action: string, row: ItemizedTableRow) => void | Promise<void>;
}
