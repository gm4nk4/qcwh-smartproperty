<template>
	<DashboardCard title="工单分布">
		<div class="chart-container">
			<div class="donut-chart">
				<div class="donut-center">
					<div class="center-value">8,432</div>
					<div class="center-label">总工单</div>
				</div>
			</div>
			<div class="chart-legend">
				<div class="legend-item">
					<span class="legend-dot" style="background: #1890ff"></span>
					<span class="legend-label">报修</span>
					<span class="legend-value">34%</span>
				</div>
				<div class="legend-item">
					<span class="legend-dot" style="background: #52c41a"></span>
					<span class="legend-label">投诉</span>
					<span class="legend-value">22%</span>
				</div>
				<div class="legend-item">
					<span class="legend-dot" style="background: #faad14"></span>
					<span class="legend-label">咨询</span>
					<span class="legend-value">28%</span>
				</div>
				<div class="legend-item">
					<span class="legend-dot" style="background: #722ed1"></span>
					<span class="legend-label">其他</span>
					<span class="legend-value">16%</span>
				</div>
			</div>
		</div>
	</DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from './DashboardCard.vue';
</script>

<style scoped lang="scss">
.chart-container {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 40px;

	.donut-chart {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		background: conic-gradient(
			#1890ff 0deg 122deg,
			#52c41a 122deg 200deg,
			#faad14 200deg 300deg,
			#722ed1 300deg 360deg
		);
		position: relative;

		&::before {
			content: '';
			position: absolute;
			top: 20px;
			left: 20px;
			right: 20px;
			bottom: 20px;
			background: #f5f5f5;
			border-radius: 50%;
		}

		.donut-center {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			text-align: center;

			.center-value {
				font-size: 18px;
				font-weight: 700;
				color: #333;
			}

			.center-label {
				font-size: 11px;
				color: #999;
			}
		}
	}

	.chart-legend {
		display: flex;
		flex-direction: column;
		gap: 10px;

		.legend-item {
			display: flex;
			align-items: center;
			gap: 8px;

			.legend-dot {
				width: 10px;
				height: 10px;
				border-radius: 50%;
			}

			.legend-label {
				font-size: 12px;
				color: #666;
			}

			.legend-value {
				font-size: 12px;
				color: #333;
				font-weight: 600;
				margin-left: auto;
			}
		}
	}
}
</style>
