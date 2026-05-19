<template>
	<el-dialog :close-on-click-modal="false" :title="form.id ? '编辑' : '新增'" width="700" draggable v-model="visible">
		<el-form :model="form" :rules="dataRules" label-width="100px" ref="dataFormRef" v-loading="loading">
			<el-form-item label="停车场编号" prop="parkingGroundCode">
				<el-input placeholder="请输入停车场编号" v-model="form.parkingGroundCode" :disabled="!!form.id" />
			</el-form-item>
			<el-row :gutter="20" class="row-margin">
				<el-col :span="12">
					<el-form-item label="停车场名称" prop="parkingGroundName">
						<el-input placeholder="请输入停车场名称" v-model="form.parkingGroundName" />
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="位置" prop="location">
						<el-input placeholder="请输入位置" v-model="form.location" />
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20" class="row-margin">
				<el-col :span="12">
					<el-form-item label="类型" prop="type">
						<el-select v-model="form.type" placeholder="请选择类型" style="width: 100%">
							<el-option label="地下" value="under" />
							<el-option label="地面" value="ground" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="总车位数" prop="totalSpaces">
						<el-input-number v-model="form.totalSpaces" :min="0" :max="99999" placeholder="请输入总车位数" style="width: 100%" />
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20" class="row-margin">
				<el-col :span="12">
					<el-form-item label="运营时间" prop="operationTime">
						<el-input placeholder="请输入运营时间" v-model="form.operationTime" />
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="负责人" prop="personInCharge">
						<el-input placeholder="请输入负责人" v-model="form.personInCharge" />
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20" class="row-margin">
				<el-col :span="24">
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

<script lang="ts" name="ParkingInfoDialog" setup>
import { ref, reactive, nextTick } from 'vue';
import { useMessage } from '/@/hooks/message';
import { addParkingGround, editParkingGround } from '/@/api/parkingInfo';
import type { ParkingGround } from '/@/api/parkingInfo/type';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 提交表单数据
const form = reactive<ParkingGround>({
	id: undefined,
	parkingGroundCode: '',
	parkingGroundName: '',
	location: '',
	type: 'under',
	totalSpaces: 100,
	operationTime: '',
	personInCharge: '',
	contactPhone: '',
	status: 'running',
});

// 定义校验规则
const dataRules = ref({
	parkingGroundCode: [{ required: true, message: '请输入停车场编号', trigger: 'blur' }],
	parkingGroundName: [{ required: true, message: '请输入停车场名称', trigger: 'blur' }],
	location: [{ required: true, message: '请输入位置', trigger: 'blur' }],
	type: [{ required: true, message: '请选择类型', trigger: 'change' }],
	totalSpaces: [{ required: true, message: '请输入总车位数', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = async (id?: number, row?: ParkingGround) => {
	// 先重置表单为初始状态
	form.id = undefined;
	form.parkingGroundCode = '';
	form.parkingGroundName = '';
	form.location = '';
	form.type = 'under';
	form.totalSpaces = 100;
	form.operationTime = '';
	form.personInCharge = '';
	form.contactPhone = '';
	form.status = 'running';

	// 编辑时填充数据
	if (id && row) {
		Object.assign(form, row);
	}

	visible.value = true;

	// 等待DOM更新后重置表单验证状态
	await nextTick();
	dataFormRef.value?.clearValidate();
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		const res = form.id ? await editParkingGround(form) : await addParkingGround(form);
		if (res.code === 0) {
			useMessage().success(form.id ? '编辑成功' : '新增成功');
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
</style>