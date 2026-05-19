<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-scrollbar class="itemized-monitor-scrollbar">
				<div class="itemized-monitor-dashboard" :style="dashboardVars">
					<section class="monitor-toolbar">
						<div class="monitor-toolbar__tabs">
							<button
								v-for="item in systemTabs"
								:key="item.value"
								type="button"
								class="monitor-toolbar__tab"
								:class="{ 'is-active': activeSystemTab === item.value }"
								@click="activeSystemTab = item.value"
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

<script setup lang="ts" name="itemizedSystemMonitor">
import { computed, ref, type Component } from 'vue';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useChangeColor } from '/@/utils/theme';
import { useThemeImage } from '/@/utils/themeImages';
import CoolingSystemTab from './components/CoolingSystemTab.vue';
import ElevatorSystemTab from './components/ElevatorSystemTab.vue';
import LightingSystemTab from './components/LightingSystemTab.vue';
import PowerSystemTab from './components/PowerSystemTab.vue';

type SystemTabKey = 'cooling' | 'lighting' | 'elevator' | 'power';

const systemTabs: Array<{ label: string; value: SystemTabKey }> = [
	{ label: '制冷系统', value: 'cooling' },
	{ label: '照明系统', value: 'lighting' },
	{ label: '电梯系统', value: 'elevator' },
	{ label: '动力系统', value: 'power' },
];

const tabComponentMap: Record<SystemTabKey, Component> = {
	cooling: CoolingSystemTab,
	lighting: LightingSystemTab,
	elevator: ElevatorSystemTab,
	power: PowerSystemTab,
};

const activeSystemTab = ref<SystemTabKey>('cooling');
const currentTabComponent = computed(() => tabComponentMap[activeSystemTab.value]);

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

.itemized-monitor-scrollbar {
	height: auto;
	min-height: 100%;
	padding: 0;

	:deep(.el-scrollbar__wrap) {
		overflow-x: hidden;
	}
}

.itemized-monitor-dashboard {
	height: auto;
	min-height: 100%;
	padding: 8px 0 10px;
	display: flex;
	flex-direction: column;
	gap: 14px;
	background: transparent;
}

.itemized-monitor-dashboard > * {
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
	.itemized-monitor-dashboard {
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
