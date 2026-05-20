import type { QueryFormConfig, TableColumn } from '@zhqc-smart/table';
import type { VisitorAccessStatus } from './api';

export interface AccessRecordFormData {
	visitorName: string;
	visitorPhone: string;
	licensePlate: string;
	visitedEnterprise: string;
	visitedName: string;
	passType: string;
	passMethod: string;
	appointmentNo: string;
	passLocation: string;
	current: number;
	size: number;
}

export type AccessRecordQueryField = keyof Omit<AccessRecordFormData, 'current' | 'size'>;

export interface DetailFieldConfig {
	label: string;
	field: string;
	span?: 1 | 2;
}

export interface DetailSectionConfig {
	key: string;
	title: string;
	items: DetailFieldConfig[];
}

export interface PassRecordColumnConfig {
	key: string;
	prop: string;
	label: string;
	minWidth?: number;
	width?: number;
	type?: 'preview';
}

export const passTypeOptions = [
	{ label: '入', value: 'enter' },
	{ label: '出', value: 'exit' },
];

export const passMethodOptions = [
	{ label: '车辆通行', value: 'vehicle' },
	{ label: '行人扫码', value: 'person_scan' },
];

export const queryFormConfig: QueryFormConfig = {
	fields: [
		{ label: '访客姓名', value: 'visitorName', type: 'text', selected: true },
		{ label: '访客手机号', value: 'visitorPhone', type: 'text', selected: true },
		{ label: '车牌号', value: 'licensePlate', type: 'text', selected: true },
		{ label: '被访人企业', value: 'visitedEnterprise', type: 'text', selected: true },
		{ label: '被访人姓名', value: 'visitedName', type: 'text', selected: true },
		{ label: '通行类型', value: 'passType', type: 'select', selected: true },
		{ label: '通行方式', value: 'passMethod', type: 'select', selected: true },
		{ label: '访客单号', value: 'appointmentNo', type: 'text', selected: true },
		{ label: '通行位置', value: 'passLocation', type: 'text', selected: true },
	],
	fieldOptions: {
		passType: passTypeOptions,
		passMethod: passMethodOptions,
	},
};

const passTypeLabelMap: Record<string, string> = {
	enter: '入',
	exit: '出',
};

const passMethodLabelMap: Record<string, string> = {
	vehicle: '车辆通行',
	person_scan: '行人扫码',
};

export const tableColumns: TableColumn[] = [
	{ prop: 'appointmentNo', label: '访客单号', minWidth: 110, align: 'center' },
	{ prop: 'passTime', label: '通行时间', minWidth: 160, align: 'center' },
	{
		prop: 'passType',
		label: '通行类型',
		minWidth: 110,
		align: 'center',
		formatter: (row) => passTypeLabelMap[row.passType as string] ?? '',
	},
	{
		prop: 'passMethod',
		label: '通行方式',
		minWidth: 110,
		align: 'center',
		formatter: (row) => passMethodLabelMap[row.passMethod as string] ?? '',
	},
	{ prop: 'licensePlate', label: '车牌号', minWidth: 110, align: 'center' },
	{ prop: 'passLocation', label: '通行位置', minWidth: 130, align: 'center' },
	{ prop: 'captureUrl', label: '抓拍', width: 90, align: 'center', slot: 'captureSlot' },
	{ prop: 'visitorName', label: '访客姓名', minWidth: 110, align: 'center' },
	{ prop: 'visitorPhone', label: '访客手机号', minWidth: 130, align: 'center' },
	{ prop: 'visitedName', label: '被访人姓名', minWidth: 110, align: 'center' },
	{ prop: 'visitedEnterprise', label: '被访人企业', minWidth: 130, align: 'center' },
	{ prop: 'visitedPhone', label: '被访人手机号', minWidth: 130, align: 'center' },
	{ prop: 'status', label: '访问状态', minWidth: 110, align: 'center', slot: 'statusSlot' },
	{
		prop: 'operation',
		label: '操作',
		type: 'operation',
		width: 90,
		fixed: 'right',
		align: 'center',
		operations: [{ label: '详情', action: 'detail', type: 'primary', link: true }],
	},
];

export const detailSectionConfigs: DetailSectionConfig[] = [
	{
		key: 'visitedInfo',
		title: '被访人信息',
		items: [
			{ label: '被访人姓名', field: 'visitedName' },
			{ label: '被访人电话', field: 'visitedPhone' },
			{ label: '被访人企业', field: 'visitedEnterprise' },
			{ label: '发起时间', field: 'launchTime' },
		],
	},
	{
		key: 'visitorInfo',
		title: '访客信息',
		items: [
			{ label: '访客姓名', field: 'visitorName' },
			{ label: '访客电话', field: 'visitorPhone' },
			{ label: '通行时间', field: 'passTime' },
			{ label: '通行类型', field: 'passTypeLabel' },
			{ label: '通行方式', field: 'passMethodLabel' },
			{ label: '车牌号', field: 'licensePlate' },
			{ label: '通行位置', field: 'passLocation', span: 2 },
		],
	},
];

export const passRecordColumnConfigs: PassRecordColumnConfig[] = [
	{ key: 'seq', prop: 'seq', label: '序号', width: 80 },
	{ key: 'passTime', prop: 'passTime', label: '通行时间', minWidth: 150 },
	{ key: 'passTypeLabel', prop: 'passTypeLabel', label: '通行类型', minWidth: 110 },
	{ key: 'passMethodLabel', prop: 'passMethodLabel', label: '通行方式', minWidth: 110 },
	{ key: 'licensePlate', prop: 'licensePlate', label: '车牌号', minWidth: 110 },
	{ key: 'passLocation', prop: 'passLocation', label: '通行位置', minWidth: 130 },
	{ key: 'captureUrl', prop: 'captureUrl', label: '抓拍', width: 90, type: 'preview' },
];

export const defaultFormData: AccessRecordFormData = {
	visitorName: '',
	visitorPhone: '',
	licensePlate: '',
	visitedEnterprise: '',
	visitedName: '',
	passType: '',
	passMethod: '',
	appointmentNo: '',
	passLocation: '',
	current: 1,
	size: 10,
};

export const detailDialogTitle = '访客通行记录详情';

export const defaultStatusMeta = {
	label: '',
	className: '',
} as const;
