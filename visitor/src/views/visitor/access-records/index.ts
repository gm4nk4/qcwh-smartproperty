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

export interface QueryFieldOption {
	label: string;
	value: string;
}

export interface QueryFieldConfig {
	key: string;
	field: AccessRecordQueryField;
	label: string;
	component: 'el-input' | 'el-select';
	props: Record<string, unknown>;
	options?: QueryFieldOption[];
}

export interface AccessRecordTableColumnConfig {
	key: string;
	prop: string;
	label: string;
	minWidth?: number;
	width?: number;
	type?: 'index' | 'status' | 'operation' | 'preview';
	fixed?: 'left' | 'right';
}

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

export const passTypeOptions: QueryFieldOption[] = [
	{ label: '全部', value: '' },
	{ label: '入', value: 'enter' },
	{ label: '出', value: 'exit' },
];

export const passMethodOptions: QueryFieldOption[] = [
	{ label: '全部', value: '' },
	{ label: '车辆通行', value: 'vehicle' },
	{ label: '行人扫码', value: 'person_scan' },
];

export const queryFieldConfigs: QueryFieldConfig[] = [
	{
		key: 'visitorName',
		field: 'visitorName',
		label: '访客姓名',
		component: 'el-input',
		props: {
			placeholder: '请输入',
			clearable: true,
		},
	},
	{
		key: 'visitorPhone',
		field: 'visitorPhone',
		label: '访客手机号',
		component: 'el-input',
		props: {
			placeholder: '请输入',
			clearable: true,
		},
	},
	{
		key: 'licensePlate',
		field: 'licensePlate',
		label: '车牌号',
		component: 'el-input',
		props: {
			placeholder: '请输入',
			clearable: true,
		},
	},
	{
		key: 'visitedEnterprise',
		field: 'visitedEnterprise',
		label: '被访人企业',
		component: 'el-input',
		props: {
			placeholder: '请输入',
			clearable: true,
		},
	},
	{
		key: 'visitedName',
		field: 'visitedName',
		label: '被访人姓名',
		component: 'el-input',
		props: {
			placeholder: '请输入',
			clearable: true,
		},
	},
	{
		key: 'passType',
		field: 'passType',
		label: '通行类型',
		component: 'el-select',
		props: {
			placeholder: '请选择',
			clearable: true,
		},
		options: passTypeOptions,
	},
	{
		key: 'passMethod',
		field: 'passMethod',
		label: '通行方式',
		component: 'el-select',
		props: {
			placeholder: '请选择',
			clearable: true,
		},
		options: passMethodOptions,
	},
	{
		key: 'appointmentNo',
		field: 'appointmentNo',
		label: '访客单号',
		component: 'el-input',
		props: {
			placeholder: '请输入',
			clearable: true,
		},
	},
	{
		key: 'passLocation',
		field: 'passLocation',
		label: '通行位置',
		component: 'el-input',
		props: {
			placeholder: '请输入',
			clearable: true,
		},
	},
];

export const tableColumnConfigs: AccessRecordTableColumnConfig[] = [
	{ key: 'seq', prop: 'seq', label: '序号', width: 70, type: 'index', fixed: 'left' },
	{ key: 'appointmentNo', prop: 'appointmentNo', label: '访客单号', minWidth: 110 },
	{ key: 'passTime', prop: 'passTime', label: '通行时间', minWidth: 160 },
	{ key: 'passTypeLabel', prop: 'passTypeLabel', label: '通行类型', minWidth: 110 },
	{ key: 'passMethodLabel', prop: 'passMethodLabel', label: '通行方式', minWidth: 110 },
	{ key: 'licensePlate', prop: 'licensePlate', label: '车牌号', minWidth: 110 },
	{ key: 'passLocation', prop: 'passLocation', label: '通行位置', minWidth: 130 },
	{ key: 'captureUrl', prop: 'captureUrl', label: '抓拍', width: 90, type: 'preview' },
	{ key: 'visitorName', prop: 'visitorName', label: '访客姓名', minWidth: 110 },
	{ key: 'visitorPhone', prop: 'visitorPhone', label: '访客手机号', minWidth: 130 },
	{ key: 'visitedName', prop: 'visitedName', label: '被访人姓名', minWidth: 110 },
	{ key: 'visitedEnterprise', prop: 'visitedEnterprise', label: '被访人企业', minWidth: 130 },
	{ key: 'visitedPhone', prop: 'visitedPhone', label: '被访人手机号', minWidth: 130 },
	{ key: 'status', prop: 'status', label: '访问状态', minWidth: 110, type: 'status' },
	{ key: 'operation', prop: 'operation', label: '操作', width: 90, type: 'operation', fixed: 'right' },
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
