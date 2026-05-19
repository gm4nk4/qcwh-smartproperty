import { registerMicroApps, start, setDefaultMountApp, addGlobalUncaughtErrorHandler } from 'qiankun';
import subApps from '/@/config/apps';
import { actions, goBack } from './actions';
import { useMessageBox } from '/@/hooks/message';
import { useMicroApp } from '/@/stores/microApp';
import { NextLoading } from '/@/utils/loading';
import { useThemeOrUserInfo } from '/@/hooks/useThemeOrUserInfo';

const { themeConfig, userInfos, isScreenfull } = useThemeOrUserInfo();
const microAppStore = useMicroApp();
let isStarted = false;

export function initMicroApps(cb: () => void) {
	registerMicroApps(
		subApps.map((app) => ({
			name: app.name,
			entry: app.entry,
			container: app.container,
			activeRule: (location) => {
				let path = '';
				if (location.hash && location.hash.startsWith('#/')) {
					path = location.hash.slice(1);
				} else if (location.pathname && location.pathname.startsWith('/')) {
					path = location.pathname;
				}
				return path === app.routePath || path.startsWith(app.routePath + '/');
			},
			props: {
				actions,
				themeConfig,
				userInfos,
				isScreenfull,
				apiPrefix: app.apiPrefix || '/api'
			},
		})),
		{
			beforeLoad: [
				(app) => {
					console.log('[主应用] before load', app.name);
					return Promise.resolve();
				},
			],
			beforeMount: [
				(app) => {
					console.log('[主应用] before mount', app.name);
					return Promise.resolve();
				},
			],
			afterMount: [
				(app) => {
					NextLoading.done();
					console.log('[主应用] after mount', app.name);
					return Promise.resolve();
				},
			],
			beforeUnmount: [
				(app) => {
					console.log('[主应用] before unmount', app.name);
					return Promise.resolve();
				},
			],
			afterUnmount: [
				(app) => {
					console.log('[主应用] after unmount', app.name);
					return Promise.resolve();
				},
			],
		}
	);

	addGlobalUncaughtErrorHandler((event) => {
		// console.error('[主应用] 全局异常捕获:', event);
		const appName = microAppStore.currentMicroApp?.name || '未知微应用';
		const errorMsg = (event as any).error?.message || '加载失败';
		NextLoading.done();
		if (errorMsg.indexOf(appName) !== -1) {
			useMessageBox()
				.confirm(`微应用「${appName}」加载失败，是否返回首页？`)
				.then(() => {
					window.location.href = '/#/home';
				})
				.catch(() => {
					console.log('用户取消返回首页');
					goBack();
				});
		}
	});

	setDefaultMountApp('/');

	if (!isStarted) {
		isStarted = true;
		start({
			prefetch: true,
			sandbox: {
				experimentalStyleIsolation: true,
			},
		});
		NextLoading.start();
		console.log('[主应用] start() 执行完成');
	} else {
		console.log('[主应用] start() 已执行，跳过');
	}
	if (cb) cb();
}

export { actions };
export default actions;
