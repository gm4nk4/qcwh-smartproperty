<template>
	<el-dialog v-model="dialogVisible" :title="dialogTitle" width="900px" class="role-assign-dialog" :close-on-click-modal="false" destroy-on-close>
		<div class="assign-container">
			<div class="panel">
				<div class="panel-header">
					<span class="panel-title">可选用户 ({{ filteredAvailableUsers.length }})</span>
				</div>
				<div class="panel-search">
					<el-input v-model="availableSearchText" placeholder="请输入用户名称" prefix-icon="Search" clearable size="small" />
				</div>
				<div class="panel-content">
					<el-checkbox-group v-model="selectedAvailableIds">
						<div v-for="user in filteredAvailableUsers" :key="user.id" class="user-item">
							<el-checkbox :value="user.id" class="user-checkbox">
								<div class="user-info">
									<span class="user-name">{{ user.name }}</span>
									<span v-if="user.code" class="user-code">{{ user.code }}</span>
									<span v-if="user.department" class="user-department">{{ user.department }}</span>
								</div>
							</el-checkbox>
						</div>
					</el-checkbox-group>
				</div>
			</div>
			<div class="panel-actions">
				<el-button type="primary" size="small" :icon="ArrowRight" :disabled="selectedAvailableIds.length === 0" @click="moveToAssigned" />
				<el-button type="primary" size="small" :icon="ArrowLeft" :disabled="selectedAssignedIds.length === 0" @click="moveToAvailable" />
			</div>
			<div class="panel">
				<div class="panel-header">
					<span class="panel-title">已分配用户 ({{ filteredAssignedUsers.length }})</span>
				</div>
				<div class="panel-search">
					<el-input v-model="assignedSearchText" placeholder="请输入用户名称" prefix-icon="Search" clearable size="small" />
				</div>
				<div class="panel-content">
					<el-checkbox-group v-model="selectedAssignedIds">
						<div v-for="user in filteredAssignedUsers" :key="user.id" class="user-item">
							<el-checkbox :value="user.id" class="user-checkbox">
								<div class="user-info">
									<span class="user-name">{{ user.name }}</span>
									<span v-if="user.code" class="user-code">{{ user.code }}</span>
									<span v-if="user.department" class="user-department">{{ user.department }}</span>
								</div>
							</el-checkbox>
						</div>
					</el-checkbox-group>
				</div>
			</div>
		</div>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="handleCancel">取消</el-button>
				<el-button type="primary" @click="handleSave"> 确认分配 </el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
/**
 * 角色分配对话框组件
 * @description 用于为角色分配用户
 */

import { ref, computed, watch } from 'vue';
import { ArrowRight, ArrowLeft } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { RoleAssignDialogProps, RoleAssignDialogEmits, UserItem } from '../type';
import { mockAvailableUsers, mockAssignedUsers } from '../mock';

const props = defineProps<RoleAssignDialogProps>();
const emit = defineEmits<RoleAssignDialogEmits>();

/**
 * 对话框标题
 */
const dialogTitle = computed(() => {
	return props.roleInfo ? `角色分配 - ${props.roleInfo.roleName}` : '角色分配';
});

/**
 * 对话框可见性
 */
const dialogVisible = computed({
	get: () => props.visible,
	set: (val) => emit('update:visible', val),
});

/**
 * 可选用户列表
 */
const availableUsers = ref<UserItem[]>([]);

/**
 * 已分配用户列表
 */
const assignedUsers = ref<UserItem[]>([]);

/**
 * 选中的可选用户ID
 */
const selectedAvailableIds = ref<number[]>([]);

/**
 * 选中的已分配用户ID
 */
const selectedAssignedIds = ref<number[]>([]);

/**
 * 可选用户搜索文本
 */
const availableSearchText = ref('');

/**
 * 已分配用户搜索文本
 */
const assignedSearchText = ref('');

/**
 * 过滤后的可选用户列表
 */
const filteredAvailableUsers = computed(() => {
	if (!availableSearchText.value) return availableUsers.value;
	return availableUsers.value.filter((user) => user.name.includes(availableSearchText.value));
});

/**
 * 过滤后的已分配用户列表
 */
const filteredAssignedUsers = computed(() => {
	if (!assignedSearchText.value) return assignedUsers.value;
	return assignedUsers.value.filter((user) => user.name.includes(assignedSearchText.value));
});

/**
 * 初始化数据
 */
const initData = () => {
	availableUsers.value = JSON.parse(JSON.stringify(mockAvailableUsers));
	assignedUsers.value = JSON.parse(JSON.stringify(mockAssignedUsers));
	selectedAvailableIds.value = [];
	selectedAssignedIds.value = [];
	availableSearchText.value = '';
	assignedSearchText.value = '';
};

/**
 * 将选中的用户移到已分配
 */
const moveToAssigned = () => {
	const selectedUsers = availableUsers.value.filter((user) => selectedAvailableIds.value.includes(user.id));
	assignedUsers.value = [...assignedUsers.value, ...selectedUsers];
	availableUsers.value = availableUsers.value.filter((user) => !selectedAvailableIds.value.includes(user.id));
	selectedAvailableIds.value = [];
};

/**
 * 将选中的用户移到可选
 */
const moveToAvailable = () => {
	const selectedUsers = assignedUsers.value.filter((user) => selectedAssignedIds.value.includes(user.id));
	availableUsers.value = [...availableUsers.value, ...selectedUsers];
	assignedUsers.value = assignedUsers.value.filter((user) => !selectedAssignedIds.value.includes(user.id));
	selectedAssignedIds.value = [];
};

/**
 * 取消操作
 */
const handleCancel = () => {
	dialogVisible.value = false;
};

/**
 * 保存操作
 */
const handleSave = () => {
	emit('save', {
		assignedUsers: assignedUsers.value,
	});
	ElMessage.success('分配成功');
	dialogVisible.value = false;
};

/**
 * 监听 visible 变化
 */
watch(
	() => props.visible,
	(val) => {
		if (val) {
			initData();
		}
	}
);
</script>

<style scoped lang="scss">
.role-assign-dialog {
	:deep(.el-dialog__header) {
		margin: 0;
		padding: 16px 24px;
		border-bottom: 1px solid #e5e7eb;
		background: linear-gradient(135deg, #0088ff 0%, #0066cc 100%);

		.el-dialog__title {
			color: #ffffff;
			font-size: 16px;
			font-weight: 600;
		}

		.el-dialog__headerbtn {
			.el-dialog__close {
				color: #ffffff;

				&:hover {
					color: #f3f4f6;
				}
			}
		}
	}

	:deep(.el-dialog__body) {
		padding: 20px 24px;
	}

	:deep(.el-dialog__footer) {
		padding: 16px 24px;
		border-top: 1px solid #e5e7eb;
	}
}

.assign-container {
	display: flex;
	gap: 16px;
	height: 450px;
}

.panel {
	flex: 1;
	display: flex;
	flex-direction: column;
	border: 1px solid #e5e7eb;
	border-radius: 8px;
	overflow: hidden;
	background: #ffffff;

	.panel-header {
		padding: 12px 16px;
		background: #f9fafb;
		border-bottom: 1px solid #e5e7eb;

		.panel-title {
			font-size: 14px;
			font-weight: 500;
			color: #374151;
		}
	}

	.panel-search {
		padding: 8px 12px;
		border-bottom: 1px solid #e5e7eb;
	}

	.panel-content {
		flex: 1;
		overflow-y: auto;
		padding: 8px;
	}
}

.panel-actions {
	display: flex;
	flex-direction: column;
	gap: 8px;
	justify-content: center;
}

.user-item {
	padding: 8px 12px;
	border-radius: 4px;
	transition: background-color 0.2s;

	&:hover {
		background-color: #f3f4f6;
	}

	.user-checkbox {
		width: 100%;

		:deep(.el-checkbox__label) {
			width: 100%;
		}
	}

	.user-info {
		display: flex;
		flex-direction: column;
		gap: 2px;

		.user-name {
			font-size: 14px;
			color: #374151;
			font-weight: 500;
		}

		.user-code {
			font-size: 12px;
			color: #9ca3af;
		}

		.user-department {
			font-size: 12px;
			color: #9ca3af;
		}
	}
}

.dialog-footer {
	display: flex;
	justify-content: center;
	gap: 12px;
}
</style>
