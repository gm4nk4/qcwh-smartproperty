<template>
	<el-dialog :close-on-click-modal="false" :title="form.id ? '编辑' : '新增'" width="700" draggable v-model="visible">
		<el-form :model="form" :rules="dataRules" label-width="100px" ref="dataFormRef" v-loading="loading">
			<el-form-item label="停车场编号" prop="code">
				<el-input placeholder="请输入停车场编号" v-model="form.code" :disabled="!!form.id" />
			</el-form-item>
			<el-row :gutter="20" class="row-margin">
				<el-col :span="12">
					<el-form-item label="停车场名称" prop="name">
						<el-input placeholder="请输入停车场名称" v-model="form.name" />
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
							<el-option label="地下" value="地下" />
							<el-option label="地面" value="地面" />
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
					<el-form-item label="负责人" prop="manager">
						<el-input placeholder="请输入负责人" v-model="form.manager" />
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item label="联系电话" prop="phone">
				<el-input placeholder="请输入联系电话" v-model="form.phone" />
			</el-form-item>
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
	code: '',
	name: '',
	location: '',
	type: '',
	totalSpaces: 100,
	operationTime: '',
	manager: '',
	phone: '',
});

// 定义校验规则
const dataRules = ref({
	code: [{ required: true, message: '请输入停车场编号', trigger: 'blur' }],
	name: [{ required: true, message: '请输入停车场名称', trigger: 'blur' }],
	location: [{ required: true, message: '请输入位置', trigger: 'blur' }],
	type: [{ required: true, message: '请选择类型', trigger: 'change' }],
	totalSpaces: [{ required: true, message: '请输入总车位数', trigger: 'blur' }],
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
	}
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		// TODO: 调用新增/编辑接口
		// form.id ? await putObj(form) : await addObj(form);
		useMessage().success(form.id ? '编辑成功' : '新增成功');
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
</style>
