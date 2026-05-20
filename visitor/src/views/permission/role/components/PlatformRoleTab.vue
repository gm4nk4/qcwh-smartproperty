<template>
	<div class="main-content">
		<!-- 平台角色编辑弹窗 -->
		<PlatformRoleEditDialog v-model:visible="editDialogVisible" :role-info="editingRoleInfo" @save="handleRoleSave" />

		<!-- 权限分配弹窗 -->
		<PermissionAssignDialog v-model:visible="permissionDialogVisible" :role-info="currentPlatformRole" @save="handlePermissionSave" />

		<!-- 左侧平台角色列表 -->
		<div class="left-panel">
			<div class="panel-card">
				<!-- 操作栏 -->
				<div class="platform-role-actions">
					<el-button type="primary" size="default" class="add-platform-role-btn" @click="handleAddRole">
						<template #icon>
							<svg viewBox="0 0 24 24" fill="none">
								<path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor" />
							</svg>
						</template>
						新建平台角色
					</el-button>
				</div>
				<!-- 搜索框 -->
				<div class="search-box">
					<el-input v-model="platformRoleSearchText" placeholder="请输入平台角色名称" clearable size="small">
						<template #prefix>
							<el-icon><Search /></el-icon>
						</template>
					</el-input>
				</div>
				<!-- 平台角色列表 -->
				<div class="platform-role-list">
					<div
						v-for="item in platformRoleItems"
						:key="item.id"
						class="platform-role-item"
						:class="{ active: currentPlatformRoleId === item.id }"
						@click="handlePlatformRoleClick(item)"
					>
						<div class="platform-role-item-header">
							<span class="platform-role-icon">
								<svg viewBox="0 0 24 24" fill="none">
									<path
										d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
										fill="#1890FF"
									/>
								</svg>
							</span>
							<span class="platform-role-name">{{ item.name }}</span>
						</div>
						<div class="platform-role-item-info">
							<span class="platform-role-info-item">{{ item.appCount }}个子应用</span>
							<span class="platform-role-info-item">{{ item.roleCount }}个角色</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 右侧平台角色详情 -->
		<div class="right-panel">
			<div class="panel-card" v-if="currentPlatformRole">
				<!-- 平台角色信息卡片 -->
				<div class="platform-role-detail-card">
					<div class="platform-role-detail-header">
						<div class="platform-role-detail-title">
							<span class="platform-role-detail-icon">
								<svg viewBox="0 0 24 24" fill="none">
									<path
										d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
										fill="#1890FF"
									/>
								</svg>
							</span>
							<div class="platform-role-detail-name-wrapper">
								<span class="platform-role-detail-name">{{ currentPlatformRole.roleName }}</span>
								<div class="platform-role-detail-meta">
									<span class="platform-role-detail-meta-item">{{ currentPlatformRole.appCount }}个子应用</span>
									<span class="platform-role-detail-meta-divider">·</span>
									<span class="platform-role-detail-meta-item">{{ currentPlatformRole.roleCount }}个角色</span>
									<span class="platform-role-detail-meta-divider">·</span>
									<span class="platform-role-detail-meta-item">{{ currentPlatformRole.userCount }}人使用</span>
								</div>
							</div>
						</div>
						<div class="platform-role-detail-tags">
							<el-tag v-if="currentPlatformRole.isBuiltIn" type="info" size="small" class="built-in-tag">内置</el-tag>
							<el-tag type="primary" size="small" effect="plain" class="role-code-tag">{{ currentPlatformRole.roleCode }}</el-tag>
						</div>
					</div>
					<div class="platform-role-detail-description">
						{{ currentPlatformRole.description }}
					</div>
					<div class="platform-role-detail-actions">
						<el-button type="primary" size="default" @click="handleAssignPermission">权限分配</el-button>
						<el-button size="default" @click="handleEditRole" :disabled="currentPlatformRole.isBuiltIn">编辑</el-button>
					</div>
				</div>

				<!-- 子应用角色分配区域 -->
				<div class="app-role-allocation-container">
					<div class="app-role-allocation-grid">
						<div v-for="(appMap, index) in currentPlatformRole.appRoleMap" :key="index" class="app-role-card" :class="{ active: index < 2 }">
							<div class="app-role-card-header">
								<span class="app-role-card-title">{{ appMap.appName }}</span>
							</div>
							<div class="app-role-card-content">
								<div class="app-role-list">
									<div v-for="(role, roleIndex) in appMap.roles" :key="roleIndex" class="app-role-item" :class="{ selected: role.isDefault }">
										<span class="app-role-item-icon">
											<svg v-if="role.isDefault" viewBox="0 0 24 24" fill="none">
												<path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="#1890FF" />
											</svg>
											<span v-else class="app-role-item-empty"></span>
										</span>
										<span class="app-role-item-name">{{ role.roleName }}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="PlatformRoleTab">
/**
 * 平台角色标签页组件
 * @description 实现平台角色管理功能
 */

import { ref, computed } from 'vue';
import { Search } from '@element-plus/icons-vue';
import type { PlatformRole, PlatformRoleItem } from '../type';
import { mockPlatformRoles, mockPlatformRoleItems } from '../mock';
import PlatformRoleEditDialog from './PlatformRoleEditDialog.vue';
import PermissionAssignDialog from './PermissionAssignDialog.vue';
import { ElMessage } from 'element-plus';

// 平台角色搜索文本
const platformRoleSearchText = ref('');

// 当前选中的平台角色ID
const currentPlatformRoleId = ref<number>(1);

// 平台角色数据
const platformRoles = ref<PlatformRole[]>(mockPlatformRoles);

// 平台角色列表数据
const platformRoleItems = ref<PlatformRoleItem[]>(mockPlatformRoleItems);

// 编辑弹窗相关
const editDialogVisible = ref(false);
const editingRoleInfo = ref<PlatformRole | null>(null);

// 权限分配弹窗相关
const permissionDialogVisible = ref(false);

// 当前选中的平台角色
const currentPlatformRole = computed(() => {
	return platformRoles.value.find((p) => p.id === currentPlatformRoleId.value);
});

/**
 * 处理平台角色点击
 * @param item 平台角色项
 */
const handlePlatformRoleClick = (item: PlatformRoleItem) => {
	currentPlatformRoleId.value = item.id;
	console.log('选择了平台角色:', item);
};

/**
 * 处理新建平台角色
 */
const handleAddRole = () => {
	editingRoleInfo.value = null;
	editDialogVisible.value = true;
};

/**
 * 处理编辑平台角色
 */
const handleEditRole = () => {
	editingRoleInfo.value = currentPlatformRole.value || null;
	editDialogVisible.value = true;
};

/**
 * 处理保存平台角色
 * @param data 角色数据
 */
const handleRoleSave = (data: any) => {
	if (editingRoleInfo.value) {
		// 编辑模式，更新现有角色
		const index = platformRoles.value.findIndex((p) => p.id === editingRoleInfo.value!.id);
		if (index !== -1) {
			platformRoles.value[index] = {
				...platformRoles.value[index],
				...data,
				id: editingRoleInfo.value!.id,
			};
			// 同步更新平台角色列表数据
			const itemIndex = platformRoleItems.value.findIndex((p) => p.id === editingRoleInfo.value!.id);
			if (itemIndex !== -1) {
				platformRoleItems.value[itemIndex] = {
					id: platformRoleItems.value[itemIndex].id,
					name: data.roleName,
					appCount: data.appCount,
					roleCount: data.roleCount,
				};
			}
		}
	} else {
		// 新增模式，添加新角色
		const newId = Math.max(...platformRoles.value.map((p) => p.id)) + 1;
		const newRole = {
			...data,
			id: newId,
		};
		platformRoles.value.push(newRole);
		platformRoleItems.value.push({
			id: newId,
			name: data.roleName,
			appCount: data.appCount,
			roleCount: data.roleCount,
		});
		// 选中新创建的角色
		currentPlatformRoleId.value = newId;
	}
};

/**
 * 处理权限分配
 */
const handleAssignPermission = () => {
	permissionDialogVisible.value = true;
};

/**
 * 处理保存权限
 * @param data 权限数据
 */
const handlePermissionSave = (data: any) => {
	console.log('保存权限:', data);
	ElMessage.success('权限分配成功');
};
</script>

<style scoped lang="scss">
.main-content {
	flex: 1;
	display: flex;
	gap: 16px;
	overflow: hidden;
}

.left-panel {
	width: 280px;
	flex-shrink: 0;
}

.right-panel {
	flex: 1;
	overflow: hidden;
}

.panel-card {
	background: #ffffff;
	border-radius: 12px;
	border: 1px solid #e5e7eb;
	height: 100%;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.search-box {
	padding: 16px;
	border-bottom: 1px solid #f0f0f0;
}

.platform-role-actions {
	padding: 16px 16px 0;
}

.add-platform-role-btn {
	width: 100%;
}

.platform-role-list {
	flex: 1;
	overflow-y: auto;
	padding: 8px 16px;
}

.platform-role-item {
	padding: 12px 16px;
	border: 1px solid #e5e7eb;
	border-radius: 8px;
	margin-bottom: 8px;
	cursor: pointer;
	transition: all 0.2s;

	&:hover {
		border-color: #1890ff;
		background: #f0f7ff;
	}

	&.active {
		border: 2px solid #1890ff;
		background: linear-gradient(135deg, #e6f4ff 0%, #f0f7ff 100%);
	}
}

.platform-role-item-header {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 6px;
}

.platform-role-icon {
	width: 24px;
	height: 24px;
	display: flex;
	align-items: center;
	justify-content: center;

	svg {
		width: 20px;
		height: 20px;
	}
}

.platform-role-name {
	font-size: 14px;
	font-weight: 500;
	color: #1f2937;
}

.platform-role-item-info {
	display: flex;
	gap: 8px;
	margin-left: 32px;
}

.platform-role-info-item {
	font-size: 12px;
	color: #6b7280;
}

.platform-role-detail-card {
	padding: 20px;
	border-bottom: 1px solid #f0f0f0;
}

.platform-role-detail-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 12px;
}

.platform-role-detail-title {
	display: flex;
	align-items: center;
	gap: 12px;
}

.platform-role-detail-icon {
	width: 40px;
	height: 40px;
	background: #e6f4ff;
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;

	svg {
		width: 24px;
		height: 24px;
	}
}

.platform-role-detail-name-wrapper {
	display: flex;
	flex-direction: column;
}

.platform-role-detail-name {
	font-size: 16px;
	font-weight: 600;
	color: #1f2937;
	margin-bottom: 4px;
}

.platform-role-detail-meta {
	display: flex;
	align-items: center;
	gap: 6px;
}

.platform-role-detail-meta-item {
	font-size: 12px;
	color: #6b7280;
}

.platform-role-detail-meta-divider {
	color: #d1d5db;
	font-size: 12px;
}

.platform-role-detail-tags {
	display: flex;
	align-items: center;
	gap: 8px;
}

.built-in-tag {
	background: #f3f4f6;
	color: #6b7280;
	border: none;
}

.role-code-tag {
	border-color: #93c5fd;
	color: #1d4ed8;
}

.platform-role-detail-description {
	font-size: 13px;
	color: #6b7280;
	line-height: 1.6;
	margin-bottom: 16px;
}

.platform-role-detail-actions {
	display: flex;
	gap: 12px;
}

.app-role-allocation-container {
	flex: 1;
	overflow-y: auto;
	padding: 20px;
}

.app-role-allocation-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 16px;
}

.app-role-card {
	border: 1px solid #e5e7eb;
	border-radius: 8px;
	background: #ffffff;
	overflow: hidden;

	&.active {
		border-color: #1890ff;
	}
}

.app-role-card-header {
	padding: 12px 16px;
	background: #f9fafb;
	border-bottom: 1px solid #f0f0f0;
}

.app-role-card-title {
	font-size: 14px;
	font-weight: 500;
	color: #1f2937;
}

.app-role-card-content {
	padding: 16px;
}

.app-role-list {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.app-role-item {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 8px 12px;
	border-radius: 6px;
	background: #f3f4f6;
	transition: all 0.2s;

	&.selected {
		background: #e6f4ff;
	}
}

.app-role-item-icon {
	width: 18px;
	height: 18px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;

	svg {
		width: 16px;
		height: 16px;
	}
}

.app-role-item-empty {
	width: 16px;
	height: 16px;
	border-radius: 2px;
	background: #d1d5db;
}

.app-role-item-name {
	font-size: 13px;
	color: #4b5563;
}
</style>
