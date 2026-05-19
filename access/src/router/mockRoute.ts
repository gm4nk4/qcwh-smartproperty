/**
 * Mock 菜单数据
 * @description 模拟后端返回的菜单路由数据
 */
export const mockMenuRoutes = [
	{
		path: '/permission',
		name: 'permission',
		meta: {
			title: '统一用户和权限',
			icon: 'iconfont icon-shouye',
			isHide: false,
			isKeepAlive: true,
			isAffix: false,
			isIframe: false,
		},
		children: [
			{
				path: '/permission/user',
				name: 'user',
				level: 2,
				meta: {
					title: '用户管理',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
				},
			},
			{
				path: '/permission/role',
				name: 'role',
				level: 2,
				meta: {
					title: '角色管理',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
				},
			},
			{
				path: '/permission/position',
				name: 'position',
				level: 2,
				meta: {
					title: '岗位管理',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
				},
			},
			{
				path: '/permission/space',
				name: 'space',
				level: 2,
				meta: {
					title: '空间管理',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
				},
			},
			{
				path: '/permission/organization',
				name: 'organization',
				level: 2,
				meta: {
					title: '组织管理',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
				},
			},
		],
	},
	{
		path: '/portal',
		name: 'portal',
		meta: {
			title: '统一门户',
			icon: 'iconfont icon-shouye',
			isHide: false,
			isKeepAlive: true,
			isAffix: false,
			isIframe: false,
		},
		children: [
			{
				path: '/portal/application',
				name: 'application',
				level: 2,
				meta: {
					title: '子应用管理',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
				},
			},
			{
				path: '/portal/ai',
				name: 'ai',
				level: 2,
				meta: {
					title: 'AI工具中心',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
				},
			},
			{
				path: '/portal/category',
				name: 'category',
				level: 2,
				meta: {
					title: '应用分类',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
				},
			},
			{
				path: '/portal/workbench',
				name: 'workbench',
				level: 2,
				meta: {
					title: '工作台配置',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
				},
			},
		],
	},
	{
		path: '/log',
		name: 'log',
		meta: {
			title: '日志管理',
			icon: 'iconfont icon-shouye',
			isHide: false,
			isKeepAlive: true,
			isAffix: false,
			isIframe: false,
		},
		children: [
			{
				path: '/log/audit',
				name: 'audit',
				level: 2,
				meta: {
					title: '操作审计',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
				},
			},
			{
				path: '/log/login',
				name: 'login',
				level: 2,
				meta: {
					title: '登录用户',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
				},
			},
			{
				path: '/log/visit',
				name: 'visit',
				level: 2,
				meta: {
					title: '访问统计',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
				},
			},
			{
				path: '/log/maintenance',
				name: 'maintenance',
				level: 2,
				meta: {
					title: '维护管理',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
				},
			},
		],
	},
];
