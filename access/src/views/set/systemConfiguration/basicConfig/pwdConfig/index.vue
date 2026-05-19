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
				<el-form ref="dataFormRef" :model="form" :rules="dataRules" label-width="240px" v-loading="loading">
					<el-col :span="24" style="margin-bottom: 20px">
						<el-popover placement="top-start" title="Title" :width="200" trigger="hover" content="大写字母包含：A~Z">
							<template #reference>
								<el-form-item label="是否强制包含大写字母" prop="CONTAINS_UPPER_CASE">
									<el-switch
										v-model="form.CONTAINS_UPPER_CASE"
										class="ml-2"
										style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949; width: 200px"
										inactive-text="禁用"
										active-text="启用"
										active-value="1"
										inactive-value="0"
									/>
								</el-form-item>
							</template>
						</el-popover>
					</el-col>
					<el-col :span="24" style="margin-bottom: 20px">
						<el-popover placement="top-start" title="Title" :width="200" trigger="hover" content="小写字母包含：a~z">
							<template #reference>
								<el-form-item label="是否强制包含小写字母" prop="CONTAINS_LOWER_CASE">
									<el-switch
										v-model="form.CONTAINS_LOWER_CASE"
										class="ml-2"
										style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949; width: 200px"
										inactive-text="禁用"
										active-text="启用"
										active-value="1"
										inactive-value="0"
									/>
								</el-form-item>
							</template>
						</el-popover>
					</el-col>

					<el-col :span="24" style="margin-bottom: 20px">
						<el-popover placement="top-start" title="Title" :width="200" trigger="hover" content="数字包含：0~9">
							<template #reference>
								<el-form-item label="是否强制包含数字" prop="CONTAINS_DIGIT">
									<el-switch
										v-model="form.CONTAINS_DIGIT"
										class="ml-2"
										style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949; width: 200px"
										inactive-text="禁用"
										active-text="启用"
										active-value="1"
										inactive-value="0"
									/>
								</el-form-item>
							</template>
						</el-popover>
					</el-col>

					<el-col :span="24" style="margin-bottom: 20px">
						<el-popover placement="top-start" title="Title" :width="200" trigger="hover" content="特殊字符包含：()`!@#$%^&*_-+=|{}[]:;'<>,.?">
							<template #reference>
								<el-form-item label="是否强制包含特殊字符" prop="CONTAINS_SPECIAL_CHAR">
									<el-switch
										v-model="form.CONTAINS_SPECIAL_CHAR"
										class="ml-2"
										style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949; width: 200px"
										inactive-text="禁用"
										active-text="启用"
										active-value="1"
										inactive-value="0"
									/>
								</el-form-item>
							</template>
						</el-popover>
					</el-col>
					<el-col :span="24" style="margin-bottom: 20px">
						<el-form-item label="密码最小长度" prop="CONTAINS_LENGTH">
							<el-input-number
								v-model="form.CONTAINS_LENGTH"
								:min="1"
								:max="999"
								controls-position="right"
								placeholder="请输入密码最小长度"
								style="max-width: 480px"
							>
							</el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="24" style="margin-bottom: 20px">
						<el-popover placement="top-start" title="Title" :width="200" trigger="hover" content="默认密码为用户创建时的初始密码，不受密码策略限制">
							<template #reference>
								<el-form-item label="账号默认密码" prop="DEFAULT_PASSWORD">
									<el-input v-model="form.DEFAULT_PASSWORD" style="width: 480px" placeholder="请输入账号默认密码" type="password" show-password />
								</el-form-item>
							</template>
						</el-popover>
					</el-col>
				</el-form>
			</el-card>
		</el-col>
	</el-row>
</template>

<script lang="ts" name="pwdConfig" setup>
import { useI18n } from 'vue-i18n';
import { useMessage } from '/@/hooks/message';
import { getParamPage, updateParambatchUpdate } from '/@/api/systemConfiguration/basicConfig';
import { transformObject, mergeAndUpdateArrays } from '/@/utils/arrayOperation';

// 引入组件

const { t } = useI18n();
// 定义变量内容
const dataFormRef = ref();
const loading = ref(false);

// 提交表单数据
const editForm = reactive([]);
const form = reactive({
	CONTAINS_UPPER_CASE: '0',
	CONTAINS_LOWER_CASE: '0',
	CONTAINS_DIGIT: '0',
	CONTAINS_SPECIAL_CHAR: '0',
	CONTAINS_LENGTH: '6',
	DEFAULT_PASSWORD: '123456',
});

// 定义校验规则
const dataRules = ref({
	CONTAINS_UPPER_CASE: [{ required: true, message: '是否强制包含大写字母不能为空', trigger: 'blur' }],
	CONTAINS_LOWER_CASE: [{ required: true, message: '是否强制包含小写字母不能为空', trigger: 'blur' }],
	CONTAINS_DIGIT: [{ required: true, message: '是否强制包含数字不能为空', trigger: 'blur' }],
	CONTAINS_SPECIAL_CHAR: [{ required: true, message: '是否强制包含特殊字符不能为空', trigger: 'blur' }],
	CONTAINS_LENGTH: [{ required: true, message: '密码最小长度不能为空', trigger: 'blur' }],
	DEFAULT_PASSWORD: [{ required: true, message: '账号默认密码不能为空', trigger: 'blur' }],
});

onMounted(() => {
	getDatasourceConfData(); // 初始化表单数据
});

// 重置表单数据
const resetFrom = () => {
	form.CONTAINS_UPPER_CASE = '0';
	form.CONTAINS_LOWER_CASE = '0';
	form.CONTAINS_DIGIT = '0';
	form.CONTAINS_SPECIAL_CHAR = '0';
	form.CONTAINS_LENGTH = '6';
	form.DEFAULT_PASSWORD = '123456';
};

// 初始化表单数据
const getDatasourceConfData = () => {
	// 获取数据
	getParamPage({ validateCode: 'PasswordPolicy' }).then((res: any) => {
		let records = res?.data;
		// 先定义 form 的类型
		type PasswordFormType = typeof form;
		Object.assign(editForm, records); // 表单数据
		for (const element of records) {
			const key = element?.publicKey as keyof PasswordFormType;
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

	const transformedArray = transformObject(form, 'PasswordPolicy');
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
