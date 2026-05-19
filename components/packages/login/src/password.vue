<template>
  <el-form
    size="large"
    class="login-content-form"
    ref="loginFormRef"
    :rules="loginRules"
    :model="state.ruleForm"
    @keyup.enter="onSignIn"
  >
    <div class="login-field login-animation1">
      <div class="login-field__label">{{ labelUsername }}</div>
      <el-form-item prop="username">
        <el-input
          v-model="state.ruleForm.username"
          :placeholder="placeholderUsername"
          autocomplete="username"
        />
      </el-form-item>
    </div>
    <div class="login-field login-animation2">
      <div class="login-field__label">{{ labelPassword }}</div>
      <el-form-item prop="password">
        <el-input
          v-model="state.ruleForm.password"
          :type="state.isShowPassword ? 'text' : 'password'"
          :placeholder="placeholderPassword"
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
                <View v-if="state.isShowPassword" />
                <Hide v-else />
              </el-icon>
            </button>
          </template>
        </el-input>
      </el-form-item>
    </div>
    <div v-if="verifyEnable" class="login-field login-animation3">
      <div class="login-field__label">{{ labelVerify }}</div>
      <el-form-item prop="code" class="login-form-item--verify">
        <div class="login-verify-row">
          <el-input
            v-model="state.ruleForm.code"
            maxlength="4"
            :placeholder="placeholderCode"
            autocomplete="off"
          />
          <button
            type="button"
            class="login-verify-image"
            @click="getVerifyCode"
          >
            <img :src="imgSrc" alt="验证码" />
          </button>
        </div>
      </el-form-item>
    </div>
    <el-form-item class="login-form-item--submit login-animation4">
      <el-button
        type="primary"
        class="login-content-submit"
        :loading="loading"
        @click="onSignIn"
      >
        <span>{{ btnText }}</span>
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts" name="loginPassword">
import { View, Hide } from "@element-plus/icons-vue";

const props = defineProps<{
  labelUsername?: string;
  labelPassword?: string;
  labelVerify?: string;
  placeholderUsername?: string;
  placeholderPassword?: string;
  placeholderCode?: string;
  btnText?: string;
  verifyEnable?: boolean;
  imgSrc?: string;
  onLogin?: (data: any) => Promise<void>;
  onRefreshCode?: () => void;
}>();

const emit = defineEmits(["signInSuccess"]);

const loginFormRef = ref();
const loading = ref(false);
const state = reactive({
  isShowPassword: false,
  ruleForm: {
    username: "",
    password: "",
    code: "",
    randomStr: "",
  },
});

const loginRules = computed(() => ({
  username: [
    {
      required: true,
      trigger: "blur",
      message: props.placeholderUsername || "请输入用户名",
    },
  ],
  password: [
    {
      required: true,
      trigger: "blur",
      message: props.placeholderPassword || "请输入密码",
    },
  ],
  code: props.verifyEnable
    ? [
        {
          required: true,
          trigger: "blur",
          message: props.placeholderCode || "请输入验证码",
        },
      ]
    : [],
}));

const getVerifyCode = () => {
  emit("refreshCode");
};

const onSignIn = async () => {
  const valid = await loginFormRef.value.validate().catch(() => {});
  if (!valid) return;

  loading.value = true;
  try {
    if (props.onLogin) {
      await props.onLogin({ ...state.ruleForm });
    }
    emit("signInSuccess");
  } catch (error) {
    console.error("Login error:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (props.verifyEnable) {
    getVerifyCode();
  }
});
</script>
