<template>
	<el-dialog v-model="dialogVisible" :title="isEdit ? '编辑部门' : '新增部门'" width="500px" :close-on-click-modal="false" @close="handleClose">
		<el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px">
			<el-form-item label="部门名称" prop="name">
				<el-input v-model="formData.name" placeholder="请输入部门名称" />
			</el-form-item>
			<el-form-item label="负责人" prop="manager">
				<el-input v-model="formData.manager" placeholder="请输入负责人" />
			</el-form-item>
			<el-form-item label="职务" prop="position">
				<el-input v-model="formData.position" placeholder="请输入职务" />
			</el-form-item>
		</el-form>

		<template #footer>
			<el-button @click="handleClose">取消</el-button>
			<el-button type="primary" @click="handleSave">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="OrgEditDialog">
/**
 * 组织编辑弹窗组件
 * @description 实现组织信息的新增和编辑
 */

import { ref, watch, computed } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import type { OrgEditDialogProps, OrgEditDialogEmits, Organization, OrgFormData } from '../type';

// Props
const props = withDefaults(defineProps<OrgEditDialogProps>(), {
	visible: false,
	orgInfo: null,
});

// Emits
const emit = defineEmits<OrgEditDialogEmits>();

// 表单引用
const formRef = ref<FormInstance>();

// 对话框显示状态
const dialogVisible = computed({
	get: () => props.visible,
	set: (value) => emit('update:visible', value),
});

// 是否为编辑模式
const isEdit = computed(() => !!props.orgInfo);

// 表单数据
const formData = ref<OrgFormData>({
	name: '',
	manager: '',
	position: '',
});

// 表单校验规则
const formRules: FormRules = {
	name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
	manager: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
	position: [{ required: true, message: '请输入职务', trigger: 'blur' }],
};

/**
 * 重置表单
 */
function resetForm() {
	formData.value = {
		name: '',
		manager: '',
		position: '',
	};
	formRef.value?.resetFields();
}

/**
 * 初始化表单
 */
function initForm(data: Organization) {
	formData.value = {
		name: data.name,
		manager: data.manager,
		position: data.position,
		parentId: data.parentId,
	};
}

/**
 * 监听 orgInfo 变化
 */
watch(
	() => props.orgInfo,
	(val) => {
		if (val) {
			initForm(val);
		} else {
			resetForm();
		}
	},
	{ immediate: true }
);

/**
 * 关闭弹窗
 */
const handleClose = () => {
	dialogVisible.value = false;
	resetForm();
};

/**
 * 保存
 */
const handleSave = async () => {
	await formRef.value?.validate((valid) => {
		if (valid) {
			emit('save', { ...formData.value });
			handleClose();
		}
	});
};
</script>

<style scoped lang="scss"></style>
