<template>
	<div class="space-management-page">
		<!-- 编辑弹窗 -->
		<SpaceEditDialog
			v-model:visible="editDialogVisible"
			:space-info="editingSpaceInfo"
			@save="handleSpaceSave"
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
							d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z"
							fill="#1890FF"
						/>
						<path
							d="M7 7H17V9H7V7Z"
							fill="white"
						/>
						<path
							d="M7 11H14V13H7V11Z"
							fill="white"
						/>
						<path
							d="M7 15H12V17H7V15Z"
							fill="white"
						/>
					</svg>
				</div>
				<div class="stat-info">
					<div class="stat-value">{{ totalSpaces }}</div>
					<div class="stat-label">空间总数</div>
				</div>
			</div>
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
					<div class="stat-value">{{ buildingCount }}</div>
					<div class="stat-label">楼栋数</div>
				</div>
			</div>
			<div class="stat-card">
				<div class="stat-icon">
					<svg
						viewBox="0 0 24 24"
						fill="none"
					>
						<path
							d="M3 13H11V3H3V13ZM3 21H11V15H3V21ZM13 21H21V11H13V21ZM13 3V9H21V3H13Z"
							fill="#1890FF"
						/>
					</svg>
				</div>
				<div class="stat-info">
					<div class="stat-value">{{ roomCount }}</div>
					<div class="stat-label">房间数</div>
				</div>
			</div>
			<div class="stat-card">
				<div class="stat-icon">
					<svg
						viewBox="0 0 24 24"
						fill="none"
					>
						<path
							d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z"
							fill="#1890FF"
						/>
						<path
							d="M12 8C13.66 8 15 9.34 15 11C15 12.66 13.66 14 12 14C10.34 14 9 12.66 9 11C9 9.34 10.34 8 12 8Z"
							fill="white"
						/>
						<path
							d="M6 18C6 15.34 8.69 13.2 12 13.2C15.31 13.2 18 15.34 18 18V19H6V18Z"
							fill="white"
						/>
					</svg>
				</div>
				<div class="stat-info">
					<div class="stat-value">{{ publicCount }}</div>
					<div class="stat-label">公共区域</div>
				</div>
			</div>
		</div>

		<!-- 查询区域 -->
		<div class="query-section">
			<div class="query-form">
				<div class="form-item">
					<label>空间名称</label>
					<el-input
						v-model="queryParams.name"
						placeholder="请输入空间名称"
						clearable
					/>
				</div>
				<div class="form-item">
					<label>空间类型</label>
					<el-select
						v-model="queryParams.type"
						placeholder="全部类型"
						clearable
					>
						<el-option
							label="项目"
							value="project"
						/>
						<el-option
							label="楼栋"
							value="building"
						/>
						<el-option
							label="楼层"
							value="floor"
						/>
						<el-option
							label="房间"
							value="room"
						/>
						<el-option
							label="公共区域"
							value="public"
						/>
					</el-select>
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
				@click="handleAddSpace"
			>
				新增空间
			</el-button>
		</div>

		<!-- 树形结构 -->
		<SpaceTree
			:spaces="filteredSpaces"
			@edit-space="handleEditSpace"
			@delete="handleDelete"
			@add-space="handleAddSpace"
		/>
	</div>
</template>

<script setup lang="ts" name="SpaceIndex">
/**
 * 空间管理页面组件
 * @description 实现空间的增删改查功能
 */

import { ref, computed, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { Space, SpaceQueryParams } from './type';
import { mockSpaces } from './mock';
import SpaceEditDialog from './components/SpaceEditDialog.vue';
import SpaceTree from './components/SpaceTree.vue';

// 查询参数
const queryParams = ref<SpaceQueryParams>({
	name: '',
	type: '',
});

// 空间数据
const spaces = ref<Space[]>(mockSpaces);

// 编辑弹窗相关
const editDialogVisible = ref(false);
const editingSpaceInfo = ref<Space | null>(null);

// 计算所有空间数量
function countAllSpaces(list: Space[]): number {
	let count = list.length;
	list.forEach((item) => {
		if (item.children && item.children.length > 0) {
			count += countAllSpaces(item.children);
		}
	});
	return count;
}

// 计算特定类型空间数量
function countTypeSpaces(list: Space[], type: string): number {
	let count = 0;
	list.forEach((item) => {
		if (item.type === type) {
			count++;
		}
		if (item.children && item.children.length > 0) {
			count += countTypeSpaces(item.children, type);
		}
	});
	return count;
}

// 统计数据
const totalSpaces = computed(() => countAllSpaces(spaces.value));
const buildingCount = computed(() => countTypeSpaces(spaces.value, 'building'));
const roomCount = computed(() => countTypeSpaces(spaces.value, 'room'));
const publicCount = computed(() => countTypeSpaces(spaces.value, 'public'));

// 过滤空间数据
function filterSpaces(list: Space[], keyword: string, type: string): Space[] {
	return list
		.map((item) => {
			const matchesName = !keyword || item.name.includes(keyword);
			const matchesType = !type || item.type === type;

			let filteredChildren: Space[] = [];
			if (item.children && item.children.length > 0) {
				filteredChildren = filterSpaces(item.children, keyword, type);
			}

			if (matchesName && matchesType) {
				return {
					...item,
					children: filteredChildren.length > 0 ? filteredChildren : undefined,
				};
			} else if (filteredChildren.length > 0) {
				return {
					...item,
					children: filteredChildren,
				};
			}
			return null;
		})
		.filter(Boolean) as Space[];
}

// 过滤后的空间数据
const filteredSpaces = computed(() => {
	return filterSpaces(spaces.value, queryParams.value.name, queryParams.value.type);
});

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
		name: '',
		type: '',
	};
};

/**
 * 处理新增空间
 * @param parentData 父空间数据（可选）
 */
const handleAddSpace = (parentData?: Space) => {
	editingSpaceInfo.value = parentData || null;
	editDialogVisible.value = true;
};

/**
 * 处理编辑空间
 * @param item 空间数据
 */
const handleEditSpace = (item: Space) => {
	editingSpaceInfo.value = item;
	editDialogVisible.value = true;
};

/**
 * 处理保存空间
 * @param data 表单数据
 */
const handleSpaceSave = (data: any) => {
	if (editingSpaceInfo.value) {
		updateSpace(spaces.value, editingSpaceInfo.value.id, data);
		ElMessage.success('编辑成功');
	} else {
		const newId = Date.now();
		const newSpace: Space = {
			...data,
			id: newId,
			typeLabel: getTypeLabel(data.type),
		};
		spaces.value.push(newSpace);
		ElMessage.success('新增成功');
	}
};

/**
 * 更新空间
 */
function updateSpace(list: Space[], id: number, data: any): boolean {
	for (let i = 0; i < list.length; i++) {
		if (list[i].id === id) {
			list[i] = {
				...list[i],
				...data,
				typeLabel: data.type ? getTypeLabel(data.type) : list[i].typeLabel,
			};
			return true;
		}
		if (list[i].children && (list[i]?.children || []).length > 0) {
			if (updateSpace(list[i]?.children || [], id, data)) {
				return true;
			}
		}
	}
	return false;
}

/**
 * 获取类型标签
 */
function getTypeLabel(type: string): string {
	const map: Record<string, string> = {
		project: '项目',
		building: '楼栋',
		floor: '楼层',
		room: '房间',
		public: '公共区域',
	};
	return map[type] || type;
}

/**
 * 处理删除
 * @param item 空间数据
 */
const handleDelete = async (item: Space) => {
	try {
		await ElMessageBox.confirm(`确定要删除空间"${item.name}"吗？`, '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		});
		deleteSpace(spaces.value, item.id);
		ElMessage.success('删除成功');
	} catch {
		// 用户取消操作
	}
};

/**
 * 删除空间
 */
function deleteSpace(list: Space[], id: number): boolean {
	for (let i = 0; i < list.length; i++) {
		if (list[i].id === id) {
			list.splice(i, 1);
			return true;
		}
		if (list[i].children && (list[i]?.children || []).length > 0) {
			if (deleteSpace(list[i]?.children || [], id)) {
				return true;
			}
		}
	}
	return false;
}
</script>

<style scoped lang="scss">
.space-management-page {
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
		background: #ffffff;
		border-radius: 10px;
		border: 1px solid #e5e7eb;

		.stat-icon {
			width: 48px;
			height: 48px;
			background: linear-gradient(135deg, #e6f4ff 0%, #f0f7ff 100%);
			border-radius: 10px;
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
	background: #ffffff;
	padding: 16px 20px;
	border-radius: 10px;
	margin-bottom: 16px;

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

			:deep(.el-input),
			:deep(.el-select) {
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
</style>
