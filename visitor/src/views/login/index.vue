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

<style lang="scss">
/* D5 登录页对齐 access。
 * 由于 visitor/src/theme/login.scss 不在本任务 Owns 之内（仅允许改 visitor/src/views/login/**），
 * 这里以未 scoped 的方式内联 access/src/theme/login.scss 中与新版 .login-page__* 结构对应的样式,
 * 让 visitor 与 access 在 visual / 主题变量上保持一致。
 * 原有的 visitor/src/theme/login.scss 中的 .login-container / .wave / .img / .login-box 等旧布局
 * 样式与此处类名不冲突,保持原样不删,以避免越界改动。
 */

.login-page {
	position: relative;
	min-height: 100vh;
	overflow: hidden;
	background-color: #edf5fc;
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
	font-family: 'Source Han Sans CN', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;

	&::before {
		position: absolute;
		inset: 0;
		content: '';
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(237, 245, 252, 0.18) 100%);
		pointer-events: none;
	}
}

.login-page__inner {
	--login-shell-top: clamp(28px, 3vw, 44px);
	--login-shell-x: clamp(34px, 4.2vw, 72px);
	--login-shell-bottom: 24px;
	--login-panel-right: clamp(24px, 9.27vw, 178px);
	position: relative;
	z-index: 1;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	padding: var(--login-shell-top) var(--login-shell-x) var(--login-shell-bottom);
}

.login-page__brand {
	position: absolute;
	top: var(--login-shell-top);
	left: var(--login-shell-x);
	display: inline-flex;
	align-items: center;
	gap: 16px;
	width: fit-content;
}

.login-page__brand-logo {
	display: block;
	width: 34px;
	height: 34px;
	flex: none;
	object-fit: contain;
	filter: none;
}

.login-page__brand-name {
	font-size: clamp(24px, 1.72vw, 33px);
	font-weight: 700;
	line-height: 1.1;
	letter-spacing: 0.02em;
	color: var(--theme-text-system);
}

.login-page__content {
	flex: 1;
	min-height: calc(100vh - var(--login-shell-top) - var(--login-shell-bottom));
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: clamp(56px, 10vw, 180px);
	padding: clamp(32px, 6vh, 72px) 0;
}

.login-page__hero {
	flex: 1 1 auto;
	min-height: clamp(420px, 44vw, 700px);
}

.login-page__panel {
	width: min(100%, 420px);
	margin-right: var(--login-panel-right);
}

.login-page__welcome {
	margin: 0 0 12px;
	font-size: clamp(18px, 1.6vw, 28px);
	font-weight: 700;
	line-height: 1.2;
	color: #5c6b83;
}

.login-page__title {
	margin: 0;
	font-size: clamp(34px, 2.4vw, 48px);
	font-weight: 700;
	line-height: 1.18;
	letter-spacing: 0.02em;
	color: var(--theme-text-system);
}

.login-page__subtitle {
	margin: 12px 0 0;
	font-size: 14px;
	line-height: 22px;
	color: #7f8ca3;
}

.login-page__card {
	margin-top: 30px;
	padding: 24px 18px 22px;
	border: 1px solid rgba(255, 255, 255, 0.82);
	border-radius: 14px;
	background: rgba(255, 255, 255, 0.94);
	box-shadow: 0 22px 52px rgba(156, 178, 205, 0.18);
	backdrop-filter: blur(8px);
}

.login-page__footer {
	position: absolute;
	right: calc(var(--login-shell-x) + var(--login-panel-right));
	bottom: var(--login-shell-bottom);
	margin: 0;
	font-size: 14px;
	line-height: 1.5;
	color: #7d8ca3;
	text-align: right;
}

.login-content-form {
	margin-top: 0;

	@for $i from 1 through 4 {
		.login-animation#{$i} {
			opacity: 0;
			animation-name: error-num;
			animation-duration: 0.5s;
			animation-fill-mode: forwards;
			animation-delay: calc($i / 10) + s;
		}
	}

	.login-field {
		margin-bottom: 20px;
	}

	.login-field__label {
		margin-bottom: 10px;
		font-size: 14px;
		line-height: 20px;
		font-weight: 600;
		color: #4f5d72;
	}

	.el-form-item {
		margin-bottom: 0;
	}

	.el-form-item__content {
		display: flex;
		width: 100%;
	}

	.el-input,
	.el-button {
		width: 100%;
	}

	.el-input__wrapper {
		min-height: 46px;
		padding: 0 14px;
		border-radius: 6px;
		background: #f3f7fa;
		box-shadow: inset 0 0 0 1px rgba(226, 234, 241, 0.95);
		transition:
			background-color 0.2s ease,
			box-shadow 0.2s ease,
			transform 0.2s ease;
	}

	.el-input__wrapper:hover {
		background: rgba(255, 255, 255, 0.98);
		box-shadow: inset 0 0 0 1px rgba(202, 213, 223, 0.95);
	}

	.el-input__wrapper.is-focus {
		background: #ffffff;
		box-shadow:
			inset 0 0 0 1px var(--el-color-primary-light-7),
			0 0 0 3px var(--el-color-primary-light-9);
	}

	.el-input__inner {
		height: 46px;
		font-size: 14px;
		color: #243346;
	}

	.el-input__inner::placeholder {
		color: #c2ccd8;
	}

	.el-form-item__error {
		position: static;
		padding-top: 6px;
		line-height: 1.3;
	}

	.login-password-toggle {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		padding: 0;
		border: none;
		background: transparent;
		color: #8f9aab;
		cursor: pointer;
		transition: color 0.2s ease;

		&:hover {
			color: var(--el-color-primary);
		}

		.el-icon {
			font-size: 18px;
		}
	}

	.login-form-item--verify {
		.el-form-item__content {
			display: block;
		}
	}

	.login-verify-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 84px;
		gap: 12px;
		align-items: stretch;
		width: 100%;
	}

	.login-verify-image {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 84px;
		height: 46px;
		padding: 2px 6px;
		border: none;
		border-radius: 6px;
		overflow: hidden;
		background: #ffffff;
		box-shadow: inset 0 0 0 1px rgba(226, 234, 241, 0.95);
		cursor: pointer;
		appearance: none;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;

		&:hover {
			transform: translateY(-1px);
			box-shadow: inset 0 0 0 1px rgba(202, 213, 223, 0.95);
		}

		img {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: contain;
		}
	}

	.login-content-code {
		height: 46px;
		border-radius: 6px;
		font-weight: 600;
		letter-spacing: 0;
	}

	.login-form-item--submit {
		margin-top: 14px;
	}

	.login-content-submit {
		height: 48px;
		border: none;
		border-radius: 7px;
		font-size: 16px;
		font-weight: 600;
		letter-spacing: 0;
		box-shadow: none;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;

		&:hover {
			transform: translateY(-1px);
			box-shadow: 0 14px 26px rgba(126, 149, 171, 0.16);
		}
	}
}

@media screen and (max-width: 1200px) {
	.login-page__content {
		gap: 32px;
	}

	.login-page__panel {
		margin-right: 0;
	}

	.login-page__footer {
		right: var(--login-shell-x);
	}
}

@media screen and (max-width: 900px) {
	.login-page {
		background-position: left 26% center;
	}

	.login-page__inner {
		padding: 24px 20px 22px;
	}

	.login-page__brand,
	.login-page__footer {
		position: static;
	}

	.login-page__content {
		min-height: auto;
		justify-content: center;
		padding: 42px 0 20px;
	}

	.login-page__hero {
		display: none;
	}

	.login-page__panel {
		width: 100%;
		max-width: 420px;
		margin: 0 auto;
	}

	.login-page__footer {
		margin: 18px auto 0;
		text-align: center;
	}
}

@media screen and (max-width: 520px) {
	.login-page__brand {
		gap: 12px;
	}

	.login-page__brand-logo {
		width: 30px;
		height: 30px;
	}

	.login-page__card {
		margin-top: 24px;
		padding: 18px 14px 20px;
		border-radius: 12px;
	}

	.login-content-form {
		.login-field {
			margin-bottom: 18px;
		}

		.login-verify-row {
			grid-template-columns: minmax(0, 1fr) 76px;
			gap: 10px;
		}

		.login-verify-image {
			width: 76px;
		}
	}
}
</style>
