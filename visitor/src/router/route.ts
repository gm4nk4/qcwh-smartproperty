import { RouteRecordRaw } from 'vue-router';

/**
 * 建议：路由 path 路径与文件夹名称相同，找文件可浏览器地址找，方便定位文件位置
 *
 * 路由meta对象参数说明
 * meta: {
 *      title:          菜单栏及 tagsView 栏、菜单搜索名称（国际化）
 *      isLink：        是否超链接菜单，开启外链条件，`1、isLink: 链接地址不为空 2、isIframe:false`
 *      isHide：        是否隐藏此路由
 *      isKeepAlive：   是否缓存组件状态
 *      isAffix：       是否固定在 tagsView 栏上
 *      isIframe：      是否内嵌窗口，开启条件，`1、isIframe:true 2、isLink：链接地址不为空`
 *      roles：         当前路由权限标识，取角色管理。控制路由显示、隐藏。超级管理员：admin 普通角色：common
 *      icon：          菜单、tagsView 图标，阿里：加 `iconfont xxx`，fontawesome：加 `fa xxx`
 * }
 */

// 扩展 RouteMeta 接口
declare module 'vue-router' {
	interface RouteMeta {
		isLink?: string;
		isHide?: boolean;
		isAuth?: boolean;
		isKeepAlive?: boolean;
		isAffix?: boolean;
		isIframe?: boolean;
		roles?: string[];
		icon?: string;
	}
}

/**
 * 定义静态路由（默认路由）
 * 前端添加路由，请在此处加
 */
export const dynamicRoutes: Array<RouteRecordRaw> = [
	{
		path: '/visitor/overview',
		name: 'visitor.overview',
		component: () => import('/@/views/visitor/overview/index.vue'),
		meta: {
			title: '访客总览',
			enName: 'Visitor Overview',
			isLink: '',
			isHide: false,
			isKeepAlive: false,
			isAffix: true,
			isIframe: false,
			icon: 'ele-Grid',
		},
	},
	{
		path: '/visitor/appointment-records',
		name: 'visitor.appointmentRecords',
		component: () => import('/@/views/visitor/appointment-records/index.vue'),
		meta: {
			title: '预约记录',
			enName: 'Appointment Records',
			isLink: '',
			isHide: false,
			isKeepAlive: false,
			isAffix: false,
			isIframe: false,
			icon: 'ele-Calendar',
		},
	},
	{
		path: '/visitor/access-records',
		name: 'visitor.accessRecords',
		component: () => import('/@/views/visitor/access-records/index.vue'),
		meta: {
			title: '通行记录',
			enName: 'Access Records',
			isLink: '',
			isHide: false,
			isKeepAlive: false,
			isAffix: false,
			isIframe: false,
			icon: 'ele-Tickets',
		},
	},
	{
		path: '/visitor/blacklist',
		name: 'visitor.blacklist',
		component: () => import('/@/views/visitor/blacklist/index.vue'),
		meta: {
			title: '黑名单管理',
			enName: 'Blacklist Management',
			isLink: '',
			isHide: false,
			isKeepAlive: false,
			isAffix: false,
			isIframe: false,
			icon: 'ele-CircleCloseFilled',
		},
	},
	{
		path: '/visitor/config',
		name: 'visitor.config',
		component: () => import('/@/views/visitor/config/index.vue'),
		meta: {
			title: '访客配置',
			enName: 'Visitor Configuration',
			isLink: '',
			isHide: false,
			isKeepAlive: false,
			isAffix: false,
			isIframe: false,
			icon: 'ele-Setting',
		},
	},
	{
		path: '/visitor/park-guide',
		name: 'visitor.parkGuide',
		component: () => import('/@/views/visitor/park-guide/index.vue'),
		meta: {
			title: '园区访客管理说明',
			enName: 'Park Visitor Guide',
			isLink: '',
			isHide: false,
			isKeepAlive: false,
			isAffix: false,
			isIframe: false,
			icon: 'ele-Document',
		},
	},
	{
		path: '/personal',
		name: 'router.personal',
		component: () => import('/@/views/admin/user/personal.vue'),
		meta: {
			isHide: true,
		},
	},
	// ---------------------------------------------------------------------------
	// Phase 0 / P0-5: 一次性占位路由(permission/* 与 portal/*)。
	// 每条路由的 `component` 指向自己模块下的 `index.vue` 文件;Phase 0 阶段这些
	// 文件只是 `_placeholder/index.vue` 的 re-export 占位,Phase 1 的 Track C
	// 各任务把真实页面写到对应目录,不再需要改本文件(`route.ts` Phase 0 后冻结)。
	// ---------------------------------------------------------------------------
	{
		path: '/permission/user',
		name: 'permission.user',
		component: () => import('/@/views/permission/user/index.vue'),
		meta: {
			title: '用户管理',
			enName: 'User Management',
			isLink: '',
			isHide: false,
			isKeepAlive: false,
			isAffix: false,
			isIframe: false,
			icon: 'ele-User',
		},
	},
	{
		path: '/permission/role',
		name: 'permission.role',
		component: () => import('/@/views/permission/role/index.vue'),
		meta: {
			title: '角色管理',
			enName: 'Role Management',
			isLink: '',
			isHide: false,
			isKeepAlive: false,
			isAffix: false,
			isIframe: false,
			icon: 'ele-UserFilled',
		},
	},
	{
		path: '/permission/position',
		name: 'permission.position',
		component: () => import('/@/views/permission/position/index.vue'),
		meta: {
			title: '岗位管理',
			enName: 'Position Management',
			isLink: '',
			isHide: false,
			isKeepAlive: false,
			isAffix: false,
			isIframe: false,
			icon: 'ele-Postcard',
		},
	},
	{
		path: '/permission/space',
		name: 'permission.space',
		component: () => import('/@/views/permission/space/index.vue'),
		meta: {
			title: '空间管理',
			enName: 'Space Management',
			isLink: '',
			isHide: false,
			isKeepAlive: false,
			isAffix: false,
			isIframe: false,
			icon: 'ele-OfficeBuilding',
		},
	},
	{
		path: '/permission/organization',
		name: 'permission.organization',
		component: () => import('/@/views/permission/organization/index.vue'),
		meta: {
			title: '组织管理',
			enName: 'Organization Management',
			isLink: '',
			isHide: false,
			isKeepAlive: false,
			isAffix: false,
			isIframe: false,
			icon: 'ele-Coordinate',
		},
	},
	{
		path: '/portal/application',
		name: 'portal.application',
		component: () => import('/@/views/portal/application/index.vue'),
		meta: {
			title: '子应用管理',
			enName: 'Application Management',
			isLink: '',
			isHide: false,
			isKeepAlive: false,
			isAffix: false,
			isIframe: false,
			icon: 'ele-Menu',
		},
	},
	{
		path: '/portal/ai',
		name: 'portal.ai',
		component: () => import('/@/views/portal/ai/index.vue'),
		meta: {
			title: 'AI 工具中心',
			enName: 'AI Tools',
			isLink: '',
			isHide: false,
			isKeepAlive: false,
			isAffix: false,
			isIframe: false,
			icon: 'ele-MagicStick',
		},
	},
	{
		path: '/portal/category',
		name: 'portal.category',
		component: () => import('/@/views/portal/category/index.vue'),
		meta: {
			title: '应用分类',
			enName: 'Application Category',
			isLink: '',
			isHide: false,
			isKeepAlive: false,
			isAffix: false,
			isIframe: false,
			icon: 'ele-Files',
		},
	},
	{
		path: '/portal/workbench',
		name: 'portal.workbench',
		component: () => import('/@/views/portal/workbench/index.vue'),
		meta: {
			title: '工作台配置',
			enName: 'Workbench Configuration',
			isLink: '',
			isHide: false,
			isKeepAlive: false,
			isAffix: false,
			isIframe: false,
			icon: 'ele-Suitcase',
		},
	},
	// C11 例外:菜单管理(系统设置)— P0-5 未占位,本任务加一行路由
	{
		path: '/set/menu',
		name: 'set.menu',
		component: () => import('/@/views/set/menu/index.vue'),
		meta: {
			title: '菜单管理',
			enName: 'Menu Management',
			isLink: '',
			isHide: false,
			isKeepAlive: false,
			isAffix: false,
			isIframe: false,
			icon: 'ele-Operation',
		},
	},
];

/**
 * 定义静态路由（默认路由）
 */
export const staticRoutes: Array<RouteRecordRaw> = [
	{
		path: '/login',
		name: 'staticRoutes.login',
		component: () => import('/@/views/login/index.vue'),
		meta: {
			isAuth: false,
		},
	},
];

/**
 * 定义404、401界面
 */
export const notFoundAndNoPower = [
	{
		path: '/:path(.*)*',
		name: 'staticRoutes.notFound',
		component: () => import('/@/views/error/404.vue'),
		meta: {
			isHide: true,
		},
	},
	{
		path: '/401',
		name: 'staticRoutes.noPower',
		component: () => import('/@/views/error/401.vue'),
		meta: {
			isHide: true,
		},
	},
];

/**
 *  基础性路由
 *
 * 所有节点都是挂载此节点下
 */
export const baseRoutes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: '/',
		component: () => import('/@/layout/index.vue'),
		redirect: '/visitor/overview',
		meta: {
			isKeepAlive: true,
		},
		children: [],
	},
];
