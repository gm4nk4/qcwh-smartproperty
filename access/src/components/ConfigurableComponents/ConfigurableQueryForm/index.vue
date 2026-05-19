<template>
	<div class="query-form">
		<div class="filter-content">
			<el-form :model="formData" inline ref="formRef" class="query-form-body">
				<!-- 查询条件 -->
				<template v-for="(field, index) in visibleFields" :key="index">
					<el-form-item :label="field.label" class="query-form-item">
						<el-select
							v-if="getFieldType(field.value) === 'select'"
							v-model="formData[field.value]"
							v-bind="field.props"
							class="condition-value"
							clearable
							:placeholder="`请选择${field.label}`"
						>
							<el-option v-for="option in fieldOptions[field.value] || []" :key="option.value" :label="option.label" :value="option.value">
							</el-option>
						</el-select>

						<el-cascader
							v-else-if="getFieldType(field.value) === 'cascader'"
							v-model="formData[field.value]"
							:options="fieldOptions[field.value] || []"
							:props="{
								value: 'value',
								label: 'label',
								children: 'children',
								multiple: field.props?.multiple,
								checkStrictly: field.props?.checkStrictly ?? true,
								emitPath: false,
							}"
							v-bind="field.props"
							class="condition-value"
							clearable
							:placeholder="`请选择${field.label}`"
							collapse-tags
							collapse-tags-tooltip
						>
						</el-cascader>

						<el-date-picker
							v-else-if="getFieldType(field.value) === 'date'"
							v-model="formData[field.value]"
							value-format="YYYY-MM-DD"
							class="condition-value"
							type="date"
							clearable
							:placeholder="`请选择${field.label}`"
						>
						</el-date-picker>
						<el-date-picker
							v-else-if="getFieldType(field.value) === 'month'"
							v-model="formData[field.value]"
							value-format="YYYY-MM"
							class="condition-value"
							type="month"
							clearable
							:placeholder="`请选择${field.label}`"
						>
						</el-date-picker>
						<el-date-picker
							v-else-if="getFieldType(field.value) === 'year'"
							v-model="formData[field.value]"
							value-format="YYYY"
							class="condition-value"
							type="year"
							clearable
							:placeholder="`请选择${field.label}`"
						>
						</el-date-picker>

						<el-date-picker
							v-else-if="getFieldType(field.value) === 'daterange'"
							value-format="YYYY-MM-DD"
							v-model="formData[field.value]"
							class="condition-value"
							type="daterange"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							clearable
						>
						</el-date-picker>
						<div v-else-if="getFieldType(field.value) === 'numberrange'" class="number-range-container">
							<el-input-number v-model="formData[field.value][0]" :min="1" :max="9999999999" class="number-range-item" />
							<span class="number-range-sep">至</span>
							<el-input-number v-model="formData[field.value][1]" :min="1" :max="99999999999" class="number-range-item" />
						</div>
						<div v-else-if="getFieldType(field.value) === 'departmentSelection'" class="number-range-container">
							<DepartmentSelection v-model="formData[field.value]" placeholder="请选择部门" />
						</div>
						<el-input v-else v-model="formData[field.value]" class="condition-value" clearable :placeholder="`请输入${field.label}`"> </el-input>
					</el-form-item>
				</template>

				<!-- 操作按钮 -->
				<el-form-item>
					<el-popover placement="bottom" trigger="hover" :width="200">
							<template #reference>
								<el-button type="primary" size="large" :icon="Plus">更多选择</el-button>
							</template>
							<el-checkbox-group v-model="checkedFields" class="more-options-checkbox-group">
								<el-checkbox v-for="field in fields" :key="field.value" :value="field.value" :label="field.label" />
							</el-checkbox-group>
						</el-popover>
					<el-button type="primary" size="large" :icon="Search" @click="handleSearch">查询</el-button>
					<el-button size="large" :icon="Refresh" @click="handleReset">重置</el-button>
					<slot name="actions"></slot>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, PropType, watch, onMounted } from 'vue';
import { Search, Refresh, Plus } from '@element-plus/icons-vue';
import { FieldOption } from '../index';
import DepartmentSelection from '/@/components/DepartmentSelection/index.vue';

interface FieldConfig extends FieldOption {
	value?: string | number;
	selected?: boolean; // 是否默认选中
	defaultValue?: any; // 默认值
	type?: string; // 字段类型
	props?: Record<string, any>; // 新增：用于下拉框等控件的透传属性
}

// 统一配置对象接口
export interface QueryFormConfig {
	fields: FieldConfig[]; // 字段配置
	fieldTypes?: Record<string, string>; // 字段类型映射（可选，向后兼容）
	fieldOptions?: Record<string, FieldOption[]>; // 字段选项映射
	maxConditions?: number; // 最大查询条件数量（可选，默认为字段总数）
	initialConditions?: number; // 初始查询条件数量（可选，默认为selected为true的字段数量）
}

const props = defineProps({
	// 统一配置对象
	config: {
		type: Object as PropType<QueryFormConfig>,
		required: true,
	},
});

const emit = defineEmits(['search', 'reset']);

const formRef = ref();
const formData = reactive<Record<string, any>>({});
const checkedFields = ref<(string | number)[]>([]);

// 解构配置对象，设置默认值
const fields = computed(() => props.config.fields || []);
const fieldTypes = computed(() => props.config.fieldTypes || {});
const fieldOptions = computed(() => props.config.fieldOptions || {});

const isEmptyFieldValue = (value: any) => {
	if (value === undefined || value === null || value === '') return true;
	if (Array.isArray(value)) {
		const validItems = value.filter((item) => item !== undefined && item !== null && item !== '');
		return validItems.length === 0;
	}
	return false;
};

// 计算当前可见的字段
const visibleFields = computed(() => {
	return fields.value.filter((field) => checkedFields.value.includes(field.value));
});

// 获取字段类型
const getFieldType = (fieldValue: string | number): string => {
	// 优先从字段定义中获取类型
	const field = fields.value.find((f) => f.value === fieldValue);
	if (field?.type) {
		return field.type;
	}
	// 向后兼容，从fieldTypes中获取类型
	return fieldTypes.value[fieldValue] || 'text';
};

const getFieldInitialValue = (field: FieldConfig) => {
	const fieldType = getFieldType(field.value);

	if (fieldType === 'numberrange') {
		return field.defaultValue || [undefined, undefined];
	}

	if (fieldType === 'select' && field.props?.multiple === true) {
		return field.defaultValue ?? [];
	}

	if (field.defaultValue !== undefined) {
		return field.defaultValue;
	}

	return undefined;
};

// 初始化查询条件
const initFields = () => {
	// 初始化选中的字段（默认选中的或第一个）
	const initialSelected = fields.value.filter((field) => field.selected).map((field) => field.value);

	// 如果没有默认选中的字段，至少选择第一个
	if (initialSelected.length === 0 && fields.value.length > 0) {
		initialSelected.push(fields.value[0].value);
	}

	checkedFields.value = initialSelected;
	fields.value.forEach((field) => {
		const initialValue = getFieldInitialValue(field);
		if (initialValue !== undefined) {
			formData[field.value] = initialValue;
		}
	});
};

// 搜索
const handleSearch = () => {
	const validData: Record<string, any> = {};
	// 只收集可见字段的值
	visibleFields.value.forEach((field) => {
		const value = formData[field.value];
		if (!isEmptyFieldValue(value)) validData[field.value] = value;
	});
	emit('search', validData);
};

// 重置
const handleReset = () => {
	formRef.value?.resetFields();
	Object.keys(formData).forEach((key) => {
		const field = fields.value.find((f) => f.value === key);
		formData[key] = field ? getFieldInitialValue(field) : undefined;
	});
	emit('reset');
};

// 兼容菜单存在配置动态更新的情况
watch(
	() => props.config.fields,
	() => {
		initFields();
	}
);

// 初始化
onMounted(() => {
	initFields();
});

// 向外暴露方法
defineExpose({
	resetForm: handleReset,
	getFormData: () => {
		const validData: Record<string, any> = {};
		visibleFields.value.forEach((field) => {
			const value = formData[field.value];
			if (!isEmptyFieldValue(value)) validData[field.value] = value;
		});
		return validData;
	},
});
</script>

<style scoped>
.query-form {
	background-color: transparent;
	border-radius: 0;
	border: none;
	margin: 0;
	width: 100%;
	max-width: 100%;
	box-sizing: border-box;
	min-width: 0;
	overflow: visible;
}

.filter-content {
	padding: 0;
	background-color: transparent;
	width: 100%;
	max-width: 100%;
	box-sizing: border-box;
	overflow: visible;
}

.query-form-body {
	display: flex;
	flex-wrap: wrap;
	align-items: flex-start;
	column-gap: 20px;
	row-gap: 10px;
	width: 100%;
	max-width: 100%;
}

.query-form-item {
	flex: 0 1 auto;
	max-width: none;
	min-width: 0;
	box-sizing: border-box;
}

.query-form-body :deep(.el-form-item) {
	/* 组件内部已改为 flex + row-gap 布局，这里要覆盖全局 inline-form 对最后一项的 margin-bottom 补丁，避免末项视觉上被抬高 */
	margin-bottom: 0 !important;
	margin-right: 0;
	align-items: center;
}

.query-form-body :deep(.el-form-item__label) {
	display: inline-flex;
	align-items: center;
	padding-right: 12px;
	line-height: 32px;
	color: #4b5563;
}

.query-form-body :deep(.el-form-item__content) {
	width: auto;
	min-width: 0;
}

.query-form-body :deep(.condition-value) {
	width: 180px;
	max-width: 100%;
	height: 40px;
}

.query-form-body :deep(.el-select) {
	height: 40px;
}

.query-form-body :deep(.el-select .el-input__wrapper) {
	height: 40px;
}

.query-form-body :deep(.el-date-editor--daterange) {
	width: 240px;
	max-width: 100%;
}

@media screen and (max-width: 1200px) {
	.query-form-body :deep(.condition-value) {
		width: 168px;
	}
}

@media screen and (max-width: 768px) {
	.filter-content {
		padding: 0;
	}

	.query-form-body {
		row-gap: 12px;
	}

	.query-form-item {
		width: 100%;
	}

	.query-form-body :deep(.el-form-item) {
		display: flex;
		align-items: center;
	}

	.query-form-body :deep(.el-form-item__content) {
		flex: 1;
		min-width: 0;
	}

	.query-form-body :deep(.condition-value),
	.query-form-body :deep(.el-date-editor--daterange) {
		width: 100%;
	}
}

.number-range-container {
	display: flex;
	align-items: center;
	gap: 8px;
	width: 100%;
}

.number-range-item {
	flex: 1;
}

.number-range-sep {
	color: #909399;
	font-size: 14px;
}

.more-options-checkbox-group {
	display: flex;
	flex-direction: column;
	gap: 8px;
}
</style>
