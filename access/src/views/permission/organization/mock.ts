/**
 * 组织管理模块模拟数据
 */
import type { Organization, AppIndependentApp } from './type';

// 模拟组织数据（树形）
export const mockOrganizations: Organization[] = [
	{
		id: 1,
		name: '翠湖花园智慧物业',
		manager: '王建华',
		position: '项目总监',
		memberCount: 68,
		children: [
			{
				id: 2,
				name: '物业运营中心',
				manager: '李明远',
				position: '运营主管',
				memberCount: 18,
				parentId: 1,
				parentName: '翠湖花园智慧物业',
				children: [
					{
						id: 3,
						name: '客服中心',
						manager: '周敏',
						position: '客服组长',
						memberCount: 6,
						parentId: 2,
						parentName: '物业运营中心'
					},
					{
						id: 4,
						name: '收费管理组',
						manager: '陈会计',
						position: '财务主管',
						memberCount: 4,
						parentId: 2,
						parentName: '物业运营中心'
					}
				]
			},
			{
				id: 5,
				name: '工程部',
				manager: '张工长',
				position: '工程主管',
				memberCount: 22,
				parentId: 1,
				parentName: '翠湖花园智慧物业',
				children: [
					{
						id: 6,
						name: '电梯维保组',
						manager: '张工',
						position: '高级技师',
						memberCount: 5,
						parentId: 5,
						parentName: '工程部'
					},
					{
						id: 7,
						name: '暖通空调组',
						manager: '李工',
						position: '高级技师',
						memberCount: 4,
						parentId: 5,
						parentName: '工程部'
					}
				]
			},
			{
				id: 8,
				name: '安防管理部',
				manager: '张卫国',
				position: '安防主管',
				memberCount: 16,
				parentId: 1,
				parentName: '翠湖花园智慧物业',
				children: [
					{
						id: 9,
						name: '监控中心',
						manager: '赵工',
						position: '监控班长',
						memberCount: 6,
						parentId: 8,
						parentName: '安防管理部'
					}
				]
			},
			{
				id: 10,
				name: '保洁绿化部',
				manager: '刘主管',
				position: '保洁主管',
				memberCount: 12,
				parentId: 1,
				parentName: '翠湖花园智慧物业'
			}
		]
	}
];

// 模拟子应用数据
export const mockApps: AppIndependentApp[] = [
	{
		id: 'work-order',
		name: '工单管理',
		hasIndependentOrg: true,
		organizations: [
			{
				id: 1,
				name: '工单服务中心',
				manager: '李明远',
				position: '运营主管',
				memberCount: 28,
				children: [
					{
						id: 2,
						name: '客服受理组',
						manager: '周敏',
						position: '客服组长',
						memberCount: 6,
						parentId: 1,
						parentName: '工单服务中心'
					},
					{
						id: 3,
						name: '维修执行组',
						manager: '孙工',
						position: '技师',
						memberCount: 12,
						parentId: 1,
						parentName: '工单服务中心'
					},
					{
						id: 4,
						name: '质检回访组',
						manager: '吴磊',
						position: '运营专员',
						memberCount: 3,
						parentId: 1,
						parentName: '工单服务中心'
					}
				]
			}
		]
	},
	{
		id: 'security',
		name: '安防监控',
		hasIndependentOrg: true,
		organizations: [
			{
				id: 1,
				name: '安防监控中心',
				manager: '张卫国',
				position: '安防主管',
				memberCount: 16,
				children: [
					{
						id: 2,
						name: '监控中心',
						manager: '赵工',
						position: '监控班长',
						memberCount: 8,
						parentId: 1,
						parentName: '安防监控中心'
					},
					{
						id: 3,
						name: '巡逻班组',
						manager: '周队',
						position: '巡逻队长',
						memberCount: 6,
						parentId: 1,
						parentName: '安防监控中心'
					}
				]
			}
		]
	},
	{
		id: 'property-payment',
		name: '物业缴费',
		hasIndependentOrg: false,
	},
	{
		id: 'community-operation',
		name: '社区运营',
		hasIndependentOrg: false,
	},
	{
		id: 'customer-evaluation',
		name: '客户评价',
		hasIndependentOrg: false,
	},
	{
		id: 'notice-management',
		name: '公告管理',
		hasIndependentOrg: false,
	},
	{
		id: 'parking-management',
		name: '停车管理',
		hasIndependentOrg: false,
	},
	{
		id: 'access-control',
		name: '门禁管理',
		hasIndependentOrg: false,
	},
	{
		id: 'asset-management',
		name: '资产管理',
		hasIndependentOrg: false,
	},
	{
		id: 'energy-management',
		name: '能源管理',
		hasIndependentOrg: false,
	},
	{
		id: 'resource-management',
		name: '资源管理',
		hasIndependentOrg: false,
	},
	{
		id: 'energy-management-2',
		name: '能源管理',
		hasIndependentOrg: false,
	},
	{
		id: 'resource-management-2',
		name: '能源管理',
		hasIndependentOrg: false,
	},
	{
		id: 'energy-management-3',
		name: '能源管理',
		hasIndependentOrg: false,
	},
	{
		id: 'resource-management-3',
		name: '能源管理',
		hasIndependentOrg: false,
	}
];

// 扁平化的组织数据（用于表格）
export function flattenOrganizations(list: Organization[]): Organization[] {
	let result: Organization[] = [];
	list.forEach(item => {
		result.push(item);
		if (item.children && item.children.length > 0) {
			result = result.concat(flattenOrganizations(item.children));
		}
	});
	return result;
}
