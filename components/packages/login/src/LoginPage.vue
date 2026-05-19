<template>
  <div class="login-page select-none" :style="loginPageStyle">
    <div class="login-page__inner">
      <header class="login-page__brand">
        <img
          :src="brandBadge || logoMini"
          alt=""
          class="login-page__brand-logo"
        />
        <span class="login-page__brand-name">{{ title }}</span>
      </header>
      <main class="login-page__content">
        <div class="login-page__hero" aria-hidden="true"></div>
        <section class="login-page__panel">
          <p class="login-page__welcome">{{ welcomeText }}</p>
          <h1 class="login-page__title">{{ title }}</h1>
          <p class="login-page__subtitle">{{ subtitleText }}</p>
          <div class="login-page__card">
            <slot></slot>
          </div>
        </section>
      </main>
      <footer class="login-page__footer">{{ footer }}</footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  backgroundImage?: string;
  brandBadge?: string;
  logoMini?: string;
  title?: string;
  welcomeText?: string;
  subtitleText?: string;
  footer?: string;
}>();

const loginPageStyle = computed(() => ({
  backgroundImage: props.backgroundImage
    ? `url(${props.backgroundImage})`
    : undefined,
}));
</script>
