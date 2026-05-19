<template>
	<el-dialog title="手动拉黑" width="600" draggable v-model="visible" :close-on-click-modal="false">
		<!-- 顶部警告栏 -->
		<div class="warning-bar">
			<el-icon><WarningFilled /></el-icon>
			<span>拉黑后该车辆将无法通过任何岗亭入场，请谨慎操作。</span>
		</div>

		<!-- 表单区域 -->
		<el-form :model="form" :rules="rules" ref="formRef" label-width="100px" class="manual-form">
			<!-- 第一行：车牌号 + 车辆品牌 -->
			<el-row :gutter="20" class="row-margin">
				<el-col :span="12">
					<el-form-item label="车牌号" prop="plateNumber">
						<el-input v-model="form.plateNumber" placeholder="京A·XXXXX" />
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="车辆品牌">
						<el-input v-model="form.vehicleBrand" placeholder="如：大众 帕萨特" />
					</el-form-item>
				</el-col>
			</el-row>

			<!-- 第二行：车身颜色 -->
			<el-form-item label="车身颜色" class="form-item-margin">
				<el-input v-model="form.vehicleColor" placeholder="如：黑色" />
			</el-form-item>

			<!-- 第三行：拉黑原因 -->
			<el-form-item label="拉黑原因" prop="reason" class="form-item-margin">
				<el-input v-model="form.reason" type="textarea" :rows="3" placeholder="请详细描述拉黑原因..." />
			</el-form-item>

			<!-- 第四行：拉黑时长 + 操作人 -->
			<el-row :gutter="20" class="row-margin">
				<el-col :span="12">
					<el-form-item label="拉黑时长">
						<el-select v-model="form.duration" placeholder="请选择" style="width: 100%">
							<el-option label="7天" value="7" />
							<el-option label="15天" value="15" />
							<el-option label="30天" value="30" />
							<el-option label="90天" value="90" />
							<el-option label="180天" value="180" />
							<el-option label="永久" value="永久" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="操作人">
						<el-input v-model="form.operator" disabled />
					</el-form-item>
				</el-col>
			</el-row>

			<!-- 第五行：备注 -->
			<el-form-item label="备注">
				<el-input v-model="form.remark" placeholder="选填" />
			</el-form-item>
		</el-form>

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">取消</el-button>
				<el-button type="primary" @click="onSubmit">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="ManualBlacklistDialog">
import { ref, reactive } from 'vue';
import { WarningFilled } from '@element-plus/icons-vue';
import { useMessage } from '/@/hooks/message';

const visible = ref(false);
const formRef = ref();

// 表单数据
const form = reactive({
	plateNumber: '',
	vehicleBrand: '',
	vehicleColor: '',
	reason: '',
	duration: '30',
	operator: '当前管理员',
	remark: '',
});

// 校验规则
const rules = {
	plateNumber: [{ required: true, message: '请输入车牌号', trigger: 'blur' }],
	reason: [{ required: true, message: '请输入拉黑原因', trigger: 'blur' }],
};

// 打开弹窗
const openDialog = () => {
	visible.value = true;
	// 重置表单
	nextTick(() => {
		formRef.value?.resetFields();
	});
};

// 提交
const onSubmit = async () => {
	const valid = await formRef.value?.validate().catch(() => {});
	if (!valid) return;

	console.log('提交手动拉黑', form);
	useMessage().success('拉黑成功');
	visible.value = false;
};

// 暴露方法
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.warning-bar {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 12px 16px;
	background-color: #ffebee;
	border-radius: 4px;
	margin-bottom: 20px;
	color: #f56c6c;
	font-size: 14px;
}

.manual-form {
	:deep(.el-form-item__label) {
		font-weight: 500;
		color: #303133;
	}

	:deep(.el-form-item.is-required .el-form-item__label::before) {
		color: #f56c6c;
	}
}

.row-margin {
	margin-bottom: 18px;
}

.form-item-margin {
	margin-bottom: 18px;
}
</style>
