<template>
	<div class="ai-toolbox-container">
		<!-- 页面头部 -->
		<div class="page-header">
			<div class="header-title">
				<h3>AI 工具箱</h3>
				<p class="subtitle">管理平台系统中所有AI智能功能，关闭工具后对应AI功能将不再显示</p>
			</div>
			<div class="header-stats">已启用 {{ enabledCount }} / {{ filteredTools.length }} 个工具</div>
		</div>

		<!-- AI工具卡片列表 -->
		<div class="tools-grid" v-loading="loading">
			<transition-group name="card-list" tag="div" class="grid-container">
				<div v-for="tool in filteredTools" :key="tool.id" class="tool-card" :class="{ disabled: !tool.enabled }">
					<div class="card-header">
						<div class="tool-name">
							<el-icon :size="22" :color="tool.enabled ? 'var(--el-color-primary)' : '#909399'">
								<component :is="getToolIcon(tool.name)" />
							</el-icon>
							<span>{{ tool.name }}</span>
						</div>
						<el-switch v-model="tool.enabled" size="large" @change="handleToggle(tool)" :loading="togglingId === tool.id" />
					</div>
					<div class="card-description">
						{{ tool.description }}
					</div>
					<div class="card-meta">
						<div class="scope-badge">
							<el-icon><Position /></el-icon>
							作用于：{{ tool.scope }}
						</div>
						<div class="status-badge" :class="{ active: tool.enabled }">
							{{ tool.enabled ? '已启用' : '已关闭' }}
						</div>
					</div>
				</div>
			</transition-group>
		</div>

		<!-- 空状态 -->
		<el-empty v-if="filteredTools.length === 0 && !loading" description="没有找到匹配的AI工具" :image-size="160">
			<el-button type="primary" @click="resetFilter">重置筛选条件</el-button>
		</el-empty>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Search, Refresh, Check, Position, DataAnalysis, Monitor, Ticket, Guide, Document, Bell, Warning } from '@element-plus/icons-vue';

// AI工具数据类型定义
interface AITool {
	id: number;
	name: string;
	description: string;
	scope: string;
	enabled: boolean;
}

// 模拟API获取数据
const toolsData: AITool[] = [
	{
		id: 1,
		name: 'AI 高峰时段预测',
		description: '基于历史数据，智能预测每日各时段占用高峰，提前预警并建议分流策略。',
		scope: '数据总览',
		enabled: true,
	},
	{
		id: 2,
		name: 'AI 车牌识别增强',
		description: '利用深度学习模型提升车牌识别准确率，支持自动、遮挡等异常场景识别。',
		scope: '门岗监控',
		enabled: true,
	},
	{
		id: 3,
		name: 'AI 动态计算建议',
		description: '根据实时业务需求，自动调整业务优先级，平衡收益与成本。',
		scope: '收费管理',
		enabled: true,
	},
	{
		id: 4,
		name: 'AI 智能导航分流',
		description: '通过屏幕引导或App推送，将车辆导航至空闲车位较多的区域。',
		scope: '门岗监控',
		enabled: true,
	},
	{
		id: 5,
		name: 'AI 智能评价',
		description: '综合分析车流量、车位使用、车流趋势等数据，生成智能评价报告与优化建议。',
		scope: '数据总览',
		enabled: true,
	},
	{
		id: 6,
		name: 'AI 自动监测规则',
		description: '基于车辆违规行为自动触发报警规则，包括超时未缴费、多次违规等场景。',
		scope: '车辆异常',
		enabled: true,
	},
	{
		id: 7,
		name: 'AI 异常车辆检测',
		description: '智能识别长时间停留、异常进出场、疑似违停等异常行为，实时告警。',
		scope: '通行记录',
		enabled: true,
	},
];

// 响应式状态
const tools = ref<AITool[]>([]);
const loading = ref(false);
const togglingId = ref<number | null>(null);
const searchKeyword = ref('');
const filterScope = ref('');
const currentFilter = ref<'all' | 'enabled'>('all');

// 计算属性：唯一的作用范围列表
const uniqueScopes = computed(() => {
	const scopes = tools.value.map((tool) => tool.scope);
	return [...new Set(scopes)];
});

// 计算属性：已启用工具数量
const enabledCount = computed(() => tools.value.filter((t) => t.enabled).length);

// 计算属性：过滤后的工具列表
const filteredTools = computed(() => {
	let result = [...tools.value];

	// 按启用状态过滤
	if (currentFilter.value === 'enabled') {
		result = result.filter((tool) => tool.enabled);
	}

	// 按关键词搜索（名称或作用范围）
	if (searchKeyword.value.trim()) {
		const keyword = searchKeyword.value.trim().toLowerCase();
		result = result.filter(
			(tool) =>
				tool.name.toLowerCase().includes(keyword) || tool.scope.toLowerCase().includes(keyword) || tool.description.toLowerCase().includes(keyword)
		);
	}

	// 按作用范围筛选
	if (filterScope.value) {
		result = result.filter((tool) => tool.scope === filterScope.value);
	}

	return result;
});

// 图标映射（根据工具名称返回对应图标组件）
const getToolIcon = (toolName: string) => {
	if (toolName.includes('高峰')) return DataAnalysis;
	if (toolName.includes('车牌')) return Monitor;
	if (toolName.includes('计算')) return Ticket;
	if (toolName.includes('导航')) return Guide;
	if (toolName.includes('评价')) return Document;
	if (toolName.includes('监测')) return Bell;
	if (toolName.includes('异常')) return Warning;
	return DataAnalysis;
};

// 初始化加载数据
const initData = () => {
	loading.value = true;
	// 模拟异步加载
	setTimeout(() => {
		tools.value = JSON.parse(JSON.stringify(toolsData));
		loading.value = false;
	}, 300);
};

// 切换工具启用状态
const handleToggle = async (tool: AITool) => {
	togglingId.value = tool.id;
	// 模拟API请求
	return new Promise((resolve) => {
		setTimeout(() => {
			// 状态已在switch中双向绑定改变，这里仅做提示和记录
			ElMessage({
				message: `${tool.name} 已${tool.enabled ? '启用' : '停用'}`,
				type: 'success',
				duration: 2000,
			});
			togglingId.value = null;
			resolve(true);
		}, 500);
	});
};

// 仅显示已启用的工具
const filterEnabled = () => {
	currentFilter.value = currentFilter.value === 'enabled' ? 'all' : 'enabled';
	if (currentFilter.value === 'enabled') {
		ElMessage.info('已切换至“仅显示已启用”模式');
	} else {
		ElMessage.info('已显示全部工具');
	}
};

// 重置所有筛选条件
const resetFilter = () => {
	searchKeyword.value = '';
	filterScope.value = '';
	currentFilter.value = 'all';
	ElMessage.success('已重置所有筛选条件');
};

onMounted(() => {
	initData();
});
</script>

<style scoped lang="scss">
.ai-toolbox-container {
	min-height: 100vh;
	background: #f5f7fa;
	padding: 24px;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.page-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 28px;
	flex-wrap: wrap;
	gap: 16px;
	padding: 20px 28px;
	border-radius: 16px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
	border: 1px solid rgba(0, 0, 0, 0.05);
	background: linear-gradient(135deg, var(--el-color-primary-light-9) 0%, var(--el-color-primary-light-8) 100%);

	.header-title {
		h3 {
			margin: 0 0 8px 0;
			font-size: 18px;
			font-weight: 600;
			background: linear-gradient(135deg, #1e2a3a 0%, #2c3e50 100%);
			-webkit-background-clip: text;
			background-clip: text;
			color: transparent;
			letter-spacing: -0.3px;
		}
		.subtitle {
			margin: 0;
			color: #6c757d;
			font-size: 14px;
		}
	}

	.header-stats {
		display: flex;
		gap: 12px;
	}
}

.filter-bar {
	display: flex;
	gap: 16px;
	margin-bottom: 28px;
	flex-wrap: wrap;

	.search-input {
		flex: 2;
		min-width: 240px;
	}

	.scope-select {
		width: 200px;
	}
}

.tools-grid {
	.grid-container {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 22px;
	}
}

.tool-card {
	background: white;
	border-radius: 20px;
	padding: 20px 22px;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
	border: 1px solid rgba(0, 0, 0, 0.05);
	cursor: default;

	&:hover {
		transform: translateY(-4px);
		box-shadow: 0 16px 32px rgba(0, 0, 0, 0.1);
		border-color: rgba(64, 158, 255, 0.2);
	}

	&.disabled {
		background: #fafbfc;
		opacity: 0.85;

		.tool-name span {
			color: #9ca3af;
		}
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;

		.tool-name {
			display: flex;
			align-items: center;
			gap: 12px;
			font-size: 14px;
			font-weight: 600;
			color: #1f2d3d;

			span {
				background: linear-gradient(135deg, #2c3e50 0%, #1a2632 100%);
				background-clip: text;
				-webkit-background-clip: text;
				color: transparent;
			}
		}
	}

	.card-description {
		font-size: 14px;
		line-height: 1.5;
		color: #5a6874;
		margin-bottom: 10px;
		min-height: 30px;
	}

	.card-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 12px;
		border-top: 1px solid #eef2f6;

		.scope-badge {
			display: flex;
			align-items: center;
			gap: 6px;
			font-size: 13px;
			color: #8f9bb3;
			background: #f2f4f8;
			padding: 4px 12px;
			border-radius: 20px;
		}

		.status-badge {
			font-size: 13px;
			font-weight: 500;
			padding: 4px 12px;
			border-radius: 20px;
			background: #f0f2f5;
			color: #8f9bb3;

			&.active {
				background: #dbfce7;
				color: #34c167;
			}
		}
	}
}


/* 卡片列表动画 */
.card-list-enter-active,
.card-list-leave-active {
	transition: all 0.3s ease;
}

.card-list-enter-from {
	opacity: 0;
	transform: translateY(20px);
}

.card-list-leave-to {
	opacity: 0;
	transform: translateY(-20px);
}
</style>
