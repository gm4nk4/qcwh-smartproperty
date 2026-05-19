<template>
	<div class="stat-cards">
		<div
			v-for="(card, index) in cards"
			:key="index"
			class="stat-card"
			:style="{ background: card.color }"
		>
			<div class="stat-content">
				<div class="stat-value">{{ card.value }}</div>
				<div class="stat-title">{{ card.title }}</div>
			</div>
			<div class="stat-icon-box">
				<el-icon :size="36" color="white">
					<component :is="card.icon" />
				</el-icon>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="StatCards">
/**
 * 工作台统计卡片组件
 * @description 显示工作台配置的统计数据，包含总模块数、公共模块数、已显示模块数、布局行数
 */

import { computed } from 'vue';
import { Grid, OfficeBuilding, View, Tickets } from '@element-plus/icons-vue';
import type { StatsData } from '../type';

/** Props 定义 */
interface Props {
	/** 统计数据对象 */
	stats: StatsData;
}

const props = defineProps<Props>();

/** 统计卡片配置 */
const cards = computed(() => [
	{
		icon: Grid,
		title: '总模块数',
		value: props.stats.totalModules,
		color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
	},
	{
		icon: OfficeBuilding,
		title: '公共模块',
		value: props.stats.publicModules,
		color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
	},
	{
		icon: View,
		title: '已显示',
		value: props.stats.displayedModules,
		color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
	},
	{
		icon: Tickets,
		title: '布局行数',
		value: props.stats.layoutRows,
		color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
	}
]);
</script>

<style scoped lang="scss">
.stat-cards {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 20px;
	margin-bottom: 24px;
}

.stat-card {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24px 28px;
	border-radius: 12px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	position: relative;
	overflow: hidden;
	transition: transform 0.2s, box-shadow 0.2s;

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
	}

	.stat-content {
		z-index: 1;

		.stat-value {
			font-size: 32px;
			font-weight: 700;
			color: white;
			margin-bottom: 4px;
			line-height: 1;
		}

		.stat-title {
			font-size: 14px;
			color: rgba(255, 255, 255, 0.9);
		}
	}

	.stat-icon-box {
		width: 72px;
		height: 72px;
		background: rgba(255, 255, 255, 0.15);
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1;
	}

	&::after {
		content: '';
		position: absolute;
		right: -20px;
		top: 50%;
		transform: translateY(-50%);
		width: 120px;
		height: 120px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 50%;
	}
}
</style>
