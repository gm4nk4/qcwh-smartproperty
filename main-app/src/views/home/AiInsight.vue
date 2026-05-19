<template>
	<DashboardCard title="AI 智慧洞察">
		<div class="insight-list">
			<div class="insight-item high">
				<div class="insight-tag">高</div>
				<div class="insight-content">
					<div class="insight-title">车位利用率预测</div>
					<div class="insight-desc">预计17:00-19:00，10号楼车位利用率达90%</div>
				</div>
			</div>
			<div class="insight-item medium">
				<div class="insight-tag">中</div>
				<div class="insight-content">
					<div class="insight-title">智能识别异常</div>
					<div class="insight-desc">未授权人员进入，建议加强巡逻</div>
				</div>
			</div>
			<div class="insight-item low">
				<div class="insight-tag">低</div>
				<div class="insight-content">
					<div class="insight-title">设备节能优化</div>
					<div class="insight-desc">建议23:00后，关闭部分照明设备</div>
				</div>
			</div>
		</div>
	</DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from './DashboardCard.vue';
</script>

<style scoped lang="scss">
.insight-list {
	display: flex;
	flex-direction: column;
	gap: 10px;

	.insight-item {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 12px;
		border-radius: 6px;

		&.high {
			background: #fff7e6;
		}

		&.medium {
			background: #e6f7ff;
		}

		&.low {
			background: #f6ffed;
		}

		.insight-tag {
			font-size: 12px;
			padding: 2px 8px;
			border-radius: 4px;
			font-weight: 600;
			flex-shrink: 0;

			.high & {
				background: #ff9c6e;
				color: white;
			}
			.medium & {
				background: #69c0ff;
				color: white;
			}
			.low & {
				background: #95de64;
				color: white;
			}
		}

		.insight-content {
			flex: 1;

			.insight-title {
				font-size: 13px;
				font-weight: 600;
				color: #333;
				margin-bottom: 4px;
			}

			.insight-desc {
				font-size: 11px;
				color: #666;
			}
		}
	}
}
</style>
