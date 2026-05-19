<template>
	<div class="overview-container">
		<!-- 岗亭实时状态 -->
		<el-card shadow="hover" class="gate-status-card">
			<template #header>
				<div class="card-header">
					<span class="card-title">岗亭实时状态</span>
					<el-button type="primary" link size="small">
						门岗监控 <el-icon><ArrowRight /></el-icon>
					</el-button>
				</div>
			</template>
			<div class="gate-grid">
				<div
					v-for="gate in gateStatusList"
					:key="gate.id"
					class="gate-item"
					:class="{ 'is-abnormal': gate.abnormalStatus === 0 }"
					:style="getGateItemStyle(gate)"
				>
					<div class="gate-header">
						<span class="status-dot" :class="getStatusDotClass(gate.direction)"></span>
						<span class="gate-name">{{ gate.name }}</span>
					</div>
					<div class="gate-body">
						<el-tag :type="getDirectionTagType(gate.direction)" size="small">
							{{ gate.direction }}
						</el-tag>
						<div class="gate-stats">
							<span class="stats-label">今日</span>
							<span class="stats-value">{{ gate.todayPass }}辆</span>
						</div>
					</div>
					<div class="gate-footer">
						<el-tag v-if="gate.abnormalStatus === 0" type="danger" size="small" effect="dark">↑杆已抬起</el-tag>
						<span v-else>&nbsp;</span>
					</div>
				</div>
			</div>
		</el-card>

		<!-- 车位实时占用情况 -->
		<el-card shadow="hover" class="parking-occupancy-card">
			<template #header>
				<div class="card-header">
					<span class="card-title">车位实时占用情况</span>
					<div class="peak-tag">
						<el-icon class="peak-icon"><WarningFilled /></el-icon>
						<span>AI预测高峰：17:00-19:00</span>
					</div>
				</div>
			</template>
			<div class="parking-list">
				<div class="parking-item" v-for="parking in parkingOccupancyList" :key="parking.id">
					<div class="parking-info">
						<span class="parking-name">{{ parking.name }}</span>
						<span class="parking-remark">地下一层</span>
					</div>
					<div class="progress-info">
						<span class="occupancy-rate" :style="{ color: parking.occupancyRate >= 60 ? '#faad14' : '#52c41a' }"> {{ parking.occupancyRate }}% </span>
						<span class="occupancy-label">{{ parking.usedSpaces }}/{{ parking.totalSpaces }}</span>
					</div>
					<div class="parking-progress">
						<div class="progress-bar-wrapper">
							<div
								class="progress-bar-bg"
								:style="getProgressStyle(parking.occupancyRate)"
							>
								<div
									class="progress-bar-fill"
									:style="{ width: parking.occupancyRate + '%' }"
								></div>
							</div>
						</div>
					</div>
					<div class="parking-info">
						<div class="parking-stats">
							<span class="stat-text">月租: {{ parking.totalSpaces }} 临时: {{ parking.usedSpaces }}</span>
							<span class="stat-text">空闲: {{ parking.availableSpaces }}</span>
						</div>
					</div>
				</div>
			</div>
		</el-card>

		<!-- 趋势图表 - 三列布局 -->
		<el-row :gutter="16" class="chart-row">
			<!-- 车位绑定率 -->
			<el-col :span="8">
				<el-card shadow="hover" class="bind-rate-card">
					<template #header>
						<span class="title">车位绑定率</span>
					</template>
					<div class="bind-rate-content">
						<!-- 统计数据 -->
						<div class="bind-rate-stats">
							<div class="stat-item">
								<span class="stat-value">{{ bindRateStats.totalSpaces }}</span>
								<span class="stat-label">总车位</span>
							</div>
							<div class="stat-item">
								<span class="stat-value">{{ bindRateStats.bindSpaces }}</span>
								<span class="stat-label">已绑定车牌</span>
							</div>
							<div class="stat-item">
								<span class="stat-value">{{ bindRateStats.unBindSpaces }}</span>
								<span class="stat-label">未绑定</span>
							</div>
						</div>
						<!-- 各停车场绑定情况 -->
						<div class="bind-rate-list">
							<div class="bind-rate-item" v-for="item in bindRateList" :key="item.id">
								<div class="bind-rate-header">
									<span class="parking-name">{{ item.name }}</span>
									<span class="bind-count">{{ item.bindCount }}/{{ item.totalCount }}</span>
								</div>
								<div class="bind-rate-progress">
									<div class="progress-bar">
										<div class="progress-fill" :style="{ width: item.rate + '%' }"></div>
									</div>
									<span class="progress-rate">{{ item.rate }}%</span>
								</div>
							</div>
						</div>
					</div>
				</el-card>
			</el-col>
			<!-- 今日车流趋势 -->
			<el-col :span="8">
				<el-card shadow="hover" class="trend-chart-card">
					<template #header>
						<span class="title">今日车流趋势</span>
					</template>
					<div class="trend-chart-container" ref="trendChartRef"></div>
				</el-card>
			</el-col>
			<!-- 月度收入 -->
			<el-col :span="8">
				<el-card shadow="hover" class="income-chart-card">
					<template #header>
						<span class="title">月度收入</span>
					</template>
					<div class="income-chart-container" ref="incomeChartRef"></div>
				</el-card>
			</el-col>
		</el-row>

		<!-- AI 智能评价 -->
		<el-card shadow="hover" class="ai-evaluation-card">
			<div class="ai-evaluation-content">
				<!-- 头部 -->
				<div class="ai-header">
					<div class="ai-title-area">
						<div class="ai-icon-wrapper">
							<svg class="ai-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#7C3AED" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
								<path d="M2 17L12 22L22 17" stroke="#7C3AED" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
								<path d="M2 12L12 17L22 12" stroke="#7C3AED" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
						</div>
						<div class="ai-text">
							<h3 class="ai-main-title">AI 智能评价</h3>
							<p class="ai-subtitle">基于车位使用率、车位绑定、车流量等综合分析</p>
						</div>
					</div>
					<span class="update-time">2026-03-20 更新</span>
				</div>

				<!-- 三个卡片区域 -->
				<div class="evaluation-cards">
					<!-- 车库使用率评价 -->
					<div class="eval-card usage-card">
						<div class="card-header-row">
							<div class="card-icon orange-icon">
								<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<circle cx="12" cy="12" r="10" stroke="#F97316" stroke-width="2" />
									<path d="M12 6V12L15 15" stroke="#F97316" stroke-width="2" stroke-linecap="round" />
								</svg>
							</div>
							<span class="card-label">车库使用率评价</span>
						</div>
						<p class="card-desc">
							当前总占用率为
							<span class="highlight-num orange">74.4%</span
							>，处于中高水平。A区和C区占用率偏高（≥80%），建议在高峰17:00-19:00期间引导车辆至D区和地库停车场。D区使用率仅
							<span class="highlight-num orange-light">52.5%</span>，存在较大优化空间。
						</p>
					</div>

					<!-- 车位绑定评价 -->
					<div class="eval-card binding-card">
						<div class="card-header-row">
							<div class="card-icon blue-icon">
								<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M9 11L12 14L22 4" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									<path
										d="M21 12V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H16"
										stroke="#3B82F6"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</div>
							<span class="card-label">车位绑定评价</span>
						</div>
						<p class="card-desc">
							整体车位绑定率为 <span class="highlight-num blue">37.5%</span>，偏低。B区停车场景定率仅
							<span class="highlight-num blue-light">33.3%</span
							>，建议加大月租车位推广力度、提升企业用户绑定率以稳定收入来源。月租车车位利用率有提升空间。
						</p>
					</div>

					<!-- 优化建议 -->
					<div class="eval-card suggestion-card">
						<div class="card-header-row">
							<div class="card-icon yellow-icon">
								<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M9 18H15M10 21H14M12 3C8.68629 3 6 5.68629 6 9C6 13 3 15 3 15H21C21 15 18 13 18 9C18 5.68629 15.3137 3 12 3Z"
										stroke="#EAB308"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</div>
							<span class="card-label">优化建议</span>
						</div>
						<p class="card-desc suggestion-list">
							1. 建议将D区部分月租车位调整为临时车位以提升利用率；2. 可在高峰时段设置动态计费引导分流；3. 建议对未绑定车位开展企业客户专属营销活动。
						</p>
					</div>
				</div>
			</div>
		</el-card>

		<!-- 实时通行记录 -->
		<el-row :gutter="16" class="table-row">
			<el-col :span="24">
				<el-card shadow="hover" class="table-card">
					<template #header>
						<div class="card-header">
							<span class="title">实时通行记录</span>
							<el-button type="primary" link size="small">
								查看更多 <el-icon><ArrowRight /></el-icon>
							</el-button>
						</div>
					</template>
					<div class="table-container">
						<ConfigurableTableWithForm
							:table-config="passTableConfig"
							:show-column-settings="false"
							:show-search-toggle="false"
							:show-refresh="false"
							:show-query-form="false"
							:show-export="false"
							showPagination="false"
						>
							<!-- 类型列插槽 -->
							<template #typeSlot="{ row }">
								<el-tag :type="row.type === '月租' ? 'primary' : row.type === '临时' ? 'warning' : 'success'" size="small">
									{{ row.type }}
								</el-tag>
							</template>

							<!-- 归属列插槽 -->
							<template #ownerSlot="{ row }">
								<div class="owner-cell">
									<el-icon
										:class="{
											'owner-icon-enterprise': row.ownerType === '企业',
											'owner-icon-owner': row.ownerType === '业主',
											'owner-icon-visitor': row.ownerType === '访客',
										}"
									>
										<OfficeBuilding v-if="row.ownerType === '企业'" />
										<User v-else-if="row.ownerType === '业主'" />
										<UserFilled v-else />
									</el-icon>
									<span class="owner-name">{{ row.owner }}</span>
								</div>
							</template>

							<!-- 抓拍列插槽 -->
							<template #imgSlot="{ row }">
								<el-image
									v-if="row.entryCapture"
									:src="row.entryCapture"
									:preview-src-list="[row.entryCapture]"
									fit="cover"
									class="capture-image"
									preview-teleported
								/>
								<span v-else class="no-capture">-</span>
							</template>

							<!-- 状态列插槽 -->
							<template #statusSlot="{ row }">
								<el-tag :type="row.status === '在场' ? 'success' : 'info'" size="small">
									{{ row.status }}
								</el-tag>
							</template>
						</ConfigurableTableWithForm>
					</div>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts" name="overviewIndex">
import { ArrowRight, WarningFilled, OfficeBuilding, User, UserFilled } from '@element-plus/icons-vue';
import * as echarts from 'echarts';
import { ConfigurableTableWithForm, type TableColumn, type TableConfig } from '@zhqc-smart/table';
import { useThemeConfig } from '/@/stores/themeConfig';
import { storeToRefs } from 'pinia';

const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);

const getGateItemStyle = (gate: any) => {
	const skin = themeConfig.value.skin || 'light-blue';
	const bgFileName = gate.abnormalStatus === 0 ? 'alarm-summary-card-red.png' : 'metric-card-background.png';
	const path = gate.abnormalStatus === 0 ? `/src/assets/images/${bgFileName}` : `/src/assets/images/theme/${skin}/${bgFileName}`;
	return {
		'--gate-item-bg-image': `url("${new URL(path, import.meta.url).href}")`,
	};
};

const hexToRgb = (hex: string) => {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [64, 158, 255];
};

const getProgressStyle = (occupancyRate: number) => {
	const accent = occupancyRate >= 60 ? '#faad14' : '#52c41a';
	const rgb = hexToRgb(accent);
	return {
		'--progress-accent': accent,
		'--progress-accent-rgb': rgb.join(','),
	};
};

// ==================== 岗亭状态判断方法 ====================
const getStatusDotClass = (direction: string) => {
	if (direction === '可进场' || direction === '可进出') {
		return 'online';
	}
	if (direction === '可出场') {
		return 'offline';
	}
	return 'offline';
};

const getDirectionTagType = (direction: string) => {
	if (direction === '可进场') {
		return '';
	}
	if (direction === '可出场') {
		return 'info';
	}
	if (direction === '可进出') {
		return 'success';
	}
	return 'info';
};

// ==================== 岗亭状态 Mock 数据 ====================
const gateStatusList = ref([
	{ id: 1, name: '东门入口岗亭', direction: '可进场', todayPass: 156, isOnline: true },
	{ id: 2, name: '东门出口岗亭', direction: '可出场', todayPass: 132, isOnline: true },
	{ id: 3, name: '西门入口岗亭', direction: '可进场', todayPass: 98, isOnline: true },
	{ id: 4, name: '地下车库入口', direction: '可进场', todayPass: 210, isOnline: true },
	{ id: 5, name: '地下车库出口', direction: '可出场', todayPass: 195, isOnline: false, abnormalStatus: 0 },
	{ id: 6, name: '南门双向岗亭', direction: '可进出', todayPass: 168, isOnline: true },
]);

// ==================== 车位占用 Mock 数据 ====================
const parkingOccupancyList = ref([
	{ id: 1, name: '智慧停车场A', totalSpaces: 200, usedSpaces: 156, availableSpaces: 44, occupancyRate: 78 },
	{ id: 2, name: '智慧停车场B', totalSpaces: 150, usedSpaces: 135, availableSpaces: 15, occupancyRate: 90 },
	{ id: 3, name: '智慧停车场C', totalSpaces: 300, usedSpaces: 180, availableSpaces: 120, occupancyRate: 60 },
	{ id: 4, name: '地下停车场D', totalSpaces: 250, usedSpaces: 220, availableSpaces: 30, occupancyRate: 48 },
]);

// ==================== 车位绑定率 Mock 数据 ====================
const bindRateStats = ref({
	totalSpaces: 900,
	bindSpaces: 755,
	unBindSpaces: 145,
	rate: 83.9,
});

const bindRateList = ref([
	{ id: 1, name: '智慧停车场A', bindCount: 180, totalCount: 200, rate: 90 },
	{ id: 2, name: '智慧停车场B', bindCount: 120, totalCount: 150, rate: 80 },
	{ id: 3, name: '智慧停车场C', bindCount: 280, totalCount: 300, rate: 93 },
	{ id: 4, name: '地下停车场D', bindCount: 175, totalCount: 250, rate: 70 },
]);

// ==================== 表格数据 ====================
const passTableColumns: TableColumn[] = [
	{ prop: 'plateNumber', label: '车牌号', align: 'center' },
	{ prop: 'type', label: '类型', align: 'center', slot: 'typeSlot' },
	{ prop: 'owner', label: '归属', align: 'center', slot: 'ownerSlot' },
	{ prop: 'entryBooth', label: '进场岗亭', align: 'center' },
	{ prop: 'entryTime', label: '入场时间', align: 'center' },
	{ prop: 'entryCapture', label: '抓拍', align: 'center', slot: 'imgSlot' },
	{ prop: 'exitBooth', label: '出场岗亭', align: 'center' },
	{ prop: 'exitTime', label: '出场时间', align: 'center' },
	{ prop: 'fee', label: '费用', align: 'center' },
	{ prop: 'status', label: '状态', align: 'center', slot: 'statusSlot' },
];

const passTableData = ref([
	{
		id: 1,
		plateNumber: '京A·88888',
		type: '月租',
		ownerType: '企业',
		owner: '华为科技有限公司',
		entryBooth: '东门入口岗亭',
		entryTime: '2026-03-20 08:30',
		entryCapture: '',
		exitBooth: '-',
		exitTime: '-',
		fee: 0,
		status: '在场',
	},
	{
		id: 2,
		plateNumber: '京B·66666',
		type: '临时',
		ownerType: '访客',
		owner: '张先生',
		entryBooth: '西门入口岗亭',
		entryTime: '2026-03-20 09:15',
		entryCapture: 'https://picsum.photos/seed/overview1/100/60',
		exitBooth: '西门出口岗亭',
		exitTime: '2026-03-20 17:30',
		fee: '¥15',
		status: '已出场',
	},
	{
		id: 3,
		plateNumber: '沪C·12345',
		type: '月租',
		ownerType: '业主',
		owner: '李女士',
		entryBooth: '东门入口岗亭',
		entryTime: '2026-03-20 07:45',
		entryCapture: 'https://picsum.photos/seed/overview2/100/60',
		exitBooth: '地下车库出口',
		exitTime: '2026-03-20 18:20',
		fee: 0,
		status: '已出场',
	},
	{
		id: 4,
		plateNumber: '浙D·55555',
		type: '临时',
		ownerType: '访客',
		owner: '王先生',
		entryBooth: '地下车库入口',
		entryTime: '2026-03-20 10:30',
		entryCapture: '',
		exitBooth: '-',
		exitTime: '-',
		fee: '-',
		status: '在场',
	},
	{
		id: 5,
		plateNumber: '京E·77777',
		type: '访客',
		ownerType: '企业',
		owner: '腾讯科技',
		entryBooth: '东门入口岗亭',
		entryTime: '2026-03-20 11:00',
		entryCapture: 'https://picsum.photos/seed/overview3/100/60',
		exitBooth: '东门出口岗亭',
		exitTime: '2026-03-20 14:30',
		fee: '¥8',
		status: '已出场',
	},
	{
		id: 6,
		plateNumber: '京F·99999',
		type: '月租',
		ownerType: '业主',
		owner: '陈先生',
		entryBooth: '西门入口岗亭',
		entryTime: '2026-03-20 06:30',
		entryCapture: 'https://picsum.photos/seed/overview4/100/60',
		exitBooth: '-',
		exitTime: '-',
		fee: 0,
		status: '在场',
	},
]);

const passTableConfig = computed<TableConfig>(() => ({
	columns: passTableColumns,
	data: passTableData.value,
	selectionType: 'none',
	showIndex: false,
	loading: false,
	pagination: false,
	showOperations: false,
	height: 300,
}));

// ==================== 图表相关 ====================
const trendChartRef = ref<HTMLElement>();
const incomeChartRef = ref<HTMLElement>();
let trendChartInstance: echarts.ECharts | null = null;
let incomeChartInstance: echarts.ECharts | null = null;

const initTrendChart = () => {
	if (!trendChartRef.value) return;

	trendChartInstance = echarts.init(trendChartRef.value);

	const hours = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
	const entryData = [5, 3, 2, 8, 45, 120, 156, 132, 145, 178, 120, 45];
	const exitData = [3, 2, 1, 6, 35, 110, 142, 128, 135, 168, 115, 38];

	const option = {
		tooltip: {
			trigger: 'axis',
			axisPointer: { type: 'shadow' },
		},
		legend: {
			data: ['入场', '出场'],
			bottom: 0,
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '15%',
			top: '10%',
			containLabel: true,
		},
		xAxis: {
			type: 'category',
			data: hours,
			axisLine: { lineStyle: { color: '#e0e0e0' } },
			axisLabel: { color: '#606266' },
		},
		yAxis: {
			type: 'value',
			axisLine: { show: false },
			axisTick: { show: false },
			axisLabel: { color: '#909399' },
			splitLine: { lineStyle: { color: '#f0f0f0', type: 'dashed' } },
		},
		series: [
			{
				name: '入场',
				type: 'line',
				smooth: true,
				data: entryData,
				itemStyle: { color: '#409EFF' },
				areaStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{ offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
						{ offset: 1, color: 'rgba(64, 158, 255, 0.05)' },
					]),
				},
			},
			{
				name: '出场',
				type: 'line',
				smooth: true,
				data: exitData,
				itemStyle: { color: '#67C23A' },
				areaStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{ offset: 0, color: 'rgba(103, 194, 58, 0.3)' },
						{ offset: 1, color: 'rgba(103, 194, 58, 0.05)' },
					]),
				},
			},
		],
	};

	trendChartInstance.setOption(option);
};

const initIncomeChart = () => {
	if (!incomeChartRef.value) return;

	incomeChartInstance = echarts.init(incomeChartRef.value);

	const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
	const monthlyData = [8.5, 9.2, 8.8, 10.5, 11.2, 12.0];
	const tempData = [3.2, 3.8, 3.5, 4.2, 4.5, 4.8];
	const visitorData = [1.5, 1.8, 1.6, 2.1, 2.3, 2.5];

	const createBarGradient = (startColor: string, endColor: string) =>
		new echarts.graphic.LinearGradient(0, 0, 0, 1, [
			{ offset: 0, color: startColor },
			{ offset: 1, color: endColor },
		]);

	const alphaColor = (color: string, alpha: number) => {
		const hex = color.replace('#', '');
		const r = parseInt(hex.substring(0, 2), 16);
		const g = parseInt(hex.substring(2, 4), 16);
		const b = parseInt(hex.substring(4, 6), 16);
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	};

	const createBarItemStyle = (startColor: string, endColor: string) => ({
		color: createBarGradient(startColor, endColor),
		borderRadius: [15, 15, 0, 0],
		borderColor: createBarGradient(alphaColor(startColor, 0.32), alphaColor(endColor, 0.16)),
		borderWidth: 6,
	});

	const colorConfig = {
		monthly: { start: '#409EFF', end: '#a0cfff' },
		temp: { start: '#67C23A', end: '#b3e19d' },
		visitor: { start: '#E6A23C', end: '#f3d19e' },
	};

	const option = {
		grid: {
			left: 64,
			right: 18,
			top: 44,
			bottom: 42,
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
			backgroundColor: 'rgba(17, 24, 39, 0.88)',
			borderWidth: 0,
			textStyle: {
				color: '#ffffff',
			},
			formatter: (params: any[]) => {
				if (!Array.isArray(params) || !params.length) return '';
				const lines = params.map((item) => `${item.marker}${item.seriesName}: ${Number(item.value).toFixed(1)}万元`);
				return `${params[0].axisValue}<br/>${lines.join('<br/>')}`;
			},
		},
		legend: {
			data: ['月租', '临时', '访客'],
			bottom: 0,
			icon: 'circle',
			itemWidth: 8,
			itemHeight: 8,
			textStyle: {
				color: '#667085',
				fontSize: 12,
			},
		},
		xAxis: {
			type: 'category',
			data: months,
			axisLine: {
				lineStyle: {
					color: 'rgba(64, 158, 255, 0.18)',
				},
			},
			axisTick: {
				show: false,
			},
			axisLabel: {
				color: '#667085',
				margin: 12,
				fontWeight: 600,
			},
		},
		yAxis: {
			type: 'value',
			name: '收入(万元)',
			nameTextStyle: {
				color: '#667085',
				padding: [0, 0, 8, 0],
			},
			axisLine: {
				show: false,
			},
			axisTick: {
				show: false,
			},
			axisLabel: {
				color: '#667085',
			},
			splitLine: {
				lineStyle: {
					color: 'rgba(206, 214, 229, 0.72)',
					type: 'dashed',
				},
			},
		},
		series: [
			{
				name: '月租',
				type: 'bar',
				data: monthlyData.map((value) => ({
					value,
					itemStyle: createBarItemStyle(colorConfig.monthly.start, colorConfig.monthly.end),
				})),
				barWidth: 20,
				label: {
					show: true,
					position: 'top',
					color: '#5b6577',
					fontSize: 11,
					fontWeight: 700,
					distance: 6,
					formatter: ({ value }: { value: number }) => `${value}`,
				},
				labelLayout: {
					hideOverlap: true,
					moveOverlap: 'shiftY',
				},
			},
			{
				name: '临时',
				type: 'bar',
				data: tempData.map((value) => ({
					value,
					itemStyle: createBarItemStyle(colorConfig.temp.start, colorConfig.temp.end),
				})),
				barWidth: 20,
				label: {
					show: true,
					position: 'top',
					color: '#5b6577',
					fontSize: 11,
					fontWeight: 700,
					distance: 6,
					formatter: ({ value }: { value: number }) => `${value}`,
				},
				labelLayout: {
					hideOverlap: true,
					moveOverlap: 'shiftY',
				},
			},
			{
				name: '访客',
				type: 'bar',
				data: visitorData.map((value) => ({
					value,
					itemStyle: createBarItemStyle(colorConfig.visitor.start, colorConfig.visitor.end),
				})),
				barWidth: 20,
				label: {
					show: true,
					position: 'top',
					color: '#5b6577',
					fontSize: 11,
					fontWeight: 700,
					distance: 6,
					formatter: ({ value }: { value: number }) => `${value}`,
				},
				labelLayout: {
					hideOverlap: true,
					moveOverlap: 'shiftY',
				},
			},
		],
	};

	incomeChartInstance.setOption(option);
};

const resizeCharts = () => {
	trendChartInstance?.resize();
	incomeChartInstance?.resize();
};

onMounted(() => {
	initTrendChart();
	initIncomeChart();
	window.addEventListener('resize', resizeCharts);
});

onUnmounted(() => {
	window.removeEventListener('resize', resizeCharts);
	trendChartInstance?.dispose();
	incomeChartInstance?.dispose();
});
</script>

<style scoped lang="scss">
.overview-container {
	padding: 16px;
}

// 岗亭状态样式
.gate-status-card {
	margin-bottom: 16px;

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.card-title {
		font-size: 15px;
		font-weight: 500;
		color: #303133;
	}

	.gate-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
	}

	.gate-item {
		width: calc(25% - 12px);
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 12px 16px;
		background-color: transparent;
		background-image: var(--gate-item-bg-image);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		border-radius: 8px;

		&.is-abnormal {
			border: 1px solid #f56c6c;
		}

		.gate-header {
			display: flex;
			align-items: center;

			.status-dot {
				width: 8px;
				height: 8px;
				border-radius: 50%;
				margin-right: 8px;

				&.online {
					background: #67c23a;
					box-shadow: 0 0 6px #67c23a;
				}

				&.offline {
					background: #f56c6c;
				}
			}

			.gate-name {
				font-size: 14px;
				font-weight: 500;
				color: #303133;
			}
		}

		.gate-body {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.gate-stats {
				display: flex;
				align-items: center;
				gap: 4px;

				.stats-label {
					font-size: 12px;
					color: #909399;
				}

				.stats-value {
					font-size: 14px;
					font-weight: 500;
					color: #409eff;
					padding-top: 4px;
				}
			}
		}

		.gate-footer {
			min-height: 24px;
		}
	}
}

// 车位占用样式
.parking-occupancy-card {
	margin-bottom: 16px;

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.card-title {
		font-size: 15px;
		font-weight: 500;
		color: #303133;
	}

	.peak-tag {
		display: flex;
		align-items: center;
		padding: 4px 8px;
		border-radius: 4px;
		border: 1px solid #ee4444;
		background-color: rgba(238, 68, 68, 0.1);
		color: #ee4444;
		font-size: 12px;

		.peak-icon {
			display: inline-flex;
			align-items: center;
		}
	}

	.parking-list {
		display: flex;
		gap: 12px;
	}

	.parking-item {
		flex: 1;
		min-width: 200px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 16px;
		background: linear-gradient(180deg, #f0f7ff 0%, #e6f1ff 100%);
		border: 1px solid rgba(64, 158, 255, 0.24);
		border-radius: 12px;

		.parking-info {
			display: flex;
			justify-content: space-between;
			gap: 8px;
			.parking-name {
				font-size: 14px;
				font-weight: 500;
				color: #303133;
				margin-bottom: 8px;
				display: block;
			}
			.parking-remark {
				font-size: 12px;
				color: #909399;
			}

			.parking-stats {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				gap: 8px;

				.stat-text {
					font-size: 12px;
					color: #909399;
				}
			}
		}

		.progress-info {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.occupancy-rate {
				font-size: 18px;
				font-weight: 600;
			}

			.occupancy-label {
				font-size: 12px;
				color: #909399;
			}
		}

		.parking-progress {
			.progress-bar-wrapper {
				.progress-bar-bg {
					position: relative;
					width: 100%;
					height: 8px;
					border-radius: 999px;
					background: rgba(var(--progress-accent-rgb), 0.12);
					overflow: hidden;

					.progress-bar-fill {
						display: block;
						height: 100%;
						border-radius: inherit;
						background: linear-gradient(90deg, rgba(var(--progress-accent-rgb), 0.16), var(--progress-accent));
						box-shadow: 0 4px 12px rgba(var(--progress-accent-rgb), 0.28);
						transition: width 0.3s;
					}
				}
			}
		}
	}
}

// 趋势图表样式
.chart-row {
	margin-bottom: 16px;

	.el-col {
		display: flex;
	}

	.el-card {
		width: 100%;
	}

	.title {
		font-size: 14px;
		font-weight: 500;
		color: #303133;
	}
}

// 车位绑定率样式
.bind-rate-card {
	height: 350px;

	:deep(.el-card__body) {
		padding: 16px;
		height: calc(100% - 56px);
	}

	.bind-rate-content {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.bind-rate-stats {
		flex-shrink: 0;
		display: flex;
		justify-content: space-between;
		padding: 12px 0;
		margin-bottom: 12px;
		border-bottom: 1px solid #ebeef5;

		.stat-item {
			display: flex;
			flex-direction: column;
			align-items: center;

			.stat-value {
				font-size: 18px;
				font-weight: 600;
				color: #303133;
			}

			.stat-label {
				font-size: 12px;
				color: #909399;
				margin-top: 4px;
			}
		}
	}

	.bind-rate-list {
		flex: 1;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding-right: 10px;
	}

	.bind-rate-item {
		.bind-rate-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 4px;

			.parking-name {
				font-size: 13px;
				color: #303133;
			}

			.bind-count {
				font-size: 13px;
				color: #606266;
			}
		}

		.bind-rate-progress {
			display: flex;
			align-items: center;
			gap: 12px;

			.progress-bar {
				flex: 1;
				height: 6px;
				background: #e4e7ed;
				border-radius: 3px;
				overflow: hidden;

				.progress-fill {
					height: 100%;
					background: #409eff;
					border-radius: 3px;
				}
			}

			.progress-rate {
				font-size: 13px;
				font-weight: 500;
				color: #409eff;
				min-width: 42px;
				text-align: right;
			}
		}
	}
}

.trend-chart-card {
	height: 350px;

	:deep(.el-card__body) {
		padding: 0 16px 16px;
		height: calc(100% - 56px);
	}

	.trend-chart-container {
		width: 100%;
		height: 100%;
	}
}

.income-chart-card {
	height: 350px;

	:deep(.el-card__body) {
		padding: 0 16px 16px;
		height: calc(100% - 56px);
	}

	.income-chart-container {
		width: 100%;
		height: 100%;
	}
}

// AI 智能评价样式
.ai-evaluation-card {
	margin-bottom: 16px;

	:deep(.el-card__body) {
		padding: 0;
	}
}

.ai-evaluation-content {
	background: #f8faff;
	border-radius: 12px;
	padding: 24px;

	.ai-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 20px;

		.ai-title-area {
			display: flex;
			align-items: center;
			gap: 14px;
		}

		.ai-icon-wrapper {
			width: 44px;
			height: 44px;
			background: linear-gradient(135deg, #ede9fe, #ddd6fe);
			border-radius: 10px;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
		}

		.ai-icon {
			width: 26px;
			height: 26px;
		}

		.ai-text {
			.ai-main-title {
				margin: 0 0 4px 0;
				font-size: 17px;
				font-weight: 600;
				color: #1f2937;
			}

			.ai-subtitle {
				margin: 0;
				font-size: 13px;
				color: #9ca3af;
			}
		}

		.update-time {
			font-size: 13px;
			color: #7c3aed;
			font-weight: 500;
			flex-shrink: 0;
		}
	}

	.evaluation-cards {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
	}

	.eval-card {
		background: #fff;
		border-radius: 10px;
		padding: 18px 20px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

		.card-header-row {
			display: flex;
			align-items: center;
			gap: 10px;
			margin-bottom: 12px;
		}

		.card-icon {
			width: 28px;
			height: 28px;
			border-radius: 6px;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;

			svg {
				width: 16px;
				height: 16px;
			}
		}

		.orange-icon {
			background: #fff7ed;
		}

		.blue-icon {
			background: #eff6ff;
		}

		.yellow-icon {
			background: #fefce8;
		}

		.card-label {
			font-size: 14px;
			font-weight: 600;
			color: #374151;
		}

		.card-desc {
			margin: 0;
			font-size: 13px;
			line-height: 1.75;
			color: #6b7280;

			.highlight-num {
				font-weight: 600;
				font-size: 14px;
			}

			.orange {
				color: #ea580c;
			}

			.orange-light {
				color: #f97316;
			}

			.blue {
				color: #2563eb;
			}

			.blue-light {
				color: #3b82f6;
			}
		}

		.suggestion-list {
			line-height: 1.85;
		}
	}
}

// 表格样式
.table-row {
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.title {
			font-size: 15px;
			font-weight: 500;
			color: #303133;
		}
	}

	.table-card {
		:deep(.el-card__body) {
			padding: 0 16px 16px;
		}
	}
	.table-container {
		height: 400px;
		overflow-y: auto;
	}
	:deep(.form-container) {
		margin-bottom: 0px !important;
	}

	// 归属列样式
	.owner-cell {
		display: flex;
		align-items: center;
		gap: 4px;

		.owner-icon-enterprise {
			color: #3b82f6;
		}

		.owner-icon-owner {
			color: #52c41a;
		}

		.owner-icon-visitor {
			color: #722ed1;
		}

		.owner-name {
			font-size: 12px;
			color: #606266;
		}
	}

	// 抓拍列样式
	.capture-image {
		width: 80px;
		height: 40px;
		border-radius: 4px;
		cursor: pointer;
		margin-top: 4px;
	}

	.no-capture {
		color: #c0c4cc;
	}
}
</style>
