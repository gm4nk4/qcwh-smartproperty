<template>
	<!-- 重置密码弹窗 -->
	<el-dialog v-model="dialogVisible" width="600px" :close-on-click-modal="false" class="user-reset-pwd-dialog" title="重置密码" @close="handleClose">
		<el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
			<div class="user-info-display">
				<div class="user-avatar">
					<el-avatar :size="80" :src="props.userInfo?.avatar">
						{{ props.userInfo?.userName?.charAt(0) }}
					</el-avatar>
				</div>
				<div class="user-details">
					<div class="user-name">{{ props.userInfo?.userName }}</div>
					<div class="user-id">{{ props.userInfo?.deptName }} · {{ props.userInfo?.userId }}</div>
				</div>
			</div>
			<el-form-item label="新密码" prop="newPassword">
				<el-input v-model="formData.newPassword" type="password" placeholder="请输入新密码（至少6位）" show-password />
			</el-form-item>
			<el-form-item label="确认密码" prop="confirmPassword">
				<el-input v-model="formData.confirmPassword" type="password" placeholder="请再次输入新密码" show-password />
			</el-form-item>
		</el-form>
		<div class="notice-box">
			<el-alert type="warning" :closable="false">
				<p>重置后用户密码将被修改为指定新密码，请通知用户及时修改密码。</p>
			</el-alert>
		</div>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="handleClose">取消</el-button>
				<el-button type="primary" @click="handleSave">确认重置</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import type { UserResetPwdDialogProps, UserResetPwdDialogEmits, UserResetPwdFormData } from './type';

const props = defineProps<UserResetPwdDialogProps>();
const emit = defineEmits<UserResetPwdDialogEmits>();

const formRef = ref<FormInstance>();

const defaultFormData: UserResetPwdFormData = {
	newPassword: '',
	confirmPassword: '',
};

const formData = ref<UserResetPwdFormData>({ ...defaultFormData });

const validateConfirmPassword = (rule: any, value: any, callback: any) => {
	if (value === '') {
		callback(new Error('请再次输入密码'));
	} else if (value !== formData.value.newPassword) {
		callback(new Error('两次输入的密码不一致'));
	} else {
		callback();
	}
};

const rules: FormRules<UserResetPwdFormData> = {
	newPassword: [
		{ required: true, message: '请输入新密码', trigger: 'blur' },
		{ min: 6, message: '密码长度至少为6位', trigger: 'blur' },
	],
	confirmPassword: [{ required: true, validator: validateConfirmPassword, trigger: 'blur' }],
};

const dialogVisible = computed({
	get: () => props.visible,
	set: (val: boolean) => emit('update:visible', val),
});

watch(
	() => props.visible,
	(val) => {
		if (!val) {
			formData.value = { ...defaultFormData };
			formRef.value?.resetFields();
		}
	}
);

function handleClose() {
	emit('update:visible', false);
	formRef.value?.resetFields();
}

function handleSave() {
	formRef.value?.validate((valid) => {
		if (valid) {
			emit('save', { ...formData.value });
			ElMessage.success('密码重置成功');
			handleClose();
		}
	});
}
</script>

<style lang="scss" scoped>
.user-reset-pwd-dialog :deep(.el-dialog) {
	border-radius: 12px;
	overflow: hidden;
}

.user-reset-pwd-dialog :deep(.el-dialog__header) {
	background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
	padding: 16px 20px;
}

.user-reset-pwd-dialog :deep(.el-dialog__title) {
	color: white;
	font-size: 16px;
	font-weight: 500;
}

.user-reset-pwd-dialog :deep(.el-dialog__headerbtn .el-dialog__close) {
	color: white;
}

.user-reset-pwd-dialog :deep(.el-dialog__body) {
	padding: 24px 20px;
}

.user-reset-pwd-dialog :deep(.el-dialog__footer) {
	padding: 16px 20px;
}

.user-info-display {
	display: flex;
	align-items: center;
	gap: 16px;
	padding: 20px;
	background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
	border-radius: 12px;
	margin-bottom: 24px;
	border: 1px solid #e2e8f0;
}

.user-avatar {
	flex-shrink: 0;
}

.user-details {
	flex: 1;
}

.user-name {
	font-size: 18px;
	font-weight: 600;
	color: #1e293b;
	margin-bottom: 4px;
}

.user-id {
	font-size: 13px;
	color: #64748b;
}

.notice-box {
	margin-top: 16px;
}

.dialog-footer {
	display: flex;
	justify-content: center;
	gap: 12px;
}
</style>
