<template>
	<div class="layout-padding gate-monitor-container">
		<!-- 左侧岗亭列表 -->
		<GateSidebar ref="gateSidebarRef" @select="handleGateSelect" @raise-all="handleRaiseAll" @reset="handleReset" />

		<!-- 右侧内容区 -->
		<div class="gate-content">
			<!-- 岗亭信息栏 -->
			<GateInfoBar :gate="selectedGate" @barrier-operate="handleBarrierOperate" />

			<!-- Tab 切换 -->
			<div class="content-tabs">
				<el-tabs v-model="activeTab" class="monitor-tabs">
					<el-tab-pane label="摄像头监控" name="camera">
						<CameraMonitor v-if="activeTab === 'camera'" :gate-id="selectedGateId" />
					</el-tab-pane>
					<el-tab-pane label="通行记录" name="passRecord">
						<PassRecord v-if="activeTab === 'passRecord'" :gate-id="selectedGateId" />
					</el-tab-pane>
				</el-tabs>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="gateMonitorIndex">
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';

// 异步加载组件
const GateSidebar = defineAsyncComponent(() => import('./components/GateSidebar.vue'));
const GateInfoBar = defineAsyncComponent(() => import('./components/GateInfoBar.vue'));
const CameraMonitor = defineAsyncComponent(() => import('./components/CameraMonitor.vue'));
const PassRecord = defineAsyncComponent(() => import('./components/PassRecord.vue'));

// refs
const gateSidebarRef = ref();

// 当前选中的岗亭ID
const selectedGateId = ref<string>('1');

// 当前选中的岗亭信息
const selectedGate = computed(() => {
	return gateSidebarRef.value?.getSelectedGate();
});

// 当前激活的 Tab
const activeTab = ref('camera');

// 选中岗亭
const handleGateSelect = (gateId: string) => {
	selectedGateId.value = gateId;
};

// 全部抬杆
const handleRaiseAll = () => {
	ElMessage.success('已发送全部抬杆指令');
	// TODO: 调用后端接口
};

// 复位
const handleReset = () => {
	ElMessage.success('已发送复位指令');
	// TODO: 调用后端接口
};

// 处理道闸操作结果
const handleBarrierOperate = (data: { gateId: string; operation: 'raise' | 'lower'; success: boolean; message: string }) => {
	console.log('道闸操作结果:', data);
	// 刷新岗亭数据
	if (gateSidebarRef.value?.refreshGateData) {
		gateSidebarRef.value.refreshGateData();
	}
};
</script>

<style scoped lang="scss">
.gate-monitor-container {
	display: flex;
	height: 100%;
	padding: 0 !important;
	flex-direction: row;

	.gate-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-width: 0;
		padding: 16px;
		overflow: hidden;
		gap: 16px;

		.content-tabs {
			flex: 1;
			background: #fff;
			border-radius: 8px;
			display: flex;
			flex-direction: column;
			overflow: hidden;
			box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

			.monitor-tabs {
				flex: 1;
				display: flex;
				flex-direction: column;

				:deep(.el-tabs__header) {
					margin: 0;
					padding: 0 16px;
					background: #fff;
					border-bottom: 1px solid #ebeef5;
				}

				:deep(.el-tabs__nav-wrap::after) {
					display: none;
				}

				:deep(.el-tabs__item) {
					height: 48px;
					line-height: 48px;
					font-size: 14px;
					color: #606266;
					padding: 0 20px;

					&:hover {
						color: #409eff;
					}

					&.is-active {
						color: #409eff;
						font-weight: 500;
					}
				}

				:deep(.el-tabs__active-bar) {
					height: 2px;
					background: #409eff;
				}

				:deep(.el-tabs__content) {
					flex: 1;
					padding: 16px;
					overflow: auto;
					background: #fff;
				}

				:deep(.el-tab-pane) {
					height: 100%;
				}
			}
		}
	}
}
</style>
