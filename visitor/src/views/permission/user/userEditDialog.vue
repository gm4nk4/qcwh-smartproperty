<template>
	<!-- 用户编辑弹窗 -->
	<el-dialog
		v-model="dialogVisible"
		width="1000px"
		:close-on-click-modal="false"
		class="user-edit-dialog"
		:title="props.userInfo ? '编辑用户' : '添加用户'"
		@close="handleClose"
	>
		<el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
			<el-form-item label="姓名" prop="userName">
				<el-input v-model="formData.userName" placeholder="请输入姓名" />
			</el-form-item>
			<el-form-item label="手机号码" prop="phone">
				<el-input v-model="formData.phone" placeholder="请输入手机号码" />
				<div class="form-tip">手机号码将用于系统登录使用</div>
			</el-form-item>
			<el-form-item label="所属部门" prop="deptName">
				<el-select v-model="formData.deptName" placeholder="请选择所属部门" style="width: 100%">
					<el-option label="信息技术部" value="信息技术部" />
					<el-option label="产品部" value="产品部" />
					<el-option label="运营部" value="运营部" />
					<el-option label="财务部" value="财务部" />
				</el-select>
			</el-form-item>
			<el-form-item label="岗位标签">
				<el-select v-model="formData.postTags" placeholder="请选择岗位标签" style="width: 100%" multiple>
					<el-option label="产品经理" value="产品经理" />
					<el-option label="前端工程师" value="前端工程师" />
					<el-option label="后端工程师" value="后端工程师" />
					<el-option label="UI设计师" value="UI设计师" />
				</el-select>
			</el-form-item>
			<el-form-item label="电子邮箱">
				<el-input v-model="formData.email" placeholder="请输入电子邮箱" />
			</el-form-item>
		</el-form>
		<div class="notice-box">
			<el-alert type="warning" :closable="false">
				<p>1. 初始账号密码按照系统管理中生成统一密码。</p>
				<p>2. 用户创建后通过「用户赋权」进行用户授权操作。</p>
			</el-alert>
		</div>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="handleClose">取消</el-button>
				<el-button type="primary" @click="handleSave">保存</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import type { UserEditDialogProps, UserEditDialogEmits, UserEditFormData } from './type';

const props = defineProps<UserEditDialogProps>();
const emit = defineEmits<UserEditDialogEmits>();

const formRef = ref<FormInstance>();

const defaultFormData: UserEditFormData = {
	userName: '',
	phone: '',
	deptName: '',
	postTags: [],
	email: '',
};

const formData = ref<UserEditFormData>({ ...defaultFormData });

const rules: FormRules<UserEditFormData> = {
	userName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
	phone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
	deptName: [{ required: true, message: '请选择所属部门', trigger: 'change' }],
};

const dialogVisible = computed({
	get: () => props.visible,
	set: (val: boolean) => emit('update:visible', val),
});

watch(
	() => props.visible,
	(val) => {
		if (val && props.userInfo) {
			formData.value = { ...props.userInfo };
		} else if (!val) {
			formData.value = { ...defaultFormData };
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
			ElMessage.success('保存成功');
			handleClose();
		}
	});
}
</script>

<style lang="scss" scoped>
.user-edit-dialog :deep(.el-dialog) {
	border-radius: 8px;
	overflow: hidden;
}

.user-edit-dialog :deep(.el-dialog__header) {
	background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
	padding: 16px 20px;
}

.user-edit-dialog :deep(.el-dialog__title) {
	color: white;
	font-size: 16px;
	font-weight: 500;
}

.user-edit-dialog :deep(.el-dialog__headerbtn .el-dialog__close) {
	color: white;
}

.user-edit-dialog :deep(.el-dialog__body) {
	padding: 24px 20px;
}

.user-edit-dialog :deep(.el-dialog__footer) {
	padding: 16px 20px;
}

.form-tip {
	font-size: 12px;
	color: #8c8c8c;
	margin-top: 4px;
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
