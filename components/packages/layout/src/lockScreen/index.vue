<template>
  <div v-show="state.isShowLockScreen" class="lock-screen">
    <!-- 遮罩层 -->
    <div class="fixed inset-0 w-full h-full bg-white z-[9999990]"></div>
    <!-- 背景图 -->
    <div
      class="lock-screen-bg fixed inset-0 w-full h-full bg-cover bg-center z-[9999991]"
      :class="{ 'blur-[1px]': state.isShowLoockLogin }"
    ></div>
    <!-- 主容器 -->
    <div class="fixed inset-0 w-full h-full z-[9999992]">
      <!-- 日期时间区域 -->
      <div
        class="absolute inset-0 w-full h-full text-white z-[9999993] select-none"
        ref="layoutLockScreenDateRef"
        @mousedown="onDownPc"
        @mousemove="onMovePc"
        @mouseup="onEnd"
        @touchstart.stop="onDownApp"
        @touchmove.stop="onMoveApp"
        @touchend.stop="onEnd"
      >
        <div class="absolute left-[30px] bottom-[50px]">
          <div class="text100 text-white leading-none">
            {{ state.time.hm }}<span class="text-base">{{ state.time.s }}</span>
          </div>
          <div class="text-[40px] text-white">{{ state.time.mdq }}</div>
        </div>
        <!-- 上滑解锁按钮 -->
        <div
          class="absolute right-[30px] bottom-[50px] flex flex-col items-center gap-2 text-white/80 hover:text-white cursor-pointer transition-all"
        >
          <div
            class="w-10 h-10 rounded-full border border-white/30 bg-white/10 flex items-center justify-center hover:bg-white/20 hover:border-white/50 transition-all"
          >
            <SvgIcon name="ele-Top" />
          </div>
          <span class="text-xs">上滑解锁</span>
        </div>
      </div>
      <!-- 登录区域 -->
      <transition name="el-zoom-in-center">
        <div
          v-show="state.isShowLoockLogin"
          class="relative z-[9999994] w-full h-full flex flex-col justify-center text-white"
        >
          <div class="text-center m-auto">
            <div class="w-[180px] h-[180px] mx-auto">
              <img :src="formData.avatar" class="w-full h-full rounded-full" />
            </div>
            <div class="text-2xl mt-4 mb-8">{{ formData.username }}</div>
            <div>
              <el-input
                placeholder="请输入密码"
                ref="layoutLockScreenInputRef"
                v-model="state.lockScreenPassword"
                type="password"
                @keyup.enter.native.stop="onLockScreenSubmit()"
              >
                <template #append>
                  <div class="flex gap-1">
                    <el-button
                      @click="onLockScreenSubmit"
                      title="解锁"
                      class="!m-0 !px-2 !text-blue-500 hover:!bg-blue-50"
                    >
                      <el-icon><ele-Right /></el-icon>
                    </el-button>
                    <el-button
                      @click="onLogout"
                      title="退出登录"
                      class="!m-0 !px-2 !text-red-500 hover:!bg-red-50"
                    >
                      <el-icon><ele-SwitchButton /></el-icon>
                    </el-button>
                  </div>
                </template>
              </el-input>
              <p class="text-red-500 mt-2">{{ mes }}</p>
            </div>
          </div>
          <!-- 底部图标 -->
          <div class="absolute right-[30px] bottom-[30px] flex gap-4">
            <SvgIcon
              name="ele-Microphone"
              :size="20"
              class="cursor-pointer opacity-80 hover:opacity-100"
            />
            <SvgIcon
              name="ele-AlarmClock"
              :size="20"
              class="cursor-pointer opacity-80 hover:opacity-100"
            />
            <SvgIcon
              name="ele-SwitchButton"
              :size="20"
              class="cursor-pointer opacity-80 hover:opacity-100"
            />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts" name="layoutLockScreen">
import { nextTick, onMounted, reactive, ref } from "vue";
import { useIntervalFn, useTimeoutFn } from "@vueuse/core";
import { formatDate } from "/@/utils/formatTime";
import { Local, Session } from "/@/utils/storage";
import { storeToRefs } from "pinia";
import { useThemeConfig } from "/@/stores/themeConfig";
import { checkPassword } from "/@/api/admin/user";
import { useUserInfo } from "/@/stores/userInfo";
import { logout } from "/@/api/login";

// 定义变量内容
const mes = ref();
const formData = reactive({ username: "", avatar: "" });
const layoutLockScreenDateRef = ref<HtmlType>();
const layoutLockScreenInputRef = ref();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const state = reactive({
  transparency: 1,
  downClientY: 0,
  moveDifference: 0,
  isShowLoockLogin: false,
  isFlags: false,
  querySelectorEl: "" as HtmlType,
  time: { hm: "", s: "", mdq: "" },
  isShowLockScreen: false,
  lockScreenPassword: "",
});

// 鼠标按下 pc
const onDownPc = (down: MouseEvent) => {
  state.isFlags = true;
  state.downClientY = down.clientY;
};
// 鼠标按下 app
const onDownApp = (down: TouchEvent) => {
  state.isFlags = true;
  state.downClientY = down.touches[0].clientY;
};
// 鼠标移动 pc
const onMovePc = (move: MouseEvent) => {
  state.moveDifference = move.clientY - state.downClientY;
  onMove();
};
// 鼠标移动 app
const onMoveApp = (move: TouchEvent) => {
  state.moveDifference = move.touches[0].clientY - state.downClientY;
  onMove();
};
// 延时移除元素
const { start: startRemoveEl } = useTimeoutFn(
  () => {
    const el = state.querySelectorEl as HTMLElement;
    el?.parentNode?.removeChild(el);
  },
  300,
  { immediate: false },
);

// 鼠标移动事件
const onMove = () => {
  if (!state.isFlags) return;
  const el = <HTMLElement>state.querySelectorEl;
  const opacitys = (state.transparency -= 1 / 200);
  if (state.moveDifference >= 0) return;
  el.setAttribute(
    "style",
    `top:${state.moveDifference}px;cursor:pointer;opacity:${opacitys};`,
  );
  if (state.moveDifference < -400) {
    el.setAttribute(
      "style",
      `top:${-el.clientHeight}px;cursor:pointer;transition:all 0.3s ease;`,
    );
    state.moveDifference = -el.clientHeight;
    startRemoveEl();
  }
  if (state.moveDifference === -el.clientHeight) {
    state.isShowLoockLogin = true;
    layoutLockScreenInputRef.value.focus();
  }
};
// 鼠标松开
const onEnd = () => {
  state.isFlags = false;
  state.transparency = 1;
  if (state.moveDifference >= -400) {
    (<HTMLElement>state.querySelectorEl).setAttribute(
      "style",
      `top:0px;opacity:1;transition:all 0.3s ease;`,
    );
  }
};
// 获取要拖拽的初始元素
const initGetElement = () => {
  nextTick(() => {
    state.querySelectorEl = layoutLockScreenDateRef.value;
  });
};
// 时间更新
const updateTime = () => {
  state.time.hm = formatDate(new Date(), "HH:MM");
  state.time.s = formatDate(new Date(), "SS");
  state.time.mdq = formatDate(new Date(), "mm月dd日，WWW");
};

// 时间定时器 - 每秒更新
useIntervalFn(updateTime, 1000, { immediate: true });

// 锁屏倒计时
const lockScreenCountdown = useIntervalFn(
  () => {
    if (themeConfig.value.lockScreenTime <= 1) {
      state.isShowLockScreen = true;
      updateLockScreen(true);
      lockScreenCountdown.pause();
      return;
    }
    themeConfig.value.lockScreenTime--;
  },
  1000,
  { immediate: false },
);

// 初始化锁屏
const initLockScreen = () => {
  if (!themeConfig.value.isLockScreen) {
    lockScreenCountdown.pause();
    return;
  }
  // 如果倒计时已结束，直接显示锁屏，否则继续倒计时
  themeConfig.value.lockScreenTime <= 1
    ? (state.isShowLockScreen = true)
    : lockScreenCountdown.resume();
};

// 默认锁屏倒计时（秒）
const DEFAULT_LOCK_TIME = 60;

// 更新锁屏状态并保存配置
const updateLockScreen = (isLocked: boolean) => {
  themeConfig.value.isLockScreen = isLocked;
  themeConfig.value.isDrawer = false;
  // 解锁时重置界面状态和倒计时
  if (!isLocked) {
    state.isShowLockScreen = false;
    state.isShowLoockLogin = false;
    state.lockScreenPassword = "";
    themeConfig.value.lockScreenTime = DEFAULT_LOCK_TIME;
    lockScreenCountdown.pause();
  }
  Local.set("themeConfig", themeConfig.value);
};

// 验证密码解锁
const onLockScreenSubmit = async () => {
  try {
    await checkPassword(state.lockScreenPassword);
    updateLockScreen(false);
  } catch (err: any) {
    mes.value = err.msg;
  }
};

// 退出登录
const onLogout = async () => {
  await logout();
  Session.clear();
  updateLockScreen(false);
  window.location.reload();
};
// 页面加载时
onMounted(() => {
  const data = useUserInfo().userInfos;
  Object.assign(formData, data.user);
  initGetElement();
  initLockScreen();
});
// VueUse 的 useIntervalFn/useTimeoutFn 会自动在组件卸载时清理
</script>

<style scoped lang="scss">
.w-full {
  width: 100%;
}
.h-full {
  height: 100%;
}

.bg-white {
  --tw-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity, 1));
}
.w-full {
  width: 100%;
}
.h-full {
  height: 100%;
}
.inset-0 {
  inset: 0px;
}
.fixed {
  position: fixed;
}
.lock-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999990;
  overflow: auto;
}
/* 背景图 - Tailwind 无法处理动态路径 */
.lock-screen-bg {
  background-image: url("/@/assets/lockScreen.png");
}

.bg-center {
  background-position: center;
}
.bg-cover {
  background-size: cover;
}
.text-white {
  color: #fff;
}
.absolute {
  position: absolute;
}
.select-none {
  user-select: none;
}
.text100 {
  font-size: 100px;
}
.text-bold {
  font-weight: bold;
}
.text-base {
  font-size: 16px;
}

.left-\[30px\] {
  left: 30px;
}
.bottom-\[50px\] {
  bottom: 50px;
}
.text-white {
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity, 1));
}
.leading-none {
  line-height: 1;
}
.text-\[100px\] {
  font-size: 100px;
}
.text-white {
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity, 1));
}
.text-\[40px\] {
  font-size: 40px;
}
.cursor-pointer {
  cursor: pointer !important;
}
.flex,
.flex-center {
  display: flex;
}
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.text-white\/80 {
  color: rgb(255 255 255 / 0.8);
}
.gap-2 {
  gap: 8px;
}
.items-center {
  align-items: center;
}
.flex-col {
  flex-direction: column;
}
.cursor-pointer {
  cursor: pointer;
}
.flex {
  display: flex;
}
.right-\[30px\] {
  right: 30px;
}
.bottom-\[50px\] {
  bottom: 50px;
}
.text-xs {
  font-size: var(--el-font-size-extra-small);
}
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.bg-white\/10 {
  background-color: rgb(255 255 255 / 0.1);
}
.border-white\/30 {
  border-color: rgb(255 255 255 / 0.3);
}
.border {
  border-width: 1px;
}
.rounded-full {
  border-radius: 9999px;
}
.justify-center {
  justify-content: center;
}
.items-center {
  align-items: center;
}
.w-10 {
  width: 40px;
}
.h-10 {
  height: 40px;
}
.text-center {
  text-align: center;
}
.m-auto {
  margin: auto;
}
.w-\[180px\] {
  width: 180px;
}
.h-\[180px\] {
  height: 180px;
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
.rounded-full {
  border-radius: 9999px;
}
.w-full {
  width: 100%;
}
.h-full {
  height: 100%;
}
img,
video {
  max-width: 100%;
  height: auto;
}
img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
  display: block;
  vertical-align: middle;
}

text-2xl {
  font-size: var(--el-font-size-extra-large);
}
.mt-4 {
  margin-top: 16px;
}
.mb-8 {
  margin-bottom: 32px;
}
.el-input-group {
  align-items: stretch;
  display: inline-flex;
  width: 100%;
}
.el-input {
  --el-input-inner-height: calc(var(--el-input-height, 32px) - 2px);
}
.el-input {
  --el-input-text-color: var(--el-text-color-regular);
  --el-input-border: var(--el-border);
  --el-input-hover-border: var(--el-border-color-hover);
  --el-input-focus-border: var(--el-color-primary);
  --el-input-transparent-border: 0 0 0 1px transparent inset;
  --el-input-border-color: var(--el-border-color);
  --el-input-border-radius: var(--el-border-radius-base);
  --el-input-bg-color: var(--el-fill-color-blank);
  --el-input-icon-color: var(--el-text-color-placeholder);
  --el-input-placeholder-color: var(--el-text-color-placeholder);
  --el-input-hover-border-color: var(--el-border-color-hover);
  --el-input-clear-hover-color: var(--el-text-color-secondary);
  --el-input-focus-border-color: var(--el-color-primary);
  --el-input-width: 100%;
  --el-input-height: var(--el-component-size);
  box-sizing: border-box;
  display: inline-flex;
  font-size: var(--el-font-size-base);
  line-height: var(--el-input-height);
  position: relative;
  vertical-align: middle;
  width: var(--el-input-width);
}
.el-input-group--append > .el-input__wrapper {
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
}
.el-input-group__append .el-button {
  display: flex;
}
.el-input__wrapper {
  align-items: center;
  background-color: var(--el-input-bg-color, var(--el-fill-color-blank));
  background-image: none;
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color))
    inset;
  cursor: text;
  display: inline-flex;
  flex-grow: 1;
  justify-content: center;
  padding: 1px 11px;
  transform: translateZ(0);
  transition: var(--el-transition-box-shadow);
}
.text-red-500 {
  --tw-text-opacity: 1;
  color: rgb(239 68 68 / var(--tw-text-opacity, 1));
}
.mt-2 {
  margin-top: 8px;
}
/* Element Plus 组件样式穿透 */
:deep(.el-input-group__append) {
  @apply bg-white p-0 px-1;
}

:deep(.el-input__inner) {
  border-right-color: var(--el-border-color-extra-light);

  &:hover {
    border-color: var(--el-border-color-extra-light);
  }
}
</style>
