<template>
	<div class="activity-logs">
		<!-- 头部信息 -->
		<div class="header-section">
			<div class="header-left">
				<div class="logo-circle">
					<el-icon class="logo-icon"><TrendCharts /></el-icon>
				</div>
				<div class="header-info">
					<h3 class="header-title">AI 实时活动日志</h3>
					<p class="header-desc">记录今日所有AI工具的决策、预警和自动化操作</p>
				</div>
			</div>
			<div class="header-right">
				<el-button link type="info">
					<el-icon><Promotion /></el-icon>
					告警通知
					<el-tag type="danger" size="small" class="notification-badge">0</el-tag>
				</el-button>
			</div>
		</div>

		<!-- 统计卡片 -->
		<div class="stats-grid">
			<div v-for="stat in statsCards" :key="stat.id" class="stat-card">
				<div class="stat-header">
					<span class="stat-title">{{ stat.title }}</span>
					<el-icon :style="{ color: stat.iconColor }">
						<component :is="getIconByName(stat.icon)" />
					</el-icon>
				</div>
				<div class="stat-value">{{ stat.value }}</div>
			</div>
		</div>

		<!-- 时间线标题 -->
		<div class="timeline-header">
			<div class="timeline-title">
				<span class="title-line"></span>
				<span class="title-text">今日活动时间线</span>
			</div>
			<div class="timeline-count">
				<span class="count-badge">{{ logs.length }} 条记录</span>
			</div>
		</div>

		<!-- 时间线 -->
		<el-timeline class="timeline-container">
			<el-timeline-item
				v-for="(log, index) in logs"
				:key="log.id"
				:type="getTimelineType(log.type)"
				:color="getTimelineColor(log.type)"
				:hollow="log.type === 'notice'"
				size="large"
			>
				<div class="timeline-item">
					<div class="timeline-content">
						<div class="timeline-header">
							<div class="timeline-title">
								<el-tag :type="getTagType(log.type)" size="small" class="log-tag">
									{{ log.typeText }}
								</el-tag>
								<span class="log-title">{{ log.title }}</span>
							</div>
							<span class="timeline-time">{{ log.time }}</span>
						</div>
						<p class="timeline-description">{{ log.description }}</p>
					</div>
				</div>
			</el-timeline-item>
		</el-timeline>
	</div>
</template>

<script setup lang="ts" name="ActivityLogs">
import { computed } from 'vue';
import { TrendCharts, Promotion } from '@element-plus/icons-vue';
import type { LogStatsCard, ActivityLog, LogType } from '../type';
import { mockLogStatsCards, mockActivityLogs } from '../mock';

/**
 * 组件属性
 */
interface Props {
	/** 统计卡片数据 */
	statsCards?: LogStatsCard[];
	/** 活动日志数据 */
	logs?: ActivityLog[];
}

const props = withDefaults(defineProps<Props>(), {
	statsCards: () => mockLogStatsCards,
	logs: () => mockActivityLogs,
});

/**
 * 获取图标组件
 * @param iconName 图标名称
 * @returns 图标组件
 */
const getIconByName = (iconName: string) => {
	const iconMap: Record<string, any> = {
		TrendCharts,
		Document: Promotion,
		Warning: Promotion,
		CircleCheck: Promotion,
		Edit: TrendCharts,
		Bell: Promotion,
		ChatDotRound: TrendCharts,
	};
	return iconMap[iconName] || TrendCharts;
};

/**
 * 获取时间线类型
 * @param type 日志类型
 * @returns 时间线类型
 */
const getTimelineType = (type: LogType): 'primary' | 'success' | 'warning' | 'danger' | 'info' => {
	const typeMap: Record<LogType, any> = {
		analysis: 'primary',
		dispatch: 'success',
		warning: 'warning',
		discovery: 'success',
		generate: 'primary',
		notice: 'info',
	};
	return typeMap[type] || 'info';
};

/**
 * 获取时间线颜色
 * @param type 日志类型
 * @returns 颜色值
 */
const getTimelineColor = (type: LogType): string => {
	const colorMap: Record<LogType, string> = {
		analysis: '#3b82f6',
		dispatch: '#10b981',
		warning: '#f59e0b',
		discovery: '#10b981',
		generate: '#8b5cf6',
		notice: '#ec4899',
	};
	return colorMap[type] || '#9ca3af';
};

/**
 * 获取标签类型
 * @param type 日志类型
 * @returns Element Plus tag类型
 */
const getTagType = (type: LogType): 'primary' | 'success' | 'warning' | 'danger' | 'info' => {
	return getTimelineType(type);
};
</script>

<style scoped lang="scss">
.activity-logs {
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.header-section {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: white;
	padding: 20px;
	border-radius: 12px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-left {
	display: flex;
	align-items: center;
	gap: 16px;
}

.logo-circle {
	width: 48px;
	height: 48px;
	border-radius: 8px;
	background: linear-gradient(135deg, #3b82f6, #1e40af);
	display: flex;
	align-items: center;
	justify-content: center;

	.logo-icon {
		font-size: 24px;
		color: white;
	}
}

.header-info {
	display: flex;
	flex-direction: column;
	gap: 4px;

	.header-title {
		font-size: 16px;
		font-weight: 600;
		color: #1f2937;
		margin: 0;
	}

	.header-desc {
		font-size: 13px;
		color: #6b7280;
		margin: 0;
	}
}

.header-right {
	display: flex;
	align-items: center;

	.notification-badge {
		margin-left: 8px;
	}
}

.stats-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	gap: 12px;
}

.stat-card {
	background: white;
	border-radius: 8px;
	padding: 16px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	border: 1px solid #e5e7eb;
}

.stat-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 8px;

	.stat-title {
		font-size: 13px;
		color: #6b7280;
	}
}

.stat-value {
	font-size: 24px;
	font-weight: 700;
	color: #1f2937;
}

.timeline-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.timeline-title {
	display: flex;
	align-items: center;
	gap: 8px;

	.title-line {
		width: 4px;
		height: 16px;
		background: #3b82f6;
		border-radius: 2px;
	}

	.title-text {
		font-size: 15px;
		font-weight: 600;
		color: #1f2937;
	}
}

.timeline-count {
	.count-badge {
		font-size: 13px;
		color: #6b7280;
		background: #f3f4f6;
		padding: 4px 12px;
		border-radius: 16px;
	}
}

.timeline-container {
	background: white;
	border-radius: 12px;
	padding: 20px 24px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.timeline-item {
	padding: 4px 0;
}

.timeline-content {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.timeline-header {
	display: flex;
	justify-content: space-between;
	align-items: center;

	.timeline-title {
		display: flex;
		align-items: center;
		gap: 8px;

		.log-tag {
			margin: 0;
		}

		.log-title {
			font-size: 14px;
			font-weight: 600;
			color: #1f2937;
		}
	}

	.timeline-time {
		font-size: 13px;
		color: #9ca3af;
	}
}

.timeline-description {
	font-size: 13px;
	color: #6b7280;
	margin: 0;
	line-height: 1.5;
	padding-left: 4px;
}
</style>
