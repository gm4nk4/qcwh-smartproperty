<template>
	<div class="health-monitor">
		<div class="section-header">
			<div class="header-left">
				<h3 class="section-title">AI服务健康监控</h3>
			</div>
			<div class="header-right">
				<div class="stats-summary">
					<span class="stat-item healthy">
						<span class="dot"></span>
						健康 {{ healthStats.healthy }}
					</span>
					<span class="stat-item warning">
						<span class="dot"></span>
						注意 {{ healthStats.warning }}
					</span>
					<span class="stat-item abnormal">
						<span class="dot"></span>
						异常 {{ healthStats.abnormal }}
					</span>
					<span class="stat-item offline">
						<span class="dot"></span>
						离线 {{ healthStats.offline }}
					</span>
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
		</div>

		<div class="monitor-description">
			<div class="description-icon">
				<el-icon><Monitor /></el-icon>
			</div>
			<div class="description-text">
				<h4>AI服务健康监控</h4>
				<p>实时监控8个AI工具的运行状态、响应延迟和可用性</p>
			</div>
		</div>

		<div class="service-grid">
			<div v-for="service in services" :key="service.id" class="service-card">
				<div class="card-header">
					<div class="service-icon">
						<el-icon><Cpu /></el-icon>
					</div>
					<div class="service-name">{{ service.name }}</div>
					<div class="service-status" :class="service.status">
						<span class="dot"></span>
						{{ service.statusText }}
					</div>
				</div>
				<div class="card-body">
					<div class="metric-item">
						<el-icon><Odometer /></el-icon>
						<span class="metric-label">可用率</span>
						<span class="metric-value">{{ service.availability }}</span>
					</div>
					<div class="metric-item">
						<el-icon><Timer /></el-icon>
						<span class="metric-label">延迟</span>
						<span class="metric-value">{{ service.latency }}</span>
					</div>
					<div class="metric-item">
						<el-icon><CircleCheck /></el-icon>
						<span class="metric-label">心跳</span>
						<span class="metric-value">{{ service.heartbeat }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="HealthMonitor">
import { Cpu, Odometer, Timer, CircleCheck, Grid, FullScreen, Monitor } from '@element-plus/icons-vue';
import type { AIService, HealthStats } from '../type';

defineProps<{
	services: AIService[];
	healthStats: HealthStats;
}>();
</script>

<style scoped lang="scss">
.health-monitor {
	background: white;
	border-radius: 12px;
	padding: 24px;
	margin-bottom: 24px;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;

	.header-left {
		.section-title {
			font-size: 16px;
			font-weight: 600;
			color: #1f2937;
			margin: 0;
		}
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 16px;

		.stats-summary {
			display: flex;
			gap: 16px;

			.stat-item {
				display: flex;
				align-items: center;
				gap: 6px;
				font-size: 13px;
				color: #6b7280;

				.dot {
					width: 8px;
					height: 8px;
					border-radius: 50%;

					&.healthy {
						background: #10b981;
					}

					&.warning {
						background: #f59e0b;
					}

					&.abnormal {
						background: #ef4444;
					}

					&.offline {
						background: #9ca3af;
					}
				}

				&.healthy .dot {
					background: #10b981;
				}

				&.warning .dot {
					background: #f59e0b;
				}

				&.abnormal .dot {
					background: #ef4444;
				}

				&.offline .dot {
					background: #9ca3af;
				}
			}
		}

		.header-actions {
			display: flex;
			gap: 4px;
		}
	}
}

.monitor-description {
	display: flex;
	align-items: flex-start;
	gap: 12px;
	padding: 16px;
	background: #eff6ff;
	border-radius: 8px;
	margin-bottom: 20px;

	.description-icon {
		width: 40px;
		height: 40px;
		border-radius: 6px;
		background: #3b82f6;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;

		.el-icon {
			font-size: 20px;
		}
	}

	.description-text {
		h4 {
			font-size: 14px;
			font-weight: 600;
			color: #1f2937;
			margin: 0 0 4px 0;
		}

		p {
			font-size: 12px;
			color: #6b7280;
			margin: 0;
		}
	}
}

.service-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 16px;
}

.service-card {
	background: white;
	border: 1px solid #e5e7eb;
	border-radius: 8px;
	padding: 16px;
	transition: all 0.2s;

	&:hover {
		border-color: #93c5fd;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
	}
}

.card-header {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-bottom: 16px;

	.service-icon {
		width: 32px;
		height: 32px;
		border-radius: 6px;
		background: #dbeafe;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #3b82f6;

		.el-icon {
			font-size: 16px;
		}
	}

	.service-name {
		flex: 1;
		font-size: 14px;
		font-weight: 500;
		color: #1f2937;
	}

	.service-status {
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: 12px;
		color: #6b7280;

		.dot {
			width: 6px;
			height: 6px;
			border-radius: 50%;
		}

		&.healthy {
			color: #10b981;

			.dot {
				background: #10b981;
			}
		}

		&.warning {
			color: #f59e0b;

			.dot {
				background: #f59e0b;
			}
		}

		&.abnormal {
			color: #ef4444;

			.dot {
				background: #ef4444;
			}
		}

		&.offline {
			color: #9ca3af;

			.dot {
				background: #9ca3af;
			}
		}
	}
}

.card-body {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.metric-item {
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 13px;
	color: #6b7280;

	.el-icon {
		font-size: 14px;
	}

	.metric-label {
		flex: 1;
	}

	.metric-value {
		font-weight: 500;
		color: #1f2937;
	}
}
</style>
