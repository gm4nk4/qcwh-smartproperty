<template>
	<div class="main" :style="`width: ${95 * props.scale}vw; height: ${100 * props.scale}vh; `">
		<div class="loginReview" :style="`transform: scale(${props.scale});`">
			<div class="overlay"></div>
			<loginTemplate1 v-if="props.templateId == '1'"></loginTemplate1>
			<loginTemplate2 v-else-if="props.templateId == '2'"></loginTemplate2>
			<!-- <LayoutFooter style="position: absolute; bottom: 0" v-if="getThemeConfig?.loginConfig ? getThemeConfig?.loginConfig?.copyRightDisplay == 1 : true" /> -->
		</div>
	</div>
</template>
<script lang="ts" name="loginPageDialog" setup>
// 引入组件
const loginTemplate1 = defineAsyncComponent(() => import('/@/views/login/loginTemplate/loginTemplate1.vue'));
const loginTemplate2 = defineAsyncComponent(() => import('/@/views/login/loginTemplate/loginTemplate2.vue'));
// const LayoutFooter = defineAsyncComponent(() => import('/@/layout/footer/index.vue'));

const props = defineProps({
	templateId: {
		type: String,
		default: '1',
	},
	scale: {
		type: Number,
		default: 0.15,
	},
});
</script>
<style scoped lang="scss">
.main {
	overflow: hidden;
	border: 1px solid #f8f8f8;
	box-sizing: border-box;
}
.loginReview {
	overflow: auto;
	width: 95vw;
	height: 100vh;
	position: relative;
	transform-origin: 0% 0%;
	transform: scale(0.15);
	box-shadow: 0px 20px 20px 0px rgba(0, 0, 0, 0.5);
}
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
</style>
