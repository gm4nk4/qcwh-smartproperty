<template>
	<div class="independent-org-view">
		<!-- 编辑弹窗 -->
		<OrgEditDialog v-model:visible="editDialogVisible" :org-info="editingOrgInfo" @save="handleOrgSave" />

		<!-- 主体内容区 -->
		<div class="ind-main-content">
			<!-- 左侧应用列表 -->
			<div class="left-app-panel">
				<!-- 独立组织架构应用 -->
				<div class="app-section">
					<div class="section-header">
						<div class="section-icon">
							<svg viewBox="0 0 24 24" fill="none">
								<path d="M12 3L2 7L12 11L22 7L12 3Z" fill="#64748B" />
								<path d="M2 17L12 21L22 17" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
								<path d="M2 12L12 16L22 12" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
						</div>
						<div class="section-title">独立组织架构</div>
						<div class="section-desc">已在子应用管理中配置为"独立组织架构"模式</div>
						<el-tag type="success" size="small">{{ independentApps.length }} 个应用</el-tag>
					</div>
					<div class="app-list">
						<div
							v-for="app in independentApps"
							:key="app.id"
							class="app-item"
							:class="{ active: selectedAppId === app.id }"
							@click="handleSelectApp(app)"
						>
							<div class="app-icon-wrapper">
								<div class="app-icon">{{ app.name.charAt(0) }}</div>
							</div>
							<div class="app-name">{{ app.name }}</div>
							<div class="app-status-check">
								<svg viewBox="0 0 24 24" fill="none">
									<path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="#22C55E" />
								</svg>
							</div>
						</div>
					</div>
				</div>

				<!-- 使用统一架构应用 -->
				<div class="app-section">
					<div class="section-header">
						<div class="section-icon">
							<svg viewBox="0 0 24 24" fill="none">
								<path d="M4 4H10V10H4V4Z" fill="#9CA3AF" />
								<path d="M14 4H20V10H14V4Z" fill="#9CA3AF" />
								<path d="M4 14H10V20H4V14Z" fill="#9CA3AF" />
								<path d="M14 14H20V20H14V14Z" fill="#9CA3AF" />
							</svg>
						</div>
						<div class="section-title">使用统一架构</div>
						<div class="section-desc">这些应用共享统一组织架构，在"统一架构"标签页中管理</div>
						<el-tag type="info" size="small">{{ unifiedApps.length }} 个应用</el-tag>
					</div>
					<div class="app-list unified-list">
						<div v-for="app in unifiedApps" :key="app.id" class="app-item unified-item">
							<div class="app-icon-small">
								<svg viewBox="0 0 24 24" fill="none">
									<path d="M4 4H10V10H4V4Z" fill="#9CA3AF" />
									<path d="M14 4H20V10H14V4Z" fill="#9CA3AF" />
									<path d="M4 14H10V20H4V14Z" fill="#9CA3AF" />
									<path d="M14 14H20V20H14V14Z" fill="#9CA3AF" />
								</svg>
							</div>
							<div class="app-name">{{ app.name }}</div>
						</div>
					</div>
				</div>
			</div>

			<!-- 右侧组织树 -->
			<div class="right-panel" v-if="selectedApp && selectedApp.hasIndependentOrg">
				<div class="org-tree-header">
					<div class="header-left">
						<div class="header-icon">
							<svg viewBox="0 0 24 24" fill="none">
								<path d="M12 3L2 7L12 11L22 7L12 3Z" fill="#3B82F6" />
								<path d="M2 17L12 21L22 17" stroke="#3B82F6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
								<path d="M2 12L12 16L22 12" stroke="#3B82F6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
						</div>
						<div class="header-title">{{ selectedApp.name }}-专属组织</div>
						<el-tag type="warning" size="small">独立架构</el-tag>
					</div>
					<div class="header-right">
						<el-button type="primary" size="small" @click="handleAddOrg">
							<el-icon><Plus /></el-icon>
							添加部门
						</el-button>
					</div>
				</div>
				<OrgTree
					:organizations="selectedApp.organizations || []"
					:selected-node-id="selectedNodeId"
					:show-header="false"
					app-name="selectedApp.name"
					@node-click="handleNodeClick"
					@add-org="handleAddOrg"
					@edit-org="handleEditOrg"
					@delete="handleDelete"
					@add-space="handleAddSubSpace"
				/>
			</div>
			<div class="right-panel empty-panel" v-else>
				<el-empty description="请选择一个独立组织架构的应用" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="IndependentOrgView">
/**
 * 子应用独立组织架构视图组件
 */

import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import type { AppIndependentApp, Organization } from '../type';
import OrgTree from './OrgTree.vue';
import OrgEditDialog from './OrgEditDialog.vue';

interface Props {
	apps: AppIndependentApp[];
	selectedAppId: string;
	selectedNodeId: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
	(e: 'update:selectedAppId', id: string): void;
	(e: 'update:selectedNodeId', id: number): void;
	(e: 'update:apps', apps: AppIndependentApp[]): void;
}>();

// 编辑弹窗相关
const editDialogVisible = ref(false);
const editingOrgInfo = ref<Organization | null>(null);

// 选中的应用
const selectedApp = computed(() => props.apps.find((app) => app.id === props.selectedAppId));

// 独立架构应用
const independentApps = computed(() => props.apps.filter((app) => app.hasIndependentOrg));

// 统一架构应用
const unifiedApps = computed(() => props.apps.filter((app) => !app.hasIndependentOrg));

/**
 * 选择应用
 */
const handleSelectApp = (app: AppIndependentApp) => {
	emit('update:selectedAppId', app.id);
	emit('update:selectedNodeId', 1);
};

/**
 * 节点点击事件
 */
const handleNodeClick = (data: Organization) => {
	emit('update:selectedNodeId', data.id);
};

/**
 * 添加组织
 */
const handleAddOrg = () => {
	editingOrgInfo.value = null;
	editDialogVisible.value = true;
};

/**
 * 编辑组织
 */
const handleEditOrg = (data: Organization) => {
	editingOrgInfo.value = data;
	editDialogVisible.value = true;
};

/**
 * 删除组织
 */
const handleDelete = (data: Organization) => {
	editingOrgInfo.value = null;
	editDialogVisible.value = false;
};

/**
 * 添加子部门
 */
const handleAddSubSpace = (data: Organization) => {
	editingOrgInfo.value = null;
	editDialogVisible.value = false;
};

/**
 * 保存组织
 */
const handleOrgSave = (data: any) => {
	// 创建新数组
	const newApps = JSON.parse(JSON.stringify(props.apps));
	const appIndex = newApps.findIndex((app: AppIndependentApp) => app.id === props.selectedAppId);

	if (appIndex === -1) {
		ElMessage.error('未找到选中的应用');
		return;
	}

	if (!newApps[appIndex].organizations) {
		newApps[appIndex].organizations = [];
	}

	if (editingOrgInfo.value) {
		updateOrg(newApps[appIndex].organizations, editingOrgInfo.value.id, data);
		ElMessage.success('编辑成功');
	} else {
		const newId = Date.now();
		const newOrg: Organization = {
			...data,
			id: newId,
			memberCount: 0,
		};
		newApps[appIndex].organizations.push(newOrg);
		ElMessage.success('新增成功');
	}

	emit('update:apps', newApps);
};

/**
 * 更新组织
 */
function updateOrg(list: Organization[], id: number, data: any): boolean {
	for (let i = 0; i < list.length; i++) {
		if (list[i].id === id) {
			list[i] = {
				...list[i],
				...data,
			};
			return true;
		}
		if (list[i].children && (list[i]?.children || []).length > 0) {
			if (updateOrg(list[i]?.children || [], id, data)) {
				return true;
			}
		}
	}
	return false;
}
</script>

<style scoped lang="scss">
.independent-org-view {
	display: flex;
	flex-direction: column;
	gap: 16px;
	height: 100%;
}

.ind-main-content {
	display: flex;
	gap: 16px;
	flex: 1;
	min-height: 0;
}

.left-app-panel {
	width: 520px;
	flex-shrink: 0;
	border-radius: 10px;
	border: 1px solid #e5e7eb;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	padding: 16px;
	gap: 24px;

	.app-section {
		display: flex;
		flex-direction: column;
		gap: 12px;

		.section-header {
			display: flex;
			align-items: center;
			gap: 8px;
			flex-wrap: wrap;

			.section-icon {
				width: 20px;
				height: 20px;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-shrink: 0;
			}

			.section-title {
				font-size: 14px;
				font-weight: 600;
				color: #374151;
			}

			.section-desc {
				font-size: 12px;
				color: #9ca3af;
				flex: 1;
			}
		}

		.app-list {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 12px;

			.app-item {
				display: flex;
				align-items: center;
				gap: 10px;
				padding: 12px 16px;
				border-radius: 8px;
				background: #f9fafb;
				border: 1px solid #e5e7eb;
				cursor: pointer;
				transition: all 0.2s;
				position: relative;

				&:hover {
					background: #f3f4f6;
				}

				&.active {
					background: #eff6ff;
					border-color: #3b82f6;

					.app-icon-wrapper {
						background: #3b82f6;
						.app-icon {
							color: #fff;
						}
					}

					.app-icon {
						color: white;
					}
				}

				.app-icon-wrapper {
					width: 36px;
					height: 36px;
					border-radius: 6px;
					background: #dbeafe;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-shrink: 0;

					.app-icon {
						color: #3b82f6;
						font-size: 16px;
						font-weight: 600;
					}
				}

				.app-name {
					font-size: 14px;
					color: #374151;
					font-weight: 500;
					flex: 1;
				}

				.app-status-check {
					width: 20px;
					height: 20px;
					flex-shrink: 0;
				}
			}

			&.unified-list {
				grid-template-columns: repeat(3, 1fr);

				.app-item.unified-item {
					background: #f3f4f6;
					cursor: default;
					padding: 10px 12px;

					&:hover {
						background: #f3f4f6;
					}

					.app-icon-small {
						width: 16px;
						height: 16px;
						flex-shrink: 0;
					}

					.app-name {
						font-size: 12px;
						color: #6b7280;
						font-weight: 400;
					}
				}
			}
		}
	}
}

.right-panel {
	flex: 1;
	border-radius: 10px;
	border: 1px solid #e5e7eb;
	display: flex;
	flex-direction: column;
	overflow: hidden;

	.org-tree-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16px;
		border-bottom: 1px solid #e5e7eb;

		.header-left {
			display: flex;
			align-items: center;
			gap: 10px;

			.header-icon {
				width: 20px;
				height: 20px;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.header-title {
				font-size: 14px;
				font-weight: 600;
				color: #374151;
			}
		}
	}

	&.empty-panel {
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
</style>
