<template>
	<div class="ai-alarm-container layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<div class="space-management">
				<!-- 搜索栏 -->
				<div class="search-bar">
					<el-form-item label="空间名称" prop="spaceName">
						<el-input v-model="searchForm.spaceName" placeholder="请输入空间名称" style="width: 200px" clearable />
						<el-button style="margin-left: 8px" type="primary" icon="search" @click="handleSearch"
							:loading="loading">查询</el-button>
						<el-button @click="resetQuery" icon="Refresh" :loading="loading">重置</el-button>
					</el-form-item>
					<el-form-item>
						<el-button v-auth="'platform_space_add'" type="primary" @click="handleAdd" icon="folder-add">新增</el-button>
						<el-button @click="toggleExpandAll">{{ isExpandAll ? '折叠' : '展开' }}</el-button>
					</el-form-item>
				</div>

				<!-- 表格 -->
				<el-table :data="tableData" ref="tableRef" row-key="id" :tree-props="{ children: 'children' }"
					v-loading="loading" :default-expand-all="isExpandAll" border style="margin-top: 20px">
					<el-table-column prop="name" label="空间名称" min-width="200" />
					<el-table-column prop="weight" label="排序" width="100" align="center" />
					<el-table-column prop="deviceNum" label="监控数量" width="120" align="center">
						<template #default="{ row }">
							<el-link type="primary">{{ row.deviceNum }}</el-link>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="200" align="center" fixed="right">
						<template #default="{ row }">
							<el-button v-auth="'platform_space_add'"  v-if="row.name !== '未分组'" style="color: rgb(43, 70, 226)" link size="small"
								@click="handleEdit(row)"> 新增 </el-button>
							<el-button v-auth="'platform_space_edit'" style="color: rgb(43, 70, 226)" link size="small" @click="handleModify(row)"> 修改
							</el-button>
							<el-button v-auth="'platform_space_del'" v-if="row.name !== '未分组'" style="color: rgb(43, 70, 226)" link size="small"
								@click="handleDelete(row)"> 删除 </el-button>
						</template>
					</el-table-column>
				</el-table>

				<!-- 新增/编辑弹窗 -->
				<el-dialog v-model="dialogVisible" :title="dialogTitle" width="40%" :before-close="handleDialogClose">
					<el-form ref="formRef" :model="formData" :rules="formRules" label-position="right"
						label-width="120px">
						<el-form-item label="空间名称" prop="spaceName">
							<el-input v-model="formData.spaceName" placeholder="请输入空间名称" />
						</el-form-item>
						<el-form-item label="父级空间" prop="parentId">
							<el-cascader v-model="formData.parentId" :options="cascaderData" :props="{
								value: 'id',
								label: 'name',
								children: 'children',
								checkStrictly: true,
								emitPath: false,
							}" placeholder="请选择父级空间" clearable style="width: 100%" />
						</el-form-item>
						<el-form-item label="排序" prop="seq">
							<el-input-number v-model="formData.seq" :min="1" :max="9999" placeholder="请输入排序"
								style="width: 100%" />
						</el-form-item>
					</el-form>
					<template #footer>
						<el-button @click="handleDialogClose">取消</el-button>
						<el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
					</template>
				</el-dialog>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';
import type { ElTable } from 'element-plus';
import { fetchSpaceList, deleteSpaceById, addSpace, updateSpace, type ISpaceRecord, type ISpaceQuery } from '/@/api/set/operation/space/index';

// 定义树形选择器数据类型
interface TreeSelectOption {
	id: number | string;
	name: string;
	children?: TreeSelectOption[];
}

// 响应式数据
const tableData = ref<ISpaceRecord[]>([]);
const isExpandAll = ref(true);
const dialogVisible = ref(false);
const submitLoading = ref(false);
const formRef = ref<FormInstance>();
const loading = ref(false);

const tableRef = ref<InstanceType<typeof ElTable>>();

// 搜索表单
const searchForm = reactive({
	spaceName: '',
});

// 表单数据
const formData = reactive<ISpaceQuery>({
	spaceId: undefined,
	spaceName: '',
	parentId: undefined,
	seq: 1,
});

// 当前操作类型
const operationType = ref<'add' | 'edit'>('add');

// 计算弹窗标题
const dialogTitle = computed(() => {
	return operationType.value === 'add' ? '新增空间' : '编辑空间';
});

// 清空搜索条件
const resetQuery = () => {
	searchForm.spaceName = '';
	getSpaceList();
};


// 表单验证规则
const formRules: FormRules = {
	spaceName: [
		{ required: true, message: '请输入空间名称', trigger: 'blur' },
		{ min: 1, max: 50, message: '空间名称长度在1到50个字符', trigger: 'blur' },
	],
	seq: [{ required: true, message: '请输入排序', trigger: 'blur' }],
};

// 树形选择数据
const cascaderData = computed((): TreeSelectOption[] => {
	const addDefaultOption = (data: ISpaceRecord[]): TreeSelectOption[] => {
		const result: TreeSelectOption[] = [{ id: 0, name: '根级空间', children: [] }];
		const processData = (items: ISpaceRecord[]): TreeSelectOption[] => {
			return items.map((item) => ({
				id: item.id,
				name: item.name,
				children: item.children ? processData(item.children) : [],
			}));
		};
		result[0].children = processData(data);
		return result;
	};
	return addDefaultOption(tableData.value);
});

// 获取空间列表
const getSpaceList = async (): Promise<void> => {
	try {
		loading.value = true
		const response = await fetchSpaceList(searchForm.spaceName);
		if (response.code === 0 && response.data) {
			// 根据接口返回的数据结构调整
			if (Array.isArray(response.data)) {
				tableData.value = response.data;
			} else {
				// 如果返回的是单个对象，转换为数组
				tableData.value = [response.data];
			}
		} else {
			ElMessage.error(response.msg || '获取数据失败');
		}
		loading.value = false
	} catch (error) {
		ElMessage.error('获取数据失败');
		console.error(error);
		loading.value = false

	}

};

// 搜索
const handleSearch = (): void => {
	getSpaceList();
};

// 新增
const handleAdd = (): void => {
	operationType.value = 'add';
	dialogVisible.value = true;
	resetForm();
};

// 新增子节点
const handleEdit = (row: ISpaceRecord): void => {
	operationType.value = 'add';
	dialogVisible.value = true;
	resetForm();
	formData.parentId = row.id;
};

// 修改
const handleModify = (row: ISpaceRecord): void => {
	operationType.value = 'edit';
	dialogVisible.value = true;
	formData.spaceId = row.id;
	formData.spaceName = row.name;
	formData.parentId = row.parentId;
	formData.seq = row.weight;
};

// 删除
const handleDelete = async (row: ISpaceRecord): Promise<void> => {
	try {
		await ElMessageBox.confirm(`确定要删除空间"${row.name}"吗？`, '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		});

		const response = await deleteSpaceById(row.id);
		if (response.code === 0) {
			ElMessage.success('删除成功');
			getSpaceList();
		} else {
			ElMessage.error(response.msg || '删除失败');
		}
	} catch (error) {
		console.error(error);
	}
};

// 获取所有行数据(包含完整行信息)
const getAllRows = (data: ISpaceRecord[]): ISpaceRecord[] => {
	const rows: ISpaceRecord[] = [];
	const traverse = (items: ISpaceRecord[]) => {
		items.forEach((item) => {
			rows.push(item);
			if (item.children && item.children.length > 0) {
				traverse(item.children);
			}
		});
	};
	traverse(data);
	return rows;
};

// 展开/折叠
const toggleExpandAll = (): void => {
	if (!tableRef.value) return;
	const allRows = getAllRows(tableData.value);
	if (isExpandAll.value) {
		// 当前是展开状态，执行折叠
		allRows.forEach((row) => {
			if (row.children && row.children.length > 0) {
				tableRef.value?.toggleRowExpansion(row, false);
			}
		});
	} else {
		// 当前是折叠状态，执行展开
		allRows.forEach((row) => {
			if (row.children && row.children.length > 0) {
				tableRef.value?.toggleRowExpansion(row, true);
			}
		});
	}

	isExpandAll.value = !isExpandAll.value;
};
// 重置表单
const resetForm = (): void => {
	formData.spaceId = undefined;
	formData.spaceName = '';
	formData.parentId = undefined;
	formData.seq = 1;
	formRef.value?.clearValidate();
};

// 关闭弹窗
const handleDialogClose = (): void => {
	dialogVisible.value = false;
	resetForm();
};

// 提交表单
const handleSubmit = (): void => {
	formRef.value?.validate(async (valid) => {
		if (!valid) return;

		submitLoading.value = true;
		try {
			let response;
			if (operationType.value === 'add') {
				response = await addSpace(formData);
			} else {
				response = await updateSpace(formData);
			}

			if (response.code === 0) {
				ElMessage.success(operationType.value === 'add' ? '新增成功' : '修改成功');
				dialogVisible.value = false;
				getSpaceList();
			} else {
				ElMessage.error(response.msg || '操作失败');
			}
		} catch (error) {
			ElMessage.error('操作失败');
			console.error(error);
		} finally {
			submitLoading.value = false;
		}
	});
};

// 页面初始化
onMounted(() => {
	getSpaceList();
});
</script>

<style lang="scss" scoped>
.space-management {
	padding: 20px;
}

:deep(.el-table) {
	.el-table__row {
		.el-table__indent {
			padding-left: 20px;
		}
	}
}
</style>
