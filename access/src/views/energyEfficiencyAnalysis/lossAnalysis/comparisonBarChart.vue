<template>
  <div class="chart-container">
    <div v-if="props.title" class="chart-title" :class="{ 'chart-title--with-prefix': props.titlePrefixBar }">
      <span v-if="props.titlePrefixBar" class="chart-title__bar"></span>
      <h3>{{ props.title }}</h3>
    </div>
    <v-chart ref="comparisonChartRef" :option="comparisonOption" class="chart" />
  </div>
</template>

<script setup lang="ts" name="comparisonBarChart">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import * as echarts from 'echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import { getChartColor, getGradientChartColor, registerChart, removeChartInstance } from '/@/utils/echartsUtils';
import { useThemeConfig } from '/@/stores/themeConfig';

// 引入主题配置
const storesThemeConfig = useThemeConfig();
const primaryColor = computed(() => storesThemeConfig.themeConfig.primary || '#1677FF');

// 按需引入 ECharts 模块
use([CanvasRenderer, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent]);

// 图表引用
const comparisonChartRef = ref();

// 接收父组件传递的数据
const props = withDefaults(defineProps<{
  // 去年损耗率数据
  lastYearData: number[];
  // 今年损耗率数据
  currentYearData: number[];
  // X轴数据
  xAxisData: string[];
  // 图表标题
  title?: string;
  // 标题前是否展示装饰竖条
  titlePrefixBar?: boolean;
  // Y轴名称
  yAxisName?: string;
  // 图例名称（左）
  lastSeriesName?: string;
  // 图例名称（右）
  currentSeriesName?: string;
  // 展示模式：双系列对比 / 单系列
  mode?: 'double' | 'single';
  // 单系列图例名称
  singleSeriesName?: string;
  // 双柱模式下左柱渐变色
  lastSeriesColors?: [string, string];
  // 双柱模式下右柱渐变色
  currentSeriesColors?: [string, string];
  // 双柱模式下左柱描边渐变色
  lastSeriesBorderColors?: [string, string];
  // 双柱模式下右柱描边渐变色
  currentSeriesBorderColors?: [string, string];
  // 双柱模式下柱宽
  doubleBarWidth?: number;
  // 双柱模式下柱间距
  doubleBarGap?: string | number;
  // 数值小数位
  decimals?: number;
}>(), {
  title: '损耗率对比（历史）',
  yAxisName: '损耗率(%)',
  lastSeriesName: '去年',
  currentSeriesName: '今年',
  mode: 'double',
  singleSeriesName: '电流值',
  titlePrefixBar: false,
  doubleBarWidth: 28,
  doubleBarGap: 1,
  decimals: undefined,
});

const defaultLastSeriesColors: [string, string] = [getChartColor(5), getGradientChartColor(5)];
const defaultCurrentSeriesColors: [string, string] = [getChartColor(1), getGradientChartColor(1)];

const resolveSeriesColors = (colors: [string, string] | undefined, fallback: [string, string]) => colors || fallback;

const resolveBorderColors = (colors: [string, string] | undefined, fallback: [string, string]) =>
  colors || [`${fallback[0]}50`, `${fallback[1]}50`];

const createDoubleBarStyle = (colors: [string, string], borderColors: [string, string]) => ({
  color: () =>
    new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: colors[0] },
      { offset: 1, color: colors[1] },
    ]),
  borderRadius: [15, 15, 0, 0],
  borderColor: {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      { offset: 0, color: borderColors[0] },
      { offset: 1, color: borderColors[1] },
    ],
    globalCoord: false
  },
  borderWidth: 12,
});

const doubleModeLastColors = computed(() => resolveSeriesColors(props.lastSeriesColors, defaultLastSeriesColors));
const doubleModeCurrentColors = computed(() => resolveSeriesColors(props.currentSeriesColors, defaultCurrentSeriesColors));

// 损耗率对比柱状图配置
const comparisonOption = computed(() => ({
  color: props.mode === 'single' ? [getChartColor(0)] : [doubleModeLastColors.value[0], doubleModeCurrentColors.value[0]],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    ...(props.decimals !== undefined
      ? {
          formatter: (params: Array<{ axisValue: string; marker: string; seriesName: string; data: number }>) => {
            if (!Array.isArray(params) || !params.length) return '';
            const lines = params.map((item) => `${item.marker}${item.seriesName}: ${Number(item.data ?? 0).toFixed(props.decimals)}`);
            return [params[0].axisValue, ...lines].join('<br/>');
          },
        }
      : {}),
  },
  legend: {
    data: props.mode === 'single' ? [props.singleSeriesName] : [props.lastSeriesName, props.currentSeriesName],
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
    data: props.xAxisData,
  },
  yAxis: {
    type: 'value',
    name: props.yAxisName,
    splitLine: {
      lineStyle: {
        type: 'dashed',
      },
    },
    ...(props.decimals !== undefined
      ? {
          axisLabel: {
            formatter: (value: number) => Number(value ?? 0).toFixed(props.decimals),
          },
        }
      : {}),
  },
  series: [
    ...(props.mode === 'single'
      ? [
          {
            name: props.singleSeriesName,
            type: 'bar',
            data: props.currentYearData,
            barWidth: 38,
            itemStyle: {
              color: () =>
                new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: getChartColor(0) },
                  { offset: 1, color: getGradientChartColor(0) },
                ]),
              borderRadius: [15, 15, 0, 0],
              borderColor: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: getChartColor(0) + '50',
                  },
                  {
                    offset: 1,
                    color: getGradientChartColor(0) + '50',
                  },
                ],
                globalCoord: false,
              },
              borderWidth: 12,
            },
          },
        ]
      : [
          {
            name: props.lastSeriesName,
            type: 'bar',
            data: props.lastYearData,
            barWidth: props.doubleBarWidth,
            barGap: props.doubleBarGap,
            itemStyle: createDoubleBarStyle(
              doubleModeLastColors.value,
              resolveBorderColors(props.lastSeriesBorderColors, doubleModeLastColors.value)
            ),
          },
          {
            name: props.currentSeriesName,
            type: 'bar',
            data: props.currentYearData,
            barWidth: props.doubleBarWidth,
            itemStyle: createDoubleBarStyle(
              doubleModeCurrentColors.value,
              resolveBorderColors(props.currentSeriesBorderColors, doubleModeCurrentColors.value)
            ),
          },
        ]),
  ],
}));

// 组件挂载后注册图表实例
onMounted(() => {
  if (comparisonChartRef.value) registerChart(comparisonChartRef.value.chart);
});

onUnmounted(() => {
  if (comparisonChartRef.value) removeChartInstance(comparisonChartRef.value.chart);
});
</script>

<style scoped>
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
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 12px 0;
}

.chart-title__bar {
  width: 4px;
  height: 20px;
  border-radius: 999px;
  background: var(--dashboard-primary);
  box-shadow: 0 4px 10px rgba(var(--dashboard-primary-rgb), 0.22);
}

.chart-title h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.chart-title--with-prefix h3 {
  font-size: 17px;
  font-weight: 700;
  color: var(--theme-text-system);
}

.chart {
  width: 100%;
  height: calc(100% - 40px);
  min-height: 300px;
}
</style>
