/**
 * ============================================
 * 【Mock 模式说明文档】
 * ============================================
 *
 * 当前文件处于 Mock 模式，使用本地模拟菜单数据，用于前端开发调试。
 *
 * 【还原说明】
 * 后端接口可用时，请告知："还原 backEnd.ts 移除 mock" 即可自动还原。
 *
 * 【还原步骤】
 * 1. 删除 mockMenuData 常量
 * 2. 将 getBackEndControlRoutes 函数中的 mock 代码删除
 * 3. 取消注释原有的 API 调用代码
 *
 * ============================================
 */

import { RouteRecordRaw } from 'vue-router';
import pinia from '/@/stores/index';
import { useUserInfo } from '/@/stores/userInfo';
import { useRequestOldRoutes } from '/@/stores/requestOldRoutes';
import { Session } from '/@/utils/storage';
import { NextLoading } from '/@/utils/loading';
import { baseRoutes, notFoundAndNoPower, dynamicRoutes, isErrorPageInLayout } from '/@/router/route';
import { formatTwoStageRoutes, formatFlatteningRoutes, router } from '/@/router/index';
import { useRoutesList } from '/@/stores/routesList';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import { useKeepALiveNames } from '/@/stores/keepAliveNames';
import { useMenuApi } from '/@/api/admin/menu';

// 后端控制路由

// 引入 api 请求接口
const menuApi = useMenuApi();

// ==================== Mock 菜单数据 ====================
// TODO: 后端接口可用时删除以下 mock 数据

/**
 * Mock 菜单数据
 * @description 模拟后端返回的菜单路由数据
 */
const mockMenuData = [
	{
		path: '/overview',
		name: 'overview',
		meta: {
			title: '数据总览',
			icon: 'iconfont icon-shouye',
			isHide: false,
			isKeepAlive: true,
			isAffix: false,
			isIframe: false,
		},
	},
	{
		path: '/gateMonitor',
		name: 'gateMonitor',
		meta: {
			title: '门岗监控',
			icon: 'iconfont icon-jiankong',
			isHide: false,
			isKeepAlive: true,
			isAffix: false,
			isIframe: false,
		},
	},
	{
		path: '/parkingLot',
		name: 'parkingLot',
		meta: {
			title: '停车场管理',
			icon: 'iconfont icon-tingche',
			isHide: false,
			isKeepAlive: true,
			isAffix: false,
			isIframe: false,
		},
	},
	{
		path: '/vehicle',
		name: 'vehicle',
		meta: {
			title: '车辆管理',
			icon: 'iconfont icon-cheliang',
			isHide: false,
			isKeepAlive: true,
			isAffix: false,
			isIframe: false,
		},
	},
	{
		path: '/enterpriseSpace',
		name: 'enterpriseSpace',
		meta: {
			title: '企业车位',
			icon: 'iconfont icon-chewei',
			isHide: false,
			isKeepAlive: true,
			isAffix: false,
			isIframe: false,
		},
	},
	{
		path: '/charge',
		name: 'charge',
		meta: {
			title: '收费管理',
			icon: 'iconfont icon-shoukuan',
			isHide: false,
			isKeepAlive: true,
			isAffix: false,
			isIframe: false,
		},
	},
	{
		path: '/passRecord',
		name: 'passRecord',
		meta: {
			title: '通行记录',
			icon: 'iconfont icon-jilu',
			isHide: false,
			isKeepAlive: true,
			isAffix: false,
			isIframe: false,
		},
	},
	{
		path: '/deviceMaintain',
		name: 'deviceMaintain',
		meta: {
			title: '岗亭设备维护',
			icon: 'iconfont icon-shebei',
			isHide: false,
			isKeepAlive: true,
			isAffix: false,
			isIframe: false,
		},
	},
	{
		path: '/blacklist',
		name: 'blacklist',
		meta: {
			title: '车辆黑名单',
			icon: 'iconfont icon-heimingdan',
			isHide: false,
			isKeepAlive: true,
			isAffix: false,
			isIframe: false,
		},
	},
	{
		path: '/aiTools',
		name: 'aiTools',
		meta: {
			title: 'AI工具箱',
			icon: 'iconfont icon-ai',
			isHide: false,
			isKeepAlive: true,
			isAffix: false,
			isIframe: false,
		},
	},
];

/**
 * 获取目录下的 .vue、.tsx 全部文件
 * @method import.meta.glob
 * @link 参考：https://cn.vitejs.dev/guide/features.html#json
 */
const layouModules: any = import.meta.glob('../layout/routerView/*.{vue,tsx}');
const viewsModules: any = import.meta.glob('../views/**/*.{vue,tsx}');
const dynamicViewsModules: Record<string, Function> = Object.assign({}, { ...layouModules }, { ...viewsModules });

/**
 * 后端控制路由：初始化方法，防止刷新时路由丢失
 * @method NextLoading 界面 loading 动画开始执行
 * @method useUserInfo().setUserInfos() 触发初始化用户信息 pinia
 * @method useRequestOldRoutes().setRequestOldRoutes() 存储接口原始路由（未处理component），根据需求选择使用
 * @method setAddRoute 添加动态路由
 * @method setFilterMenuAndCacheTagsViewRoutes 设置路由到 pinia routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
 */
export async function initBackEndControlRoutes() {
	// 界面 loading 动画开始执行
	if (window.nextLoading === undefined) NextLoading.start();
	// 无 token 停止执行下一步
	if (!Session.getToken()) return false;
	// 触发初始化用户信息 pinia
	await useUserInfo().setUserInfos();
	// 获取路由菜单数据
	const res = await getBackEndControlRoutes();
	// 无登录权限时，添加判断
	// https://gitee.com/lyt-top/vue-next-admin/issues/I64HVO
	if ((res.data || []).length <= 0) return Promise.resolve(true);
	// 存储接口原始路由（未处理component），根据需求选择使用
	useRequestOldRoutes().setRequestOldRoutes(JSON.parse(JSON.stringify(res.data)));
	// 处理路由（component），替换 baseRoutes（/@/router/route）第一个顶级 children 的路由
	baseRoutes[0].children = [...dynamicRoutes, ...(await backEndComponent(res.data))];
	// 添加动态路由
	await setAddRoute();
	// 设置路由到 pinia routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
	await setFilterMenuAndCacheTagsViewRoutes();
}

/**
 * 设置路由到 pinia routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
 * @description 用于左侧菜单、横向菜单的显示
 * @description 用于 tagsView、菜单搜索中：未过滤隐藏的(isHide)
 */
export async function setFilterMenuAndCacheTagsViewRoutes() {
	const storesRoutesList = useRoutesList(pinia);
	storesRoutesList.setRoutesList(baseRoutes[0].children as any);
	setCacheTagsViewRoutes();
}

/**
 * 缓存多级嵌套数组处理后的一维数组
 * @description 用于 tagsView、菜单搜索中：未过滤隐藏的(isHide)
 */
export function setCacheTagsViewRoutes() {
	const storesTagsView = useTagsViewRoutes(pinia);
	const storesKeepAliveNames = useKeepALiveNames(pinia);
	const routes = formatTwoStageRoutes(formatFlatteningRoutes(baseRoutes));
	storesTagsView.setTagsViewRoutes(routes[0].children);
	const cacheList: Array<string> = [];
	routes[0].children.forEach((v: any) => {
		if (v.meta && v.meta.isKeepAlive) {
			cacheList.push(v.name);
		}
	});
	storesKeepAliveNames.setCacheKeepAlive(cacheList);
}

/**
 * 处理路由格式及添加捕获所有路由或 404 Not found 路由
 * @description 替换 baseRoutes（/@/router/route）第一个顶级 children 的路由
 * @returns 返回替换后的路由数组
 */
export function setFilterRouteEnd() {
	let filterRouteEnd: any = formatTwoStageRoutes(formatFlatteningRoutes(baseRoutes));
	if (isErrorPageInLayout()) {
		filterRouteEnd[0].children = [...filterRouteEnd[0].children, ...notFoundAndNoPower];
	}
	return filterRouteEnd;
}

/**
 * 添加动态路由
 * @method router.addRoute
 * @description 此处循环为 baseRoutes（/@/router/route）第一个顶级 children 的路由一维数组，非多级嵌套
 * @link 参考：https://next.router.vuejs.org/zh/api/#addroute
 */
export function setAddRoute() {
	const routes = setFilterRouteEnd();
	routes.forEach((route: RouteRecordRaw) => {
		// 检查路由是否已存在，避免重复添加
		if (!router.hasRoute(route.name as string)) {
			router.addRoute(route);
		}
	});
}

/**
 * 请求后端路由菜单接口
 * @description isRequestRoutes 为 true，则开启后端控制路由
 * @returns 返回后端路由菜单数据
 */
export function getBackEndControlRoutes() {
	// ===== Mock 模式 =====
	// TODO: 后端接口可用时删除以下 mock 代码，恢复真实 API 调用
	return Promise.resolve({
		data: mockMenuData,
	});

	// ===== 原有代码：调用后端 API =====
	// return menuApi.getAdminMenu();
}

/**
 * 重新请求后端路由菜单接口
 * @description 用于菜单管理界面刷新菜单（未进行测试）
 * @description 路径：/src/views/admin/menu/component/addMenu.vue
 */
export async function setBackEndControlRefreshRoutes() {
	await getBackEndControlRoutes();
}

/**
 * 后端路由 component 转换
 * @param routes 后端返回的路由表数组
 * @returns 返回处理成函数后的 component
 */
export function backEndComponent(routes: any) {
	if (!routes) return;
	return routes.map((item: any) => {
		if (item.path && item.path.startsWith('http')) {
			if (item.meta.isIframe) {
				item.component = () => import('/@/layout/routerView/iframes.vue');
			} else {
				item.component = () => import('/@/layout/routerView/link.vue');
			}
			item.path = '/iframes/' + window.btoa(item.path);
		} else if (item.path) {
			item.component = dynamicImport(dynamicViewsModules, item.path.split('/:')[0]);
		}
		if (item.children) {
			item.children = backEndComponent(item.children);
			if (item.children && item.children.length > 0) {
				item.redirect = item.children[0].path;
			}
		}
		return item;
	});
}

/**
 * 后端路由 component 转换函数
 * @param dynamicViewsModules 获取目录下的 .vue、.tsx 全部文件
 * @param component 当前要处理项 component
 * @returns 返回处理成函数后的 component
 */
export function dynamicImport(dynamicViewsModules: Record<string, Function>, component: string) {
	const keys = Object.keys(dynamicViewsModules);

	// 移除路径开头的斜杠
	const normalizedComponent = component.startsWith('/') ? component.slice(1) : component;

	const matchKeys = keys.filter((key) => {
		const k = key.replace(/..\/views|../, '');
		// 支持多种路径格式：/xxx.vue, /xxx/index.vue, xxx.vue, xxx/index.vue
		return (
			k === `/${normalizedComponent}.vue` ||
			k === `/${normalizedComponent}/index.vue` ||
			k.startsWith(`/${normalizedComponent}.vue`) ||
			k.startsWith(`/${normalizedComponent}/index.vue`) ||
			k === `${normalizedComponent}.vue` ||
			k === `${normalizedComponent}/index.vue`
		);
	});
	if (matchKeys?.length === 1) {
		const matchKey = matchKeys[0];
		return dynamicViewsModules[matchKey];
	}
	if (matchKeys?.length > 1) {
		console.warn(`Multiple components found for path ${component}, using the first one`);
		return dynamicViewsModules[matchKeys[0]];
	}
	// console.warn(`No component found for path ${component}`);
	return () => import('/@/views/error/404.vue');
}
