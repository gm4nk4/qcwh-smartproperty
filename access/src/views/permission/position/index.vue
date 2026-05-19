<template>
	<div class="position-management-page">
		<!-- 岗位编辑弹窗 -->
		<PositionEditDialog
			v-model:visible="editDialogVisible"
			:position-info="editingPositionInfo"
			@save="handlePositionSave"
		/>

		<!-- 顶部统计卡片 -->
		<div class="stats-cards">
			<div class="stat-card">
				<div class="stat-icon">
					<svg
						viewBox="0 0 24 24"
						fill="none"
					>
						<path
							d="M12 2L2 7L12 12L22 7L12 2Z"
							fill="#1890FF"
						/>
						<path
							d="M2 17L12 22L22 17"
							stroke="#1890FF"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M2 12L12 17L22 12"
							stroke="#1890FF"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</div>
				<div class="stat-info">
					<div class="stat-value">{{ totalPositions }}</div>
					<div class="stat-label">岗位标签数</div>
				</div>
			</div>
			<div class="stat-card">
				<div class="stat-icon">
					<svg
						viewBox="0 0 24 24"
						fill="none"
					>
						<path
							d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
							fill="#1890FF"
						/>
					</svg>
				</div>
				<div class="stat-info">
					<div class="stat-value">{{ totalUsers }}</div>
					<div class="stat-label">已标记人员</div>
				</div>
			</div>
			<div class="stat-card">
				<div class="stat-icon">
					<svg
						viewBox="0 0 24 24"
						fill="none"
					>
						<path
							d="M16 11C17.66 11 19 9.66 19 8C19 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM6 11C7.66 11 9 9.66 9 8C9 6.34 7.66 5 6 5C4.34 5 3 6.34 3 8C3 9.66 4.34 11 6 11ZM6 13C4.34 13 3 14.34 3 16C3 17.66 4.34 19 6 19C7.66 19 9 17.66 9 16C9 14.34 7.66 13 6 13ZM16 13C14.34 13 13 14.34 13 16C13 17.66 14.34 19 16 19C17.66 19 19 17.66 19 16C19 14.34 17.66 13 16 13Z"
							fill="#1890FF"
						/>
					</svg>
				</div>
				<div class="stat-info">
					<div class="stat-value">无</div>
					<div class="stat-label">授权关联</div>
				</div>
			</div>
		</div>

		<!-- 查询区域 -->
		<div class="query-section">
			<div class="query-form">
				<div class="form-item">
					<label>岗位标签</label>
					<el-input
						v-model="queryParams.positionName"
						placeholder="请输入岗位标签名称"
						clearable
					/>
				</div>
				<div class="form-actions">
					<el-button
						type="primary"
						@click="handleQuery"
						>查询</el-button
					>
					<el-button @click="handleReset">重置</el-button>
				</div>
			</div>
		</div>

		<!-- 操作按钮 -->
		<div class="action-section">
			<el-button
				type="primary"
				@click="handleAddPosition"
			>
				新增岗位
			</el-button>
		</div>

		<!-- 岗位卡片网格 -->
    <div class="grid-box">
		<div class="position-grid">
			<div
				v-for="item in filteredPositions"
				:key="item.id"
				class="position-card"
			>
				<div class="position-card-main">
					<div class="position-icon">
						<span class="icon-text">{{ item.positionName.charAt(0) }}</span>
					</div>
					<div class="position-info">
						<div class="position-header">
							<span class="position-name">{{ item.positionName }}</span>
							<el-tag
								type="primary"
								size="small"
								class="user-count-tag"
							>
								{{ item.userCount }}人
							</el-tag>
						</div>
						<div class="position-desc">{{ item.description }}</div>
					</div>
				</div>
				<div class="position-actions">
					<el-button
						type="primary"
						link
						size="small"
						@click="handleEditPosition(item)"
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
						>
							<path
								d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"
								fill="#6B7280"
							/>
						</svg>
					</el-button>
					<el-button
						type="danger"
						link
						size="small"
						@click="handleDelete(item)"
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
						>
							<path
								d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z"
								fill="#6B7280"
							/>
						</svg>
					</el-button>
				</div>
			</div>
		</div>
    </div>
	</div>
</template>

<script setup lang="ts" name="PositionIndex">
/**
 * 岗位管理页面组件
 * @description 实现岗位的增删改查功能
 */

import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { Position, PositionQueryParams } from './type';
import { mockPositions } from './mock';
import PositionEditDialog from './components/PositionEditDialog.vue';

// 查询参数
const queryParams = ref<PositionQueryParams>({
	positionName: '',
	positionCode: '',
	department: '',
});

// 岗位数据
const positions = ref<Position[]>(mockPositions);

// 编辑弹窗相关
const editDialogVisible = ref(false);
const editingPositionInfo = ref<Position | null>(null);

// 筛选后的岗位数据
const filteredPositions = computed(() => {
	let result = [...positions.value];

	if (queryParams.value.positionName) {
		result = result.filter((item) => item.positionName.includes(queryParams.value.positionName));
	}

	return result;
});

// 统计数据
const totalPositions = computed(() => positions.value.length);
const totalUsers = computed(() => positions.value.reduce((sum, item) => sum + item.userCount, 0));

/**
 * 处理查询
 */
const handleQuery = () => {
	ElMessage.success('查询成功');
};

/**
 * 处理重置
 */
const handleReset = () => {
	queryParams.value = {
		positionName: '',
		positionCode: '',
		department: '',
	};
};

/**
 * 处理新增岗位
 */
const handleAddPosition = () => {
	editingPositionInfo.value = null;
	editDialogVisible.value = true;
};

/**
 * 处理编辑岗位
 * @param item 岗位数据
 */
const handleEditPosition = (item: Position) => {
	editingPositionInfo.value = item;
	editDialogVisible.value = true;
};

/**
 * 处理保存岗位
 * @param data 表单数据
 */
const handlePositionSave = (data: any) => {
	if (editingPositionInfo.value) {
		const index = positions.value.findIndex((item) => item.id === editingPositionInfo.value!.id);
		if (index !== -1) {
			positions.value[index] = {
				...positions.value[index],
				...data,
			};
		}
		ElMessage.success('编辑成功');
	} else {
		const newId = Math.max(...positions.value.map((item) => item.id)) + 1;
		const newPosition: Position = {
			...data,
			id: newId,
			userCount: 0,
			roleCount: 0,
			status: 'enable',
			createTime: new Date().toLocaleString(),
		};
		positions.value.push(newPosition);
		ElMessage.success('新增成功');
	}
};

/**
 * 处理删除
 * @param item 岗位数据
 */
const handleDelete = async (item: Position) => {
	try {
		await ElMessageBox.confirm(`确定要删除岗位"${item.positionName}"吗？`, '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		});
		const index = positions.value.findIndex((p) => p.id === item.id);
		if (index !== -1) {
			positions.value.splice(index, 1);
		}
		ElMessage.success('删除成功');
	} catch {
		// 用户取消操作
	}
};
</script>

<style scoped lang="scss">
.position-management-page {
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 16px;
	box-sizing: border-box;
}

.stats-cards {
	display: flex;
	gap: 16px;
	margin-bottom: 20px;

	.stat-card {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 16px 20px;
		border-radius: 8px;
		border: 1px solid #e5e7eb;

		.stat-icon {
			width: 48px;
			height: 48px;
			background: linear-gradient(135deg, #e6f4ff 0%, #f0f7ff 100%);
			border-radius: 8px;
			display: flex;
			align-items: center;
			justify-content: center;

			svg {
				width: 28px;
				height: 28px;
			}
		}

		.stat-info {
			.stat-value {
				font-size: 24px;
				font-weight: 700;
				color: #1f2937;
				line-height: 1.2;
				margin-bottom: 2px;
			}

			.stat-label {
				font-size: 14px;
				color: #6b7280;
			}
		}
	}
}

.query-section {
	padding: 16px 20px;
	border-radius: 8px;
	margin-bottom: 16px;
	// border: 1px solid #e5e7eb;

	.query-form {
		display: flex;
		align-items: center;
		gap: 12px;

		.form-item {
			display: flex;
			align-items: center;
			gap: 8px;

			label {
				font-size: 14px;
				color: #374151;
				white-space: nowrap;
			}

			:deep(.el-input) {
				width: 200px;
			}
		}

		.form-actions {
			display: flex;
			gap: 8px;
		}
	}
}

.action-section {
	margin-bottom: 16px;
}
.grid-box{
	height: calc(100vh - 450px);
	border: 1px solid #e5e7eb;
	border-radius: 10px;
}
.position-grid {
  padding: 20px;
	display: flex;
	flex-wrap: wrap;
	gap: 20px;
	max-height: calc(100vh - 450px);
	overflow-y: auto;
}

.position-card {
	border: 1px solid #e5e7eb;
	border-radius: 10px;
	padding: 16px;
	height: 80px;
	display: flex;
  width: calc(50% - 10px);
	justify-content: space-between;
	align-items: flex-start;
	transition: all 0.2s;

	&:hover {
		border-color: #93c5fd;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
	}
}

.position-card-main {
	display: flex;
	align-items: flex-start;
	gap: 12px;
	flex: 1;
}

.position-icon {
	width: 48px;
	height: 48px;
	background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;

	.icon-text {
		color: #ffffff;
		font-size: 20px;
		font-weight: 600;
	}
}

.position-info {
	flex: 1;
	min-width: 0;
}

.position-header {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 6px;
}

.position-name {
	font-size: 15px;
	font-weight: 600;
	color: #1f2937;
}

.user-count-tag {
	background: #e6f4ff;
	border-color: #93c5fd;
	color: #1d4ed8;
	font-size: 12px;
}

.position-desc {
	font-size: 13px;
	color: #6b7280;
	line-height: 1.4;
}

.position-actions {
	display: flex;
	gap: 4px;

	:deep(.el-button) {
		padding: 4px;

		svg {
			width: 16px;
			height: 16px;
		}
	}
}
</style>
