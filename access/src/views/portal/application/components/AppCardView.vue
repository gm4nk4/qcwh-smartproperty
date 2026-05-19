<template>
	<div class="card-view">
		<div class="card-grid">
			<div
				v-for="app in data"
				:key="app.id"
				class="app-card"
			>
				<div class="card-top">
					<div class="card-top-left">
						<div class="app-icon-wrapper">
							<div
								class="app-icon"
								:style="{ backgroundColor: getIconColor(app.id) }"
							>
								<span>{{ app.name.charAt(0) }}</span>
							</div>
						</div>
						<div class="app-header-info">
							<div class="app-name-row">
								<span class="app-name">{{ app.name }}</span>
								<span class="app-version">{{ app.version }}</span>
								<el-tag
									:type="getStatusTagType(app.status)"
									size="small"
									class="status-tag"
								>
									{{ getStatusText(app.status) }}
								</el-tag>
							</div>
							<div class="app-category">{{ app.category }}</div>
						</div>
					</div>
					<div class="card-top-actions">
						<el-button
							link
							class="action-btn"
							@click="handleAction('config', app)"
						>
							<el-icon><Setting /></el-icon>
						</el-button>
						<el-button
							link
							class="action-btn"
							@click="handleAction('detail', app)"
						>
							<el-icon><View /></el-icon>
						</el-button>
					</div>
				</div>

				<div class="app-description">{{ app.description }}</div>

				<div class="app-meta-row">
					<div class="meta-item">
						<el-icon class="meta-icon"><User /></el-icon>
						<span class="meta-label">用户</span>
						<span class="meta-value">{{ app.userCount }}</span>
					</div>
					<div class="meta-item">
						<el-icon class="meta-icon"><Document /></el-icon>
						<span class="meta-label">应用编码</span>
						<span class="meta-value">{{ app.code }}</span>
					</div>
					<div class="meta-item">
						<el-icon class="meta-icon"><Calendar /></el-icon>
						<span class="meta-label">{{ app.validPeriod }}</span>
					</div>
				</div>

				<div class="app-meta-row">
					<div class="meta-item">
						<el-icon class="meta-icon"><Tools /></el-icon>
						<span class="meta-label">AI工具</span>
						<span class="meta-value">{{ app.aiToolCount }}个</span>
					</div>
					<div class="meta-item">
						<el-icon class="meta-icon"><Box /></el-icon>
						<span class="meta-label">组织架构</span>
						<span class="meta-value">1个</span>
					</div>
				</div>

				<div class="module-tags-row">
					<el-tag
						v-for="(module, index) in app.modules"
						:key="index"
						size="small"
						class="module-tag"
					>
						{{ module }}
					</el-tag>
				</div>

				<div class="card-divider"></div>

				<div class="card-bottom">
					<div class="card-bottom-left">
						<span class="category-label">{{ app.category }}</span>
					</div>
					<div class="card-bottom-right">
						<el-button
							link
							type="primary"
							size="small"
							@click="handleAction('detail', app)"
						>
							详情
						</el-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
/**
 * 应用卡片视图组件
 */

import { Setting, View, User, Document, Calendar, Tools, Box } from '@element-plus/icons-vue';
import type { ApplicationItem } from '../type';

interface Props {
	data: ApplicationItem[];
}

interface Emits {
	(e: 'action', action: string, row: ApplicationItem): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const getStatusTagType = (status: string) => {
	const typeMap: Record<string, any> = {
		active: 'success',
		inactive: 'danger',
		testing: 'warning',
	};
	return typeMap[status] || 'info';
};

const getStatusText = (status: string) => {
	const statusMap: Record<string, string> = {
		active: '已激活',
		inactive: '已停用',
		testing: '测试中',
	};
	return statusMap[status] || status;
};

const getIconColor = (id: number) => {
	const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1'];
	return colors[id % colors.length];
};

const handleAction = (action: string, row: ApplicationItem) => {
	emit('action', action, row);
};
</script>

<style scoped lang="scss">
.card-view {
	.card-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
	}

	.app-card {
		background: #f8fafc;
		border-radius: 8px;
		padding: 16px;
		border: 1px solid #e2e8f0;
		transition: all 0.2s ease;
		box-sizing: border-box;

		&:hover {
			border-color: #1890ff;
			box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
		}

		.card-top {
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			margin-bottom: 12px;

			.card-top-left {
				display: flex;
				align-items: flex-start;
				gap: 12px;
				flex: 1;

				.app-icon-wrapper {
					flex-shrink: 0;

					.app-icon {
						width: 40px;
						height: 40px;
						border-radius: 4px;
						display: flex;
						align-items: center;
						justify-content: center;
						color: white;
						font-size: 18px;
						font-weight: 600;
						line-height: 40px;
					}
				}

				.app-header-info {
					flex: 1;
					min-width: 0;

					.app-name-row {
						display: flex;
						align-items: center;
						gap: 8px;
						margin-bottom: 4px;

						.app-name {
							font-size: 14px;
							font-weight: 600;
							color: #1e293b;
							line-height: 22px;
						}

						.app-version {
							font-size: 12px;
							color: #64748b;
							line-height: 20px;
						}

						.status-tag {
							flex-shrink: 0;
						}
					}

					.app-category {
						font-size: 12px;
						color: #64748b;
						line-height: 20px;
					}
				}
			}

			.card-top-actions {
				display: flex;
				gap: 4px;
				flex-shrink: 0;

				.action-btn {
					padding: 4px;
					color: #64748b;

					&:hover {
						color: #1890ff;
					}

					:deep(.el-icon) {
						width: 16px;
						height: 16px;
					}
				}
			}
		}

		.app-description {
			font-size: 12px;
			color: #64748b;
			line-height: 20px;
			margin-bottom: 12px;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}

		.app-meta-row {
			display: flex;
			align-items: center;
			gap: 16px;
			margin-bottom: 8px;

			.meta-item {
				display: flex;
				align-items: center;
				gap: 4px;
				font-size: 12px;
				line-height: 20px;

				.meta-icon {
					width: 14px;
					height: 14px;
					color: #94a3b8;
				}

				.meta-label {
					color: #94a3b8;
				}

				.meta-value {
					color: #1e293b;
				}
			}
		}

		.module-tags-row {
			display: flex;
			flex-wrap: wrap;
			gap: 6px;
			margin-top: 8px;
			margin-bottom: 16px;

			.module-tag {
				max-width: 100px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}

		.card-divider {
			height: 1px;
			background: #e2e8f0;
			margin: 0 -16px 12px -16px;
		}

		.card-bottom {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.card-bottom-left {
				.category-label {
					font-size: 12px;
					color: #64748b;
					line-height: 20px;
				}
			}

			.card-bottom-right {
				.el-button {
					font-size: 12px;
					padding: 0;
				}
			}
		}
	}
}
</style>
