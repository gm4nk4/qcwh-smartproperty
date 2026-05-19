<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-scrollbar class="flow-analysis-scrollbar">
				<div class="flow-analysis-dashboard" :style="dashboardVars">
					<section class="home-toolbar">
					<div class="home-toolbar__tabs">
						<button
							v-for="item in energyOptions"
							:key="item.value"
							type="button"
							class="home-toolbar__tab"
							:class="{ 'is-active': energyTab === item.value }"
							@click="energyTab = item.value"
						>
							{{ item.label }}
						</button>
					</div>
					<div class="home-toolbar__date-form">
						<el-date-picker
							v-model="dateValue"
							type="date"
							placeholder="选择日期"
							@change="handleDateChange"
							format="YYYY-MM-DD"
							value-format="YYYY-MM-DD"
							style="width: 200px"
						>
						</el-date-picker>
					</div>
				</section>
					<section class="metric-grid">
						<article class="metric-card">
					<div class="metric-card__content">
						<p class="metric-card__label">总供应量</p>
						<div class="metric-card__value">
							<span>123,500</span>
							<small>kWh</small>
						</div>
						<p class="metric-card__context"></p>
						<div class="metric-card__delta">
							<span class="metric-card__delta-label"></span>
							<span class="metric-card__delta-value"></span>
						</div>
					</div>
					<div class="metric-card__visual">
						<div class="metric-card__icon-shell">
							<img :src="getMetricImage('totalSupply')" :alt="'总供应量'" class="metric-icon metric-icon--image" />
						</div>
					</div>
				</article>
						<article class="metric-card">
					<div class="metric-card__content">
						<p class="metric-card__label">总消耗量</p>
						<div class="metric-card__value">
							<span>117,500</span>
							<small>kWh</small>
						</div>
						<p class="metric-card__context"></p>
						<div class="metric-card__delta">
							<span class="metric-card__delta-label"></span>
							<span class="metric-card__delta-value"></span>
						</div>
					</div>
					<div class="metric-card__visual">
						<div class="metric-card__icon-shell">
							<img :src="getMetricImage('totalConsumption')" :alt="'总消耗量'" class="metric-icon metric-icon--image" />
						</div>
					</div>
				</article>
						<article class="metric-card">
					<div class="metric-card__content">
						<p class="metric-card__label">线路损耗</p>
						<div class="metric-card__value">
							<span>2,500</span>
							<small>kWh</small>
						</div>
						<p class="metric-card__context"></p>
						<div class="metric-card__delta">
							<span class="metric-card__delta-label"></span>
							<span class="metric-card__delta-value"></span>
						</div>
					</div>
					<div class="metric-card__visual">
						<div class="metric-card__icon-shell">
							<img :src="getMetricImage('lineLoss')" :alt="'线路损耗'" class="metric-icon metric-icon--image" />
						</div>
					</div>
				</article>
						<article class="metric-card">
					<div class="metric-card__content">
						<p class="metric-card__label">平衡状态</p>
						<div class="metric-card__value">
							<span>平衡</span>
						</div>
						<p class="metric-card__context"></p>
						<div class="metric-card__delta">
							<span class="metric-card__delta-label"></span>
							<span class="metric-card__delta-value"></span>
						</div>
					</div>
					<div class="metric-card__visual">
						<div class="metric-card__icon-shell">
							<img :src="getMetricImage('balanceState')" :alt="'平衡状态'" class="metric-icon metric-icon--image" />
						</div>
					</div>
				</article>
					</section>

					<!-- 能源流分析图 -->
					<el-row :gutter="20" class="charts-row">
						<el-col :span="24">
							<div class="chart-container">
											<h3 class="chart-title">能源流向分析图</h3>
											<v-chart ref="sankeyChartRef" :option="sankeyOption" class="chart" />
							</div>
						</el-col>
					</el-row>

					<!-- 流向指标计算 -->
					<div class="table-container">
						<h3 class="chart-title">流向指标计算</h3>
						<el-table :data="flowIndicatorData" border style="width: 100%" class="flow-indicator-table">
							<el-table-column prop="objectName" label="对象名称" width="200" />
							<el-table-column prop="energyType" label="节能类型" width="150" />
							<el-table-column prop="sourceAmount" label="输入电量" width="150" />
							<el-table-column prop="outputAmount" label="输出电量" width="150" />
							<el-table-column prop="lossAmount" label="损耗" width="120">
								<template #default="scope">
									<span class="loss-amount">{{ scope.row.lossAmount }}</span>
								</template>
							</el-table-column>
							<el-table-column prop="lossRate" label="损耗率" width="100">
								<template #default="scope">
									<span>{{ scope.row.lossRate }}</span>
								</template>
							</el-table-column>
							<el-table-column prop="analysis" label="分析" min-width="300">
								<template #default="scope">
									<span>{{ scope.row.analysis }}</span>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</div>
			</el-scrollbar>
		</div>
	</div>
</template>

<script setup lang="ts" name="flowAnalysis">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import * as echarts from 'echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { SankeyChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import { getChartColor, registerChart, removeChartInstance } from '/@/utils/echartsUtils';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useChangeColor } from '/@/utils/theme';
import { useThemeImage } from '/@/utils/themeImages';

// 引入主题配置和工具
const storesThemeConfig = useThemeConfig();
const { getDarkColor, getLightColor, hexToRgb } = useChangeColor();
const metricCardBackgroundImage = useThemeImage('metricCardBackground');

// 获取指标卡片图片（电力）
const totalSupplyImageElectricity = useThemeImage('electricitySupplyVolume');
const totalConsumptionImageElectricity = useThemeImage('electricityConsumption');
const lineLossImageElectricity = useThemeImage('electricityLineLoss');
const balanceStateImageElectricity = useThemeImage('electricityBalanceStatus');

// 获取指标卡片图片（供水）
const totalSupplyImageWater = useThemeImage('waterSupplyVolume');
const totalConsumptionImageWater = useThemeImage('waterConsumption');
const lineLossImageWater = useThemeImage('waterLineLoss');
const balanceStateImageWater = useThemeImage('waterBalanceStatus');

// 获取图片的函数
const getMetricImage = (key: string) => {
  const isElectricity = energyTab.value === 'electricity';
  
  const imageMap: Record<string, Record<string, string>> = {
    electricity: {
      totalSupply: totalSupplyImageElectricity.value,
      totalConsumption: totalConsumptionImageElectricity.value,
      lineLoss: lineLossImageElectricity.value,
      balanceState: balanceStateImageElectricity.value,
    },
    water: {
      totalSupply: totalSupplyImageWater.value,
      totalConsumption: totalConsumptionImageWater.value,
      lineLoss: lineLossImageWater.value,
      balanceState: balanceStateImageWater.value,
    },
  };
  
  return imageMap[isElectricity ? 'electricity' : 'water'][key];
};

// 计算属性
const currentTheme = computed(() => storesThemeConfig.themeConfig.currentTheme);
const primaryColor = computed(() => storesThemeConfig.themeConfig.primary || currentTheme.value?.color?.primary?.normal || '#1677FF');
const gradientStart = computed(() => currentTheme.value?.color?.gradient?.start || getLightColor(primaryColor.value, 0.12));
const gradientEnd = computed(() => currentTheme.value?.color?.gradient?.end || primaryColor.value);

// 主题变量
const dashboardVars = computed(() => {
	const primary = primaryColor.value;
	return {
		'--dashboard-primary': primary,
		'--dashboard-primary-rgb': Array.isArray(hexToRgb(primary)) ? hexToRgb(primary).join(',') : '0, 148, 255',
		'--dashboard-metric-card-image': `url("${metricCardBackgroundImage.value}")`,
		'--dashboard-gradient-start': gradientStart.value,
		'--dashboard-gradient-end': gradientEnd.value,
	};
});

// 按需引入 ECharts 模块
use([CanvasRenderer, SankeyChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent]);

// 图表引用
const sankeyChartRef = ref();

// 能源类型选项
const energyOptions = [
	{ label: '电力', value: 'electricity' },
	{ label: '供水', value: 'water' },
];

// 能源损耗标签页
const energyTab = ref('electricity');

// 日期选择值
const dateValue = ref<string>('');

// 处理日期变化
const handleDateChange = (value: string) => {
	console.log('日期变化:', value);
	// 这里可以添加根据日期获取数据的逻辑
};

// 组件挂载后注册图表实例
onMounted(() => {
	if (sankeyChartRef.value) registerChart(sankeyChartRef.value.chart);
});

onUnmounted(() => {
	if (sankeyChartRef.value) removeChartInstance(sankeyChartRef.value.chart);
});

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
				{ name: '能源输入' ,itemStyle: { color: '#1677FF' }  },
				{ name: 'A区配电' ,itemStyle: { color: '#46b538' }  },
				{ name: 'B区配电' ,itemStyle: { color: '#46b538' }  },
				{ name: 'C区配电' ,itemStyle: { color: '#46b538' }  },
				{ name: 'A区照明' ,itemStyle: { color: '#9456ff' }  },
				{ name: 'A区空调' ,itemStyle: { color: '#9456ff' }  },
				{ name: 'A区动力' ,itemStyle: { color: '#9456ff' }  },
				{ name: 'B区照明' ,itemStyle: { color: '#ff5694' }  },
				{ name: 'B区空调' ,itemStyle: { color: '#ff5694' }  },
				{ name: 'B区动力' ,itemStyle: { color: '#ff5694' }  },
				{ name: 'C区照明' ,itemStyle: { color: '#ff9456' }  },
				{ name: 'C区空调' ,itemStyle: { color: '#ff9456' }  },
				{ name: 'C区动力' ,itemStyle: { color: '#ff9456' }  },
			],
			links: [
				{ source: '能源输入', target: 'A区配电', value: 40000 },
				{ source: '能源输入', target: 'B区配电', value: 35000 },
				{ source: '能源输入', target: 'C区配电', value: 30000 },
				{ source: 'A区配电', target: 'A区照明', value: 15000 },
				{ source: 'A区配电', target: 'A区空调', value: 18000 },
				{ source: 'A区配电', target: 'A区动力', value: 6000 },
				{ source: 'B区配电', target: 'B区照明', value: 12000 },
				{ source: 'B区配电', target: 'B区空调', value: 16000 },
				{ source: 'B区配电', target: 'B区动力', value: 5000 },
				{ source: 'C区配电', target: 'C区照明', value: 10000 },
				{ source: 'C区配电', target: 'C区空调', value: 14000 },
				{ source: 'C区配电', target: 'C区动力', value: 4000 },
			],
			lineStyle: {
				color: 'gradient',
				curveness: 0.5,
			},
		},
	],
});

// 流向指标计算数据
const flowIndicatorData = ref([
	{
		objectName: '总输入',
		energyType: '电力输入',
		sourceAmount: '123,500 kWh',
		outputAmount: '117,500 kWh',
		lossAmount: '2,500 kWh',
		lossRate: '2.0%',
		analysis: '输入正常，损耗在合理范围内',
	},
	{
		objectName: 'A区配电',
		energyType: '配电系统',
		sourceAmount: '40,000 kWh',
		outputAmount: '39,000 kWh',
		lossAmount: '1,000 kWh',
		lossRate: '2.5%',
		analysis: '损耗率略高，建议检查线路',
	},
	{
		objectName: 'B区配电',
		energyType: '配电系统',
		sourceAmount: '35,000 kWh',
		outputAmount: '34,250 kWh',
		lossAmount: '750 kWh',
		lossRate: '2.1%',
		analysis: '损耗在合理范围内',
	},
	{
		objectName: 'C区配电',
		energyType: '配电系统',
		sourceAmount: '30,000 kWh',
		outputAmount: '29,500 kWh',
		lossAmount: '500 kWh',
		lossRate: '1.7%',
		analysis: '损耗控制良好',
	},
	{
		objectName: 'A区照明',
		energyType: '照明系统',
		sourceAmount: '15,000 kWh',
		outputAmount: '14,850 kWh',
		lossAmount: '150 kWh',
		lossRate: '1.0%',
		analysis: '照明系统运行正常',
	},
	{
		objectName: 'A区空调',
		energyType: '空调系统',
		sourceAmount: '18,000 kWh',
		outputAmount: '17,640 kWh',
		lossAmount: '360 kWh',
		lossRate: '2.0%',
		analysis: '空调系统运行正常',
	},
	{
		objectName: 'A区动力',
		energyType: '动力设备',
		sourceAmount: '6,000 kWh',
		outputAmount: '5,910 kWh',
		lossAmount: '90 kWh',
		lossRate: '1.5%',
		analysis: '动力设备运行正常',
	},
]);
</script>

<style scoped lang="scss">
.layout-padding-auto.layout-padding-view {
	padding: 0 !important;
}

.flow-analysis-scrollbar {
	height: 100%;
	padding: 0;

	:deep(.el-scrollbar__wrap) {
		overflow-x: hidden;
	}
}

.flow-analysis-dashboard {
	min-height: 100%;
	padding: 8px 0 4px;
	display: flex;
	flex-direction: column;
	gap: 20px;
	background: transparent;
}

.metric-grid {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	width: 100%;
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
	font-size: 12px;
	color: var(--theme-text-dataAssist);
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

.metric-card__delta :deep(.el-icon) {
	font-size: 12px;
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
	min-height: 400px;
}

/* 能源损耗标签页样式 */
.energy-tabs {
	margin-bottom: 10px;
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

/* 表格样式 */
.flow-indicator-table {
	margin-bottom: 16px;
}

.loss-amount {
	font-weight: bold;
	color: #303133;
}

/* Home toolbar styles */
.home-toolbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	flex-wrap: wrap;
}

.home-toolbar__tabs {
	display: inline-flex;
	flex-wrap: wrap;
	gap: 14px;
}

.home-toolbar__tab {
	width: 108px;
	min-width: 108px;
	height: 36px;
	padding: 0;
	border: 1px solid rgba(var(--dashboard-primary-rgb), 0.14);
	border-radius: 12px;
	background: #ffffff;
	color: var(--theme-text-primaryTitle);
	font-size: 16px;
	font-weight: 700;
	cursor: pointer;
	transition:
		transform 0.2s ease,
		box-shadow 0.2s ease,
		border-color 0.2s ease,
		color 0.2s ease;
}

.home-toolbar__tab:hover {
	transform: translateY(-1px);
	border-color: rgba(var(--dashboard-primary-rgb), 0.24);
	box-shadow: 0 10px 24px rgba(var(--dashboard-primary-rgb), 0.08);
}

.home-toolbar__tab.is-active {
	border-color: transparent;
	background: linear-gradient(135deg, var(--dashboard-gradient-start), var(--dashboard-gradient-end));
	color: #ffffff;
	box-shadow: none;
}

.layout-padding-auto.layout-padding-view {
	padding: 0 !important;
}
</style>