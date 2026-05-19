/**
 * @file qiankun 主应用全局状态管理
 * @description 管理主应用与子应用之间的状态同步
 */

import { initGlobalState, MicroAppStateActions } from 'qiankun';
import type { GlobalState, Message } from './communication';
import { Session } from '/@/utils/storage';
import { setQiankunActions, getInitialState, syncToGlobalState, setIsSyncingFromSubApp } from '/@/stores/plugin/qiankunSync';

// ================================================ 类型定义 ================================================

interface QiankunWindow {
	goMainApp?: () => void;
	navigateTo?: (path: string) => void;
	goBack?: () => void;
	toggleFullscreen?: () => void;
}

declare global {
	interface Window {
		__QIANKUN__?: QiankunWindow;
	}
}

// ================================================ 初始状态 ================================================

const initialState: GlobalState = {
	token: Session.get('token'),
	apiPrefix: '/api',
	test: null,
	themeConfig: {},
	userInfos: {},
	subAppRoute: {},
	isScreenfull: false,
	__MESSAGE_FROM_SUB_APP__: null as Message | null,
};

// ================================================ 回调函数注册 ================================================

/** 子应用跳转路由回调 */
let navigateCallback: ((path: string) => void) | null = null;

/** 子应用返回上一级回调 */
let goBackCallback: (() => void) | null = null;

/** 返回主应用回调 */
let goMainAppCallback: (() => void) | null = null;

/** 切换全屏状态回调 */
let toggleFullscreenCallback: (() => void) | null = null;

/**
 * 注册导航回调 - 子应用可调用此方法跳转到其他子应用
 */
export function registerNavigateCallback(callback: (path: string) => void) {
	navigateCallback = callback;
}

/**
 * 注册返回回调 - 子应用可调用此方法返回上一级
 */
export function registerGoBackCallback(callback: () => void) {
	goBackCallback = callback;
}

/**
 * 注册返回主应用回调
 */
export function registerGoMainAppCallback(callback: () => void) {
	goMainAppCallback = callback;
}

// ================================================ 暴露给子应用的方法 ================================================

/**
 * 跳转到指定路由（子应用间跳转）
 */
export function navigateTo(path: string) {
	if (navigateCallback) {
		navigateCallback(path);
	} else {
		window.history.pushState({}, '', path);
		window.dispatchEvent(new PopStateEvent('popstate'));
	}
}

/**
 * 返回上一级
 */
export function goBack() {
	if (goBackCallback) {
		goBackCallback();
	} else {
		if (window.history.length > 1) {
			window.history.back();
		} else {
			window.location.href = '/#/home';
		}
	}
}

/**
 * 返回主应用
 */
export function goMainApp() {
	if (goMainAppCallback) {
		goMainAppCallback();
	} else {
		window.history.pushState({}, '', '/#/home');
		window.location.href = '/#/home';
	}
}

// 暴露到全局供子应用调用
window.__QIANKUN__ = window.__QIANKUN__ || {};
window.__QIANKUN__.goMainApp = goMainApp;
window.__QIANKUN__.navigateTo = navigateTo;
window.__QIANKUN__.goBack = goBack;
window.__QIANKUN__.toggleFullscreen = toggleFullscreen;
// ================================================ 全局状态操作 ================================================

/**
 * 设置用户信息到全局状态
 */
export function setUserInfo(userInfo: Record<string, unknown>) {
	actions.setGlobalState({ userInfo });
}

/**
 * 设置主题配置到全局状态
 */
export function setThemeConfig(themeConfig: Record<string, unknown>) {
	actions.setGlobalState({ themeConfig });
}

/**
 * 切换全屏状态
 * @description 获取当前全屏状态并切换
 */
export async function toggleFullscreen() {
	const { useMicroApp } = await import('/@/stores/microApp');
	const store = useMicroApp();
	const newValue = !store.isScreenfull;
	if (toggleFullscreenCallback) {
		toggleFullscreenCallback();
	}
	store.setIsScreenfull(newValue);
	actions.setGlobalState({ isScreenfull: newValue });
}

/**
 * 设置全屏状态到全局状态
 */
export function setIsScreenfull(isScreenfull: boolean) {
	actions.setGlobalState({ isScreenfull });
}

/**
 * 通用设置全局状态
 */
export function setGlobalState(state: Record<string, unknown>) {
	actions.setGlobalState(state);
}

/**
 * 通用监听全局状态变化
 */
export function onGlobalStateChange(callback: (state: Record<string, unknown>) => void, fireImmediately = true) {
	actions.onGlobalStateChange((state) => {
		callback(state);
	}, fireImmediately);
}

/**
 * 清空全局状态
 */
export function clearGlobalState() {
	actions.setGlobalState({});
}

/**
 * 主应用更新全局状态（会同步给所有子应用）
 */
export function updateGlobalState(state: Partial<GlobalState>) {
	actions.setGlobalState(state);
}

// ================================================ Pinia Store 缓存 ================================================

/** 缓存 themeConfig store 实例，避免重复 import */
let themeConfigStore: ReturnType<typeof import('/@/stores/themeConfig').useThemeConfig> | null = null;

/** 缓存 userInfo store 实例 */
let userInfoStore: ReturnType<typeof import('/@/stores/userInfo').useUserInfo> | null = null;

/** 缓存 microApp store 实例 */
let microAppStore: ReturnType<typeof import('/@/stores/microApp').useMicroApp> | null = null;

/**
 * 获取所有 store 实例（懒加载 + 缓存）
 */
async function getStores() {
	if (!themeConfigStore) {
		const { useThemeConfig } = await import('/@/stores/themeConfig');
		themeConfigStore = useThemeConfig();
	}
	if (!userInfoStore) {
		const { useUserInfo } = await import('/@/stores/userInfo');
		userInfoStore = useUserInfo();
	}
	if (!microAppStore) {
		const { useMicroApp } = await import('/@/stores/microApp');
		microAppStore = useMicroApp();
	}
	return { themeConfigStore, userInfoStore, microAppStore };
}

// ================================================ 状态同步：主应用 -> Pinia Store ================================================

/**
 * 将子应用更新的状态同步到主应用 Pinia Store
 * 用于实现：子应用 setGlobalState -> 主应用 Store 更新
 */
async function syncStateToStores(newState: GlobalState) {
	const { themeConfigStore, userInfoStore, microAppStore } = await getStores();

	// 同步主题配置
	if (newState.themeConfig !== undefined) {
		themeConfigStore.setThemeConfig({ themeConfig: newState.themeConfig });
	}

	// 同步用户信息
	if (newState.userInfos !== undefined) {
		userInfoStore.userInfos = newState.userInfos;
	}

	// 同步全屏状态
	if (newState.isScreenfull !== undefined) {
		microAppStore.setIsScreenfull(newState.isScreenfull!);
	}
}

// ================================================ 子应用消息处理 ================================================

/**
 * 处理子应用发送给主应用的消息
 */
function handleMessageFromSubApp(msg: Message) {
	const { type, data } = msg;
	console.log('[主应用] 收到子应用消息：', type, data);

	switch (type) {
		case 'logout':
			// 子应用触发退出登录
			console.log('[主应用] 子应用请求退出登录');
			Session.clear();
			break;
		case 'update:theme':
			// 子应用修改主题
			updateGlobalState({ theme: data });
			break;
		default:
			break;
	}
}

// ================================================ 全局状态监听器 ================================================

/** 防止重复注册监听器的标志 */
let isListenerRegistered = false;

/**
 * 全局状态变化监听器回调
 * 职责：1. 处理子应用消息 2. 同步状态到 Pinia Store
 */
async function onGlobalStateChangeHandler(newState: GlobalState, prevState: GlobalState) {
	// 1. 设置标志，防止 Pinia Plugin 循环触发 setGlobalState
	setIsSyncingFromSubApp(true);

	console.log('[主应用] 全局状态变化：', newState);

	// 2. 处理子应用发送的通信消息
	if (newState.__MESSAGE_FROM_SUB_APP__) {
		const msg = newState.__MESSAGE_FROM_SUB_APP__;
		handleMessageFromSubApp(msg);
		// 消费完清空，避免重复触发
		actions.setGlobalState({ __MESSAGE_FROM_SUB_APP__: null });
	}

	// 3. 同步状态到 Pinia Store（打破循环依赖）
	await syncStateToStores(newState);

	// 4. 清除标志
	setIsSyncingFromSubApp(false);
}

// ================================================ 初始化 ================================================

/** 获取 qiankun 全局状态操作实例 */
export const actions: MicroAppStateActions = initGlobalState(initialState);

/** 注册 actions 到 Pinia Plugin（用于 Pinia Store 变化时同步到 global state） */
setQiankunActions(actions);

/** 注册全局状态监听器（防止热更新重复注册） */
if (!isListenerRegistered) {
	actions.onGlobalStateChange(onGlobalStateChangeHandler, false);
	isListenerRegistered = true;
}

/** 初始化同步：将 Pinia Store 状态同步到 global state（供子应用读取） */
getInitialState().then((state) => {
	syncToGlobalState(state);
});
