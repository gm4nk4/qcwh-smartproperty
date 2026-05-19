<template>
	<div class="ai-center">
		<!-- 页面头部 -->
		<div class="page-header">
			<el-tabs v-model="activeTab">
				<el-tab-pane label="综合概览" name="overview" />
				<el-tab-pane label="工具管理" name="tools" />
				<el-tab-pane label="模型接入" name="models" />
				<el-tab-pane label="健康监控" name="health" />
				<el-tab-pane label="活动日志" name="logs" />
			</el-tabs>
		</div>

		<!-- 综合概览 -->
		<template v-if="activeTab === 'overview'">
			<StatsCards :cards="statsCards" />
			<TrendCharts />
			<TokenStats :token-stats="tokenStats" :subsystem-calls="subsystemCalls" />
			<ToolOverview
				:tool-stats="toolStats"
				:attention-tools="attentionTools"
				:top-tools="topTools"
			/>
		</template>

		<!-- 工具管理 -->
		<template v-else-if="activeTab === 'tools'">
			<ToolsManage
				:tools="tools"
				:categories="toolCategories"
				:use-scenes="useScenes"
				@toggle-enabled="handleToggleEnabled"
				@search="handleToolSearch"
				@reset="handleToolReset"
			/>
		</template>

		<!-- 模型接入 -->
		<template v-else-if="activeTab === 'models'">
			<ModelsManage
				:models="models"
				:categories="modelCategories"
				@toggle-status="handleToggleModelStatus"
				@edit="handleEditModel"
				@add="handleAddModel"
				@set-preferred="handleSetPreferredModel"
			/>
		</template>

		<!-- 健康监控 -->
		<template v-else-if="activeTab === 'health'">
			<HealthMonitor :services="services" :health-stats="healthStats" />
			<DependencyGraph
				:data-sources="dataSources"
				:ai-tools="aiTools"
				:output-scenes="outputScenes"
			/>
		</template>

		<!-- 活动日志 -->
		<template v-else>
			<ActivityLogs :stats-cards="logStatsCards" :logs="activityLogs" />
		</template>
	</div>
</template>

<script setup lang="ts" name="AIToolsCenter">
import { ref, computed } from 'vue';
import { DataLine } from '@element-plus/icons-vue';
import StatsCards from './components/StatsCards.vue';
import TrendCharts from './components/TrendCharts.vue';
import TokenStats from './components/TokenStats.vue';
import ToolOverview from './components/ToolOverview.vue';
import ToolsManage from './components/ToolsManage.vue';
import ModelsManage from './components/ModelsManage.vue';
import HealthMonitor from './components/HealthMonitor.vue';
import DependencyGraph from './components/DependencyGraph.vue';
import ActivityLogs from './components/ActivityLogs.vue';
import type { ToolCard, Model } from './type';
import {
	mockAIServices,
	mockHealthStats,
	mockDataSources,
	mockAITools,
	mockOutputScenes,
	mockStatsCards,
	mockTokenStats,
	mockSubsystemCalls,
	mockToolStats,
	mockAttentionTools,
	mockTopTools,
	mockToolCategories,
	mockUseScenes,
	mockToolCards,
	mockModelCategories,
	mockModels,
	mockLogStatsCards,
	mockActivityLogs,
} from './mock';
import { ElMessage } from 'element-plus';

/** 当前激活的标签页 */
const activeTab = ref('overview');
/** AI服务列表 */
const services = ref([...mockAIServices]);
/** 健康统计数据 */
const healthStats = ref({ ...mockHealthStats });
/** 数据源列表 */
const dataSources = ref([...mockDataSources]);
/** AI工具列表 */
const aiTools = ref([...mockAITools]);
/** 输出场景列表 */
const outputScenes = ref([...mockOutputScenes]);
/** 统计卡片数据 */
const statsCards = ref([...mockStatsCards]);
/** Token统计数据 */
const tokenStats = ref({ ...mockTokenStats });
/** 子系统调用数据 */
const subsystemCalls = ref([...mockSubsystemCalls]);
/** 工具统计数据 */
const toolStats = ref({ ...mockToolStats });
/** 关注工具列表 */
const attentionTools = ref([...mockAttentionTools]);
/** 热门工具列表 */
const topTools = ref([...mockTopTools]);
/** 工具分类列表 */
const toolCategories = ref([...mockToolCategories]);
/** 使用场景列表 */
const useScenes = ref([...mockUseScenes]);
/** 工具列表 */
const tools = ref([...mockToolCards]);
/** 模型分类列表 */
const modelCategories = ref([...mockModelCategories]);
/** 模型列表 */
const models = ref([...mockModels]);
/** 日志统计卡片 */
const logStatsCards = ref([...mockLogStatsCards]);
/** 活动日志数据 */
const activityLogs = ref([...mockActivityLogs]);

/** 占位文本 */
const placeholderText = computed(() => {
	const texts: Record<string, string> = {
		logs: '活动日志功能开发中...',
	};
	return texts[activeTab.value] || '功能开发中...';
});

/**
 * 处理工具启用状态切换
 * @param tool 工具数据
 */
const handleToggleEnabled = (tool: ToolCard) => {
	ElMessage.success(`工具: ${tool.name} 状态变更`);
};

/**
 * 处理工具搜索
 */
const handleToolSearch = () => {
	ElMessage.success('搜索工具');
};

/**
 * 处理工具搜索重置
 */
const handleToolReset = () => {
	ElMessage.success('重置搜索');
};

/**
 * 处理模型状态切换
 * @param model 模型数据
 */
const handleToggleModelStatus = (model: Model) => {
	ElMessage.success(`模型: ${model.name} 状态变更`);
};

/**
 * 处理编辑模型
 * @param model 模型数据
 */
const handleEditModel = (model: Model) => {
	ElMessage.success(`编辑模型: ${model.name}`);
};

/**
 * 处理新增模型
 */
const handleAddModel = () => {
	ElMessage.success('新增模型');
};

/**
 * 处理设为首选模型
 * @param model 模型数据
 */
const handleSetPreferredModel = (model: Model) => {
	ElMessage.success(`设为首选: ${model.name}`);
};
</script>

<style scoped lang="scss">
.ai-center {
	display: flex;
	flex-direction: column;
	gap: 20px;
	padding: 20px;
  flex: 1;
}

.page-header {
	.el-tabs {
		border-bottom: none;

		.el-tabs__nav-wrap {
			padding: 0;

			.el-tabs__item {
				font-size: 15px;
				font-weight: 500;
			}

			.el-tabs__item.is-active {
				color: var(--el-color-primary);
				font-weight: 600;
			}
		}
	}
}

.placeholder-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 100px 0;
	background: white;
	border-radius: 12px;

	.placeholder-icon {
		font-size: 64px;
		color: #9ca3af;
		margin-bottom: 16px;
	}

	.placeholder-text {
		font-size: 16px;
		color: #6b7280;
	}
}
</style>
