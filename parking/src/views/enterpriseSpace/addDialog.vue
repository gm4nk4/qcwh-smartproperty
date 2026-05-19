<template>
	<el-dialog :close-on-click-modal="false" :title="isEdit ? '编辑企业车位包' : '新增企业车位包'" width="700" draggable v-model="visible">
		<el-form :model="form" :rules="dataRules" label-width="120px" ref="dataFormRef" v-loading="loading">
			<!-- 行1：企业名称 -->
			<el-form-item label="企业名称" prop="enterpriseName">
				<el-input placeholder="请输入企业名称" v-model="form.enterpriseName" />
			</el-form-item>

			<!-- 行2：联系人 / 联系电话 -->
			<el-row :gutter="20" class="row-margin">
				<el-col :span="12">
					<el-form-item label="联系人" prop="contactPerson">
						<el-input placeholder="请输入联系人" v-model="form.contactPerson" />
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="联系电话" prop="contactPhone">
						<el-input placeholder="请输入联系电话" v-model="form.contactPhone" />
					</el-form-item>
				</el-col>
			</el-row>

			<!-- 行3：合同编号 -->
			<el-form-item label="合同编号" prop="contractNo">
				<el-input placeholder="请输入合同编号" v-model="form.contractNo" />
			</el-form-item>

			<!-- 行4：总车位数 / 基础车位数 -->
			<el-row :gutter="20" class="row-margin">
				<el-col :span="12">
					<el-form-item label="总车位数" prop="totalSpaces">
						<el-input-number v-model="form.totalSpaces" :min="1" :max="999" placeholder="请输入" style="width: 100%" />
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="基础车位数" prop="baseSpaces">
						<el-input-number v-model="form.baseSpaces" :min="1" :max="form.totalSpaces" placeholder="请输入" style="width: 100%" />
					</el-form-item>
				</el-col>
			</el-row>

			<!-- 行5：基础单价 / 超出单价 -->
			<el-row :gutter="20" class="row-margin">
				<el-col :span="12">
					<el-form-item label="基础单价" prop="basePrice">
						<el-input-number v-model="form.basePrice" :min="0" :max="99999" :precision="2" placeholder="请输入" style="width: 100%">
							<template #append>¥/月/个</template>
						</el-input-number>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="超出单价" prop="overPrice">
						<el-input-number v-model="form.overPrice" :min="0" :max="99999" :precision="2" placeholder="请输入" style="width: 100%">
							<template #append>¥/月/个</template>
						</el-input-number>
					</el-form-item>
				</el-col>
			</el-row>

			<!-- 行6：开始日期 / 结束日期 -->
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="开始日期" prop="startDate">
						<el-date-picker v-model="form.startDate" type="date" placeholder="请选择开始日期" style="width: 100%" value-format="YYYY-MM-DD" />
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="结束日期" prop="endDate">
						<el-date-picker v-model="form.endDate" type="date" placeholder="请选择结束日期" style="width: 100%" value-format="YYYY-MM-DD" />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">取消</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="EnterpriseSpaceDialog" setup>
import { useMessage } from '/@/hooks/message';
import { addEnterprisePackage, editEnterprisePackage } from '/@/api/enterpriseSpace';
	import type { ParkingEnterprisePackage, ParkingEnterprisePackageVO } from '/@/api/enterpriseSpace/type';

const emit = defineEmits(['refresh']);

const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
const isEdit = ref(false);

const form = reactive<ParkingEnterprisePackage>({
	id: undefined,
	enterpriseName: '',
	contactPerson: '',
	contactPhone: '',
	contractNo: '',
	totalSpaces: 1,
	baseSpaces: 1,
	basePrice: 0,
	overPrice: 0,
	startDate: '',
	endDate: '',
});

const dataRules = ref({
	enterpriseName: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
	contactPerson: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
	contactPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
	contractNo: [{ required: true, message: '请输入合同编号', trigger: 'blur' }],
	totalSpaces: [{ required: true, message: '请输入总车位数', trigger: 'blur' }],
	baseSpaces: [{ required: true, message: '请输入基础车位数', trigger: 'blur' }],
	basePrice: [{ required: true, message: '请输入基础单价', trigger: 'blur' }],
	startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
	endDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
});

const openDialog = (id?: number, row?: ParkingEnterprisePackageVO) => {
	visible.value = true;
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	if (id && row) {
		// 编辑模式
		isEdit.value = true;
		form.id = id;
		form.enterpriseName = row.enterpriseName || '';
		form.contactPerson = row.contactPerson || '';
		form.contactPhone = row.contactPhone || '';
		form.contractNo = row.contractNo || '';
		form.totalSpaces = row.totalSpaces || 1;
		form.baseSpaces = row.baseSpaces || 1;
		form.basePrice = row.basePrice || 0;
		form.overPrice = row.overPrice || 0;
		form.startDate = row.startDate || '';
		form.endDate = row.endDate || '';
	} else {
		// 新增模式
		isEdit.value = false;
		form.id = undefined;
		form.enterpriseName = '';
		form.contactPerson = '';
		form.contactPhone = '';
		form.contractNo = '';
		form.totalSpaces = 1;
		form.baseSpaces = 1;
		form.basePrice = 0;
		form.overPrice = 0;
		form.startDate = '';
		form.endDate = '';
	}
};

const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		const submitData: ParkingEnterprisePackage = {
			...form,
			status: 'normal', // 默认状态为正常
		};

		let res;
		if (isEdit.value) {
			res = await editEnterprisePackage(submitData);
		} else {
			res = await addEnterprisePackage(submitData);
		}

		if (res.code === 0) {
			useMessage().success(isEdit.value ? '编辑成功' : '新增成功');
			visible.value = false;
			emit('refresh');
		} else {
			useMessage().error(res.msg || '操作失败');
		}
	} catch (err: any) {
		useMessage().error(err.msg || '操作失败');
	} finally {
		loading.value = false;
	}
};

defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.row-margin {
	margin-bottom: 18px;
}
:deep(.el-input-number) {
	width: 100%;
}
</style>
