import './public-path';
import { createApp } from 'vue';
import pinia from '/@/stores/index';
import App from './App.vue';
import router from './router';
import { directive } from '/@/directive';
import { i18n } from '/@/i18n';
import other from '/@/utils/other';
import { initThemeListener } from '/@/utils/echartsUtils';
import { setActions, initGlobalStateListener, destroyGlobalStateListener } from './qiankun/actions';

import ElementPlus from 'element-plus';
import '/@/theme/tailwind.css';
import 'element-plus/dist/index.css';
import '/@/theme/index.scss';

import { ElementIcons, Pagination, RightToolbar, DictTag, UploadExcel, UploadFile, UploadImg, Editor, Tip, DelWrap } from '/@/components/index';
import { parseTime, parseDate, dateTimeStr, dateStr, timeStr } from '/@/utils/formatTime';

import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';

import { renderWithQiankun } from 'vite-plugin-qiankun/dist/helper';
import { isInQiankun } from '/@/qiankun/actions';
const isQiankun = isInQiankun();

let app: ReturnType<typeof createApp> | null = null;

function render(props: Record<string, unknown> = {}) {
	const { container } = props;
	app = createApp(App);

	app.component('DictTag', DictTag);
	app.component('Pagination', Pagination);
	app.component('RightToolbar', RightToolbar);
	app.component('uploadExcel', UploadExcel);
	app.component('UploadFile', UploadFile);
	app.component('UploadImg', UploadImg);
	app.component('Editor', Editor);
	app.component('Tip', Tip);
	app.component('DelWrap', DelWrap);
	app.component('Splitpanes', Splitpanes);
	app.component('Pane', Pane);

	app.config.globalProperties.parseTime = parseTime;
	app.config.globalProperties.parseDate = parseDate;
	app.config.globalProperties.dateTimeStr = dateTimeStr;
	app.config.globalProperties.dateStr = dateStr;
	app.config.globalProperties.timeStr = timeStr;
	app.config.globalProperties.baseURL = isQiankun ? import.meta.env.VITE_API_URL_QIANKUN : import.meta.env.VITE_API_URL;

	directive(app);
	other.elSvg(app);
	initThemeListener();

	app.use(pinia).use(router).use(ElementPlus).use(ElementIcons).use(i18n);
	app.mount(container ? (container as any).querySelector('#app') : '#app');
}

if (!isQiankun) {
	render();
}

renderWithQiankun({
	bootstrap() {
		console.log('[parking] bootstrap');
	},
	mount(props) {
		console.log('[parking] mount', props);
		// 1. 注入主应用传递的 actions 对象，供 useQiankun / getActions 使用
		setActions(props as any);
		// 2. 初始化全局状态监听（单例模式，只注册一次）
		initGlobalStateListener();
		// 3. 渲染 Vue 应用
		render(props);
	},
	unmount() {
		console.log('[parking] unmount');
		// 销毁全局状态监听，防止内存泄漏
		destroyGlobalStateListener();
		if (app) {
			app.unmount();
			app = null;
		}
	},
	update(props) {
		console.log('[parking] update', props);
	},
});
