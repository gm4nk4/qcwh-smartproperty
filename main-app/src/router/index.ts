import { createRouter, createWebHashHistory } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import pinia from '/@/stores/index';
import { storeToRefs } from 'pinia';
import { useRoutesList } from '/@/stores/routesList';
import { Session } from '/@/utils/storage';
import { staticRoutes, notFoundAndNoPower, isErrorPageInLayout } from '/@/router/route';
import { initBackEndControlRoutes } from '/@/router/backEnd';

export const router = createRouter({
	history: createWebHashHistory(),
	routes: isErrorPageInLayout()
		? [...staticRoutes]
		: [...notFoundAndNoPower, ...staticRoutes],
});

/**
 * 路由多级嵌套数组处理成一维数组
 * @param arr 传入路由菜单数据数组
 * @returns 返回处理后的一维路由菜单数组
 */
export function formatFlatteningRoutes(arr: any) {
	if (arr.length <= 0) return false;
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].children) {
			arr = arr.slice(0, i + 1).concat(arr[i].children, arr.slice(i + 1));
		}
	}
	return arr;
}

/**
 * 一维数组处理成多级嵌套数组（只保留二级：也就是二级以上全部处理成只有二级，keep-alive 支持二级缓存）
 * @description isKeepAlive 处理 `name` 值，进行缓存。顶级关闭，全部不缓存
 * @link 参考：https://v3.cn.vuejs.org/api/built-in-components.html#keep-alive
 * @param arr 处理后的一维路由菜单数组
 * @returns 返回将一维数组重新处理成 `定义动态路由（baseRoutes）` 的格式
 */
export function formatTwoStageRoutes(arr: any) {
	if (arr.length <= 0) return false;
	const newArr: any = [];
	arr.forEach((v: any) => {
		if (v.path === '/') {
			newArr.push({ component: v.component, name: v.name, path: v.path, redirect: v.redirect, meta: v.meta, children: [] });
		} else {
			if (v.path.indexOf('/:') > -1) {
				v.meta['isDynamic'] = true;
				v.meta['isDynamicPath'] = v.path;
			}
			newArr[0].children.push({ ...v });
		}
	});
	return newArr;
}

let isInitializing = false;

// 路由加载前
router.beforeEach(async (to, from, next) => {
	NProgress.configure({ showSpinner: false });
	if (to.name) NProgress.start();
	const token = Session.getToken();
	if (to.meta.isAuth !== undefined && !to.meta.isAuth) {
		next();
		NProgress.done();
	} else if (!token) {
		next(`/login?redirect=${to.path}&params=${JSON.stringify(to.query ? to.query : to.params)}`);
		Session.clear();
		NProgress.done();
	} else if (to.path === '/login') {
		next('/home');
		NProgress.done();
	} else {
		const storesRoutesList = useRoutesList(pinia);
		const { routesList } = storeToRefs(storesRoutesList);
		if (routesList.value.length === 0 && !isInitializing) {
			isInitializing = true;
			await initBackEndControlRoutes();
			isInitializing = false;
			if (routesList.value.length === 0) {
				next('/404');
			} else {
				next({ path: to.path, query: to.query, replace: true });
			}
		} else {
			next();
		}
	}
});

// 路由加载后
router.afterEach(() => {
	NProgress.done();
});

// 导出路由
export default router;
