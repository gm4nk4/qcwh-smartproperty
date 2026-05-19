<template>
  <div class="chart-container">
    <h3 class="chart-title" v-if="title">{{ title }}</h3>
    <v-chart ref="lineChartRef" :option="chartOption" class="chart" autoresize />
  </div>
</template>

<script setup lang="ts" name="LineChart">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart as EChartsLineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import { getChartColor, registerChart, removeChartInstance } from '/@/utils/echartsUtils';

// 按需引入 ECharts 模块
use([CanvasRenderer, EChartsLineChart, TitleComponent, TooltipComponent, GridComponent]);

// 定义组件属性
interface Props {
  // 图表标题
  title?: string;
  // X轴数据（分类）
  xAxisData: string[];
  // 系列数据
  data: number[];
  // 系列名称
  seriesName?: string;
  // Y轴名称
  yAxisName?: string;
  // Y轴最小值
  yAxisMin?: number;
  // Y轴最大值
  yAxisMax?: number;
}

const props = withDefaults(defineProps<Props>(), {
  title: '损耗趋势分析',
  seriesName: '损耗率',
  yAxisName: '损耗率(%)',
  yAxisMin: 5.0,
  yAxisMax: 7.0,
});

// 图表引用
const lineChartRef = ref();

// 折线图配置
const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderWidth: 0,
    padding: [10, 14],
    textStyle: {
      color: '#ffffff',
    },
  },
  grid: {
    left: 16,
    right: 16,
    top: 28,
    bottom: 18,
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: props.xAxisData,
    axisLine: {
      lineStyle: {
        color: 'rgba(22, 119, 255, 0.18)',
      },
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: '#7B8794',
      margin: 12,
    },
  },
  yAxis: {
    type: 'value',
    name: props.yAxisName,
    min: props.yAxisMin,
    max: props.yAxisMax,
    splitLine: {
      lineStyle: {
        color: 'rgba(206, 214, 229, 0.72)',
        type: 'dashed',
      },
    },
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: '#7B8794',
    },
  },
  series: [
    {
      name: props.seriesName,
      type: 'line',
      data: props.data,
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: {
        color: getChartColor(0),
        width: 4,
      },
      itemStyle: {
        color: '#ffffff',
        borderColor: getChartColor(0),
        borderWidth: 2,
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: getChartColor(0) + '10',
          }, {
            offset: 1,
            color: getChartColor(0) + '00',
          }],
        },
      },
    },
  ],
}));

// 组件挂载后注册图表实例
onMounted(() => {
  if (lineChartRef.value) registerChart(lineChartRef.value.chart);
});

onUnmounted(() => {
  if (lineChartRef.value) removeChartInstance(lineChartRef.value.chart);
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
</style>