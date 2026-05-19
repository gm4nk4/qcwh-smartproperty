import type { VisitorAppointmentStatus } from './api';

export interface AppointmentFormData {
	visitorName: string;
	visitorPhone: string;
	visitorVehicleNo: string;
	visitedEnterprise: string;
	visitedName: string;
	status: VisitorAppointmentStatus | '';
	current: number;
	size: number;
}

export type AppointmentQueryField = keyof Omit<AppointmentFormData, 'current' | 'size'>;
export type AppointmentTextField = Exclude<AppointmentQueryField, 'status'>;

export interface QueryFieldOption {
	label: string;
	value: string;
}

export interface QueryFieldConfig {
	key: string;
	field: AppointmentQueryField;
	label: string;
	component: 'el-input' | 'el-select';
	props: Record<string, unknown>;
	options?: QueryFieldOption[];
}

export interface AppointmentTableColumnConfig {
	key: string;
	prop: string;
	label: string;
	minWidth?: number;
	width?: number;
	type?: 'index' | 'status' | 'operation';
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

export const visitStatusOptions: QueryFieldOption[] = [
	{ label: '全部', value: '' },
	{ label: '待来访', value: 'pending_visit' },
	{ label: '已完成', value: 'completed' },
	{ label: '已失效', value: 'expired' },
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
		key: 'visitorVehicleNo',
		field: 'visitorVehicleNo',
		label: '访客车牌号',
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
		key: 'status',
		field: 'status',
		label: '访问状态',
		component: 'el-select',
		props: {
			placeholder: '请选择',
			clearable: true,
		},
		options: visitStatusOptions,
	},
];

export const tableColumnConfigs: AppointmentTableColumnConfig[] = [
	{ key: 'seq', prop: 'seq', label: '序号', width: 70, type: 'index', fixed: 'left' },
	{ key: 'appointmentNo', prop: 'appointmentNo', label: '访客单号', minWidth: 110 },
	{ key: 'visitorName', prop: 'visitorName', label: '访客姓名', minWidth: 110 },
	{ key: 'visitorPhone', prop: 'visitorPhone', label: '访客手机号', minWidth: 130 },
	{ key: 'visitReason', prop: 'visitReason', label: '来访事由', minWidth: 110 },
	{ key: 'visitorCount', prop: 'visitorCount', label: '访客人数', minWidth: 90 },
	{ key: 'appointmentTime', prop: 'appointmentTime', label: '来访时间', minWidth: 160 },
	{ key: 'visitorVehicleNo', prop: 'visitorVehicleNo', label: '访客车牌号', minWidth: 120 },
	{ key: 'gateNames', prop: 'gateNames', label: '访客通行门禁', minWidth: 220 },
	{ key: 'visitedName', prop: 'visitedName', label: '被访人姓名', minWidth: 110 },
	{ key: 'visitedEnterprise', prop: 'visitedEnterprise', label: '被访人企业', minWidth: 130 },
	{ key: 'visitedPhone', prop: 'visitedPhone', label: '被访人手机号', minWidth: 130 },
	{ key: 'launchTime', prop: 'launchTime', label: '发起时间', minWidth: 160 },
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
			{ label: '访客人数', field: 'visitorCount' },
			{ label: '来访时间', field: 'appointmentTime' },
			{ label: '访客车牌号', field: 'visitorVehicleNo' },
			{ label: '来访事由', field: 'visitReason' },
			{ label: '访客通行门禁', field: 'gateNames', span: 2 },
		],
	},
];

export const passRecordColumnConfigs: PassRecordColumnConfig[] = [
	{ key: 'seq', prop: 'seq', label: '序号', width: 80 },
	{ key: 'passTime', prop: 'passTime', label: '通行时间', minWidth: 150 },
	{ key: 'passTypeLabel', prop: 'passTypeLabel', label: '通行类型', minWidth: 110 },
	{ key: 'passMethod', prop: 'passMethod', label: '通行方式', minWidth: 110 },
	{ key: 'licensePlate', prop: 'licensePlate', label: '车牌号', minWidth: 110 },
	{ key: 'passLocation', prop: 'passLocation', label: '通行位置', minWidth: 130 },
	{ key: 'captureUrl', prop: 'captureUrl', label: '抓拍', width: 90, type: 'preview' },
];

export const defaultFormData: AppointmentFormData = {
	visitorName: '',
	visitorPhone: '',
	visitorVehicleNo: '',
	visitedEnterprise: '',
	visitedName: '',
	status: '',
	current: 1,
	size: 10,
};

export const detailDialogTitle = '访客预约详情';
