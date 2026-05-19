/**
 * 操作审计模块模拟数据
 */

import type { AuditStatsCard, AuditRecord } from './type';

// 操作模块选项
export const operationModuleOptions = [
	{ label: '角色管理', value: '角色管理' },
	{ label: '第三方应用', value: '第三方应用' },
	{ label: '用户管理', value: '用户管理' },
	{ label: '公告管理', value: '公告管理' },
	{ label: '智慧访客', value: '智慧访客' },
];

/**
 * 审计统计卡片数据
 */
export const mockAuditStatsCards: AuditStatsCard[] = [
	{ id: '1', title: '今日操作', value: 9, icon: 'Calendar' },
	{ id: '2', title: '高风险操作', value: 4, icon: 'Warning' },
	{ id: '3', title: '异常/失败', value: 3, icon: 'CircleClose' },
	{ id: '4', title: '权限变更', value: 3, icon: 'Key' },
];

/**
 * 审计记录数据
 */
export const mockAuditRecords: AuditRecord[] = [
	{
		id: '1',
		userName: '王建华',
		avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
		department: '信息技术部',
		operation: '修改平台角色权限映射',
		status: 'success',
		statusText: '成功',
		operationType: '高风险',
		operationModule: '角色管理',
		description: '为"物业经理"角色新增智慧楼宇子应用的系统管理员角色绑定，影响3个用户',
		ip: '192.168.1.100',
		location: '模块',
		operationType2: '权限变更',
		time: '17:33:06',
		date: '今天',
	},
	{
		id: '2',
		userName: '王建华',
		avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
		department: '信息技术部',
		operation: '激活第三方应用',
		status: 'success',
		statusText: '成功',
		operationType: '中风险',
		operationModule: '第三方应用',
		description: '第三方应用：智慧招商系统 | 供应商：宏科技,配置SSO单点登录',
		ip: '',
		location: '',
		operationType2: '',
		time: '16:33:06',
		date: '今天',
	},
	{
		id: '3',
		userName: '李明远',
		avatar: 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a2568361728cpng.png',
		department: '物业管理中心',
		operation: '用户登录',
		status: 'success',
		statusText: '成功',
		operationType: '',
		operationModule: '',
		description: 'Web端登录',
		ip: '',
		location: '',
		operationType2: '',
		time: '15:33:06',
		date: '今天',
	},
	{
		id: '4',
		userName: '王建华',
		avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
		department: '信息技术部',
		operation: '修改平台角色权限映射',
		status: 'success',
		statusText: '警告',
		operationType: '高风险',
		operationModule: '角色管理',
		description: '平台角色：物业经理 | 新增子应用角色映射：智慧楼宇 → 系统管理员',
		ip: '',
		location: '',
		operationType2: '',
		time: '14:33:06',
		date: '昨天',
	},
	{
		id: '5',
		userName: '王建华',
		avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
		department: '信息技术部',
		operation: '修改平台角色权限映射',
		status: 'warning',
		statusText: '中风险',
		operationType: '',
		operationModule: '',
		description: '平台角色：物业经理 | 新增子应用角色映射：智慧楼宇 → 系统管理员',
		ip: '',
		location: '',
		operationType2: '',
		time: '14:23:06',
		date: '昨天',
	},
	{
		id: '6',
		userName: '王建华',
		avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
		department: '信息技术部',
		operation: '修改平台角色权限映射',
		status: 'danger',
		statusText: '失败',
		operationType: '',
		operationModule: '',
		description: '',
		ip: '',
		location: '',
		operationType2: '',
		time: '14:13:06',
		date: '昨天',
	},
];
