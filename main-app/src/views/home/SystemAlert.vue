<template>
	<DashboardCard title="系统告警">
		<template #header-right>
			<el-button text size="small">查看全部</el-button>
		</template>
		<div class="alert-list">
			<div class="alert-item danger">
				<div class="alert-dot"></div>
				<div class="alert-content">
					<div class="alert-title">摄像头故障升级系统2024</div>
					<div class="alert-time">8:21</div>
				</div>
			</div>
			<div class="alert-item warning">
				<div class="alert-dot"></div>
				<div class="alert-content">
					<div class="alert-title">数据即将超载上限(预计2小时)</div>
					<div class="alert-time">8:02</div>
				</div>
			</div>
			<div class="alert-item info">
				<div class="alert-dot"></div>
				<div class="alert-content">
					<div class="alert-title">智慧车位新增</div>
					<div class="alert-time">7:40</div>
				</div>
			</div>
		</div>
	</DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from './DashboardCard.vue';
</script>

<style scoped lang="scss">
.alert-list {
	display: flex;
	flex-direction: column;
	gap: 8px;

	.alert-item {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		padding: 10px;
		border-radius: 4px;

		&.danger {
			background: #fff2f0;
		}

		&.warning {
			background: #fffbe6;
		}

		&.info {
			background: #e6f7ff;
		}

		.alert-dot {
			width: 8px;
			height: 8px;
			border-radius: 50%;
			margin-top: 6px;
			flex-shrink: 0;

			.danger & {
				background: #ff4d4f;
			}
			.warning & {
				background: #faad14;
			}
			.info & {
				background: #1890ff;
			}
		}

		.alert-content {
			flex: 1;

			.alert-title {
				font-size: 13px;
				color: #333;
				margin-bottom: 4px;
			}

			.alert-time {
				font-size: 11px;
				color: #999;
			}
		}
	}
}
</style>
