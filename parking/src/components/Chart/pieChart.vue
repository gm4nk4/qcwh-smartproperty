<template>
	<div ref="chartContainerRef" class="chart-shell">
		<v-chart ref="pieChartRef" :option="pieOption" class="chart" autoresize />
	</div>
</template>

<script setup lang="ts" name="PieChart">
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from 'vue';
import { useElementSize } from '@vueuse/core';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GraphicComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import { getChartColor, registerChart, removeChartInstance } from '/@/utils/echartsUtils';

// 按需引入 ECharts 模块
use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent, GraphicComponent]);

// 定义组件属性
interface PieChartData {
	value: number;
	name: string;
	itemStyle?: any;
}

interface PieRingLayout {
	cx: number;
	cy: number;
	r0: number;
	r: number;
}

interface Props {
	data: PieChartData[];
	title?: string;
	radius?: [string, string];
	center?: [string, string];
	legendData?: string[];
	unit?: string;
	legendPosition?: 'right' | 'bottom';
	stillShowZeroSum?: boolean;
	valueDigits?: number;
}

const props = withDefaults(defineProps<Props>(), {
	title: '损耗类型分布',
	radius: () => ['75%', '88%'],
	center: () => ['35%', '48%'],
	legendData: () => ['线路损耗', '变压器损耗', '管网损耗', '转换损耗', '末端损耗'],
	unit: 'kWh',
	legendPosition: 'right',
	stillShowZeroSum: true,
	valueDigits: undefined,
});

const TICK_GAP = 27;
const TICK_LENGTH = 8;
const TICK_LINE_WIDTH = 2;
const TICK_COUNT = 60;

// 图表引用
const pieChartRef = ref();
const chartContainerRef = ref<HTMLElement>();
const { width: containerWidth, height: containerHeight } = useElementSize(chartContainerRef);
const chartWidth = ref(0);
const chartHeight = ref(0);
const pieRingLayout = ref<PieRingLayout | null>(null);

const isSameLayout = (nextLayout: PieRingLayout, currentLayout: PieRingLayout | null) => {
	if (!currentLayout) return false;
	return (
		Math.abs(nextLayout.cx - currentLayout.cx) < 0.5 &&
		Math.abs(nextLayout.cy - currentLayout.cy) < 0.5 &&
		Math.abs(nextLayout.r0 - currentLayout.r0) < 0.5 &&
		Math.abs(nextLayout.r - currentLayout.r) < 0.5
	);
};

const syncChartGeometry = () => {
	const chart = pieChartRef.value?.chart;
	if (!chart) return;

	chartWidth.value = chart.getWidth();
	chartHeight.value = chart.getHeight();

	const model = chart.getModel?.();
	const seriesModel = model?.getSeriesByIndex?.(0);
	const seriesData = seriesModel?.getData?.();
	if (!seriesData?.count?.()) return;

	const firstLayout = seriesData.getItemLayout(0);
	if (!firstLayout) return;

	const nextLayout = {
		cx: firstLayout.cx,
		cy: firstLayout.cy,
		r0: firstLayout.r0,
		r: firstLayout.r,
	};

	if ([nextLayout.cx, nextLayout.cy, nextLayout.r0, nextLayout.r].some((value) => !Number.isFinite(value))) return;
	if (isSameLayout(nextLayout, pieRingLayout.value)) return;
	pieRingLayout.value = nextLayout;
};

const resolveCoord = (value: string, total: number) => {
	if (value.endsWith('%')) return (parseFloat(value) / 100) * total;
	return parseFloat(value);
};

const resolveRadius = (value: string, baseRadius: number) => {
	if (value.endsWith('%')) return (parseFloat(value) / 100) * baseRadius;
	return parseFloat(value);
};

const formatTooltipValue = (value: number | string) => {
	if (props.valueDigits === undefined) return String(value);
	const parsed = Number(value);
	if (!Number.isFinite(parsed)) return String(value);
	return new Intl.NumberFormat('zh-CN', {
		maximumFractionDigits: props.valueDigits,
		minimumFractionDigits: props.valueDigits,
	}).format(parsed);
};

// 计算饼图配置
const pieOption = computed(() => {
	// 为每个数据项添加itemStyle
	const processedData = props.data.map((item, index) => {
		// 获取动态颜色
		const color = getChartColor(index);

		return {
			...item,
			itemStyle: {
				// 如果数据项已有itemStyle，则合并，否则使用默认配置
				...item.itemStyle,
				color: item.itemStyle?.color || color,
				shadowBlur: item.itemStyle?.shadowBlur || 8,
				shadowColor: item.itemStyle?.shadowColor || color + '20',
				shadowOffsetY: item.itemStyle?.shadowOffsetY || 22,
			},
		};
	});

	const width = chartWidth.value;
	const height = chartHeight.value;
	const hasSize = width > 0 && height > 0;
	const centerX = pieRingLayout.value?.cx ?? (hasSize ? resolveCoord(props.center[0], width) : 0);
	const centerY = pieRingLayout.value?.cy ?? (hasSize ? resolveCoord(props.center[1], height) : 0);
	const baseRadius = hasSize ? Math.min(width, height) / 2 : 0;
	const innerPieRadius = pieRingLayout.value?.r0 ?? (hasSize ? resolveRadius(props.radius[0], baseRadius) : 112);
	const tickOuterRadius = Math.max(innerPieRadius - TICK_GAP, 0);
	const tickRadius = Math.max(tickOuterRadius - TICK_LENGTH, 0);
	const tickGraphics = hasSize
		? Array.from({ length: TICK_COUNT }, (_, index) => {
				const angle = (index / TICK_COUNT) * Math.PI * 2;
				const cos = Math.cos(angle);
				const sin = Math.sin(angle);

				return {
					type: 'line',
					silent: true,
					shape: {
						x1: centerX + cos * tickRadius,
						y1: centerY + sin * tickRadius,
						x2: centerX + cos * (tickRadius + TICK_LENGTH),
						y2: centerY + sin * (tickRadius + TICK_LENGTH),
					},
					style: {
						stroke: '#f0f0f0',
						lineWidth: TICK_LINE_WIDTH,
					},
				};
			})
		: [];

	return {
		tooltip: {
			trigger: 'item',
			formatter: (params: { name: string; value: number | string }) => `${params.name}<br/>${formatTooltipValue(params.value)}${props.unit}`,
		},
		legend: {
			orient: props.legendPosition === 'bottom' ? 'horizontal' : 'vertical',
			right: props.legendPosition === 'bottom' ? undefined : 10,
			left: props.legendPosition === 'bottom' ? 'center' : undefined,
			top: props.legendPosition === 'bottom' ? undefined : 'center',
			bottom: props.legendPosition === 'bottom' ? 0 : undefined,
			data: props.legendData,
			formatter: '{name}',
			icon: 'rect',
			itemWidth: 10,
			itemHeight: 10,
			itemGap: props.legendPosition === 'bottom' ? 24 : 12,
			textStyle: {
				fontSize: 12,
			},
		},
		series: [
			// 核心细环
			{
				name: props.title,
				type: 'pie',
				radius: props.radius,
				center: props.center,
				avoidLabelOverlap: true,
				stillShowZeroSum: props.stillShowZeroSum,
				data: processedData,
				label: { show: false },
				labelLine: { show: true },
				emphasis: {
					itemStyle: {
						// hover时增强阴影效果
						shadowBlur: 10,
						shadowOffsetY: 30,
					},
				},
			},
			// 中心文字
			{
				name: '中心文字',
				type: 'pie',
				radius: ['30%', '48%'],
				center: props.center,
				data: [{ value: 1, name: props.title }],
				label: {
					show: true,
					position: 'center',
					formatter: '{b}',
					fontSize: 20,
					color: '#333',
				},
				labelLine: { show: false },
				itemStyle: { color: '#fff', borderWidth: 0 },
				silent: true,
			},
		],
		graphic: tickGraphics,
	};
});

watch(
	[containerWidth, containerHeight],
	() => {
		nextTick(() => {
			syncChartGeometry();
		});
	},
	{ flush: 'post' }
);

// 组件挂载后注册图表实例
onMounted(() => {
	const chart = pieChartRef.value?.chart;
	if (!chart) return;
	registerChart(chart);
	chart.on('finished', syncChartGeometry);
	nextTick(() => {
		syncChartGeometry();
	});
});

// 组件卸载前移除图表实例
onUnmounted(() => {
	const chart = pieChartRef.value?.chart;
	if (!chart) return;
	chart.off('finished', syncChartGeometry);
	removeChartInstance(chart);
});
</script>

<style scoped>
.chart-shell {
	width: 100%;
	min-height: 300px;
	height: 100%;
}

.chart {
	width: 100%;
	height: 100%;
	min-height: 300px;
}
</style>
