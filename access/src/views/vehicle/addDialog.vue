<template>
	<el-dialog
		:close-on-click-modal="false"
		:title="form.id ? '编辑' : '登记车辆'"
		width="800"
		draggable
		v-model="visible"
		class="subitem-system-dialog"
	>
		<el-form :model="form" :rules="dataRules" label-width="100px" ref="dataFormRef" v-loading="loading" class="subitem-dialog-form__grid">
			<!-- 行1：车牌号 / 车辆品牌（双列布局） -->
			<el-row :gutter="20" class="row-margin">
				<el-col :span="12">
					<el-form-item label="车牌号" prop="plateNumber">
						<el-input placeholder="如：京A·XXXXX" v-model="form.plateNumber" />
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="车辆品牌" prop="vehicleBrand">
						<el-input placeholder="如：宝马 5系" v-model="form.vehicleBrand" />
					</el-form-item>
				</el-col>
			</el-row>

			<!-- 行2：颜色 / 类型（双列布局） -->
			<el-row :gutter="20" class="row-margin">
				<el-col :span="12">
					<el-form-item label="颜色" prop="color">
						<el-input v-model="form.color" placeholder="请输入颜色" />
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="类型" prop="type">
						<el-select v-model="form.type" placeholder="请选择类型" style="width: 100%">
							<el-option label="月租" value="月租" />
							<el-option label="临时" value="临时" />
							<el-option label="访客" value="访客" />
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>

			<!-- 行3：归属 / 起始日期（双列布局） -->
			<el-row :gutter="20" class="row-margin">
				<el-col :span="12">
					<el-form-item label="归属" prop="belong">
						<el-select v-model="form.belong" placeholder="请选择" style="width: 100%">
							<el-option label="企业" value="企业" />
							<el-option label="业主" value="业主" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="起始日期" prop="startDate">
						<el-date-picker v-model="form.startDate" type="date" placeholder="请选择日期" style="width: 100%" value-format="YYYY-MM-DD" />
					</el-form-item>
				</el-col>
			</el-row>

			<!-- 行4：月租费用 / 所属企业（双列布局） -->
			<el-row :gutter="20" class="row-margin">
				<el-col :span="12">
					<el-form-item label="月租费用" prop="monthlyFee">
						<el-input placeholder="请输入月租费用" v-model="form.monthlyFee">
							<template #append>元/月</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="所属企业" prop="company">
						<el-select v-model="form.company" placeholder="请选择企业" style="width: 100%">
							<el-option label="阳光科技有限公司" value="阳光科技有限公司" />
							<el-option label="星辰集团" value="星辰集团" />
							<el-option label="创新科技" value="创新科技" />
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>

			<!-- 行5：绑定固定车位（开关+下拉框模块） -->
			<div class="bind-parking-module">
				<div class="bind-header">
					<div class="bind-title">
						<el-icon class="location-icon"><Location /></el-icon>
						<span>绑定固定车位</span>
					</div>
					<el-switch v-model="form.bindParking" />
				</div>
				<div v-if="form.bindParking" class="parking-select">
					<div class="parking-label">选择车位 (空闲月租车位)</div>
					<el-form-item prop="parkingSpace" label-width="0">
						<el-select v-model="form.parkingSpace" placeholder="请选择车位" style="width: 100%">
							<el-option label="A-001" value="A-001" />
							<el-option label="A-002" value="A-002" />
							<el-option label="B-001" value="B-001" />
							<el-option label="C-001" value="C-001" />
						</el-select>
					</el-form-item>
				</div>
			</div>

			<!-- 行6：联系人 / 联系电话（双列布局） -->
			<el-row :gutter="20">
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
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">取消</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="VehicleDialog" setup>
import { Location } from '@element-plus/icons-vue';
import { useMessage } from '/@/hooks/message';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 提交表单数据
const form = reactive({
	id: '',
	plateNumber: '',
	vehicleBrand: '',
	color: '',
	type: '',
	belong: '',
	startDate: '',
	monthlyFee: '',
	bindParking: false,
	parkingSpace: '',
	company: '',
	contactPerson: '',
	contactPhone: '',
});

// 定义校验规则
const dataRules = ref({
	plateNumber: [{ required: true, message: '请输入车牌号', trigger: 'blur' }],
	type: [{ required: true, message: '请选择类型', trigger: 'change' }],
	belong: [{ required: true, message: '请选择归属', trigger: 'change' }],
	startDate: [{ required: true, message: '请选择起始日期', trigger: 'change' }],
	monthlyFee: [{ required: true, message: '请输入月租费用', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id?: string, row?: any) => {
	visible.value = true;
	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 编辑时获取数据
	if (id && row) {
		form.id = id;
		Object.assign(form, row);
	} else {
		form.id = '';
		form.bindParking = false;
	}
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		// TODO: 调用新增/编辑接口
		console.log('提交表单', form);
		useMessage().success(form.id ? '编辑成功' : '登记成功');
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg || '操作失败');
	} finally {
		loading.value = false;
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.row-margin {
	margin-bottom: 18px;
}

.bind-parking-module {
	background: #f5f5f5;
	border-radius: 8px;
	padding: 16px 20px;
	margin-bottom: 18px;
}

.bind-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12px;
}

.bind-title {
	display: flex;
	align-items: center;
	font-size: 14px;
	color: #333333;
}

.location-icon {
	color: var(--el-color-primary);
	font-size: 18px;
	margin-right: 8px;
}

.parking-label {
	font-size: 12px;
	color: #999999;
	margin-bottom: 8px;
}

.parking-select :deep(.el-form-item) {
	margin-left: 0;
	margin-bottom: 0;
}

.parking-select :deep(.el-form-item__content) {
	width: 100%;
}
</style>
