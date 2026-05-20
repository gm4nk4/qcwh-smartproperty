import type { QueryFormConfig, TableColumn } from '@zhqc-smart/table';
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

export const visitStatusOptions = [
	{ label: '待来访', value: 'pending_visit' },
	{ label: '已完成', value: 'completed' },
	{ label: '已失效', value: 'expired' },
];

export const queryFormConfig: QueryFormConfig = {
	fields: [
		{ label: '访客姓名', value: 'visitorName', type: 'text', selected: true },
		{ label: '访客手机号', value: 'visitorPhone', type: 'text', selected: true },
		{ label: '访客车牌号', value: 'visitorVehicleNo', type: 'text', selected: true },
		{ label: '被访人企业', value: 'visitedEnterprise', type: 'text', selected: true },
		{ label: '被访人姓名', value: 'visitedName', type: 'text', selected: true },
		{ label: '访问状态', value: 'status', type: 'select', selected: true },
	],
	fieldOptions: {
		status: visitStatusOptions,
	},
};

export const tableColumns: TableColumn[] = [
	{ prop: 'appointmentNo', label: '访客单号', minWidth: 110, align: 'center' },
	{ prop: 'visitorName', label: '访客姓名', minWidth: 110, align: 'center' },
	{ prop: 'visitorPhone', label: '访客手机号', minWidth: 130, align: 'center' },
	{ prop: 'visitReason', label: '来访事由', minWidth: 110, align: 'center' },
	{ prop: 'visitorCount', label: '访客人数', minWidth: 90, align: 'center' },
	{ prop: 'appointmentTime', label: '来访时间', minWidth: 160, align: 'center' },
	{ prop: 'visitorVehicleNo', label: '访客车牌号', minWidth: 120, align: 'center' },
	{ prop: 'gateNames', label: '访客通行门禁', minWidth: 220, align: 'center' },
	{ prop: 'visitedName', label: '被访人姓名', minWidth: 110, align: 'center' },
	{ prop: 'visitedEnterprise', label: '被访人企业', minWidth: 130, align: 'center' },
	{ prop: 'visitedPhone', label: '被访人手机号', minWidth: 130, align: 'center' },
	{ prop: 'launchTime', label: '发起时间', minWidth: 160, align: 'center' },
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
