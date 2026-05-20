/**
 * @file mock.ts
 * @description 用户模块 Mock 数据
 * @module user/mock
 */

import type { LoginLog, UserInfo, PlatformRole, SubAppPermission, AuthSubApp, User, StatCard } from './type';

/**
 * 用户登录日志 Mock 数据
 * @type {LoginLog[]}
 */
export const mockLoginLogs: LoginLog[] = [
	{ time: '2026-03-04 09:15', terminal: 'PC端', ip: '192.168.1.***' },
	{ time: '2026-03-03 08:30', terminal: 'PC端', ip: '192.168.1.***' },
	{ time: '2026-03-02 09:00', terminal: 'PC端', ip: '192.168.1.***' },
	{ time: '2026-03-01 14:20', terminal: 'PC端', ip: '192.168.1.***' },
	{ time: '2026-02-28 10:05', terminal: 'PC端', ip: '192.168.1.***' },
];

/**
 * 用户基本信息 Mock 数据
 * @type {UserInfo}
 */
export const mockUserInfo: UserInfo = {
	username: '王建华',
	position: '项目总监',
	userId: 'U-001',
	department: '信息技术部',
	phone: '138 **** 9021',
	email: 'wang.jh@bicone.com',
	createTime: '2024-01-15',
	lastLogin: '2026-03-04 09:15',
	isOnline: true,
};

/**
 * 平台角色 Mock 数据
 * @type {PlatformRole[]}
 */
export const mockPlatformRoles: PlatformRole[] = [
	{
		icon: '平',
		name: '平台超管',
		isBuiltIn: true,
		desc: '15个子应用 · 15个角色',
	},
	{
		icon: '安',
		name: '安防主管',
		isBuiltIn: false,
		desc: '2个子应用 · 2个角色',
	},
];

/**
 * 子应用权限 Mock 数据
 * @type {SubAppPermission[]}
 */
export const mockSubAppPermissions: SubAppPermission[] = [
	{
		name: '工单管理',
		roles: ['系统管理员', '工单管理员'],
		permissions: {
			platformInherit: ['work-orders: 6项', 'personnel: 6项'],
			direct: ['智能派单引擎', '工单故障诊断', '智能排班优化'],
		},
	},
	{
		name: '安防监控',
		roles: ['系统管理员', '安防管理员'],
	},
	{
		name: '物业缴费',
		roles: ['系统管理员', '财务管理员'],
	},
	{
		name: '资产管理',
		roles: ['系统管理员', '资产管理员'],
	},
];
export const mockUsers: User[] = [
	{
		id: 1,
		userName: '王建华',
		userId: 'U-001',
		deptName: '信息技术部',
		platformRole: '平台超管',
		postTags: ['项目总监'],
		appAuth: '15个应用\n20个角色\n+直接',
		status: '离线',
		lastLoginTime: '2025-04-13 14:30:30',
	},
	{
		id: 2,
		userName: '王建华',
		userId: 'U-001',
		deptName: '信息技术部',
		platformRole: '物业经理',
		postTags: ['运营主管'],
		appAuth: '15个应用\n20个角色\n+直接',
		status: '在线',
		lastLoginTime: '2025-04-13 14:30:30',
	},
	{
		id: 3,
		userName: '王建华',
		userId: 'U-001',
		deptName: '信息技术部',
		platformRole: '安防主管',
		postTags: ['安防主管'],
		appAuth: '15个应用\n20个角色\n+直接',
		status: '在线',
		lastLoginTime: '2025-04-13 14:30:30',
	},
	{
		id: 4,
		userName: '王建华',
		userId: 'U-001',
		deptName: '信息技术部',
		platformRole: '业主用户',
		postTags: ['业主'],
		appAuth: '15个应用\n20个角色\n+直接',
		status: '在线',
		lastLoginTime: '2025-04-13 14:30:30',
	},
	{
		id: 5,
		userName: '王建华',
		userId: 'U-001',
		deptName: '信息技术部',
		platformRole: '维修技师',
		postTags: ['维修工程师'],
		appAuth: '15个应用\n20个角色\n+直接',
		status: '在线',
		lastLoginTime: '2025-04-13 14:30:30',
	},
	{
		id: 6,
		userName: '王建华',
		userId: 'U-001',
		deptName: '信息技术部',
		platformRole: '安防主管，维修师',
		postTags: ['监控班长'],
		appAuth: '15个应用\n20个角色\n+直接',
		status: '在线',
		lastLoginTime: '2025-04-13 14:30:30',
	},
	{
		id: 7,
		userName: '王建华',
		userId: 'U-001',
		deptName: '信息技术部',
		platformRole: '维修技师',
		postTags: ['维修工程师'],
		appAuth: '15个应用\n20个角色\n+直接',
		status: '在线',
		lastLoginTime: '2025-04-13 14:30:30',
	},
	{
		id: 8,
		userName: '王建华',
		userId: 'U-001',
		deptName: '信息技术部',
		platformRole: '运营专员',
		postTags: ['客服主管'],
		appAuth: '15个应用\n20个角色\n+直接',
		status: '在线',
		lastLoginTime: '2025-04-13 14:30:30',
	},
	{
		id: 9,
		userName: '王建华',
		userId: 'U-001',
		deptName: '信息技术部',
		platformRole: '运营专员',
		postTags: ['客服主管'],
		appAuth: '15个应用\n20个角色\n+直接',
		status: '在线',
		lastLoginTime: '2025-04-13 14:30:30',
	},
	{
		id: 10,
		userName: '王建华',
		userId: 'U-001',
		deptName: '信息技术部',
		platformRole: '运营专员',
		postTags: ['客服主管'],
		appAuth: '15个应用\n20个角色\n+直接',
		status: '在线',
		lastLoginTime: '2025-04-13 14:30:30',
	},
];

export const mockStats: StatCard[] = [
	{
		title: '用户总数',
		value: 27,
		icon: 'user',
		color: '#3b82f6',
	},
	{
		title: '在线用户',
		value: 27,
		icon: 'online',
		color: '#10b981',
	},
	{
		title: '已分配角色',
		value: 27,
		icon: 'role',
		color: '#8b5cf6',
	},
	{
		title: '待分配',
		value: 27,
		icon: 'pending',
		color: '#f59e0b',
	},
];

export const roleOptions = [
	{ label: '全部', value: '' },
	{ label: '平台超管', value: '平台超管' },
	{ label: '物业经理', value: '物业经理' },
	{ label: '安防主管', value: '安防主管' },
	{ label: '业主用户', value: '业主用户' },
	{ label: '维修技师', value: '维修技师' },
	{ label: '运营专员', value: '运营专员' },
];

export const statusOptions = [
	{ label: '请选择状态', value: '' },
	{ label: '在线', value: '在线' },
	{ label: '离线', value: '离线' },
	{ label: '禁用', value: '禁用' },
];

/**
 * 赋权子应用列表 Mock 数据
 * @type {AuthSubApp[]}
 */
export const mockAuthSubAppList: AuthSubApp[] = [
	{
		name: '工单管理',
		inherited: true,
		selectedCount: 2,
		roles: [
			{ name: '系统管理员', selected: true, inherited: true },
			{ name: '工单管理员', selected: true, inherited: false },
			{ name: '派单员', selected: true, inherited: false },
			{ name: '处理人', selected: true, inherited: false },
		],
	},
	{
		name: '物业缴费',
		inherited: true,
		selectedCount: 0,
		roles: [
			{ name: '系统管理员', selected: false, inherited: true },
			{ name: '财务管理员', selected: false, inherited: false },
		],
	},
	{
		name: '社区运营',
		inherited: false,
		selectedCount: 0,
		roles: [{ name: '社区运营', selected: false, inherited: false }],
	},
	{
		name: '客户评价',
		inherited: true,
		selectedCount: 0,
		roles: [
			{ name: '系统管理员', selected: false, inherited: true },
			{ name: '数据分析师', selected: false, inherited: false },
		],
	},
	{
		name: '资产管理',
		inherited: false,
		selectedCount: 0,
		roles: [{ name: '资产管理员', selected: false, inherited: false }],
	},
	{
		name: '安防监控',
		inherited: false,
		selectedCount: 0,
		roles: [{ name: '安防管理员', selected: false, inherited: false }],
	},
	{
		name: '报表中心',
		inherited: false,
		selectedCount: 0,
		roles: [{ name: '报表分析师', selected: false, inherited: false }],
	},
	{
		name: '能源管理',
		inherited: false,
		selectedCount: 0,
		roles: [{ name: '能源管理员', selected: false, inherited: false }],
	},
];
