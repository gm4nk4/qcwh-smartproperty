/**
 * @file mock.ts
 * @description 角色管理模块模拟数据
 * @module role/mock
 */

import type { Role, AppTreeNode, PlatformRole, PlatformRoleItem, AppRoleOption, PermissionTreeNode, UserItem } from './type';

/**
 * 角色模拟数据
 */
export const mockRoles: Role[] = [
	{
		id: 1,
		roleName: '系统管理员',
		roleCode: 'pay-sysadmin',
		appName: '物业缴费',
		description: '物业缴费系统内置最高权限角色，拥有全部菜单权限',
		authUserCount: 0,
		authPlatformRoles: ['平台超管'],
		status: '禁用',
	},
	{
		id: 2,
		roleName: '财务管理员',
		roleCode: 'pay-admin',
		appName: '物业缴费',
		description: '管理收费规则，审批退费',
		authUserCount: 2,
		authPlatformRoles: ['物业经理'],
		status: '启用',
	},
	{
		id: 3,
		roleName: '收费员',
		roleCode: 'pay-clerk',
		appName: '物业缴费',
		description: '生成账单和催缴',
		authUserCount: 0,
		authPlatformRoles: [],
		status: '启用',
	},
	{
		id: 4,
		roleName: '王建华',
		roleCode: 'pay-payer',
		appName: '物业缴费',
		description: '查看账单和缴费',
		authUserCount: 2,
		authPlatformRoles: [],
		status: '启用',
	},
];

/**
 * 平台角色模拟数据
 */
export const mockPlatformRoles: PlatformRole[] = [
	{
		id: 1,
		roleName: '平台超管',
		roleCode: 'platform-admin',
		isBuiltIn: true,
		appCount: 15,
		roleCount: 15,
		userCount: 2,
		description: '平台内置最高权限角色，自动具备所有子应用的系统管理员角色，不可删除，编辑不可修改',
		appRoleMap: [
			{
				appName: '工单管理',
				roles: [
					{ roleName: '系统管理员', isDefault: true },
					{ roleName: '工单管理员', isDefault: false },
					{ roleName: '派单员', isDefault: false },
					{ roleName: '处理人', isDefault: false },
					{ roleName: '提单人员', isDefault: false },
				],
			},
			{
				appName: '物业缴费',
				roles: [
					{ roleName: '系统管理员', isDefault: true },
					{ roleName: '工单管理员', isDefault: false },
					{ roleName: '派单员', isDefault: false },
					{ roleName: '处理人', isDefault: false },
					{ roleName: '提单人员', isDefault: false },
				],
			},
			{
				appName: '社区运营',
				roles: [
					{ roleName: '系统管理员', isDefault: true },
					{ roleName: '社区运营员', isDefault: false },
				],
			},
			{
				appName: '客户评价',
				roles: [
					{ roleName: '系统管理员', isDefault: true },
					{ roleName: '客服专员', isDefault: false },
				],
			},
			{
				appName: '公告管理',
				roles: [
					{ roleName: '系统管理员', isDefault: true },
					{ roleName: '公告管理员', isDefault: false },
				],
			},
			{
				appName: '安防监控',
				roles: [
					{ roleName: '系统管理员', isDefault: true },
					{ roleName: '安防管理员', isDefault: false },
					{ roleName: '监控员', isDefault: false },
					{ roleName: '巡视员', isDefault: false },
				],
			},
			{
				appName: '停车管理',
				roles: [
					{ roleName: '系统管理员', isDefault: false },
					{ roleName: '工单管理员', isDefault: false },
					{ roleName: '派单员', isDefault: false },
					{ roleName: '处理人', isDefault: false },
					{ roleName: '提单人员', isDefault: false },
				],
			},
			{
				appName: '门禁管理',
				roles: [
					{ roleName: '系统管理员', isDefault: false },
					{ roleName: '工单管理员', isDefault: false },
					{ roleName: '派单员', isDefault: false },
					{ roleName: '处理人', isDefault: false },
					{ roleName: '提单人员', isDefault: false },
				],
			},
		],
	},
	{
		id: 2,
		roleName: '物业经理',
		roleCode: 'property-manager',
		isBuiltIn: false,
		appCount: 2,
		roleCount: 15,
		userCount: 3,
		description: '负责物业全面管理工作的角色',
		appRoleMap: [
			{
				appName: '工单管理',
				roles: [
					{ roleName: '系统管理员', isDefault: false },
					{ roleName: '工单管理员', isDefault: true },
					{ roleName: '派单员', isDefault: false },
					{ roleName: '处理人', isDefault: false },
					{ roleName: '提单人员', isDefault: false },
				],
			},
			{
				appName: '物业缴费',
				roles: [
					{ roleName: '系统管理员', isDefault: false },
					{ roleName: '财务管理员', isDefault: true },
					{ roleName: '派单员', isDefault: false },
					{ roleName: '处理人', isDefault: false },
					{ roleName: '提单人员', isDefault: false },
				],
			},
		],
	},
	{
		id: 3,
		roleName: '安防主管',
		roleCode: 'security-supervisor',
		isBuiltIn: false,
		appCount: 2,
		roleCount: 6,
		userCount: 5,
		description: '负责安全防范管理工作的角色',
		appRoleMap: [],
	},
	{
		id: 4,
		roleName: '运营专员',
		roleCode: 'operation-specialist',
		isBuiltIn: false,
		appCount: 2,
		roleCount: 2,
		userCount: 10,
		description: '负责日常运营工作的角色',
		appRoleMap: [],
	},
	{
		id: 5,
		roleName: '维修技师',
		roleCode: 'maintenance-technician',
		isBuiltIn: false,
		appCount: 2,
		roleCount: 2,
		userCount: 8,
		description: '负责设备维修维护的角色',
		appRoleMap: [],
	},
	{
		id: 6,
		roleName: '业主用户',
		roleCode: 'owner-user',
		isBuiltIn: false,
		appCount: 2,
		roleCount: 2,
		userCount: 200,
		description: '业主用户角色',
		appRoleMap: [],
	},
];

/**
 * 平台角色列表模拟数据
 */
export const mockPlatformRoleItems: PlatformRoleItem[] = [
	{
		id: 1,
		name: '平台超管',
		appCount: 15,
		roleCount: 15,
	},
	{
		id: 2,
		name: '物业经理',
		appCount: 2,
		roleCount: 15,
	},
	{
		id: 3,
		name: '安防主管',
		appCount: 2,
		roleCount: 6,
	},
	{
		id: 4,
		name: '运营专员',
		appCount: 2,
		roleCount: 2,
	},
	{
		id: 5,
		name: '维修技师',
		appCount: 2,
		roleCount: 2,
	},
	{
		id: 6,
		name: '业主用户',
		appCount: 2,
		roleCount: 2,
	},
];

/**
 * 应用树模拟数据
 */
export const mockAppTree: AppTreeNode[] = [
	{
		id: 'all',
		name: '全部子应用',
		type: 'group',
		count: 17,
		children: [
			{
				id: 'internal',
				name: '内部应用',
				type: 'group',
				count: 15,
				children: [
					{
						id: 'work-order',
						name: '工单管理',
						type: 'app',
						count: 5,
					},
					{
						id: 'property-payment',
						name: '物业缴费',
						type: 'app',
						count: 4,
					},
					{
						id: 'community-operation',
						name: '社区运营',
						type: 'app',
						count: 2,
					},
					{
						id: 'customer-evaluation',
						name: '客户评价',
						type: 'app',
						count: 2,
					},
					{
						id: 'announcement-management',
						name: '公告管理',
						type: 'app',
						count: 2,
					},
					{
						id: 'security-monitoring',
						name: '安防监控',
						type: 'app',
						count: 4,
					},
					{
						id: 'parking-management',
						name: '停车管理',
						type: 'app',
						count: 1,
					},
					{
						id: 'gate-management',
						name: '门禁管理',
						type: 'app',
						count: 1,
					},
					{
						id: 'asset-management',
						name: '资产管理',
						type: 'app',
						count: 3,
					},
					{
						id: 'energy-management',
						name: '能源管理',
						type: 'app',
						count: 3,
					},
					{
						id: 'smart-device',
						name: '智慧设备管理',
						type: 'app',
						count: 3,
					},
					{
						id: 'report-center',
						name: '报表中心',
						type: 'app',
						count: 2,
					},
				],
			},
			{
				id: 'third-party',
				name: '第三方应用',
				type: 'group',
				count: 2,
			},
		],
	},
];

/**
 * 平台角色编辑弹窗用的子应用角色列表
 */
export const mockPlatformRoleAppList: AppRoleOption[] = [
	{
		appName: '工单管理',
		expanded: false,
		selectedCount: 0,
		roles: [
			{ roleName: '系统管理员', selected: false },
			{ roleName: '工单管理员', selected: false },
			{ roleName: '派单员', selected: false },
			{ roleName: '处理人', selected: false },
			{ roleName: '提单人员', selected: false },
		],
	},
	{
		appName: '物业缴费',
		expanded: false,
		selectedCount: 0,
		roles: [
			{ roleName: '系统管理员', selected: false },
			{ roleName: '财务管理员', selected: false },
			{ roleName: '收费员', selected: false },
			{ roleName: '缴费用户', selected: false },
		],
	},
	{
		appName: '社区运营',
		expanded: false,
		selectedCount: 0,
		roles: [
			{ roleName: '系统管理员', selected: false },
			{ roleName: '社区运营员', selected: false },
		],
	},
	{
		appName: '客户评价',
		expanded: false,
		selectedCount: 0,
		roles: [
			{ roleName: '系统管理员', selected: false },
			{ roleName: '客服专员', selected: false },
		],
	},
	{
		appName: '公告管理',
		expanded: false,
		selectedCount: 0,
		roles: [
			{ roleName: '系统管理员', selected: false },
			{ roleName: '公告管理员', selected: false },
		],
	},
	{
		appName: '安防监控',
		expanded: false,
		selectedCount: 0,
		roles: [
			{ roleName: '系统管理员', selected: false },
			{ roleName: '安防管理员', selected: false },
			{ roleName: '监控员', selected: false },
			{ roleName: '巡视员', selected: false },
		],
	},
	{
		appName: '停车管理',
		expanded: false,
		selectedCount: 0,
		roles: [
			{ roleName: '系统管理员', selected: false },
			{ roleName: '停车管理员', selected: false },
		],
	},
	{
		appName: '门禁管理',
		expanded: false,
		selectedCount: 0,
		roles: [
			{ roleName: '系统管理员', selected: false },
			{ roleName: '门禁管理员', selected: false },
		],
	},
	{
		appName: '资产管理',
		expanded: false,
		selectedCount: 0,
		roles: [
			{ roleName: '系统管理员', selected: false },
			{ roleName: '资产管理员', selected: false },
			{ roleName: '资产盘点员', selected: false },
		],
	},
	{
		appName: '能源管理',
		expanded: false,
		selectedCount: 0,
		roles: [
			{ roleName: '系统管理员', selected: false },
			{ roleName: '能源管理员', selected: false },
			{ roleName: '能耗统计员', selected: false },
		],
	},
	{
		appName: '智慧设备管理',
		expanded: false,
		selectedCount: 0,
		roles: [
			{ roleName: '系统管理员', selected: false },
			{ roleName: '设备管理员', selected: false },
			{ roleName: '设备维修员', selected: false },
		],
	},
	{
		appName: '报表中心',
		expanded: false,
		selectedCount: 0,
		roles: [
			{ roleName: '系统管理员', selected: false },
			{ roleName: '报表查看员', selected: false },
		],
	},
];

/**
 * 权限树模拟数据
 */
export const mockPermissionTree: PermissionTreeNode[] = [
	{
		id: 'app-work-order',
		label: '工单管理',
		children: [
			{
				id: 'work-order-view',
				label: '查看',
				children: [
					{ id: 'work-order-list', label: '浏览工单列表' },
					{ id: 'work-order-detail', label: '查看工单详情' },
				],
			},
			{
				id: 'work-order-create',
				label: '创建',
				children: [
					{ id: 'work-order-add', label: '新建工单' },
					{ id: 'work-order-report', label: '上报报修' },
				],
			},
			{
				id: 'work-order-manage',
				label: '管理',
				children: [
					{ id: 'work-order-edit', label: '编辑工单' },
					{ id: 'work-order-assign', label: '派单' },
					{ id: 'work-order-close', label: '关闭工单' },
				],
			},
			{
				id: 'work-order-process',
				label: '处理',
				children: [
					{ id: 'work-order-handle', label: '接单处理' },
					{ id: 'work-order-feedback', label: '回复反馈' },
				],
			},
			{
				id: 'work-order-export',
				label: '导出',
				children: [{ id: 'work-order-export-data', label: '导出工单数据' }],
			},
			{
				id: 'work-order-approve',
				label: '审批',
				children: [
					{ id: 'work-order-approve-complete', label: '审批工单完成' },
					{ id: 'work-order-approve-cost', label: '审批费用' },
				],
			},
		],
	},
	{
		id: 'app-payment',
		label: '物业缴费',
		children: [
			{
				id: 'payment-view',
				label: '查看',
				children: [
					{ id: 'payment-bill-list', label: '查看账单列表' },
					{ id: 'payment-record', label: '缴费记录' },
				],
			},
			{
				id: 'payment-create',
				label: '创建',
				children: [
					{ id: 'payment-bill-generate', label: '生成账单' },
					{ id: 'payment-notice', label: '缴费通知' },
				],
			},
			{
				id: 'payment-manage',
				label: '管理',
				children: [
					{ id: 'payment-bill-edit', label: '编辑账单' },
					{ id: 'payment-refund', label: '退款管理' },
					{ id: 'payment-price', label: '价格管理' },
				],
			},
			{
				id: 'payment-export',
				label: '导出',
				children: [
					{ id: 'payment-export-bill', label: '导出账单' },
					{ id: 'payment-export-statistics', label: '导出统计报表' },
				],
			},
		],
	},
	{
		id: 'app-community',
		label: '社区运营',
		children: [
			{
				id: 'community-activity',
				label: '活动管理',
				children: [
					{ id: 'activity-publish', label: '发布活动' },
					{ id: 'activity-signup', label: '报名管理' },
					{ id: 'activity-review', label: '活动回顾' },
				],
			},
			{
				id: 'community-notice',
				label: '公告管理',
				children: [
					{ id: 'notice-publish', label: '发布公告' },
					{ id: 'notice-edit', label: '编辑公告' },
				],
			},
		],
	},
	{
		id: 'app-security',
		label: '安防监控',
		children: [
			{
				id: 'security-monitor',
				label: '监控管理',
				children: [
					{ id: 'monitor-view', label: '查看监控' },
					{ id: 'monitor-playback', label: '录像回放' },
				],
			},
			{
				id: 'security-patrol',
				label: '巡逻管理',
				children: [
					{ id: 'patrol-plan', label: '巡逻计划' },
					{ id: 'patrol-record', label: '巡逻记录' },
				],
			},
		],
	},
];

/**
 * 可选用户列表模拟数据
 */
export const mockAvailableUsers: UserItem[] = [
	{ id: 1, name: '陈雅琳', department: '行政部', code: 'A-1203' },
	{ id: 2, name: '刘志强', department: '设施维修组', code: '' },
	{ id: 3, name: '赵工', department: '安防管理部', code: '' },
	{ id: 4, name: '孙工', department: '工程部', code: '' },
	{ id: 5, name: '周敏', department: '客服中心', code: '' },
	{ id: 6, name: '吴磊', department: '物业运营中心', code: '' },
	{ id: 7, name: '林婉清', department: '', code: 'B-862' },
	{ id: 8, name: '刘志强', department: '', code: '' },
	{ id: 9, name: '张明', department: '财务部', code: '' },
	{ id: 10, name: '李华', department: '人力资源部', code: '' },
];

/**
 * 已分配用户列表模拟数据
 */
export const mockAssignedUsers: UserItem[] = [
	{ id: 11, name: '王建国', department: '', code: '' },
	{ id: 12, name: '马苏娜', department: '设施维修组', code: '' },
	{ id: 13, name: '吴明轩', department: '客服中心', code: '' },
];
