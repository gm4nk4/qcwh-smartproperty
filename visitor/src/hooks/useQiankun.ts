/**
 * useQiankun Hook
 * @description 子应用专用：获取主应用状态、导航方法、发送消息
 * @usage 在任意 Vue 组件中调用 const { globalState, inQiankun, goMainApp } = useQiankun()
 */
import { getActions, isInQiankun, getGlobalState } from '/@/qiankun/actions';
import type { Message } from '/@/qiankun/communication';

/**
 * useQiankun
 * @returns 返回与主应用交互所需的方法和状态
 */
export function useQiankun() {
	const actions = getActions();
	const inQiankun = isInQiankun();

	/** 全局响应式状态，直接访问 globalState.value 获取数据 */
	const globalState = getGlobalState();

	/**
	 * 返回主应用（统一门户）首页
	 * @example goMainApp()
	 */
	const goMainApp = () => {
		if (!inQiankun) return;
		(window as any)?.__QIANKUN__?.goMainApp();
	};

	/**
	 * 在子应用内跳转到指定路由
	 * @param path - 目标路由路径，如 '/dashboard'
	 * @example navigateTo('/dashboard')
	 */
	const navigateTo = (path: string) => {
		if (!inQiankun) return;
		(window as any)?.__QIANKUN__?.navigateTo(path);
	};

	/**
	 * 返回上一页（浏览器历史记录）
	 * @example goBack()
	 */
	const goBack = () => {
		if (!inQiankun) return;
		(window as any)?.__QIANKUN__?.goBack();
	};

	/**
	 * 切换浏览器全屏模式
	 * @example toggleFullscreen()
	 */
	const toggleFullscreen = () => {
		if (!inQiankun) return;
		(window as any)?.__QIANKUN__?.toggleFullscreen();
	};

	/**
	 * 发送消息给主应用
	 * @param type - 消息类型，如 'logout'、'update:theme'
	 * @param data - 消息携带的数据
	 * @example sendMessage('logout', { reason: 'user click logout' })
	 */
	function sendMessage<T = any>(type: Message['type'], data?: T) {
		if (!inQiankun || !actions) {
			console.warn('不在 qiankun 环境，无法发送消息');
			return;
		}
		actions.setGlobalState({
			__MESSAGE_FROM_SUB_APP__: { type, data },
		});
	}

	/**
	 * 更新主应用的全局状态
	 * @param state - 要更新的状态字段（会与现有状态合并）
	 * @example updateGlobalState({ userInfo: { name: '新用户' } })
	 */
	function updateGlobalState(state: Record<string, unknown>) {
		if (!inQiankun || !actions) return;
		actions.setGlobalState(state);
	}

	return {
		/** 是否在 qiankun 主应用环境中运行 */
		inQiankun,
		/** 主应用全局状态（响应式 ref） */
		globalState,
		/** 返回主应用首页 */
		goMainApp,
		/** 子应用内路由跳转 */
		navigateTo,
		/** 返回上一页 */
		goBack,
		/** 切换全屏 */
		toggleFullscreen,
		/** 发送消息给主应用 */
		sendMessage,
		/** 更新主应用全局状态 */
		updateGlobalState,
	};
}
