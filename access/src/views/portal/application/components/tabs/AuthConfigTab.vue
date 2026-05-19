<template>
  <div class="tab-content">
    <div class="section">
      <div class="section-title">
        <div class="title-line"></div>
        <span>授权配置信息</span>
        <el-tag type="info" size="small">授权信息在申请生成后会全部经保存在申请审批通过后</el-tag>
      </div>
      <el-descriptions :column="2" border class="auth-descriptions">
        <el-descriptions-item label="用户标识">
          {{ authConfig.userCode }}
        </el-descriptions-item>
        <el-descriptions-item label="授权项目">
          {{ authConfig.project }}
        </el-descriptions-item>
        <el-descriptions-item label="应用编码">
          {{ authConfig.appCode }}
        </el-descriptions-item>
        <el-descriptions-item label="产品版本">
          {{ authConfig.productVersion }}
        </el-descriptions-item>
        <el-descriptions-item label="配置版本">
          {{ authConfig.configVersion }}
        </el-descriptions-item>
        <el-descriptions-item label="生成时间">
          {{ authConfig.generateTime }}
        </el-descriptions-item>
        <el-descriptions-item label="授权有效期">
          {{ authConfig.validPeriod }}
          <el-tag type="success" size="small" class="valid-tag">活跃</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="邮件发送地址">
          {{ authConfig.email }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="section">
      <div class="section-title">
        <div class="title-line"></div>
        <span>功能权限 ({{ permissions.length }}个模块)</span>
      </div>
      <div class="permission-tags">
        <el-tag
          v-for="(perm, index) in permissions"
          :key="index"
          class="permission-tag"
        >
          <el-icon class="check-icon"><CircleCheck /></el-icon>
          {{ perm }}
        </el-tag>
      </div>
    </div>
    <div class="section">
      <div class="section-title">
        <div class="title-line"></div>
        <span>额度限制</span>
      </div>
      <div class="quota-cards">
        <div class="quota-card warning">
          <div class="quota-label">月工单上限</div>
          <div class="quota-value">{{ quota.monthlyOrderLimit.toLocaleString() }}</div>
        </div>
        <div class="quota-card danger">
          <div class="quota-label">最大用户数</div>
          <div class="quota-value">{{ quota.maxUsers }}</div>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">
        <div class="title-line"></div>
        <span>文件信息</span>
        <el-tag type="info" size="small">授权文件中的用户标识和项目名称为明文，其他授权配置已加密，您可以使用右上角工具栏中的「授权文件解析」工具查看解析后的全部配置信息。</el-tag>
      </div>
      <div class="file-name">{{ fileInfo.fileName }}</div>
      <div class="file-content">{{ fileInfo.fileContent }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 授权配置标签页组件
 */

import { CircleCheck } from '@element-plus/icons-vue';

interface AuthConfig {
  userCode: string;
  project: string;
  appCode: string;
  productVersion: string;
  configVersion: string;
  generateTime: string;
  validPeriod: string;
  email: string;
}

interface Quota {
  monthlyOrderLimit: number;
  maxUsers: number;
}

interface FileInfo {
  fileName: string;
  fileContent: string;
}

interface Props {
  authConfig: AuthConfig;
  permissions: string[];
  quota: Quota;
  fileInfo: FileInfo;
}

defineProps<Props>();
</script>

<style scoped lang="scss">
.tab-content {
  .section {
    margin-bottom: 24px;

    .section-title {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      flex-wrap: wrap;

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

    :deep(.el-descriptions) {
      .el-descriptions__label {
        width: 120px;
        background: #f9fafb;
      }
    }

    .valid-tag {
      margin-left: 8px;
    }

    .permission-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .permission-tag {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 8px 12px;
        background: #f0f5ff;
        color: #1890ff;
        border: none;

        .check-icon {
          color: #52c41a;
        }
      }
    }

    .quota-cards {
      display: flex;
      gap: 16px;

      .quota-card {
        flex: 1;
        padding: 20px;
        background: #fff1f0;
        border-radius: 8px;
        text-align: center;

        &.warning {
          background: #fff7e6;
        }

        .quota-label {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .quota-value {
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
        }
      }
    }

    .file-name {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 12px;
    }

    .file-content {
      padding: 16px;
      background: #1f2937;
      border-radius: 8px;
      color: #52c41a;
      font-family: monospace;
      font-size: 12px;
      line-height: 1.8;
      white-space: pre-wrap;
    }
  }
}
</style>
