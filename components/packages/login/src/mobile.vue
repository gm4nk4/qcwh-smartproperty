<template>
	<el-form size="large" class="login-content-form" ref="loginFormRef" :rules="loginRules" :model="loginForm" @keyup.enter="handleLogin">
		<el-form-item class="login-animation1" prop="mobile">
			<el-input text :placeholder="placeholderMobile" v-model="loginForm.mobile" clearable autocomplete="off">
				<template #prefix>
					<i class="iconfont icon-dianhua el-input__icon"></i>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation2" prop="code">
			<el-col :span="15">
				<el-input text maxlength="6" :placeholder="placeholderCode" v-model="loginForm.code" clearable autocomplete="off">
					<template #prefix>
						<el-icon class="el-input__icon">
							<Position />
						</el-icon>
					</template>
				</el-input>
			</el-col>
			<el-col :span="1"></el-col>
			<el-col :span="8">
				<el-button v-waves class="login-content-code" @click="handleSendCode" :loading="msgLoading">{{ msgText }} </el-button>
			</el-col>
		</el-form-item>
		<el-form-item class="login-animation3">
			<el-button type="primary" v-waves class="login-content-submit" @click="handleLogin" :loading="loading">
				<span>{{ btnText }}</span>
			</el-button>
		</el-form-item>
	</el-form>
</template>

<script setup lang="ts" name="loginMobile">
import { Position } from '@element-plus/icons-vue';

const props = defineProps<{
	placeholderMobile?: string;
	placeholderCode?: string;
	btnText?: string;
	msgText?: string;
	onSendCode?: (mobile: string) => Promise<void>;
	onLogin?: (data: { mobile: string; code: string }) => Promise<void>;
}>();

const emit = defineEmits(['signInSuccess']);

const loginFormRef = ref();
const loading = ref(false);
const msgLoading = ref(false);

const loginForm = reactive({
	mobile: '',
	code: '',
});

const loginRules = computed(() => ({
	mobile: [
		{ required: true, trigger: 'blur', message: props.placeholderMobile || '请输入手机号' },
	],
	code: [
		{ required: true, trigger: 'blur', message: props.placeholderCode || '请输入验证码' },
	],
}));

const msgText = ref(props.msgText || '发送验证码');

const handleSendCode = async () => {
	const valid = await loginFormRef.value?.validateField('mobile').catch(() => {});
	if (!valid) return;

	msgLoading.value = true;
	try {
		if (props.onSendCode) {
			await props.onSendCode(loginForm.mobile);
		}
		timeCalc();
	} finally {
		msgLoading.value = false;
	}
};

let timer: ReturnType<typeof setInterval> | null = null;
const timeCalc = () => {
	let seconds = 60;
	msgText.value = `${seconds}s`;
	timer = setInterval(() => {
		seconds--;
		if (seconds <= 0) {
			if (timer) clearInterval(timer);
			timer = null;
			msgText.value = props.msgText || '发送验证码';
		} else {
			msgText.value = `${seconds}s`;
		}
	}, 1000);
};

const handleLogin = async () => {
	const valid = await loginFormRef.value?.validate().catch(() => {});
	if (!valid) return;

	loading.value = true;
	try {
		if (props.onLogin) {
			await props.onLogin({ ...loginForm });
		}
		emit('signInSuccess');
	} finally {
		loading.value = false;
	}
};
</script>