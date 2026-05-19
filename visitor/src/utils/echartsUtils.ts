import { useThemeConfig } from '/@/stores/themeConfig';
import { watch } from 'vue';

// 获取主题颜色的公共方法
export const getChartColor = (index: number) => {
	const storesThemeConfig = useThemeConfig();
	const chartColors = storesThemeConfig.themeConfig.currentTheme?.color?.chart || ['#0094FF', '#00CAE8', '#E98A1D', '#E8BB19', '#BD74E6'];
	return chartColors[index % chartColors.length];
};

// 初始化全局主题监听
export const initThemeListener = () => {
	const storesThemeConfig = useThemeConfig();

	// 监听主题变更
	watch(
		() => storesThemeConfig.themeConfig.currentTheme,
		() => {
			updateAllChartColors();
		},
		{ deep: true }
	);
};

// 全局 ECharts 实例管理
const chartInstances: any[] = [];

// 注册 ECharts 实例
export const registerChartInstance = (chartInstance: any) => {
	if (chartInstance && !chartInstances.includes(chartInstance)) {
		chartInstances.push(chartInstance);
	}
};

// 注册图表实例的便捷函数
export const registerChart = (chartInstance: any) => {
	if (chartInstance) {
		registerChartInstance(chartInstance);
	}
};

// 移除 ECharts 实例
export const removeChartInstance = (chartInstance: any) => {
	const index = chartInstances.indexOf(chartInstance);
	if (index > -1) {
		chartInstances.splice(index, 1);
	}
};

// 更新所有已注册的 ECharts 实例的颜色
export const updateAllChartColors = () => {
	chartInstances.forEach((chart) => {
		if (chart && chart.setOption) {
			const option = chart.getOption();
			if (option) {
				// 递归更新颜色
				updateOptionColors(option);
				chart.setOption(option, true);
			}
		}
	});
};

// 递归更新选项中的颜色
const updateOptionColors = (option: any) => {
	if (!option) return;

	// 处理 series
	if (Array.isArray(option.series)) {
		option.series.forEach((series: any, seriesIndex: number) => {
			// 处理 itemStyle
			if (series.itemStyle) {
				if (series.itemStyle.color && typeof series.itemStyle.color !== 'function') {
					series.itemStyle.color = getChartColor(seriesIndex);
				}
			}

			// 处理 lineStyle
			if (series.lineStyle) {
				if (series.lineStyle.color) {
					series.lineStyle.color = getChartColor(seriesIndex);
				}
			}

			// 处理 areaStyle
			if (series.areaStyle) {
				if (series.areaStyle.color) {
					series.areaStyle.color = getChartColor(seriesIndex);
				}
			}

			// 处理 data 中的颜色
			if (Array.isArray(series.data)) {
				series.data.forEach((item: any, index: number) => {
					if (item.itemStyle) {
						item.itemStyle.color = getChartColor(index);
					}
				});
			}

			// 处理 radar 数据
			if (series.data && Array.isArray(series.data)) {
				series.data.forEach((dataItem: any, index: number) => {
					if (dataItem.areaStyle) {
						dataItem.areaStyle.color = getChartColor(index);
					}
					if (dataItem.lineStyle) {
						dataItem.lineStyle.color = getChartColor(index);
					}
					if (dataItem.itemStyle) {
						dataItem.itemStyle.color = getChartColor(index);
					}
				});
			}
		});
	}

	// 处理 visualMap
	if (option.visualMap && option.visualMap.inRange && option.visualMap.inRange.color) {
		option.visualMap.inRange.color = [getChartColor(0), getChartColor(1), getChartColor(2)];
	}

	// 处理 gauge 图表
	if (Array.isArray(option.series)) {
		option.series.forEach((series: any) => {
			if (series.type === 'gauge' && series.axisLine && series.axisLine.lineStyle && series.axisLine.lineStyle.color) {
				series.axisLine.lineStyle.color = [
					[0.3, getChartColor(0)],
					[0.7, getChartColor(1)],
					[1, getChartColor(2)],
				];
			}
		});
	}
};
