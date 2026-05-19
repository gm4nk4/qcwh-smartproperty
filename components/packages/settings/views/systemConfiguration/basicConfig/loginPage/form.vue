<template>
	<el-dialog
		class="overlay-dialog"
		v-model="visible"
		:close-on-click-modal="false"
		title="登录页预览"
		style="width: 100vw; height: 100vh; overflow: hidden"
	>
		<div>
			<div class="portalReview">
				<div class="overlay"></div>
				<loginTemplate1 v-if="templateId == '1'"></loginTemplate1>
				<loginTemplate2 v-else-if="templateId == '2'"></loginTemplate2>
				<!-- <LayoutFooter style="position: absolute; bottom: 0" v-if="getThemeConfig?.loginConfig ? getThemeConfig?.loginConfig?.copyRightDisplay == 1 : true" /> -->
			</div>
		</div>
	</el-dialog>
</template>
<script lang="ts" name="loginPageDialog" setup>
// 引入组件
const loginTemplate1 = defineAsyncComponent(() => import('/@/views/login/loginTemplate/loginTemplate1.vue'));
const loginTemplate2 = defineAsyncComponent(() => import('/@/views/login/loginTemplate/loginTemplate2.vue'));
// const LayoutFooter = defineAsyncComponent(() => import('/@/layout/footer/index.vue'));

// 定义变量内容
const visible = ref(false);

// 打开弹窗
const templateId = ref('1');
const openDialog = (id: string) => {
	visible.value = true;
	templateId.value = id;
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>
<style scoped lang="scss">
.portalReview {
	overflow: hiddle;
	width: 100%;
	height: 95vh;
	position: relative;
	transform-origin: 0% 0%;
	// transform: scale(0.44);

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
		z-index: 3;
		/* 确保覆盖在内容之上 */
		background-color: rgba(255, 255, 255, 0);
		/* 透明背景 */
		user-select: none;
		/* 禁止文本选择 */
		pointer-events: all;
		/* 捕获所有点击事件 */
	}
}

/* 为了确保按钮仍然可以点击，需要特别处理 */
.overlay-dialog .dialog-footer .el-button {
	position: relative;
	/* 确保按钮在内容之上 */
	z-index: 3;
	pointer-events: auto;
}
</style>
