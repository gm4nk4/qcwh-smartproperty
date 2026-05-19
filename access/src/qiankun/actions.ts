/**
 * qiankun actions 模块
 * @description 封装 qiankun 主应用与子应用之间的通信机制
 * - actions: qiankun 提供的全局状态管理器实例
 * - globalState: 响应式的全局状态，子应用可通过 getGlobalState() 获取
 * - 监听器: 在 main.ts mount/unmount 时统一管理，避免重复注册
 */
import type { MicroAppStateActions } from 'qiankun';
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import { ref } from 'vue';
import type { GlobalState } from './communication';

export type { GlobalState } from './communication';

/** qiankun actions 实例，由主应用在 mount 时注入 */
let actions: MicroAppStateActions | null = null;

/**
 * 全局响应式状态
 * @description 所有子应用组件共享的单一数据源
 */
const globalState = ref<GlobalState>({});

/** 当前监听器的取消函数，用于防止重复注册 */
let offChange: (() => void) | null = null;

/**
 * 设置 qiankun actions 实例
 * @description 由 main.ts 的 mount 钩子调用，注入主应用传递的 actions 对象
 * @param act - 主应用创建的 MicroAppStateActions 实例
 */
export function setActions(act: MicroAppStateActions) {
	actions = act;
}

/**
 * 获取 qiankun actions 实例
 * @returns actions 对象，子应用可调用 setGlobalState/onGlobalStateChange 等方法
 */
export function getActions() {
	return actions;
}

/**
 * 判断当前是否运行在 qiankun 环境
 * @returns true 表示在乾坤主应用环境中运行，false 表示独立运行
 */
export function isInQiankun() {
	return !!qiankunWindow.__POWERED_BY_QIANKUN__;
}

/**
 * 获取全局响应式状态
 * @returns 全局状态的响应式引用，组件可直接使用 globalState.value 访问
 * @example
 * const { globalState } = useQiankun();
 * console.log(globalState.value.token); // 访问 token
 */
export function getGlobalState() {
	return globalState;
}

/**
 * 初始化全局状态监听器
 * @description 在 main.ts mount 时调用，订阅主应用的全局状态变化
 * @description 使用单例模式：若已存在监听器则不再重复创建
 * @description 监听器注册后会立即触发一次回调，传入当前最新状态
 */
export function initGlobalStateListener() {
	if (!actions || offChange) return;
	offChange = (actions as any).onGlobalStateChange((state: GlobalState) => {
		globalState.value = state;
	}, true) as () => void;
}

/**
 * 销毁全局状态监听器
 * @description 在 main.ts unmount 时调用，清理监听器防止内存泄漏
 */
export function destroyGlobalStateListener() {
	if (offChange) {
		offChange();
		offChange = null;
	}
}
// 子应用路由同步
export const syncSubAppRoute = (to: any, from: any) => {
	let basePath = import.meta.env.VITE_QIANKUN_NAME;
	let hashUrl = location.hash;
	let targetPath = `/#/${basePath}${to.fullPath}`;
	if (isInQiankun()) {
		if (to.fullPath !== '/') {
			window.history.replaceState(null, '', targetPath);
		} else if (hashUrl.indexOf(`#/${basePath}`) !== -1) {
			targetPath = hashUrl.split(`#/${basePath}`)[1] || '/home';
		}
  }else{
    targetPath = to.path;
  }
  return targetPath;
};
