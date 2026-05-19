<template>
	<div class="tool-overview">
		<div class="overview-content">
			<!-- 左侧：工具统计和需关注工具 -->
			<div class="overview-left">
				<!-- 工具统计 -->
				<div class="tool-stats-section">
					<div class="section-title-row">
						<div class="title-left">
							<el-icon class="title-icon"><Tools /></el-icon>
							<span class="section-title">工具概览</span>
						</div>
					</div>

					<div class="stats-grid">
						<div class="stat-card active">
							<div class="stat-value">{{ toolStats.active }}</div>
							<div class="stat-label">活跃</div>
						</div>
						<div class="stat-card normal">
							<div class="stat-value">{{ toolStats.normal }}</div>
							<div class="stat-label">正常</div>
						</div>
						<div class="stat-card warning">
							<div class="stat-value">{{ toolStats.warning }}</div>
							<div class="stat-label">异常</div>
						</div>
						<div class="stat-card offline">
							<div class="stat-value">{{ toolStats.offline }}</div>
							<div class="stat-label">离线</div>
						</div>
					</div>
				</div>

				<!-- 需关注工具 -->
				<div class="attention-tools">
					<div class="section-subtitle">需关注工具</div>
					<div class="tools-grid">
						<div
							v-for="tool in attentionTools"
							:key="tool.id"
							class="tool-card"
							:class="tool.status"
						>
							<div class="tool-icon">
								<el-icon><Cpu /></el-icon>
							</div>
							<div class="tool-name">{{ tool.name }}</div>
							<el-tag
								:type="tool.status === 'attention' ? 'danger' : 'warning'"
								size="small"
							>
								{{ tool.tag }}
							</el-tag>
						</div>
					</div>
				</div>
			</div>

			<!-- 右侧：今日高频工具Top10 -->
			<div class="overview-right">
				<div class="right-header">
					<span class="right-title">今日高频工具top10</span>
					<el-button link type="info" size="small">
						<span>近7日</span>
					</el-button>
				</div>

				<div class="top-tools-list">
					<div
						v-for="(tool, index) in topTools"
						:key="tool.id"
						class="top-tool-item"
					>
						<div class="item-left">
							<span class="item-rank" :class="getRankClass(index)">{{ index + 1 }}</span>
							<span class="item-name">{{ tool.name }}</span>
						</div>
						<div class="item-right">
							<div class="bar-chart">
								<div
									class="bar"
									:style="{ width: getTopBarWidth(tool.callCount) + '%' }"
								></div>
							</div>
							<span class="item-value">{{ formatNumber(tool.callCount) }}次</span>
							<span class="item-accuracy">准确率 {{ tool.accuracy }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="ToolOverview">
import { Tools, Cpu } from '@element-plus/icons-vue';
import type { ToolStats, ToolItem, TopToolItem } from '../type';

/** 组件属性 */
const props = defineProps<{
	toolStats: ToolStats;
	attentionTools: ToolItem[];
	topTools: TopToolItem[];
}>();

/** 格式化数字 */
const formatNumber = (num: number): string => {
	return num.toLocaleString();
};

/** 获取排名样式类 */
const getRankClass = (index: number): string => {
	if (index === 0) return 'rank-first';
	if (index === 1) return 'rank-second';
	if (index === 2) return 'rank-third';
	return '';
};

/** 获取Top工具柱状图宽度 */
const getTopBarWidth = (count: number): number => {
	const maxCount = props.topTools[0]?.callCount || 1;
	return (count / maxCount) * 100;
};
</script>

<style scoped lang="scss">
.tool-overview {
	background: white;
	border-radius: 12px;
	padding: 20px;
}

.overview-content {
	display: grid;
	grid-template-columns: 420px 1fr;
	gap: 24px;
}

.overview-left {
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.tool-stats-section {
	.section-title-row {
		display: flex;
		align-items: center;
		margin-bottom: 16px;

		.title-left {
			display: flex;
			align-items: center;
			gap: 8px;

			.title-icon {
				color: #3b82f6;
				font-size: 20px;
			}

			.section-title {
				font-size: 16px;
				font-weight: 600;
				color: #1f2937;
			}
		}
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 12px;

		.stat-card {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 16px 12px;
			border-radius: 8px;

			&.active {
				background: #dcfce7;
			}

			&.normal {
				background: #fef3c7;
			}

			&.warning {
				background: #fee2e2;
			}

			&.offline {
				background: #f3f4f6;
			}

			.stat-value {
				font-size: 28px;
				font-weight: 700;
				color: #1f2937;
				margin-bottom: 4px;
			}

			.stat-label {
				font-size: 13px;
				color: #6b7280;
			}
		}
	}
}

.attention-tools {
	.section-subtitle {
		font-size: 14px;
		font-weight: 500;
		color: #374151;
		margin-bottom: 12px;
	}

	.tools-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 10px;

		.tool-card {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 14px 10px;
			background: #f9fafb;
			border-radius: 8px;
			transition: all 0.2s ease;

			&:hover {
				background: #f3f4f6;
			}

			&.attention {
				background: #fef2f2;
			}

			.tool-icon {
				width: 40px;
				height: 40px;
				background: #3b82f6;
				border-radius: 8px;
				display: flex;
				align-items: center;
				justify-content: center;
				color: white;
				margin-bottom: 8px;

				.el-icon {
					font-size: 20px;
				}
			}

			.tool-name {
				font-size: 13px;
				color: #1f2937;
				margin-bottom: 8px;
				text-align: center;
				word-break: break-all;
				line-height: 1.4;
			}
		}
	}
}

.overview-right {
	.right-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;

		.right-title {
			font-size: 14px;
			font-weight: 500;
			color: #374151;
		}
	}
}

.top-tools-list {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.top-tool-item {
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
			background: #6b7280;
			color: white;
			border-radius: 4px;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 12px;
			font-weight: 600;
			flex-shrink: 0;

			&.rank-first {
				background: #f59e0b;
			}

			&.rank-second {
				background: #9ca3af;
			}

			&.rank-third {
				background: #d97706;
			}
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
				background: linear-gradient(90deg, #10b981, #34d399);
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

		.item-accuracy {
			font-size: 12px;
			color: #6b7280;
			width: 80px;
			text-align: right;
		}
	}
}
</style>
