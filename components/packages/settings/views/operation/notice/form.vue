<template>
	<el-dialog
		:title="form.id ? $t('common.editBtn') : $t('common.addBtn')"
		v-model="visible"
		:destroy-on-close="true"
		:close-on-click-modal="false"
		draggable
		width="820"
	>
		<el-form :disabled="readyOnly" ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="120px" v-loading="loading">
			<el-form-item label="公告标题" prop="title">
				<div class="base_info">
					<el-input v-model="form.title" placeholder="请输入公告标题" />
				</div>
			</el-form-item>
			<el-Row style="width: 100%" justify="space-between">
				<el-Col :span="11">
					<el-form-item label="公告发布时间" prop="pushDate">
						<div class="base_info">
							<el-date-picker v-model="form.pushDate" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" />
						</div>
					</el-form-item>
				</el-Col>
				<el-Col :span="11">
					<el-form-item label="发布截止日期" prop="expirationDate">
						<div class="from_inof">
							<el-date-picker v-model="form.expirationDate" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" />
						</div>
					</el-form-item>
				</el-Col>
			</el-Row>
			<el-form-item label="公告内容" prop="context">
				<el-input type="textarea" v-model="form.context" placeholder="请输入规则描述" />
			</el-form-item>
			<el-form-item label="附件" prop="fileUrl">
				<uploadFile :isOriginalFilename="true" type="default" :fileType="[]" v-model="form.fileUrl" :limit="1" :fileSize="40" :isShowTip="true" />
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
import { getNoticeObj, addNoticeObj, updateNoticeObj } from '/@/api/newAnnoun/notice';
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
	title: '',
	pushDate: '',
	expirationDate: '',
	context: '',
	fileUrl: '',
});
// 定义校验规则
const dataRules = ref({
	title: [{ required: true, message: '公告标题不能为空', trigger: 'blur' }],
	pushDate: [{ required: true, message: '公告发布时间不能为空', trigger: 'blur' }],
	expirationDate: [{ required: true, message: '发布截止日期不能为空', trigger: 'blur' }],
	context: [{ required: true, message: '公告内容不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = async (id: string) => {
	visible.value = true;
	form.id = '';
	form.title = '';
	form.pushDate = '';
	form.expirationDate = '';
	form.context = '';
	form.fileUrl = '';

	// 获取DatasourceConf信息
	if (id) {
		form.id = id;
		getDatasourceConfData(id);
	}
};

// 初始化表单数据
const getDatasourceConfData = (id: string) => {
	// 获取数据

	return getNoticeObj({ id: id }).then((res: any) => {
		Object.assign(form, res.data); // 表单数据
	});
};

// 提交
const onSubmit = async () => {
	try {
		loading.value = true;
		let params = {
			...form,
		} as any;

		params.expirationTime = params?.expirationDate;
		params.pushTime = params?.pushDate;

		const res = form.id ? await updateNoticeObj(params) : await addNoticeObj(params);
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

.from_inof {
	margin-bottom: 18px;
}
</style>
