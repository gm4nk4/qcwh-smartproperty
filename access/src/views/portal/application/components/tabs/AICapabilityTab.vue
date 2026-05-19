<template>
  <div class="tab-content">
    <div class="ai-capabilities">
      <div
        v-for="(capability, index) in capabilities"
        :key="index"
        class="ai-card"
      >
        <div class="ai-icon-wrapper">
          <div class="ai-icon-box">
            <el-icon><MagicStick /></el-icon>
          </div>
        </div>
        <div class="ai-info">
          <div class="ai-name">{{ capability.name }}</div>
          <div class="ai-desc">{{ capability.description }}</div>
        </div>
        <div class="ai-right">
          <el-tag type="info" size="small" class="accuracy-tag">{{ capability.accuracy }}</el-tag>
          <el-tag :type="capability.enabled ? 'success' : 'danger'" size="small">
            {{ capability.enabled ? '启用' : '停用' }}
          </el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * AI能力标签页组件
 */

import { MagicStick } from '@element-plus/icons-vue';

export interface AICapability {
  name: string;
  description: string;
  accuracy: string;
  enabled: boolean;
}

interface Props {
  capabilities?: AICapability[];
}

const props = withDefaults(defineProps<Props>(), {
  capabilities: () => [
    {
      name: 'AI智能派单引擎',
      description: '基于工单类型、紧急程度、技能匹配度、地理位置和当前工作负载，自动匹配最优维修人员并派发工单',
      accuracy: '准确率85.2%',
      enabled: true,
    },
    {
      name: 'AI工单故障诊断',
      description: '通过NLP分析业主报修描述，自动识别故障类型、判断严重程度，并推荐维修方案',
      accuracy: '准确率85.2%',
      enabled: true,
    },
    {
      name: 'AI智能排班优化',
      description: '综合考虑劳动合规（每周40小时）、高峰时段覆盖、员工技能和成本最优，自动生成排班方案，支持一键应用',
      accuracy: '准确率85.2%',
      enabled: true,
    },
  ],
});
</script>

<style scoped lang="scss">
.tab-content {
  .ai-capabilities {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .ai-card {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      align-items: flex-start;

      .ai-icon-wrapper {
        flex-shrink: 0;

        .ai-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 4px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;

          .el-icon {
            font-size: 24px;
          }
        }
      }

      .ai-info {
        flex: 1;

        .ai-name {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .ai-desc {
          font-size: 12px;
          color: #64748b;
          line-height: 1.6;
        }
      }

      .ai-right {
        display: flex;
        gap: 8px;
        align-items: center;

        .accuracy-tag {
          margin: 0;
        }
      }
    }
  }
}
</style>
