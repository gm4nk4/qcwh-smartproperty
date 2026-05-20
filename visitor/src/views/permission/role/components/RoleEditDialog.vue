<template>
	<el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" class="role-edit-dialog" :close-on-click-modal="false" destroy-on-close>
		<el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
			<el-form-item label="角色名称" prop="roleName">
				<el-input v-model="formData.roleName" placeholder="请输入角色名称" clearable />
			</el-form-item>
			<el-form-item label="角色编码" prop="roleCode">
				<el-input v-model="formData.roleCode" placeholder="请输入角色编码" clearable />
			</el-form-item>
			<el-form-item label="说明" prop="description">
				<el-input v-model="formData.description" type="textarea" :rows="4" placeholder="请输入说明" />
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="handleCancel">取消</el-button>
				<el-button type="primary" @click="handleSave"> 确定 </el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
/**
 * 角色编辑对话框组件
 * @description 用于新增和编辑子应用角色
 */

import { ref, reactive, computed, watch } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import type { RoleEditDialogProps, RoleEditDialogEmits, Role } from '../type';

const props = defineProps<RoleEditDialogProps>();
const emit = defineEmits<RoleEditDialogEmits>();

const formRef = ref<FormInstance>();

/**
 * 对话框标题
 */
const dialogTitle = computed(() => {
	return props.roleInfo ? '编辑角色' : '新增角色';
});

/**
 * 对话框可见性
 */
const dialogVisible = computed({
	get: () => props.visible,
	set: (val) => emit('update:visible', val),
});

/**
 * 表单数据
 */
const formData = reactive({
	roleName: '',
	roleCode: '',
	description: '',
});

/**
 * 表单验证规则
 */
const formRules: FormRules = {
	roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
	roleCode: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
};

/**
 * 初始化表单数据
 */
const initFormData = () => {
	if (props.roleInfo) {
		formData.roleName = props.roleInfo.roleName;
		formData.roleCode = props.roleInfo.roleCode;
		formData.description = props.roleInfo.description;
	} else {
		formData.roleName = '';
		formData.roleCode = '';
		formData.description = '';
	}
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
const handleSave = async () => {
	if (!formRef.value) return;
	await formRef.value.validate((valid) => {
		if (valid) {
			emit('save', {
				...formData,
				id: props.roleInfo?.id,
			});
			ElMessage.success(props.roleInfo ? '编辑成功' : '新增成功');
			dialogVisible.value = false;
		}
	});
};

/**
 * 监听 visible 变化
 */
watch(
	() => props.visible,
	(val) => {
		if (val) {
			initFormData();
		}
	}
);
</script>

<style scoped lang="scss">
.role-edit-dialog {
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
		padding: 24px;
	}

	:deep(.el-dialog__footer) {
		padding: 16px 24px;
		border-top: 1px solid #e5e7eb;
	}
}

.dialog-footer {
	display: flex;
	justify-content: center;
	gap: 12px;
}
</style>
