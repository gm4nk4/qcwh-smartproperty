<template>
	<DashboardCard title="收支趋势">
		<template #header-right>
			<div class="chart-controls">
				<el-radio-group v-model="period" size="small">
					<el-radio-button value="week">近7天</el-radio-button>
					<el-radio-button value="month">近30天</el-radio-button>
				</el-radio-group>
			</div>
		</template>
		<div class="trend-container">
			<div class="chart-placeholder">
				<div class="chart-lines">
					<div class="chart-line income"></div>
					<div class="chart-line expense"></div>
				</div>
				<div class="chart-legend">
					<span class="legend-item">
						<span class="legend-dot" style="background: #1890ff"></span>
						<span>收入</span>
					</span>
					<span class="legend-item">
						<span class="legend-dot" style="background: #ff4d4f"></span>
						<span>支出</span>
					</span>
				</div>
			</div>
		</div>
	</DashboardCard>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DashboardCard from './DashboardCard.vue';

const period = ref('week');
</script>

<style scoped lang="scss">
.chart-controls {
	display: flex;
	align-items: center;
}

.trend-container {
	height: 160px;
	display: flex;
	align-items: center;
	justify-content: center;

	.chart-placeholder {
		width: 100%;
		height: 100%;
		position: relative;

		.chart-lines {
			width: 100%;
			height: 100px;
			background: #fafafa;
			position: relative;
			overflow: hidden;

			.chart-line {
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				height: 60%;
				border-top: 3px solid;

				&.income {
					border-color: #1890ff;
					background: linear-gradient(to top, rgba(24, 144, 255, 0.1) 0%, transparent 100%);
				}

				&.expense {
					border-color: #ff4d4f;
					height: 40%;
					background: linear-gradient(to top, rgba(255, 77, 79, 0.1) 0%, transparent 100%);
				}
			}
		}

		.chart-legend {
			display: flex;
			justify-content: center;
			gap: 24px;
			margin-top: 12px;

			.legend-item {
				display: flex;
				align-items: center;
				gap: 6px;
				font-size: 12px;
				color: #666;

				.legend-dot {
					width: 10px;
					height: 10px;
					border-radius: 50%;
				}
			}
		}
	}
}
</style>
