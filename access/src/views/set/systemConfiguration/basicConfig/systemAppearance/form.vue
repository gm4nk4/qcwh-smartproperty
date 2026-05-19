<template>
	<el-dialog
		class="overlay-dialog"
		v-model="visible"
		:close-on-click-modal="false"
		title="登录页预览"
		style="width: 900px; height: 563px; overflow: hidden"
	>
		<div style="width: 828px; height: 400px; overflow: hidden">
			<div class="loginReview">
				<div class="overlay"></div>
				<login></login>
			</div>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" @click="visible = false" :loading="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>
<script lang="ts" name="loginPageDialog" setup>
// 定义子组件向父组件传值/事件

// 引入组件
const login = defineAsyncComponent(() => import('/@/views/login/index.vue'));

// 定义变量内容
const visible = ref(false);
const loading = ref(false);

// 打开弹窗
const openDialog = () => {
	visible.value = true;
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>
<style scoped lang="scss">
.loginReview {
	overflow: auto;
	width: 1920px;
	height: 1080px;
	position: relative;
	transform-origin: 0% 0%;
	transform: scale(0.44);

	.el-dialog__body {
		overflow: hidden;
	}
}
.overlay-dialog {
	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 3; /* 确保覆盖在内容之上 */
		background-color: rgba(255, 255, 255, 0); /* 透明背景 */
		user-select: none; /* 禁止文本选择 */
		pointer-events: all; /* 捕获所有点击事件 */
	}
}

.overlay-dialog .content {
	position: relative; /* 确保内容在覆盖层之上 */
	z-index: 2;
	user-select: none; /* 禁止文本选择 */
	pointer-events: none; /* 禁止点击事件 */
}

/* 为了确保按钮仍然可以点击，需要特别处理 */
.overlay-dialog .dialog-footer .el-button {
	position: relative; /* 确保按钮在内容之上 */
	z-index: 3;
	pointer-events: auto;
}
</style>
