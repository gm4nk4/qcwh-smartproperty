<template>
	<el-dialog
		v-model="dialogVisible"
		:title="isEdit ? '编辑空间' : '新增空间'"
		width="500px"
		:close-on-click-modal="false"
		@close="handleClose"
	>
		<el-form
			ref="formRef"
			:model="formData"
			:rules="formRules"
			label-width="80px"
		>
			<el-form-item label="空间名称" prop="name">
				<el-input
					v-model="formData.name"
					placeholder="请输入空间名称"
				/>
			</el-form-item>
			<el-form-item label="空间编码" prop="code">
				<el-input
					v-model="formData.code"
					placeholder="请输入空间编码"
				/>
			</el-form-item>
			<el-form-item label="空间类型" prop="type">
				<el-select
					v-model="formData.type"
					placeholder="请选择空间类型"
					style="width: 100%"
				>
					<el-option label="项目" value="project"/>
					<el-option label="楼栋" value="building"/>
					<el-option label="楼层" value="floor"/>
					<el-option label="房间" value="room"/>
					<el-option label="公共区域" value="public"/>
				</el-select>
			</el-form-item>
		</el-form>

		<template #footer>
			<el-button @click="handleClose">取消</el-button>
			<el-button type="primary" @click="handleSave">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="SpaceEditDialog">
/**
 * 空间编辑弹窗组件
 * @description 实现空间信息的新增和编辑
 */

import { ref, watch, computed } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import type { SpaceEditDialogProps, SpaceEditDialogEmits, Space, SpaceFormData } from '../type';

// Props
const props = withDefaults(defineProps<SpaceEditDialogProps>(), {
	visible: false,
	spaceInfo: null
});

// Emits
const emit = defineEmits<SpaceEditDialogEmits>();

// 表单引用
const formRef = ref<FormInstance>();

// 对话框显示状态
const dialogVisible = computed({
	get: () => props.visible,
	set: (value) => emit('update:visible', value)
});

// 是否为编辑模式
const isEdit = computed(() => !!props.spaceInfo);

// 表单数据
const formData = ref<SpaceFormData>({
	name: '',
	code: '',
	type: 'project'
});

// 表单校验规则
const formRules: FormRules = {
	name: [
		{ required: true, message: '请输入空间名称', trigger: 'blur' }
	],
	code: [
		{ required: true, message: '请输入空间编码', trigger: 'blur' }
	],
	type: [
		{ required: true, message: '请选择空间类型', trigger: 'change' }
	]
};

/**
 * 重置表单
 */
function resetForm() {
	formData.value = {
		name: '',
		code: '',
		type: 'project'
	};
	formRef.value?.resetFields();
}

/**
 * 初始化表单
 */
function initForm(data: Space) {
	formData.value = {
		name: data.name,
		code: data.code,
		type: data.type,
		parentId: data.parentId
	};
}

/**
 * 监听 spaceInfo 变化
 */
watch(
	() => props.spaceInfo,
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

<style scoped lang="scss">
</style>
