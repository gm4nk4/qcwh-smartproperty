<template>
	<el-dialog :close-on-click-modal="false" title="新增企业车位包" width="700" draggable v-model="visible">
		<el-form :model="form" :rules="dataRules" label-width="120px" ref="dataFormRef" v-loading="loading">
			<!-- 行1：企业名称 -->
			<el-form-item label="企业名称" prop="companyName">
				<el-select v-model="form.companyName" placeholder="请选择企业名称" style="width: 100%">
					<el-option label="星辰传媒有限公司" value="星辰传媒有限公司" />
					<el-option label="云帆网络科技有限公司" value="云帆网络科技有限公司" />
					<el-option label="鼎信会计师事务所" value="鼎信会计师事务所" />
					<el-option label="博雅律师事务所" value="博雅律师事务所" />
					<el-option label="鑫源贸易有限公司" value="鑫源贸易有限公司" />
				</el-select>
			</el-form-item>

			<!-- 行2：联系人 / 联系电话 -->
			<el-row :gutter="20" class="row-margin">
				<el-col :span="12">
					<el-form-item label="联系人" prop="contact">
						<el-input placeholder="请输入联系人" v-model="form.contact" />
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="联系电话" prop="phone">
						<el-input placeholder="请输入联系电话" v-model="form.phone" />
					</el-form-item>
				</el-col>
			</el-row>

			<!-- 行3：合同编号 -->
			<el-form-item label="合同编号" prop="contract">
				<el-input placeholder="请输入合同编号" v-model="form.contract" />
			</el-form-item>

			<!-- 行4：总车位数 / 基础车位数 -->
			<el-row :gutter="20" class="row-margin">
				<el-col :span="12">
					<el-form-item label="总车位数" prop="totalQuota">
						<el-input-number v-model="form.totalQuota" :min="1" :max="999" placeholder="请输入" style="width: 100%" />
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="基础车位数" prop="baseQuota">
						<el-input-number v-model="form.baseQuota" :min="1" :max="form.totalQuota" placeholder="请输入" style="width: 100%" />
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
					<el-form-item label="超出单价" prop="exceedPrice">
						<el-input-number v-model="form.exceedPrice" :min="0" :max="99999" :precision="2" placeholder="请输入" style="width: 100%">
							<template #append>¥/月/个</template>
						</el-input-number>
					</el-form-item>
				</el-col>
			</el-row>

			<!-- 行6：开始日期 / 结束日期 -->
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="开始日期" prop="startDate">
						<el-date-picker v-model="form.startDate" type="date" placeholder="yyyy/mm/dd" style="width: 100%" value-format="YYYY-MM-DD" />
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="结束日期" prop="endDate">
						<el-date-picker v-model="form.endDate" type="date" placeholder="yyyy/mm/dd" style="width: 100%" value-format="YYYY-MM-DD" />
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

const emit = defineEmits(['refresh']);

const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

const form = reactive({
	id: '',
	companyName: '',
	contact: '',
	phone: '',
	contract: '',
	totalQuota: 1,
	baseQuota: 1,
	basePrice: 0,
	exceedPrice: 0,
	startDate: '',
	endDate: '',
});

const dataRules = ref({
	companyName: [{ required: true, message: '请选择企业名称', trigger: 'change' }],
	contact: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
	phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
	totalQuota: [{ required: true, message: '请输入总车位数', trigger: 'blur' }],
	baseQuota: [{ required: true, message: '请输入基础车位数', trigger: 'blur' }],
	basePrice: [{ required: true, message: '请输入基础单价', trigger: 'blur' }],
	exceedPrice: [{ required: true, message: '请输入超出单价', trigger: 'blur' }],
	startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
	endDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
});

const openDialog = (id?: string, row?: any) => {
	visible.value = true;
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});
	if (id && row) {
		form.id = id;
		Object.assign(form, row);
	} else {
		form.id = '';
		form.totalQuota = 1;
		form.baseQuota = 1;
		form.basePrice = 0;
		form.exceedPrice = 0;
	}
};

const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		console.log('提交表单', form);
		useMessage().success('新增成功');
		visible.value = false;
		emit('refresh');
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
