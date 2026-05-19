<template>
	<div ref="editor_container" style="background: #eeeeee; padding: 12px 12px 12px 12px">
		<div class="toolbar-container" v-if="showToolbar">
			<div style="display: flex; align-items: center">
				<!-- 主题 -->
				<span style="color: #67748e; font-size: 12px">主题&nbsp;&nbsp;</span>
				<el-dropdown @command="(command: string) => (theme = command)">
					<div>
						<span
							:style="`color: ${themeList.find((el) => el.value === theme)?.color}; background: ${themeList.find((el) => el.value === theme)?.background};padding: 6px 8px;border-radius:4px;font-size: 10px;display: inline-block;`"
							>{{ theme }}</span
						>
					</div>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item
								v-for="(item, index) in themeList"
								:key="index"
								:command="item.value"
								:style="`color: ${item.color}; background: ${item.background};margin: 4px 8px;padding: 0px 8px !important;border-radius:4px;font-size: 10px;`"
								>{{ item.value }}</el-dropdown-item
							>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
				<!-- 代码语言 -->
				<span style="margin-left: 6px; color: #67748e; font-size: 12px">代码语言&nbsp;&nbsp;</span>
				<el-dropdown @command="(command: string) => (language = command)">
					<div>
						<span style="color: #000000; background: #bebebe; padding: 6px 8px; border-radius: 4px; font-size: 10px; display: inline-block">{{
							language
						}}</span>
					</div>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item
								v-for="(item, index) in languageList"
								:key="index"
								:command="item"
								style="font-size: 10px; padding: 0px 8px !important"
								>{{ item }}</el-dropdown-item
							>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</div>
			<!-- 全屏按钮：防压缩样式 -->
			<div class="box_button" @click="setFullScreen">
				<el-icon :size="16" color="#67748e"><FullScreen /></el-icon>
			</div>
		</div>
		<VAceEditor
			ref="editor"
			v-model:value="sqlContent"
			:lang="language"
			:theme="theme"
			:options="editorOptions"
			:readonly="readonly"
			:style="`height: ${editorHeight};`"
		/>
	</div>
</template>

<script lang="ts" name="systemSysJob" setup>
import { VAceEditor } from 'vue3-ace-editor';
import { ref, watch, onMounted, nextTick } from 'vue';
import screenfull from 'screenfull';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import { FullScreen } from '@element-plus/icons-vue';

let emit = defineEmits(['update:modelValue']);
const props = defineProps({
	showToolbar: {
		type: Boolean,
		default: true,
	},
	modelValue: {
		type: String,
		default: '',
	},
	value: {
		type: String,
		default: '',
	},
	lang: {
		type: String,
		default: '',
	},
	height: {
		type: String,
		default: '400', // 默认高度400px
	},
	isShowTheme: {
		type: Boolean,
		default: true,
	},
	readonly: {
		type: Boolean,
		default: false,
	},
});

// 主题相关配置
import 'ace-builds/src-noconflict/theme-ambiance';
import 'ace-builds/src-noconflict/theme-chaos';
import 'ace-builds/src-noconflict/theme-chrome';
import 'ace-builds/src-noconflict/theme-gob';
import 'ace-builds/src-noconflict/theme-gruvbox';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import 'ace-builds/src-noconflict/theme-solarized_light';
import 'ace-builds/src-noconflict/theme-tomorrow_night_blue';

const theme = ref('tomorrow_night_blue');
const themeList = [
	{ value: 'chrome', color: '#930f80', background: '#f7f7f7' },
	{ value: 'solarized_light', color: '#859900', background: '#fdf6e3' },
	{ value: 'tomorrow_night_blue', color: '#ebbbff', background: '#002451' },
	{ value: 'solarized_dark', color: '#859900', background: '#002b36' },
	{ value: 'ambiance', color: '#cda869', background: '#202020' },
	{ value: 'gruvbox', color: '#8ec07c', background: '#1d2021' },
	{ value: 'chaos', color: '#00698f', background: '#161616' },
	{ value: 'gob', color: '#10d8e8', background: '#0b0b0b' },
];

// 代码语言相关配置
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/mode-mysql';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-sh';

const sqlContent = ref('');
const language = ref('mysql');
const languageList = ['java', 'javascript', 'xml', 'python', 'sql', 'mysql', 'html', 'json', 'sh'];

// 全屏相关状态
const stores = useTagsViewRoutes();
const editor_container = ref<HTMLElement | null>(null);
const editorHeight = ref('');
const fullScreenFlag = ref(false);
// 实时保存进入全屏前的高度（解决窗口大小变化后恢复异常）
const tempOriginalHeight = ref('');
const tempOriginalEditorHeight = ref('');

// 编辑器配置
const editorOptions = ref({
	showPrintMargin: false,
	enableLiveAutocompletion: true,
});

// 语言映射函数
const mapLang = (lang: string): string => {
	if (!lang) return 'mysql';
	const lower = lang.toLowerCase();
	if (['bash', 'shell', 'sh'].includes(lower)) return 'sh';
	if (['py', 'python'].includes(lower)) return 'python';
	if (['sql', 'mysql', 'postgres', 'postgresql'].includes(lower)) return 'sql';
	return lower;
};

// 全屏切换核心逻辑（修复：实时保存高度+DOM同步更新）
const setFullScreen = async () => {
	const editorContainerDom = editor_container.value;
	if (!editorContainerDom || !screenfull.isEnabled) return;

	if (!fullScreenFlag.value) {
		// 进入全屏前：保存当前实时高度
		tempOriginalHeight.value = editorContainerDom.style.height || `${editorContainerDom.offsetHeight}px`;
		tempOriginalEditorHeight.value = editorHeight.value;
		await screenfull.toggle();
		fullScreenFlag.value = true;
	} else {
		// 取消全屏：先切换状态，再用nextTick确保DOM更新后恢复高度
		await screenfull.toggle();
		fullScreenFlag.value = false;
		await nextTick(); // 关键：等待DOM渲染完成
		editorContainerDom.style.height = tempOriginalHeight.value;
		editorHeight.value = tempOriginalEditorHeight.value;
	}

	stores.setCurrenFullscreen(fullScreenFlag.value, !fullScreenFlag.value);
	setFullScreenSize();
};

// 全屏尺寸设置
const setFullScreenSize = () => {
	const editorContainerDom = editor_container.value;
	if (!editorContainerDom) return;

	if (fullScreenFlag.value) {
		// 全屏状态：占满视口
		editorContainerDom.style.position = 'fixed';
		editorContainerDom.style.height = '100vh';
		editorContainerDom.style.width = '100vw';
		editorHeight.value = 'calc(100vh - 46px)'; // 减去工具栏高度
		editorContainerDom.classList.add('editor_fullscreen');
		document.documentElement.style.overflow = 'hidden';
	} else {
		// 取消全屏：恢复定位和滚动
		editorContainerDom.style.position = 'static';
		editorContainerDom.style.width = 'auto';
		editorContainerDom.classList.remove('editor_fullscreen');
		document.documentElement.style.overflow = 'auto';
	}
};

// 监听ESC键取消全屏（同步状态和高度）
if (screenfull.isEnabled) {
	screenfull.on('change', () => {
		if (!screenfull.isFullscreen && fullScreenFlag.value) {
			fullScreenFlag.value = false;
			const editorContainerDom = editor_container.value;
			if (editorContainerDom) {
				// editorContainerDom.style.height = tempOriginalHeight.value;
				editorContainerDom.style.position = 'static';
				editorHeight.value = tempOriginalEditorHeight.value;
				editorContainerDom.classList.remove('editor_fullscreen');
				document.documentElement.style.overflow = 'auto';
				stores.setCurrenFullscreen(false, true);
			}
		}
	});
}

// 组件初始化
onMounted(() => {
	nextTick(() => {
		const editorContainerDom = editor_container.value;
		if (!editorContainerDom) return;

		// 初始化高度（编辑器高度+工具栏高度）
		editorHeight.value = `${props.height}px`;
		// const toolbarHeight = (toolbar as HTMLElement)?.offsetHeight || 36;
		// editorContainerDom.style.height = `${Number(props.height) + toolbarHeight}px`;

		// 初始化内容和语言
		sqlContent.value = props.modelValue || props.value;
		if (props.lang) language.value = mapLang(props.lang);
	});
});

// 外部值同步到内部
watch(
	() => props.modelValue,
	(val) => {
		if (typeof val === 'string' && val !== sqlContent.value) sqlContent.value = val;
	}
);

watch(
	() => props.value,
	(val) => {
		if (!props.modelValue && typeof val === 'string' && val !== sqlContent.value) sqlContent.value = val;
	}
);

watch(
	() => props.lang,
	(val) => {
		if (typeof val === 'string' && val) language.value = mapLang(val);
	}
);

// 内部内容同步到外部
watch([sqlContent], () => {
	emit('update:modelValue', sqlContent.value);
});
</script>

<style lang="scss" scoped>
// 工具栏样式：防换行、最小高度、不隐藏溢出
.toolbar-container {
	display: flex;
	margin-bottom: 6px;
	align-items: center;
	justify-content: space-between;
	flex-wrap: nowrap; // 禁止换行，避免按钮被挤到第二行
	overflow: visible !important; // 防止溢出隐藏
}

// 全屏按钮样式：防压缩、确保可见
.box_button {
	display: flex;
	align-items: center;
	cursor: pointer;
	flex-shrink: 0; // 禁止按钮被压缩宽度
	margin-left: 10px; // 预留右侧空间
}

// 全屏样式保险
.editor_fullscreen {
	position: fixed !important;
	top: 0 !important;
	left: 0 !important;
	z-index: 9999 !important;
	padding: 6px 12px 12px 12px !important;
	box-sizing: border-box !important;
}
</style>
