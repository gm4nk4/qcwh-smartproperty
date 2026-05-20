<template>
	<!-- 用户详情弹窗 -->
	<el-dialog v-model="dialogVisible" width="1000px" :close-on-click-modal="false" class="user-detail-dialog" title="用户详情" @close="handleClose">
		<!-- 左右分栏布局 -->
		<div class="user-detail-content">
			<UserInfoPanel :user-info="userInfo" :login-logs="loginLogs" />
			<PermissionPanel :platform-roles="platformRoles" :sub-app-permissions="subAppPermissions" />
		</div>
		<!-- 底部按钮 -->
		<div class="dialog-footer">
			<el-button @click="handleClose">关闭</el-button>
			<el-button type="primary" @click="handleAssign">赋权</el-button>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
/**
 * @component UserDetailDialog
 * @description 用户详情弹窗组件
 * @props visible - 控制弹窗显示/隐藏
 * @emits update:visible - 关闭弹窗时触发
 * @emits assign - 点击赋权按钮时触发
 */
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import type { UserDetailDialogProps, UserDetailDialogEmits, UserInfo, LoginLog, PlatformRole, SubAppPermission } from './type';
import { mockUserInfo, mockLoginLogs, mockPlatformRoles, mockSubAppPermissions } from './mock';
import UserInfoPanel from './components/UserInfoPanel.vue';
import PermissionPanel from './components/PermissionPanel.vue';

const props = defineProps<UserDetailDialogProps>();
const emit = defineEmits<UserDetailDialogEmits>();

/**
 * 双向绑定控制弹窗显示/隐藏
 */
const dialogVisible = computed({
	get: () => props.visible,
	set: (val: boolean) => emit('update:visible', val),
});

/**
 * 用户基本信息
 */
const userInfo = ref<UserInfo>(mockUserInfo);

/**
 * 用户登录日志
 */
const loginLogs = ref<LoginLog[]>(mockLoginLogs);

/**
 * 平台角色列表
 */
const platformRoles = ref<PlatformRole[]>(mockPlatformRoles);

/**
 * 子应用权限列表
 */
const subAppPermissions = ref<SubAppPermission[]>(mockSubAppPermissions);

/**
 * 关闭弹窗处理函数
 */
function handleClose(): void {
	emit('update:visible', false);
}

/**
 * 赋权按钮点击处理函数
 */
function handleAssign(): void {
	emit('assign');
	ElMessage.success('赋权功能已触发，请稍后...');
}
</script>

<style lang="scss" scoped>
.user-detail-dialog :deep(.el-dialog) {
	border-radius: 8px;
	overflow: hidden;
}

.user-detail-dialog :deep(.el-dialog__header) {
	display: none;
}

.user-detail-dialog :deep(.el-dialog__body) {
	padding: 0;
}

.dialog-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 56px;
	padding: 0 20px;
	background: linear-gradient(135deg, #0088ff 0%, #00a0ff 100%);
	color: #fff;

	.dialog-title {
		font-size: 16px;
		font-weight: 600;
	}

	.close-btn {
		color: #fff;
		padding: 0;
	}
}

.user-detail-content {
	display: flex;
	min-height: 500px;
}

.dialog-footer {
	display: flex;
	justify-content: center;
	gap: 12px;
	padding: 16px 20px 0 20px;
	border-top: 1px solid #ebeef5;
	background: #fff;
}
</style>
