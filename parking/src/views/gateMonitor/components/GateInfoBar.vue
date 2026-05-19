<template>
	<div class="gate-info-bar">
		<div class="gate-name">
			<span>{{ gate?.name || '请选择岗亭' }}</span>
			<el-tag type="success">正常</el-tag>
		</div>
		<div class="gate-info">编号：D01 · 南门入口杆, 南门出口杆</div>
		<div class="barrier-status">
			<div class="barrier-title">道闸控制（{{ gate.gateArr?.length || 0 }}个道闸）</div>
			<div class="barrier-list">
				<div v-for="item in gate.gateArr" :key="item.id" class="barrier-item" :class="{ 'is-raised': item.barrierStatus === '1' }">
					<div class="barrier-name-row">
						<span>{{ item.name }}</span>
						<span class="status-dot" :class="item.status === '0' ? 'normal' : 'fault'"></span>
					</div>
					<span class="barrier-down" v-if="item.barrierStatus === '0'" @click="handleRaise(item.id)">手动抬杆</span>
					<span class="barrier-up" v-if="item.barrierStatus === '1'" @click="handleLower(item.id)">↑已抬杆,点击落杆</span>
				</div>
			</div>
			<div class="barrier-actions">
				<span class="action-raise" @click="handleRaiseAll">↑本岗亭全部抬杆</span>
				<span class="action-reset" @click="handleResetAll"
					><el-icon><RefreshRight /></el-icon>本岗亭全部复位</span
				>
			</div>
		</div>
		<div class="gate-card-container">
			<div v-for="item in cardData" :key="item.title" class="gate-card">
				<span>{{ item.title }}</span>
				<span class="gate-card-value" :class="getValueClass(item)">{{ item.value }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="GateInfoBar">
import { RefreshRight } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

// interface Gate {
// 	id: string;
// 	name: string;
// 	status: GateStatus;
// 	barrierStatus: BarrierStatus;
// }

// 接收 props
// defineProps<{
// 	gate?: Gate;
// }>();

// 定义 emit
const emit = defineEmits<{
	(e: 'barrier-operate', data: { gateId: string; operation: 'raise' | 'lower'; success: boolean; message: string }): void;
}>();

const gate = {
	id: 1,
	name: '南门入口杆',
	status: '0', //岗亭状态 0:正常,1:故障
	gateArr: [
		{ id: '1', name: '东门入口岗亭杆', status: '0', barrierStatus: '0' },
		{ id: '2', name: '东门出口岗亭杆', status: '1', barrierStatus: '1' },
		{ id: '3', name: '西门入口岗亭杆', status: '0', barrierStatus: '0' },
	],
	ling: '1',
	komhchang: '0',
	shifoushoufei: '0',
	fangxiang: '0',
	cheliangNum: 120,
};

const cardData = [
	{
		title: '临时车进场',
		value: gate.ling === '1' ? '允许' : '不允许',
		type: 'temp',
	},
	{
		title: '访客车进场',
		value: gate.komhchang === '1' ? '允许' : '不允许',
		type: 'visit',
	},
	{
		title: '是否收费',
		value: gate.shifoushoufei === '1' ? '是' : '否',
		type: 'charge',
	},
	{
		title: '通行方向',
		value: gate.fangxiang === '1' ? '可进出' : '可进出',
		type: 'direction',
	},
	{
		title: '今日通行',
		value: gate.cheliangNum + ' 辆',
		type: 'count',
	},
];

const getValueClass = (item: { title: string; value: string; type: string }) => {
	switch (item.type) {
		case 'temp':
		case 'visit':
			return item.value === '允许' ? 'value-green' : 'value-red';
		case 'charge':
			return item.value === '是' ? 'value-red' : 'value-gray';
		case 'direction':
			if (item.value === '可进出') return 'value-purple';
			if (item.value === '可出场') return 'value-gray';
			if (item.value === '可进场') return 'value-blue';
			return '';
		default:
			return '';
	}
};

// 抬杆方法
const handleRaise = async (gateId: string) => {
	try {
		// TODO: 调用后端接口
		// const res = await raiseBarrierApi(gateId);

		ElMessage.success('抬杆成功');
		emit('barrier-operate', {
			gateId,
			operation: 'raise',
			success: true,
			message: '抬杆成功',
		});
	} catch (error) {
		ElMessage.error('抬杆失败');
		emit('barrier-operate', {
			gateId,
			operation: 'raise',
			success: false,
			message: '抬杆失败',
		});
	}
};

// 落杆方法
const handleLower = async (gateId: string) => {
	try {
		// TODO: 调用后端接口
		// const res = await lowerBarrierApi(gateId);

		ElMessage.success('落杆成功');
		emit('barrier-operate', {
			gateId,
			operation: 'lower',
			success: true,
			message: '落杆成功',
		});
	} catch (error) {
		ElMessage.error('落杆失败');
		emit('barrier-operate', {
			gateId,
			operation: 'lower',
			success: false,
			message: '落杆失败',
		});
	}
};

// 本岗亭全部抬杆
const handleRaiseAll = async () => {
	try {
		// TODO: 调用后端接口
		// const res = await raiseAllBarriersApi(gate.id);

		ElMessage.success('全部抬杆成功');
		emit('barrier-operate', {
			gateId: String(gate.id),
			operation: 'raise',
			success: true,
			message: '全部抬杆成功',
		});
	} catch (error) {
		ElMessage.error('全部抬杆失败');
		emit('barrier-operate', {
			gateId: String(gate.id),
			operation: 'raise',
			success: false,
			message: '全部抬杆失败',
		});
	}
};

// 本岗亭全部复位（落杆）
const handleResetAll = async () => {
	try {
		// TODO: 调用后端接口
		// const res = await resetAllBarriersApi(gate.id);

		ElMessage.success('全部复位成功');
		emit('barrier-operate', {
			gateId: String(gate.id),
			operation: 'lower',
			success: true,
			message: '全部复位成功',
		});
	} catch (error) {
		ElMessage.error('全部复位失败');
		emit('barrier-operate', {
			gateId: String(gate.id),
			operation: 'lower',
			success: false,
			message: '全部复位失败',
		});
	}
};
</script>

<style scoped lang="scss">
.gate-info-bar {
	background: #fff;
	border-radius: 8px;
	padding: 18px 20px;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

	.gate-name {
		font-size: 16px;
		font-weight: 500;
		color: #303133;
		display: flex;
		justify-content: space-between;
		align-items: center;

		:deep(.el-tag) {
			border-radius: 4px;
		}
	}

	.gate-info {
		font-size: 13px;
		color: #909399;
		margin-top: 6px;
	}

	.barrier-status {
		display: flex;
		flex-direction: column;
		gap: 10px;
		font-size: 14px;
		margin-top: 16px;
		padding-top: 16px;
		border-top: 1px solid #ebeef5;

		.barrier-title {
			color: #303133;
			font-weight: 500;
		}

		.barrier-list {
			display: flex;
			flex-wrap: wrap;
			gap: 12px;
		}

		.barrier-item {
			width: calc(50% - 6px);
			display: flex;
			flex-direction: column;
			gap: 8px;
			background: #f5f7fa;
			border: 1px solid #ebeef5;
			border-radius: 6px;
			padding: 14px 16px;
			transition: all 0.2s ease;

			&:hover {
				background: #f0f2f5;
			}

			&.is-raised {
				background: #fff7ed;
				border-color: #ff6900;
			}
		}

		.barrier-name-row {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 8px;
			font-size: 13px;
			color: #606266;
		}

		.status-dot {
			width: 8px;
			height: 8px;
			border-radius: 50%;

			&.normal {
				background: #67c23a;
				box-shadow: 0 0 4px rgba(103, 194, 58, 0.4);
			}

			&.fault {
				background: #f56c6c;
				box-shadow: 0 0 4px rgba(245, 108, 108, 0.4);
			}
		}

		.barrier-down {
			display: inline-block;
			font-size: 12px;
			color: #606266;
			background: #fff;
			border: 1px solid #dcdfe6;
			border-radius: 4px;
			padding: 5px 12px;
			text-align: center;
			cursor: pointer;
			transition: all 0.2s ease;

			&:hover {
				color: #409eff;
				border-color: #409eff;
			}
		}

		.barrier-up {
			display: inline-block;
			font-size: 12px;
			color: #fff;
			background: #ff6900;
			border: 1px solid #ff6900;
			border-radius: 4px;
			padding: 5px 12px;
			text-align: center;
			cursor: pointer;
			transition: all 0.2s ease;

			&:hover {
				background: #ff8933;
				border-color: #ff8933;
			}
		}

		.barrier-actions {
			display: flex;
			gap: 12px;
			margin-top: 8px;

			.action-raise {
				display: inline-flex;
				align-items: center;
				font-size: 12px;
				color: #ff6900;
				background: #fff7ed;
				border: 1px solid #ff6900;
				border-radius: 4px;
				padding: 5px 12px;
				cursor: pointer;
				transition: all 0.2s ease;

				&:hover {
					background: #ffe6cc;
				}
			}

			.action-reset {
				display: inline-flex;
				align-items: center;
				gap: 4px;
				font-size: 12px;
				color: #606266;
				background: #fff;
				border: 1px solid #dcdfe6;
				border-radius: 4px;
				padding: 5px 12px;
				cursor: pointer;
				transition: all 0.2s ease;

				&:hover {
					color: #409eff;
					border-color: #409eff;
				}
			}
		}
	}

	.gate-card-container {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 16px;
		padding-top: 16px;
		border-top: 1px solid #ebeef5;

		.gate-card {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 8px;
			flex: 1;
			min-width: 80px;
			background: #f5f7fa;
			border-radius: 6px;
			padding: 12px 8px;
			font-size: 12px;
			color: #909399;
			transition: background 0.2s ease;

			&:hover {
				background: #eef1f6;
			}

			.gate-card-value {
				font-size: 14px;
				font-weight: 500;
			}

			.value-green {
				color: #67c23a;
			}

			.value-red {
				color: #f56c6c;
			}

			.value-gray {
				color: #909399;
			}

			.value-purple {
				color: #9b59b6;
			}

			.value-blue {
				color: #409eff;
			}
		}
	}

	&.is-raised {
		background: linear-gradient(135deg, #fef0f0, #fde2e2);
		border: 1px solid #f56c6c;

		.gate-name {
			color: #f56c6c;
		}
	}
}
</style>
