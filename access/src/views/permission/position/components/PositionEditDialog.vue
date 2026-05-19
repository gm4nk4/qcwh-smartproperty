<template>
	<el-dialog
		v-model="dialogVisible"
		:title="dialogTitle"
		width="600px"
		class="position-edit-dialog"
		:close-on-click-modal="false"
		destroy-on-close
	>
		<!-- 表单区域 -->
		<el-form
			ref="formRef"
			:model="formData"
			:rules="formRules"
			label-width="100px"
			class="position-form"
		>
			<el-form-item label="岗位名称" prop="positionName">
				<el-input
					v-model="formData.positionName"
					placeholder="请输入岗位名称"
				/>
			</el-form-item>

			<el-form-item label="岗位编码" prop="positionCode">
				<el-input
					v-model="formData.positionCode"
					placeholder="请输入岗位编码"
				/>
			</el-form-item>

			<el-form-item label="所属部门" prop="department">
				<el-select
					v-model="formData.department"
					placeholder="请选择部门"
					style="width: 100%"
				>
					<el-option
						v-for="dept in departmentOptions"
						:key="dept.id"
						:label="dept.name"
						:value="dept.name"
					/>
				</el-select>
			</el-form-item>

			<el-form-item label="岗位描述" prop="description">
				<el-input
					v-model="formData.description"
					type="textarea"
					:rows="4"
					placeholder="请输入岗位描述"
				/>
			</el-form-item>
		</el-form>

		<!-- 底部按钮 -->
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="handleCancel">取消</el-button>
				<el-button type="primary" @click="handleSave">保存</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="PositionEditDialog">
/**
 * 岗位编辑弹窗组件
 * @description 实现岗位的新增和编辑功能
 */

import { ref, computed, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import type { PositionEditDialogProps, PositionEditDialogEmits, Position, PositionFormData, Department } from '../type';
import { mockDepartments } from '../mock';

const props = defineProps<PositionEditDialogProps>();
const emit = defineEmits<PositionEditDialogEmits>();

// 表单引用
const formRef = ref<FormInstance>();

// 部门选项
const departmentOptions = ref<Department[]>(mockDepartments);

// 对话框标题
const dialogTitle = computed(() => {
	return props.positionInfo ? '编辑岗位' : '新增岗位';
});

// 对话框可见性
const dialogVisible = computed({
	get: () => props.visible,
	set: (val) => emit('update:visible', val)
});

// 表单数据
const formData = ref<PositionFormData>({
	positionName: '',
	positionCode: '',
	department: '',
	description: ''
});

// 表单校验规则
const formRules = ref<FormRules>({
	positionName: [
		{ required: true, message: '请输入岗位名称', trigger: 'blur' },
		{ min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
	],
	positionCode: [
		{ required: true, message: '请输入岗位编码', trigger: 'blur' },
		{ pattern: /^[A-Za-z0-9-]+$/, message: '只能包含字母、数字和横线', trigger: 'blur' }
	],
	department: [
		{ required: true, message: '请选择部门', trigger: 'change' }
	],
	description: [
		{ max: 200, message: '最多输入200个字符', trigger: 'blur' }
	]
});

/**
 * 重置表单
 */
const resetForm = () => {
	formData.value = {
		positionName: '',
		positionCode: '',
		department: '',
		description: ''
	};
	formRef.value?.clearValidate();
};

/**
 * 处理取消
 */
const handleCancel = () => {
	dialogVisible.value = false;
};

/**
 * 处理保存
 */
const handleSave = async () => {
	if (!formRef.value) return;
	
	await formRef.value.validate((valid) => {
		if (valid) {
			emit('save', { ...formData.value });
			dialogVisible.value = false;
		}
	});
};

// 监听 positionInfo 变化，初始化表单
watch(
	() => props.positionInfo,
	(val) => {
		if (val) {
			formData.value = {
				positionName: val.positionName,
				positionCode: val.positionCode,
				department: val.department,
				description: val.description
			};
		} else {
			resetForm();
		}
	},
	{ immediate: true, deep: true }
);
</script>

<style scoped lang="scss">
.position-edit-dialog {
	:deep(.el-dialog__header) {
		margin: 0;
		padding: 20px 24px;
		border-bottom: 1px solid #e5e7eb;
		background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);

		.el-dialog__title {
			color: #ffffff;
			font-size: 16px;
			font-weight: 600;
		}

		.el-dialog__headerbtn {
			.el-dialog__close {
				color: #ffffff;

				&:hover {
					color: #f0f7ff;
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

	.position-form {
		// 表单样式保持默认
	}

	.dialog-footer {
		display: flex;
		justify-content: center;
		gap: 12px;

		.el-button {
			min-width: 100px;
		}
	}
}
</style>
