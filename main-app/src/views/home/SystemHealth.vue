<template>
	<DashboardCard title="系统健康度">
		<div class="health-grid">
			<div v-for="item in healthItems" :key="item.name" class="health-item">
				<div class="health-icon" :style="{ backgroundColor: item.color + '20' }">
					<el-icon :color="item.color" :size="18">
						<component :is="item.icon" />
					</el-icon>
				</div>
				<div class="health-info">
					<div class="health-name">{{ item.name }}</div>
					<div class="health-status" :class="{ success: item.status === '正常', danger: item.status !== '正常' }">
						{{ item.status }}
					</div>
				</div>
			</div>
		</div>
	</DashboardCard>
</template>

<script setup lang="ts">
import { ref, markRaw } from 'vue';
import { Monitor, Connection, Document, DataAnalysis } from '@element-plus/icons-vue';
import DashboardCard from './DashboardCard.vue';

const healthItems = ref([
	{ name: '监控设备', icon: markRaw(Monitor), color: '#1890ff', status: '正常' },
	{ name: '门禁系统', icon: markRaw(Document), color: '#52c41a', status: '正常' },
	{ name: '停车系统', icon: markRaw(Connection), color: '#faad14', status: '异常' },
	{ name: 'IoT设备', icon: markRaw(Document), color: '#722ed1', status: '正常' },
	{ name: '服务器', icon: markRaw(Document), color: '#13c2c2', status: '正常' },
	{ name: '数据库', icon: markRaw(DataAnalysis), color: '#eb2f96', status: '正常' },
]);
</script>

<style scoped lang="scss">
.health-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 12px;

	.health-item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 12px;
		background: #fafafa;
		border-radius: 6px;

		.health-icon {
			width: 36px;
			height: 36px;
			border-radius: 8px;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.health-info {
			display: flex;
			flex-direction: column;

			.health-name {
				font-size: 12px;
				color: #666;
				margin-bottom: 4px;
			}

			.health-status {
				font-size: 11px;
				font-weight: 600;

				&.success {
					color: #52c41a;
				}

				&.danger {
					color: #ff4d4f;
				}
			}
		}
	}
}
</style>
