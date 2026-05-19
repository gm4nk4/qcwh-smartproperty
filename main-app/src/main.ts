import { createApp } from 'vue';
import pinia from '/@/stores/index';
import App from './App.vue';
import router from './router';
import { directive } from '/@/directive';
import { i18n } from '/@/i18n';
import other from '/@/utils/other';
import { initThemeListener } from '/@/utils/echartsUtils';

import ElementPlus from 'element-plus';
import '/@/theme/tailwind.css';
import 'element-plus/dist/index.css';
import '/@/theme/index.scss';

import { ElementIcons, Pagination, RightToolbar, DictTag, UploadExcel, UploadFile, UploadImg, Editor, Tip, DelWrap } from '/@/components/index';
import { parseTime, parseDate, dateTimeStr, dateStr, timeStr } from '/@/utils/formatTime';

import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';

const app = createApp(App);

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
app.config.globalProperties.baseURL = import.meta.env.VITE_API_URL;

directive(app);
other.elSvg(app);
initThemeListener();

app.use(pinia).use(router).use(ElementPlus).use(ElementIcons).use(i18n);
app.mount('#app');