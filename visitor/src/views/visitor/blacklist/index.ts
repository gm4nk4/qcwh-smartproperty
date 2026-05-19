import type { VisitorBlacklistType } from './api';

export interface BlacklistPageFormData {
	type: VisitorBlacklistType | '';
	name: string;
	identityValue: string;
	current: number;
	size: number;
}

export interface BlacklistDialogFormData {
	type: VisitorBlacklistType;
	name: string;
	identityValue: string;
	remark: string;
}

export type BlacklistQueryField = keyof Omit<BlacklistPageFormData, 'current' | 'size'>;
export type BlacklistDialogField = keyof Omit<BlacklistDialogFormData, 'type'>;

export interface FieldOption {
	label: string;
	value: string;
}

export interface QueryFieldConfig {
	key: string;
	field: BlacklistQueryField;
	label: string;
	component: 'el-input' | 'el-select';
	props: Record<string, unknown>;
	options?: FieldOption[];
}

export interface DialogFieldConfig {
	key: string;
	field: BlacklistDialogField;
	label: string;
	component: 'el-input';
	props: Record<string, unknown>;
}

export interface BlacklistTypeConfig {
	value: VisitorBlacklistType;
	label: string;
	description: string;
	namePlaceholder: string;
	identityLabel: string;
	identityPlaceholder: string;
	identifierRequired: boolean;
}

export interface BlacklistTableColumnConfig {
	key: string;
	prop: string;
	label: string;
	minWidth?: number;
	width?: number;
	type?: 'index' | 'operation';
	fixed?: 'left' | 'right';
}

export const blacklistTypeConfigs: BlacklistTypeConfig[] = [
	{
		value: 'visitor',
		label: '访客',
		description: '禁止来访与被邀',
		namePlaceholder: '请输入访客姓名',
		identityLabel: '访客手机号',
		identityPlaceholder: '请输入',
		identifierRequired: true,
	},
	{
		value: 'vehicle',
		label: '车辆',
		description: '禁止来访与被邀',
		namePlaceholder: '请输入名单名称',
		identityLabel: '车牌号',
		identityPlaceholder: '请输入车牌号',
		identifierRequired: true,
	},
	{
		value: 'enterprise',
		label: '入驻企业',
		description: '禁止该公司人员发起邀约',
		namePlaceholder: '请输入企业名称',
		identityLabel: '访客手机号',
		identityPlaceholder: '请输入',
		identifierRequired: false,
	},
];

export const blacklistTypeOptions: FieldOption[] = [
	{ label: '全部', value: '' },
	...blacklistTypeConfigs.map((item) => ({
		label: item.label,
		value: item.value,
	})),
];

export const queryFieldConfigs: QueryFieldConfig[] = [
	{
		key: 'type',
		field: 'type',
		label: '名单类型',
		component: 'el-select',
		props: {
			placeholder: '请选择',
			clearable: true,
		},
		options: blacklistTypeOptions,
	},
	{
		key: 'name',
		field: 'name',
		label: '名单名称',
		component: 'el-input',
		props: {
			placeholder: '请输入',
			clearable: true,
		},
	},
	{
		key: 'identityValue',
		field: 'identityValue',
		label: '访客手机号/车牌号',
		component: 'el-input',
		props: {
			placeholder: '请输入',
			clearable: true,
		},
	},
];

export const dialogFieldConfigs: DialogFieldConfig[] = [
	{
		key: 'name',
		field: 'name',
		label: '名单名称',
		component: 'el-input',
		props: {
			placeholder: '请输入',
			clearable: true,
		},
	},
	{
		key: 'identityValue',
		field: 'identityValue',
		label: '访客手机号',
		component: 'el-input',
		props: {
			placeholder: '请输入',
			clearable: true,
		},
	},
	{
		key: 'remark',
		field: 'remark',
		label: '备注',
		component: 'el-input',
		props: {
			type: 'textarea',
			rows: 4,
			placeholder: '请输入',
			resize: 'none',
			clearable: true,
		},
	},
];

export const tableColumnConfigs: BlacklistTableColumnConfig[] = [
	{ key: 'seq', prop: 'seq', label: '序号', width: 70, type: 'index', fixed: 'left' },
	{ key: 'typeLabel', prop: 'typeLabel', label: '名单类型', minWidth: 120 },
	{ key: 'name', prop: 'name', label: '名单名称', minWidth: 140 },
	{ key: 'identityDisplay', prop: 'identityDisplay', label: '访客手机号/车牌号', minWidth: 160 },
	{ key: 'reasonDescription', prop: 'reasonDescription', label: '类型说明', minWidth: 220 },
	{ key: 'remark', prop: 'remark', label: '备注', minWidth: 180 },
	{ key: 'creator', prop: 'creator', label: '创建人', minWidth: 100 },
	{ key: 'createTime', prop: 'createTime', label: '创建时间', minWidth: 160 },
	{ key: 'operation', prop: 'operation', label: '操作', width: 90, type: 'operation', fixed: 'right' },
];

export const defaultFormData: BlacklistPageFormData = {
	type: '',
	name: '',
	identityValue: '',
	current: 1,
	size: 10,
};

export const defaultDialogFormData: BlacklistDialogFormData = {
	type: 'visitor',
	name: '',
	identityValue: '',
	remark: '',
};

export const dialogTitle = '黑名单管理';
