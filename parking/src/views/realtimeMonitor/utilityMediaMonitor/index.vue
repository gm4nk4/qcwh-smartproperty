<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-scrollbar class="utility-monitor-scrollbar">
				<div class="utility-monitor-dashboard" :style="dashboardVars">
					<section class="monitor-toolbar">
						<div class="monitor-toolbar__tabs">
							<button
								v-for="item in mediaTabs"
								:key="item.value"
								type="button"
								class="monitor-toolbar__tab"
								:class="{ 'is-active': activeMediaTab === item.value }"
								@click="activeMediaTab = item.value"
							>
								{{ item.label }}
							</button>
						</div>
					</section>

					<component :is="currentTabComponent" />
				</div>
			</el-scrollbar>
		</div>
	</div>
</template>

<script setup lang="ts" name="utilityMediaMonitor">
import { computed, ref, type Component } from 'vue';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useChangeColor } from '/@/utils/theme';
import { useThemeImage } from '/@/utils/themeImages';
import ElectricityMonitorTab from './components/ElectricityMonitorTab.vue';
import WaterMonitorTab from './components/WaterMonitorTab.vue';
import GasMonitorTab from './components/GasMonitorTab.vue';
import HeatMonitorTab from './components/HeatMonitorTab.vue';

type MediaTabKey = 'electricity' | 'water' | 'gas' | 'heat';

const mediaTabs: Array<{ label: string; value: MediaTabKey }> = [
	{ label: '电力监控', value: 'electricity' },
	{ label: '用水监控', value: 'water' },
	{ label: '燃气监控', value: 'gas' },
	{ label: '供热监控', value: 'heat' },
];

const tabComponentMap: Record<MediaTabKey, Component> = {
	electricity: ElectricityMonitorTab,
	water: WaterMonitorTab,
	gas: GasMonitorTab,
	heat: HeatMonitorTab,
};

const activeMediaTab = ref<MediaTabKey>('electricity');
const currentTabComponent = computed(() => tabComponentMap[activeMediaTab.value]);

const storesThemeConfig = useThemeConfig();
const { getLightColor, hexToRgb } = useChangeColor();
const metricCardBackgroundImage = useThemeImage('metricCardBackground');

const currentTheme = computed(() => storesThemeConfig.themeConfig.currentTheme);
const primaryColor = computed(() => storesThemeConfig.themeConfig.primary || currentTheme.value?.color?.primary?.normal || '#0094FF');
const gradientStart = computed(() => currentTheme.value?.color?.gradient?.start || getLightColor(primaryColor.value, 0.12));
const gradientEnd = computed(() => currentTheme.value?.color?.gradient?.end || primaryColor.value);

const dashboardVars = computed(() => {
	const primary = primaryColor.value;
	return {
		'--dashboard-primary': primary,
		'--dashboard-primary-rgb': Array.isArray(hexToRgb(primary)) ? hexToRgb(primary).join(',') : '0, 148, 255',
		'--dashboard-gradient-start': gradientStart.value,
		'--dashboard-gradient-end': gradientEnd.value,
		'--dashboard-metric-card-image': `url("${metricCardBackgroundImage.value}")`,
	};
});
</script>

<style scoped lang="scss">
.layout-padding {
	position: relative !important;
	height: auto !important;
	min-height: 100% !important;
	overflow: visible !important;
}

.layout-padding-auto.layout-padding-view {
	padding: 0 !important;
}

.utility-monitor-scrollbar {
	height: auto;
	min-height: 100%;
	padding: 0;

	:deep(.el-scrollbar__wrap) {
		overflow-x: hidden;
	}
}

.utility-monitor-dashboard {
	height: auto;
	min-height: 100%;
	padding: 8px 0 10px;
	display: flex;
	flex-direction: column;
	gap: 14px;
	background: transparent;
}

.utility-monitor-dashboard > * {
	flex-shrink: 0;
}

.monitor-toolbar {
	display: flex;
	align-items: center;
	justify-content: flex-start;
}

.monitor-toolbar__tabs {
	display: inline-flex;
	flex-wrap: wrap;
	gap: 12px;
}

.monitor-toolbar__tab {
	width: 108px;
	height: 36px;
	padding: 0;
	border: 1px solid rgba(var(--dashboard-primary-rgb), 0.14);
	border-radius: 12px;
	background: #ffffff;
	color: var(--theme-text-primaryTitle);
	font-size: 15px;
	font-weight: 700;
	cursor: pointer;
	transition:
		transform 0.2s ease,
		box-shadow 0.2s ease,
		border-color 0.2s ease,
		color 0.2s ease;
}

.monitor-toolbar__tab:hover {
	transform: translateY(-1px);
	border-color: rgba(var(--dashboard-primary-rgb), 0.24);
	box-shadow: 0 8px 20px rgba(var(--dashboard-primary-rgb), 0.08);
}

.monitor-toolbar__tab.is-active {
	border-color: transparent;
	background: linear-gradient(135deg, var(--dashboard-gradient-start), var(--dashboard-gradient-end));
	color: #ffffff;
}

@media screen and (max-width: 768px) {
	.utility-monitor-dashboard {
		padding-bottom: 64px;
	}

	.monitor-toolbar__tabs {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.monitor-toolbar__tab {
		width: 100%;
	}
}
</style>
