<template>
	<div class="application-grid">
		<div
			v-for="app in apps"
			:key="app.name"
			class="app-item"
			@click="handleClick(app)"
		>
			<div class="app-icon" :style="{ backgroundColor: app.color, color: 'white' }">
				<el-icon :size="20">
					<component :is="app.icon" />
				</el-icon>
			</div>
			<span class="app-name">{{ app.description }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { SubApp } from '../../micro/apps';

interface Props {
	apps: SubApp[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
	(e: 'app-click', app: SubApp): void;
}>();

const handleClick = (app: SubApp) => emit('app-click', app);
</script>

<style scoped lang="scss">
.application-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 16px;

	.app-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		padding: 12px 8px;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;

		&:hover {
			background: #f5f5f5;
		}

		.app-icon {
			width: 40px;
			height: 40px;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.app-name {
			font-size: 12px;
			color: #666;
		}
	}
}
</style>
