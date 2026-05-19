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
							<el-option label="月租" value="monthly" />
							<el-option label="临时" value="temporary" />
							<el-option label="访客" value="visitor" />
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>

			<!-- 行3：归属 / 起始日期（双列布局） -->
			<el-row :gutter="20" class="row-margin">
				<el-col :span="12">
					<el-form-item label="归属" prop="belongType">
						<el-select v-model="form.belongType" placeholder="请选择" style="width: 100%" @change="handleBelongTypeChange">
							<el-option label="企业" value="enterprise" />
							<el-option label="业主" value="owner" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="起始日期" prop="startDate">
						<el-date-picker v-model="form.startDate" type="date" placeholder="请选择日期" style="width: 100%" value-format="YYYY-MM-DD" />
					</el-form-item>
				</el-col>
			</el-row>

			<!-- 行4：月租费用（单列布局） -->
			<el-row :gutter="20" class="row-margin">
				<el-col :span="12">
					<el-form-item label="月租费用" prop="monthlyFee">
						<el-input placeholder="请输入月租费用" v-model="form.monthlyFee">
							<template #append>元/月</template>
						</el-input>
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
					<el-switch v-model="form.bindParking" @change="handleBindParkingChange" />
				</div>
				<div v-if="form.bindParking" class="parking-select">
					<div class="parking-label">选择车位 (空闲月租车位)</div>
					<el-form-item prop="parkingSpaceCode" label-width="0">
						<el-select v-model="form.parkingSpaceCode" placeholder="请选择车位" style="width: 100%" :loading="parkingSpaceLoading">
							<el-option v-for="item in freeParkingSpaceList" :key="item.id" :label="item.parkingSpaceCode" :value="item.parkingSpaceCode" />
						</el-select>
					</el-form-item>
				</div>
			</div>

			<!-- 行6：所属企业（归属为企业时显示） -->
			<el-row v-if="form.belongType === 'enterprise'" :gutter="20" class="row-margin">
				<el-col :span="24">
					<el-form-item label="所属企业" prop="enterpriseId">
						<el-select v-model="form.enterpriseId" placeholder="请选择企业" style="width: 100%" clearable @change="handleEnterpriseChange">
							<el-option v-for="item in enterpriseList" :key="item.id" :label="item.enterpriseName" :value="item.id" />
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>

			<!-- 企业车位配额模块 -->
			<div v-if="form.enterpriseId && companyQuota.total > 0" class="company-quota-module">
				<!-- 标题区域 -->
				<div class="quota-header">
					<el-icon class="building-icon"><OfficeBuilding /></el-icon>
					<span class="quota-title">{{ form.enterpriseName }} 车位配额</span>
				</div>

				<!-- 配额进度信息行 -->
				<div class="quota-progress-row">
					<span class="quota-used-text">已用 {{ companyQuota.used }} / 总 {{ companyQuota.total }}</span>
					<div class="quota-progress-bar">
						<div class="quota-progress-fill" :style="{ width: companyQuota.percentage + '%' }"></div>
					</div>
					<div class="quota-right-info">
						<span class="quota-percentage">{{ companyQuota.percentage }}%</span>
						<span class="quota-remain"
							>剩余 <span class="remain-number">{{ companyQuota.remain }}</span> 个</span
						>
					</div>
				</div>

				<!-- 计费说明行 -->
				<div class="quota-billing">
					计费方式：前{{ companyQuota.baseCount }}个车位 ¥{{ companyQuota.basePrice }}/月/个，超出部分 ¥{{ companyQuota.extraPrice }}/月/个
				</div>

				<!-- 月租费用输入框 -->
				<div class="quota-fee-box">
					<div class="fee-icon">$</div>
					<div class="fee-content">
						<span class="fee-label">自动匹配月租费用：</span>
						<span class="fee-amount">¥{{ companyQuota.matchedFee }}/月</span>
						<span class="fee-hint">(可修改)</span>
					</div>
				</div>

				<!-- 车牌标签组 -->
				<div v-if="companyQuota.plateList.length > 0" class="plate-tags-row">
					<span v-for="(plate, index) in companyQuota.plateList" :key="index" class="plate-tag">{{ plate }}</span>
				</div>
			</div>

			<!-- 行7：联系人 / 联系电话（双列布局） -->
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
import { Location, OfficeBuilding } from '@element-plus/icons-vue';
import { useMessage } from '/@/hooks/message';
import { getEnterprisePackageList } from '/@/api/enterpriseSpace';
import type { ParkingEnterprisePackageVO } from '/@/api/enterpriseSpace/type';
import { getParkingSpacePage } from '/@/api/parkingInfo';
import type { ParkingSpace } from '/@/api/parkingInfo/type';
import { addVehicle, editVehicle, getVehicleDetails } from '/@/api/vehicle';
import type { Vehicle } from '/@/api/vehicle/type';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 企业列表
const enterpriseList = ref<ParkingEnterprisePackageVO[]>([]);

// 空闲车位列表
const freeParkingSpaceList = ref<ParkingSpace[]>([]);
const parkingSpaceLoading = ref(false);

// 企业配额数据
const companyQuota = reactive({
	used: 0,
	total: 0,
	percentage: 0,
	remain: 0,
	baseCount: 0,
	basePrice: 0,
	extraPrice: 0,
	matchedFee: 0,
	plateList: [] as string[],
});

// 提交表单数据
const form = reactive({
	id: undefined as number | undefined,
	plateNumber: '',
	vehicleBrand: '',
	color: '',
	type: '',
	belongType: '',
	startDate: '',
	monthlyFee: '',
	bindParking: false,
	parkingSpaceCode: '',
	parkingSpaceId: undefined as number | undefined,
	enterpriseId: undefined as number | undefined,
	enterpriseName: '',
	contactPerson: '',
	contactPhone: '',
});

// 定义校验规则
const dataRules = ref({
	plateNumber: [{ required: true, message: '请输入车牌号', trigger: 'blur' }],
	type: [{ required: true, message: '请选择类型', trigger: 'change' }],
	belongType: [{ required: true, message: '请选择归属', trigger: 'change' }],
	startDate: [{ required: true, message: '请选择起始日期', trigger: 'change' }],
});

// 重置配额数据
const resetCompanyQuota = () => {
	companyQuota.used = 0;
	companyQuota.total = 0;
	companyQuota.percentage = 0;
	companyQuota.remain = 0;
	companyQuota.baseCount = 0;
	companyQuota.basePrice = 0;
	companyQuota.extraPrice = 0;
	companyQuota.matchedFee = 0;
	companyQuota.plateList = [];
};

// 获取空闲月租车位列表
const fetchFreeParkingSpaceList = async () => {
	parkingSpaceLoading.value = true;
	try {
		const res = await getParkingSpacePage({
			current: 1,
			size: 1000,
			type: 'monthly',
			busyStatus: 'idle',
		} as any);
		if (res.code === 0 && res.data) {
			freeParkingSpaceList.value = res.data.records || [];
		}
	} catch (err) {
		console.error('获取空闲车位列表失败', err);
	} finally {
		parkingSpaceLoading.value = false;
	}
};

// 绑定车位开关变化
const handleBindParkingChange = (val: boolean) => {
	if (val) {
		fetchFreeParkingSpaceList();
	} else {
		form.parkingSpaceCode = '';
		form.parkingSpaceId = undefined;
	}
};

// 归属变化时清空企业相关数据
const handleBelongTypeChange = (val: string) => {
	if (val !== 'enterprise') {
		form.enterpriseId = undefined;
		form.enterpriseName = '';
		resetCompanyQuota();
	}
};

// 获取企业列表
const fetchEnterpriseList = async () => {
	try {
		const res = await getEnterprisePackageList();
		if (res.code === 0 && res.data) {
			enterpriseList.value = res.data;
		}
	} catch (err) {
		console.error('获取企业列表失败', err);
	}
};

// 企业选择变化时，根据企业数据填充配额信息
const handleEnterpriseChange = (val: number) => {
	if (val) {
		form.belongType = 'enterprise';
		// 根据选择的企业获取配额数据
		const selectedEnterprise = enterpriseList.value.find((item) => item.id === val);
		if (selectedEnterprise) {
			form.enterpriseName = selectedEnterprise.enterpriseName || '';

			const used = selectedEnterprise.usedSpaces || 0;
			const total = selectedEnterprise.totalSpaces || 0;
			const baseCount = selectedEnterprise.baseSpaces || 0;
			const basePrice = selectedEnterprise.basePrice || 0;
			const extraPrice = selectedEnterprise.overPrice || 0;
			const remain = total - used;
			const percentage = total > 0 ? Math.round((used / total) * 100) : 0;

			companyQuota.used = used;
			companyQuota.total = total;
			companyQuota.remain = remain;
			companyQuota.percentage = percentage;
			companyQuota.baseCount = baseCount;
			companyQuota.basePrice = basePrice;
			companyQuota.extraPrice = extraPrice;

			// 自动匹配月租费用：已用+1为当前车位序号，判断是基础车位还是超出车位
			companyQuota.matchedFee = used + 1 <= baseCount ? basePrice : extraPrice;

			// 已绑定车牌列表
			companyQuota.plateList = (selectedEnterprise.bindVehicles || []).map((v) => v.plateNumber || '').filter(Boolean);

			// 自动填充月租费用
			form.monthlyFee = String(companyQuota.matchedFee);
		}
	} else {
		// 清除选择时重置数据
		form.enterpriseName = '';
		resetCompanyQuota();
	}
};

// 打开弹窗
const openDialog = async (id?: number, row?: Vehicle) => {
	visible.value = true;
	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
		resetCompanyQuota();
		freeParkingSpaceList.value = [];
	});

	// 先获取企业列表
	await fetchEnterpriseList();

	// 编辑时获取数据
	if (id) {
		loading.value = true;
		try {
			const res = await getVehicleDetails(id);
			if (res.code === 0 && res.data) {
				const data = res.data;
				form.id = data.id;
				form.plateNumber = data.plateNumber || '';
				form.vehicleBrand = data.vehicleBrand || '';
				form.color = data.color || '';
				form.type = data.type || '';
				form.belongType = data.belongType || '';
				form.startDate = data.startDate || '';
				form.monthlyFee = data.monthlyFee ? String(data.monthlyFee) : '';
				form.parkingSpaceCode = data.parkingSpaceCode || '';
				form.parkingSpaceId = data.parkingSpaceId;
				form.enterpriseId = data.enterpriseId;
				form.enterpriseName = data.enterpriseName || '';
				form.contactPerson = data.contactPerson || '';
				form.contactPhone = data.contactPhone || '';
				form.bindParking = !!data.bindFixedSpace;

				// 如果有绑定车位，获取空闲车位列表
				if (form.bindParking) {
					fetchFreeParkingSpaceList();
				}

				// 如果有选择企业，触发企业配额数据填充
				if (form.enterpriseId) {
					handleEnterpriseChange(form.enterpriseId);
				}
			}
		} catch (err) {
			console.error('获取车辆详情失败', err);
		} finally {
			loading.value = false;
		}
	} else {
		form.id = undefined;
		form.bindParking = false;
	}
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;

		// 如果选择了车位，获取车位ID
		if (form.bindParking && form.parkingSpaceCode) {
			const selectedSpace = freeParkingSpaceList.value.find((item) => item.parkingSpaceCode === form.parkingSpaceCode);
			if (selectedSpace) {
				form.parkingSpaceId = selectedSpace.id;
			}
		}

		const submitData = {
			plateNumber: form.plateNumber,
			vehicleBrand: form.vehicleBrand,
			color: form.color,
			type: form.type,
			belongType: form.belongType,
			startDate: form.startDate,
			monthlyFee: form.monthlyFee ? Number(form.monthlyFee) : undefined,
			bindFixedSpace: form.bindParking ? 1 : 0,
			parkingSpaceId: form.parkingSpaceId,
			parkingSpaceCode: form.parkingSpaceCode,
			enterpriseId: form.belongType === 'enterprise' ? form.enterpriseId : undefined,
			enterpriseName: form.belongType === 'enterprise' ? form.enterpriseName : undefined,
			contactPerson: form.contactPerson,
			contactPhone: form.contactPhone,
		};

		let res;
		if (form.id) {
			// 编辑
			res = await editVehicle({ ...submitData, id: form.id });
		} else {
			// 新增
			res = await addVehicle(submitData);
		}

		if (res.code === 0) {
			useMessage().success(form.id ? '编辑成功' : '登记成功');
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

// 企业车位配额模块样式
.company-quota-module {
	background: #e8f2ff;
	border-radius: 8px;
	padding: 12px 16px;
	margin-bottom: 18px;
}

.quota-header {
	display: flex;
	align-items: center;
	margin-bottom: 12px;
}

.building-icon {
	color: #333333;
	font-size: 16px;
	margin-right: 6px;
}

.quota-title {
	font-size: 14px;
	font-weight: bold;
	color: #333333;
}

.quota-progress-row {
	display: flex;
	align-items: center;
	margin-bottom: 10px;
}

.quota-used-text {
	font-size: 13px;
	color: #888888;
	white-space: nowrap;
}

.quota-progress-bar {
	flex: 1;
	height: 8px;
	background: #d6e8ff;
	border-radius: 4px;
	margin-left: 10px;
	margin-right: 12px;
}

.quota-progress-fill {
	height: 100%;
	background: #1677ff;
	border-radius: 4px;
}

.quota-right-info {
	display: flex;
	align-items: center;
	gap: 12px;
	white-space: nowrap;
}

.quota-percentage {
	font-size: 15px;
	font-weight: bold;
	color: #1677ff;
}

.quota-remain {
	font-size: 13px;
	color: #333333;
}

.remain-number {
	color: #1677ff;
}

.quota-billing {
	font-size: 13px;
	color: #666666;
	margin-bottom: 12px;
}

.quota-fee-box {
	background: #ffffff;
	border: 1px solid #d6e8ff;
	border-radius: 8px;
	padding: 10px 12px;
	display: flex;
	align-items: center;
	margin-bottom: 12px;
}

.fee-icon {
	width: 18px;
	height: 18px;
	background: #fff;
	border: 1px solid #1677ff;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #1677ff;
	font-size: 10px;
	font-weight: 700;
	margin-right: 4px;
}

.fee-content {
	display: flex;
	align-items: center;
}

.fee-label {
	font-size: 13px;
	color: #333333;
}

.fee-amount {
	font-size: 15px;
	font-weight: bold;
	color: #1677ff;
	margin-left: 4px;
}

.fee-hint {
	font-size: 12px;
	color: #aaaaaa;
	margin-left: 6px;
}

.plate-tags-row {
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
}

.plate-tag {
	background: #ffffff;
	border-radius: 6px;
	padding: 4px 12px;
	font-size: 13px;
	color: #333333;
}
</style>
