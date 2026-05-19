<template>
	<span v-if="displayOnly">
		{{ displayLabel }}
	</span>
	<el-cascader
		v-else
		ref="cascaderRef"
		popper-class="cascaderRef"
		style="width: 100%"
		:model-value="modelValue"
		:options="deptOptions"
		:placeholder="placeholder"
		:props="cascaderProps"
		:disabled="disabled"
		filterable
		clearable
		@update:model-value="handleValueChange"
		@change="handleChange"
	/>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { CascaderInstance } from 'element-plus';
import { deptTree } from '/@/api/admin/dept';

interface DeptOption {
	label: string;
	value: string;
	children?: DeptOption[];
}

const props = withDefaults(defineProps<{
	modelValue?: string | string[];
	placeholder?: string;
	displayOnly?: boolean;
	disabled?: boolean;
}>(), {
	modelValue: ''
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: string | string[]): void;
	(e: 'change', value: string | string[], label: string): void;
}>();

const cascaderRef = ref<CascaderInstance>();
const deptOptions = ref<DeptOption[]>([]);

const cascaderProps = {
	value: 'value',
	label: 'label',
	children: 'children',
	checkStrictly: true,
	emitPath: false,
	expandTrigger: 'hover' as const,
	changeOnSelect: true,
};

const fetchDeptData = async () => {
	try {
		const response = await deptTree();
		if (response.data && Array.isArray(response.data)) {
			deptOptions.value = transformDeptTree(response.data);
		}
	} catch (error) {
		console.error('获取部门列表失败:', error);
	}
};

const transformDeptTree = (tree: any[]): DeptOption[] => {
	return tree.map((node: any) => ({
		label: node.name,
		value: String(node.id),
		children: node.children && node.children.length > 0 ? transformDeptTree(node.children) : undefined,
	}));
};

const handleValueChange = (value: string | string[]) => {
	emit('update:modelValue', value);
};

const handleChange = (value: string | string[]) => {
  cascaderRef.value?.togglePopperVisible(false);
  // 首次改变获取不到lable
  // emit('change', value, displayLabel.value);
  const selectedValue = Array.isArray(value) ? value[value.length - 1] : value;
  const path = findPathByValue(deptOptions.value, String(selectedValue));
  const label = path.map((opt) => opt.label).join(' / ');
  emit('change', value, label);
  
};

const displayLabel = computed(() => {
	if (!props.modelValue) return '';
	const value = Array.isArray(props.modelValue) ? props.modelValue[props.modelValue.length - 1] : props.modelValue;
	const path = findPathByValue(deptOptions.value, String(value));
	return path.map((opt) => opt.label).join(' / ');
});

const findPathByValue = (options: DeptOption[], value: string): DeptOption[] => {
	for (const option of options) {
		if (option.value === value) return [option];
		if (option.children) {
			const childPath = findPathByValue(option.children, value);
			if (childPath.length > 0) {
				return [option, ...childPath];
			}
		}
	}
	return [];
};

onMounted(() => {
	fetchDeptData();
});
</script>
