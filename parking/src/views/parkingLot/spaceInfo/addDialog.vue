<template>
	<el-dialog :close-on-click-modal="false" title="批量生成车位编号" width="800" draggable v-model="visible">
		<el-form :model="form" :rules="dataRules" label-width="100px" ref="dataFormRef" v-loading="loading">
			<el-form-item label="所属停车场" prop="parkingGroundId">
				<el-select v-model="form.parkingGroundId" placeholder="请选择所属停车场" style="width: 100%" :loading="parkingLotLoading">
					<el-option v-for="item in parkingLotList" :key="item.id" :label="item.parkingGroundName" :value="item.id!" />
				</el-select>
			</el-form-item>
			<el-row :gutter="20" class="row-margin">
				<el-col :span="8">
					<el-form-item label="编号前缀" prop="prefix">
						<el-input placeholder="如：A" v-model="form.prefix" />
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="起始编号" prop="startNumber">
						<el-input-number v-model="form.startNumber" :min="1" :max="9999" style="width: 100%" />
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="生成数量" prop="count">
						<el-input-number v-model="form.count" :min="1" :max="999" style="width: 100%" />
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item label="车位类型" prop="type">
				<el-select v-model="form.type" placeholder="请选择车位类型" style="width: 100%">
					<el-option label="月租" value="monthly" />
					<el-option label="临时" value="temporary" />
				</el-select>
			</el-form-item>
		</el-form>
		<!-- 预览区域 -->
		<div class="preview-area">
			<span class="preview-tag">
				<el-icon class="preview-icon"><MagicStick /></el-icon>
				<span>预览：{{ previewText }}</span>
			</span>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">取消</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="AddDialog" setup>
import { computed, ref, reactive, nextTick } from 'vue';
import { MagicStick } from '@element-plus/icons-vue';
import { useMessage } from '/@/hooks/message';
import { batchGenerateSpaces, getParkingGroundPage } from '/@/api/parkingInfo';
import type { ParkingGround, BatchGenerateSpaceParams } from '/@/api/parkingInfo/type';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
const parkingLotLoading = ref(false);
const parkingLotList = ref<ParkingGround[]>([]);

// 提交表单数据
const form = reactive<BatchGenerateSpaceParams>({
	parkingGroundId: 0,
	prefix: '',
	startNumber: 1,
	count: 10,
	type: '',
});

// 预览文本
const previewText = computed(() => {
	const prefix = form.prefix || '';
	const start = form.startNumber;
	const count = form.count;
	const end = start + count - 1;
	const startStr = String(start).padStart(3, '0');
	const endStr = String(end).padStart(3, '0');
	const typeText = form.type === 'monthly' ? '月租' : form.type === 'temporary' ? '临时' : '车位';
	return `将生成 ${prefix}${startStr} ~ ${prefix}${endStr} 共 ${count} 个${typeText}车位`;
});

// 定义校验规则
const dataRules = ref({
	parkingGroundId: [{ required: true, message: '请选择所属停车场', trigger: 'change' }],
	prefix: [{ required: true, message: '请输入编号前缀', trigger: 'blur' }],
	startNumber: [{ required: true, message: '请输入起始编号', trigger: 'blur' }],
	count: [{ required: true, message: '请输入生成数量', trigger: 'blur' }],
	type: [{ required: true, message: '请选择车位类型', trigger: 'change' }],
});

// 获取停车场列表
const fetchParkingLotList = async () => {
	parkingLotLoading.value = true;
	try {
		const res = await getParkingGroundPage({ current: 1, size: 9999 });
		if (res.code === 0 && res.data) {
			parkingLotList.value = res.data.records || [];
			// 默认选中第一个停车场
			if (parkingLotList.value.length > 0 && form.parkingGroundId === 0) {
				form.parkingGroundId = parkingLotList.value[0].id!;
			}
		}
	} catch (error) {
		console.error('获取停车场列表失败', error);
	} finally {
		parkingLotLoading.value = false;
	}
};

// 打开弹窗
const openDialog = () => {
	visible.value = true;
	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
		form.parkingGroundId = 0;
		form.prefix = '';
		form.startNumber = 1;
		form.count = 10;
		form.type = '';
	});
	// 获取停车场列表
	fetchParkingLotList();
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		const res = await batchGenerateSpaces(form);
		if (res.code === 0) {
			useMessage().success('生成成功');
			visible.value = false;
			emit('refresh');
		} else {
			useMessage().error(res.msg || '操作失败');
		}
	} catch (err: any) {
		useMessage().error(err.msg || '操作失败');
	} finally {
		loading.value = false;
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.preview-area {
	margin-top: 20px;
}
.preview-tag {
	display: inline-flex;
	align-items: center;
	width: 100%;
	padding: 12px 16px;
	background: var(--el-color-primary-light-9);
	border: 1px solid var(--el-color-primary-light-7);
	border-radius: 4px;
	color: var(--el-color-primary);
	font-size: 14px;
}
.preview-icon {
	margin-right: 8px;
	font-size: 16px;
}
.row-margin {
	margin-bottom: 18px;
}
.row-margin :deep(.el-form-item) {
	margin-bottom: 0;
}
:deep(.el-form-item__error) {
	position: relative;
	top: 0;
	left: 0;
	padding-top: 4px;
}
</style>
