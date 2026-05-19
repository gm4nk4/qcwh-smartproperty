<template>
  <div class="internal-app-panel">
    <div class="info-tip">
      <el-icon><InfoFilled /></el-icon>
      <span>以下是尚未授权激活的子应用。选择需要的应用进行授权激活后，将自动显示在子应用管理列表中。激活需上传授权文件(.lic)或输入授权密钥。</span>
    </div>

    <div class="search-section">
      <el-input
        v-model="searchText"
        placeholder="搜索应用名称、描述或分类"
        class="search-input"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <div v-if="!showActivateForm" class="apps-table-wrapper">
      <el-table :data="filteredApps" stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="70" align="center" />
        <el-table-column prop="name" label="应用名称" min-width="150" />
        <el-table-column prop="description" label="应用描述" min-width="250" />
        <el-table-column prop="version" label="版本" width="100" align="center" />
        <el-table-column prop="category" label="分类" width="120" align="center" />
        <el-table-column prop="userCount" label="用户数" width="100" align="center" />
        <el-table-column prop="aiTools" label="AI工具" width="100" align="center" />
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="openActivateForm(row)">
              授权激活
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-else class="activate-form-wrapper">
      <div class="form-left">
        <div class="section-title">
          <div class="title-line"></div>
          <span>授权激活 - {{ selectedApp?.name }}</span>
          <el-icon class="tip-icon" @click="tipVisible = !tipVisible"><QuestionFilled /></el-icon>
          <div v-if="tipVisible" class="tip-text">
            授权激活后将自动解析授权文件中的配置信息(功能模块、额度限制、有效期等)。请确保授权文件与当前应用版本匹配，否则可能导致部分功能不可用。
          </div>
        </div>

        <el-form label-width="100px" class="activate-form-inner">
          <el-form-item label="应用名称">
            <el-input v-model="activateForm.name" disabled />
          </el-form-item>
          <el-form-item label="应用编码">
            <el-input v-model="activateForm.code" disabled />
          </el-form-item>
          <el-form-item label="Token">
            <div class="token-row">
              <el-input v-model="activateForm.token" class="token-input" />
              <span class="refresh-label">Refresh Token</span>
              <el-input v-model="activateForm.refreshToken" class="token-input" />
            </div>
          </el-form-item>
          <el-form-item label="应用分类">
            <div class="category-row">
              <el-input v-model="activateForm.category" disabled />
              <span class="version-label">版本: {{ selectedApp?.version }}</span>
            </div>
          </el-form-item>
          <el-form-item label="应用描述">
            <el-input v-model="activateForm.description" type="textarea" :rows="2" />
          </el-form-item>
        </el-form>

        <div class="org-section">
          <div class="org-title">组织架构管理</div>
          <div class="org-options">
            <div
              class="org-option"
              :class="{ selected: orgOption === 'unified' }"
              @click="orgOption = 'unified'"
            >
              <div class="org-option-icon">
                <el-icon><OfficeBuilding /></el-icon>
              </div>
              <div class="org-option-text">
                <div class="org-option-title">使用统一组织架构</div>
                <div class="org-option-desc">直接使用平台统一的组织架构，与其他子应用共享组织节点和人员数据</div>
              </div>
              <el-icon v-if="orgOption === 'unified'" class="check-icon"><CircleCheckFilled /></el-icon>
            </div>
            <div
              class="org-option"
              :class="{ selected: orgOption === 'independent' }"
              @click="orgOption = 'independent'"
            >
              <div class="org-option-icon">
                <el-icon><Connection /></el-icon>
              </div>
              <div class="org-option-text">
                <div class="org-option-title">启用独立组织架构管理</div>
                <div class="org-option-desc">该子应用需要独立维护自己的组织架构，不与平台统一架构关联，适用于安监监管、工单管理等需要专属组织架构的场景。可在「组织管理」中同时统一管理。</div>
              </div>
              <el-icon v-if="orgOption === 'independent'" class="check-icon"><CircleCheckFilled /></el-icon>
            </div>
          </div>
          <div class="org-tip">
            <el-icon><InfoFilled /></el-icon>
            <span>组织架构模式决定了应用如何管理组织节点和人员。大多数子应用建议使用统一组织架构以保持数据一致性。</span>
          </div>
        </div>
      </div>

      <div class="form-right">
        <div class="address-section">
          <div class="address-title">访问地址配置</div>
          <div class="address-list">
            <div class="address-item">
              <div class="address-top">
                <el-select v-model="selectedAppType" class="type-select">
                  <el-option label="PC Web" value="pc" />
                  <el-option label="Mobile H5" value="h5" />
                  <el-option label="微信小程序" value="wechat" />
                  <el-option label="其他" value="other" />
                </el-select>
                <el-input v-model="activateForm.url" class="url-input" />
                <el-switch v-model="activateForm.addressEnabled" />
                <el-icon class="delete-icon"><Delete /></el-icon>
              </div>
              <div class="display-options">
                <span class="display-label">显示方式</span>
                <el-radio-group v-model="activateForm.displayMode" size="small">
                  <el-radio-button value="always">一直显示</el-radio-button>
                  <el-radio-button value="never">一直不显示</el-radio-button>
                  <el-radio-button value="role">拥有角色才显示</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </div>
          <div class="address-tip">
            <el-icon><InfoFilled /></el-icon>
            <span>不同端可配置不同的访问地址和显示方式，用于门户快捷入口和SSO跳转</span>
          </div>
        </div>

        <div class="license-section">
          <div class="license-tabs">
            <div
              class="license-tab"
              :class="{ active: licenseMode === 'file' }"
              @click="licenseMode = 'file'"
            >
              上传授权文件
            </div>
            <div
              class="license-tab"
              :class="{ active: licenseMode === 'key' }"
              @click="licenseMode = 'key'"
            >
              输入授权密钥
            </div>
          </div>

          <div v-if="licenseMode === 'file'" class="upload-area">
            <div class="upload-content">
              <el-icon class="upload-icon"><Upload /></el-icon>
              <div class="upload-text">
                <div class="upload-main">点击上传 / 拖拽到区域</div>
                <div class="upload-sub">支持 .lic 格式的授权文件</div>
              </div>
            </div>
          </div>

          <div v-else class="key-area">
            <el-form label-width="80px">
              <el-form-item label="授权密钥">
                <el-input v-model="activateForm.licenseKey" placeholder="请输入授权密钥，例如：XXXX-XXXX-XXXX-XXXX" />
              </el-form-item>
            </el-form>
            <div class="key-tip">
              <el-icon><InfoFilled /></el-icon>
              <span>授权密钥可从授权邮件或后台管理中获取，密钥格式为由横线分隔的5组字符。</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showActivateForm" class="form-actions">
      <el-button @click="backToList">取消</el-button>
      <el-button @click="backToList">上一步</el-button>
      <el-button type="primary" @click="confirmActivate">确认激活</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 激活内部应用面板组件
 */

import { ref, computed, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import {
  InfoFilled,
  Search,
  QuestionFilled,
  OfficeBuilding,
  Connection,
  CircleCheckFilled,
  Upload,
  Delete,
} from '@element-plus/icons-vue';

export interface InternalApp {
  id: number;
  name: string;
  description: string;
  version: string;
  category: string;
  userCount: number;
  aiTools: number;
  code: string;
}

interface Emits {
  (e: 'activate', data: any): void;
}

const emit = defineEmits<Emits>();

/** 搜索文本 */
const searchText = ref('');
/** 是否显示激活表单 */
const showActivateForm = ref(false);
/** 选中的应用 */
const selectedApp = ref<InternalApp | null>(null);
/** 组织架构选项 */
const orgOption = ref('unified');
/** 授权模式 */
const licenseMode = ref('file');
/** 提示框显示 */
const tipVisible = ref(false);
/** 选中的应用类型 */
const selectedAppType = ref('pc');

/** 模拟应用列表 */
const internalApps: InternalApp[] = [
  { id: 1, name: '工单管理', description: '全生命周期工单闭环、AI智能派单、人员排班', version: 'V3.2', category: '客户服务', userCount: 50, aiTools: 3, code: 'EDGE-WO-001' },
  { id: 2, name: '智慧访客', description: '访客预约、人脸识别、访客轨迹', version: 'V1.0', category: '客户服务', userCount: 50, aiTools: 0, code: 'EDGE-VISITOR-001' },
  { id: 3, name: '招商管理', description: '招商线索、合同管理、租金分析', version: 'V1.0', category: '经营决策', userCount: 20, aiTools: 0, code: 'EDGE-INVEST-001' },
];

/** 过滤后的应用列表 */
const filteredApps = computed(() => {
  if (!searchText.value) return internalApps;
  const text = searchText.value.toLowerCase();
  return internalApps.filter(
    app => app.name.toLowerCase().includes(text) ||
           app.description.toLowerCase().includes(text) ||
           app.category.toLowerCase().includes(text)
  );
});

/** 激活表单数据 */
const activateForm = reactive({
  name: '',
  code: '',
  token: 'tk-APP-001-mog3258',
  refreshToken: 'rt-APP-001-mog9258',
  category: '',
  description: '',
  url: 'https://example.com/app',
  addressEnabled: true,
  displayMode: 'always',
  licenseKey: '',
});

/** 打开激活表单 */
const openActivateForm = (app: InternalApp) => {
  selectedApp.value = app;
  activateForm.name = app.name;
  activateForm.code = app.code;
  activateForm.category = app.category;
  activateForm.description = app.description;
  showActivateForm.value = true;
};

/** 返回列表 */
const backToList = () => {
  showActivateForm.value = false;
  selectedApp.value = null;
};

/** 确认激活 */
const confirmActivate = () => {
  emit('activate', {
    app: selectedApp.value,
    form: { ...activateForm },
    orgOption: orgOption.value,
    licenseMode: licenseMode.value,
  });
  ElMessage.success('激活成功');
  backToList();
};
</script>

<style scoped lang="scss">
.internal-app-panel {
  .info-tip {
    display: flex;
    gap: 8px;
    padding: 12px 16px;
    background: #eff6ff;
    border: 1px solid #93c5fd;
    border-radius: 8px;
    margin-bottom: 16px;
    font-size: 12px;
    color: #374151;
    line-height: 1.6;

    .el-icon {
      color: #3b82f6;
      flex-shrink: 0;
      margin-top: 2px;
    }
  }

  .search-section {
    margin-bottom: 16px;

    .search-input {
      width: 320px;
    }
  }

  .apps-table-wrapper {
    :deep(.el-table) {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }
  }

  .activate-form-wrapper {
    display: flex;
    gap: 24px;

    .form-left {
      flex: 1;

      .section-title {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 20px;
        position: relative;

        .title-line {
          width: 4px;
          height: 16px;
          background: #3b82f6;
          border-radius: 2px;
        }

        span {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
        }

        .tip-icon {
          color: #6b7280;
          cursor: pointer;
          margin-left: 4px;

          &:hover {
            color: #3b82f6;
          }
        }

        .tip-text {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 8px;
          padding: 12px;
          background: #eff6ff;
          border: 1px solid #93c5fd;
          border-radius: 8px;
          font-size: 12px;
          color: #374151;
          line-height: 1.6;
          z-index: 10;
        }
      }

      .activate-form-inner {
        margin-bottom: 24px;

        .token-row {
          display: flex;
          gap: 8px;
          align-items: center;

          .token-input {
            flex: 1;
          }

          .refresh-label {
            font-size: 12px;
            color: #6b7280;
            white-space: nowrap;
          }
        }

        .category-row {
          display: flex;
          gap: 8px;
          align-items: center;

          .version-label {
            font-size: 12px;
            color: #6b7280;
            white-space: nowrap;
          }
        }
      }

      .org-section {
        .org-title {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 12px;
        }

        .org-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 12px;

          .org-option {
            display: flex;
            gap: 12px;
            padding: 12px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            cursor: pointer;
            align-items: flex-start;
            position: relative;

            &:hover {
              border-color: #93c5fd;
              background: #f8fafc;
            }

            &.selected {
              border-color: #3b82f6;
              background: #eff6ff;
            }

            .org-option-icon {
              width: 40px;
              height: 40px;
              background: #f3f4f6;
              border-radius: 4px;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
              color: #6b7280;

              .el-icon {
                font-size: 20px;
              }
            }

            &.selected .org-option-icon {
              background: #3b82f6;
              color: white;
            }

            .org-option-text {
              flex: 1;

              .org-option-title {
                font-size: 14px;
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 4px;
              }

              .org-option-desc {
                font-size: 12px;
                color: #6b7280;
                line-height: 1.6;
              }
            }

            .check-icon {
              color: #3b82f6;
              font-size: 20px;
            }
          }
        }

        .org-tip {
          display: flex;
          gap: 8px;
          padding: 10px 12px;
          background: #f9fafb;
          border-radius: 8px;
          font-size: 12px;
          color: #6b7280;

          .el-icon {
            color: #6b7280;
            flex-shrink: 0;
            margin-top: 2px;
          }
        }
      }
    }

    .form-right {
      width: 420px;
      flex-shrink: 0;

      .address-section {
        .address-title {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 12px;
        }

        .address-list {
          .address-item {
            padding: 12px;
            background: #f8fafc;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            margin-bottom: 12px;

            .address-top {
              display: flex;
              gap: 8px;
              align-items: center;
              margin-bottom: 12px;

              .type-select {
                width: 110px;
              }

              .url-input {
                flex: 1;
              }

              .delete-icon {
                color: #9ca3af;
                cursor: pointer;

                &:hover {
                  color: #ef4444;
                }
              }
            }

            .display-options {
              display: flex;
              gap: 8px;
              align-items: center;

              .display-label {
                font-size: 12px;
                color: #6b7280;
              }
            }
          }
        }

        .address-tip {
          display: flex;
          gap: 8px;
          padding: 10px 12px;
          background: #f9fafb;
          border-radius: 8px;
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 16px;

          .el-icon {
            color: #6b7280;
            flex-shrink: 0;
            margin-top: 2px;
          }
        }
      }

      .license-section {
        .license-tabs {
          display: flex;
          gap: 0;
          margin-bottom: 16px;

          .license-tab {
            flex: 1;
            padding: 10px 16px;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
            cursor: pointer;
            border: 1px solid #e5e7eb;
            background: #f9fafb;

            &:first-child {
              border-radius: 8px 0 0 8px;
            }

            &:last-child {
              border-radius: 0 8px 8px 0;
              border-left: none;
            }

            &.active {
              background: white;
              color: #1890ff;
              border-color: #3b82f6;
              font-weight: 600;
            }
          }
        }

        .upload-area {
          padding: 40px 20px;
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          text-align: center;

          .upload-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;

            .upload-icon {
              font-size: 48px;
              color: #3b82f6;
            }

            .upload-text {
              .upload-main {
                font-size: 14px;
                color: #3b82f6;
                font-weight: 500;
              }

              .upload-sub {
                font-size: 12px;
                color: #6b7280;
              }
            }
          }
        }

        .key-area {
          .key-tip {
            display: flex;
            gap: 8px;
            padding: 10px 12px;
            background: #f9fafb;
            border-radius: 8px;
            font-size: 12px;
            color: #6b7280;
            margin-top: 12px;

            .el-icon {
              color: #6b7280;
              flex-shrink: 0;
              margin-top: 2px;
            }
          }
        }
      }
    }
  }

  .form-actions {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid #e5e7eb;
  }
}
</style>
