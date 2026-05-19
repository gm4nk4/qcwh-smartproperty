<template>
  <div class="chart-container">
    <div v-if="hasHeader" class="chart-header">
      <slot name="header">
        <h3 class="chart-title" v-if="title">{{ title }}</h3>
      </slot>
    </div>
    <v-chart ref="horizontalBarChartRef" :option="chartOption" class="chart" autoresize />
  </div>
</template>

<script setup lang="ts" name="HorizontalBarChart">
import { ref, computed, onMounted, onUnmounted, useSlots } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import { getChartColor, getGradientChartColor, registerChart, removeChartInstance } from '/@/utils/echartsUtils';
import * as echarts from 'echarts';

// 按需引入 ECharts 模块
use([CanvasRenderer, BarChart, TitleComponent, TooltipComponent, GridComponent]);

// 定义组件属性
interface Props {
  // 图表标题
  title?: string;
  // Y轴数据（分类）
  yAxisData: string[];
  // 系列数据
  data: number[];
  // 系列名称
  seriesName?: string;
  // X轴名称
  xAxisName?: string;
  // 标签与tooltip数值保留小数位（不传则按默认显示）
  valueDigits?: number;
}

const props = withDefaults(defineProps<Props>(), {
  title: '分区损耗排名',
  seriesName: '',
  xAxisName: '',
});

const slots = useSlots();
const hasHeader = computed(() => Boolean(slots.header) || Boolean(props.title));
const hasFixedDigits = computed(() => Number.isInteger(props.valueDigits) && Number(props.valueDigits) >= 0);
const gridRight = computed(() => (props.xAxisName ? 56 : '4%'));

const formatValueText = (value: unknown) => {
  const numericValue = Number(Array.isArray(value) ? value[1] : value);
  if (!Number.isFinite(numericValue)) return `${value ?? ''}`;
  if (hasFixedDigits.value) return numericValue.toFixed(props.valueDigits);
  return `${numericValue}`;
};

// 图表引用
const horizontalBarChartRef = ref();

// 水平柱状图配置
const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    ...(hasFixedDigits.value
      ? {
          formatter: (params: any) => {
            const point = Array.isArray(params) ? params[0] : params;
            if (!point) return '';
            const axisLabel = point.axisValueLabel ?? point.name ?? '';
            const marker = point.marker ?? '';
            const seriesLabel = point.seriesName ? `${point.seriesName}：` : '';
            const valueText = formatValueText(point.value);
            const unitText = props.xAxisName ? ` ${props.xAxisName}` : '';
            return `${axisLabel}<br/>${marker}${seriesLabel}${valueText}${unitText}`;
          },
        }
      : {}),
  },
  grid: {
    left: '3%',
    right: gridRight.value,
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'value',
    name: props.xAxisName,
    splitLine: {
      lineStyle: {
        type: 'dashed',
      },
    },
  },
  yAxis: {
    type: 'category',
    data: props.yAxisData,
  },
  series: [
    {
      name: props.seriesName,
      type: 'bar',
      data: props.data,
      barWidth: 28,
      itemStyle: {
        color: (params: any) => {
          return new echarts.graphic.LinearGradient(1, 0, 0, 0, [
            { offset: 0, color: getChartColor(0) },
            { offset: 1, color: getGradientChartColor(1)},
          ]);
        },
        borderRadius: [0, 15, 15, 0],
        borderColor: {
          type: 'linear',
          x: 1,
          y: 0,
          x2: 0,
          y2: 0,
          colorStops: [{
            offset: 0, color: getChartColor(0) + '50' // 0% 处的颜色
          }, {
            offset: 1, color: getGradientChartColor(1) + '50' // 100% 处的颜色
          }],
        },
        borderWidth: 12, // 设置边框宽度
      },
      label: {
					show: true,
					position: 'right',
					color: '#5A6472',
					fontWeight: 600,
					formatter: ({ value }: { value: number }) => formatValueText(value),
				},
    },
  ],
}));

// 组件挂载后注册图表实例
onMounted(() => {
  if (horizontalBarChartRef.value) registerChart(horizontalBarChartRef.value.chart);
});

onUnmounted(() => {
  if (horizontalBarChartRef.value) removeChartInstance(horizontalBarChartRef.value.chart);
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
  display: flex;
  flex-direction: column;
}

.chart-header {
  margin-bottom: 20px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #303133;
}

.chart {
  flex: 1;
  width: 100%;
  min-height: 300px;
}
</style>
