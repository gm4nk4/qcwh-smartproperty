<template>
  <div class="tab-content">
    <div class="info-cards">
      <div class="info-card blue">
        <div class="card-label">版本</div>
        <div class="card-value">{{ basicInfo.version }}</div>
      </div>
      <div class="info-card yellow">
        <div class="card-label">授权用户</div>
        <div class="card-value">{{ basicInfo.userCount }}/50</div>
      </div>
      <div class="info-card purple">
        <div class="card-label">AI工具</div>
        <div class="card-value">{{ basicInfo.aiToolCount }}个</div>
      </div>
      <div class="info-card cyan">
        <div class="card-label">分类</div>
        <div class="card-value">{{ basicInfo.category }}</div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">
        <div class="title-line"></div>
        <span>应用凭证信息</span>
      </div>
      <el-descriptions :column="2" border class="credentials-descriptions">
        <el-descriptions-item label="应用编码">
          {{ credentials.appCode }}
        </el-descriptions-item>
        <el-descriptions-item label="Token">
          <div class="copy-item">
            <span class="text">{{ credentials.token }}</span>
            <el-icon class="copy-icon" @click="handleCopy(credentials.token)">
              <CopyDocument />
            </el-icon>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="Refresh Token">
          <div class="copy-item">
            <span class="text">{{ credentials.refreshToken }}</span>
            <el-icon class="copy-icon" @click="handleCopy(credentials.refreshToken)">
              <CopyDocument />
            </el-icon>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="org-box">
      <div class="org-icon">
        <el-icon><OfficeBuilding /></el-icon>
      </div>
      <div class="org-text">
        <div class="org-title">启用独立组织架构管理</div>
        <div class="org-desc">
          部分应用需要独立维护自己的组织架构，不受平台统一架构关联，如停车管理、公安管理、工单管理等需要专职或授权的独立架构，可在「组织管理」中看到并统一管理。
        </div>
      </div>
    </div>
    <div class="tips-box">
      <div class="tip-item">
        <el-icon><InfoFilled /></el-icon>
        <span>应用激活后，需在「角色管理」中为各角色配置适用的功能权限。</span>
      </div>
      <div class="tip-item">
        <el-icon><InfoFilled /></el-icon>
        <span>关联的AI工具在应用激活后才会在「AI工具中心」中展示，且可通过角色权限精确控制到个人。</span>
      </div>
      <div class="tip-item">
        <el-icon><InfoFilled /></el-icon>
        <span>停用应用不会删除数据，但用户将无法访问该应用，相关AI工具也将自动隐藏。</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 基本信息标签页组件
 */

import { CopyDocument, InfoFilled, OfficeBuilding } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

interface BasicInfo {
  version: string;
  userCount: number;
  aiToolCount: number;
  category: string;
}

interface Credentials {
  appCode: string;
  token: string;
  refreshToken: string;
}

interface Props {
  basicInfo: BasicInfo;
  credentials: Credentials;
}

defineProps<Props>();

const handleCopy = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success('已复制到剪贴板');
  });
};
</script>

<style scoped lang="scss">
.tab-content {
  .info-cards {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;

    .info-card {
      flex: 1;
      padding: 16px;
      border-radius: 8px;
      text-align: center;

      &.blue {
        background: #eff6ff;
      }

      &.yellow {
        background: #fff7e6;
      }

      &.purple {
        background: #f9f0ff;
      }

      &.cyan {
        background: #e6fffb;
      }

      .card-label {
        font-size: 14px;
        color: #6b7280;
        margin-bottom: 8px;
      }

      .card-value {
        font-size: 20px;
        font-weight: 600;
        color: #1f2937;
      }
    }
  }

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

    .copy-item {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .text {
        flex: 1;
      }

      .copy-icon {
        cursor: pointer;
        color: #1890ff;
        margin-left: 8px;

        &:hover {
          color: #40a9ff;
        }
      }
    }
  }

  .org-box {
    display: flex;
    gap: 12px;
    padding: 16px;
    background: #eff6ff;
    border-radius: 8px;
    border: 1px solid #91caff;
    margin-bottom: 16px;

    .org-icon {
      width: 40px;
      height: 40px;
      background: #1890ff;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;

      .el-icon {
        font-size: 20px;
      }
    }

    .org-text {
      flex: 1;

      .org-title {
        font-size: 14px;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 4px;
      }

      .org-desc {
        font-size: 12px;
        color: #6b7280;
        line-height: 1.6;
      }
    }
  }

  .tips-box {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: #f5f7fa;
    padding: 16px;
    border-radius: 8px;

    .tip-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 12px;
      color: #6b7280;

      .el-icon {
        color: #1890ff;
        margin-top: 2px;
        flex-shrink: 0;
      }
    }
  }
}
</style>
