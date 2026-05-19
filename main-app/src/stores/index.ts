// https://pinia.vuejs.org/
import { createPinia } from 'pinia';
import piniaPluginPersist from 'pinia-plugin-persist';
import qiankunSyncPlugin from './plugin/qiankunSync';

// 创建
const pinia = createPinia();
pinia.use(piniaPluginPersist);
pinia.use(qiankunSyncPlugin);

// 导出
export default pinia;
