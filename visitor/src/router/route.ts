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
		enName?: string;
	}
}

// ---------------------------------------------------------------------------
// visitor 业务路由：访客总览 / 预约记录 / 通行记录 / 黑名单管理 / 访客配置 / 园区访客管理说明
// ---------------------------------------------------------------------------
const visitorRoutes: Array<RouteRecordRaw> = [
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
];

// ---------------------------------------------------------------------------
// 设置（系统设置）路由：用户管理 / 角色管理 / 组织管理 / 菜单管理
// menuRoutes 中会以「设置」为父菜单把这 4 条合并展示，
// dynamicRoutes 中保持扁平以避免 vue-router 嵌套注册。
// ---------------------------------------------------------------------------
const userRoute: RouteRecordRaw = {
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
};

const roleRoute: RouteRecordRaw = {
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
};

const organizationRoute: RouteRecordRaw = {
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
};

const menuRoute: RouteRecordRaw = {
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
};

const settingsRoutes: Array<RouteRecordRaw> = [userRoute, roleRoute, organizationRoute, menuRoute];

// 个人中心（隐藏）
const personalRoute: RouteRecordRaw = {
	path: '/personal',
	name: 'router.personal',
	component: () => import('/@/views/admin/user/personal.vue'),
	meta: {
		isHide: true,
	},
};

/**
 * 定义静态路由（默认路由）
 * vue-router 实际注册的路由集合，**保持扁平**。
 * 「设置」父节点仅用于左侧菜单分组（见 menuRoutes），不在此处生成 vue-router 路由。
 */
export const dynamicRoutes: Array<RouteRecordRaw> = [
	...visitorRoutes,
	...settingsRoutes,
	personalRoute,
];

/**
 * 左侧菜单结构（含「设置」父级分组）
 * - 顶层项：访客总览 / 预约记录 / 通行记录 / 黑名单管理 / 访客配置 / 园区访客管理说明
 * - 「设置」父级 children：用户管理 / 角色管理 / 组织管理 / 菜单管理
 *
 * 注意：此处的子项与 dynamicRoutes 是同一个对象引用，meta/icon/path 完全一致，
 * 仅为菜单渲染（aside.vue → vertical.vue → SubItem）提供分组结构。
 */
export const menuRoutes: Array<RouteRecordRaw> = [
	...visitorRoutes,
	{
		path: '/set',
		name: 'set',
		meta: {
			title: '设置',
			enName: 'Settings',
			isLink: '',
			isHide: false,
			isKeepAlive: false,
			isAffix: false,
			isIframe: false,
			icon: 'ele-Tools',
		},
		children: settingsRoutes,
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
