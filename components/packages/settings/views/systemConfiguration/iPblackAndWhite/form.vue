<template>
	<el-dialog
		:title="form.id ? '编辑黑白名单' : '新增黑白名单'"
		v-model="visible"
		:destroy-on-close="true"
		:close-on-click-modal="false"
		draggable
		width="800"
	>
		<el-form :disabled="readyOnly" ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="120px" v-loading="loading">
			<el-form-item label="名单类型" prop="listRegistrationAction">
				<el-select v-model="form.listRegistrationAction" placeholder="请选择名单类型">
					<el-option label="黑名单" value="1" />
					<el-option label="白名单" value="0" />
				</el-select>
			</el-form-item>
			<el-form-item label="黑白名单ip" prop="ip">
				<el-input type="textarea" v-model="form.ip" placeholder="请输入黑白名单ip" :rows="6" />
			</el-form-item>
			<el-form-item label="原因说明" prop="remark">
				<el-input type="textarea" v-model="form.remark" placeholder="请输入原因说明" />
			</el-form-item>
			<el-form-item label="生效时间" prop="listRegistrationSelect">
				<el-radio-group v-model="form.listRegistrationSelect">
					<el-col :span="8">
						<el-radio :value="0">立即生效</el-radio>
					</el-col>
					<el-col :span="14" :offset="1">
						<el-radio :value="1"
							>自定义
							<el-date-picker v-model="form.takeEffectTime" type="datetime" placeholder="生效时间" value-format="YYYY-MM-DD HH:mm:ss" />
						</el-radio>
					</el-col>
				</el-radio-group>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" @click="onSubmit" :loading="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { useMessage } from '/@/hooks/message';
import { getObj, updateObj, addObj } from '/@/api/systemConfiguration/iPblackAndWhite';
import { formatDate } from '/@/utils/formatTime';
import { useI18n } from 'vue-i18n';
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const { t } = useI18n();

defineProps({
	readyOnly: {
		type: Boolean,
		default: () => false,
	},
});

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 提交表单数据
const form = reactive({
	id: '',
	listRegistrationAction: '0',
	ip: '',
	remark: '',
	listRegistrationSelect: 1,
	takeEffectTime: '',
});

// 定义校验规则
const dataRules = ref({
	listRegistrationAction: [{ required: true, message: '请选择名单类型', trigger: 'blur' }],
	ip: [{ required: true, message: '黑白名单ip不能为空', trigger: 'blur' }],
	listRegistrationSelect: [{ required: true, message: '请选择生效时间', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = async (id: any) => {
	visible.value = true;
	form.id = '';
	form.listRegistrationAction = '0';
	form.ip = '';
	form.remark = '';
	form.listRegistrationSelect = 1;
	form.takeEffectTime = '';

	// 获取DatasourceConf信息
	if (id) {
		form.id = id;

		await getDatasourceConfData(id);
	}
};

// 初始化表单数据
const getDatasourceConfData = (id: string) => {
	// 获取数据

	return getObj({ id: id }).then((res: any) => {
		Object.assign(form, res.data[0]); // 表单数据
	});
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	let params = {
		...form,
	};

	if (params.listRegistrationSelect === 0) {
		params.takeEffectTime = formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss');
	}
	try {
		loading.value = true;
		const res = form.id ? await updateObj(params) : await addObj(params);
		if (res.data) {
			useMessage().success(t(form.id ? 'common.editSuccessText' : 'common.addSuccessText'));
			visible.value = false;
			emit('refresh');
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped>
.base_info {
	display: flex;
	align-items: center;
	width: 100%;
}
</style>
