<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row :gutter="20">
				<el-col :span="24">
					<Welcome title="欢迎使用" name="访客管理系统" />
				</el-col>
			</el-row>
			<el-row :gutter="20" style="margin-top: 20px">
				<el-col :span="12">
					<!-- 拖拽分栏容器 -->
					<splitpanes class="default-splitpanes">
						<!-- 左侧 70% -->
						<pane size="50" class="pane">
							<!-- 上下垂直分栏 -->
							<splitpanes horizontal class="default-splitpanes">
								<pane size="50" class="pane">
									<div class="chart-container">
										<h3 class="chart-title">饼图示例</h3>
										<v-chart ref="pieChartRef" :option="pieOption" class="chart" />
									</div>
								</pane>
								<pane size="50" class="pane">
									<div class="chart-container">
										<h3 class="chart-title">折线图示例</h3>
										<v-chart ref="lineChartRef" :option="lineOption" class="chart" />
									</div>
								</pane>
							</splitpanes>
						</pane>

						<!-- 右侧 30% -->
						<pane size="50" class="pane">
							<splitpanes horizontal class="default-splitpanes">
								<pane size="50" class="pane">
									<div class="chart-container">
										<h3 class="chart-title">柱状图示例</h3>
										<v-chart ref="barChartRef" :option="barOption" class="chart" />
									</div>
								</pane>
								<pane size="50" class="pane">
									<div class="chart-container">
										<h3 class="chart-title">雷达图示例</h3>
										<v-chart ref="radarChartRef" :option="radarOption" class="chart" />
									</div>
								</pane>
							</splitpanes>
						</pane>
					</splitpanes>
				</el-col>
				<el-col :span="12">
					<!-- 测试区域 -->
					<div class="test-container">
						<h3 class="test-title">主题测试区域</h3>
						<div class="test-content">
							<!-- 面包屑组件 -->
							<el-breadcrumb separator="/" class="breadcrumb">
								<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
								<el-breadcrumb-item>数据可视化</el-breadcrumb-item>
							</el-breadcrumb>
							<!-- 按钮测试 -->
							<div class="test-section">
								<h4>按钮测试</h4>
								<div class="test-buttons">
									<el-button type="primary">主要按钮</el-button>
									<el-button type="primary" plain>线性按钮</el-button>
									<el-button type="default">次要按钮</el-button>
									<el-button type="default" disabled>禁用按钮 </el-button>
									<el-button type="primary" class="bg-gradient-primary-horizontal">渐变按钮 </el-button>
									<el-button type="primary" disabled class="bg-gradient-primary-horizontal">渐变禁用按钮 </el-button>
								</div>
							</div>

							<!-- 渐变颜色测试 -->
							<div class="test-section">
								<h4>渐变 div 颜色测试</h4>
								<div class="test-gradients">
									<div class="gradient-box bg-gradient-primary">对角渐变</div>
									<div class="gradient-box bg-gradient-primary-horizontal">水平渐变</div>
									<div class="gradient-box bg-gradient-primary-vertical">垂直渐变</div>
								</div>
							</div>

							<!-- 输入框测试 -->
							<div class="test-section">
								<h4>输入框测试</h4>
								<el-input v-model="inputValue" placeholder="请输入内容" class="test-input" />
								<el-input v-model="inputValue2" type="password" placeholder="请输入密码" class="test-input" />
							</div>

							<!-- 表单测试 -->
							<div class="test-section">
								<h4>表单测试</h4>
								<el-form :model="form" label-width="80px">
									<el-form-item label="姓名">
										<el-input v-model="form.name" />
									</el-form-item>
									<el-form-item label="年龄">
										<el-input-number v-model="form.age" :min="0" :max="100" />
									</el-form-item>
									<el-form-item label="性别">
										<el-radio-group v-model="form.gender">
											<el-radio value="male">男</el-radio>
											<el-radio value="female">女</el-radio>
										</el-radio-group>
									</el-form-item>
								</el-form>
							</div>
							<!-- 标签测试 -->
							<el-space class="tag-group">
								<span>标签测试</span>
								<el-tag type="danger" effect="plain"> 严重 </el-tag>
								<el-tag type="warning" effect="plain"> 警告 </el-tag>
								<el-tag type="primary" effect="plain"> 提醒 </el-tag>
								<el-tag type="success" effect="plain"> 正常 </el-tag>
							</el-space>

							<!-- 功能状态色测试 -->
							<div class="test-section">
								<h4>功能状态色测试</h4>
								<div class="test-functional-colors">
									<div class="functional-color-box bg-functional-error">错误/危险</div>
									<div class="functional-color-box bg-functional-warning">警告/提醒</div>
									<div class="functional-color-box bg-functional-success">成功/完成</div>
								</div>
							</div>

							<!-- 文字颜色测试 -->
							<div class="test-section">
								<h4>文字颜色测试</h4>
								<div class="test-text-colors">
									<p class="text-text-system">系统级主文本（最深）</p>
									<p class="text-text-dataAssist">数据辅助文本</p>
									<p class="text-text-primaryTitle">一级标题文本</p>
									<p class="text-text-assist">次要辅助文本（最浅）</p>
								</div>
							</div>
							<!-- 表格测试 -->
							<div class="test-section">
								<h4>表格测试</h4>
								<el-table :data="tableData" border style="width: 100%">
									<el-table-column prop="name" label="姓名" width="120" />
									<el-table-column prop="age" label="年龄" width="80" />
									<el-table-column prop="department" label="部门" width="150" />
									<el-table-column prop="position" label="职位" width="150" />
									<el-table-column prop="status" label="状态" width="100">
										<template #default="scope">
											<el-tag :type="scope.row.status === '在职' ? 'success' : 'danger'">{{ scope.row.status }}</el-tag>
										</template>
									</el-table-column>
									<el-table-column prop="date" label="入职日期" />
								</el-table>
							</div>

							<!-- 分页测试 -->
							<div class="test-section">
								<h4>分页测试</h4>
								<Pagination
									:current="pagination.current"
									:size="pagination.size"
									:total="pagination.total"
									@sizeChange="handleSizeChange"
									@currentChange="handleCurrentChange"
								/>
							</div>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script setup lang="ts" name="home">
import { ref, onMounted, onUnmounted } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart, LineChart, BarChart, RadarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent, DataZoomComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import { Splitpanes, Pane } from 'splitpanes';
import { getChartColor, registerChart, removeChartInstance } from '/@/utils/echartsUtils';
import Pagination from '/@/components/Pagination/index.vue';
import { Welcome } from '@common/index';

// 按需引入 ECharts 模块（性能更好）
use([CanvasRenderer, PieChart, LineChart, BarChart, RadarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent, DataZoomComponent]);

// 图表引用
const pieChartRef = ref();
const lineChartRef = ref();
const barChartRef = ref();
const radarChartRef = ref();

// 组件挂载后注册图表实例
onMounted(() => {
	// 注册图表实例
	if (pieChartRef.value) registerChart(pieChartRef.value.chart);
	if (lineChartRef.value) registerChart(lineChartRef.value.chart);
	if (barChartRef.value) registerChart(barChartRef.value.chart);
	if (radarChartRef.value) registerChart(radarChartRef.value.chart);
});
onUnmounted(() => {
	// 组件卸载时移除图表实例
	if (pieChartRef.value) removeChartInstance(pieChartRef.value.chart);
	if (lineChartRef.value) removeChartInstance(lineChartRef.value.chart);
	if (barChartRef.value) removeChartInstance(barChartRef.value.chart);
	if (radarChartRef.value) removeChartInstance(radarChartRef.value.chart);
});

// 测试数据
const inputValue = ref('');
const inputValue2 = ref('');
const form = ref({
	name: '',
	age: 0,
	gender: 'male',
});

// 表格数据
const tableData = ref([
	{ name: '张三', age: 28, department: '技术部', position: '前端工程师', status: '在职', date: '2023-01-15' },
	{ name: '李四', age: 32, department: '产品部', position: '产品经理', status: '在职', date: '2022-08-20' },
	{ name: '王五', age: 25, department: '设计部', position: 'UI设计师', status: '离职', date: '2023-03-10' },
	{ name: '赵六', age: 30, department: '技术部', position: '后端工程师', status: '在职', date: '2021-11-05' },
	{ name: '钱七', age: 27, department: '市场部', position: '市场专员', status: '在职', date: '2022-06-18' },
]);

// 分页数据
const pagination = ref({
	current: 1,
	size: 10,
	total: 50,
});

// 分页大小改变
const handleSizeChange = (size: number) => {
	pagination.value.size = size;
	console.log('分页大小改变:', size);
};

// 当前页改变
const handleCurrentChange = (current: number) => {
	pagination.value.current = current;
	console.log('当前页改变:', current);
};

// 图表颜色会通过全局主题监听器自动更新

// 饼图配置
const pieOption = ref({
	title: {
		text: '各产品销售占比',
		left: 'center',
	},
	tooltip: {
		trigger: 'item',
		formatter: '{a} <br/>{b}: {c} ({d}%)',
	},
	legend: {
		orient: 'vertical',
		left: 'left',
		data: ['产品A', '产品B', '产品C', '产品D', '产品E'],
	},
	series: [
		{
			name: '销售占比',
			type: 'pie',
			radius: '60%',
			center: ['50%', '60%'],
			data: [
				{ value: 35, name: '产品A', itemStyle: { color: getChartColor(0) } },
				{ value: 25, name: '产品B', itemStyle: { color: getChartColor(1) } },
				{ value: 20, name: '产品C', itemStyle: { color: getChartColor(2) } },
				{ value: 15, name: '产品D', itemStyle: { color: getChartColor(3) } },
				{ value: 5, name: '产品E', itemStyle: { color: getChartColor(4) } },
			],
			emphasis: {
				itemStyle: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)',
				},
			},
		},
	],
});

// 折线图配置
const lineOption = ref({
	title: {
		text: '月度销售趋势',
		left: 'center',
	},
	tooltip: {
		trigger: 'axis',
	},
	legend: {
		data: ['产品A', '产品B'],
		bottom: 0,
	},
	grid: {
		left: '3%',
		right: '4%',
		bottom: '15%',
		containLabel: true,
	},
	xAxis: {
		type: 'category',
		boundaryGap: false,
		data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
	},
	yAxis: {
		type: 'value',
	},
	series: [
		{
			name: '产品A',
			type: 'line',
			data: [120, 132, 101, 134, 90, 230, 210, 250, 220, 300, 310, 350],
			smooth: true,
			lineStyle: {
				color: getChartColor(0),
			},
			itemStyle: {
				color: getChartColor(0),
			},
			areaStyle: {},
		},
		{
			name: '产品B',
			type: 'line',
			data: [220, 182, 191, 234, 290, 330, 310, 350, 320, 400, 410, 450],
			smooth: true,
			lineStyle: {
				color: getChartColor(1),
			},
			itemStyle: {
				color: getChartColor(1),
			},
			areaStyle: {},
		},
	],
});

// 柱状图配置
const barOption = ref({
	title: {
		text: '各地区销售数据',
		left: 'center',
	},
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'shadow',
		},
	},
	legend: {
		data: ['2023年', '2024年'],
		bottom: 0,
	},
	grid: {
		left: '3%',
		right: '4%',
		bottom: '15%',
		containLabel: true,
	},
	xAxis: {
		type: 'category',
		data: ['华东', '华南', '华北', '西南', '西北'],
	},
	yAxis: {
		type: 'value',
	},
	series: [
		{
			name: '2023年',
			type: 'bar',
			data: [320, 332, 301, 334, 390],
			itemStyle: {
				color: getChartColor(0),
			},
		},
		{
			name: '2024年',
			type: 'bar',
			data: [350, 382, 391, 334, 420],
			itemStyle: {
				color: getChartColor(1),
			},
		},
	],
});

// 雷达图配置
const radarOption = ref({
	title: {
		text: '产品性能评估',
		left: 'center',
	},
	tooltip: {},
	legend: {
		data: ['产品A', '产品B'],
		bottom: 0,
	},
	radar: {
		indicator: [
			{ name: '性能', max: 100 },
			{ name: '功能', max: 100 },
			{ name: '易用性', max: 100 },
			{ name: '可靠性', max: 100 },
			{ name: '性价比', max: 100 },
		],
	},
	series: [
		{
			name: '产品评估',
			type: 'radar',
			data: [
				{
					value: [80, 90, 85, 95, 88],
					name: '产品A',
					areaStyle: {
						color: getChartColor(0),
					},
					lineStyle: {
						color: getChartColor(0),
					},
					itemStyle: {
						color: getChartColor(0),
					},
				},
				{
					value: [90, 85, 90, 92, 85],
					name: '产品B',
					areaStyle: {
						color: getChartColor(1),
					},
					lineStyle: {
						color: getChartColor(1),
					},
					itemStyle: {
						color: getChartColor(1),
					},
				},
			],
		},
	],
});
</script>

<style scoped>
.layout-padding {
	width: 100%;
	height: calc(100vh - 86px);
	padding: 16px;
	box-sizing: border-box;
	/* background: #f5f7fa; */
}

.layout-padding-auto {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	gap: 16px;
	overflow: auto;
}

/* 分栏容器必须设置高度 */
:deep(.default-splitpanes) {
	width: 100%;
	height: 100%;
	flex: 1;
}

/* 面板样式 */
:deep(.pane) {
	border-radius: 8px;
	overflow: hidden;
}

.chart-container {
	width: 100%;
	height: 100%;
	padding: 16px;
	box-sizing: border-box;
}

.chart-title {
	font-size: 16px;
	font-weight: 600;
	margin: 0 0 12px 0;
	color: #333;
}

.chart {
	width: 100%;
	height: calc(100% - 40px);
}

/* 测试区域样式 */
.test-container {
	border-radius: 8px;
	padding: 20px;
	box-sizing: border-box;
}

.test-title {
	font-size: 18px;
	font-weight: 600;
	margin: 0 0 20px 0;
	color: #333;
}

.test-content {
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.test-section {
	border-bottom: 1px solid #eee;
	padding-bottom: 15px;
}

.test-section:last-child {
	border-bottom: none;
}

.test-section h4 {
	font-size: 14px;
	font-weight: 600;
	margin: 0 0 10px 0;
	color: #666;
}

.test-buttons {
	display: flex;
	gap: 10px;
	flex-wrap: wrap;
}

.test-gradients {
	display: flex;
	gap: 10px;
	flex-wrap: wrap;
}

.gradient-box {
	width: 100px;
	height: 60px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 8px;
	color: #fff;
	font-size: 12px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
}

.gradient-box:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.test-functional-colors {
	display: flex;
	gap: 10px;
	flex-wrap: wrap;
}

.functional-color-box {
	width: 120px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 8px;
	color: #fff;
	font-size: 12px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
}

.functional-color-box:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.test-text-colors {
	display: flex;
	flex-direction: column;
	gap: 5px;
}

.test-input {
	width: 300px;
	margin-right: 10px;
	margin-bottom: 10px;
}

.test-text-primary {
	color: var(--el-text-color-primary);
	margin: 5px 0;
}

.test-text-secondary {
	color: var(--el-text-color-regular);
	margin: 5px 0;
}

.test-text-disabled {
	color: var(--el-text-color-disabled);
	margin: 5px 0;
}

:deep(.el-form) {
	max-width: 400px;
}

/* 面包屑样式 */
.breadcrumb {
	margin-bottom: 16px;
	padding: 8px 0;
}

:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
	color: var(--el-color-primary);
	font-weight: 600;
}

:deep(.el-breadcrumb__inner) {
	color: var(--el-text-color-primary);
}

:deep(.el-breadcrumb__separator) {
	color: var(--el-text-color-secondary);
}
</style>
