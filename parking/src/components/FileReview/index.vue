<template>
	<div>
		<el-dialog v-model="visible" title="预览" top="10" width="1200" @close="close">
			<div>
				<el-alert title="文档目前支持doc,xlsx,xls,pptx,pdf,txt,视频和图片等格式的预览" type="warning" :closable="false" />
			</div>
			<el-divider />
			<FileContent v-if="fileUrl" :fileUrl="fileUrl"></FileContent>
			<el-empty v-else description="无预览文件" />
		</el-dialog>
	</div>
</template>
<script setup lang="ts">
//引入相关样式
const emit = defineEmits(['closeFile']);
const FileContent = defineAsyncComponent(() => import('./fileContent.vue'));

const props = defineProps({
	fileUrl: {
		type: String,
		default: '',
	},
});
const visible = ref(false);
const loading = ref(false);

const close = () => {
	loading.value = false;
	emit('closeFile');
};

// 打开弹窗
const openDialog = async () => {
	visible.value = true;
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped>
.docx-preview-wrapper {
	width: 100% !important;
	height: 100% !important;
}

.loading-next-box {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
.loading-next-box-warp {
	width: 80px;
	height: 80px;
}
.loading-next-box-warp .loading-next-box-item {
	width: 33.333333%;
	height: 33.333333%;
	background: var(--el-color-primary);
	float: left;
	animation: loading-next-animation 1.2s infinite ease;
	border-radius: 1px;
}
.loading-next-box-warp .loading-next-box-item:nth-child(7) {
	animation-delay: 0s;
}
.loading-next-box-warp .loading-next-box-item:nth-child(4),
.loading-next-box-warp .loading-next-box-item:nth-child(8) {
	animation-delay: 0.1s;
}
.loading-next-box-warp .loading-next-box-item:nth-child(1),
.loading-next-box-warp .loading-next-box-item:nth-child(5),
.loading-next-box-warp .loading-next-box-item:nth-child(9) {
	animation-delay: 0.2s;
}
.loading-next-box-warp .loading-next-box-item:nth-child(2),
.loading-next-box-warp .loading-next-box-item:nth-child(6) {
	animation-delay: 0.3s;
}
.loading-next-box-warp .loading-next-box-item:nth-child(3) {
	animation-delay: 0.4s;
}
@keyframes loading-next-animation {
	0%,
	70%,
	100% {
		transform: scale3D(1, 1, 1);
	}
	35% {
		transform: scale3D(0, 0, 1);
	}
}
</style>
