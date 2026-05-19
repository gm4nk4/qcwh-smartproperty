<template>
	<div class="gate-sidebar">
		<!-- 操作按钮区 -->
		<div class="sidebar-header">
			<el-button type="primary" class="action-btn" @click="handleRaiseAll">全部抬杆</el-button>
			<el-button class="action-btn reset-btn" @click="handleReset">复位</el-button>
		</div>

		<!-- 岗亭列表 -->
		<div class="gate-list">
			<div
				v-for="gate in gateList"
				:key="gate.id"
				class="gate-item"
				:class="{
					'is-active': selectedGateId === gate.id,
				}"
				@click="handleSelectGate(gate)"
			>
				<div class="gate-info">
					<span class="status-dot" :class="gate.status === '0' ? 'normal' : 'raised'"></span>
					<span class="gate-name">{{ gate.name }}</span>
				</div>
				<div class="barrier-status">
					<span>C01 可进场</span>
					<span class="barrier-up" v-if="gate.barrierStatus === '1'">↑杆已抬起</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="GateSidebar">
import { ref } from 'vue';

// 定义事件
const emit = defineEmits<{
	(e: 'select', gateId: string): void;
	(e: 'raiseAll'): void;
	(e: 'reset'): void;
}>();

// 岗亭状态类型
type GateStatus = '0' | '1';
type BarrierStatus = '0' | '1';

interface Gate {
	id: string; // 岗亭ID
	name: string; // 岗亭名称
	status: GateStatus; // 岗亭状态 0:正常,1:故障
	barrierStatus: BarrierStatus; // 杠杆状态 0:正常,1:抬杆中
	type: string; // 岗亭类型-0:可进场,1:可出场,2:可进场可出场
}
// 岗亭列表 Mock 数据
const gateList = ref<Gate[]>([
	{ id: '1', name: '东门入口岗亭', status: '0', barrierStatus: '0', type: '0' },
	{ id: '2', name: '东门出口岗亭', status: '1', barrierStatus: '1', type: '1' },
	{ id: '3', name: '西门入口岗亭', status: '0', barrierStatus: '0', type: '0' },
	{ id: '4', name: '地下车库入口', status: '0', barrierStatus: '0', type: '0' },
	{ id: '5', name: '地下车库出口', status: '1', barrierStatus: '1', type: '2' },
]);

// 当前选中的岗亭
const selectedGateId = ref<string>('1');

// 选中岗亭
const handleSelectGate = (gate: Gate) => {
	selectedGateId.value = gate.id;
	emit('select', gate.id);
};

// 全部抬杆
const handleRaiseAll = () => {
	emit('raiseAll');
};

// 复位
const handleReset = () => {
	emit('reset');
};

// 暴露方法供父组件调用
defineExpose({
	selectedGateId,
	getSelectedGate: () => gateList.value.find((g) => g.id === selectedGateId.value),
});
</script>

<style scoped lang="scss">
.gate-sidebar {
	width: 260px;
	min-width: 240px;
	display: flex;
	flex-direction: column;
	height: 100%;
	background: #fff;
	border-radius: 8px;
	margin: 16px 0 16px 16px;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

	.sidebar-header {
		padding: 16px;
		border-bottom: 1px solid #ebeef5;
		display: flex;
		gap: 12px;
		background: linear-gradient(180deg, #fafbfc 0%, #fff 100%);

		.action-btn {
			flex: 1;
			border-radius: 6px;
		}

		.reset-btn {
			background: #f5f7fa;
			border-color: #dcdfe6;
			color: #606266;

			&:hover {
				background: #e9e9eb;
				border-color: #c0c4cc;
			}
		}
	}

	.gate-list {
		flex: 1;
		overflow-y: auto;
		display: flex;
		gap: 12px;
		flex-direction: column;
		padding: 12px 16px 16px;

		&::-webkit-scrollbar {
			width: 6px;
		}

		&::-webkit-scrollbar-thumb {
			background: #dcdfe6;
			border-radius: 3px;

			&:hover {
				background: #c0c4cc;
			}
		}

		&::-webkit-scrollbar-track {
			background: transparent;
		}

		.gate-item {
			padding: 14px 16px;
			cursor: pointer;
			display: flex;
			flex-direction: column;
			gap: 12px;
			position: relative;
			transition: all 0.2s ease;
			background: #f9fafb;
			border-radius: 6px;
			border: 1px solid transparent;

			&:hover {
				background: #f5f7fa;
				border-color: #e4e7ed;
			}

			&.is-active {
				background: #ecf5ff;
				border-color: #409eff;

				.gate-name {
					color: #409eff;
				}
			}

			.gate-info {
				display: flex;
				align-items: center;
				gap: 10px;
			}

			.status-dot {
				width: 8px;
				height: 8px;
				border-radius: 50%;
				flex-shrink: 0;

				&.normal {
					background: #67c23a;
					box-shadow: 0 0 4px rgba(103, 194, 58, 0.4);
				}

				&.raised {
					background: #f56c6c;
					box-shadow: 0 0 4px rgba(245, 108, 108, 0.4);
				}
			}

			.gate-name {
				font-size: 14px;
				color: #303133;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.barrier-status {
				color: #909399;
				font-size: 12px;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.barrier-up {
				color: #f56c6c;
				font-weight: 500;
			}
		}
	}
}
</style>
