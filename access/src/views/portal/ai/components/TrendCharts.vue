<template>
	<div class="trend-charts">
		<div class="charts-row">
			<div class="chart-card">
				<div class="chart-header">
					<div class="header-left">
						<el-icon class="section-icon"><TrendChartsIcon /></el-icon>
						<h3 class="section-title">近7日AI调用趋势</h3>
					</div>
					<div class="header-meta">日均 3,124</div>
					<div class="header-actions">
						<el-button link type="info" size="small">
							<el-icon><Grid /></el-icon>
						</el-button>
						<el-button link type="info" size="small">
							<el-icon><FullScreen /></el-icon>
						</el-button>
					</div>
				</div>
				<div class="chart-container">
					<v-chart ref="weeklyChartRef" :option="weeklyOption" class="chart" autoresize />
				</div>
			</div>

			<div class="chart-card">
				<div class="chart-header">
					<div class="header-left">
						<h3 class="section-title">分类分布</h3>
					</div>
					<div class="header-actions">
						<el-button link type="info" size="small">
							<el-icon><Grid /></el-icon>
						</el-button>
						<el-button link type="info" size="small">
							<el-icon><FullScreen /></el-icon>
						</el-button>
					</div>
				</div>
				<div class="chart-container">
					<v-chart ref="pieChartRef" :option="pieOption" class="chart" autoresize />
				</div>
			</div>
		</div>

		<div class="charts-row">
			<div class="chart-card half">
				<div class="chart-header">
					<div class="header-left">
						<h3 class="section-title">平台AI性能趋势（近6月）</h3>
					</div>
				</div>
				<div class="chart-container">
					<v-chart ref="performanceChartRef" :option="performanceOption" class="chart" autoresize />
				</div>
			</div>

			<div class="chart-card half">
				<div class="chart-header">
					<div class="header-left">
						<h3 class="section-title">调用量增长趋势（近6月）</h3>
					</div>
				</div>
				<div class="chart-container">
					<v-chart ref="growthChartRef" :option="growthOption" class="chart" autoresize />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="TrendCharts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, BarChart, PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import { TrendCharts as TrendChartsIcon, Grid, FullScreen } from '@element-plus/icons-vue';
import { getChartColor, registerChart, removeChartInstance } from '/@/utils/echartsUtils';
import {
	mockWeeklyTrendData,
	mockCategoryDistribution,
	mockPerformanceTrend,
	mockCallGrowthTrend
} from '../mock';

use([CanvasRenderer, LineChart, BarChart, PieChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent]);

const weeklyChartRef = ref();
const pieChartRef = ref();
const performanceChartRef = ref();
const growthChartRef = ref();

const weeklyOption = computed(() => ({
	tooltip: {
		trigger: 'axis'
	},
	grid: {
		left: '3%',
		right: '4%',
		bottom: '3%',
		containLabel: true
	},
	xAxis: {
		type: 'category',
		boundaryGap: false,
		data: mockWeeklyTrendData.map(item => item.date),
		axisLine: { show: false },
		axisTick: { show: false },
		axisLabel: { color: '#7B8794' }
	},
	yAxis: {
		type: 'value',
		axisLine: { show: false },
		splitLine: { lineStyle: { color: '#e5e7eb' } },
		axisLabel: { color: '#7B8794' }
	},
	series: [
		{
			name: '调用量',
			type: 'line',
			smooth: true,
			areaStyle: {
				color: {
					type: 'linear',
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [
						{ offset: 0, color: getChartColor(0) + '4d' },
						{ offset: 1, color: getChartColor(0) + '00' }
					]
				}
			},
			lineStyle: { color: getChartColor(0), width: 3 },
			itemStyle: { color: getChartColor(0) },
			data: mockWeeklyTrendData.map(item => item.value)
		}
	]
}));

const pieOption = computed(() => ({
	tooltip: {
		trigger: 'item',
		formatter: '{b}: {c} ({d}%)'
	},
	legend: {
		orient: 'vertical',
		left: '55%',
		top: 'center',
		textStyle: { color: '#7B8794' }
	},
	series: [
		{
			name: '分类',
			type: 'pie',
			radius: ['45%', '70%'],
			center: ['30%', '50%'],
			data: mockCategoryDistribution.map((item, index) => ({
				name: item.name,
				value: item.value,
				itemStyle: { color: item.color || getChartColor(index) }
			})),
			label: {
				show: false
			},
			emphasis: {
				itemStyle: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			}
		}
	]
}));

const performanceOption = computed(() => ({
	tooltip: {
		trigger: 'axis'
	},
	grid: {
		left: '3%',
		right: '4%',
		bottom: '3%',
		containLabel: true
	},
	xAxis: {
		type: 'category',
		boundaryGap: false,
		data: mockPerformanceTrend.map(item => item.date),
		axisLine: { show: false },
		axisTick: { show: false },
		axisLabel: { color: '#7B8794' }
	},
	yAxis: {
		type: 'value',
		axisLine: { show: false },
		splitLine: { lineStyle: { color: '#e5e7eb' } },
		axisLabel: { color: '#7B8794' }
	},
	series: [
		{
			name: '性能',
			type: 'line',
			smooth: true,
			areaStyle: {
				color: {
					type: 'linear',
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [
						{ offset: 0, color: getChartColor(1) + '4d' },
						{ offset: 1, color: getChartColor(1) + '00' }
					]
				}
			},
			lineStyle: { color: getChartColor(1), width: 2 },
			itemStyle: { color: getChartColor(1) },
			data: mockPerformanceTrend.map(item => item.value)
		}
	]
}));

const growthOption = computed(() => ({
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'shadow'
		}
	},
	grid: {
		left: '3%',
		right: '4%',
		bottom: '3%',
		containLabel: true
	},
	xAxis: {
		type: 'category',
		data: mockCallGrowthTrend.map(item => item.date),
		axisLine: { show: false },
		axisTick: { show: false },
		axisLabel: { color: '#7B8794' }
	},
	yAxis: {
		type: 'value',
		axisLine: { show: false },
		splitLine: { lineStyle: { color: '#e5e7eb' } },
		axisLabel: { color: '#7B8794' }
	},
	series: [
		{
			name: '调用量',
			type: 'bar',
			barWidth: '50%',
			itemStyle: {
				color: {
					type: 'linear',
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [
						{ offset: 0, color: getChartColor(0) },
						{ offset: 1, color: getChartColor(0) + '99' }
					]
				},
				borderRadius: [4, 4, 0, 0]
			},
			data: mockCallGrowthTrend.map(item => item.value)
		}
	]
}));

onMounted(() => {
	if (weeklyChartRef.value?.chart) registerChart(weeklyChartRef.value.chart);
	if (pieChartRef.value?.chart) registerChart(pieChartRef.value.chart);
	if (performanceChartRef.value?.chart) registerChart(performanceChartRef.value.chart);
	if (growthChartRef.value?.chart) registerChart(growthChartRef.value.chart);
});

onUnmounted(() => {
	if (weeklyChartRef.value?.chart) removeChartInstance(weeklyChartRef.value.chart);
	if (pieChartRef.value?.chart) removeChartInstance(pieChartRef.value.chart);
	if (performanceChartRef.value?.chart) removeChartInstance(performanceChartRef.value.chart);
	if (growthChartRef.value?.chart) removeChartInstance(growthChartRef.value.chart);
});
</script>

<style scoped lang="scss">
.trend-charts {
	display: flex;
	flex-direction: column;
	gap: 20px;
	margin-bottom: 20px;
}

.charts-row {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20px;
}

.chart-card {
	background: #fff;
	border-radius: 12px;
	padding: 20px;
	display: flex;
	flex-direction: column;
	height: 320px;
	box-sizing: border-box;
}

.chart-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
}

.header-left {
	display: flex;
	align-items: center;
	gap: 8px;
}

.section-icon {
	color: #1677ff;
	font-size: 20px;
}

.section-title {
	font-size: 16px;
	font-weight: 600;
	color: #303133;
	margin: 0;
}

.header-meta {
	font-size: 14px;
	color: #6b7280;
}

.header-actions {
	display: flex;
	gap: 4px;
}

.chart-container {
	flex: 1;
	min-height: 0;
}

.chart {
	width: 100%;
	height: 100%;
	min-height: 200px;
}
</style>
