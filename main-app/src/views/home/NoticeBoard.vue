<template>
	<DashboardCard title="公告推送">
		<template #header-right>
			<el-button text size="small">+ 新建</el-button>
		</template>
		<div class="notice-list">
			<div class="notice-item">
				<div class="notice-dot"></div>
				<div class="notice-content">
					<div class="notice-title">2024年5月6日放假(周四)</div>
					<div class="notice-time">2024-04-22</div>
				</div>
			</div>
			<div class="notice-item">
				<div class="notice-dot"></div>
				<div class="notice-content">
					<div class="notice-title">关于安全演练的通知</div>
					<div class="notice-time">2024-04-22</div>
				</div>
			</div>
		</div>
	</DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from './DashboardCard.vue';
</script>

<style scoped lang="scss">
.notice-list {
	display: flex;
	flex-direction: column;
	gap: 12px;

	.notice-item {
		display: flex;
		align-items: flex-start;
		gap: 10px;

		.notice-dot {
			width: 6px;
			height: 6px;
			background: #ff4d4f;
			border-radius: 50%;
			margin-top: 6px;
			flex-shrink: 0;
		}

		.notice-content {
			flex: 1;

			.notice-title {
				font-size: 13px;
				color: #333;
				margin-bottom: 4px;
			}

			.notice-time {
				font-size: 11px;
				color: #999;
			}
		}
	}
}
</style>
