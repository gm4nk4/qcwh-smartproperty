<template>
	<el-form size="large" class="login-content-form" ref="loginFormRef" :rules="loginRules" :model="state.ruleForm" @keyup.enter="onSignIn">
		<div class="login-field login-animation1">
			<div class="login-field__label">{{ $t('page.username') }}</div>
			<el-form-item prop="username">
				<el-input v-model="state.ruleForm.username" :placeholder="$t('password.accountPlaceholder1')" autocomplete="username" />
			</el-form-item>
		</div>
		<div class="login-field login-animation2">
			<div class="login-field__label">{{ $t('page.password') }}</div>
			<el-form-item prop="password">
				<el-input
					v-model="state.ruleForm.password"
					:type="state.isShowPassword ? 'text' : 'password'"
					:placeholder="$t('password.accountPlaceholder2')"
					autocomplete="current-password"
				>
					<template #suffix>
						<button
							type="button"
							class="login-password-toggle"
							aria-label="切换密码显示"
							@mousedown.prevent
							@click="state.isShowPassword = !state.isShowPassword"
						>
							<el-icon>
								<ele-View v-if="state.isShowPassword" />
								<ele-Hide v-else />
							</el-icon>
						</button>
					</template>
				</el-input>
			</el-form-item>
		</div>
		<div v-if="verifyEnable" class="login-field login-animation3">
			<div class="login-field__label">{{ $t('page.imageCode') }}</div>
			<el-form-item prop="code" class="login-form-item--verify">
				<div class="login-verify-row">
					<el-input v-model="state.ruleForm.code" maxlength="4" :placeholder="$t('mobile.placeholder2')" autocomplete="off" />
					<button type="button" class="login-verify-image" @click="getVerifyCode">
						<img :src="imgSrc" alt="验证码" />
					</button>
				</div>
			</el-form-item>
		</div>
		<el-form-item class="login-form-item--submit login-animation4">
			<el-button type="primary" class="login-content-submit" :loading="loading" @click="onSignIn">
				<span>{{ $t('password.accountBtnText') }}</span>
			</el-button>
		</el-form-item>
	</el-form>
</template>

<script setup lang="ts" name="password">
import { useUserInfo } from '/@/stores/userInfo';
import { useI18n } from 'vue-i18n';
import { generateUUID } from '/@/utils/other';
import { rule } from '/@/utils/validate';
// 使用国际化插件
import { isQiankun } from '/@/main';
const { t } = useI18n();

// 定义变量内容
const emit = defineEmits(['signInSuccess']); // 声明事件名称
const loginFormRef = ref(); // 定义LoginForm表单引用
const loading = ref(false); // 定义是否正在登录中
const state = reactive({
	isShowPassword: false, // 是否显示密码
	ruleForm: {
		// 表单数据
		username: '', // 用户名
		password: '', // 密码
		code: '', // 验证码
		randomStr: '', // 验证码随机数
	},
});

const loginRules = reactive({
	username: [
		{ validator: rule.overLength, trigger: 'blur' },
		{ required: true, trigger: 'blur', message: t('password.accountPlaceholder1') },
	], // 用户名校验规则
	password: [
		{ validator: rule.overLength, trigger: 'blur' },
		{ required: true, trigger: 'blur', message: t('password.accountPlaceholder2') },
	], // 密码校验规则
	code: [
		{ validator: rule.overLength, trigger: 'blur' },
		{ required: true, trigger: 'blur', message: t('password.accountPlaceholder3') },
	], // 验证码校验规则
});

// 是否开启验证码
const verifyEnable = ref(import.meta.env.VITE_VERIFY_ENABLE === 'true');
const imgSrc = ref('');

//获取验证码图片
const getVerifyCode = () => {
	state.ruleForm.randomStr = generateUUID();
	imgSrc.value = `${isQiankun ? import.meta.env.VITE_API_URL_QIANKUN : import.meta.env.VITE_API_URL}${import.meta.env.VITE_IS_MICRO == 'false' ? '/admin' : '/auth'}/code/image?randomStr=${state.ruleForm.randomStr}`;
};

// 账号密码登录
const onSignIn = async () => {
	const valid = await loginFormRef.value.validate().catch(() => {}); // 表单校验
	if (!valid) return false;

	loading.value = true; // 正在登录中
	try {
		await useUserInfo().login(state.ruleForm); // 调用登录方法
		emit('signInSuccess'); // 触发事件
	} catch (_error) {
		getVerifyCode();
	} finally {
		loading.value = false; // 登录结束
	}
};

onMounted(() => {
	getVerifyCode();
});
</script>
