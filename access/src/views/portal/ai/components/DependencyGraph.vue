<template>
	<div class="dependency-graph">
		<div class="section-header">
			<div class="header-left">
				<h3 class="section-title">AI工具数据依赖关系图</h3>
				<span class="section-hint">悬停任意节点查看数据流向</span>
			</div>
			<div class="header-right">
				<el-button link type="info" size="small">
					<el-icon><Grid /></el-icon>
				</el-button>
				<el-button link type="info" size="small">
					<el-icon><FullScreen /></el-icon>
				</el-button>
			</div>
		</div>

		<div class="graph-container">
			<div class="graph-column">
				<div class="column-title">数据来源</div>
				<div class="items-list">
					<div v-for="item in dataSources" :key="item.id" class="item-card data-source">
						<div class="item-icon">
							<el-icon><Document /></el-icon>
						</div>
						<span class="item-name">{{ item.name }}</span>
						<span class="item-count">{{ item.count }}</span>
					</div>
				</div>
			</div>

			<div class="graph-column">
				<div class="column-title">AI工具</div>
				<div class="items-list">
					<div v-for="item in aiTools" :key="item.id" class="item-card ai-tool">
						<div class="tool-name">{{ item.name }}</div>
						<div class="tool-info">
							<el-tag type="info" size="small">{{ item.dataSource }}</el-tag>
							<el-tag type="success" size="small">准确率 {{ item.accuracy }}</el-tag>
						</div>
					</div>
				</div>
			</div>

			<div class="graph-column">
				<div class="column-title">输出场景</div>
				<div class="items-list">
					<div v-for="item in outputScenes" :key="item.id" class="item-card output-scene">
						<div class="item-icon">
							<el-icon><Box /></el-icon>
						</div>
						<span class="item-name">{{ item.name }}</span>
						<span class="item-count">{{ item.count }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="DependencyGraph">
import { Document, Box, Grid, FullScreen } from '@element-plus/icons-vue';
import type { DataSource, AITool, OutputScene } from '../type';

defineProps<{
	dataSources: DataSource[];
	aiTools: AITool[];
	outputScenes: OutputScene[];
}>();
</script>

<style scoped lang="scss">
.dependency-graph {
	background: white;
	border-radius: 12px;
	padding: 24px;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;

	.header-left {
		display: flex;
		align-items: center;
		gap: 10px;

		.section-title {
			font-size: 16px;
			font-weight: 600;
			color: #1f2937;
			margin: 0;
		}

		.section-hint {
			font-size: 12px;
			color: #9ca3af;
		}
	}

	.header-right {
		display: flex;
		gap: 4px;
	}
}

.graph-container {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 20px;
}

.graph-column {
	display: flex;
	flex-direction: column;
	gap: 12px;

	.column-title {
		font-size: 14px;
		font-weight: 500;
		color: #374151;
		margin-bottom: 4px;
	}
}

.items-list {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.item-card {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 12px 14px;
	border-radius: 8px;
	transition: all 0.2s;

	&:hover {
		background: #f9fafb;
	}

	.item-icon {
		width: 28px;
		height: 28px;
		border-radius: 6px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;

		.el-icon {
			font-size: 14px;
		}
	}

	.item-name {
		flex: 1;
		font-size: 14px;
		color: #1f2937;
	}

	.item-count {
		font-size: 13px;
		font-weight: 500;
		color: #3b82f6;
	}

	&.data-source {
		background: #eff6ff;

		.item-icon {
			background: #3b82f6;
			color: white;
		}
	}

	&.ai-tool {
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		flex-direction: column;
		align-items: flex-start;
		gap: 8px;

		.tool-name {
			font-size: 14px;
			font-weight: 500;
			color: #1f2937;
		}

		.tool-info {
			display: flex;
			gap: 8px;
		}
	}

	&.output-scene {
		background: #fdf2f8;

		.item-icon {
			background: #ec4899;
			color: white;
		}
	}
}
</style>
