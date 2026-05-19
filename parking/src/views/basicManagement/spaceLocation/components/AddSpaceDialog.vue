<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑空间' : '新增空间'"
    width="800px"
    custom-class="add-space-dialog"
  >
    <el-form :model="form" label-width="100px" ref="formRef" :rules="rules">
      <el-form-item label="空间名称" required prop="spaceName">
        <el-input v-model="form.spaceName" placeholder="请输入空间名称" />
      </el-form-item>
      <el-form-item label="空间编码" required prop="spaceCode">
        <el-input v-model="form.spaceCode" placeholder="请输入空间编码" />
      </el-form-item>
      <el-form-item label="空间类型" required prop="spaceType">
        <el-select v-model="form.spaceType" placeholder="请选择空间类型">
          <el-option label="园区" value="park" />
          <el-option label="建筑" value="building" />
          <el-option label="楼层" value="floor" />
          <el-option label="房间" value="room" />
          <el-option label="区域" value="area" />
        </el-select>
      </el-form-item>
      <el-form-item label="建筑面积" required prop="buildingArea">
        <el-input v-model.number="form.buildingArea" placeholder="0">
          <template #append>m²</template>
        </el-input>
      </el-form-item>
      <el-form-item label="能耗配额" required prop="energyQuota">
        <el-input v-model.number="form.energyQuota" placeholder="0">
          <template #append>kWh/月</template>
        </el-input>
      </el-form-item>
      <el-form-item label="负责人" required prop="responsiblePerson">
        <el-input v-model="form.responsiblePerson" placeholder="请输入负责人姓名" />
      </el-form-item>
      <el-form-item label="联系电话" required prop="phone">
        <el-input v-model="form.phone" placeholder="请输入联系电话" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          placeholder="请输入备注信息"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue';
import { addSpace, updateSpace } from '/@/api/spaceLocation';
import { ElMessage, ElForm } from 'element-plus';

// 控制弹窗显示
const dialogVisible = ref(false);
const loading = ref(false);
const formRef = ref<InstanceType<typeof ElForm>>();

// 编辑状态
const isEdit = ref(false);

// 表单数据
const form = reactive({
  id: '',
  spaceName: '',
  spaceCode: '',
  spaceType: '建筑',
  buildingArea: 0,
  energyQuota: 0,
  responsiblePerson: '',
  phone: '',
  remark: '',
  parentId: ''
});

// 表单验证规则
const rules = reactive({
  spaceName: [{ required: true, message: '请输入空间名称', trigger: 'blur' }],
  spaceCode: [{ required: true, message: '请输入空间编码', trigger: 'blur' }],
  spaceType: [{ required: true, message: '请选择空间类型', trigger: 'change' }],
  buildingArea: [{ required: true, message: '请输入建筑面积', trigger: 'blur' }],
  energyQuota: [{ required: true, message: '请输入能耗配额', trigger: 'blur' }],
  responsiblePerson: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }]
});

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: '',
    spaceName: '',
    spaceCode: '',
    spaceType: '建筑',
    buildingArea: 0,
    energyQuota: 0,
    responsiblePerson: '',
    phone: '',
    remark: '',
    parentId: ''
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
    
    if (isEdit.value) {
      // 编辑空间
      await updateSpace(form);
      ElMessage.success('编辑空间成功');
    } else {
      // 新增空间
      await addSpace(form);
      ElMessage.success('新增空间成功');
    }
    
    dialogVisible.value = false;
    // 通知父组件刷新树结构
    emit('refreshTree');
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
const openDialog = (data?: any) => {
  if (data) {
    // 检查是否为编辑模式（有id字段）
    if (data.id) {
      // 编辑模式
      isEdit.value = true;
      Object.assign(form, data);
    } else {
      // 新增模式，可能包含parentId
      isEdit.value = false;
      if (data.parentId) {
        form.parentId = data.parentId;
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
  (e: 'refreshTree'): void
}>();

// 导出方法
defineExpose({
  openDialog
});
</script>

<style scoped>

</style>