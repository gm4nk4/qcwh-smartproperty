<template>
  <div class="external-app-panel">
    <div class="form-section-title">
      <div class="title-line"></div>
      <span>新增第三方应用</span>
    </div>
    <div class="form-tip">
      第三方应用通过单点登录（SSO）集成，支持OAuth2.0/SAML/CAS/OIDC等授权模式，可配置多登录访问地址。
    </div>
    <div class="form-row">
      <div class="form-col left">
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="120px"
          class="add-form"
        >
          <el-form-item
            label="应用名称"
            prop="appName"
          >
            <el-input
              v-model="formData.appName"
              placeholder="请输入应用名称"
            />
          </el-form-item>
          <el-form-item
            label="应用编码"
            prop="appCode"
          >
            <el-input
              v-model="formData.appCode"
              placeholder="请输入应用编码"
            />
          </el-form-item>
          <el-form-item
            label="应用分类"
            prop="appCategory"
          >
            <el-select
              v-model="formData.appCategory"
              placeholder="请选择应用分类"
            >
              <el-option label="第三方应用" value="第三方应用" />
              <el-option label="客户服务" value="客户服务" />
              <el-option label="空间与设备" value="空间与设备" />
            </el-select>
          </el-form-item>
          <el-form-item label="Token">
            <el-input
              v-model="formData.token"
              placeholder="应用访问Token"
            />
          </el-form-item>
          <el-form-item label="Refresh Token">
            <el-input
              v-model="formData.refreshToken"
              placeholder="Token刷新凭据"
            />
          </el-form-item>
          <el-form-item label="授权模式">
            <el-select
              v-model="formData.authMode"
              placeholder="请选择授权模式"
            >
              <el-option label="OAuth2.0" value="OAuth2.0" />
              <el-option label="SAML" value="SAML" />
              <el-option label="CAS" value="CAS" />
              <el-option label="OIDC" value="OIDC" />
            </el-select>
          </el-form-item>
          <el-form-item label="二次登录">
            <div class="switch-row">
              <el-switch
                v-model="formData.secondaryLogin"
                active-text="未启用"
                inactive-text=""
              />
              <div class="sso-switch">
                <span>SSO开关</span>
                <el-switch
                  v-model="formData.ssoEnabled"
                  active-text="已启用"
                  inactive-text=""
                />
              </div>
            </div>
          </el-form-item>
          <el-form-item label="信息同步地址">
            <el-input
              v-model="formData.syncAddress"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="Token签发地址">
            <el-input
              v-model="formData.tokenAddress"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="登录跳转地址">
            <el-input
              v-model="formData.loginRedirectAddress"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="登出地址">
            <el-input
              v-model="formData.logoutAddress"
              placeholder="请输入"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="form-col right">
        <el-form label-width="120px" class="add-form">
          <el-form-item label="其他信息描述">
            <el-input
              v-model="formData.description"
              type="textarea"
              :rows="3"
              placeholder="简要描述应用功能..."
            />
          </el-form-item>
          <el-form-item label="访问地址配置">
            <div class="address-list">
              <div
                v-for="(item, index) in formData.accessUrls"
                :key="index"
                class="address-item"
              >
                <div class="address-header">
                  <span class="address-type">{{ item.type }}</span>
                  <el-input
                    v-model="item.url"
                    placeholder="https://example.com"
                    class="address-input"
                  >
                    <template #append>
                      <el-icon
                        class="toggle-icon"
                        @click="item.enabled = !item.enabled"
                      >
                        <View v-if="item.enabled" />
                        <View v-else />
                      </el-icon>
                    </template>
                  </el-input>
                </div>
                <div class="display-modes">
                  <span class="mode-label">显示方式</span>
                  <el-radio-group v-model="item.displayMode" size="small">
                    <el-radio-button value="always">一直显示</el-radio-button>
                    <el-radio-button value="never">一直不显示</el-radio-button>
                    <el-radio-button value="role">拥有角色才显示</el-radio-button>
                  </el-radio-group>
                </div>
                <el-button
                  v-if="formData.accessUrls.length > 1"
                  type="danger"
                  link
                  size="small"
                  @click="removeAddress(index)"
                >
                  删除
                </el-button>
              </div>
              <el-button
                type="primary"
                link
                size="small"
                class="add-address-btn"
                @click="addAddress"
              >
                + 添加访问地址
              </el-button>
            </div>
            <div class="address-tip">
              不同配置可配置不同的访问地址和显示方式，便于不同角色入口的SSO回接
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 新增第三方应用面板组件
 */

import { ref, reactive } from 'vue';
import { View } from '@element-plus/icons-vue';
import type { AddAppFormData } from '../../type';
import { mockAddAppFormData } from '../../mock';

export interface AccessUrlItem {
  type: string;
  url: string;
  displayMode: string;
  enabled: boolean;
}

interface Emits {
  (e: 'save', data: AddAppFormData): void;
}

const emit = defineEmits<Emits>();

/** 表单引用 */
const formRef = ref();

/** 表单数据 */
const formData = reactive<AddAppFormData>({
  appName: '企业OA',
  appCode: 'ext-oa-system',
  appCategory: '第三方应用',
  token: '',
  refreshToken: '',
  authMode: 'OAuth2.0',
  secondaryLogin: false,
  ssoEnabled: true,
  syncAddress: '',
  tokenAddress: '',
  loginRedirectAddress: '',
  logoutAddress: '',
  description: '简要描述应用功能...',
  accessUrls: [
    { type: 'PC Web', url: 'https://example.com/app', displayMode: 'always', enabled: true },
    { type: 'Mobile H5', url: 'https://example.com/app', displayMode: 'always', enabled: true },
  ],
});

/** 表单验证规则 */
const formRules = {
  appName: [
    { required: true, message: '请输入应用名称', trigger: 'blur' },
  ],
  appCode: [
    { required: true, message: '请输入应用编码', trigger: 'blur' },
  ],
  appCategory: [
    { required: true, message: '请选择应用分类', trigger: 'change' },
  ],
};

/** 添加访问地址 */
const addAddress = () => {
  formData.accessUrls.push({
    type: 'PC Web',
    url: '',
    displayMode: 'always',
    enabled: true,
  });
};

/** 删除访问地址 */
const removeAddress = (index: number) => {
  formData.accessUrls.splice(index, 1);
};

/** 保存 */
const handleSave = async () => {
  if (!formData.appName || !formData.appCode || !formData.appCategory) {
    return false;
  }
  emit('save', { ...formData });
  return true;
};

/** 重置表单 */
const resetForm = () => {
  Object.assign(formData, mockAddAppFormData);
};

/** 暴露方法给父组件 */
defineExpose({
  handleSave,
  resetForm,
});
</script>

<style scoped lang="scss">
.external-app-panel {
  .form-section-title {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;

    .title-line {
      width: 4px;
      height: 16px;
      background: #1890ff;
      border-radius: 2px;
    }

    span {
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
    }
  }

  .form-tip {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 24px;
    padding-left: 16px;
  }

  .form-row {
    display: flex;
    gap: 40px;

    .form-col {
      flex: 1;

      &.left {
        max-width: 420px;
      }

      &.right {
        flex: 1;
      }
    }
  }

  .switch-row {
    display: flex;
    justify-content: space-between;
    width: 100%;

    .sso-switch {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .address-list {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .address-item {
      padding: 12px;
      background: #f9fafb;
      border-radius: 8px;
      border: 1px solid #e5e7eb;

      .address-header {
        display: flex;
        gap: 12px;
        align-items: center;
        margin-bottom: 12px;

        .address-type {
          font-size: 14px;
          font-weight: 500;
          color: #1f2937;
          width: 100px;
        }

        .address-input {
          flex: 1;

          .toggle-icon {
            cursor: pointer;
            color: #1890ff;
          }
        }
      }

      .display-modes {
        display: flex;
        gap: 8px;
        align-items: center;

        .mode-label {
          font-size: 12px;
          color: #6b7280;
        }
      }
    }

    .add-address-btn {
      align-self: flex-start;
    }
  }

  .address-tip {
    font-size: 12px;
    color: #9ca3af;
    margin-top: 12px;
  }
}
</style>
