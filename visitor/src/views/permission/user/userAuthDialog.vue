<template>
	<!-- 用户赋权弹窗 -->
	<el-dialog v-model="dialogVisible" width="1100px" :close-on-click-modal="false" class="auth-dialog" title="用户赋权" @close="handleClose">
		<!-- 用户信息栏 -->
		<div class="user-info-bar">
			<div class="user-info-left">
				<el-avatar :size="48" :src="userAvatarUrl" />
				<div class="user-info-text">
					<div class="user-name">
						{{ userInfo.username }}
						<span v-if="userInfo.isOnline" class="online-badge">在线</span>
					</div>
					<div class="user-desc">{{ userInfo.position }} · {{ userInfo.userId }}</div>
				</div>
			</div>
			<div class="user-info-right">
				<div class="stat-item">
					<el-icon><Box /></el-icon>
					<span>平台角色：{{ platformRoleCount }}</span>
				</div>
				<div class="stat-item">
					<el-icon><Connection /></el-icon>
					<span>直接分配：{{ directAssignCount }}</span>
				</div>
			</div>
		</div>

		<!-- 主内容区 -->
		<div class="main-content">
			<!-- 左侧：角色选择 -->
			<div class="left-panel">
				<!-- Tab切换 -->
				<div class="tab-bar">
					<div class="tab-item" :class="{ active: activeTab === 'platform' }" @click="activeTab = 'platform'">平台角色</div>
					<div class="tab-item" :class="{ active: activeTab === 'direct' }" @click="activeTab = 'direct'">子应用角色(直接分配)</div>
				</div>

				<!-- Tab描述 -->
				<div class="tab-desc">选择子应用角色（可多选，补充平台角色未覆盖的权限）</div>

				<!-- 角色列表 -->
				<div class="role-list">
					<div v-for="(app, appIndex) in subAppList" :key="appIndex" class="app-item">
						<div class="app-header">
							<div class="app-name">
								<el-icon class="app-icon"><CircleCheck /></el-icon>
								{{ app.name }}
								<el-tag v-if="app.inherited" type="success" effect="plain" size="small"> 1个已继承 </el-tag>
							</div>
							<div class="app-right">
								<span class="role-count" v-if="app.selectedCount > 0"> 已选 {{ app.selectedCount }} 项 </span>
							</div>
						</div>

						<div class="role-options">
							<div v-for="(role, roleIndex) in app.roles" :key="roleIndex" class="role-option">
								<el-checkbox v-model="role.selected" @change="updateSelectedCount(app)">
									{{ role.name }}
									<el-tag v-if="role.inherited" type="warning" effect="plain" size="small"> 已继承 </el-tag>
								</el-checkbox>
							</div>
						</div>
					</div>
				</div>

				<!-- 底部统计 -->
				<div class="bottom-stat">
					<span
						>直接分配 <b>{{ directAssignCount }}</b> 个子应用角色</span
					>
					<span class="app-total"
						>子应用覆盖：<b>{{ coveredAppCount }}</b> 个</span
					>
				</div>
			</div>

			<!-- 右侧：预览 -->
			<div class="right-panel">
				<!-- 直接分配预览 -->
				<div class="preview-section">
					<div class="preview-title">
						<el-icon><Share /></el-icon>
						直接分配预览
					</div>
					<div class="preview-content direct-preview">
						<el-tag v-for="(item, index) in directPreviewList" :key="index" type="info" effect="plain" class="preview-tag">
							{{ item }}
						</el-tag>
					</div>
				</div>

				<!-- 最终权限集合预览 -->
				<div class="preview-section">
					<div class="preview-title">
						<el-icon><DataLine /></el-icon>
						最终权限集合预览（平台角色继承 U 直接分配）
						<el-tag type="danger" effect="plain" size="small" class="tips-tag">Tips</el-tag>
					</div>
					<div class="preview-content final-preview">
						<el-tag v-for="(item, index) in finalPreviewList" :key="index" type="success" effect="plain" class="preview-tag">
							{{ item }}
						</el-tag>
					</div>
				</div>
			</div>
		</div>

		<!-- 底部按钮 -->
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="handleClose">取消</el-button>
				<el-button type="primary" @click="handleSave">保存赋权</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
/**
 * @component UserAuthDialog
 * @description 用户赋权弹窗组件
 * @props visible - 控制弹窗显示/隐藏
 * @props userInfo - 用户信息
 * @emits update:visible - 关闭弹窗时触发
 * @emits save - 保存赋权时触发
 */
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Close, Box, Connection, CircleCheck, Share, DataLine } from '@element-plus/icons-vue';
import type { UserAuthDialogProps, UserAuthDialogEmits, UserInfo, AuthSubApp as SubApp } from './type';
import { mockAuthSubAppList as mockSubAppList } from './mock';

const props = defineProps<UserAuthDialogProps>();
const emit = defineEmits<UserAuthDialogEmits>();

const activeTab = ref<'platform' | 'direct'>('direct');

/**
 * 用户信息
 */
const userInfo = computed(() => props.userInfo);

/**
 * 子应用列表
 */
const subAppList = ref<SubApp[]>(JSON.parse(JSON.stringify(mockSubAppList)));

/**
 * 用户头像
 */
const userAvatarUrl = computed(() => {
	return 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';
});

/**
 * 平台角色数量
 */
const platformRoleCount = computed(() => {
	return 1;
});

/**
 * 更新选中数量
 */
const updateSelectedCount = (app: SubApp) => {
	app.selectedCount = app.roles.filter((role) => role.selected && !role.inherited).length;
};

/**
 * 直接分配的角色数量
 */
const directAssignCount = computed(() => {
	let count = 0;
	subAppList.value.forEach((app) => {
		app.roles.forEach((role) => {
			if (role.selected && !role.inherited) {
				count++;
			}
		});
	});
	return count;
});

/**
 * 覆盖的子应用数量
 */
const coveredAppCount = computed(() => {
	let count = 0;
	subAppList.value.forEach((app) => {
		if (app.selectedCount > 0) {
			count++;
		}
	});
	return count;
});

/**
 * 直接分配预览列表
 */
const directPreviewList = computed(() => {
	const list: string[] = [];
	subAppList.value.forEach((app) => {
		app.roles.forEach((role) => {
			if (role.selected && !role.inherited) {
				list.push(`${app.name} · ${role.name}`);
			}
		});
	});
	return list;
});

/**
 * 最终权限预览列表
 */
const finalPreviewList = computed(() => {
	const list: string[] = [];
	subAppList.value.forEach((app) => {
		app.roles.forEach((role) => {
			if (role.selected || role.inherited) {
				list.push(`${app.name} · ${role.name}`);
			}
		});
	});
	return list;
});

/**
 * 双向绑定控制弹窗显示/隐藏
 */
const dialogVisible = computed({
	get: () => props.visible,
	set: (val: boolean) => emit('update:visible', val),
});

/**
 * 关闭弹窗
 */
const handleClose = () => {
	emit('update:visible', false);
};

/**
 * 保存赋权
 */
const handleSave = () => {
	const result = {
		directAssignRoles: directPreviewList.value,
		finalRoles: finalPreviewList.value,
	};
	emit('save', result);
	ElMessage.success('赋权保存成功！');
	handleClose();
};
</script>

<style lang="scss" scoped>
.auth-dialog :deep(.el-dialog) {
	border-radius: 8px;
	overflow: hidden;
}

.auth-dialog :deep(.el-dialog__header) {
	display: none;
}

.auth-dialog :deep(.el-dialog__body) {
	padding: 0;
}

.user-info-bar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16px 24px;
	background: #fff;
	border-bottom: 1px solid #ebeef5;

	.user-info-left {
		display: flex;
		align-items: center;
		gap: 12px;

		.user-info-text {
			.user-name {
				font-size: 15px;
				font-weight: 600;
				color: #333;
				margin-bottom: 4px;

				.online-badge {
					font-size: 12px;
					color: #00b42a;
					margin-left: 6px;
				}
			}

			.user-desc {
				font-size: 12px;
				color: #909399;
			}
		}
	}

	.user-info-right {
		display: flex;
		gap: 24px;

		.stat-item {
			display: flex;
			align-items: center;
			gap: 6px;
			font-size: 13px;
			color: #606266;

			.el-icon {
				color: #0088ff;
			}
		}
	}
}

.main-content {
	display: flex;
	min-height: 480px;
	background: #f5f7fa;
}

.left-panel {
	width: 50%;
	padding: 20px 24px;
	background: #fff;
	border-right: 1px solid #ebeef5;
	display: flex;
	flex-direction: column;

	.tab-bar {
		display: flex;
		gap: 4px;
		margin-bottom: 12px;

		.tab-item {
			flex: 1;
			height: 36px;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 13px;
			color: #606266;
			background: #f5f7fa;
			border-radius: 6px;
			cursor: pointer;
			transition: all 0.2s;

			&.active {
				background: #0088ff;
				color: #fff;
				font-weight: 500;
			}
		}
	}

	.tab-desc {
		font-size: 12px;
		color: #909399;
		margin-bottom: 16px;
	}

	.role-list {
		flex: 1;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 12px;

		.app-item {
			background: #f9fafc;
			border-radius: 8px;
			overflow: hidden;

			.app-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 12px 16px;
				background: #f0f4f8;
				border-bottom: 1px solid #e8edf2;

				.app-name {
					display: flex;
					align-items: center;
					gap: 6px;
					font-size: 13px;
					font-weight: 500;
					color: #333;

					.app-icon {
						color: #606266;
					}
				}

				.app-right {
					.role-count {
						font-size: 12px;
						color: #0088ff;
					}
				}
			}

			.role-options {
				padding: 12px 16px;
				display: flex;
				flex-direction: column;
				gap: 10px;

				.role-option {
					display: flex;
					align-items: center;
					gap: 8px;
				}
			}
		}
	}

	.bottom-stat {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 16px;
		border-top: 1px solid #ebeef5;
		margin-top: 12px;
		font-size: 12px;
		color: #606266;

		b {
			color: #0088ff;
		}
	}
}

.right-panel {
	width: 50%;
	padding: 20px 24px;
	display: flex;
	flex-direction: column;
	gap: 20px;

	.preview-section {
		display: flex;
		flex-direction: column;

		.preview-title {
			display: flex;
			align-items: center;
			gap: 8px;
			font-size: 13px;
			font-weight: 500;
			color: #333;
			margin-bottom: 12px;

			.tips-tag {
				margin-left: auto;
			}
		}

		.preview-content {
			padding: 16px;
			border-radius: 6px;
			min-height: 120px;
			display: flex;
			flex-wrap: wrap;
			align-content: flex-start;
			gap: 8px;

			&.direct-preview {
				background: #fff;
				border: 1px dashed #ff6b6b;
			}

			&.final-preview {
				background: #fff;
				border: 1px solid #00b42a;
			}

			.preview-tag {
				font-size: 12px;
			}
		}
	}
}
</style>
