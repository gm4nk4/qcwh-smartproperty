<template>
	<div class="system-placeholder">
		<section class="placeholder-card">
			<header class="placeholder-card__header">
				<div class="placeholder-card__title-block">
					<span class="placeholder-card__bar"></span>
					<h3>{{ title }}</h3>
				</div>
				<span class="placeholder-card__status">开发中</span>
			</header>

			<div class="placeholder-hero">
				<div class="placeholder-hero__badge">{{ title }}监控占位</div>
				<p>{{ description }}</p>
			</div>

			<div class="placeholder-grid">
				<article class="placeholder-panel">
					<strong>总体监控</strong>
					<span>预留统计卡片与趋势概览区域</span>
				</article>
				<article class="placeholder-panel">
					<strong>系统组态</strong>
					<span>预留组态图、缩放工具和设备拓扑关系</span>
				</article>
				<article class="placeholder-panel">
					<strong>设备清单</strong>
					<span>预留设备状态、关键参数和分页表格</span>
				</article>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts" name="SystemPlaceholderTab">
defineProps<{
	title: string;
	description: string;
}>();
</script>

<style scoped lang="scss">
.system-placeholder {
	display: flex;
	flex-direction: column;
}

.placeholder-card {
	padding: 24px;
	border-radius: 24px;
	background: #ffffff;
	border: 1px solid rgba(var(--dashboard-primary-rgb), 0.08);
}

.placeholder-card__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	margin-bottom: 18px;
}

.placeholder-card__title-block {
	display: inline-flex;
	align-items: center;
	gap: 10px;
}

.placeholder-card__bar {
	width: 4px;
	height: 20px;
	border-radius: 999px;
	background: var(--dashboard-primary);
	box-shadow: 0 4px 10px rgba(var(--dashboard-primary-rgb), 0.22);
}

.placeholder-card__title-block h3 {
	margin: 0;
	font-size: 18px;
	font-weight: 700;
	color: var(--theme-text-system);
}

.placeholder-card__status {
	height: 28px;
	padding: 0 12px;
	border-radius: 999px;
	background: rgba(var(--dashboard-primary-rgb), 0.1);
	color: var(--dashboard-primary);
	font-size: 13px;
	font-weight: 700;
	display: inline-flex;
	align-items: center;
}

.placeholder-hero {
	padding: 28px;
	border-radius: 20px;
	background:
		linear-gradient(180deg, rgba(243, 249, 255, 0.98) 0%, rgba(236, 245, 255, 0.92) 100%),
		linear-gradient(to right, rgba(22, 119, 255, 0.06) 1px, transparent 1px),
		linear-gradient(to bottom, rgba(22, 119, 255, 0.06) 1px, transparent 1px);
	background-size: auto, 32px 32px, 32px 32px;
	text-align: center;
}

.placeholder-hero__badge {
	display: inline-flex;
	align-items: center;
	height: 38px;
	padding: 0 18px;
	border-radius: 999px;
	background: linear-gradient(135deg, var(--dashboard-gradient-start), var(--dashboard-gradient-end));
	color: #ffffff;
	font-size: 14px;
	font-weight: 700;
}

.placeholder-hero p {
	margin: 16px auto 0;
	max-width: 640px;
	font-size: 14px;
	line-height: 1.8;
	color: #6f7b90;
}

.placeholder-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 16px;
	margin-top: 18px;
}

.placeholder-panel {
	padding: 20px;
	border-radius: 20px;
	border: 1px solid rgba(var(--dashboard-primary-rgb), 0.12);
	background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(247, 250, 255, 0.96) 100%);
	box-shadow: 0 14px 30px rgba(var(--dashboard-primary-rgb), 0.05);
}

.placeholder-panel strong {
	display: block;
	margin-bottom: 8px;
	font-size: 16px;
	color: var(--theme-text-system);
}

.placeholder-panel span {
	font-size: 13px;
	line-height: 1.8;
	color: #7d8aa2;
}

@media screen and (max-width: 992px) {
	.placeholder-grid {
		grid-template-columns: 1fr;
	}
}

@media screen and (max-width: 768px) {
	.placeholder-card {
		padding: 16px;
		border-radius: 20px;
	}

	.placeholder-card__header {
		flex-direction: column;
		align-items: flex-start;
	}

	.placeholder-hero {
		padding: 20px;
	}
}
</style>
