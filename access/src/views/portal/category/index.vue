<template>
	<div class="main-content">
		<div class="page-header">
			<el-tabs
				v-model="activeTab"
				@tab-change="handleTabChange"
			>
				<el-tab-pane
					label="用户管理"
					name="user"
				/>
				<el-tab-pane
					label="应用分类"
					name="category"
				/>
			</el-tabs>
		</div>

		<div class="stat-cards">
			<div
				v-for="card in statCards"
				:key="card.title"
				class="stat-card"
			>
				<div
					class="stat-icon"
					:style="{ backgroundColor: card.bgColor }"
				>
					<el-icon
						:size="24"
						:color="card.iconColor"
					>
						<component :is="iconMap[card.icon]" />
					</el-icon>
				</div>
				<div class="stat-info">
					<div class="stat-value">{{ card.value }}</div>
					<div class="stat-title">{{ card.title }}</div>
				</div>
			</div>
		</div>

		<div class="search-bar">
			<div class="search-left">
				<span class="search-label">分类名称</span>
				<el-input
					v-model="searchKeyword"
					placeholder="请输入分类名称"
					class="search-input"
					clearable
				/>
				<el-button
					type="primary"
					@click="handleSearch"
					>查询</el-button
				>
				<el-button @click="handleReset">重置</el-button>
			</div>
			<el-button
				type="primary"
				@click="handleAddCategory"
			>
				<el-icon><Plus /></el-icon>
				新增分类
			</el-button>
		</div>

		<el-collapse
			v-model="activeCollapseNames"
			expand-icon-position="left"
			class="category-collapse"
		>
			<el-collapse-item
				v-for="category in filteredCategories"
				:key="category.id"
				:name="category.id"
			>
				<template #title>
					<div class="collapse-title">
						<div class="title-left">
							<span class="category-name">{{ category.name }}</span>
							<el-tag
								type="info"
								size="small"
								>{{ category.appCount }}个应用</el-tag
							>
							<el-tag
								type="success"
								size="small"
								>{{ category.activeText }}</el-tag
							>
							<el-tag
								v-if="category.hidden"
								type="info"
								size="small"
								>{{ category.hiddenText }}</el-tag
							>
						</div>
						<div class="title-right">
							<el-button
								link
								type="primary"
								size="small"
								@click="handleViewDetail(category)"
							>
								<el-icon><View /></el-icon>
							</el-button>
							<el-button
								link
								type="primary"
								size="small"
								@click="handleEdit(category)"
							>
								<el-icon><Edit /></el-icon>
							</el-button>
							<el-button
								link
								type="primary"
								size="small"
								@click="handleDelete(category)"
							>
								<el-icon><Delete /></el-icon>
							</el-button>
						</div>
					</div>
				</template>

				<div class="category-content">
					<div class="app-list">
						<div
							v-for="app in category.apps"
							:key="app.id"
							class="app-item"
						>
							<el-tag
								type="primary"
								effect="dark"
							>
								<el-icon><Document /></el-icon>
							</el-tag>
							<span class="app-name">{{ app.name }}</span>
							<el-tag
								:type="app.active ? 'success' : 'info'"
								size="small"
								>{{ app.activeText }}</el-tag
							>
							<el-button
								link
								type="info"
								size="small"
								@click="handleRemoveApp(category, app)"
							>
								<el-icon><Close /></el-icon>
							</el-button>
						</div>
					</div>

					<div
						v-if="category.uncategorizedApps.length > 0"
						class="uncategorized-section"
					>
						<div class="section-title">可添加的未归类应用</div>
						<div class="app-list">
							<div
								v-for="app in category.uncategorizedApps"
								:key="app.id"
								class="app-item"
							>
								<el-tag
									type="primary"
									effect="dark"
								>
									<el-icon><Document /></el-icon>
								</el-tag>
								<span class="app-name">{{ app.name }}</span>
								<el-button
									link
									type="info"
									size="small"
									@click="handleAddApp(category, app)"
								>
									<el-icon><Plus /></el-icon>
								</el-button>
							</div>
						</div>
					</div>
				</div>
			</el-collapse-item>
		</el-collapse>
	</div>
</template>

<script setup lang="ts" name="ApplicationCategory">
/**
 * 应用分类页面
 * @description 管理应用分类
 */

import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, CircleCheck, View, Edit, Document, Grid, Box, FolderOpened, View as ViewIcon, Close, Delete } from '@element-plus/icons-vue';
import { mockCategories, mockStatCards } from './mock';
import type { CategoryInfo, StatCardData } from './type';

const iconMap: Record<string, any> = {
	Grid,
	Box,
	FolderOpened,
	View: ViewIcon,
};

const activeTab = ref('category');
const searchKeyword = ref('');
const activeCollapseNames = ref((mockCategories as CategoryInfo[]).map((cat) => cat.id));
const categories = ref<CategoryInfo[]>([...mockCategories] as CategoryInfo[]);
const statCards = ref<StatCardData[]>([...mockStatCards] as StatCardData[]);

const filteredCategories = computed(() => {
	if (!searchKeyword.value) {
		return categories.value;
	}
	return categories.value.filter((category) => category.name.includes(searchKeyword.value));
});

const handleTabChange = (tabName: string) => {
	console.log('切换Tab:', tabName);
};

const handleSearch = () => {
	ElMessage.success('查询成功');
};

const handleReset = () => {
	searchKeyword.value = '';
	ElMessage.info('已重置');
};

const handleAddCategory = () => {
	ElMessage.info('新增分类');
};

const handleViewDetail = (category: CategoryInfo) => {
	ElMessage.info(`查看分类详情: ${category.name}`);
};

const handleEdit = (category: CategoryInfo) => {
	ElMessage.info(`编辑分类: ${category.name}`);
};

const handleDelete = (category: CategoryInfo) => {
	ElMessage.info(`删除分类: ${category.name}`);
};

/**
 * 从分类中移除应用，添加到未归类应用
 * @param category 分类信息
 * @param app 应用信息
 */
const handleRemoveApp = (category: CategoryInfo, app: any) => {
	const categoryIndex = categories.value.findIndex((c) => c.id === category.id);
	if (categoryIndex !== -1) {
		const targetCategory = categories.value[categoryIndex];
		const appIndex = targetCategory.apps.findIndex((a) => a.id === app.id);
		if (appIndex !== -1) {
			const removedApp = targetCategory.apps.splice(appIndex, 1)[0];
			targetCategory.uncategorizedApps.push(removedApp);
			updateCategoryStats(targetCategory);
			updateStatCards();
			ElMessage.success(`已移除应用: ${app.name}`);
		}
	}
};

/**
 * 从未归类应用添加到分类中
 * @param category 分类信息
 * @param app 应用信息
 */
const handleAddApp = (category: CategoryInfo, app: any) => {
	const categoryIndex = categories.value.findIndex((c) => c.id === category.id);
	if (categoryIndex !== -1) {
		const targetCategory = categories.value[categoryIndex];
		const appIndex = targetCategory.uncategorizedApps.findIndex((a) => a.id === app.id);
		if (appIndex !== -1) {
			const addedApp = targetCategory.uncategorizedApps.splice(appIndex, 1)[0];
			targetCategory.apps.push(addedApp);
			updateCategoryStats(targetCategory);
			updateStatCards();
			ElMessage.success(`已添加应用: ${app.name}`);
		}
	}
};

/**
 * 更新分类统计信息
 * @param category 分类信息
 */
const updateCategoryStats = (category: CategoryInfo) => {
	category.appCount = category.apps.length;
	const activeCount = category.apps.filter((app) => app.active).length;
	category.activeText = `已激活 ${activeCount}/${category.appCount}`;
};

/**
 * 更新统计卡片数据
 */
const updateStatCards = () => {
	const totalClassified = categories.value.reduce((sum, category) => sum + category.apps.length, 0);
	const totalUnclassified = categories.value.reduce((sum, category) => sum + category.uncategorizedApps.length, 0);

	statCards.value = statCards.value.map((card) => {
		if (card.title === '已归类应用') {
			return { ...card, value: totalClassified };
		}
		if (card.title === '未归类应用') {
			return { ...card, value: totalUnclassified };
		}
		return card;
	});
};
</script>

<style scoped lang="scss">
.main-content {
	padding: 20px;
	background-color: #f5f7fa;
	min-height: 100%;
}

.page-header {
	margin-bottom: 24px;

	:deep(.el-tabs__nav-wrap) {
		&::after {
			display: none;
		}
	}

	:deep(.el-tabs__item) {
		font-size: 16px;
		font-weight: 500;
		color: #6b7280;

		&.is-active {
			color: #3b82f6;
			font-weight: 600;
		}
	}
}

.stat-cards {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 16px;
	margin-bottom: 24px;
}

.stat-card {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 20px;
	background: white;
	border-radius: 12px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.stat-icon {
	width: 48px;
	height: 48px;
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.stat-info {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.stat-value {
	font-size: 24px;
	font-weight: 700;
	color: #1f2937;
}

.stat-title {
	font-size: 13px;
	color: #6b7280;
}

.search-bar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24px;
}

.search-left {
	display: flex;
	align-items: center;
	gap: 12px;
}

.search-label {
	font-size: 14px;
	color: #374151;
}

.search-input {
	width: 240px;
}

.category-collapse {
border:none;  
	:deep(.el-collapse-item) {
		margin-bottom: 20px;
		background: #ffffff;
		border-radius:8px;
		border: 1px solid #e5eaf3;
    overflow: hidden;
	}
	:deep(.el-collapse-item__header) {
		padding: 0 20px;
		height: auto;
	}

	:deep(.el-collapse-item__wrap) {
		border: none;
	}

	:deep(.el-collapse-item__content) {
		padding: 0;
	}
}

.collapse-title {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	padding: 12px 0;
}

.title-left {
	display: flex;
	align-items: center;
	gap: 10px;
}

.category-name {
	font-size: 15px;
	font-weight: 600;
	color: #1f2937;
}

.category-content {
	background: #f8fafc;
	padding: 20px;
}

.app-list {
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
	margin-bottom: 20px;
}

.app-item {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 8px 12px;
	background: white;
	border-radius: 8px;
}

.app-name {
	font-size: 14px;
	color: #374151;
}

.uncategorized-section {
	border-top: 1px dashed #e5e7eb;
	padding-top: 20px;
}

.section-title {
	font-size: 13px;
	color: #6b7280;
	margin-bottom: 16px;
}
</style>
