<template>
	<div class="layout-padding charge-config-page">
		<div class="layout-padding-auto layout-padding-view">
			<!-- 顶部标题栏 -->
			<div class="header-bar">
				<div class="header-left">
					<el-icon class="header-icon"><Document /></el-icon>
					<span class="header-title">收费类型配置：临时停车、月租、访客</span>
				</div>
				<div class="header-right">
					<template v-if="!isEditing">
						<el-button type="primary" @click="handleEdit" :loading="loading">
							<el-icon><Edit /></el-icon>
							编辑配置
						</el-button>
					</template>
					<template v-else>
						<el-button class="cancel-btn" @click="handleCancel">取消</el-button>
						<el-button type="primary" @click="handleSave" :loading="loading">
							<el-icon><FolderChecked /></el-icon>
							保存配置
						</el-button>
					</template>
				</div>
			</div>

			<!-- 主体内容区 -->
			<div class="content-area" v-loading="loading">
				<!-- 模块1：临时停车收费 -->
				<div class="config-section">
					<div class="section-title">
						<el-icon class="section-icon"><Clock /></el-icon>
						<span>临时停车收费</span>
					</div>
					<el-form :model="formData.tempParking" label-position="top" class="config-form" :disabled="!isEditing">
						<el-row :gutter="16">
							<el-col :span="6">
								<el-form-item label="前2小时（¥/小时）">
									<el-input-number v-model="formData.tempParking.firstTwoHours" :min="0" :precision="2" controls-position="right" placeholder="请输入" style="width: 100%" />
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="2小时后（¥/小时）">
									<el-input-number v-model="formData.tempParking.afterTwoHours" :min="0" :precision="2" controls-position="right" placeholder="请输入" style="width: 100%" />
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="日封顶（¥）">
									<el-input-number v-model="formData.tempParking.dailyCap" :min="0" :precision="2" controls-position="right" placeholder="请输入" style="width: 100%" />
								</el-form-item>
							</el-col>
							<el-col :span="6">
								<el-form-item label="夜间包时22:00-06:00（¥）">
									<el-input-number v-model="formData.tempParking.nightPackage" :min="0" :precision="2" controls-position="right" placeholder="请输入" style="width: 100%" />
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</div>

				<!-- 模块2：月租收费 -->
				<div class="config-section">
					<div class="section-title">
						<el-icon class="section-icon"><Tickets /></el-icon>
						<span>月租收费</span>
					</div>
					<el-form :model="formData.monthlyRent" label-position="top" class="config-form" :disabled="!isEditing">
						<el-row :gutter="16">
							<el-col :span="4">
								<el-form-item label="地面车位（¥/月）">
									<el-input-number v-model="formData.monthlyRent.groundSpace" :min="0" :precision="2" controls-position="right" placeholder="请输入" style="width: 100%" />
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item label="地下一层（¥/月）">
									<el-input-number v-model="formData.monthlyRent.basementOne" :min="0" :precision="2" controls-position="right" placeholder="请输入" style="width: 100%" />
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item label="地下二层（¥/月）">
									<el-input-number v-model="formData.monthlyRent.basementTwo" :min="0" :precision="2" controls-position="right" placeholder="请输入" style="width: 100%" />
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item label="企业基础单价范围">
									<el-input v-model="formData.monthlyRent.corpBaseRange" placeholder="请输入" />
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item label="企业超出单价范围">
									<el-input v-model="formData.monthlyRent.corpExceedRange" placeholder="请输入" />
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</div>

				<!-- 模块3：访客停车收费 -->
				<div class="config-section">
					<div class="section-title">
						<el-icon class="section-icon"><UserFilled /></el-icon>
						<span>访客停车收费</span>
					</div>
					<el-form :model="formData.visitorParking" label-position="top" class="config-form" :disabled="!isEditing">
						<el-row :gutter="16">
							<el-col :span="8">
								<el-form-item label="免费时长（小时）">
									<el-input-number v-model="formData.visitorParking.freeHours" :min="0" :precision="1" controls-position="right" placeholder="请输入" style="width: 100%" />
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="超时后（¥/小时）">
									<el-input-number v-model="formData.visitorParking.overtimeRate" :min="0" :precision="2" controls-position="right" placeholder="请输入" style="width: 100%" />
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="日封顶（¥）">
									<el-input-number v-model="formData.visitorParking.dailyCap" :min="0" :precision="2" controls-position="right" placeholder="请输入" style="width: 100%" />
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="chargeIndex">
import { Clock, Tickets, UserFilled, Document, FolderChecked, Edit } from '@element-plus/icons-vue';
import { useMessage } from '/@/hooks/message';
import { getChargeConfigPage, addChargeConfig, editChargeConfig } from '/@/api/charge';
import type { ChargeConfig } from '/@/api/charge/type';

const isEditing = ref(false);
const loading = ref(false);
const configId = ref<number | null>(null);
const originalData = ref<any>(null);

const formData = reactive({
	tempParking: {
		firstTwoHours: 0,
		afterTwoHours: 0,
		dailyCap: 0,
		nightPackage: 0,
	},
	monthlyRent: {
		groundSpace: 0,
		basementOne: 0,
		basementTwo: 0,
		corpBaseRange: '',
		corpExceedRange: '',
	},
	visitorParking: {
		freeHours: 0,
		overtimeRate: 0,
		dailyCap: 0,
	},
});

const fetchConfig = async () => {
	loading.value = true;
	try {
		const res = await getChargeConfigPage({ current: 1, size: 1 });
		if (res.code === 0 && res.data.records.length > 0) {
			const config: ChargeConfig = res.data.records[0];
			configId.value = config.id ?? null;
			formData.tempParking.firstTwoHours = config.tempFirst2hRate ?? 0;
			formData.tempParking.afterTwoHours = config.tempAfter2hRate ?? 0;
			formData.tempParking.dailyCap = config.tempDailyCap ?? 0;
			formData.tempParking.nightPackage = config.tempNightPackageFee ?? 0;
			formData.monthlyRent.groundSpace = config.monthlyGroundPrice ?? 0;
			formData.monthlyRent.basementOne = config.monthlyUnderground1Price ?? 0;
			formData.monthlyRent.basementTwo = config.monthlyUnderground2Price ?? 0;
			formData.monthlyRent.corpBaseRange = config.enterpriseBasePriceRange ?? '';
			formData.monthlyRent.corpExceedRange = config.enterpriseOverPriceRange ?? '';
			formData.visitorParking.freeHours = config.visitorFreeHours ?? 0;
			formData.visitorParking.overtimeRate = config.visitorOvertimeRate ?? 0;
			formData.visitorParking.dailyCap = config.visitorDailyCap ?? 0;
		}
	} catch (error) {
		console.error('获取配置失败', error);
	} finally {
		loading.value = false;
	}
};

const handleEdit = () => {
	originalData.value = JSON.parse(JSON.stringify(formData));
	isEditing.value = true;
};

const handleCancel = () => {
	if (originalData.value) {
		Object.assign(formData, originalData.value);
	}
	isEditing.value = false;
	useMessage().info('已取消编辑');
};

const handleSave = async () => {
	loading.value = true;
	try {
		const params = {
			tempFirst2hRate: formData.tempParking.firstTwoHours,
			tempAfter2hRate: formData.tempParking.afterTwoHours,
			tempDailyCap: formData.tempParking.dailyCap,
			tempNightPackageFee: formData.tempParking.nightPackage,
			monthlyGroundPrice: formData.monthlyRent.groundSpace,
			monthlyUnderground1Price: formData.monthlyRent.basementOne,
			monthlyUnderground2Price: formData.monthlyRent.basementTwo,
			enterpriseBasePriceRange: formData.monthlyRent.corpBaseRange,
			enterpriseOverPriceRange: formData.monthlyRent.corpExceedRange,
			visitorFreeHours: formData.visitorParking.freeHours,
			visitorOvertimeRate: formData.visitorParking.overtimeRate,
			visitorDailyCap: formData.visitorParking.dailyCap,
		};

		let res;
		if (configId.value) {
			res = await editChargeConfig({ ...params, id: configId.value });
		} else {
			res = await addChargeConfig(params);
		}

		if (res.code === 0) {
			useMessage().success('配置保存成功');
			isEditing.value = false;
			originalData.value = null;
			await fetchConfig();
		} else {
			useMessage().error(res.msg || '保存失败');
		}
	} catch (error) {
		console.error('保存配置失败', error);
		useMessage().error('保存配置失败');
	} finally {
		loading.value = false;
	}
};

onMounted(() => {
	fetchConfig();
});
</script>

<style scoped lang="scss">
.charge-config-page {
	.header-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 20px;
		background-color: #fff9e6;
		border-radius: 12px;
		margin-bottom: 16px;

		.header-left {
			display: flex;
			align-items: center;
			gap: 8px;

			.header-icon {
				font-size: 18px;
				color: #f59e0b;
			}

			.header-title {
				font-size: 14px;
				font-weight: 500;
				color: #1f2937;
			}
		}

		.header-right {
			display: flex;
			align-items: center;
			gap: 12px;

			.cancel-btn {
				background-color: #fff;
				border: 1px solid var(--el-color-primary);
				color: var(--el-color-primary);

				&:hover {
					background-color: var(--next-color-primary-lighter);
				}
			}
		}
	}

	.content-area {
		flex: 1;
		overflow-y: auto;
	}

	.config-section {
		margin-bottom: 16px;
		padding: 20px;
		background-color: #fff;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

		&:last-child {
			margin-bottom: 0;
		}

		.section-title {
			display: flex;
			align-items: center;
			gap: 8px;
			margin-bottom: 20px;
			padding-left: 12px;
			position: relative;

			&::before {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				width: 4px;
				height: 18px;
				background-color: var(--el-color-primary);
				border-radius: 2px;
			}

			.section-icon {
				font-size: 16px;
				color: var(--el-color-primary);
			}

			span {
				font-size: 15px;
				font-weight: 600;
				color: #1f2937;
			}
		}

		.config-form {
			:deep(.el-form-item) {
				margin-bottom: 0;
			}

			:deep(.el-form-item__label) {
				font-size: 14px;
				color: #1f2937;
				padding-bottom: 8px;
			}

			// 禁用状态样式
			:deep(.el-input.is-disabled .el-input__wrapper) {
				background-color: #f5f7fa;
				box-shadow: 0 0 0 1px #e4e7ed inset;
			}

			:deep(.el-input.is-disabled .el-input__inner) {
				color: #1f2937;
				cursor: not-allowed;
			}
		}
	}
}
</style>