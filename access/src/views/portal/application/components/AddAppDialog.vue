<template>
  <el-dialog
    v-model="dialogVisible"
    width="1200px"
    class="add-app-dialog"
    :close-on-click-modal="false"
    destroy-on-close
  >
    <template #header>
      <div class="dialog-header">
        <span class="dialog-title">新增应用</span>
      </div>
    </template>
    <div class="dialog-content">
      <div class="mode-tabs">
        <div
          class="tab-item"
          :class="{ active: currentMode === 'internal' }"
          @click="currentMode = 'internal'"
        >
          <span>激活内部应用</span>
          <el-icon v-if="currentMode === 'internal'" class="tab-icon"><Select /></el-icon>
        </div>
        <div
          class="tab-item"
          :class="{ active: currentMode === 'external' }"
          @click="currentMode = 'external'"
        >
          <span>新增第三方应用</span>
        </div>
      </div>

      <InternalAppPanel
        v-if="currentMode === 'internal'"
        @activate="handleActivate"
      />

      <ExternalAppPanel
        v-else
        ref="externalPanelRef"
      />
    </div>
    <template #footer v-if="currentMode === 'external'">
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSave">
          确认添加
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="AddAppDialog">
/**
 * 新增应用弹窗组件
 * @description 支持激活内部应用和新增第三方应用两种模式
 */

import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Select } from '@element-plus/icons-vue';
import type { AddAppFormData } from '../type';
import InternalAppPanel from './panels/InternalAppPanel.vue';
import ExternalAppPanel from './panels/ExternalAppPanel.vue';

interface Props {
  /** 是否显示弹窗 */
  visible: boolean;
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
  (e: 'save', data: AddAppFormData): void;
  (e: 'activate', data: any): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

/** 当前模式：internal-内部应用，external-第三方应用 */
const currentMode = ref('internal');
/** 外部应用面板引用 */
const externalPanelRef = ref();

/** 弹窗可见性 */
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
});

/**
 * 激活应用
 */
const handleActivate = (data: any) => {
  emit('activate', data);
};

/**
 * 取消
 */
const handleCancel = () => {
  dialogVisible.value = false;
};

/**
 * 保存
 */
const handleSave = async () => {
  const success = await externalPanelRef.value?.handleSave();
  if (success) {
    ElMessage.success('添加成功');
    dialogVisible.value = false;
  }
};
</script>

<style scoped lang="scss">
.add-app-dialog {
  :deep(.el-dialog__header) {
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
  .mode-tabs {
    display: flex;
    gap: 24px;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e5e7eb;

    .tab-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #6b7280;
      cursor: pointer;
      padding-bottom: 16px;
      position: relative;

      &.active {
        color: #1890ff;
        font-weight: 600;

        &::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: #1890ff;
        }
      }

      .tab-icon {
        color: #1890ff;
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
}
</style>
