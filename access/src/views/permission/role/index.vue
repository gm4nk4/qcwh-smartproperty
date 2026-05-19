<template>
	<div class="role-management-page">
		<!-- 顶部标签页 -->
		<div class="tab-container">
			<el-tabs
				v-model="activeTab"
				class="role-tabs"
			>
				<el-tab-pane
					label="子应用角色"
					name="app-role"
				/>
				<el-tab-pane
					label="平台角色"
					name="platform-role"
				/>
			</el-tabs>
		</div>

		<!-- 子应用角色内容 -->
		<AppRoleTab v-if="activeTab === 'app-role'" />

		<!-- 平台角色内容 -->
		<PlatformRoleTab v-else />
	</div>
</template>

<script setup lang="ts" name="roleIndex">
/**
 * 角色管理页面组件
 * @description 实现角色管理功能，包含子应用角色和平台角色的管理
 */

import { ref } from 'vue';
import AppRoleTab from './components/AppRoleTab.vue';
import PlatformRoleTab from './components/PlatformRoleTab.vue';

// 当前激活的标签页
const activeTab = ref('app-role');
</script>

<style scoped lang="scss">
.role-management-page {
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 16px;
	box-sizing: border-box;
}

.tab-container {
	margin-bottom: 16px;

	.role-tabs {
		:deep(.el-tabs__header) {
			margin: 0;
		}

		:deep(.el-tabs__nav-wrap::after) {
			display: none;
		}

		:deep(.el-tabs__item) {
			font-size: 14px;
			padding: 0 24px;
			height: 40px;
			line-height: 40px;
			border: 1px solid #e5e7eb;
			background: #ffffff;
			margin-right: 8px;
			border-radius: 8px;

			&.is-active {
				background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
				color: #ffffff;
				border-color: transparent;
			}
		}

		:deep(.el-tabs__active-bar) {
			display: none;
		}
	}
}
</style>
