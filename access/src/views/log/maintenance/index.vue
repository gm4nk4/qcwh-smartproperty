<template>
	<div class="main-content">
		<div class="page-header">
			<h2>维护管理</h2>
			<p>系统维护管理</p>
		</div>
		<div class="empty-state">
			<svg viewBox="0 0 24 24" fill="none" class="empty-icon">
				<path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" />
				<path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" />
				<path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" />
			</svg>
			<p class="empty-text">维护管理页面开发中</p>
		</div>
	</div>
</template>

<script setup lang="ts" name="MaintenanceManagement">
/**
 * 维护管理页面
 * @description 系统维护管理
 */
</script>

<style scoped lang="scss">
.main-content {
	padding: 20px;
	background-color: #f5f7fa;
	min-height: 100%;
}

.page-header {
	margin-bottom: 24px;

	h2 {
		font-size: 20px;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 8px;
	}

	p {
		font-size: 14px;
		color: #6b7280;
	}
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 80px 0;

	.empty-icon {
		width: 80px;
		height: 80px;
		color: #d1d5db;
		margin-bottom: 24px;
	}

	.empty-text {
		font-size: 16px;
		color: #9ca3af;
	}
}
</style>
