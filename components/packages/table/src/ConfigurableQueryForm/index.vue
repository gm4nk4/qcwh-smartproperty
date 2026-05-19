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
							<!-- 使用插槽来支持自定义部门选择组件 -->
							<slot name="departmentSelection" :model-value="formData[field.value]" :on-update="(val: any) => formData[field.value] = val">
								<el-input v-model="formData[field.value]" class="condition-value" clearable placeholder="请选择部门" />
							</slot>
						</div>
						<el-input v-else v-model="formData[field.value]" class="condition-value" clearable :placeholder="`请输入${field.label}`"> </el-input>
					</el-form-item>
				</template>

				<!-- 操作按钮 -->
				<el-form-item>
					<el-popover placement="bottom" trigger="hover" :width="200" popper-class="query-form-popover">
						<template #reference>
							<el-button type="primary" plain class="more-options-btn">
								<svg class="btn-icon" viewBox="0 0 1024 1024" width="14" height="14">
									<path
										d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m192 472c0 4.4-3.6 8-8 8H544v152c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V544H328c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8h152V328c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v152h152c4.4 0 8 3.6 8 8v48z"
									/>
								</svg>
								更多选择
							</el-button>
						</template>
						<el-checkbox-group v-model="checkedFields" class="more-options-checkbox-group">
							<el-checkbox v-for="field in fields" :key="field.value" :value="field.value" :label="field.label" />
						</el-checkbox-group>
					</el-popover>
					<el-button type="primary" @click="handleSearch">查询</el-button>
					<el-button @click="handleReset">重置</el-button>
					<slot name="actions"></slot>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, PropType, watch, onMounted } from 'vue';
import { FieldOption } from '../index';

interface FieldConfig extends FieldOption {
	value?: string | number;
	selected?: boolean;
	defaultValue?: any;
	type?: string;
	props?: Record<string, any>;
}

export interface QueryFormConfig {
	fields: FieldConfig[];
	fieldTypes?: Record<string, string>;
	fieldOptions?: Record<string, FieldOption[]>;
	maxConditions?: number;
	initialConditions?: number;
}

const props = defineProps({
	config: {
		type: Object as PropType<QueryFormConfig>,
		required: true,
	},
});

const emit = defineEmits(['search', 'reset']);

const formRef = ref();
const formData = reactive<Record<string, any>>({});
const checkedFields = ref<(string | number)[]>([]);

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

const visibleFields = computed(() => {
	return fields.value.filter((field) => checkedFields.value.includes(field.value));
});

const getFieldType = (fieldValue: string | number): string => {
	const field = fields.value.find((f) => f.value === fieldValue);
	if (field?.type) {
		return field.type;
	}
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

const initFields = () => {
	const initialSelected = fields.value.filter((field) => field.selected).map((field) => field.value);

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

const handleSearch = () => {
	const validData: Record<string, any> = {};
	visibleFields.value.forEach((field) => {
		const value = formData[field.value];
		if (!isEmptyFieldValue(value)) validData[field.value] = value;
	});
	emit('search', validData);
};

const handleReset = () => {
	formRef.value?.resetFields();
	Object.keys(formData).forEach((key) => {
		const field = fields.value.find((f) => f.value === key);
		formData[key] = field ? getFieldInitialValue(field) : undefined;
	});
	emit('reset');
};

watch(
	() => props.config.fields,
	() => {
		initFields();
	}
);

onMounted(() => {
	initFields();
});

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

<style lang="scss" scoped>
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
	height: 32px;
}

.query-form-body :deep(.el-select) {
	height: 32px;
}

.query-form-body :deep(.el-select .el-input__wrapper) {
	height: 32px;
}

.query-form-body :deep(.el-date-editor--daterange) {
	width: 232px;
	max-width: 100%;
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

:deep(.el-input__wrapper),
:deep(.el-textarea__inner) {
	border-radius: 6px;

	&.is-focus {
		box-shadow:
			0px 0px 0px 2px rgba(147, 174, 248, 1) inset,
			0px 0px 0px 3px rgba(32, 95, 243, 1) inset !important;
	}
}

:deep(.el-select__wrapper) {
	border-radius: 6px;

	&.is-focused {
		box-shadow:
			0px 0px 0px 2px rgba(147, 174, 248, 1) inset,
			0px 0px 0px 3px rgba(32, 95, 243, 1) inset !important;
	}
}

:deep(.el-range-editor) {
	&.is-active {
		box-shadow:
			0px 0px 0px 2px rgba(147, 174, 248, 1) inset,
			0px 0px 0px 3px rgba(32, 95, 243, 1) inset !important;
	}
}

:deep(.el-form-item.is-error) {
	.is-focus {
		box-shadow:
			0px 0px 0px 3px rgba(245, 108, 108, 0.5) inset,
			0px 0px 0px 1px rgba(245, 108, 108, 1) inset !important;
	}
}

:deep(.el-button:not(.el-button--text)) {
	height: 32px !important;
	font-size: 12px !important;
}

.more-options-btn {
	display: inline-flex;
	align-items: center;
}

.more-options-btn .btn-icon {
	width: 14px;
	height: 14px;
	margin-right: 4px;
	fill: var(--el-color-primary);
}

.more-options-btn:hover .btn-icon {
	fill: #fff;
}

:deep(.el-popover.el-popper) {
	border: 1px solid var(--layout-shell-border) !important;
	border-radius: 16px !important;
	box-shadow: var(--layout-shell-shadow) !important;
}
:deep(.el-popper.is-pure.is-light) {
	border: 1px solid #e5eaf3 !important;
	border-radius: 8px !important;
	box-shadow: var(--layout-shell-shadow) !important;
}
</style>

<style lang="scss">
.query-form-popover {
	border: 1px solid #e5eaf3 !important;
	border-radius: 8px !important;
	box-shadow: var(--layout-shell-shadow) !important;
}
</style>
