<template>
	<div class="layout-padding">
		<div class="layout-padding-auto">
			<div class="content_item card">
				<div class="item_header">
					<div class="header_left">
						<div class="line"></div>
						<div class="title">服务信息</div>
					</div>
				</div>
				<div class="item_content">
					<el-descriptions class="margin-top" :column="3" border>
						<el-descriptions-item>
							<template #label>
								<div class="cell-item">Redis版本</div>
							</template>
							<el-tag>
								{{ baseInfo.redis_version }}
							</el-tag>
						</el-descriptions-item>
						<el-descriptions-item>
							<template #label>
								<div class="cell-item">客户端数</div>
							</template>
							<el-tag>
								{{ baseInfo.connected_clients }}
							</el-tag>
						</el-descriptions-item>
						<el-descriptions-item>
							<template #label>
								<div class="cell-item">运行时间(天)</div>
							</template>
							<el-tag>
								{{ baseInfo.uptime_in_days }}
							</el-tag>
						</el-descriptions-item>
						<el-descriptions-item>
							<template #label>
								<div class="cell-item">使用内存</div>
							</template>
							<el-tag>
								{{ baseInfo.used_memory_human }}
							</el-tag>
						</el-descriptions-item>
						<el-descriptions-item>
							<template #label>
								<div class="cell-item">AOF是否开启</div>
							</template>
							<el-tag :type="baseInfo.aof_enabled == 0 ? 'success' : 'info'">
								{{ baseInfo.aof_enabled == 0 ? '开启' : '关闭' }}
							</el-tag>
						</el-descriptions-item>
						<el-descriptions-item>
							<template #label>
								<div class="cell-item">RDB是否成功</div>
							</template>
							<el-tag :type="baseInfo.aof_enabled == 'ok' ? 'success' : 'error'">
								{{ baseInfo.aof_enabled == 'ok' ? '成功' : '失败' }}
							</el-tag>
						</el-descriptions-item>
						<el-descriptions-item>
							<template #label>
								<div class="cell-item">操作系统</div>
							</template>
							<el-tag>
								{{ baseInfo.os }}
							</el-tag>
						</el-descriptions-item>
					</el-descriptions>
				</div>
			</div>
			<el-row :gutter="24">
				<el-col :span="12">
					<div class="content_item card">
						<div class="item_header">
							<div class="header_left">
								<div class="line"></div>
								<div class="title">命令统计</div>
							</div>
						</div>
						<div class="item_content">
							<div>
								<div class="flex h-[30vh] items-center" ref="commandChartRef"></div>
							</div>
						</div>
					</div>
					<!-- 命令统计 -->
				</el-col>
				<el-col :span="12">
					<div class="content_item card">
						<div class="item_header">
							<div class="header_left">
								<div class="line"></div>
								<div class="title">内存信息</div>
							</div>
						</div>
						<div class="item_content">
							<div>
								<div class="flex h-[30vh] items-center" ref="memoryChartRef"></div>
							</div>
						</div>
					</div>
					<!-- 内存信息 -->
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script setup lang="ts" name="cache">
import { systemCache } from '/@/api/admin/system';
import { markRaw } from 'vue';
import * as echarts from 'echarts';

const baseInfo = ref<any>({});
const commandChartRef = ref();
const memoryChartRef = ref();

const chartOptions = reactive({
	commandChartOption: {
		tooltip: {
			trigger: 'item',
			// formatter: '{b} : {d}%'
		},

		series: [
			{
				label: {
					show: true,
				},
				labelLine: {
					show: true,
				},
				type: 'pie',
				radius: '85%',
				color: [
					'#0D47A1',
					'#1565C0',
					'#1976D2',
					'#1E88E5',
					'#2196F3',
					'#42A5F5',
					'#64B5F6',
					'#90CAF9',
					'#BBDEFB',
					'#E3F2FD',
					'#CAF0F8',
					'#ADE8F4',
					'#90E0EF',
					'#48CAE4',
					'#00B4D8',
					'#0096C7',
					'#0077B6',
					'#023E8A',
					'#03045E',
					'#8ecae6',
					'#98c1d9',
					'#D9ED92',
					'#B5E48C',
					'#99D98C',
					'#76C893',
					'#52B69A',
					'#34A0A4',
					'#168AAD',
					'#1A759F',
					'#1E6091',
					'#184E77',
					'#457b9d',
				],
				data: [
					{
						value: '',
						name: '',
					},
				],
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)',
					},
				},
			},
		],
	},

	memoryChartOption: {
		tooltip: {
			formatter: '{a} <br/>{b} : {c}%',
		},
		series: [
			{
				name: 'Pressure',
				type: 'gauge',
				radius: '100%',
				detail: {
					formatter: '{value}',
				},
				data: [
					{
						value: '',
						name: '内存消耗',
					},
				],
			},
		],
	},
});

const getSystemCache = async () => {
	const res = await systemCache();

	baseInfo.value = res.data.info;
	baseInfo.value.dbSize = res.data.dbSize;

	chartOptions.commandChartOption.series[0].data = res.data.commandStats;

	chartOptions.memoryChartOption.series[0].data[0].value = (res.data.info.used_memory / 1024 / 1024).toFixed(2);
	chartOptions.memoryChartOption.series[0].detail.formatter = '{value}' + 'M';

	const commandChart = markRaw(echarts.init(commandChartRef.value));
	const memoryChart = markRaw(echarts.init(memoryChartRef.value));
	commandChart.setOption(chartOptions.commandChartOption);
	memoryChart.setOption(chartOptions.memoryChartOption);
};

getSystemCache();
</script>

<style scoped>
.el-table .el-table__cell {
	min-width: 120px;
}

.content_item {
	padding: 0 16px 16px 16px;
	min-height: 200px;
	margin-bottom: 20px;
}

.card {
	background: rgba(255, 255, 255, 0.95);
	-webkit-backdrop-filter: blur(10px);
	backdrop-filter: blur(10px);
	border-radius: 16px;
	box-shadow: 0px 20px 27px 0px rgba(0, 0, 0, 0.05);
	transition: all 0.3s ease;
}

.item_header {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	padding: 20px 0 10px 0px;
	.title {
		font-size: 16px;
		color: #1a1a1a;
	}
}

.item_content {
	padding: 20px;
	display: flex;
	flex-direction: column;
	width: 100%;
	background-color: #fbfbfc;
	border-radius: 10px;
}
</style>
