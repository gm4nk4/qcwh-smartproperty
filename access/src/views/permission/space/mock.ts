/**
 * 空间管理模块模拟数据
 */
import type { Space } from './type';

// 空间类型映射
const typeMap: Record<string, { label: string; icon: string }> = {
	project: { label: '项目', icon: '🏢' },
	building: { label: '楼栋', icon: '🏛️' },
	floor: { label: '楼层', icon: '🏢' },
	room: { label: '房间', icon: '🚪' },
	public: { label: '公共区域', icon: '🏕️' }
};

// 模拟空间数据
export const mockSpaces: Space[] = [
	{
		id: 1,
		name: '园区A总览',
		code: 'CLHY',
		type: 'project',
		typeLabel: '项目',
		children: [
			{
				id: 2,
				name: 'A栋建筑',
				code: 'A',
				type: 'building',
				typeLabel: '楼栋',
				parentId: 1,
				children: [
					{
						id: 3,
						name: 'C栋一层',
						code: 'C-1F',
						type: 'floor',
						typeLabel: '楼层',
						parentId: 2,
						children: [
							{
								id: 4,
								name: 'C栋301',
								code: 'C-3F-301',
								type: 'room',
								typeLabel: '房间',
								parentId: 3
							},
							{
								id: 5,
								name: 'C栋302',
								code: 'C-3F-302',
								type: 'room',
								typeLabel: '房间',
								parentId: 3
							},
							{
								id: 6,
								name: 'C栋303',
								code: 'C-3F-303',
								type: 'room',
								typeLabel: '房间',
								parentId: 3
							}
						]
					},
					{
						id: 7,
						name: 'C栋二层',
						code: 'C-2F',
						type: 'floor',
						typeLabel: '楼层',
						parentId: 2
					},
					{
						id: 8,
						name: 'C栋三层',
						code: 'C-3F',
						type: 'floor',
						typeLabel: '楼层',
						parentId: 2
					}
				]
			},
			{
				id: 9,
				name: 'B栋建筑',
				code: 'B',
				type: 'building',
				typeLabel: '楼栋',
				parentId: 1
			},
			{
				id: 10,
				name: 'C栋建筑',
				code: 'C',
				type: 'building',
				typeLabel: '楼栋',
				parentId: 1
			}
		]
	},
	{
		id: 11,
		name: '园区B总览',
		code: 'CLHY-B',
		type: 'project',
		typeLabel: '项目'
	},
	{
		id: 12,
		name: '园区C总览',
		code: 'CLHY-C',
		type: 'project',
		typeLabel: '项目'
	},
	{
		id: 13,
		name: '地下车库',
		code: 'B1-PARKING',
		type: 'public',
		typeLabel: '公共区域'
	},
	{
		id: 14,
		name: '园林绿地',
		code: 'GARDEN',
		type: 'public',
		typeLabel: '公共区域'
	}
];
