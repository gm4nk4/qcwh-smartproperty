<template>
	<div class="dashboard-card">
		<div class="card-header">
			<span class="card-title">
				<el-icon v-if="icon" class="title-icon"><component :is="icon" /></el-icon>
				{{ title }}
			</span>
			<slot name="header-right"></slot>
		</div>
		<div class="card-body">
			<slot></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

interface Props {
	title: string;
	icon?: Component;
}

defineProps<Props>();
</script>

<style scoped lang="scss">
.dashboard-card {
	background: white;
	border-radius: 8px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	display: flex;
	flex-direction: column;
	height: 100%;

	.card-header {
		padding: 12px 16px;
		border-bottom: 1px solid #f0f0f0;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.card-title {
			font-size: 14px;
			font-weight: 600;
			color: #333;
			display: flex;
			align-items: center;
			gap: 6px;

			.title-icon {
				color: #1890ff;
			}
		}
	}

	.card-body {
		padding: 16px;
		flex: 1;
		overflow: auto;
	}
}
</style>
