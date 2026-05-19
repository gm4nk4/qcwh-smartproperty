<template>
	<div class="tools-manage">
		<!-- 搜索筛选区域 -->
		<div class="search-bar">
			<div class="search-left">
				<!-- 工具名称搜索 -->
				<div class="search-item">
					<span class="label">工具名称</span>
					<el-input
						v-model="searchName"
						placeholder="请输入工具名称"
						class="search-input"
						clearable
					/>
				</div>

				<!-- 工具分类下拉 -->
				<div class="search-item">
					<span class="label">工具分类</span>
					<el-select v-model="searchCategory" placeholder="全部分类" class="search-select" clearable>
						<el-option
							v-for="category in categories"
							:key="category.id"
							:label="category.name"
							:value="category.name"
						/>
					</el-select>
				</div>

				<!-- 使用场景下拉 -->
				<div class="search-item">
					<span class="label">使用场景</span>
					<el-select v-model="searchScene" placeholder="全部应用" class="search-select" clearable>
						<el-option
							v-for="scene in useScenes"
							:key="scene.id"
							:label="scene.name"
							:value="scene.name"
						/>
					</el-select>
				</div>

				<!-- 更多选项按钮 -->
				<el-button link type="primary" class="more-btn">
					<el-icon><ArrowDown /></el-icon>
					更多选项
				</el-button>
			</div>

			<div class="search-right">
				<!-- 查询按钮 -->
				<el-button type="primary" @click="handleSearch">
					查询
				</el-button>
				<!-- 重置按钮 -->
				<el-button @click="handleReset">
					重置
				</el-button>
			</div>
		</div>

		<!-- 视图切换 -->
		<div class="view-toggle">
			<div class="view-buttons">
				<!-- 卡片视图按钮 -->
				<el-button
					:type="viewType === 'card' ? 'primary' : 'default'"
					@click="viewType = 'card'"
					class="view-btn"
				>
					<el-icon><Grid /></el-icon>
					卡片视图
				</el-button>
				<!-- 列表视图按钮 -->
				<el-button
					:type="viewType === 'list' ? 'primary' : 'default'"
					@click="viewType = 'list'"
					class="view-btn"
				>
					<el-icon><List /></el-icon>
					列表视图
				</el-button>
			</div>
		</div>

		<!-- 工具卡片区域 -->
		<div v-if="viewType === 'card'" class="tools-grid">
			<div
				v-for="tool in filteredTools"
				:key="tool.id"
				class="tool-card"
			>
				<!-- 卡片头部 -->
				<div class="card-header">
					<!-- 工具信息 -->
					<div class="tool-info">
						<el-icon class="tool-icon"><Cpu /></el-icon>
						<div class="tool-name-wrap">
							<span class="tool-name">{{ tool.name }}</span>
							<el-tag
								class="category-tag"
								:color="tool.categoryColor"
								effect="dark"
								size="small"
							>
								{{ tool.category }}
							</el-tag>
						</div>
					</div>
					<!-- 启用开关 -->
					<el-switch
						v-model="tool.enabled"
						@change="handleToggleEnabled(tool)"
					/>
				</div>

				<!-- 工具描述 -->
				<div class="tool-description">{{ tool.description }}</div>

				<!-- 标签区域 -->
				<div class="tags-section">
					<!-- 数据源标签 -->
					<div class="tag-group">
						<span class="group-title">数据源</span>
						<div class="tags-list">
							<el-tag
								v-for="source in tool.dataSources"
								:key="source"
								size="small"
								class="data-tag"
							>
								{{ source }}
							</el-tag>
						</div>
					</div>

					<!-- 使用场景标签 -->
					<div class="tag-group">
						<span class="group-title">使用场景</span>
						<div class="tags-list">
							<el-tag
								v-for="scene in tool.useScenes"
								:key="scene"
								size="small"
								class="scene-tag"
								type="info"
							>
								{{ scene }}
							</el-tag>
						</div>
					</div>
				</div>

				<!-- 卡片底部信息 -->
				<div class="card-footer">
					<div class="footer-left">
						<!-- 准确率 -->
						<div class="accuracy-item">
							<span
								class="accuracy-badge"
								:class="getAccuracyClass(tool.accuracyType)"
							>
								准确率 {{ tool.accuracy }}
							</span>
						</div>
						<!-- 今日调用 -->
						<div class="calls-item">
							<span class="calls-label">今日</span>
							<span class="calls-value">{{ tool.todayCalls }}</span>
						</div>
					</div>
					<!-- 版本号 -->
					<div class="footer-right">
						<span class="version-tag">{{ tool.version }}</span>
					</div>
				</div>
			</div>
		</div>

		<!-- 列表视图（简单占位） -->
		<div v-else class="tools-list">
			<!-- 列表视图内容 -->
		</div>
	</div>
</template>

<script setup lang="ts" name="ToolsManage">
import { ref, computed } from 'vue';
import { Cpu, Grid, List, ArrowDown } from '@element-plus/icons-vue';
import type { ToolCard, ToolCategory, UseScene, ViewType } from '../type';

/**
 * 组件属性
 */
const props = defineProps<{
	tools: ToolCard[];
	categories: ToolCategory[];
	useScenes: UseScene[];
}>();

/**
 * 组件事件
 */
const emit = defineEmits<{
	(e: 'toggleEnabled', tool: ToolCard): void;
	(e: 'search', filters: { name: string; category: string; scene: string }): void;
	(e: 'reset'): void;
}>();

/**
 * 视图类型
 */
const viewType = ref<ViewType>('card');

/**
 * 搜索筛选条件
 */
const searchName = ref('');
const searchCategory = ref('');
const searchScene = ref('');

/**
 * 过滤后的工具列表
 */
const filteredTools = computed(() => {
	return props.tools.filter(tool => {
		// 名称筛选
		const matchName = !searchName.value || tool.name.includes(searchName.value);
		// 分类筛选
		const matchCategory = !searchCategory.value || tool.category === searchCategory.value;
		// 场景筛选
		const matchScene = !searchScene.value || tool.useScenes.includes(searchScene.value);

		return matchName && matchCategory && matchScene;
	});
});

/**
 * 切换工具启用状态
 */
const handleToggleEnabled = (tool: ToolCard) => {
	emit('toggleEnabled', tool);
};

/**
 * 搜索操作
 */
const handleSearch = () => {
	emit('search', {
		name: searchName.value,
		category: searchCategory.value,
		scene: searchScene.value,
	});
};

/**
 * 重置筛选条件
 */
const handleReset = () => {
	searchName.value = '';
	searchCategory.value = '';
	searchScene.value = '';
	emit('reset');
};

/**
 * 获取准确率样式类名
 */
const getAccuracyClass = (type: 'normal' | 'warning' | 'error') => {
	switch (type) {
		case 'normal':
			return 'accuracy-normal';
		case 'warning':
			return 'accuracy-warning';
		case 'error':
			return 'accuracy-error';
		default:
			return 'accuracy-normal';
	}
};
</script>

<style scoped lang="scss">
.tools-manage {
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.search-bar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 20px;
	background: white;
	padding: 16px 20px;
	border-radius: 8px;
}

.search-left {
	display: flex;
	align-items: center;
	gap: 16px;
}

.search-item {
	display: flex;
	align-items: center;
	gap: 8px;

	.label {
		font-size: 14px;
		color: #374151;
		white-space: nowrap;
	}
}

.search-input {
	width: 200px;
}

.search-select {
	width: 160px;
}

.more-btn {
	display: flex;
	align-items: center;
	gap: 4px;
	font-size: 14px;
}

.search-right {
	display: flex;
	gap: 12px;
}

.view-toggle {
	display: flex;
	justify-content: flex-end;
}

.view-buttons {
	display: flex;
	gap: 8px;
}

.view-btn {
	display: flex;
	align-items: center;
	gap: 4px;
}

.tools-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 16px;
}

.tool-card {
	background: white;
	border-radius: 8px;
	padding: 20px;
	display: flex;
	flex-direction: column;
	gap: 16px;
	border: 1px solid #e5e7eb;
	transition: all 0.2s ease;

	&:hover {
		border-color: #93c5fd;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
	}
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
}

.tool-info {
	display: flex;
	align-items: center;
	gap: 10px;
}

.tool-icon {
	font-size: 20px;
	color: #3b82f6;
}

.tool-name-wrap {
	display: flex;
	align-items: center;
	gap: 8px;
}

.tool-name {
	font-size: 15px;
	font-weight: 600;
	color: #1f2937;
}

.category-tag {
	font-size: 12px;
}

.tool-description {
	font-size: 13px;
	color: #6b7280;
	line-height: 1.6;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.tags-section {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.tag-group {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.group-title {
	font-size: 12px;
	color: #9ca3af;
}

.tags-list {
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
}

.data-tag,
.scene-tag {
	font-size: 12px;
}

.card-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 12px;
	border-top: 1px solid #f3f4f6;
}

.footer-left {
	display: flex;
	align-items: center;
	gap: 16px;
}

.accuracy-badge {
	padding: 4px 8px;
	border-radius: 4px;
	font-size: 12px;
	font-weight: 500;

	&.accuracy-normal {
		background: #dcfce7;
		color: #10b981;
	}

	&.accuracy-warning {
		background: #fef3c7;
		color: #f59e0b;
	}

	&.accuracy-error {
		background: #fee2e2;
		color: #ef4444;
	}
}

.calls-item {
	display: flex;
	align-items: center;
	gap: 4px;
}

.calls-label {
	font-size: 12px;
	color: #9ca3af;
}

.calls-value {
	font-size: 14px;
	font-weight: 600;
	color: #1f2937;
}

.footer-right {
	display: flex;
	align-items: center;
}

.version-tag {
	font-size: 12px;
	color: #9ca3af;
}
</style>
