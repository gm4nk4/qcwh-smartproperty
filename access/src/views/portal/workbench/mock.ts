/**
 * 工作台配置模拟数据
 * @description 提供工作台配置页面的所有模拟数据
 */

import type { StatsData, ModuleItem, LayoutModuleItem, ColorScheme, LayoutConfig } from './type';
import { ModuleType } from './type';

/**
 * 统计数据
 */
export const mockStatsData: StatsData = {
	totalModules: 15,
	publicModules: 4,
	displayedModules: 14,
	layoutRows: 6,
};

/**
 * 公共模块列表
 */
export const mockPublicModules: ModuleItem[] = [
	{
		id: 1,
		name: '登录用户信息',
		type: ModuleType.PUBLIC,
		disabled: true,
		checked: true,
		width: 8,
		height: 120,
		sort: 1,
	},
	{
		id: 2,
		name: '快捷入口',
		type: ModuleType.PUBLIC,
		disabled: true,
		checked: true,
		width: 16,
		height: 120,
		sort: 2,
	},
	{
		id: 3,
		name: '公告推送',
		type: ModuleType.PUBLIC,
		disabled: true,
		checked: true,
		width: 8,
		height: 200,
		sort: 3,
	},
	{
		id: 4,
		name: '我的待办',
		type: ModuleType.PUBLIC,
		disabled: true,
		checked: true,
		width: 8,
		height: 200,
		sort: 4,
	},
];

/**
 * 子应用模块列表
 */
export const mockSubAppModules: ModuleItem[] = [
	{
		id: 5,
		name: '工单概览',
		type: ModuleType.SUBAPP,
		checked: true,
		width: 8,
		height: 200,
		appName: '工单管理',
		sort: 5,
	},
	{
		id: 6,
		name: '设备状态',
		type: ModuleType.SUBAPP,
		checked: true,
		width: 8,
		height: 200,
		appName: '智慧设备管理',
		sort: 6,
	},
	{
		id: 7,
		name: '能耗监测',
		type: ModuleType.SUBAPP,
		checked: true,
		width: 8,
		height: 200,
		appName: '能源管理',
		sort: 7,
	},
	{
		id: 8,
		name: '安防告警',
		type: ModuleType.SUBAPP,
		checked: true,
		width: 8,
		height: 200,
		appName: '安防监控',
		sort: 8,
	},
];

/**
 * 布局预览模块列表
 */
export const mockLayoutModules: LayoutModuleItem[] = [
	{
		id: 1,
		name: '登录用户信息',
		type: ModuleType.PUBLIC,
		checked: true,
		width: 8,
		height: 120,
		sort: 1,
		x: 0,
		y: 0,
		tagType: 'public'
	},
	{
		id: 2,
		name: '快捷入口',
		type: ModuleType.PUBLIC,
		disabled: true,
		checked: true,
		width: 16,
		height: 120,
		sort: 2,
		x: 8,
		y: 0,
		tagType: 'public'
	},
	{
		id: 3,
		name: '公告推送',
		type: ModuleType.PUBLIC,
		disabled: true,
		checked: true,
		width: 12,
		height: 200,
		sort: 3,
		x: 0,
		y: 120,
		tagType: 'public'
	},
	{
		id: 4,
		name: '我的待办',
		type: ModuleType.PUBLIC,
		disabled: true,
		checked: true,
		width: 12,
		height: 200,
		sort: 4,
		x: 12,
		y: 120,
		tagType: 'public'
	},
	{
		id: 5,
		name: '工单概览',
		type: ModuleType.SUBAPP,
		checked: true,
		width: 8,
		height: 200,
		appName: '工单管理',
		sort: 5,
		x: 0,
		y: 320,
		tagType: 'subapp'
	},
	{
		id: 6,
		name: '设备状态',
		type: ModuleType.SUBAPP,
		checked: true,
		width: 8,
		height: 200,
		appName: '智慧设备管理',
		sort: 6,
		x: 8,
		y: 320,
		tagType: 'subapp'
	},
	{
		id: 7,
		name: '能耗监测',
		type: ModuleType.SUBAPP,
		checked: true,
		width: 8,
		height: 200,
		appName: '能源管理',
		sort: 7,
		x: 16,
		y: 320,
		tagType: 'subapp'
	},
	{
		id: 8,
		name: '安防告警',
		type: ModuleType.SUBAPP,
		checked: true,
		width: 24,
		height: 160,
		appName: '安防监控',
		sort: 8,
		x: 0,
		y: 520,
		tagType: 'subapp'
	}
];

/**
 * 颜色方案列表
 */
export const mockColorSchemes: ColorScheme[] = [
	{ name: '默认方案（所有角色）', isDefault: true },
	{ name: '其他方案 1', isDefault: false },
	{ name: '其他方案 2', isDefault: false },
];

/**
 * 布局配置
 */
export const mockLayoutConfig: LayoutConfig = {
	editColorScheme: true,
	currentColorScheme: '默认方案（所有角色）',
	colorSchemes: mockColorSchemes,
};

/**
 * 获取统计卡片配置
 * @param stats 统计数据
 * @returns 统计卡片配置数组
 */
export const getStatCardsConfig = (stats: StatsData) => [
	{
		icon: 'Grid',
		title: '总模块数',
		value: stats.totalModules,
		color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
	},
	{
		icon: 'OfficeBuilding',
		title: '公共模块',
		value: stats.publicModules,
		color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
	},
	{
		icon: 'View',
		title: '已显示',
		value: stats.displayedModules,
		color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
	},
	{
		icon: 'Tickets',
		title: '布局行数',
		value: stats.layoutRows,
		color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
	},
];
