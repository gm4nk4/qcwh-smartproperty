<template>
	<LoginPage
		:background-image="loginBackground"
		:brand-badge="brandBadge"
		:title="getThemeConfig.globalTitle"
		:welcome-text="$t('page.welcome')"
		:subtitle-text="$t('page.subtitle')"
		:footer="getThemeConfig.footerAuthor"
	>
		<LoginPassword
			:label-username="$t('page.username')"
			:label-password="$t('page.password')"
			:label-verify="$t('page.imageCode')"
			:placeholder-username="$t('password.accountPlaceholder1')"
			:placeholder-password="$t('password.accountPlaceholder2')"
			:placeholder-code="$t('password.accountPlaceholder3')"
			:btn-text="$t('password.accountBtnText')"
			:verify-enable="verifyEnable"
			:img-src="imgSrc"
			:on-login="handleLogin"
			:on-refresh-code="handleRefreshCode"
			@refresh-code="handleRefreshCode"
			@sign-in-success="signInSuccess"
		/>
	</LoginPage>
</template>

<script setup lang="ts" name="loginIndex">
import { computed, ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useThemeImage } from '/@/utils/themeImages';
import { NextLoading } from '/@/utils/loading';
import { useI18n } from 'vue-i18n';
import { formatAxis } from '/@/utils/formatTime';
import { useMessage } from '/@/hooks/message';
import { Session } from '/@/utils/storage';
import { initBackEndControlRoutes } from '/@/router/backEnd';
import { useUserInfo } from '/@/stores/userInfo';
import { generateUUID } from '/@/utils/other';
import { LoginPage } from '@zhqc-smart/login';
import { LoginPassword } from '@zhqc-smart/login';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const loginBackground = useThemeImage('loginBackground');
const brandBadge = useThemeImage('brandBadge');

const getThemeConfig = computed(() => {
	return themeConfig.value;
});

const verifyEnable = ref(import.meta.env.VITE_VERIFY_ENABLE === 'true');
const imgSrc = ref('');
const currentRandomStr = ref('');

const getVerifyCode = () => {
	currentRandomStr.value = generateUUID();
	imgSrc.value = `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_IS_MICRO == 'false' ? '/admin' : '/auth'}/code/image?randomStr=${currentRandomStr.value}`;
};

const handleLogin = async (data: any) => {
	data.randomStr = currentRandomStr.value;
	await useUserInfo().login(data);
};

const handleRefreshCode = () => {
	getVerifyCode();
};

const signInSuccess = async () => {
	const isNoPower = await initBackEndControlRoutes();
	if (isNoPower) {
		useMessage().warning('抱歉，您没有登录权限');
		Session.clear();
	} else {
		let currentTimeInfo = formatAxis(new Date());
		if (route.query?.redirect) {
			router.push({
				path: route.query?.redirect as string,
				query: Object.keys(route.query?.params as string).length > 0 ? JSON.parse(route.query?.params as string) : '',
			});
		} else {
			router.push('/');
		}
		const signInText = t('signInText');
		useMessage().success(`${currentTimeInfo}，${signInText}`);
		NextLoading.start();
	}
};

onMounted(() => {
	NextLoading.done();
	if (verifyEnable.value) {
		getVerifyCode();
	}
});
</script>
