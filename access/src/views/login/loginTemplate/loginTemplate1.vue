<template>
	<div class="select-none" :style="{ backgroundColor: getThemeConfig?.loginConfig?.backgroundColor }">
		<div
			:style="`background-image:url(${getThemeConfig?.loginConfig?.backgroundUrl ? getImgUrl(getThemeConfig?.loginConfig?.backgroundUrl) : bg} );`"
			class="login1Bg"
		>
			<LoginText />
		</div>

		<div class="login1-container">
			<div class="login1-box">
				<div class="login1-title">
					<img v-if="getThemeConfig?.loginConfig?.middleLogoUrl" :src="getImgUrl(getThemeConfig?.loginConfig?.middleLogoUrl)" />
					<img v-else :src="loginIcon" />
				</div>

				<div class="login1-form">
					<Password @signInSuccess="signInSuccess" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="loginIndex">
import { useThemeConfig } from '/@/stores/themeConfig';
import { NextLoading } from '/@/utils/loading';
import bg from '/@/assets/login/login1/bg.png';
import loginIcon from '/@/assets/login/login1/Group.png';
import { useI18n } from 'vue-i18n';
import { formatAxis } from '/@/utils/formatTime';
import { useMessage } from '/@/hooks/message';
import { Session } from '/@/utils/storage';
import { initBackEndControlRoutes } from '/@/router/backEnd';
import { storeToRefs } from 'pinia';
import { getImgUrl } from '/@/utils/arrayOperation';
// 引入组件
const Password = defineAsyncComponent(() => import('../component/password.vue'));
const LoginText = defineAsyncComponent(() => import('../component/loginText.vue'));
// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

// 获取布局配置信息
const getThemeConfig = computed(() => {
	return themeConfig.value;
});

// 登录成功后的跳转处理事件
const signInSuccess = async () => {
	const isNoPower = await initBackEndControlRoutes();
	console.log(isNoPower);

	if (isNoPower) {
		useMessage().warning('抱歉，您没有登录权限');
		Session.clear();
	} else {
		// 初始化登录成功时间问候语
		let currentTimeInfo = formatAxis(new Date());
		if (route.query?.redirect) {
			router.push({
				path: <string>route.query?.redirect,
				query: route.query?.params
					? (() => {
							const paramsObj = JSON.parse(<string>route.query?.params);
							// 过滤掉v5ticket和ticket参数
							const filteredParams = { ...paramsObj };
							delete filteredParams.v5ticket;
							delete filteredParams.ticket;
							return filteredParams;
						})()
					: '',
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

<style scoped lang="scss">
.login1Bg {
	position: absolute;
	width: 60%;
	height: 100%;
	left: 0;
	top: 0;
	z-index: 0;
	background-repeat: no-repeat;
	// background-position: center;
	background-size: cover;
	display: flex;
	align-items: center;
	justify-content: center;
}

.login1Icon {
	top: 74px;
	left: 107px;
	font-size: 16px;
	color: #fff;
	text-align: right;

	text-shadow: 3px 3px 5px #000000;

	img {
		width: 340px;
		// height: 41px;
		overflow: hidden;
	}
}

.select-none {
	height: 100%;
}

.login1-container {
	// height: 100%;
	// display: flex;
	padding: 0 2rem;
	// justify-content: center;
	// align-items: center;
	// z-index: 1;
	position: absolute;
	right: calc((40% - 465px) / 2);
	top: 50%;
	transform: translate(0, -50%);

	.login1-box {
		z-index: 1;
		text-align: center;
		width: 450px;
		.login1-title {
			width: 260px;
			margin: auto;
			height: 70px;
		}

		.login1-desc {
			font-size: 20px;
			font-weight: 400;
			line-height: 28.96px;
			letter-spacing: -0.5531914830207825px;
			text-align: center;
			text-underline-position: from-font;
			text-decoration-skip-ink: none;
			color: #fff;
		}

		.login1-form {
			// margin-top: 35px;
			background-color: #fff;
			padding: 35px 24px;
			border-radius: 12px;
			// box-shadow: 0px 20px 27px 0px rgba(0, 0, 0, 0.05);
			width: 450px;

			.text {
				margin-top: 20px;
				text-align: center;
				color: #606266;
				letter-spacing: 2px;

				span {
					color: #285ff3;
				}
			}
		}

		.register-form {
			width: 600px;
		}
	}
}
</style>
