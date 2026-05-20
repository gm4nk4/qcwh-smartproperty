<template>
	<div class="org-management-page">
		<!-- 顶部标签页和提示 -->
		<div class="top-section">
			<div class="tab-header">
				<el-tabs v-model="activeTab">
					<el-tab-pane label="统一架构" name="unified" />
					<el-tab-pane label="子应用独立" name="independent" />
				</el-tabs>
			</div>
			<div class="tip-bar">
				<el-icon><InfoFilled /></el-icon>
				<span
					>组织架构模式选择 - 统一模式下全平台共用一套组织架构；子应用独立模式下，同一用户可在不同子应用中归属不同组织。当前有
					{{ independentApps.length }} 个子应用已配置独立组织架构模式。</span
				>
			</div>
		</div>

		<!-- 统计卡片 -->
		<div class="stats-cards">
			<div class="stat-card">
				<div class="stat-icon">
					<svg viewBox="0 0 24 24" fill="none">
						<path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z" fill="#1890FF" />
						<path d="M7 7H17V9H7V7Z" fill="white" />
						<path d="M7 11H14V13H7V11Z" fill="white" />
						<path d="M7 15H12V17H7V15Z" fill="white" />
					</svg>
				</div>
				<div class="stat-info">
					<div class="stat-label">统一架构应用</div>
					<div class="stat-value">15</div>
				</div>
			</div>
			<div class="stat-card">
				<div class="stat-icon">
					<svg viewBox="0 0 24 24" fill="none">
						<path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#1890FF" />
						<path d="M2 17L12 22L22 17" stroke="#1890FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
						<path d="M2 12L12 17L22 12" stroke="#1890FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</div>
				<div class="stat-info">
					<div class="stat-label">独立架构应用</div>
					<div class="stat-value">{{ independentApps.length }}</div>
				</div>
			</div>
			<div class="stat-card">
				<div class="stat-icon">
					<svg viewBox="0 0 24 24" fill="none">
						<path
							d="M16 11C17.66 11 19 9.66 19 8C19 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM6 11C7.66 11 9 9.66 9 8C9 6.34 7.66 5 6 5C4.34 5 3 6.34 3 8C3 9.66 4.34 11 6 11ZM6 13C4.34 13 3 14.34 3 16C3 17.66 4.34 19 6 19C7.66 19 9 17.66 9 16C9 14.34 7.66 13 6 13ZM16 13C14.34 13 13 14.34 13 16C13 17.66 14.34 19 16 19C17.66 19 19 17.66 19 16C19 14.34 17.66 13 16 13Z"
							fill="#1890FF"
						/>
					</svg>
				</div>
				<div class="stat-info">
					<div class="stat-label">已配置专属架构</div>
					<div class="stat-value">{{ independentApps.length }}</div>
				</div>
			</div>
		</div>

		<!-- 主体内容区 -->
		<div class="main-content">
			<!-- 统一架构视图 -->
			<UnifiedOrgView
				v-if="activeTab === 'unified'"
				:organizations="organizations"
				:selected-node-id="selectedNodeId"
				@update:selected-node-id="selectedNodeId = $event"
				@update:organizations="organizations = $event"
			/>

			<!-- 子应用独立视图 -->
			<IndependentOrgView
				v-else
				:apps="apps"
				:selected-app-id="selectedAppId"
				:selected-node-id="selectedNodeId"
				@update:selected-app-id="selectedAppId = $event"
				@update:selected-node-id="selectedNodeId = $event"
				@update:apps="apps = $event"
			/>
		</div>
	</div>
</template>

<script setup lang="ts" name="OrganizationIndex">
/**
 * 组织管理页面组件
 * @description 实现组织的增删改查功能
 */

import { ref, computed } from 'vue';
import { InfoFilled } from '@element-plus/icons-vue';
import type { Organization } from './type';
import { mockOrganizations, mockApps } from './mock';
import UnifiedOrgView from './components/UnifiedOrgView.vue';
import IndependentOrgView from './components/IndependentOrgView.vue';

// 激活的标签页
const activeTab = ref('unified');

// 应用数据
const apps = ref(mockApps);

// 选中的应用
const selectedAppId = ref('work-order');

// 选中的节点ID
const selectedNodeId = ref(1);

// 组织数据
const organizations = ref<Organization[]>(mockOrganizations);

// 独立架构应用
const independentApps = computed(() => apps.value.filter((app) => app.hasIndependentOrg));
</script>

<style scoped lang="scss">
.org-management-page {
	display: flex;
	flex-direction: column;
	height: calc(100vh - 185px);
	padding: 16px;
	box-sizing: border-box;
	gap: 16px;
	overflow: hidden;
}

.top-section {
	display: flex;
	flex-direction: column;
	gap: 12px;

	.tab-header {
		:deep(.el-tabs__header) {
			margin: 0;
		}
	}

	.tip-bar {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 16px;
		background: #eff6ff;
		border-radius: 6px;
		color: #1e40af;
		font-size: 13px;

		.el-icon {
			color: #3b82f6;
		}
	}
}

.stats-cards {
	display: flex;
	gap: 16px;

	.stat-card {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 16px 20px;
		background: #ffffff;
		border-radius: 10px;
		border: 1px solid #e5e7eb;

		.stat-icon {
			width: 48px;
			height: 48px;
			background: linear-gradient(135deg, #e6f4ff 0%, #f0f7ff 100%);
			border-radius: 10px;
			display: flex;
			align-items: center;
			justify-content: center;

			svg {
				width: 28px;
				height: 28px;
			}
		}

		.stat-info {
			display: flex;
			flex-direction: column;
			gap: 4px;

			.stat-label {
				font-size: 14px;
				color: #6b7280;
			}
		}
	}
}

.stat-value {
	font-size: 24px;
	font-weight: 700;
	color: #1f2937;
	line-height: 1;
}

.main-content {
	flex: 1;
	min-height: 0;
	overflow: hidden;
}
</style>
