<template>
	<div class="stats-cards">
		<div
			v-for="card in cards"
			:key="card.id"
			class="stat-card"
		>
			<!-- 图标区域 -->
			<div
				class="stat-icon"
				:style="{ backgroundColor: card.bgColor }"
			>
				<el-icon
					:size="24"
					:color="card.iconColor"
				>
					<component :is="iconMap[card.icon]" />
				</el-icon>
			</div>
			<!-- 内容区域 -->
			<div class="stat-content">
				<div class="stat-value">{{ card.value }}</div>
				<div class="stat-title">{{ card.title }}</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="StatsCards">
import { Box, DataAnalysis, TrendCharts, CircleCheck, Monitor } from '@element-plus/icons-vue';
import type { StatsCard } from '../type';

/** 图标映射 */
const iconMap: Record<string, any> = {
	Box,
	DataAnalysis,
	TrendCharts,
	CircleCheck,
	Monitor,
};

/** 组件属性 */
defineProps<{
	cards: StatsCard[];
}>();
</script>

<style scoped lang="scss">
.stats-cards {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 16px;
	margin-bottom: 20px;
}

.stat-card {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 20px;
	background: white;
	border-radius: 12px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
	transition: all 0.2s ease;

	&:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		transform: translateY(-2px);
	}
}

.stat-icon {
	width: 48px;
	height: 48px;
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.stat-content {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.stat-value {
	font-size: 24px;
	font-weight: 700;
	color: #1f2937;
	line-height: 1.2;
}

.stat-title {
	font-size: 13px;
	color: #6b7280;
	line-height: 1.4;
}
</style>
