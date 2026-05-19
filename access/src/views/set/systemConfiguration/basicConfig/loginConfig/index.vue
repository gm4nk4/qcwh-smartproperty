<template>
	<el-row style="height: 100%">
		<el-col :span="20" :offset="2" style="height: 100%; overflow: auto">
			<el-card>
				<template #header>
					<el-row>
						<el-col :span="24">
							<el-button @click="onSubmit" :loading="loading" icon="plus" type="primary"> 保存 </el-button>
							<el-button @click="resetFrom" icon="Refresh">重置</el-button>
						</el-col>
					</el-row>
				</template>
				<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="240px" v-loading="loading">
					<el-form-item label="首次登录是否更改密码" prop="IS_FIRST_CHANGE_PASSWORD">
						<el-switch
							v-model="form.IS_FIRST_CHANGE_PASSWORD"
							class="ml-2"
							style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949; width: 200px"
							inactive-text="禁用"
							active-text="启用"
							active-value="1"
							inactive-value="0"
						/>
					</el-form-item>
					<el-form-item label="token过期时间" prop="TOKEN_EXPIRATION_DATE">
						<el-input-number
							v-model="form.TOKEN_EXPIRATION_DATE"
							:min="1"
							:max="1440"
							controls-position="right"
							placeholder="请输入token过期时间"
							style="max-width: 480px"
						>
							<template #suffix>
								<span>分钟</span>
							</template>
						</el-input-number>
					</el-form-item>
					<el-form-item label="密码输入错误次数" prop="NUMBER_PASSWORD_ERRORS">
						<el-input-number
							v-model="form.NUMBER_PASSWORD_ERRORS"
							:min="1"
							:max="999"
							controls-position="right"
							placeholder="请输入密码输入错误次数"
							style="max-width: 480px"
						>
							<template #suffix>
								<span>次</span>
							</template>
						</el-input-number>
					</el-form-item>
					<el-form-item label="允许再次登录时间" prop="PASSWORD_ERROR_TIME">
						<el-input-number
							v-model="form.PASSWORD_ERROR_TIME"
							:min="1"
							:max="999"
							controls-position="right"
							placeholder="请输入允许再次登录时间"
							style="max-width: 480px"
						>
							<template #suffix>
								<span>分钟</span>
							</template>
						</el-input-number>
					</el-form-item>
					<el-form-item label="密码是否周期更换" prop="IS_PERIODIC_PASSWORD_CHANGE">
						<el-switch
							v-model="form.IS_PERIODIC_PASSWORD_CHANGE"
							class="ml-2"
							style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949; width: 200px"
							inactive-text="禁用"
							active-text="启用"
							active-value="1"
							inactive-value="0"
						/>
					</el-form-item>
					<el-form-item label="密码更换周期" prop="PASSWORD_CHANGE_CYCLE">
						<el-input-number
							v-model="form.PASSWORD_CHANGE_CYCLE"
							:min="1"
							:max="999"
							controls-position="right"
							placeholder="请输入密码更换周期"
							style="max-width: 480px"
						>
							<template #suffix>
								<span>天</span>
							</template>
						</el-input-number>
					</el-form-item>
				</el-form>
			</el-card>
		</el-col>
	</el-row>
</template>

<script lang="ts" name="loginConfig" setup>
import { useI18n } from 'vue-i18n';
import { useMessage } from '/@/hooks/message';
import { transformObject, mergeAndUpdateArrays } from '/@/utils/arrayOperation';
import { getParamPage, updateParambatchUpdate } from '/@/api/systemConfiguration/basicConfig';
// 引入组件

const { t } = useI18n();
// 定义变量内容
const dataFormRef = ref();
const loading = ref(false);

// 提交表单数据
const form = reactive({
	IS_FIRST_CHANGE_PASSWORD: '0',
	TOKEN_EXPIRATION_DATE: '720',
	NUMBER_PASSWORD_ERRORS: '5',
	PASSWORD_ERROR_TIME: '5',
	IS_PERIODIC_PASSWORD_CHANGE: '0',
	PASSWORD_CHANGE_CYCLE: '90',
});

// 提交表单数据
const editForm = reactive([]);

// 定义校验规则
const dataRules = ref({
	IS_FIRST_CHANGE_PASSWORD: [{ required: true, message: '首次登录是否更改密码不能为空', trigger: 'blur' }],
	TOKEN_EXPIRATION_DATE: [{ required: true, message: 'token过期时间不能为空', trigger: 'blur' }],
	NUMBER_PASSWORD_ERRORS: [{ required: true, message: '密码输入错误次数不能为空', trigger: 'blur' }],
	PASSWORD_ERROR_TIME: [{ required: true, message: '允许再次登录时间不能为空', trigger: 'blur' }],
	IS_PERIODIC_PASSWORD_CHANGE: [{ required: true, message: '密码是否周期更换不能为空', trigger: 'blur' }],
	PASSWORD_CHANGE_CYCLE: [{ required: true, message: '密码更换周期不能为空', trigger: 'blur' }],
});

onMounted(() => {
	getDatasourceConfData(); // 初始化表单数据
});

// 重置表单数据
const resetFrom = () => {
	form.IS_FIRST_CHANGE_PASSWORD = '0';
	form.TOKEN_EXPIRATION_DATE = '720';
	form.NUMBER_PASSWORD_ERRORS = '5';
	form.PASSWORD_ERROR_TIME = '5';
	form.IS_PERIODIC_PASSWORD_CHANGE = '0';
	form.PASSWORD_CHANGE_CYCLE = '90';
};

// 初始化表单数据
const getDatasourceConfData = () => {
	// 获取数据
	getParamPage({ validateCode: 'LoginParams' }).then((res: any) => {
		let records = res?.data;
		Object.assign(editForm, records); // 表单数据
		type FormType = typeof form;
		for (let index = 0; index < records.length; index++) {
			const element = records[index];
			const key = element?.publicKey as keyof FormType;
			if (key) {
				form[key] = element?.publicValue ?? '';
			}
		}
	});
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	const transformedArray = transformObject(form, 'LoginParams');

	let params = mergeAndUpdateArrays(editForm, transformedArray, 'publicKey'); // 表单数据
	try {
		loading.value = true;
		const res = await updateParambatchUpdate(params);
		if (res.data) {
			useMessage().success(t('common.editSuccessText'));
			getDatasourceConfData(); // 初始化表单数据
		}
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};
</script>

<style scoped lang="scss"></style>
