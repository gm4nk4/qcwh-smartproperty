<template>
	<div class="login-page select-none" :style="loginPageStyle">
		<div class="login-page__inner">
			<header class="login-page__brand">
				<img :src="brandBadge || logoMini" alt="" class="login-page__brand-logo" />
				<span class="login-page__brand-name">{{ getThemeConfig.globalTitle }}</span>
			</header>
			<main class="login-page__content">
				<div class="login-page__hero" aria-hidden="true"></div>
				<section class="login-page__panel">
					<p class="login-page__welcome">{{ $t('page.welcome') }}</p>
					<h1 class="login-page__title">{{ getThemeConfig.globalTitle }}</h1>
					<p class="login-page__subtitle">{{ $t('page.subtitle') }}</p>
					<div class="login-page__card">
						<Password @signInSuccess="signInSuccess" />
					</div>
				</section>
			</main>
			<footer class="login-page__footer">{{ getThemeConfig.footerAuthor }}</footer>
		</div>
	</div>
</template>

<script setup lang="ts" name="loginIndex">
import { useThemeConfig } from '/@/stores/themeConfig';
import { NextLoading } from '/@/utils/loading';
import { useThemeImage } from '/@/utils/themeImages';
import logoMini from '/@/assets/logo-mini.svg';
import { useI18n } from 'vue-i18n';
import { formatAxis } from '/@/utils/formatTime';
import { useMessage } from '/@/hooks/message';
import { Session } from '/@/utils/storage';
import { initBackEndControlRoutes } from '/@/router/backEnd';

// 引入组件
const Password = defineAsyncComponent(() => import('./component/password.vue'));

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const loginBackground = useThemeImage('loginBackground');
const brandBadge = useThemeImage('brandBadge');

// 获取布局配置信息
const getThemeConfig = computed(() => {
	return themeConfig.value;
});

const loginPageStyle = computed(() => ({
	backgroundImage: `url(${loginBackground.value})`,
}));

// 登录成功后的跳转处理事件
const signInSuccess = async () => {
	const isNoPower = await initBackEndControlRoutes();
	if (isNoPower) {
		useMessage().warning('抱歉，您没有登录权限');
		Session.clear();
	} else {
		// 初始化登录成功时间问候语
		let currentTimeInfo = formatAxis(new Date());
		if (route.query?.redirect) {
			router.push({
				path: <string>route.query?.redirect,
				query: Object.keys(<string>route.query?.params).length > 0 ? JSON.parse(<string>route.query?.params) : '',
			});
		} else {
			router.push('/');
		}
		// 登录成功提示
		const signInText = t('signInText');
		useMessage().success(`${currentTimeInfo}，${signInText}`);
		// 添加 loading，防止第一次进入界面时出现短暂空白
		NextLoading.start();
	}
};

// 页面加载时
onMounted(() => {
	NextLoading.done();
});
</script>
