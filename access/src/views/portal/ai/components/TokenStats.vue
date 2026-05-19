<template>
	<div class="token-stats">
		<div class="section-header">
			<div class="header-left">
				<el-icon class="section-icon"><DataLine /></el-icon>
				<h3 class="section-title">Token消耗与调用统计</h3>
			</div>
			<div class="header-actions">
				<el-button link type="info" size="small">
					<el-icon><Grid /></el-icon>
				</el-button>
				<el-button link type="info" size="small">
					<el-icon><FullScreen /></el-icon>
				</el-button>
			</div>
		</div>

		<div class="token-content">
			<!-- 左侧：Token统计 -->
			<div class="token-left">
				<div class="token-stat-item">
					<div class="stat-icon" style="background: #eff6ff; color: #3b82f6;">
						<el-icon><DataLine /></el-icon>
					</div>
					<div class="stat-info">
						<div class="stat-label">今日调用次数</div>
						<div class="stat-value">{{ formatNumber(tokenStats.todayCalls) }}</div>
						<div class="stat-note">今日已调用</div>
					</div>
				</div>

				<div class="token-stat-item">
					<div class="stat-icon" style="background: #f0fdf4; color: #10b981;">
						<el-icon><DataLine /></el-icon>
					</div>
					<div class="stat-info">
						<div class="stat-label">今日Input Tokens</div>
						<div class="stat-value">{{ formatNumber(tokenStats.todayInputTokens) }}</div>
						<div class="stat-note">今日消耗</div>
					</div>
				</div>

				<div class="token-stat-item">
					<div class="stat-icon" style="background: #faf5ff; color: #8b5cf6;">
						<el-icon><DataLine /></el-icon>
					</div>
					<div class="stat-info">
						<div class="stat-label">今日Output Tokens</div>
						<div class="stat-value">{{ formatNumber(tokenStats.todayOutputTokens) }}</div>
						<div class="stat-note">今日生成</div>
					</div>
				</div>

				<div class="token-stat-item">
					<div class="stat-icon" style="background: #fffbeb; color: #f59e0b;">
						<el-icon><DataLine /></el-icon>
					</div>
					<div class="stat-info">
						<div class="stat-label">总消耗Tokens</div>
						<div class="stat-value">{{ formatNumber(tokenStats.totalTokens) }}</div>
						<div class="stat-note">本月 110,295,238</div>
					</div>
				</div>
			</div>

			<!-- 右侧：子系统调用统计 -->
			<div class="token-right">
				<div class="right-header">
					<span class="right-title">各子系统调用统计top10</span>
				</div>

				<div class="subsystem-list">
					<div
						v-for="(item, index) in subsystemCalls"
						:key="item.id"
						class="subsystem-item"
					>
						<div class="item-left">
							<span class="item-rank">{{ index + 1 }}</span>
							<span class="item-name">{{ item.name }}</span>
						</div>
						<div class="item-right">
							<div class="bar-chart">
								<div
									class="bar"
									:style="{ width: getBarWidth(item.callCount) + '%' }"
								></div>
							</div>
							<span class="item-value">{{ formatNumber(item.callCount) }}次</span>
							<span class="item-tokens">{{ formatNumber(item.tokenCount) }} tokens</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="TokenStats">
import { DataLine, Grid, FullScreen } from '@element-plus/icons-vue';
import type { TokenStats as TokenStatsType, SubsystemCall } from '../type';

/** 组件属性 */
const props = defineProps<{
	tokenStats: TokenStatsType;
	subsystemCalls: SubsystemCall[];
}>();

/** 格式化数字 */
const formatNumber = (num: number): string => {
	return num.toLocaleString();
};

/** 获取柱状图宽度 */
const getBarWidth = (count: number): number => {
	const maxCount = props.subsystemCalls[0]?.callCount || 1;
	return (count / maxCount) * 100;
};
</script>

<style scoped lang="scss">
.token-stats {
	background: white;
	border-radius: 12px;
	padding: 20px;
	margin-bottom: 20px;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;

	.header-left {
		display: flex;
		align-items: center;
		gap: 8px;

		.section-icon {
			color: #3b82f6;
			font-size: 20px;
		}

		.section-title {
			font-size: 16px;
			font-weight: 600;
			color: #1f2937;
			margin: 0;
		}
	}

	.header-actions {
		display: flex;
		gap: 4px;
	}
}

.token-content {
	display: grid;
	grid-template-columns: 320px 1fr;
	gap: 24px;
}

.token-left {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.token-stat-item {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 16px;
	background: #f9fafb;
	border-radius: 8px;

	.stat-icon {
		width: 44px;
		height: 44px;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 20px;
		flex-shrink: 0;
	}

	.stat-info {
		display: flex;
		flex-direction: column;
		gap: 2px;

		.stat-label {
			font-size: 13px;
			color: #6b7280;
		}

		.stat-value {
			font-size: 20px;
			font-weight: 700;
			color: #1f2937;
		}

		.stat-note {
			font-size: 12px;
			color: #9ca3af;
		}
	}
}

.token-right {
	display: flex;
	flex-direction: column;

	.right-header {
		margin-bottom: 16px;

		.right-title {
			font-size: 14px;
			font-weight: 500;
			color: #374151;
		}
	}
}

.subsystem-list {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.subsystem-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 10px 12px;
	background: #f9fafb;
	border-radius: 6px;

	.item-left {
		display: flex;
		align-items: center;
		gap: 10px;

		.item-rank {
			width: 24px;
			height: 24px;
			background: #3b82f6;
			color: white;
			border-radius: 4px;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 12px;
			font-weight: 600;
			flex-shrink: 0;
		}

		.item-name {
			font-size: 14px;
			color: #1f2937;
		}
	}

	.item-right {
		display: flex;
		align-items: center;
		gap: 12px;

		.bar-chart {
			width: 120px;
			height: 8px;
			background: #e5e7eb;
			border-radius: 4px;
			overflow: hidden;

			.bar {
				height: 100%;
				background: linear-gradient(90deg, #3b82f6, #93c5fd);
				border-radius: 4px;
				transition: width 0.3s ease;
			}
		}

		.item-value {
			font-size: 13px;
			font-weight: 500;
			color: #1f2937;
			width: 70px;
			text-align: right;
		}

		.item-tokens {
			font-size: 12px;
			color: #6b7280;
			width: 100px;
			text-align: right;
		}
	}
}
</style>
