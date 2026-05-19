<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view" :style="dashboardVars">
			<!-- 顶部指标卡片 -->
			<div class="metrics-row metric-grid">
				<div class="metric-card">
					<div class="metric-card__content">
						<p class="metric-card__label">总损耗率</p>
						<div class="metric-card__value">
						<span>{{ lossMetrics.totalLossRate.value }}</span>
						<small>{{ lossMetrics.totalLossRate.unit }}</small>
					</div>
					<p class="metric-card__context"></p>
					<div class="metric-card__delta {{ lossMetrics.totalLossRate.deltaType }}">
						<span class="metric-card__delta-label">{{ lossMetrics.totalLossRate.deltaLabel }}</span>
						<span class="metric-card__delta-value">{{ lossMetrics.totalLossRate.deltaValue }}</span>
					</div>
					</div>
					<div class="metric-card__visual">
						<div class="metric-card__icon-shell">
							<img :src="getMetricImage('totalLossRate')" :alt="'总损耗率'" class="metric-icon metric-icon--image" />
						</div>
					</div>
				</div>
				<div class="metric-card">
					<div class="metric-card__content">
						<p class="metric-card__label">线路损耗</p>
						<div class="metric-card__value">
						<span>{{ lossMetrics.lineLoss.value }}</span>
						<small>{{ lossMetrics.lineLoss.unit }}</small>
					</div>
					<p class="metric-card__context"></p>
					<div class="metric-card__delta {{ lossMetrics.lineLoss.deltaType }}">
						<span class="metric-card__delta-label">{{ lossMetrics.lineLoss.deltaLabel }}</span>
						<span class="metric-card__delta-value">{{ lossMetrics.lineLoss.deltaValue }}</span>
					</div>
					</div>
					<div class="metric-card__visual">
						<div class="metric-card__icon-shell">
							<img :src="getMetricImage('lineLoss')" :alt="'线路损耗'" class="metric-icon metric-icon--image" />
						</div>
					</div>
				</div>
				<div class="metric-card">
					<div class="metric-card__content">
						<p class="metric-card__label">变压器损耗</p>
						<div class="metric-card__value">
						<span>{{ lossMetrics.transformerLoss.value }}</span>
						<small>{{ lossMetrics.transformerLoss.unit }}</small>
					</div>
					<p class="metric-card__context"></p>
					<div class="metric-card__delta {{ lossMetrics.transformerLoss.deltaType }}">
						<span class="metric-card__delta-label">{{ lossMetrics.transformerLoss.deltaLabel }}</span>
						<span class="metric-card__delta-value">{{ lossMetrics.transformerLoss.deltaValue }}</span>
					</div>
					</div>
					<div class="metric-card__visual">
						<div class="metric-card__icon-shell">
							<img :src="getMetricImage('transformerLoss')" :alt="'变压器损耗'" class="metric-icon metric-icon--image" />
						</div>
					</div>
				</div>
				<div class="metric-card">
					<div class="metric-card__content">
						<p class="metric-card__label">改进空间</p>
						<div class="metric-card__value">
						<span>{{ lossMetrics.improvementPotential.value }}</span>
						<small>{{ lossMetrics.improvementPotential.unit }}</small>
					</div>
					<p class="metric-card__context"></p>
					<div class="metric-card__delta {{ lossMetrics.improvementPotential.deltaType }}">
						<span class="metric-card__delta-label">{{ lossMetrics.improvementPotential.deltaLabel }}</span>
						<span v-if="lossMetrics.improvementPotential.deltaValue" class="metric-card__delta-value">{{ lossMetrics.improvementPotential.deltaValue }}</span>
					</div>
					</div>
					<div class="metric-card__visual">
						<div class="metric-card__icon-shell">
							<img :src="getMetricImage('improvementPotential')" :alt="'改进空间'" class="metric-icon metric-icon--image" />
						</div>
					</div>
				</div>
			</div>

			<!-- 第一行图表 -->
			<el-row :gutter="20" class="charts-row">
				<el-col :span="16">
					<div class="chart-container">
						<h3 class="chart-title">能源损耗流向分析（桑基图）</h3>
						<el-tabs v-model="energyTab" class="energy-tabs">
							<el-tab-pane label="电力损耗" name="electricity"></el-tab-pane>
							<el-tab-pane label="供水损耗" name="water"></el-tab-pane>
						</el-tabs>
						<v-chart ref="sankeyChartRef" :option="sankeyOption" class="chart" />
					</div>
				</el-col>
				<el-col :span="8">
					<div class="chart-container">
					<h3 class="chart-title">损耗类型分布</h3>
					<PieChartComponent :data="pieChartData" />
				</div>
				</el-col>
			</el-row>

			<!-- 第二行图表 -->
			<el-row :gutter="20" class="charts-row">
				<el-col :span="12">
					<LineChartComponent 
						:title="'损耗趋势分析'"
						:xAxisData="trendXAxisData"
						:data="trendData"
						:seriesName="'损耗率'"
						:yAxisName="'损耗率(%)'"
						:yAxisMin="5.0"
						:yAxisMax="7.0"
					/>
				</el-col>
				<el-col :span="12">
					<HorizontalBarChart 
						:yAxisData="rankingYAxisData" 
						:data="rankingData" 
						:title="'分区损耗排名'"
					/>
				</el-col>
			</el-row>

			<!-- 第三行图表和诊断 -->
			<el-row :gutter="20" class="charts-row">
				<el-col :span="12">
					<ComparisonBarChart 
						:lastYearData="lastYearLossData" 
						:currentYearData="currentYearLossData" 
						:xAxisData="lossRateMonths" 
					/>
				</el-col>
				<el-col :span="12">
					<div class="chart-container">
						<h3 class="chart-title">质量问题诊断</h3>
						<div class="diagnosis-list">
							<div class="diagnosis-item" v-for="(item, index) in diagnosisList" :key="index">
								<div class="diagnosis-title">{{ item.title }}</div>
								<div class="diagnosis-info">
									<span class="info-item">预计节能量: {{ item.expectedSavings }}</span>
									<span class="info-item">预计收益: {{ item.expectedProfit }}</span>
								</div>
								<div class="diagnosis-content">{{ item.content }}</div>
								<el-button type="text" size="small" class="view-detail-btn">查看详情</el-button>
							</div>
						</div>
					</div>
				</el-col>
			</el-row>

			<!-- 损耗详细数据表格 -->
			<div class="table-container">
				<h3 class="chart-title">损耗详细数据</h3>
				<el-row :gutter="20" class="table-tabs-row">
					<el-col :span="24" class="table-tabs">
						<el-button type="primary" size="small" class="tab-btn">按分区</el-button>
						<el-button type="default" size="small" class="tab-btn">按类型</el-button>
						<el-button type="default" size="small" class="tab-btn">按设备</el-button>
					</el-col>
				</el-row>
				<el-table :data="lossData" border style="width: 100%" class="loss-table">
					<el-table-column prop="objectName" label="对象名称" width="200" />
					<el-table-column prop="lossType" label="损耗类型" width="120" />
					<el-table-column prop="inputEnergy" label="输入能量" width="120" />
					<el-table-column prop="outputEnergy" label="输出能量" width="120" />
					<el-table-column prop="lossAmount" label="损耗量" width="120">
						<template #default="scope">
							<span class="loss-amount">{{ scope.row.lossAmount }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="lossRate" label="损耗率" width="100">
						<template #default="scope">
							<span :class="{ 'loss-rate-exceed': scope.row.deviation > 0 }">{{ scope.row.lossRate }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="standardLossRate" label="标准损耗率" width="120" />
					<el-table-column prop="deviation" label="偏差" width="100">
						<template #default="scope">
							<span :class="scope.row.deviation > 0 ? 'deviation-positive' : 'deviation-negative'">
								{{ scope.row.deviation > 0 ? '+' : '' }}{{ scope.row.deviation }}%
							</span>
						</template>
					</el-table-column>
					<el-table-column prop="improvementSuggestion" label="改进建议" min-width="200" />
				</el-table>
				<!-- 分页 -->
				<div class="pagination-container">
					<el-pagination
						:current-page="pagination.current"
						:page-size="pagination.size"
						:page-sizes="[10, 20, 50, 100]"
						:total="pagination.total"
						layout="total, sizes, prev, pager, next, jumper"
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="lossAnalysis">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import * as echarts from 'echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart, LineChart, BarChart, SankeyChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent, DataZoomComponent,GraphicComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import { getChartColor, getGradientChartColor, registerChart, removeChartInstance } from '/@/utils/echartsUtils';
import PieChartComponent from '/@/components/Chart/pieChart.vue';
import ComparisonBarChart from './comparisonBarChart.vue';
import HorizontalBarChart from '/@/components/Chart/horizontalBarChart.vue';
import LineChartComponent from '/@/components/Chart/lineChart.vue';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useChangeColor } from '/@/utils/theme';
import { useThemeImage } from '/@/utils/themeImages';

// 引入主题配置和工具
const storesThemeConfig = useThemeConfig();
const { getDarkColor, getLightColor, hexToRgb } = useChangeColor();
const metricCardBackgroundImage = useThemeImage('metricCardBackground');

// 计算属性
const currentTheme = computed(() => storesThemeConfig.themeConfig.currentTheme);
const primaryColor = computed(() => storesThemeConfig.themeConfig.primary || currentTheme.value?.color?.primary?.normal || '#1677FF');

// 获取指标卡片图片
const totalLossRateImage = useThemeImage('totalLossRate');
const lineLossImage = useThemeImage('lineLoss');
const transformerLossImage = useThemeImage('transformerLoss');
const improvementPotentialImage = useThemeImage('improvementPotential');

// 获取图片的函数
const getMetricImage = (key: string) => {
  const imageMap: Record<string, string> = {
    totalLossRate: totalLossRateImage.value,
    lineLoss: lineLossImage.value,
    transformerLoss: transformerLossImage.value,
    improvementPotential: improvementPotentialImage.value,
  };
  return imageMap[key];
};

// 主题变量
const dashboardVars = computed(() => {
  const primary = primaryColor.value;
  return {
    '--dashboard-primary': primary,
    '--dashboard-primary-rgb': Array.isArray(hexToRgb(primary)) ? hexToRgb(primary).join(',') : '0, 148, 255',
    '--dashboard-metric-card-image': `url("${metricCardBackgroundImage.value}")`,
  };
});

// 损耗指标数据
const lossMetrics = reactive({
  totalLossRate: {
    value: 5.8,
    unit: '%',
    deltaLabel: '较上月',
    deltaValue: '+0.5%',
    deltaType: 'is-up'
  },
  lineLoss: {
    value: 3850,
    unit: 'kWh',
    deltaLabel: '损耗率',
    deltaValue: '3.3%',
    deltaType: ''
  },
  transformerLoss: {
    value: 2456,
    unit: 'kWh',
    deltaLabel: '损耗率',
    deltaValue: '2%',
    deltaType: ''
  },
  improvementPotential: {
    value: 8560,
    unit: '元/月',
    deltaLabel: '可节约费用',
    deltaValue: '',
    deltaType: ''
  }
});

// 按需引入 ECharts 模块
use([CanvasRenderer, PieChart, LineChart, BarChart, SankeyChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent, DataZoomComponent,GraphicComponent]);

// 图表引用
const sankeyChartRef = ref();
// 损耗趋势分析数据
const trendXAxisData = ref(['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']);
const trendData = ref([6.8, 6.5, 6.3, 6.2, 6.1, 5.8, 6.0, 6.2, 6.3, 6.5, 6.6, 6.7]);
// 分区损耗排名数据
const rankingYAxisData = ref(['E栋', 'B栋', 'A栋', 'D栋', 'C栋']);
const rankingData = ref([3880, 3780, 3600, 3300, 3100]);

// 损耗率对比柱状图数据
const lastYearLossData = ref([17, 8.8, 6, 8.8, 17, 6]);
const currentYearLossData = ref([21, 11, 7.5, 11, 21, 7.5]);
const lossRateMonths = ref(['7月', '8月', '9月', '10月', '11月', '12月']);

// 能源损耗标签页
const energyTab = ref('electricity');

// 组件挂载后注册图表实例
onMounted(() => {
	if (sankeyChartRef.value) registerChart(sankeyChartRef.value.chart);
});

onUnmounted(() => {
	if (sankeyChartRef.value) removeChartInstance(sankeyChartRef.value.chart);
});

// 分页数据
const pagination = ref({
	current: 1,
	size: 10,
	total: 500,
});

// 分页大小改变
const handleSizeChange = (size: number) => {
	pagination.value.size = size;
};

// 当前页改变
const handleCurrentChange = (current: number) => {
	pagination.value.current = current;
};

// 质量问题诊断数据
const diagnosisList = ref([
	{
		type: 'optimization',
		title: '优化线路布局',
		expectedSavings: '1850 kWh/月',
		expectedProfit: '1275元/月',
		content: '通过重新规划配电线路走向，缩短供电距离，可有效降低线路损耗。特别是A区到配电室的线路过长，建议增设分电间。',
	},
	{
		type: 'inspection',
		title: '管网漏损检查',
		expectedSavings: '1580 kWh/月',
		expectedProfit: '1127元/月',
		content: 'A区供水管道损耗率超1.2%，建议进行全面漏损检查，重点检查地下管道和阀门连接处。',
	},
	{
		type: 'load',
		title: '变压器负载优化',
		expectedSavings: '1650 kWh/月',
		expectedProfit: '1152元/月',
		content: '2#变压器长期处于轻负载运行状态（负载率35%），建议调整负载分配，提高变压器运行效率。',
	},
	{
		type: 'equipment',
		title: '能效设备更新',
		expectedSavings: '1850 kWh/月',
		expectedProfit: '1425元/月',
		content: '部分老旧水泵和风机效率偏低，建议制定设备更新计划，采用高效节能设备替代。',
	},
]);

// 损耗详细数据
const lossData = ref([
	{ objectName: '总配电室-1#变电站', lossType: '线路损耗', inputEnergy: '125,650kWh', outputEnergy: '122,450kWh', lossAmount: '3200kWh', lossRate: '2.6%', standardLossRate: '2.0%', deviation: '+0.6%', improvementSuggestion: '优化线路，减少线路长度' },
	{ objectName: '总配电室-1#变电站', lossType: '变压器损耗', inputEnergy: '125,650kWh', outputEnergy: '122,450kWh', lossAmount: '3200kWh', lossRate: '2.6%', standardLossRate: '2.0%', deviation: '+0.6%', improvementSuggestion: '负载率合理，无需改进' },
	{ objectName: '总配电室-1#变电站', lossType: '管网损耗', inputEnergy: '125,650kWh', outputEnergy: '122,450kWh', lossAmount: '3200kWh', lossRate: '3.3%', standardLossRate: '2.0%', deviation: '+1.2%', improvementSuggestion: '检查管道是否存在泄漏' },
	{ objectName: '总配电室-1#变电站', lossType: '管网损耗', inputEnergy: '125,650kWh', outputEnergy: '122,450kWh', lossAmount: '3200kWh', lossRate: '1.9%', standardLossRate: '2.0%', deviation: '-0.1%', improvementSuggestion: '优化管网压力控制' },
	{ objectName: '总配电室-1#变电站', lossType: '管网损耗', inputEnergy: '125,650kWh', outputEnergy: '122,450kWh', lossAmount: '3200kWh', lossRate: '1.9%', standardLossRate: '2.0%', deviation: '-0.1%', improvementSuggestion: '优化管网压力控制' },
	{ objectName: '总配电室-1#变电站', lossType: '管网损耗', inputEnergy: '125,650kWh', outputEnergy: '122,450kWh', lossAmount: '3200kWh', lossRate: '1.9%', standardLossRate: '2.0%', deviation: '-0.1%', improvementSuggestion: '优化管网压力控制' },
	{ objectName: '总配电室-1#变电站', lossType: '管网损耗', inputEnergy: '125,650kWh', outputEnergy: '122,450kWh', lossAmount: '3200kWh', lossRate: '1.9%', standardLossRate: '2.0%', deviation: '-0.1%', improvementSuggestion: '优化管网压力控制' },
	{ objectName: '总配电室-1#变电站', lossType: '管网损耗', inputEnergy: '125,650kWh', outputEnergy: '122,450kWh', lossAmount: '3200kWh', lossRate: '1.9%', standardLossRate: '2.0%', deviation: '-0.1%', improvementSuggestion: '优化管网压力控制' },
	{ objectName: '总配电室-1#变电站', lossType: '管网损耗', inputEnergy: '125,650kWh', outputEnergy: '122,450kWh', lossAmount: '3200kWh', lossRate: '1.9%', standardLossRate: '2.0%', deviation: '-0.1%', improvementSuggestion: '优化管网压力控制' },
	{ objectName: '总配电室-1#变电站', lossType: '管网损耗', inputEnergy: '125,650kWh', outputEnergy: '122,450kWh', lossAmount: '3200kWh', lossRate: '1.9%', standardLossRate: '2.0%', deviation: '+0.1%', improvementSuggestion: '优化管网压力控制' },
]);

// 桑基图配置
const sankeyOption = ref({
	tooltip: {
		trigger: 'item',
		triggerOn: 'mousemove',
	},
	series: [
		{
			type: 'sankey',
			layout: 'none',
			data: [
				{ name: '总耗电量' ,itemStyle: { color: getChartColor(0) }  },
				{ name: 'A栋有效电' ,itemStyle: { color: getChartColor(1) }  },
				{ name: 'B栋有效电' ,itemStyle: { color: getChartColor(2) }  },
				{ name: 'C栋有效电' ,itemStyle: { color: getChartColor(3) }  },
				{ name: 'D栋有效电' ,itemStyle: { color: getChartColor(4) }  },
				{ name: '线路损耗' ,itemStyle: { color: getChartColor(5) }  },
				{ name: '变压器损耗' ,itemStyle: { color: getChartColor(6) }  },
				{ name: '转换损耗' ,itemStyle: { color: getChartColor(7) }  },
				{ name: '末端损耗' ,itemStyle: { color: getChartColor(8) }  },
			],
			links: [
				{ source: '总耗电量', target: 'A栋有效电', value: 15000 },
				{ source: '总耗电量', target: 'B栋有效电', value: 12000 },
				{ source: '总耗电量', target: 'C栋有效电', value: 10000 },
				{ source: '总耗电量', target: 'D栋有效电', value: 8000 },
				{ source: '总耗电量', target: '线路损耗', value: 3850 },
				{ source: '总耗电量', target: '变压器损耗', value: 2456 },
				{ source: '总耗电量', target: '转换损耗', value: 1500 },
				{ source: '总耗电量', target: '末端损耗', value: 1000 },
			],
			lineStyle: {
				color: 'gradient',
				curveness: 0.5,
			},
		},
	],
});

// 饼图数据
const pieChartData = ref([
	{ value: 3850, name: '线路损耗' },
	{ value: 2456, name: '变压器损耗' },
	{ value: 1500, name: '管网损耗' },
	{ value: 1200, name: '转换损耗' },
	{ value: 1000, name: '末端损耗' },
]);





</script>

<style scoped>
.layout-padding {
	width: 100%;
	height: calc(100vh - 86px);
	padding: 16px;
	box-sizing: border-box;
}

.layout-padding-auto {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	gap: 16px;
	overflow: auto;
}

/* 指标卡片样式 */
.metrics-row {
	margin-bottom: 20px;
}

.metric-grid {
	width: 100%;
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	align-items: stretch;
	gap: clamp(12px, 0.83333vw, 16px);
}

.metric-card {
	position: relative;
	display: grid;
	grid-template-columns: minmax(0, 1fr) 90px;
	align-items: center;
	height: 110px;
	padding: clamp(14px, 0.83333vw, 16px) clamp(16px, 1.04167vw, 20px);
	border-radius: clamp(16px, 1.04167vw, 20px);
	background-color: #ffffff;
	background-image: var(--dashboard-metric-card-image);
	background-repeat: no-repeat;
	background-position: center;
	background-size: 100% 100%;
	border: none;
	box-shadow: none;
	overflow: hidden;
}

.metric-card__content {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	gap: clamp(4px, 0.3125vw, 6px);
	color: var(--theme-text-system);
}

.metric-card__label {
	font-size: 14px;
	font-weight: 700;
	color: var(--theme-text-primaryTitle);
	line-height: 1.2;
	margin: 0;
}

.metric-card__value {
	display: flex;
	align-items: flex-end;
	gap: 6px;
	line-height: 1;
}

.metric-card__value span {
	font-size: 24px;
	font-weight: 800;
	letter-spacing: -0.03em;
	color: var(--theme-text-system);
}

.metric-card__value small {
	margin-bottom: 3px;
	font-size: clamp(14px, 0.83333vw, 16px);
	font-weight: 700;
	color: var(--theme-text-dataAssist);
}

.metric-card__context {
	display: none;
	margin: 0;
}

.metric-card__delta {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	width: fit-content;
	padding: 0;
	border-radius: 0;
	line-height: 1.1;
}

.metric-card__delta.is-up {
	background: transparent;
	color: #ef4444;
}

.metric-card__delta.is-down {
	background: transparent;
	color: #46b538;
}

.metric-card__delta-label {
	font-size: 12px;
	font-weight: 500;
	color: var(--theme-text-dataAssist);
}

.metric-card__delta-value {
	font-size: 16px;
	font-weight: 700;
}

.metric-card__visual {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	height: 100%;
	min-height: 0;
	z-index: 1;
}

.metric-card__icon-shell {
	position: relative;
	width: 90px;
	height: 90px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.metric-icon {
	width: 100%;
	height: 100%;
	filter: drop-shadow(0 8px 14px var(--metric-accent-soft));
}

.metric-icon--image {
	object-fit: contain;
}

/* 图表容器样式 */
.charts-row {
	margin-bottom: 20px;
}

.chart-container {
	background: #fff;
	border-radius: 28px;
	padding: 24px;
	box-sizing: border-box;
	border: 1px solid rgba(var(--dashboard-primary-rgb), 0.08);
	box-shadow: none;
	height: 100%;
}

.chart-title {
	font-size: 16px;
	font-weight: 600;
	margin: 0 0 12px 0;
	color: #303133;
}

.chart {
	width: 100%;
	height: calc(100% - 40px);
	min-height: 300px;
}

/* 能源损耗标签页样式 */
.energy-tabs {
	margin-bottom: 10px;
}

/* 质量问题诊断样式 */
.diagnosis-list {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.diagnosis-item {
	border: 1px solid #ebeef5;
	border-radius: 8px;
	padding: 16px;
	box-sizing: border-box;
}

.diagnosis-title {
	font-size: 14px;
	font-weight: bold;
	color: #303133;
	margin-bottom: 8px;
}

.diagnosis-info {
	display: flex;
	gap: 16px;
	margin-bottom: 8px;
	font-size: 12px;
	color: #606266;
}

.diagnosis-content {
	font-size: 12px;
	color: #909399;
	margin-bottom: 8px;
	line-height: 1.5;
}

.view-detail-btn {
	font-size: 12px;
	padding: 0;
}

/* 表格容器样式 */
.table-container {
	background: #fff;
	border-radius: 28px;
	padding: 24px;
	box-sizing: border-box;
	border: 1px solid rgba(var(--dashboard-primary-rgb), 0.08);
	box-shadow: none;
}

.table-tabs-row {
	margin-bottom: 16px;
}

.table-tabs {
	display: flex;
	gap: 8px;
}

.tab-btn {
	padding: 4px 16px;
	font-size: 12px;
}

/* 表格样式 */
.loss-table {
	margin-bottom: 16px;
}

.loss-amount {
	font-weight: bold;
	color: #303133;
}

.loss-rate-exceed {
	color: #f56c6c;
	font-weight: bold;
}

.deviation-positive {
	color: #f56c6c;
}

.deviation-negative {
	color: #67c23a;
}

/* 分页样式 */
.pagination-container {
	text-align: right;
	padding: 16px 0;
}
.layout-padding-auto.layout-padding-view {
	padding: 0 !important;
}
</style>