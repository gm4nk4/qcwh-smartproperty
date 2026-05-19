<template>
	<div class="stat-cards">
		<div
			class="stat-card"
			v-for="(stat, index) in stats"
			:key="index"
		>
			<div
				class="stat-icon"
				:style="{ backgroundColor: stat.color + '15' }"
			>
				<svg
					class="icon"
					viewBox="0 0 48 48"
					fill="none"
				>
					<path
						d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM24 14C26.76 14 29 16.24 29 19C29 21.76 26.76 24 24 24C21.24 24 19 21.76 19 19C19 16.24 21.24 14 24 14ZM24 38C20.14 38 16.56 36.28 14.08 33.4C14.12 28.6 22 25.86 24 25.86C25.98 25.86 33.88 28.58 33.92 33.38C31.44 36.28 27.86 38 24 38Z"
						:fill="stat.color"
					/>
				</svg>
			</div>
			<div class="stat-content">
				<div class="stat-title">{{ stat.title }}</div>
				<div class="stat-value">{{ stat.value }}</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
/**
 * 统计卡片组件
 */

export interface StatItem {
	title: string;
	value: number;
	color: string;
}

interface Props {
	stats: StatItem[];
}

defineProps<Props>();
</script>

<style scoped lang="scss">
.stat-cards {
	display: flex;
	gap: 16px;
}

.stat-card {
	flex: 1;
	background: #ffffff;
	border-radius: 12px;
	padding: 20px;
	display: flex;
	align-items: center;
	gap: 16px;
	border: 1px solid #e5e7eb;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.stat-icon {
	width: 64px;
	height: 64px;
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;

	.icon {
		width: 40px;
		height: 40px;
	}
}

.stat-content {
	flex: 1;

	.stat-title {
		font-size: 14px;
		color: #6b7280;
		margin-bottom: 4px;
		font-weight: 500;
	}

	.stat-value {
		font-size: 28px;
		font-weight: 700;
		color: #111827;
		line-height: 1.2;
	}
}
</style>
