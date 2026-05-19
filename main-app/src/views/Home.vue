<template>
	<div class="dashboard-page">
		<div v-if="!isMicroAppRoute" class="dashboard-content">
			<div class="dashboard-header-container">
				<DashboardHeader :username="userInfos.user?.sysUser?.username" :isScreenfull="isScreenfull" @logout="logout" />
			</div>
			<div class="dashboard-grid">
				<div class="grid-item item-1">
					<SystemAlert />
				</div>
				<div class="grid-item item-2">
					<SystemHealth />
				</div>
				<div class="grid-item item-3">
					<DashboardCard title="应用入口">
						<template #header-right>
							<span class="sub-title">数据入口/数据输出/平台</span>
						</template>
						<ApplicationGrid :apps="subApps" @app-click="navigateTo" />
					</DashboardCard>
				</div>
				<div class="grid-item item-4">
					<AiInsight />
				</div>
				<div class="grid-item item-5">
					<NoticeBoard />
				</div>
				<div class="grid-item item-6">
					<WorkOrderChart />
				</div>
				<div class="grid-item item-7">
					<IncomeTrend />
				</div>
			</div>
			<div class="dashboard-footer">
				<MainFooter />
			</div>
		</div>

		<div v-else class="subapp-wrapper">
			<div id="subapp-container" class="subapp-container"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import subApps, { type SubApp } from '/@/config/apps';
import { initMicroApps } from '/@/micro/index';
import { registerGoMainAppCallback } from '/@/micro/actions';
import { NextLoading } from '/@/utils/loading';
import { useMicroApp } from '/@/stores/microApp';
import { Session } from '/@/utils/storage';
import { useThemeOrUserInfo } from '/@/hooks/useThemeOrUserInfo';

import DashboardHeader from './home/DashboardHeader.vue';
import DashboardCard from './home/DashboardCard.vue';
import ApplicationGrid from './home/ApplicationGrid.vue';
import SystemAlert from './home/SystemAlert.vue';
import SystemHealth from './home/SystemHealth.vue';
import AiInsight from './home/AiInsight.vue';
import NoticeBoard from './home/NoticeBoard.vue';
import WorkOrderChart from './home/WorkOrderChart.vue';
import IncomeTrend from './home/IncomeTrend.vue';
import MainFooter from './home/MainFooter.vue';

const router = useRouter();
const route = useRoute();
const microAppStore = useMicroApp();
const { userInfos, isScreenfull } = useThemeOrUserInfo();

const isMicroAppRoute = computed(() => {
	return subApps.some((app) => {
		const path = route.path;
		return path === app.routePath || path.startsWith(app.routePath + '/');
	});
});

const logout = () => {
	Session.remove('token');
	router.push('/login');
};

onMounted(() => {
	registerGoMainAppCallback(() => {
		microAppStore.setCurrentMicroApp(null);
		router.push('/');
	});

	initMicroApps(() => {
		NextLoading.done();
	});

	const matchedSubApp = subApps.find((app) => {
		const path = route.path;
		return path === app.routePath || path.startsWith(app.routePath + '/');
	});
	if (matchedSubApp) {
		microAppStore.setCurrentMicroApp(matchedSubApp);
	}
	NextLoading.done();
});

watch(
	() => route.path,
	(path) => {
		const matchedSubApp = subApps.find((app) => {
			return path === app.routePath || path.startsWith(app.routePath + '/');
		});
		microAppStore.setCurrentMicroApp(matchedSubApp || {});
		NextLoading.done();
	}
);

const navigateTo = (app: SubApp) => {
	microAppStore.setCurrentMicroApp(app);
	const path = app.routePath.startsWith('/') ? app.routePath : '/' + app.routePath;
	const fullPath = app.defaultPath ? path + app.defaultPath : path;
	router.push(fullPath);
};
</script>

<style scoped lang="scss">
.dashboard-page {
	height: 100vh;
	display: flex;
	flex-direction: column;
	background: #f0f2f5;

	.dashboard-content {
		flex: 1;
		overflow: auto;
		padding: 20px;
		display: flex;
		flex-direction: column;
	}

	.dashboard-header-container {
		height: 100px;
		margin-bottom: 16px;
		flex-shrink: 0;
	}

	.dashboard-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: auto auto auto;
		gap: 16px;
		flex: 1;

		.grid-item {
			&.item-1 {
				grid-column: 1 / 2;
				grid-row: 1 / 2;
			}
			&.item-2 {
				grid-column: 2 / 3;
				grid-row: 1 / 2;
			}
			&.item-3 {
				grid-column: 3 / 4;
				grid-row: 1 / 3;
			}
			&.item-4 {
				grid-column: 1 / 2;
				grid-row: 2 / 3;
			}
			&.item-5 {
				grid-column: 2 / 3;
				grid-row: 2 / 3;
			}
			&.item-6 {
				grid-column: 1 / 2;
				grid-row: 3 / 4;
			}
			&.item-7 {
				grid-column: 2 / 4;
				grid-row: 3 / 4;
			}
		}
	}

	.dashboard-footer {
		margin-top: 16px;
		flex-shrink: 0;
	}

	.subapp-wrapper {
		flex: 1;
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.subapp-container {
		flex: 1;
		background: white;
		overflow: auto;
		position: relative;
	}

	.sub-title {
		font-size: 12px;
		color: #999;
	}
}
</style>
