<template>
	<el-dialog title="车位配置" v-model="visible" :close-on-click-modal="false" draggable width="500">
		<el-form :model="form" :rules="dataRules" label-width="100px" ref="dataFormRef" v-loading="loading">
			<!-- 车位编号 -->
			<el-form-item label="车位编号" prop="code">
				<el-input v-model="form.code" placeholder="请输入车位编号" />
			</el-form-item>

			<!-- 车位类型 -->
			<el-form-item label="车位类型" prop="type">
				<el-select v-model="form.type" placeholder="请选择车位类型" style="width: 100%">
					<el-option label="月租" value="月租" />
					<el-option label="临时" value="临时" />
				</el-select>
			</el-form-item>

			<!-- 感应器设备 -->
			<el-form-item label="感应器设备" prop="sensor">
				<el-input v-model="form.sensor" placeholder="请输入感应器设备编号" />
			</el-form-item>
		</el-form>

		<!-- 底部提示信息区 -->
		<div class="info-tip">
			<el-icon class="info-icon"><InfoFilled /></el-icon>
			<span>当前忙闲状态由感应器实时获取，无需手动设置。车位编号不可与已有车位重复。</span>
		</div>

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">取消</el-button>
				<el-button type="primary" :disabled="loading" @click="onSubmit">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="SetDialog" setup>
import { InfoFilled } from '@element-plus/icons-vue';
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
	type: '',
	sensor: '',
});

// 定义校验规则
const dataRules = ref({
	code: [{ required: true, message: '请输入车位编号', trigger: 'blur' }],
	type: [{ required: true, message: '请选择车位类型', trigger: 'change' }],
	sensor: [{ required: true, message: '请输入感应器设备编号', trigger: 'blur' }],
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
		// TODO: 调用配置接口
		console.log('配置车位', form);
		useMessage().success('配置成功');
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
.info-tip {
	display: flex;
	align-items: flex-start;
	padding: 12px 16px;
	background: var(--el-color-primary-light-9);
	border-radius: 4px;
	margin-top: 16px;
}

.info-icon {
	color: var(--el-color-primary);
	font-size: 18px;
	margin-right: 8px;
	flex-shrink: 0;
	margin-top: 2px;
}

.info-tip span {
	color: var(--el-color-primary);
	font-size: 14px;
	line-height: 1.5;
}
</style>
