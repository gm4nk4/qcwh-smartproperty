<template>
	<div class="login-page select-none" :style="{ backgroundImage: `url(${backgroundImage})` }">
		<div class="login-page__inner">
			<header class="login-page__brand">
				<img :src="brandBadge || logoMini" alt="" class="login-page__brand-logo" />
				<span class="login-page__brand-name">{{ title }}</span>
			</header>
			<main class="login-page__content">
				<div class="login-page__hero" aria-hidden="true"></div>
				<section class="login-page__panel">
					<p class="login-page__welcome">{{ $t('page.welcome') }}</p>
					<h1 class="login-page__title">{{ title }}</h1>
					<p class="login-page__subtitle">{{ $t('page.subtitle') }}</p>
					<div class="login-page__card">
						<slot></slot>
					</div>
				</section>
			</main>
			<footer class="login-page__footer">{{ footer }}</footer>
		</div>
	</div>
</template>

<script setup lang="ts" name="loginIndex">
import logoMini from './logo-mini.svg';

defineProps<{
	backgroundImage?: string;
	brandBadge?: string;
	title?: string;
	footer?: string;
}>();

const emit = defineEmits(['signInSuccess']);

const onSignInSuccess = () => {
	emit('signInSuccess');
};

defineExpose({ onSignInSuccess });
</script>