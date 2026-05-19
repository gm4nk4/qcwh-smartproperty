<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-tabs type="border-card" class="demo-tabs">
				<el-tab-pane label="登录日志"><LoginLog></LoginLog></el-tab-pane>
				<el-tab-pane label="系统日志"><OperateLog></OperateLog></el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script lang="ts" setup>
const LoginLog = defineAsyncComponent(() => import('./loginLog/index.vue'));
const OperateLog = defineAsyncComponent(() => import('./operateLog/index.vue'));
</script>

<style lang="scss" scoped>
.demo-tabs {
	height: 100%;
}
.demo-tabs > .el-tabs__content {
	padding: 32px;
	color: #6b778c;
	font-size: 32px;
	font-weight: 600;

	& > div {
		overflow: auto;
		width: 100%;
		height: 100%;
	}
}

.demo-tabs .custom-tabs-label .el-icon {
	vertical-align: middle;
}
.demo-tabs .custom-tabs-label span {
	vertical-align: middle;
	margin-left: 4px;
}
</style>
