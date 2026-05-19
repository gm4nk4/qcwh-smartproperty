/**
 * @file Pinia Plugin - Qiankun 状态同步
 * @description 将 Pinia Store 状态同步到 qiankun 全局状态，供子应用访问
 */

import { PiniaPluginContext } from 'pinia';
import { watch } from 'vue';

// ================================================ 模块级变量 ================================================

/** qiankun actions 实例 */
let actionsInstance: any = null;

/** 是否已完成初始化同步 */
let isInitialized = false;

/** 是否正在从子应用同步状态（用于打破循环） */
let isSyncingFromSubApp = false;

/** 记录上次同步的值，用于去重 */
let lastSyncValues: Record<string, any> = {};

// ================================================ 工具函数 ================================================

/**
 * 判断是否需要同步
 * @description 比较新值与上次同步的值，如果相同则跳过
 */
function shouldSync(storeId: string, newVal: any): boolean {
	const key = `__sync_${storeId}`;
	const serialized = JSON.stringify(newVal);

	if (lastSyncValues[key] === serialized) {
		return false;
	}

	lastSyncValues[key] = serialized;
	return true;
}

// ================================================ 导出函数 ================================================

/**
 * 设置 qiankun actions 实例
 * @description 供 actions.ts 调用，注册全局状态操作实例
 */
export function setQiankunActions(actions: any) {
	actionsInstance = actions;
}

/**
 * 设置从子应用同步状态的标志
 * @description true = 正在从子应用同步，watch 应跳过避免循环触发
 */
export function setIsSyncingFromSubApp(val: boolean) {
	isSyncingFromSubApp = val;
}

/**
 * 初始状态数据类型
 */
export interface InitialState {
	themeConfig: any;
	userInfos: any;
	isScreenfull: boolean;
}

/**
 * 获取三个 Store 的初始状态
 * @description 懒加载 store 并获取其状态，用于初始化同步
 */
export function getInitialState(): Promise<InitialState> {
	return Promise.all([
		import('/@/stores/themeConfig').then(({ useThemeConfig }) => useThemeConfig().$state.themeConfig),
		import('/@/stores/userInfo').then(({ useUserInfo }) => useUserInfo().$state.userInfos),
		import('/@/stores/microApp').then(({ useMicroApp }) => useMicroApp().$state.isScreenfull),
	]).then(([themeConfig, userInfos, isScreenfull]) => ({
		themeConfig: JSON.parse(JSON.stringify(themeConfig)),
		userInfos: JSON.parse(JSON.stringify(userInfos)),
		isScreenfull,
	}));
}

/**
 * 同步初始状态到 qiankun 全局状态
 * @description 初始化时调用一次，将主应用状态同步给子应用
 */
export function syncToGlobalState(state: InitialState) {
	if (!actionsInstance) return;

	actionsInstance.setGlobalState(state);
	isInitialized = true;
}

// ================================================ Pinia Plugin ================================================

/**
 * Pinia Plugin：监听 Store 变化，同步到 qiankun 全局状态
 * @description 当 themeConfig / userInfo / microApp Store 变化时，自动同步到 global state
 */
const qiankunSyncPlugin = ({ store }: PiniaPluginContext) => {
	// 监听 themeConfig 变化
	if (store.$id === 'themeConfig') {
		watch(
			() => store.$state.themeConfig,
			(newVal) => {
				// 条件：已有 actions、未初始化、正在从子应用同步、值无变化
				if (!actionsInstance || !isInitialized || isSyncingFromSubApp || !shouldSync('themeConfig', newVal)) {
					return;
				}
				actionsInstance.setGlobalState({ themeConfig: JSON.parse(JSON.stringify(newVal)) });
			},
			{ deep: true }
		);
	}

	// 监听 userInfo 变化
	if (store.$id === 'userInfo') {
		watch(
			() => store.$state.userInfos,
			(newVal) => {
				if (!actionsInstance || !isInitialized || isSyncingFromSubApp || !shouldSync('userInfos', newVal)) {
					return;
				}
				actionsInstance.setGlobalState({ userInfos: JSON.parse(JSON.stringify(newVal)) });
			},
			{ deep: true }
		);
	}

	// 监听 microApp（全屏状态）变化
	if (store.$id === 'microApp') {
		watch(
			() => store.$state.isScreenfull,
			(newVal) => {
				if (!actionsInstance || !isInitialized || isSyncingFromSubApp || !shouldSync('isScreenfull', newVal)) {
					return;
				}
				actionsInstance.setGlobalState({ isScreenfull: newVal });
			}
		);
	}
};

export default qiankunSyncPlugin;
