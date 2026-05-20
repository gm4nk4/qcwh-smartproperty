<template>
	<div class="layout-padding visitor-park-guide">
		<div class="layout-padding-auto layout-padding-view visitor-park-guide__body" v-loading="pageState.loading">
			<section class="visitor-park-guide__hero">
				<div>
					<div class="visitor-park-guide__eyebrow">访客管理</div>
					<h1 class="visitor-park-guide__title">园区访客管理说明</h1>
					<div class="visitor-park-guide__meta" v-if="pageState.detail">
						最近更新：{{ pageState.detail.updatedBy }} · {{ pageState.detail.updatedTime }}
					</div>
				</div>

				<div class="visitor-park-guide__toolbar">
					<el-radio-group :model-value="pageState.mode" @update:modelValue="handleModeSwitch">
						<el-radio-button v-for="item in guideModeOptions" :key="item.value" :label="item.value">
							{{ item.label }}
						</el-radio-button>
					</el-radio-group>

					<template v-if="pageState.mode === 'view'">
						<el-button type="primary" @click="handleEnterEdit">编辑</el-button>
					</template>
					<template v-else>
						<el-button @click="handleCancelEdit">取消</el-button>
						<el-button type="primary" :loading="pageState.saving" @click="handleSave">保存</el-button>
					</template>
				</div>
			</section>

			<section v-if="pageState.mode === 'view'" class="visitor-park-guide__preview-card">
				<div class="visitor-park-guide__preview-title">园区访客管理说明</div>
				<div class="visitor-park-guide__content visitor-markdown" v-html="previewHtml"></div>
			</section>

			<section v-else class="visitor-park-guide__workspace">
				<div class="visitor-park-guide__editor-panel">
					<div class="visitor-park-guide__panel-title">{{ editorFieldConfig.label }}</div>
					<component
						:is="editorFieldConfig.component"
						v-bind="editorFieldConfig.props"
						:model-value="formData[editorFieldConfig.field]"
						@update:modelValue="(value: unknown) => handleFormValueChange(editorFieldConfig.field, value)"
					/>
				</div>

				<div class="visitor-park-guide__preview-panel">
					<div class="visitor-park-guide__panel-title">预览效果</div>
					<div class="visitor-park-guide__content visitor-markdown" v-html="previewHtml"></div>
				</div>
			</section>
		</div>
	</div>
</template>

<script setup lang="ts" name="visitorParkGuide">
import { computed, onMounted, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { getVisitorParkGuideDetail, saveVisitorParkGuide, type VisitorParkGuideDetail } from './api';
import { defaultFormData, editorFieldConfig, guideModeOptions, type ParkGuideMode, type VisitorParkGuideField } from './index';
import { buildVisitorParkGuideFormData, buildVisitorParkGuideSavePayload, renderMarkdownToHtml } from './useBizProcess';

const formData = reactive({
	...defaultFormData,
});

const pageState = reactive({
	loading: false,
	saving: false,
	mode: 'view' as ParkGuideMode,
	detail: null as VisitorParkGuideDetail | null,
});

const previewHtml = computed(() => renderMarkdownToHtml(formData.markdownContent));

const handleFormValueChange = (field: VisitorParkGuideField, value: unknown) => {
	formData[field] = typeof value === 'string' ? value : '';
};

const loadPageData = async () => {
	pageState.loading = true;
	try {
		const res = await getVisitorParkGuideDetail();
		pageState.detail = res.data;
		Object.assign(formData, buildVisitorParkGuideFormData(res.data));
	} finally {
		pageState.loading = false;
	}
};

const handleEnterEdit = () => {
	if (pageState.detail) {
		Object.assign(formData, buildVisitorParkGuideFormData(pageState.detail));
	}
	pageState.mode = 'edit';
};

const handleCancelEdit = () => {
	if (pageState.detail) {
		Object.assign(formData, buildVisitorParkGuideFormData(pageState.detail));
	}
	pageState.mode = 'view';
};

const handleModeSwitch = (value: string | number | boolean) => {
	if (value === 'edit') {
		handleEnterEdit();
		return;
	}
	handleCancelEdit();
};

const handleSave = async () => {
	if (!formData.markdownContent.trim()) {
		ElMessage.warning('请输入园区访客管理说明');
		return;
	}

	pageState.saving = true;
	try {
		const res = await saveVisitorParkGuide(buildVisitorParkGuideSavePayload(formData));
		pageState.detail = res.data;
		Object.assign(formData, buildVisitorParkGuideFormData(res.data));
		pageState.mode = 'view';
		ElMessage.success('保存成功');
	} finally {
		pageState.saving = false;
	}
};

onMounted(() => {
	loadPageData();
});
</script>

<style scoped lang="scss">
.visitor-park-guide {
	height: auto;

	&__body {
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 16px;
		background: radial-gradient(circle at top left, rgba(59, 130, 246, 0.05), transparent 26%),
			radial-gradient(circle at top right, rgba(14, 165, 233, 0.05), transparent 24%), #f8fafc;
		border-radius: 22px;
		border: 1px solid #eef2f7;
		overflow: auto;
	}

	&__hero,
	&__preview-card,
	&__editor-panel,
	&__preview-panel {
		padding: 18px;
		border-radius: 20px;
		background: rgba(255, 255, 255, 0.95);
		border: 1px solid rgba(226, 232, 240, 0.9);
		box-shadow: 0 12px 34px rgba(15, 23, 42, 0.04);
	}

	&__hero {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 20px;
	}

	&__eyebrow {
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.08em;
		color: #64748b;
		text-transform: uppercase;
	}

	&__title {
		margin: 8px 0 6px;
		font-size: 34px;
		line-height: 1.2;
		font-weight: 800;
		color: #0f172a;
	}

	&__meta {
		font-size: 14px;
		color: #64748b;
	}

	&__toolbar {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 12px;
	}

	&__preview-title,
	&__panel-title {
		margin-bottom: 16px;
		font-size: 16px;
		font-weight: 700;
		color: #0f172a;
	}

	&__workspace {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 16px;
	}

	&__content {
		min-height: 520px;
		color: #334155;
	}

	&__editor-panel {
		:deep(.el-textarea__inner) {
			min-height: 520px !important;
			padding: 16px;
			font-size: 14px;
			line-height: 1.8;
			font-family: 'Consolas', 'Courier New', monospace;
		}
	}
}

:deep(.visitor-markdown h1) {
	margin: 0 0 18px;
	font-size: 30px;
	line-height: 1.3;
	font-weight: 800;
	color: #0f172a;
}

:deep(.visitor-markdown h2) {
	margin: 28px 0 14px;
	font-size: 22px;
	line-height: 1.4;
	font-weight: 700;
	color: #1e293b;
}

:deep(.visitor-markdown h3) {
	margin: 22px 0 12px;
	font-size: 18px;
	line-height: 1.4;
	font-weight: 700;
	color: #334155;
}

:deep(.visitor-markdown p) {
	margin: 0 0 14px;
	font-size: 15px;
	line-height: 1.9;
	color: #334155;
}

:deep(.visitor-markdown ol),
:deep(.visitor-markdown ul) {
	margin: 0 0 14px;
	padding-left: 24px;
}

:deep(.visitor-markdown li) {
	margin-bottom: 8px;
	font-size: 15px;
	line-height: 1.9;
	color: #334155;
}

:deep(.visitor-markdown code) {
	padding: 2px 6px;
	border-radius: 6px;
	background: #eff6ff;
	color: #1d4ed8;
	font-size: 13px;
}

:deep(.visitor-markdown pre) {
	margin: 0 0 14px;
	padding: 16px;
	border-radius: 14px;
	background: #0f172a;
	color: #e2e8f0;
	overflow: auto;
}

:deep(.visitor-markdown pre code) {
	padding: 0;
	background: transparent;
	color: inherit;
}

:deep(.visitor-markdown blockquote) {
	margin: 0 0 14px;
	padding: 12px 16px;
	border-left: 4px solid #60a5fa;
	border-radius: 0 12px 12px 0;
	background: #eff6ff;
}

:deep(.visitor-markdown hr) {
	margin: 20px 0;
	border: none;
	border-top: 1px solid #e2e8f0;
}

:deep(.visitor-markdown a) {
	color: #2563eb;
	text-decoration: none;
}

@media (max-width: 1440px) {
	.visitor-park-guide {
		&__workspace {
			grid-template-columns: 1fr;
		}
	}
}

@media (max-width: 992px) {
	.visitor-park-guide {
		&__body {
			padding: 16px;
		}

		&__hero {
			flex-direction: column;
		}
	}
}

@media (max-width: 640px) {
	.visitor-park-guide {
		&__title {
			font-size: 28px;
		}
	}
}
</style>
