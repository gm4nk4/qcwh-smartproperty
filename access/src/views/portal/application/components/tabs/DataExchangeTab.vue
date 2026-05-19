<template>
  <div class="tab-content">
    <div class="data-stats">
      <div class="stat-box blue">
        <div class="stat-label">已授权接口</div>
        <div class="stat-value">{{ stats.authorizedInterfaces }}</div>
      </div>
      <div class="stat-box orange">
        <div class="stat-label">已订阅主题</div>
        <div class="stat-value">{{ stats.subscribedTopics }}</div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">
        <div class="title-line"></div>
        <span>数据交换接入凭证</span>
        <el-tag type="success" size="small">已同步</el-tag>
      </div>
      <div class="credentials-table">
        <div
          v-for="(credential, index) in credentials"
          :key="index"
          class="credential-row"
        >
          <div class="credential-label">{{ credential.label }}</div>
          <div class="credential-value">
            <span>{{ credential.value }}</span>
            <div class="credential-actions">
              <el-icon class="action-icon" @click="handleRefresh(credential)">
                <RefreshLeft />
              </el-icon>
              <el-icon class="action-icon" @click="handleCopy(credential.value)">
                <DocumentCopy />
              </el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 数据交换标签页组件
 */

import { RefreshLeft, DocumentCopy } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

export interface DataStats {
  authorizedInterfaces: number;
  subscribedTopics: number;
}

export interface Credential {
  label: string;
  value: string;
}

interface Props {
  stats?: DataStats;
  credentials?: Credential[];
}

const props = withDefaults(defineProps<Props>(), {
  stats: () => ({
    authorizedInterfaces: 12,
    subscribedTopics: 8,
  }),
  credentials: () => [
    { label: 'API Key', value: 'AK-WO-001-7f3a9c2e' },
    { label: 'API Secret', value: '********************************' },
    { label: 'MQTT 账号', value: '*********************' },
    { label: 'MQTT 密码', value: '*********************' },
  ],
});

const handleCopy = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success('已复制到剪贴板');
  });
};

const handleRefresh = (credential: Credential) => {
  ElMessage.success(`${credential.label}已刷新`);
};
</script>

<style scoped lang="scss">
.tab-content {
  .data-stats {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;

    .stat-box {
      flex: 1;
      padding: 20px 24px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &.blue {
        background: #eff6ff;
      }

      &.orange {
        background: #fef3c7;
      }

      .stat-label {
        font-size: 14px;
        color: #475569;
      }

      .stat-value {
        font-size: 20px;
        font-weight: 600;
        color: #1f2937;
      }
    }
  }

  .section {
    .section-title {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;

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
    }

    .credentials-table {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;

      .credential-row {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid #e5e7eb;

        &:last-child {
          border-bottom: none;
        }

        &:nth-child(odd) {
          background: #f9fafb;
        }

        .credential-label {
          width: 140px;
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }

        .credential-value {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #1f2937;
          font-family: monospace;

          .credential-actions {
            display: flex;
            gap: 8px;

            .action-icon {
              font-size: 16px;
              color: #64748b;
              cursor: pointer;

              &:hover {
                color: #3b82f6;
              }
            }
          }
        }
      }
    }
  }
}
</style>
