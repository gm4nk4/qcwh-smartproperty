<template>
	<div class="device-maintain-dialog-container">
		<el-dialog :close-on-click-modal="false" :title="isEdit ? '编辑岗亭设备' : '新增岗亭设备'" draggable v-model="visible" width="960px">
			<el-form :model="formData" :rules="rules" label-width="100px" ref="dataFormRef" v-loading="loading">
				<!-- 模块1：基本信息 -->
				<div class="form-section">
					<div class="section-title">
						<el-icon class="section-icon"><InfoFilled /></el-icon>
						<span>基本信息</span>
					</div>
					<el-row :gutter="20">
						<el-col :span="12" class="mb20">
							<el-form-item label="岗亭编号" prop="code">
								<el-input v-model="formData.code" placeholder="请输入岗亭编号" clearable />
							</el-form-item>
						</el-col>
						<el-col :span="12" class="mb20">
							<el-form-item label="岗亭名称" prop="gateName">
								<el-input v-model="formData.gateName" placeholder="请输入岗亭名称" clearable />
							</el-form-item>
						</el-col>
						<el-col :span="12" class="mb20" v-if="!isEdit">
							<el-form-item label="状态" prop="status">
								<el-select v-model="formData.status" placeholder="请选择状态" class="w100">
									<el-option label="正常" value="normal" />
									<el-option label="故障" value="fault" />
									<el-option label="停用" value="disabled" />
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
				</div>

				<!-- 模块2：监控摄像头绑定 -->
				<div class="form-section">
					<div class="section-title">
						<el-icon class="section-icon"><VideoCamera /></el-icon>
						<span>监控摄像头绑定</span>
					</div>
					<div class="dynamic-list">
						<el-row v-for="(camera, index) in formData.cameraBindings" :key="index" :gutter="20" class="dynamic-row mb20">
							<el-col :span="22">
								<el-form-item :label="'摄像头' + (index + 1)">
									<el-select v-model="camera.cameraId" placeholder="请选择摄像头" class="w100" clearable>
										<el-option v-for="item in cameraOptions" :key="item.id" :label="item.name" :value="item.id" />
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="2" class="dynamic-action-col">
								<el-button v-if="formData.cameraBindings.length > 1" type="danger" link icon="Delete" @click="removeCameraBinding(index)" />
							</el-col>
						</el-row>
						<el-button class="add-btn" type="primary" link icon="Plus" @click="addCameraBinding">添加摄像头</el-button>
					</div>
				</div>

				<!-- 模块3：通行配置 -->
				<div class="form-section">
					<div class="section-title">
						<el-icon class="section-icon"><Setting /></el-icon>
						<span>通行配置</span>
					</div>
					<el-row :gutter="20">
						<el-col :span="12" class="mb20">
							<el-form-item label="临时车进场" prop="tempCarIn">
								<el-select v-model="formData.tempCarIn" placeholder="请选择" class="w100">
									<el-option label="允许" value="allow" />
									<el-option label="禁止" value="forbidden" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="mb20">
							<el-form-item label="访客车进场" prop="visitorCarIn">
								<el-select v-model="formData.visitorCarIn" placeholder="请选择" class="w100">
									<el-option label="允许" value="allow" />
									<el-option label="禁止" value="forbidden" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="mb20">
							<el-form-item label="是否收费" prop="hasFee">
								<el-select v-model="formData.hasFee" placeholder="请选择" class="w100">
									<el-option label="是" value="yes" />
									<el-option label="否" value="no" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="mb20">
							<el-form-item label="通行方向" prop="direction">
								<el-select v-model="formData.direction" placeholder="请选择" class="w100">
									<el-option label="可进场" value="可进场" />
									<el-option label="可出场" value="可出场" />
									<el-option label="可进出" value="可进出" />
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
				</div>

				<!-- 模块4：道闸绑定 -->
				<div class="form-section">
					<div class="section-title">
						<el-icon class="section-icon"><Bottom /></el-icon>
						<span>道闸绑定<span class="section-subtitle">（选择道闸设备后绑定服务接口）</span></span>
					</div>
					<div class="dynamic-list">
						<el-row v-for="(barrier, index) in formData.barrierBindings" :key="index" :gutter="20" class="dynamic-row mb20">
							<el-col :span="11">
								<el-form-item
									:prop="`barrierBindings.${index}.barrierDevice`"
									:rules="[{ required: true, message: '请选择道闸设备', trigger: 'change' }]"
								>
									<template #label>
										<span>道闸设备</span>
									</template>
									<el-select v-model="barrier.barrierDevice" placeholder="请选择道闸设备" class="w100" clearable>
										<el-option v-for="item in barrierOptions" :key="item.id" :label="item.name" :value="item.name" />
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="11">
								<el-form-item
									:prop="`barrierBindings.${index}.serviceInterface`"
									:rules="[{ required: true, message: '请输入服务接口地址', trigger: 'blur' }]"
								>
									<template #label>
										<span>服务接口</span>
									</template>
									<el-input v-model="barrier.serviceInterface" placeholder="请输入服务接口地址" clearable />
								</el-form-item>
							</el-col>
							<el-col :span="2" class="dynamic-action-col">
								<el-button v-if="formData.barrierBindings.length > 1" type="danger" link icon="Delete" @click="removeBarrierBinding(index)" />
							</el-col>
						</el-row>
						<el-button class="add-btn" type="primary" link icon="Plus" @click="addBarrierBinding">添加道闸</el-button>
					</div>
				</div>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="visible = false">取消</el-button>
					<el-button type="primary" @click="onSubmit" :disabled="loading">确定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" name="deviceMaintainEditDialog" setup>
import { ref, reactive } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { InfoFilled, VideoCamera, Setting, Bottom } from '@element-plus/icons-vue';
import { useMessage } from '/@/hooks/message';

const emit = defineEmits(['refresh']);

interface CameraBinding {
	cameraId: number | null;
}

interface BarrierBinding {
	barrierDevice: string;
	serviceInterface: string;
}

// 定义变量内容
const dataFormRef = ref<FormInstance>();
const visible = ref(false);
const loading = ref(false);
const isEdit = ref(false);

// 摄像头选项（模拟数据）
const cameraOptions = ref([
	{ id: 1, name: '东门出口广角' },
	{ id: 2, name: '东门出口识别' },
	{ id: 3, name: '东门出口全景' },
	{ id: 4, name: '西门入口摄像头' },
	{ id: 5, name: '西门入口辅摄' },
	{ id: 6, name: '地下车库入口摄像头' },
]);

// 道闸设备选项（模拟数据）
const barrierOptions = ref([
	{ id: 1, name: '东门出口杆' },
	{ id: 2, name: '东门入口杆' },
	{ id: 3, name: '西门入口道闸' },
	{ id: 4, name: '地下车库道闸' },
]);

const formData = reactive({
	id: null as number | null,
	code: '',
	gateName: '',
	status: 'normal' as string,
	cameraBindings: [{ cameraId: null }] as CameraBinding[],
	tempCarIn: 'forbidden',
	visitorCarIn: 'forbidden',
	hasFee: 'yes',
	direction: '可出场',
	barrierBindings: [{ barrierDevice: '', serviceInterface: '' }] as BarrierBinding[],
});

const rules: FormRules = {
	gateName: [{ required: true, message: '请输入岗亭名称', trigger: 'blur' }],
};

// 添加摄像头绑定
const addCameraBinding = () => {
	formData.cameraBindings.push({ cameraId: null });
};

// 删除摄像头绑定
const removeCameraBinding = (index: number) => {
	if (formData.cameraBindings.length > 1) {
		formData.cameraBindings.splice(index, 1);
	}
};

// 添加道闸绑定
const addBarrierBinding = () => {
	formData.barrierBindings.push({ barrierDevice: '', serviceInterface: '' });
};

// 删除道闸绑定
const removeBarrierBinding = (index: number) => {
	if (formData.barrierBindings.length > 1) {
		formData.barrierBindings.splice(index, 1);
	}
};

// 打开弹窗
const openDialog = (row?: any) => {
	visible.value = true;
	isEdit.value = !!row;

	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	if (row) {
		Object.assign(formData, {
			id: row.id,
			code: row.code,
			gateName: row.gateName,
			cameraBindings: row.cameras?.map((c: any) => ({ cameraId: c.id })) || [{ cameraId: null }],
			tempCarIn: row.tempCarIn,
			visitorCarIn: row.visitorCarIn,
			hasFee: row.hasFee,
			direction: row.direction,
			barrierBindings: row.barrierBindings || [{ barrierDevice: '', serviceInterface: '' }],
		});
	} else {
		resetForm();
	}
};

const resetForm = () => {
	Object.assign(formData, {
		id: null,
		code: '',
		gateName: '',
		status: 'normal',
		cameraBindings: [{ cameraId: null }],
		tempCarIn: 'forbidden',
		visitorCarIn: 'forbidden',
		hasFee: 'yes',
		direction: '可出场',
		barrierBindings: [{ barrierDevice: '', serviceInterface: '' }],
	});
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value?.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		// 构建提交数据
		const submitData = {
			...formData,
			cameras: formData.cameraBindings.filter((c) => c.cameraId !== null).map((c) => cameraOptions.value.find((opt) => opt.id === c.cameraId)),
		};
		console.log('提交数据:', submitData);
		useMessage().success(isEdit.value ? '修改成功' : '新增成功');
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
.form-section {
	margin-bottom: 24px;

	.section-title {
		display: flex;
		align-items: center;
		margin-bottom: 16px;
		padding-bottom: 12px;
		border-bottom: 1px solid #ebeef5;

		.section-icon {
			font-size: 18px;
			color: #409eff;
			margin-right: 8px;
		}

		> span {
			font-size: 16px;
			font-weight: 500;
			color: #303133;
		}

		.section-subtitle {
			font-size: 13px;
			color: #909399;
			margin-left: 4px;
			font-weight: 400;
		}
	}
}

.dynamic-list {
	.dynamic-row {
		margin-bottom: 0;
	}

	.dynamic-action-col {
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 4px;
	}

	.add-btn {
		margin-top: 8px;
	}
}

.required-star {
	color: #f56c6c;
	margin-left: 2px;
}

.w100 {
	width: 100%;
}

.mb20 {
	margin-bottom: 20px;
}
</style>
