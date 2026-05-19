<template>
	<el-dialog title="自动拉黑规则" width="800" draggable v-model="visible" :close-on-click-modal="false">
		<!-- 顶部说明栏 -->
		<div class="tip-bar">
			<el-icon><InfoFilled /></el-icon>
			<span>以下规则配置来源于AI视频分析系统，本模块仅可配置是否在产生对应事件后自动将车牌加入黑名单。</span>
		</div>

		<!-- 规则卡片列表 -->
		<div class="rule-list">
			<div v-for="rule in ruleList" :key="rule.id" class="rule-card">
				<!-- 卡片头部：标题、状态圆点、命中统计 -->
				<div class="card-header">
					<div class="title-area">
						<span class="status-dot" :class="{ active: rule.enabled }"></span>
						<span class="title">{{ rule.name }}</span>
					</div>
					<span class="hit-count">命中{{ rule.hitCount }}次</span>
				</div>

				<!-- 场景说明 -->
				<div class="scene-desc">{{ rule.sceneDesc }}</div>

				<!-- 触发条件 -->
				<div class="info-row">
					<span class="label">触发条件:</span>
					<span class="content">{{ rule.triggerCondition }}</span>
				</div>

				<!-- 配置区域 -->
				<div class="config-area">
					<!-- 拉黑天数 -->
					<div class="config-item">
						<span class="label">拉黑天数:</span>
						<el-input-number v-model="rule.blacklistDays" :min="1" :max="365" :disabled="!rule.enabled" size="small" />
						<span class="unit">天</span>
					</div>

					<!-- 启用状态 -->
					<div class="config-item">
						<span class="label">是否启用:</span>
						<el-switch v-model="rule.enabled" />
						<span class="status-text" :class="{ active: rule.enabled }">{{ rule.enabled ? '已启用' : '已关闭' }}</span>
					</div>
				</div>
			</div>
		</div>

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">取消</el-button>
				<el-button type="primary" @click="onSubmit">保存</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="AutoBlacklistDialog">
import { ref, reactive } from 'vue';
import { InfoFilled } from '@element-plus/icons-vue';
import { useMessage } from '/@/hooks/message';

const visible = ref(false);

// 规则列表数据
const ruleList = ref([
	{
		id: 1,
		name: '园区超速检测',
		sceneDesc: '限速30km/h，超速50%以上自动拉黑',
		triggerCondition: '超速≥50%且累计≥3次',
		blacklistDays: 92,
		hitCount: 8,
		enabled: true,
	},
	{
		id: 2,
		name: '闯杆检测',
		sceneDesc: '尾随前车闯杆进入',
		triggerCondition: '闯杆1次',
		blacklistDays: 90,
		hitCount: 3,
		enabled: true,
	},
	{
		id: 3,
		name: '逃缴检测',
		sceneDesc: '未缴费强行出场',
		triggerCondition: '逃缴≥3次',
		blacklistDays: 180,
		hitCount: 2,
		enabled: true,
	},
	{
		id: 4,
		name: '长期占位',
		sceneDesc: '非月租车辆连续停放超72小时',
		triggerCondition: '连续停放>72h',
		blacklistDays: 30,
		hitCount: 0,
		enabled: false,
	},
]);

// 打开弹窗
const openDialog = () => {
	visible.value = true;
};

// 提交保存
const onSubmit = () => {
	console.log('保存规则配置', ruleList.value);
	useMessage().success('保存成功');
	visible.value = false;
};

// 暴露方法
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.tip-bar {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 12px 16px;
	background-color: var(--el-color-primary-light-9);
	border-radius: 4px;
	margin-bottom: 20px;
	color: var(--el-color-primary);
	font-size: 14px;
}

.rule-list {
	display: flex;
	flex-direction: column;
	gap: 16px;
	max-height: 500px;
	overflow-y: auto;
}

.rule-card {
	background: #fff;
	border: 1px solid #e8e8e8;
	border-radius: 8px;
	padding: 16px;
	position: relative;
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 8px;
}

.title-area {
	display: flex;
	align-items: center;
	gap: 8px;
}

.status-dot {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background-color: #d9d9d9;

	&.active {
		background-color: #52c41a;
	}
}

.title {
	font-weight: 600;
	font-size: 16px;
	color: #262626;
}

.hit-count {
	font-size: 14px;
	color: #8c8c8c;
}

.scene-desc {
	font-size: 13px;
	color: #8c8c8c;
	margin-bottom: 12px;
}

.info-row {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 16px;
	font-size: 14px;

	.label {
		color: #595959;
	}

	.content {
		color: #262626;
	}
}

.config-area {
	display: flex;
	align-items: center;
	gap: 32px;
	padding-top: 12px;
	border-top: 1px solid #f0f0f0;
}

.config-item {
	display: flex;
	align-items: center;
	gap: 8px;

	.label {
		font-size: 14px;
		color: #595959;
	}

	.unit {
		font-size: 14px;
		color: #595959;
	}
}

.status-text {
	font-size: 14px;
	color: #8c8c8c;

	&.active {
		color: #52c41a;
	}
}
</style>
