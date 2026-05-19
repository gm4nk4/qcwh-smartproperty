<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑告警规则' : '新增告警规则'"
    width="800px"
    custom-class="add-alarm-rule-dialog"
  >
    <el-form :model="form" label-width="100px" ref="formRef" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="24" class="mb20">
          <el-form-item label="规则名称" required prop="ruleName">
            <el-input v-model="form.ruleName" placeholder="请输入规则名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="告警类型" required prop="alarmType">
            <el-select v-model="form.alarmType" placeholder="请选择告警类型">
              <el-option v-for="item in alarm_type" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="告警级别" required prop="alarmLevel">
            <el-select v-model="form.alarmLevel" placeholder="请选择告警级别">
              <el-option v-for="item in alarm_level" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="监测指标" required prop="metrics">
            <el-select v-model="form.metrics" placeholder="请选择监测指标">
              <el-option v-for="item in metrics_indicators" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="触发条件" required prop="triggerCondition">
            <el-select v-model="form.triggerCondition" placeholder="请选择触发条件">
              <el-option v-for="item in trigger_condition" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
         <el-col :span="12" class="mb20">
          <el-form-item label="阈值" required prop="threshold">
            <el-input v-model.number="form.threshold" placeholder="0" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="持续时间" required prop="duration">
            <el-input v-model.number="form.duration" placeholder="5">
              <template #append>分钟</template>
            </el-input>
          </el-form-item>
        </el-col>
         <el-col :span="24" class="mb20">
          <el-form-item label="通知方式" prop="notifyMethods">
            <div class="notification-methods">
              <el-checkbox-group v-model="form.notifyMethods">
                <el-checkbox v-for="item in notify_methods" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>
        </el-col>
         <el-col :span="24" class="mb20">
          <el-form-item label="通知对象" prop="notifyTargets">
            <el-input v-model="form.notifyTargets" placeholder="请输入通知对象，多个用逗号分隔" />
          </el-form-item>
        </el-col>
         <el-col :span="24" class="mb20">
          <el-form-item label="规则描述" prop="ruleDesc">
            <el-input
              v-model="form.ruleDesc"
              type="textarea"
              placeholder="请输入规则描述"
              :rows="3"
            />
          </el-form-item>
        </el-col>
         <el-col :span="24" class="mb20">
          <el-form-item label="立即启用" prop="status">
            <el-switch v-model="form.status" active-text="" inactive-text="" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import { ElMessage, ElForm } from 'element-plus';
import { useDict } from '/@/hooks/dict';
import { saveOrUpdateAlarmRule, getAlarmRuleDetail } from '/@/api/basicManagement/alarm';

// 控制弹窗显示
const dialogVisible = ref(false);
const loading = ref(false);
const formRef = ref<InstanceType<typeof ElForm>>();

// 编辑状态
const isEdit = ref(false);

// 字典数据
const { alarm_type, alarm_level, metrics_indicators, trigger_condition, notify_methods } = useDict('alarm_type', 'alarm_level', 'metrics_indicators', 'trigger_condition', 'notify_methods');

// 表单数据
const form = reactive({
  id: 0,
  ruleName: '',
  alarmType: '',
  alarmLevel: '',
  metrics: '',
  triggerCondition: '',
  threshold: 0,
  duration: 5,
  status: true,
  ruleDesc: '',
  notifyMethods: [] as string[],
  notifyTargets: '',
});

// 表单验证规则
const rules = reactive({
  ruleName: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
  alarmType: [{ required: true, message: '请选择告警类型', trigger: 'change' }],
  alarmLevel: [{ required: true, message: '请选择告警级别', trigger: 'change' }],
  metrics: [{ required: true, message: '请选择监测指标', trigger: 'change' }],
  triggerCondition: [{ required: true, message: '请选择触发条件', trigger: 'change' }],
  threshold: [{ required: true, message: '请输入阈值', trigger: 'blur' }],
  duration: [{ required: true, message: '请输入持续时间', trigger: 'blur' }]
});

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: 0,
    ruleName: '',
    alarmType: '',
    alarmLevel: '',
    metrics: '',
    triggerCondition: '',
    threshold: 0,
    duration: 5,
    status: true,
    ruleDesc: '',
    notifyMethods: [],
    notifyTargets: '',
  });
  isEdit.value = false;
  formRef.value?.resetFields();
};

// 处理取消
const handleCancel = () => {
  dialogVisible.value = false;
};

// 处理提交
const handleSubmit = async () => {
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
    loading.value = true;
    
    // 处理 notifyMethods 为数组的情况，转换为字符串
    const submitData: any = { ...form };
    if (Array.isArray(submitData.notifyMethods)) {
      submitData.notifyMethods = submitData.notifyMethods.join(',');
    }
    // 新增时不传递 id 字段
    if (!isEdit.value) {
      delete submitData.id;
    }
    
    const res = await saveOrUpdateAlarmRule(submitData);
    if (res.code === 0) {
      ElMessage.success(isEdit.value ? '编辑告警规则成功' : '新增告警规则成功');
      dialogVisible.value = false;
      // 通知父组件刷新列表
      emit('refresh-list');
    } else {
      ElMessage.error('操作失败：' + (res.message || '未知错误'));
    }
  } catch (error: any) {
    if (error.message) {
      ElMessage.error(error.message);
    } else {
      ElMessage.error('操作失败，请重试');
    }
  } finally {
    loading.value = false;
  }
};

// 监听弹窗关闭，清空表单
watch(dialogVisible, (newVal) => {
  if (!newVal) {
    resetForm();
  }
});

// 打开弹窗方法
const openDialog = async (data?: any) => {
  if (data) {
    // 检查是否为编辑模式（有id字段）
    if (data.id) {
      // 编辑模式
      isEdit.value = true;
      // 调用详情接口获取数据
      try {
        loading.value = true;
        const res = await getAlarmRuleDetail(data.id);
        if (res.code === 0) {
          const formData = { ...res.data };
          // 处理 notifyMethods 为 string 的情况
          if (typeof formData.notifyMethods === 'string') {
            formData.notifyMethods = formData.notifyMethods.split(',').filter((item: string) => item.trim());
          }
          Object.assign(form, formData);
        } else {
          ElMessage.error('获取告警规则详情失败：' + (res.message || '未知错误'));
          return;
        }
      } catch (error) {
        ElMessage.error('获取告警规则详情失败');
        console.error('获取告警规则详情失败:', error);
        return;
      } finally {
        loading.value = false;
      }
    }
  } else {
    // 没有数据传入，重置表单为新增模式
    resetForm();
  }
  
  dialogVisible.value = true;
};

// 定义事件
const emit = defineEmits<{
  (e: 'refresh-list'): void
}>();

// 导出方法
defineExpose({
  openDialog
});
</script>

<style scoped>
.notification-methods {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
</style>