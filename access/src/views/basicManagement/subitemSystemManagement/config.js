export const QUERY_FORM_FIELDS = [
	{
		label: '系统名称',
		value: 'systemName',
		type: 'text',
		selected: true,
	},
	{
		label: '系统类型',
		value: 'systemType',
		type: 'select',
		selected: true,
	},
	{
		label: '状态',
		value: 'runStatus',
		type: 'select',
		selected: true,
	},
];

export const createQueryFormConfig = (systemTypeOptions = [], runStatusOptions = []) => ({
	fields: [
		...QUERY_FORM_FIELDS,
	],
	fieldOptions: {
		systemType: systemTypeOptions,
		runStatus: runStatusOptions,
	},
});

export const TABLE_COLUMNS = [
	{ prop: 'systemName', label: '系统名称', minWidth: 220, align: 'left' },
	{ prop: 'systemCode', label: '系统编码', minWidth: 140, align: 'center' },
	{ prop: 'systemTypeName', label: '系统类型', minWidth: 140, align: 'center' },
	{ prop: 'deviceCount', label: '设备数量', minWidth: 120, align: 'center' },
	{ prop: 'todayEnergy', label: '今日能耗(kWh)', minWidth: 140, align: 'center' },
	{ prop: 'loadRate', label: '负载率', width: 120, align: 'center', slot: 'loadRate' },
	{ prop: 'runStatus', label: '运行状态', width: 120, align: 'center', slot: 'runStatus' },
	{ prop: 'principal', label: '负责人', width: 110, align: 'center' },
	{ prop: 'updateTime', label: '更新时间', minWidth: 170, align: 'center', slot: 'updateTime' },
	{ prop: 'actions', label: '操作', minWidth: 240, fixed: 'right', align: 'left', slot: 'actions' },
];

export const createInitialFilterForm = () => ({
	systemName: '',
	systemType: '',
	runStatus: '',
});
