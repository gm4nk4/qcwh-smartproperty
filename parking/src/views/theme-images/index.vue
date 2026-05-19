<template>
	<div class="theme-images-page">
		<section class="theme-images-header">
			<div class="theme-images-heading">
				<p class="theme-images-kicker">Theme Asset Library</p>
				<h1>主题图片库</h1>
				<p class="theme-images-summary">统一管理蓝绿换肤图片。搜索后直接复制 key 或推荐调用，后续页面可以按同一套命名稳定接入。</p>
			</div>
			<div class="theme-images-overview">
				<div class="theme-images-overview-item">
					<span>总资源</span>
					<strong>{{ themeImageCatalog.length }}</strong>
				</div>
				<div class="theme-images-overview-item">
					<span>当前皮肤</span>
					<strong>{{ currentSkinLabel }}</strong>
				</div>
				<div class="theme-images-overview-item">
					<span>浏览模式</span>
					<strong>{{ previewSkinLabel }}</strong>
				</div>
			</div>
		</section>

		<section class="theme-images-toolbar-panel">
			<div class="theme-images-toolbar">
				<el-input v-model="keyword" clearable placeholder="搜索 key、中文名、英文文件名、分类" class="theme-images-search">
					<template #prefix>
						<el-icon><ele-Search /></el-icon>
					</template>
				</el-input>
				<el-select v-model="previewSkinMode" class="theme-images-select">
					<el-option label="跟随当前皮肤" value="current" />
					<el-option label="预览蓝色皮肤" value="light-blue" />
					<el-option label="预览绿色皮肤" value="light-green" />
				</el-select>
			</div>

			<div class="theme-images-guides">
				<div class="theme-images-guide is-primary">
					<span class="theme-images-guide-label">组件里默认用</span>
					<button class="theme-images-guide-code" type="button" @click="copySnippet(`const icon = useThemeImage('monitor')`)">
						<code>const icon = useThemeImage('monitor')</code>
					</button>
				</div>
				<div class="theme-images-guide">
					<span class="theme-images-guide-label">静态场景再用</span>
					<button class="theme-images-guide-code" type="button" @click="copySnippet(`const src = getThemeImage('monitor')`)">
						<code>getThemeImage('monitor')</code>
					</button>
				</div>
				<p class="theme-images-guide-note">主预览区点击可复制 key，卡片底部保留推荐代码和静态调用两种入口。</p>
			</div>
		</section>

		<section v-if="filteredGroups.length" class="theme-images-groups">
			<div v-for="group in filteredGroups" :key="group.category" class="theme-images-group">
				<div class="theme-images-group-header">
					<div>
						<h2>{{ group.category }}</h2>
						<p>{{ group.items.length }} 个资源</p>
					</div>
					<span class="theme-images-group-count">{{ group.items.length }}</span>
				</div>
				<div class="theme-images-grid">
					<article v-for="item in group.items" :key="item.key" class="theme-images-card">
						<button class="theme-images-stage" type="button" :title="`复制 ${item.key}`" @click="copyKey(item.key)">
							<div class="theme-images-stage-top">
								<span class="theme-images-stage-chip">{{ previewSkinLabel }}</span>
								<span class="theme-images-stage-copy">点击复制 key</span>
							</div>
							<div class="theme-images-stage-main">
								<img :src="item.previewSrc" :alt="item.label" />
							</div>
							<div class="theme-images-stage-variants">
								<div class="theme-images-variant">
									<span>蓝</span>
									<img :src="item.blueSrc" :alt="`${item.label} blue`" />
								</div>
								<div class="theme-images-variant">
									<span>绿</span>
									<img :src="item.greenSrc" :alt="`${item.label} green`" />
								</div>
							</div>
						</button>

						<div class="theme-images-card-content">
							<div class="theme-images-card-head">
								<div class="theme-images-card-copy">
									<h3>{{ item.label }}</h3>
									<p>{{ item.description }}</p>
								</div>
								<el-tag effect="plain" round class="theme-images-card-tag">{{ item.category }}</el-tag>
							</div>

							<div class="theme-images-facts">
								<div class="theme-images-fact">
									<span>Key</span>
									<code>{{ item.key }}</code>
								</div>
								<div class="theme-images-fact">
									<span>文件名</span>
									<code>{{ item.fileName }}</code>
								</div>
							</div>

							<div class="theme-images-card-footer">
								<el-button size="small" plain @click.stop="copyKey(item.key)">复制 key</el-button>
								<el-button size="small" type="primary" @click.stop="copySnippet(item.hookSnippet)">复制推荐代码</el-button>
							</div>
							<div class="theme-images-static-call">
								<span>静态场景</span>
								<button class="theme-images-inline-code" type="button" @click.stop="copySnippet(item.getterSnippet)">
									<code>{{ item.getterSnippet }}</code>
								</button>
							</div>
						</div>
					</article>
				</div>
			</div>
		</section>

		<el-empty v-else description="没有匹配到图片资源" class="theme-images-empty" />
	</div>
</template>

<script setup lang="ts" name="themeImagesLibrary">
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import commonFunction from '/@/utils/commonFunction';
import {
	themeImageCatalog,
	getThemeImage,
	getThemeImageGetterSnippet,
	getThemeImageHookSnippet,
	type ThemeImageCatalogItem,
} from '/@/utils/themeImages';
import { resolveThemeSkin } from '/@/utils/themeSkin';

type PreviewSkinMode = ThemeSkin | 'current';

const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { copyText } = commonFunction();

const keyword = ref('');
const previewSkinMode = ref<PreviewSkinMode>('current');

const skinLabelMap: Record<ThemeSkin, string> = {
	'light-blue': '淡蓝皮肤',
	'light-green': '淡绿皮肤',
};

const currentSkin = computed(() => resolveThemeSkin(themeConfig.value.skin));
const currentSkinLabel = computed(() => skinLabelMap[currentSkin.value]);
const effectivePreviewSkin = computed<ThemeSkin>(() => {
	return previewSkinMode.value === 'current' ? currentSkin.value : previewSkinMode.value;
});
const previewSkinLabel = computed(() => {
	return previewSkinMode.value === 'current' ? `跟随当前 · ${currentSkinLabel.value}` : skinLabelMap[previewSkinMode.value];
});

const normalizedKeyword = computed(() => keyword.value.trim().toLowerCase());

const filteredItems = computed(() => {
	return themeImageCatalog
		.filter((item) => {
			if (!normalizedKeyword.value) return true;
			const searchText = [item.key, item.label, item.fileName, item.category, item.description, ...item.keywords].join(' ').toLowerCase();
			return searchText.includes(normalizedKeyword.value);
		})
		.map((item) => createDisplayItem(item));
});

const filteredGroups = computed(() => {
	const groupMap = new Map<string, ReturnType<typeof createDisplayItem>[]>();

	filteredItems.value.forEach((item) => {
		const items = groupMap.get(item.category) || [];
		items.push(item);
		groupMap.set(item.category, items);
	});

	return Array.from(groupMap.entries()).map(([category, items]) => ({
		category,
		items,
	}));
});

const createDisplayItem = (item: ThemeImageCatalogItem) => {
	return {
		...item,
		previewSrc: getThemeImage(item.key, effectivePreviewSkin.value),
		blueSrc: getThemeImage(item.key, 'light-blue'),
		greenSrc: getThemeImage(item.key, 'light-green'),
		hookSnippet: getThemeImageHookSnippet(item.key),
		getterSnippet: getThemeImageGetterSnippet(item.key),
	};
};

const copyKey = (key: string) => {
	copyText(key);
};

const copySnippet = (snippet: string) => {
	copyText(snippet);
};
</script>

<style scoped lang="scss">
.theme-images-page {
	padding: 20px;
	display: flex;
	flex-direction: column;
	gap: 20px;
	background:
		radial-gradient(circle at top left, rgba(0, 148, 255, 0.08), transparent 32%),
		radial-gradient(circle at top right, rgba(75, 166, 169, 0.12), transparent 28%),
		linear-gradient(180deg, #f6f9fc 0%, #eef3f8 100%);
}

.theme-images-header,
.theme-images-toolbar-panel,
.theme-images-group,
.theme-images-empty {
	background: rgba(255, 255, 255, 0.9);
	border: 1px solid rgba(14, 44, 84, 0.08);
	box-shadow: 0 18px 40px rgba(18, 40, 78, 0.06);
	backdrop-filter: blur(16px);
}

.theme-images-header {
	display: grid;
	grid-template-columns: minmax(0, 1.5fr) minmax(260px, 0.9fr);
	gap: 24px;
	padding: 28px;
	border-radius: 28px;
}

.theme-images-kicker {
	margin: 0;
	font-size: 12px;
	font-weight: 700;
	letter-spacing: 0.24em;
	text-transform: uppercase;
	color: var(--el-color-primary);
}

.theme-images-heading h1 {
	margin: 10px 0 12px;
	font-size: 34px;
	line-height: 1.08;
	color: var(--theme-text-system);
}

.theme-images-summary {
	max-width: 720px;
	margin: 0;
	line-height: 1.75;
	color: var(--theme-text-dataAssist);
}

.theme-images-overview {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 12px;
	align-content: start;
}

.theme-images-overview-item {
	padding: 16px 18px;
	border-radius: 20px;
	background: linear-gradient(180deg, #ffffff 0%, #f4f8fc 100%);
	border: 1px solid rgba(0, 148, 255, 0.09);

	span {
		display: block;
		font-size: 12px;
		color: var(--theme-text-assist);
	}

	strong {
		display: block;
		margin-top: 8px;
		font-size: 20px;
		color: var(--theme-text-system);
	}
}

.theme-images-toolbar {
	display: flex;
	gap: 12px;
	flex-wrap: wrap;
}

.theme-images-toolbar-panel {
	padding: 18px 20px;
	border-radius: 24px;
}

.theme-images-search {
	flex: 1;
	min-width: 280px;
}

.theme-images-select {
	width: 180px;
}

.theme-images-guides {
	display: grid;
	grid-template-columns: minmax(0, 1fr) minmax(0, 0.8fr);
	gap: 12px;
	margin-top: 16px;
}

.theme-images-guide {
	padding: 14px 16px;
	border-radius: 18px;
	background: linear-gradient(180deg, #ffffff 0%, #f6f9fc 100%);
	border: 1px solid rgba(14, 44, 84, 0.07);
}

.theme-images-guide.is-primary {
	background: linear-gradient(135deg, rgba(0, 148, 255, 0.09), rgba(255, 255, 255, 0.95));
	border-color: rgba(0, 148, 255, 0.16);
}

.theme-images-guide-label {
	display: block;
	margin-bottom: 10px;
	font-size: 12px;
	font-weight: 700;
	color: var(--theme-text-dataAssist);
}

.theme-images-guide-code,
.theme-images-inline-code {
	display: inline-flex;
	align-items: center;
	padding: 0;
	border: 0;
	background: transparent;
	cursor: pointer;

	code {
		padding: 8px 12px;
		border-radius: 12px;
		background: rgba(0, 148, 255, 0.08);
		color: var(--el-color-primary);
		font-size: 12px;
		line-height: 1.5;
		word-break: break-all;
	}
}

.theme-images-guide-note,
.theme-images-group-header p,
.theme-images-card-head p {
	margin: 0;
	color: var(--theme-text-dataAssist);
}

.theme-images-groups {
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.theme-images-group-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;

	h2 {
		margin: 0 0 6px;
		font-size: 22px;
		color: var(--theme-text-system);
	}
}

.theme-images-group {
	padding: 22px;
	border-radius: 24px;
}

.theme-images-group-count {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 42px;
	height: 42px;
	padding: 0 14px;
	border-radius: 999px;
	background: rgba(0, 148, 255, 0.08);
	font-size: 13px;
	font-weight: 700;
	color: var(--el-color-primary);
}

.theme-images-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	gap: 18px;
}

.theme-images-card {
	flex-direction: column;
	overflow: hidden;
	border-radius: 24px;
	border: 1px solid rgba(14, 44, 84, 0.08);
	background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
	box-shadow: 0 16px 34px rgba(18, 40, 78, 0.08);
}

.theme-images-stage {
	display: block;
	width: 100%;
	padding: 18px;
	border: 0;
	background:
		radial-gradient(circle at top left, rgba(0, 148, 255, 0.16), transparent 38%),
		radial-gradient(circle at bottom right, rgba(75, 166, 169, 0.15), transparent 34%),
		linear-gradient(180deg, #f3f8fc 0%, #edf3f8 100%);
	cursor: pointer;
	text-align: left;
	appearance: none;
}

.theme-images-stage-top {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	margin-bottom: 14px;
}

.theme-images-stage-chip {
	display: inline-flex;
	align-items: center;
	padding: 6px 10px;
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.8);
	font-size: 12px;
	font-weight: 700;
	color: var(--theme-text-dataAssist);
}

.theme-images-stage-copy {
	font-size: 12px;
	color: var(--theme-text-assist);
}

.theme-images-stage-main {
	display: grid;
	place-items: center;
	min-height: 190px;
	padding: 18px;
	border-radius: 24px;
	background: rgba(255, 255, 255, 0.62);
	box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);

	img {
		max-width: 178px;
		max-height: 178px;
		object-fit: contain;
		filter: drop-shadow(0 18px 28px rgba(36, 74, 126, 0.18));
	}
}

.theme-images-stage-variants {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 10px;
	margin-top: 12px;
}

.theme-images-variant {
	position: relative;
	display: grid;
	place-items: center;
	min-height: 64px;
	padding: 10px;
	border-radius: 16px;
	background: rgba(255, 255, 255, 0.75);

	span {
		position: absolute;
		left: 10px;
		top: 8px;
		font-size: 11px;
		font-weight: 700;
		color: var(--theme-text-assist);
	}

	img {
		max-width: 48px;
		max-height: 48px;
		object-fit: contain;
	}
}

.theme-images-card-content {
	display: flex;
	flex-direction: column;
	gap: 14px;
	padding: 18px;
}

.theme-images-card-head {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 12px;

	h3 {
		margin: 0 0 6px;
		font-size: 20px;
		color: var(--theme-text-system);
	}
}

.theme-images-card-copy {
	min-width: 0;
}

.theme-images-card-tag {
	flex: none;
}

.theme-images-facts {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 10px;
}

.theme-images-fact {
	padding: 12px;
	border-radius: 16px;
	background: #f6f9fc;

	span {
		display: block;
		margin-bottom: 8px;
		font-size: 12px;
		color: var(--theme-text-assist);
	}

	code {
		display: block;
		padding: 6px 8px;
		border-radius: 10px;
		background: rgba(0, 148, 255, 0.08);
		color: var(--el-color-primary);
		font-size: 12px;
		word-break: break-all;
	}
}

.theme-images-card-footer {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
}

.theme-images-static-call {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	padding-top: 6px;
	border-top: 1px dashed rgba(14, 44, 84, 0.09);
	font-size: 12px;
	color: var(--theme-text-dataAssist);
}

.theme-images-empty {
	padding: 48px 0;
	border-radius: 24px;
}

@media (max-width: 960px) {
	.theme-images-header,
	.theme-images-guides {
		grid-template-columns: 1fr;
	}
}

@media (max-width: 640px) {
	.theme-images-page {
		padding: 12px;
	}

	.theme-images-header,
	.theme-images-toolbar-panel,
	.theme-images-group,
	.theme-images-empty {
		padding: 18px;
		border-radius: 18px;
	}

	.theme-images-grid {
		grid-template-columns: 1fr;
	}

	.theme-images-overview,
	.theme-images-facts {
		grid-template-columns: 1fr;
	}

	.theme-images-stage-main {
		min-height: 164px;
	}

	.theme-images-select {
		width: 100%;
	}

	.theme-images-stage-top,
	.theme-images-card-head,
	.theme-images-static-call {
		flex-direction: column;
		align-items: flex-start;
	}
}
</style>
