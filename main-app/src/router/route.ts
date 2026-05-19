import { RouteRecordRaw } from 'vue-router';
import subApps from '/@/config/apps';

const IS_ERROR_PAGE_IN_LAYOUT = false;

export const isErrorPageInLayout = () => IS_ERROR_PAGE_IN_LAYOUT;

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
export const dynamicRoutes: Array<RouteRecordRaw> = [];

/**
 * 定义静态路由（默认路由）
 */
const createQiankunRoutes = () => {
	return subApps.map((item) => ({
		path: item.routePath + '/:subpath(.*)*',
		name: item.name,
		component: () => import('/@/views/Home.vue'),
		meta: {
			title: item.description,
		},
	}));
};
const errorPageInLayoutRoutes: RouteRecordRaw[] = [
	{
		path: '/401',
		name: 'staticRoutes.noPower',
		component: () => import('/@/views/error/401.vue'),
		meta: {
			isAuth: false,
			isHide: true,
		},
	},
	{
		path: '/404',
		name: 'staticRoutes.notFound',
		component: () => import('/@/views/error/404.vue'),
		meta: {
			isAuth: false,
			isHide: true,
		},
	},
];

const errorPageStandaloneRoutes: RouteRecordRaw[] = [
	{
		path: '/401',
		name: 'staticRoutes.noPower',
		component: () => import('/@/views/error/401.vue'),
		meta: {
			isAuth: false,
			isHide: true,
		},
	},
	{
		path: '/404',
		name: 'staticRoutes.notFound',
		component: () => import('/@/views/error/404.vue'),
		meta: {
			isAuth: false,
			isHide: true,
		},
	},
	{
		path: '/:pathMatch(.*)*',
		name: 'staticRoutes.catchAll',
		component: () => import('/@/views/error/404.vue'),
		meta: {
			isAuth: false,
			isHide: true,
		},
	},
];

export const staticRoutes: Array<RouteRecordRaw> = [
	{
		path: '/login',
		name: 'staticRoutes.login',
		component: () => import('/@/views/login/index.vue'),
		meta: {
			isAuth: false,
		},
	},
	...(IS_ERROR_PAGE_IN_LAYOUT ? errorPageInLayoutRoutes : []),
	{
		path: '/home',
		name: 'staticRoutes.home',
		component: () => import('/@/views/Home.vue'),
		meta: {
			isAuth: true,
		},
	},
	{
		path: '/',
		name: 'Home',
		component: () => import('/@/views/Home.vue'),
	},
	...createQiankunRoutes(),
];

export const notFoundAndNoPower = IS_ERROR_PAGE_IN_LAYOUT
	? [
			{
				path: '/:path(.*)*',
				name: 'staticRoutes.notFound',
				component: () => import('/@/views/error/404.vue'),
				meta: {
					isHide: true,
				},
			},
		]
	: errorPageStandaloneRoutes;

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
		redirect: '/home',
		meta: {
			isKeepAlive: true,
		},
		children: [],
	},
];
