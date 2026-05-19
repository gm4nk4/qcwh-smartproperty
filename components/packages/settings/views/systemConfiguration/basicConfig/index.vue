<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-tabs type="border-card" class="demo-tabs">
				<el-tab-pane label="系统外观"><SystemAppearance></SystemAppearance> </el-tab-pane>
				<el-tab-pane label="登录页"><LoginPage></LoginPage> </el-tab-pane>
				<el-tab-pane label="登录设置"> <LoginConfig></LoginConfig> </el-tab-pane>
				<el-tab-pane label="密码策略"> <PwdConfig></PwdConfig></el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script lang="ts" name="basicConfig" setup>
// 引入组件
const SystemAppearance = defineAsyncComponent(() => import('./systemAppearance/index.vue'));
const LoginConfig = defineAsyncComponent(() => import('./loginConfig/index.vue'));
const LoginPage = defineAsyncComponent(() => import('./loginPage/index.vue'));
const PwdConfig = defineAsyncComponent(() => import('./pwdConfig/index.vue'));
</script>

<style scoped>
.demo-tabs {
	height: 100%;
}
.demo-tabs > .el-tabs__content {
	padding: 32px;
	color: #6b778c;
	font-size: 32px;
	font-weight: 600;

	& > div {
		/* overflow: auto; */
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
