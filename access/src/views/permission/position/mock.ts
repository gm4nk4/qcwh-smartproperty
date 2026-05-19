/**
 * @file mock.ts
 * @description 岗位管理模块模拟数据
 * @module position/mock
 */

import type { Position, Department } from './type';

/**
 * 岗位模拟数据
 */
export const mockPositions: Position[] = [
	{
		id: 1,
		positionName: '项目经理',
		positionCode: 'PM-001',
		department: '技术部',
		description: '负责项目整体规划、进度管理和团队协调',
		userCount: 15,
		roleCount: 8,
		status: 'enable',
		createTime: '2024-01-15 09:30:00'
	},
	{
		id: 2,
		positionName: '前端开发工程师',
		positionCode: 'FE-001',
		department: '技术部',
		description: '负责Web前端页面开发、组件封装和性能优化',
		userCount: 25,
		roleCount: 6,
		status: 'enable',
		createTime: '2024-02-20 14:20:00'
	},
	{
		id: 3,
		positionName: '后端开发工程师',
		positionCode: 'BE-001',
		department: '技术部',
		description: '负责后端接口开发、数据库设计和服务部署',
		userCount: 20,
		roleCount: 7,
		status: 'enable',
		createTime: '2024-03-10 16:45:00'
	},
	{
		id: 4,
		positionName: '产品经理',
		positionCode: 'PM-002',
		department: '产品部',
		description: '负责产品需求调研、功能设计和版本规划',
		userCount: 8,
		roleCount: 5,
		status: 'enable',
		createTime: '2024-03-25 10:10:00'
	},
	{
		id: 5,
		positionName: 'UI设计师',
		positionCode: 'UI-001',
		department: '设计部',
		description: '负责产品界面设计、交互原型和视觉规范制定',
		userCount: 6,
		roleCount: 4,
		status: 'disable',
		createTime: '2024-04-05 11:30:00'
	},
	{
		id: 6,
		positionName: '测试工程师',
		positionCode: 'QA-001',
		department: '技术部',
		description: '负责功能测试、性能测试和测试用例编写',
		userCount: 12,
		roleCount: 5,
		status: 'enable',
		createTime: '2024-04-18 09:00:00'
	},
	{
		id: 7,
		positionName: '运维工程师',
		positionCode: 'OP-001',
		department: '技术部',
		description: '负责服务器维护、监控告警和应急处理',
		userCount: 5,
		roleCount: 4,
		status: 'enable',
		createTime: '2024-05-01 15:20:00'
	},
	{
		id: 8,
		positionName: '人事专员',
		positionCode: 'HR-001',
		department: '人事部',
		description: '负责招聘、员工关系和人事档案管理',
		userCount: 4,
		roleCount: 3,
		status: 'enable',
		createTime: '2024-05-12 13:45:00'
	}
];

/**
 * 部门模拟数据
 */
export const mockDepartments: Department[] = [
	{ id: 1, name: '技术部', parentId: 0 },
	{ id: 2, name: '产品部', parentId: 0 },
	{ id: 3, name: '设计部', parentId: 0 },
	{ id: 4, name: '人事部', parentId: 0 },
	{ id: 5, name: '市场部', parentId: 0 },
	{ id: 6, name: '销售部', parentId: 0 }
];
