<template>
  <el-dialog
    v-model="dialogVisible"
    width="1200px"
    class="app-detail-dialog"
    :close-on-click-modal="false"
    destroy-on-close
  >
    <template #header>
      <div class="dialog-header">
        <span class="dialog-title">应用详情</span>
      </div>
    </template>
    <div v-if="appData" class="dialog-content">
      <div class="app-info-bar">
        <div class="app-icon">
          <div class="icon-box">
            <el-icon><Box /></el-icon>
          </div>
        </div>
        <div class="app-basic">
          <div class="app-name-row">
            <span class="app-name">{{ appData.name }}</span>
            <el-tag type="success" size="small" class="status-tag">
              {{ getStatusText(appData.status) }}
            </el-tag>
            <el-tag type="info" size="small" class="version-tag">
              {{ appData.version }}
            </el-tag>
          </div>
          <div class="app-desc">{{ appData.description }}</div>
        </div>
      </div>
      <el-tabs v-model="activeTab" class="detail-tabs">
        <el-tab-pane label="基本信息" name="basic">
          <BasicInfoTab
            :basic-info="detailData.basicInfo"
            :credentials="detailData.credentials"
          />
        </el-tab-pane>
        <el-tab-pane label="授权配置" name="auth">
          <AuthConfigTab
            :auth-config="detailData.authConfig"
            :permissions="detailData.permissions"
            :quota="detailData.quota"
            :file-info="detailData.fileInfo"
          />
        </el-tab-pane>
        <el-tab-pane label="AI能力" name="ai">
          <AICapabilityTab />
        </el-tab-pane>
        <el-tab-pane label="数据交换" name="data">
          <DataExchangeTab />
        </el-tab-pane>
      </el-tabs>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button type="primary">访问配置</el-button>
        <el-button type="danger" @click="handleToggleStatus">
          {{ appData?.status === 'active' ? '停用应用' : '启用应用' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="AppDetailDialog">
/**
 * 应用详情弹窗组件
 * @description 展示应用的详细信息，包括基本信息、授权配置等
 */

import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Box } from '@element-plus/icons-vue';
import type { ApplicationItem, ApplicationDetail } from '../type';
import { mockApplicationDetail } from '../mock';
import BasicInfoTab from './tabs/BasicInfoTab.vue';
import AuthConfigTab from './tabs/AuthConfigTab.vue';
import AICapabilityTab from './tabs/AICapabilityTab.vue';
import DataExchangeTab from './tabs/DataExchangeTab.vue';

interface Props {
  /** 是否显示弹窗 */
  visible: boolean;
  /** 应用数据 */
  appData: ApplicationItem | null;
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

/** 当前激活的标签页 */
const activeTab = ref('basic');
/** 详情数据 */
const detailData = ref<ApplicationDetail>(mockApplicationDetail);

/** 弹窗可见性 */
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
});

/**
 * 获取状态文本
 * @param status 状态值
 * @returns 状态文本
 */
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    active: '已激活',
    inactive: '已停用',
    testing: '测试中',
  };
  return statusMap[status] || status;
};

/**
 * 关闭弹窗
 */
const handleClose = () => {
  dialogVisible.value = false;
};

/**
 * 切换应用状态
 */
const handleToggleStatus = () => {
  ElMessage.success('操作成功');
  dialogVisible.value = false;
};
</script>

<style scoped lang="scss">
.app-detail-dialog {
  :deep(.el-dialog__header) {
    margin: 0;
    padding: 16px 24px;
    border-bottom: 1px solid #e5e7eb;
    background: linear-gradient(90deg, #00c2c2 0%, #1890ff 100%);

    .el-dialog__title {
      color: white;
      font-size: 16px;
      font-weight: 600;
    }

    .el-dialog__headerbtn {
      .el-dialog__close {
        color: white;

        &:hover {
          color: #f0f0f0;
        }
      }
    }
  }

  :deep(.el-dialog__body) {
    padding: 24px;
  }

  :deep(.el-dialog__footer) {
    padding: 16px 24px;
    border-top: 1px solid #e5e7eb;
  }
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dialog-title {
  color: white;
  font-size: 16px;
  font-weight: 600;
}

.dialog-content {
  .app-info-bar {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid #e5e7eb;

    .app-icon {
      .icon-box {
        width: 64px;
        height: 64px;
        border-radius: 8px;
        background: #1890ff;
        display: flex;
        align-items: center;
        justify-content: center;

        .el-icon {
          font-size: 32px;
          color: white;
        }
      }
    }

    .app-basic {
      flex: 1;

      .app-name-row {
        display: flex;
        gap: 8px;
        align-items: center;
        margin-bottom: 8px;

        .app-name {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .status-tag {
          margin: 0;
        }

        .version-tag {
          margin: 0;
        }
      }

      .app-desc {
        font-size: 14px;
        color: #6b7280;
      }
    }
  }

  .detail-tabs {
    :deep(.el-tabs__header) {
      margin: 0 0 24px 0;
    }

    :deep(.el-tabs__item) {
      font-weight: 500;
    }

    :deep(.el-tabs__item.is-active) {
      color: #1890ff;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
}
</style>
