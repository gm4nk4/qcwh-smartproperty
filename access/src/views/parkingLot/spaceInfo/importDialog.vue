<template>
	<el-dialog title="感应器数据导入" v-model="visible" :close-on-click-modal="false" draggable width="600">
		<!-- 顶部提示信息区 -->
		<div class="info-tip">
			<el-icon class="info-icon"><InfoFilled /></el-icon>
			<span>支持导入 Excel / CSV 格式的感应器数据，系统将自动根据车位编号匹配绑定对应感应器。</span>
		</div>

		<!-- 中间文件上传区 -->
		<el-upload
			ref="uploadRef"
			class="upload-area"
			drag
			action="#"
			:auto-upload="false"
			:limit="1"
			accept=".xlsx,.csv"
			:on-change="handleFileChange"
			:on-exceed="handleExceed"
		>
			<el-icon class="upload-icon"><Upload /></el-icon>
			<div class="upload-text">点击或拖拽文件到此区域</div>
			<div class="upload-tip">支持 .xlsx / .csv 格式，单次最多500条</div>
		</el-upload>

		<!-- 底部模板下载区 -->
		<div class="template-area">
			<div class="template-title">导入模板</div>
			<div class="template-row">
				<el-button class="download-btn" @click="handleDownload">
					<el-icon class="download-icon"><Download /></el-icon>
					<span>下载模板</span>
				</el-button>
				<span class="template-desc">模板包含：车位编号、感应器编号、感应器型号</span>
			</div>
		</div>

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">取消</el-button>
				<el-button type="primary" :disabled="!hasFile" :loading="loading" @click="handleImport">开始导入</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="ImportDialog">
import { InfoFilled, Upload, Download } from '@element-plus/icons-vue';
import { useMessage } from '/@/hooks/message';

const emit = defineEmits(['refresh']);
const visible = ref(false);
const loading = ref(false);
const hasFile = ref(false);
const fileList = ref<any[]>([]);

// 打开弹窗
const openDialog = () => {
	visible.value = true;
	hasFile.value = false;
	fileList.value = [];
};

// 文件变化
const handleFileChange = (file: any) => {
	fileList.value = [file];
	hasFile.value = true;
};

// 超出限制
const handleExceed = () => {
	useMessage().warning('单次最多上传1个文件');
};

// 下载模板
const handleDownload = () => {
	// TODO: 实现模板下载
	useMessage().success('模板下载成功');
};

// 导入
const handleImport = async () => {
	if (!hasFile.value) return;

	try {
		loading.value = true;
		// TODO: 实现导入逻辑
		console.log('导入文件', fileList.value);
		useMessage().success('导入成功');
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg || '导入失败');
	} finally {
		loading.value = false;
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.info-tip {
	display: flex;
	align-items: center;
	padding: 12px 16px;
	background: var(--el-color-primary-light-9);
	border-radius: 4px;
	margin-bottom: 16px;
}

.info-icon {
	color: var(--el-color-primary);
	font-size: 18px;
	margin-right: 8px;
	flex-shrink: 0;
}

.info-tip span {
	color: var(--el-color-primary);
	font-size: 14px;
	line-height: 1.5;
}

.upload-area {
	margin-bottom: 24px;

	:deep(.el-upload-dragger) {
		width: 100%;
		height: 160px;
		border: 1px dashed #d9d9d9;
		border-radius: 4px;
		background: #fafafa;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		transition: border-color 0.2s;

		&:hover {
			border-color: var(--el-color-primary);
		}
	}

	:deep(.el-upload) {
		width: 100%;
	}
}

.upload-icon {
	font-size: 40px;
	color: #c0c4cc;
	margin-bottom: 12px;
}

.upload-text {
	font-size: 14px;
	color: #606266;
	margin-bottom: 8px;
}

.upload-tip {
	font-size: 12px;
	color: #909399;
}

.template-area {
	margin-top: 20px;
}

.template-title {
	font-size: 14px;
	color: #606266;
	margin-bottom: 12px;
}

.template-row {
	display: flex;
	align-items: center;
}

.download-btn {
	display: flex;
	align-items: center;
	padding: 8px 16px;
}

.download-icon {
	font-size: 14px;
	margin-right: 6px;
}

.template-desc {
	font-size: 12px;
	color: #909399;
	margin-left: 16px;
}
</style>
