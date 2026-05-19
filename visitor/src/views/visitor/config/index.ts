import type { VisitorConfigPassMethod, VisitorConfigValidityType } from './api';

export interface VisitorConfigFormData {
	validityType: VisitorConfigValidityType;
	fixedHours: number;
	untilTime: string;
	passMethods: VisitorConfigPassMethod[];
}

export interface DeviceDialogFormData {
	deviceId: string;
}

export type VisitorConfigEditableField = Exclude<keyof VisitorConfigFormData, 'passMethods'>;

export interface DeviceTableColumnConfig {
	key: string;
	prop: string;
	label: string;
	minWidth?: number;
	width?: number;
	type?: 'index' | 'deviceType' | 'operation';
}

export interface ValidityExtraFieldConfig {
	key: string;
	field: Extract<VisitorConfigEditableField, 'fixedHours' | 'untilTime'>;
	component: 'el-input-number' | 'el-time-select';
	props: Record<string, unknown>;
	prefixText?: string;
	suffixText?: string;
}

export interface ValidityOptionConfig {
	value: VisitorConfigValidityType;
	label: string;
	extraFields?: ValidityExtraFieldConfig[];
}

export interface PassMethodConfig {
	value: VisitorConfigPassMethod;
	label: string;
	description: string;
}

export interface DeviceDialogFieldConfig {
	key: string;
	field: keyof DeviceDialogFormData;
	label: string;
	component: 'el-select';
	props: Record<string, unknown>;
}

export const deviceTableColumnConfigs: DeviceTableColumnConfig[] = [
	{ key: 'seq', prop: 'seq', label: '序号', width: 80, type: 'index' },
	{ key: 'deviceName', prop: 'deviceName', label: '设备名称', minWidth: 220 },
	{ key: 'deviceTypeLabel', prop: 'deviceTypeLabel', label: '设备类型', minWidth: 160, type: 'deviceType' },
	{ key: 'deviceLocation', prop: 'deviceLocation', label: '设备位置', minWidth: 220 },
	{ key: 'operation', prop: 'operation', label: '操作', width: 100, type: 'operation' },
];

export const validityOptionConfigs: ValidityOptionConfig[] = [
	{
		value: 'same_day',
		label: '当日内有效',
	},
	{
		value: 'fixed_hours',
		label: '固定间隔',
		extraFields: [
			{
				key: 'fixedHours',
				field: 'fixedHours',
				component: 'el-input-number',
				props: {
					min: 1,
					max: 24,
					controlsPosition: 'right',
				},
				suffixText: '小时',
			},
		],
	},
	{
		value: 'same_day_until',
		label: '当日',
		extraFields: [
			{
				key: 'untilTime',
				field: 'untilTime',
				component: 'el-time-select',
				props: {
					start: '00:00',
					step: '00:30',
					end: '23:30',
					placeholder: '请选择',
					clearable: false,
				},
				suffixText: '截止',
			},
		],
	},
];

export const passMethodConfigs: PassMethodConfig[] = [
	{
		value: 'qr_code',
		label: '刷码进入',
		description: '生成访客二维码，可通过二维码通行人行门禁等。',
	},
	{
		value: 'vehicle_scan',
		label: '车牌扫描',
		description: '需要访客提交车牌号，可自动通过车辆门闸。',
	},
];

export const deviceDialogFieldConfigs: DeviceDialogFieldConfig[] = [
	{
		key: 'deviceId',
		field: 'deviceId',
		label: '设备名称',
		component: 'el-select',
		props: {
			placeholder: '请选择设备',
			clearable: true,
			filterable: true,
		},
	},
];

export const defaultFormData: VisitorConfigFormData = {
	validityType: 'same_day',
	fixedHours: 4,
	untilTime: '18:00',
	passMethods: ['qr_code', 'vehicle_scan'],
};

export const defaultDeviceDialogFormData: DeviceDialogFormData = {
	deviceId: '',
};
